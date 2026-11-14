/**
 * ==============================================================================
 *  MEDCLARIFY - REALISTIC SAMPLE MEDICAL REPORTS
 * ==============================================================================
 *  Preloaded clinical sample reports for testing the AI Simplifier and Timeline
 *  without needing to type or upload sensitive personal records immediately.
 * ==============================================================================
 */

const SAMPLE_REPORTS = [
  {
    id: "sample-lab-cmp-cbc",
    title: "Routine Lab Panel (CBC & Metabolic Panel)",
    category: "Lab Tests",
    date: "2026-04-12",
    doctor: "Dr. Evelyn Vance, MD (Internal Medicine)",
    facility: "Metro Health Diagnostic Center",
    text: `PATIENT CLINICAL LABORATORY REPORT
Date of Collection: April 12, 2026
Ordering Physician: Dr. Evelyn Vance, MD
Specimen: Venous Blood

COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL:
- White Blood Cells (WBC): 11.8 x10^9/L (Reference: 4.5 - 11.0) [ELEVATED / HIGH]
- Red Blood Cells (RBC): 4.12 x10^12/L (Reference: 4.20 - 5.40) [SLIGHTLY LOW]
- Hemoglobin (Hgb): 11.6 g/dL (Reference: 12.0 - 15.5) [LOW - MILD ANEMIA]
- Hematocrit (Hct): 35.1 % (Reference: 37.0 - 48.0) [LOW]
- Mean Corpuscular Volume (MCV): 76.2 fL (Reference: 80.0 - 100.0) [LOW - MICROCYTOSIS]
- Platelet Count: 284 x10^9/L (Reference: 150 - 450) [NORMAL]
- Neutrophils: 74% (Reference: 40 - 70%) [MILD ELEVATION]

COMPREHENSIVE METABOLIC PANEL (CMP):
- Fasting Glucose: 114 mg/dL (Reference: 70 - 99 mg/dL) [ELEVATED - IMPAIRED FASTING GLUCOSE]
- Hemoglobin A1c: 5.9 % (Reference: < 5.7 %) [PREDIABETES RANGE]
- Blood Urea Nitrogen (BUN): 18 mg/dL (Reference: 7 - 20 mg/dL) [NORMAL]
- Serum Creatinine: 0.9 mg/dL (Reference: 0.6 - 1.1 mg/dL) [NORMAL]
- Estimated GFR (eGFR): > 90 mL/min/1.73m2 (Reference: > 60) [NORMAL RENAL FUNCTION]
- ALT (SGPT): 42 U/L (Reference: 7 - 35 U/L) [MILD ELEVATION]
- AST (SGOT): 28 U/L (Reference: 10 - 40 U/L) [NORMAL]
- Serum Ferritin: 14 ng/mL (Reference: 20 - 200 ng/mL) [LOW IRON STORAGE]

IMPRESSION & CLINICAL NOTE:
1. Mild microcytic hypochromic anemia, consistent with iron deficiency given low ferritin (14 ng/mL).
2. Borderline fasting hyperglycemia and HbA1c of 5.9% consistent with prediabetes.
3. Mild leukocytosis with slight neutrophil predominance; evaluate for mild recent subclinical infection.
4. Mild ALT elevation; suggest lifestyle modifications and reassessment in 3 months.`
  },
  {
    id: "sample-mri-lumbar",
    title: "Lumbar Spine MRI Report (Lower Back & Sciatica)",
    category: "Imaging & Scans",
    date: "2026-06-18",
    doctor: "Dr. Marcus Chen, MD (Radiology)",
    facility: "Advanced Spine & Orthopedic Imaging Center",
    text: `MAGNETIC RESONANCE IMAGING (MRI) OF THE LUMBAR SPINE
Date of Exam: June 18, 2026
Clinical Indication: 44-year-old presenting with chronic lower back pain radiating down the left lower extremity in an L5 distribution; positive straight leg raise.
Technique: Multiplanar, multisequence MRI of the lumbar spine without intravenous contrast.

FINDINGS:
Vertebral body heights and alignment are maintained. No bone marrow edema, osteolytic lesions, or compression fractures identified. Conus medullaris terminates normally at L1-L2.

LEVEL BY LEVEL EVALUATION:
- L1-L2 and L2-L3: Normal disc height and hydration. No disc herniation, spinal stenosis, or neural foraminal narrowing.
- L3-L4: Mild broad-based disc bulge with mild facet arthropathy. Mild bilateral ligamentum flavum thickening. No significant central canal stenosis.
- L4-L5: Moderate disc desiccation with a 4.5 mm left paracentral focal disc extrusion/herniation that impinges upon the traversing left L5 nerve root in the lateral recess. Moderate bilateral facet hypertrophy resulting in mild-to-moderate left neural foraminal stenosis.
- L5-S1: Mild circumferential disc bulge with small posterior annular fissure. No impingement of the exiting S1 nerve roots.

IMPRESSION:
1. L4-L5 left paracentral disc extrusion causing mechanical compression of the traversing left L5 nerve root, corresponding with patient's left-sided sciatica.
2. Multilevel mild facet osteoarthropathy without critical central canal spinal stenosis.
3. Recommended clinical correlation with physical therapy and spine specialist evaluation.`
  },
  {
    id: "sample-cardio-echo",
    title: "Echocardiogram & Cardiac Stress Report",
    category: "Cardiology",
    date: "2026-09-05",
    doctor: "Dr. Sarah Al-Mansoor, MD, FACC (Cardiology)",
    facility: "Heart & Vascular Specialty Institute",
    text: `TRANSTHORACIC ECHOCARDIOGRAM (TTE) REPORT
Exam Date: September 5, 2026
Patient Indication: Evaluation of exertional dyspnea, palpitations, and baseline hypertension.

MEASUREMENTS & FINDINGS:
- Left Ventricle: Normal cavity dimensions. Mild concentric left ventricular hypertrophy (LVH) consistent with chronic hypertensive heart changes.
- Left Ventricular Ejection Fraction (LVEF): 60 - 65% (Normal reference: 55 - 70%). Global systolic function is preserved. No regional wall motion abnormalities noted at rest.
- Diastolic Function: Grade 1 diastolic dysfunction (impaired relaxation pattern) with E/A ratio < 0.8.
- Left Atrium: Mild left atrial enlargement (LAVi 36 mL/m2).
- Right Ventricle: Normal size and systolic contractility (TAPSE 2.2 cm).
- Valvular Assessment:
  - Mitral Valve: Mild mitral regurgitation. Leaflets are structurally intact.
  - Aortic Valve: Trileaflet aortic valve. Mild sclerosis without hemodynamic stenosis (peak velocity 1.3 m/s).
  - Tricuspid Valve: Trace physiologic regurgitation. Estimated pulmonary artery systolic pressure (PASP) is normal at 26 mmHg.
- Pericardium: No pericardial effusion seen.

IMPRESSION:
1. Preserved left ventricular systolic function with LVEF estimated at 60-65%.
2. Mild concentric left ventricular hypertrophy and Grade 1 diastolic dysfunction, likely secondary to systemic hypertension.
3. Mild mitral regurgitation, hemodynamically non-critical.
4. Continue blood pressure regimen; encourage sodium restriction and aerobic conditioning.`
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SAMPLE_REPORTS };
}
