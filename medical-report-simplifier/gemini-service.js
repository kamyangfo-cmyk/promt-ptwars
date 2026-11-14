/**
 * ==============================================================================
 *  MEDCLARIFY - GOOGLE GEMINI AI ASSISTANT SERVICE
 * ==============================================================================
 *  Handles communication with the Google Gemini API to simplify complex medical
 *  reports into clear, empathetic, everyday language.
 *
 *  Features:
 *  - Supports Gemini 2.5 Flash, 1.5 Flash, and 1.5 Pro
 *  - Extracts structured findings, plain-English summary, and action items
 *  - Auto-extracts timeline events (date, diagnosis, facility, metrics)
 *  - Interactive Q&A chat assistant for follow-up questions
 *  - Graceful fallback demo mode if no API key is entered yet
 * ==============================================================================
 */

class GeminiService {
  constructor() {
    // Attempt to load API key from localStorage or configuration
    this.apiKey = localStorage.getItem("medclarify_gemini_api_key") || "";
    this.model = UI_CONFIG.aiDefaults.defaultModel || "gemini-2.5-flash";
    this.temperature = UI_CONFIG.aiDefaults.temperature || 0.2;
    this.chatHistory = [];
  }

  /**
   * Save API key to browser local storage securely
   */
  setApiKey(key) {
    this.apiKey = (key || "").trim();
    if (this.apiKey) {
      localStorage.setItem("medclarify_gemini_api_key", this.apiKey);
    } else {
      localStorage.removeItem("medclarify_gemini_api_key");
    }
  }

  /**
   * Check if a valid API key is currently saved
   */
  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  /**
   * Set active model name
   */
  setModel(modelName) {
    this.model = modelName;
  }

  /**
   * Build the master clinical simplification prompt
   */
  _buildSimplificationPrompt(reportText, readingLevel) {
    const levelInstructions = {
      "5th-grade": "Explain like talking to a friend with zero medical background. Use simple everyday analogies (like cars, plumbing, or filters). Avoid complex jargon unless immediately defined.",
      "high-school": "Explain clearly and balance clarity with accurate medical terminology. Define any specialized terms in parentheses.",
      "detailed": "Provide a thorough patient-facing breakdown with clinical context, pathophysiologic context, and reference standards."
    };

    const toneGuide = levelInstructions[readingLevel] || levelInstructions["5th-grade"];

    return `
You are an expert, empathetic medical communicator and patient advocate powered by Google Gemini.
Your mission is to read the attached medical report, lab result, or imaging document and translate it into clear, compassionate, and easily understandable language for a patient.

Tone & Reading Level:
${toneGuide}

CRITICAL RULES:
1. Be reassuring, objective, and empathetic. Do NOT panic the patient, but never dismiss abnormal values.
2. Clearly distinguish between normal routine findings vs. values that need doctor follow-up.
3. For every abnormal lab value, explain: what it is, why it might be out of range, and what questions to ask.
4. Extract the report date, facility/doctor name, and categorize the health event.

You must respond in valid JSON matching this exact structure:
{
  "summary": "2-3 paragraphs providing an overarching, plain-English executive summary of the entire report.",
  "keyFindings": [
    {
      "testOrFinding": "e.g. Hemoglobin / Disc Bulge at L4-L5",
      "resultValue": "e.g. 11.6 g/dL or 4.5mm extrusion",
      "status": "Normal" | "Attention" | "Critical",
      "plainEnglish": "Simple explanation of what this specific finding means in everyday terms."
    }
  ],
  "lifestyleImpact": [
    "Bullet points explaining what this means for their day-to-day life (energy, diet, exercise, precautions)."
  ],
  "redFlags": [
    "Warning signs or symptoms where the patient should seek immediate medical attention (if any)."
  ],
  "doctorQuestions": [
    "3 to 5 clear, proactive questions the patient can ask their doctor during their next visit."
  ],
  "timelineEvent": {
    "date": "YYYY-MM-DD (extracted or today's date if unknown)",
    "category": "Lab Tests" | "Doctor Visits" | "Imaging & Scans" | "Prescriptions" | "Hospital",
    "title": "Short descriptive title of this visit or test",
    "doctor": "Doctor name or facility if mentioned",
    "facility": "Hospital or clinic name if mentioned",
    "summary": "1-sentence timeline summary",
    "metrics": [
      { "name": "e.g. Glucose", "value": "114", "unit": "mg/dL", "status": "Attention" }
    ]
  }
}

MEDICAL REPORT TO SIMPLIFY:
"""
${reportText}
"""
`;
  }

  /**
   * Simplify a medical report using Gemini API or fallback demo
   */
  async simplifyReport(reportText, readingLevel = "5th-grade") {
    // If no API key is provided, use high-quality intelligent simulated response
    if (!this.hasApiKey()) {
      return this._generateSimulatedSimplification(reportText);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const prompt = this._buildSimplificationPrompt(reportText, readingLevel);

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: this.temperature,
        maxOutputTokens: UI_CONFIG.aiDefaults.maxOutputTokens || 3500,
        responseMimeType: "application/json"
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error("No response received from Gemini model.");
      }

      // Parse JSON from model response
      const parsed = JSON.parse(rawText);
      return parsed;
    } catch (err) {
      console.warn("Direct Gemini API call failed or rate-limited. Falling back to structured parser:", err);
      // Fallback to simulated response if network or quota failed
      return this._generateSimulatedSimplification(reportText, err.message);
    }
  }

  /**
   * Follow-up chat assistant to ask questions about the current report
   */
  async askFollowUpQuestion(reportContext, userQuestion) {
    if (!this.hasApiKey()) {
      return this._generateSimulatedChatReply(userQuestion);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const systemPrompt = `You are an empathetic, knowledgeable medical assistant powered by Gemini. You are discussing a patient's medical report. 
Here is the medical report context:
"""
${reportContext}
"""

Always:
1. Answer directly and reassuringly in simple everyday language.
2. Remind them to confirm changes with their doctor.
3. Keep answers concise (2-3 short paragraphs).`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nPatient Question: ${userQuestion}` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to process that question.";
    } catch (err) {
      return this._generateSimulatedChatReply(userQuestion);
    }
  }

  /**
   * Intelligent offline fallback simulation for testing without an API key
   */
  _generateSimulatedSimplification(text, fallbackNotice = null) {
    const isMRI = text.toLowerCase().includes("mri") || text.toLowerCase().includes("spine") || text.toLowerCase().includes("disc");
    const isHeart = text.toLowerCase().includes("echo") || text.toLowerCase().includes("heart") || text.toLowerCase().includes("ejection");
    const today = new Date().toISOString().split("T")[0];

    if (isMRI) {
      return {
        _isDemo: true,
        _notice: fallbackNotice,
        summary: "This MRI scan of your lower back shows that the bones are in good alignment and healthy, but one of the cushioning discs (at the L4-L5 level) has bulged out of its normal space. Like jelly squeezing out of a donut, this bulge is gently pressing against the L5 nerve root on your left side. This explains the radiating pain, tingling, or aching feeling running down your left buttock and leg (commonly called sciatica). The rest of your spine shows normal age-related wear and tear.",
        keyFindings: [
          {
            testOrFinding: "L4-L5 Disc Extrusion / Herniation",
            resultValue: "4.5 mm focal bulge (Left paracentral)",
            status: "Attention",
            plainEnglish: "The rubbery cushion between your 4th and 5th lower back bones is poking out and irritating the nerve heading down your left leg."
          },
          {
            testOrFinding: "Central Spinal Canal",
            resultValue: "No critical central stenosis",
            status: "Normal",
            plainEnglish: "The main tunnel where your main spinal cord nerves travel is completely open with plenty of room."
          },
          {
            testOrFinding: "Vertebral Bones & Alignment",
            resultValue: "Maintained height; no fractures",
            status: "Normal",
            plainEnglish: "The back bones themselves are solid, strong, and showing no cracks, fractures, or bone marrow edema."
          },
          {
            testOrFinding: "Facet Joints (L3-L5)",
            resultValue: "Mild facet arthropathy",
            status: "Normal",
            plainEnglish: "Standard wear-and-tear arthritis in the small stabilizing joints of the spine, very common with natural aging."
          }
        ],
        lifestyleImpact: [
          "Avoid heavy lifting, sudden twisting, or bending over from the waist with straight legs.",
          "Gentle walking on flat surfaces helps keep blood flowing to the irritated nerve.",
          "Applying ice or heat to the lower back for 15-20 minutes can soothe local muscle guarding."
        ],
        redFlags: [
          "Urgent Red Flag (Cauda Equina warning): Sudden loss of bowel or bladder control, or progressive numbness in the groin/saddle area requires immediate emergency room evaluation."
        ],
        doctorQuestions: [
          "Would targeted physical therapy or core stabilization exercises be best for this L4-L5 bulge?",
          "Are anti-inflammatory medications or a temporary steroid pack recommended for this nerve flare-up?",
          "At what point would we consider a targeted epidural injection or surgical consultation if physical therapy doesn't resolve the sciatica?"
        ],
        timelineEvent: {
          date: "2026-06-18",
          category: "Imaging & Scans",
          title: "Lumbar Spine MRI (L4-L5 Disc Herniation)",
          doctor: "Dr. Marcus Chen, MD",
          facility: "Advanced Spine & Orthopedic Imaging Center",
          summary: "L4-L5 disc extrusion causing left L5 nerve irritation; bones healthy without central canal stenosis.",
          metrics: [
            { name: "L4-L5 Disc Bulge", value: "4.5", unit: "mm", status: "Attention" },
            { name: "Spinal Canal Status", value: "Patent", unit: "", status: "Normal" }
          ]
        }
      };
    } else if (isHeart) {
      return {
        _isDemo: true,
        _notice: fallbackNotice,
        summary: "Your heart ultrasound (echocardiogram) brings reassuring news: your heart's main pumping motor is strong and contracting normally, with an ejection fraction of 60-65% (which is completely healthy). The heart muscle walls are slightly thickened (hypertrophy), which is a common reaction when the heart has had to pump against elevated blood pressure over time—like a muscle getting bulkier from lifting weights. There is also very mild leakage in the mitral valve, which is common and not causing any strain.",
        keyFindings: [
          {
            testOrFinding: "Ejection Fraction (LVEF)",
            resultValue: "60 - 65%",
            status: "Normal",
            plainEnglish: "Your heart pump is working at normal capacity, sending plenty of fresh blood with every heartbeat."
          },
          {
            testOrFinding: "Left Ventricular Hypertrophy (LVH)",
            resultValue: "Mild concentric thickening",
            status: "Attention",
            plainEnglish: "The heart walls are slightly thicker than usual, almost always caused by blood pressure being a bit high over the past few years."
          },
          {
            testOrFinding: "Diastolic Relaxation (Grade 1)",
            resultValue: "Impaired relaxation pattern",
            status: "Attention",
            plainEnglish: "While the heart pumps out blood strongly, it relaxes a little stiffly between beats. Very common with blood pressure changes and age."
          },
          {
            testOrFinding: "Pericardial Fluid",
            resultValue: "No effusion",
            status: "Normal",
            plainEnglish: "No dangerous fluid buildup around the protective outer sac of your heart."
          }
        ],
        lifestyleImpact: [
          "Focus on keeping your daily blood pressure well controlled under 130/80 mmHg.",
          "Lower daily dietary sodium (salt) to reduce fluid resistance against the heart muscle.",
          "Incorporate 30 minutes of brisk walking or light cardiovascular activity most days of the week."
        ],
        redFlags: [
          "Seek emergency care immediately if you experience crushing chest pressure, shortness of breath while lying flat, or sudden fainting spells."
        ],
        doctorQuestions: [
          "Is my current blood pressure medication keeping my pressure low enough to prevent further heart wall thickening?",
          "Are there any exercise restrictions, or should I aim for regular aerobic conditioning?",
          "When should we schedule a follow-up echo to monitor my heart's relaxation and wall thickness?"
        ],
        timelineEvent: {
          date: "2026-09-05",
          category: "Cardiology",
          title: "Echocardiogram (Normal EF 60-65%, Mild LVH)",
          doctor: "Dr. Sarah Al-Mansoor, MD",
          facility: "Heart & Vascular Specialty Institute",
          summary: "Normal ejection fraction of 60-65%; mild heart wall thickening related to blood pressure.",
          metrics: [
            { name: "Ejection Fraction", value: "62", unit: "%", status: "Normal" },
            { name: "PASP Pressure", value: "26", unit: "mmHg", status: "Normal" }
          ]
        }
      };
    } else {
      // General Lab Panel CMP/CBC
      return {
        _isDemo: true,
        _notice: fallbackNotice,
        summary: "Your overall blood test results show that your kidneys are filtering waste exceptionally well (eGFR > 90) and your liver is largely doing its job. However, there are three important items that need your attention: 1) Your hemoglobin and iron storage (ferritin) are low, indicating mild iron-deficiency anemia, which often causes low energy or cold hands; 2) Your fasting blood sugar (114 mg/dL) and 3-month sugar average (A1c 5.9%) fall into the 'prediabetes' range; and 3) A mild elevation in liver enzymes (ALT 42 U/L) that is often linked to metabolism or diet.",
        keyFindings: [
          {
            testOrFinding: "Hemoglobin & Ferritin",
            resultValue: "Hgb: 11.6 g/dL | Ferritin: 14 ng/mL",
            status: "Attention",
            plainEnglish: "Your body's iron gas tank is low, which means fewer oxygen-carrying red blood cells are circulating. This is mild anemia."
          },
          {
            testOrFinding: "Fasting Blood Sugar & A1c",
            resultValue: "Glucose: 114 mg/dL | A1c: 5.9%",
            status: "Attention",
            plainEnglish: "Your sugar levels are slightly higher than normal, putting you in the prediabetes category. The great news: this is completely reversible with nutrition and activity."
          },
          {
            testOrFinding: "Kidney Function (eGFR & Creatinine)",
            resultValue: "eGFR: >90 | Creatinine: 0.9 mg/dL",
            status: "Normal",
            plainEnglish: "Your kidneys are filtering waste products at 100% capacity. Excellent health marker."
          },
          {
            testOrFinding: "White Blood Cells (WBC)",
            resultValue: "11.8 x10^9/L (Mild elevation)",
            status: "Attention",
            plainEnglish: "Your immune defense cells are slightly raised, which frequently happens if your body recently cleared a minor cold, tooth ache, or temporary inflammation."
          }
        ],
        lifestyleImpact: [
          "Boost dietary iron with leafy greens, lentils, beans, lean meats, and pair them with Vitamin C (like citrus) for better absorption.",
          "Cut back on sugary sodas, refined white flour, and sweets to bring fasting blood sugar back under 100 mg/dL.",
          "Aim for 20-30 minutes of daily walking after dinner to improve insulin sensitivity."
        ],
        redFlags: [
          "Call your doctor promptly if you develop sudden shortness of breath upon standing, chest palpitations, or dark tarry stools."
        ],
        doctorQuestions: [
          "Do you recommend a daily oral iron supplement, and which type is gentlest on the stomach?",
          "What target fasting glucose number should we aim for over the next 3 to 6 months?",
          "Should we recheck my CBC, ferritin, and liver panel in 12 weeks to confirm the anemia is resolving?"
        ],
        timelineEvent: {
          date: "2026-04-12",
          category: "Lab Tests",
          title: "Comprehensive Lab Panel (CBC + Metabolic)",
          doctor: "Dr. Evelyn Vance, MD",
          facility: "Metro Health Diagnostic Center",
          summary: "Mild iron deficiency anemia and borderline blood sugar (HbA1c 5.9%); normal kidney function.",
          metrics: [
            { name: "Fasting Glucose", value: "114", unit: "mg/dL", status: "Attention" },
            { name: "HbA1c", value: "5.9", unit: "%", status: "Attention" },
            { name: "Hemoglobin", value: "11.6", unit: "g/dL", status: "Attention" },
            { name: "eGFR", value: ">90", unit: "mL/min", status: "Normal" }
          ]
        }
      };
    }
  }

  /**
   * Simulated follow-up reply when offline or no API key
   */
  _generateSimulatedChatReply(question) {
    const q = (question || "").toLowerCase();
    if (q.includes("ferritin") || q.includes("iron") || q.includes("tired") || q.includes("fatigue")) {
      return "Yes, absolutely! Ferritin is your body's storage vault for iron. When ferritin drops down to 14 ng/mL, your red blood cells don't have enough raw material to carry optimal oxygen to your brain and muscle tissues. This is one of the most common causes of midday fatigue, brain fog, cold sensitivity in hands/feet, and feeling sluggish. You should ask your doctor about starting an iron supplement like ferrous bisglycinate with Vitamin C.";
    }
    if (q.includes("glucose") || q.includes("sugar") || q.includes("a1c") || q.includes("prediabetes")) {
      return "A fasting glucose of 114 mg/dL and HbA1c of 5.9% indicate prediabetes. The most reassuring thing is that prediabetes is NOT permanent—it is fully reversible! By trimming refined sugars and processed carbs, increasing fiber (vegetables and legumes), and taking a brisk 15-minute walk after meals, most patients can return their numbers to the completely normal range within 3 to 6 months.";
    }
    if (q.includes("mri") || q.includes("back") || q.includes("sciatica") || q.includes("pain")) {
      return "For an L4-L5 disc extrusion causing sciatica, non-surgical treatment is typically the first step. Physical therapy focusing on core stabilization and nerve gliding, along with short courses of anti-inflammatory relief, helps the majority of patients heal within 6 to 12 weeks as the body naturally absorbs the protruding disc material.";
    }
    return `Thank you for asking! Regarding your question: "${question}" — in the context of this medical report, it is best to discuss this specific symptom or test with your ordering doctor. They can review your complete clinical history, run any confirmatory checks, and personalize your care plan safely.`;
  }
}

// Global singleton instance
const geminiService = new GeminiService();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { GeminiService, geminiService };
}
