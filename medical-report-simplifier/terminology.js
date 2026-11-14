/**
 * ==============================================================================
 *  MEDCLARIFY - PRELOADED MEDICAL TERMINOLOGY KNOWLEDGE BASE
 * ==============================================================================
 *  Preloaded with comprehensive medical terms, laboratory tests, imaging phrases,
 *  prefixes, suffixes, and abbreviations explained in simple everyday language.
 *
 *  Features:
 *  - Categorized for fast browsing
 *  - Aliases for instant keyword matching in reports
 *  - "Plain English" everyday explanations (no complex medical jargon)
 *  - Reference ranges and clinical context
 * ==============================================================================
 */

const MEDICAL_TERMINOLOGY_DATABASE = [
  // ----------------------------------------------------------------------------
  // SECTION 1: BLOOD TESTS & HEMATOLOGY (CBC)
  // ----------------------------------------------------------------------------
  {
    id: "hemoglobin",
    term: "Hemoglobin (Hgb / Hb)",
    aliases: ["hemoglobin", "hgb", "hb"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "The oxygen-carrying protein in your red blood cells. Think of hemoglobin as tiny delivery trucks carrying fresh oxygen from your lungs to every organ in your body.",
    normalRange: "Men: 13.8 - 17.2 g/dL | Women: 12.1 - 15.1 g/dL",
    whyItMatters: "Low levels mean anemia (causing tiredness, pale skin, or shortness of breath). High levels can happen in smokers, at high altitudes, or from dehydration."
  },
  {
    id: "hematocrit",
    term: "Hematocrit (Hct)",
    aliases: ["hematocrit", "hct"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "The percentage of your blood that is made up of red blood cells compared to fluid. If your blood was a soup, hematocrit tells you how thick the vegetables (cells) are compared to the broth (plasma).",
    normalRange: "Men: 40.7% - 50.3% | Women: 36.1% - 44.3%",
    whyItMatters: "Low hematocrit points to anemia or blood loss. High hematocrit can mean severe dehydration or bone marrow disorders."
  },
  {
    id: "wbc",
    term: "White Blood Cells (WBC / Leukocytes)",
    aliases: ["wbc", "white blood cells", "white blood cell count", "leukocytes", "leukocyte count"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "Your body's immune system defense army. They fight off viruses, bacteria, fungi, and help clean up damaged tissue.",
    normalRange: "4,500 to 11,000 cells/mcL (or 4.5 - 11.0 x10^9/L)",
    whyItMatters: "High WBC usually means your body is currently fighting an infection, experiencing inflammation, or under severe physical stress. Low WBC means your immune system is weakened."
  },
  {
    id: "platelets",
    term: "Platelets (Thrombocytes / Plt)",
    aliases: ["platelets", "platelet count", "plt", "thrombocytes"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "Tiny cell fragments that form sticky plugs (clots) to stop bleeding when you get a cut or injury. Think of them like internal bandages.",
    normalRange: "150,000 to 450,000 /mcL (or 150 - 450 x10^9/L)",
    whyItMatters: "Too low (thrombocytopenia) causes easy bruising, nosebleeds, and excessive bleeding. Too high (thrombocytosis) can increase blood clot risks."
  },
  {
    id: "neutrophils",
    term: "Neutrophils (Polys / Segs)",
    aliases: ["neutrophils", "neutrophil count", "absolute neutrophil count", "anc"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "The frontline infantry troops of your white blood cells. They are the first to arrive at the scene of a bacterial infection to destroy the bacteria.",
    normalRange: "40% - 70% of total WBC (or 1,500 - 8,000 cells/mcL)",
    whyItMatters: "High neutrophils indicate active bacterial infection or sudden inflammation. Low neutrophils put you at high risk of infections."
  },
  {
    id: "lymphocytes",
    term: "Lymphocytes (T-cells & B-cells)",
    aliases: ["lymphocytes", "lymphocyte count", "absolute lymphocytes"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "Specialized immune cells that create antibodies and fight off viral infections like the common cold, flu, COVID, and mono.",
    normalRange: "20% - 40% of total WBC",
    whyItMatters: "High counts are common when fighting viral illnesses. Low counts can occur with chronic infections or immune disorders."
  },
  {
    id: "mcv",
    term: "Mean Corpuscular Volume (MCV)",
    aliases: ["mcv", "mean corpuscular volume"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "The average physical size of your red blood cells.",
    normalRange: "80 - 100 fL (femtoliters)",
    whyItMatters: "Low MCV (microcytic) means small cells, most commonly caused by iron deficiency anemia. High MCV (macrocytic) means oversized cells, often caused by Vitamin B12 or folate deficiency or thyroid issues."
  },
  {
    id: "rdw",
    term: "Red Cell Distribution Width (RDW)",
    aliases: ["rdw", "red cell distribution width"],
    category: "Complete Blood Count (CBC)",
    plainEnglish: "Measures how much red blood cells vary in size. Normally, they should all be nearly identical in size.",
    normalRange: "11.5% - 14.5%",
    whyItMatters: "High RDW means there is a big mix of small and large cells, an early clue for nutritional deficiencies (iron, B12, or folate)."
  },

  // ----------------------------------------------------------------------------
  // SECTION 2: METABOLIC PANEL, LIVER & KIDNEY FUNCTION
  // ----------------------------------------------------------------------------
  {
    id: "fasting-glucose",
    term: "Fasting Glucose (Blood Sugar)",
    aliases: ["glucose", "blood sugar", "fasting blood sugar", "fbs"],
    category: "Metabolic & Diabetes",
    plainEnglish: "The amount of simple sugar circulating in your bloodstream after fasting. Glucose is the main fuel powering your brain and muscles.",
    normalRange: "70 - 99 mg/dL (Normal) | 100 - 125 mg/dL (Prediabetes) | 126+ mg/dL (Diabetes)",
    whyItMatters: "Consistently high blood sugar can damage blood vessels, nerves, eyes, and kidneys over time. Low blood sugar (<70 mg/dL) causes shaking, dizziness, and confusion."
  },
  {
    id: "hba1c",
    term: "Hemoglobin A1c (HbA1c / Glycated Hemoglobin)",
    aliases: ["hba1c", "a1c", "glycated hemoglobin", "glycohemoglobin"],
    category: "Metabolic & Diabetes",
    plainEnglish: "A 3-month running average of your blood sugar levels. Unlike a finger prick which shows only this minute, A1c shows the big picture of your sugar control over the past 90 days.",
    normalRange: "Below 5.7% (Normal) | 5.7% - 6.4% (Prediabetes) | 6.5% or higher (Diabetes)",
    whyItMatters: "Used to diagnose and track diabetes. Lowering A1c drastically cuts your risk of heart attacks, nerve damage, and kidney failure."
  },
  {
    id: "creatinine",
    term: "Creatinine (Serum Creatinine)",
    aliases: ["creatinine", "serum creatinine", "cr"],
    category: "Kidney Function (Renal)",
    plainEnglish: "A natural waste product produced by normal muscle breakdown. Healthy kidneys filter it out of your blood and excrete it into urine.",
    normalRange: "Men: 0.7 - 1.3 mg/dL | Women: 0.5 - 1.1 mg/dL",
    whyItMatters: "If your kidneys are struggling or sluggish, creatinine builds up in your blood, making this number rise."
  },
  {
    id: "egfr",
    term: "Estimated GFR (eGFR / Glomerular Filtration Rate)",
    aliases: ["egfr", "gfr", "estimated glomerular filtration rate"],
    category: "Kidney Function (Renal)",
    plainEnglish: "The speedometer of your kidneys. It measures how many milliliters of blood your kidneys can clean every single minute.",
    normalRange: "90 or above (Normal / Healthy) | 60 - 89 (Mild decline) | Below 60 (Possible kidney disease)",
    whyItMatters: "A number above 60 is generally reassuring. A number persistently below 60 for 3+ months suggests chronic kidney disease that needs monitoring."
  },
  {
    id: "bun",
    term: "Blood Urea Nitrogen (BUN)",
    aliases: ["bun", "blood urea nitrogen"],
    category: "Kidney Function (Renal)",
    plainEnglish: "Another waste product created when your body breaks down protein from food. Excreted by the kidneys.",
    normalRange: "7 - 20 mg/dL",
    whyItMatters: "Elevated levels usually mean dehydration, high protein intake, or kidney stress. Very low levels can occur in malnutrition or severe liver disease."
  },
  {
    id: "alt",
    term: "Alanine Aminotransferase (ALT / SGPT)",
    aliases: ["alt", "sgpt", "alanine aminotransferase", "alanine transaminase"],
    category: "Liver Function (Hepatic)",
    plainEnglish: "An enzyme found almost exclusively inside liver cells. When liver cells are irritated or damaged, ALT leaks out into your bloodstream.",
    normalRange: "7 - 56 U/L",
    whyItMatters: "Elevated ALT is one of the most sensitive indicators of liver irritation (from fatty liver, alcohol, medications like statins or Tylenol, or viral hepatitis)."
  },
  {
    id: "ast",
    term: "Aspartate Aminotransferase (AST / SGOT)",
    aliases: ["ast", "sgot", "aspartate aminotransferase"],
    category: "Liver Function (Hepatic)",
    plainEnglish: "An enzyme found in the liver, heart, and skeletal muscles. Like ALT, it leaks into blood when these tissues are stressed or injured.",
    normalRange: "10 - 40 U/L",
    whyItMatters: "High AST alongside high ALT points directly to liver issues. High AST alone can sometimes come from intense heavy weightlifting or muscle injury."
  },
  {
    id: "bilirubin",
    term: "Total Bilirubin",
    aliases: ["bilirubin", "total bilirubin", "direct bilirubin"],
    category: "Liver Function (Hepatic)",
    plainEnglish: "A yellowish pigment created when old red blood cells are naturally broken down. Your liver processes it and passes it into bile.",
    normalRange: "0.2 - 1.2 mg/dL",
    whyItMatters: "High levels cause jaundice (yellowing of the eyes and skin), and can indicate gallbladder gallstones, bile duct blockage, or liver trouble."
  },
  {
    id: "alp",
    term: "Alkaline Phosphatase (ALP)",
    aliases: ["alp", "alkaline phosphatase", "alk phos"],
    category: "Liver & Bone",
    plainEnglish: "An enzyme found in high amounts in your liver's bile ducts and in rapidly growing or healing bone tissue.",
    normalRange: "44 - 147 U/L",
    whyItMatters: "High levels often indicate gallbladder duct blockage or bone conditions (like healing fractures, osteoporosis, or vitamin D deficiency)."
  },
  {
    id: "potassium",
    term: "Potassium (K+)",
    aliases: ["potassium", "k+", "serum potassium"],
    category: "Electrolytes",
    plainEnglish: "A vital mineral that regulates your heart's electrical rhythm and helps muscles contract smoothly.",
    normalRange: "3.5 - 5.0 mEq/L (or mmol/L)",
    whyItMatters: "Both low potassium (hypokalemia) and high potassium (hyperkalemia) are dangerous because they can trigger irregular heartbeats (arrhythmias)."
  },
  {
    id: "sodium",
    term: "Sodium (Na+)",
    aliases: ["sodium", "na+", "serum sodium"],
    category: "Electrolytes",
    plainEnglish: "An essential electrolyte that controls water balance and fluid pressure inside and outside your cells.",
    normalRange: "135 - 145 mEq/L",
    whyItMatters: "Low sodium causes confusion, headache, and weakness. High sodium usually indicates severe dehydration."
  },
  {
    id: "calcium",
    term: "Calcium (Serum Calcium)",
    aliases: ["calcium", "serum calcium", "ca"],
    category: "Electrolytes & Bone",
    plainEnglish: "The mineral required for strong bones and teeth, heart muscle pumping, nerve signaling, and blood clotting.",
    normalRange: "8.5 - 10.2 mg/dL",
    whyItMatters: "Controlled strictly by parathyroid glands and Vitamin D. High levels can lead to kidney stones; low levels can cause muscle spasms."
  },

  // ----------------------------------------------------------------------------
  // SECTION 3: LIPID PANEL & HEART HEALTH
  // ----------------------------------------------------------------------------
  {
    id: "total-cholesterol",
    term: "Total Cholesterol",
    aliases: ["total cholesterol", "cholesterol"],
    category: "Lipid Profile (Cholesterol)",
    plainEnglish: "The total amount of all cholesterol types circulating in your blood.",
    normalRange: "Desirable: Under 200 mg/dL | Borderline: 200 - 239 mg/dL | High: 240+ mg/dL",
    whyItMatters: "Excess cholesterol can deposit in the walls of your blood vessels, forming plaques that narrow arteries."
  },
  {
    id: "ldl-cholesterol",
    term: "LDL Cholesterol (Low-Density Lipoprotein)",
    aliases: ["ldl", "ldl cholesterol", "ldl-c", "bad cholesterol"],
    category: "Lipid Profile (Cholesterol)",
    plainEnglish: "Known as the 'bad cholesterol'. It carries cholesterol particles directly to artery walls where it can stick and form narrow blockages.",
    normalRange: "Optimal: Under 100 mg/dL (Under 70 mg/dL for high-risk heart patients)",
    whyItMatters: "The single most important cholesterol number doctors target to lower the risk of heart attacks and strokes."
  },
  {
    id: "hdl-cholesterol",
    term: "HDL Cholesterol (High-Density Lipoprotein)",
    aliases: ["hdl", "hdl cholesterol", "hdl-c", "good cholesterol"],
    category: "Lipid Profile (Cholesterol)",
    plainEnglish: "Known as the 'good cholesterol'. Acts as a recycling truck that scoops up excess cholesterol from your blood vessels and carries it back to the liver to be disposed of.",
    normalRange: "Desirable: 50 mg/dL or higher (Women) | 40 mg/dL or higher (Men)",
    whyItMatters: "Higher HDL numbers protect your heart. Regular aerobic exercise and healthy fats (olive oil, avocados) raise HDL."
  },
  {
    id: "triglycerides",
    term: "Triglycerides",
    aliases: ["triglycerides", "trigs", "tg"],
    category: "Lipid Profile (Cholesterol)",
    plainEnglish: "The most common type of fat stored in your body. When you eat extra calories (especially sugar and carbs), your body converts them into triglycerides.",
    normalRange: "Normal: Under 150 mg/dL | Borderline: 150 - 199 mg/dL | High: 200 - 499 mg/dL",
    whyItMatters: "High triglycerides thicken artery walls and greatly increase the risk of pancreatitis when very high (>500 mg/dL)."
  },
  {
    id: "crp",
    term: "C-Reactive Protein (CRP / hs-CRP)",
    aliases: ["crp", "hs-crp", "c-reactive protein", "high sensitivity crp"],
    category: "Inflammatory Markers",
    plainEnglish: "A protein produced by the liver when there is active inflammation anywhere in your body.",
    normalRange: "Standard CRP: Under 10 mg/L | High-sensitivity (hs-CRP for heart risk): Under 1.0 mg/L (low risk), 1.0-3.0 (average risk), >3.0 (high risk)",
    whyItMatters: "Used to detect hidden inflammation, autoimmune flare-ups, infections, and hidden cardiovascular risk."
  },
  {
    id: "tsh",
    term: "Thyroid Stimulating Hormone (TSH)",
    aliases: ["tsh", "thyroid stimulating hormone", "thyrotropin"],
    category: "Thyroid & Endocrinology",
    plainEnglish: "The master control signal from your brain's pituitary gland telling your neck's thyroid gland to produce metabolism energy hormones.",
    normalRange: "0.4 - 4.0 mIU/L (or uIU/mL)",
    whyItMatters: "Think of TSH like a thermostat: if your thyroid is sluggish (hypothyroidism), your brain shouts louder (HIGH TSH). If your thyroid is hyperactive (hyperthyroidism), your brain goes quiet (LOW TSH)."
  },
  {
    id: "vitamin-d",
    term: "Vitamin D (25-Hydroxy Vitamin D)",
    aliases: ["vitamin d", "25-hydroxy vitamin d", "vit d"],
    category: "Vitamins & Minerals",
    plainEnglish: "A key sunshine hormone essential for bone calcium absorption, mood, and immune system strength.",
    normalRange: "30 - 100 ng/mL (Deficient: <20 ng/mL | Insufficient: 20-29 ng/mL)",
    whyItMatters: "Low Vitamin D is widespread and causes bone ache, muscle weakness, fatigue, and low immunity."
  },
  {
    id: "ferritin",
    term: "Ferritin (Iron Storage)",
    aliases: ["ferritin", "serum ferritin"],
    category: "Vitamins & Minerals",
    plainEnglish: "The body's iron storage bank vault. While serum iron shows what's in your pocket right now, ferritin shows how much iron you have saved in the bank.",
    normalRange: "Men: 24 - 336 ng/mL | Women: 11 - 307 ng/mL",
    whyItMatters: "Low ferritin is the earliest confirmation of iron deficiency anemia (causing hair thinning, fatigue, brittle nails)."
  },

  // ----------------------------------------------------------------------------
  // SECTION 4: RADIOLOGY & IMAGING TERMINOLOGY (MRI, CT, X-RAY, ULTRASOUND)
  // ----------------------------------------------------------------------------
  {
    id: "hyperintense",
    term: "Hyperintense / Hypointense",
    aliases: ["hyperintense", "hypointense", "signal intensity"],
    category: "Radiology & Imaging",
    plainEnglish: "Describes brightness on an MRI scan. 'Hyperintense' means brighter/whiter than surrounding tissue (often indicating fluid, fat, or inflammation). 'Hypointense' means darker than normal.",
    normalRange: "Context dependent on scanned body part",
    whyItMatters: "Radiologists use signal brightness differences to spot swelling, bleeding, tears, or tumors."
  },
  {
    id: "opacity",
    term: "Opacity / Consolidation (Lungs)",
    aliases: ["opacity", "consolidation", "ground glass opacity", "infiltrate"],
    category: "Radiology & Imaging",
    plainEnglish: "Normally, lungs look dark on X-rays and CTs because air is transparent to radiation. An 'opacity' or 'consolidation' means a section of lung has filled with fluid, mucus, pus, or cells instead of air.",
    normalRange: "Lungs should be clear and radiolucent (air-filled)",
    whyItMatters: "Most often seen in pneumonia, severe bronchitis, fluid buildup, or infections."
  },
  {
    id: "effusion",
    term: "Effusion (Pleural / Joint Effusion)",
    aliases: ["effusion", "pleural effusion", "joint effusion", "pericardial effusion"],
    category: "Radiology & Imaging",
    plainEnglish: "An abnormal collection of fluid pooling around an organ or inside a joint capsule. For example, 'pleural effusion' means fluid pooling outside the lungs.",
    normalRange: "No abnormal fluid collection",
    whyItMatters: "Can cause chest pressure, breathing discomfort, or joint swelling and stiffness."
  },
  {
    id: "nodule",
    term: "Nodule / Lesion",
    aliases: ["nodule", "pulmonary nodule", "lesion", "mass"],
    category: "Radiology & Imaging",
    plainEnglish: "A small round growth or spot on an organ or tissue. Lesion simply means an area of tissue that looks different from healthy tissue.",
    normalRange: "No abnormal nodules",
    whyItMatters: "Most small lung or thyroid nodules are completely benign (non-cancerous scars from past colds or harmless cysts), but doctors track them to ensure they aren't growing."
  },
  {
    id: "contrast-enhancement",
    term: "Contrast Enhancement",
    aliases: ["contrast enhancement", "contrast-enhanced", "contrast uptake"],
    category: "Radiology & Imaging",
    plainEnglish: "An area that lights up brightly on a scan after receiving IV dye (contrast). Contrast travels through blood vessels, so areas with lots of blood flow or inflammation light up.",
    normalRange: "Expected normal blood vessel circulation",
    whyItMatters: "Helps doctors distinguish active inflammation, blood supply, infection, or tumors from normal resting tissue."
  },
  {
    id: "stenosis",
    term: "Stenosis (Narrowing)",
    aliases: ["stenosis", "spinal stenosis", "arterial stenosis", "foraminal stenosis"],
    category: "Radiology & Cardiology",
    plainEnglish: "The abnormal narrowing of an opening, blood vessel, or spinal nerve canal. Think of pinching a garden hose so water can't flow easily.",
    normalRange: "Normal open caliber (no pinching)",
    whyItMatters: "In the spine, stenosis pinches nerves causing numbness or pain down the legs. In arteries, it limits blood flow to the heart or brain."
  },
  {
    id: "herniation",
    term: "Disc Herniation / Bulge",
    aliases: ["herniation", "disc bulge", "herniated disc", "protrusion", "extrusion"],
    category: "Spine & Orthopedics",
    plainEnglish: "Spinal discs act like jelly donuts between your back bones. A herniation means the soft inner jelly is bulging or poking through the outer rubber ring, sometimes pressing on nearby nerves.",
    normalRange: "Discs intact within vertebral boundaries",
    whyItMatters: "Can cause sciatica (shooting pain, tingling, or weakness traveling down the buttocks and leg)."
  },
  {
    id: "osteophyte",
    term: "Osteophyte (Bone Spur)",
    aliases: ["osteophyte", "bone spur", "osteophytes"],
    category: "Spine & Orthopedics",
    plainEnglish: "A smooth extra bone growth that your body forms over years when a joint experiences wear-and-tear or cartilage loss.",
    normalRange: "Clean, smooth joint edges",
    whyItMatters: "A classic sign of osteoarthritis (wear-and-tear arthritis). Usually harmless unless it presses against a nerve."
  },
  {
    id: "ejection-fraction",
    term: "Ejection Fraction (LVEF / EF)",
    aliases: ["ejection fraction", "lvef", "ef"],
    category: "Cardiology (Heart)",
    plainEnglish: "The percentage of blood your heart's main pumping chamber pushes out with each heartbeat. It never pumps 100%—a healthy heart pumps about 55% to 65% per beat.",
    normalRange: "55% to 70% (Normal) | 40% - 54% (Slightly reduced) | Below 40% (Weakened / Heart failure)",
    whyItMatters: "The gold standard measurement of your heart pump's overall physical strength."
  },

  // ----------------------------------------------------------------------------
  // SECTION 5: CLINICAL JARGON & DIAGNOSES
  // ----------------------------------------------------------------------------
  {
    id: "benign",
    term: "Benign",
    aliases: ["benign"],
    category: "General Medical Jargon",
    plainEnglish: "Harmless, non-cancerous, and not spreading to other parts of the body.",
    normalRange: "Reassuring finding",
    whyItMatters: "Relieving news that indicates a cyst, mole, or growth will not invade surrounding tissues."
  },
  {
    id: "malignant",
    term: "Malignant",
    aliases: ["malignant", "malignancy"],
    category: "General Medical Jargon",
    plainEnglish: "Cancerous; capable of invading nearby healthy tissues and spreading (metastasizing) to other body areas.",
    normalRange: "Negative / Not detected",
    whyItMatters: "Requires prompt oncology evaluation and specialized treatment."
  },
  {
    id: "acute-vs-chronic",
    term: "Acute vs. Chronic",
    aliases: ["acute", "chronic"],
    category: "General Medical Jargon",
    plainEnglish: "'Acute' means sudden and short-lived (like a sudden sprained ankle or flu). 'Chronic' means long-term and ongoing (persisting for months or years, like high blood pressure or asthma).",
    normalRange: "Descriptive medical terms",
    whyItMatters: "Helps doctors determine whether urgent rescue treatment or long-term management is needed."
  },
  {
    id: "idiopathic",
    term: "Idiopathic",
    aliases: ["idiopathic"],
    category: "General Medical Jargon",
    plainEnglish: "Doctor-speak for: 'arising from an unknown cause.' It means the condition appeared on its own without an obvious trigger.",
    normalRange: "Descriptive medical term",
    whyItMatters: "Reassures you that no specific toxin or external mistake caused the condition."
  },
  {
    id: "edema",
    term: "Edema (Swelling)",
    aliases: ["edema", "peripheral edema", "pitting edema"],
    category: "General Medical Jargon",
    plainEnglish: "Puffiness and swelling caused by excess fluid trapped in your body's tissues (most often in the feet, ankles, and legs).",
    normalRange: "No swelling",
    whyItMatters: "Can be caused by standing all day, salt intake, pregnancy, or underlying heart, vein, or kidney issues."
  },
  {
    id: "prognosis",
    term: "Prognosis",
    aliases: ["prognosis"],
    category: "General Medical Jargon",
    plainEnglish: "The expected future outlook or likely recovery forecast for an illness.",
    normalRange: "Good / Excellent / Guarded",
    whyItMatters: "Answers the patient question: 'What can I expect in the coming weeks and months?'"
  },

  // ----------------------------------------------------------------------------
  // SECTION 6: COMMON MEDICAL PREFIXES & SUFFIXES
  // ----------------------------------------------------------------------------
  {
    id: "suffix-itis",
    term: "-itis (Inflammation)",
    aliases: ["-itis", "itis"],
    category: "Medical Prefixes & Suffixes",
    plainEnglish: "Means 'inflammation' or 'swelling' of that organ. For example: Bronchitis = bronchial tube inflammation; Arthritis = joint inflammation; Dermatitis = skin inflammation.",
    normalRange: "Suffix explanation",
    whyItMatters: "Whenever you see '-itis', it tells you that specific body part is swollen or irritated."
  },
  {
    id: "suffix-ectomy",
    term: "-ectomy (Surgical Removal)",
    aliases: ["-ectomy", "ectomy"],
    category: "Medical Prefixes & Suffixes",
    plainEnglish: "Means 'surgical removal' of an organ. For example: Appendectomy = taking out the appendix; Tonsillectomy = taking out the tonsils.",
    normalRange: "Suffix explanation",
    whyItMatters: "Clarifies what surgical operation was performed."
  },
  {
    id: "suffix-scopy",
    term: "-scopy (Visual Examination with Camera)",
    aliases: ["-scopy", "scopy", "endoscopy", "colonoscopy"],
    category: "Medical Prefixes & Suffixes",
    plainEnglish: "Looking inside a body cavity using a tiny fiber-optic camera on a flexible tube. For example: Colonoscopy = camera looking inside the large intestine.",
    normalRange: "Suffix explanation",
    whyItMatters: "Diagnostic procedure to directly visualize inner tissues and take biopsies."
  },
  {
    id: "prefix-hyper-hypo",
    term: "Hyper- vs. Hypo-",
    aliases: ["hyper-", "hypo-", "hyper", "hypo"],
    category: "Medical Prefixes & Suffixes",
    plainEnglish: "'Hyper-' means too high, too much, or overactive (e.g. Hypertension = high blood pressure). 'Hypo-' means too low, underactive, or deficient (e.g. Hypothyroidism = sluggish thyroid).",
    normalRange: "Prefix explanation",
    whyItMatters: "Instantly tells you whether a level or organ activity is above or below normal."
  },

  // ----------------------------------------------------------------------------
  // SECTION 7: PRESCRIPTION & DOCTOR SHORTHAND
  // ----------------------------------------------------------------------------
  {
    id: "prn",
    term: "PRN (Pro Re Nata)",
    aliases: ["prn", "p.r.n."],
    category: "Prescriptions & Dosing",
    plainEnglish: "Take 'as needed'. It means do not take it on a strict clock schedule; take it only when symptoms appear (e.g., pain or nausea).",
    normalRange: "Prescription shorthand",
    whyItMatters: "Ensures you don't overmedicate when you're feeling fine."
  },
  {
    id: "bid-tid-qid",
    term: "BID / TID / QID",
    aliases: ["bid", "tid", "qid", "b.i.d.", "t.i.d.", "q.i.d."],
    category: "Prescriptions & Dosing",
    plainEnglish: "How many times a day to take medicine: BID = 2 times a day; TID = 3 times a day; QID = 4 times a day.",
    normalRange: "Prescription shorthand",
    whyItMatters: "Helps you space your doses evenly throughout waking hours."
  },
  {
    id: "npo",
    term: "NPO (Nil Per Os)",
    aliases: ["npo", "n.p.o."],
    category: "Prescriptions & Dosing",
    plainEnglish: "Nothing by mouth! No food, no snacks, and usually no liquids/water for a specified period before surgery or tests.",
    normalRange: "Hospital instruction",
    whyItMatters: "Crucial before anesthesia to prevent stomach contents from entering lungs."
  },
  {
    id: "po",
    term: "PO (Per Os)",
    aliases: ["po", "p.o."],
    category: "Prescriptions & Dosing",
    plainEnglish: "Taken orally by mouth (swallowed like a pill or liquid).",
    normalRange: "Prescription shorthand",
    whyItMatters: "Distinguishes oral medicine from injections, creams, or eye drops."
  }
];

// Helper functions to search and match terminology
const TerminologyService = {
  // Get all terms
  getAllTerms() {
    return MEDICAL_TERMINOLOGY_DATABASE;
  },

  // Get distinct categories
  getCategories() {
    const categories = new Set(MEDICAL_TERMINOLOGY_DATABASE.map(item => item.category));
    return Array.from(categories);
  },

  // Search terms by keyword in term name, aliases, or plain English explanation
  search(keyword) {
    if (!keyword || keyword.trim() === "") return MEDICAL_TERMINOLOGY_DATABASE;
    const lower = keyword.toLowerCase().trim();
    return MEDICAL_TERMINOLOGY_DATABASE.filter(item => {
      const matchTerm = item.term.toLowerCase().includes(lower);
      const matchAliases = item.aliases.some(a => a.toLowerCase().includes(lower));
      const matchEnglish = item.plainEnglish.toLowerCase().includes(lower);
      const matchCategory = item.category.toLowerCase().includes(lower);
      return matchTerm || matchAliases || matchEnglish || matchCategory;
    });
  },

  // Find a specific term by term id or alias
  lookup(nameOrAlias) {
    if (!nameOrAlias) return null;
    const clean = nameOrAlias.toLowerCase().trim();
    return MEDICAL_TERMINOLOGY_DATABASE.find(item => 
      item.id === clean || 
      item.term.toLowerCase() === clean || 
      item.aliases.some(a => a.toLowerCase() === clean)
    );
  },

  // Add custom user term to the active session database
  addCustomTerm(newTerm) {
    if (!newTerm || !newTerm.term || !newTerm.plainEnglish) return false;
    const id = newTerm.id || newTerm.term.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const termObj = {
      id: id,
      term: newTerm.term,
      aliases: newTerm.aliases || [newTerm.term.toLowerCase()],
      category: newTerm.category || "Custom User Term",
      plainEnglish: newTerm.plainEnglish,
      normalRange: newTerm.normalRange || "Custom Entry",
      whyItMatters: newTerm.whyItMatters || "Added by user."
    };
    MEDICAL_TERMINOLOGY_DATABASE.unshift(termObj);
    return true;
  }
};

// Export for browser and node
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MEDICAL_TERMINOLOGY_DATABASE, TerminologyService };
}
