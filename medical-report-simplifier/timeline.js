/**
 * ==============================================================================
 *  MEDCLARIFY - MEDICAL TIMELINE MANAGER
 * ==============================================================================
 *  Organizes medical records, lab reports, doctor visits, imaging scans, and
 *  prescriptions into a chronological visual timeline.
 *
 *  Features:
 *  - Chronological ordering (Newest first / Oldest first toggle)
 *  - Category filtering (Labs, Doctor Visits, Imaging, Prescriptions, Hospital)
 *  - Keyword search across records
 *  - Metric tracking (trends over time for Glucose, HbA1c, BP, Ferritin, etc.)
 *  - LocalStorage persistence (100% private, runs offline)
 *  - JSON Backup & Restore
 * ==============================================================================
 */

class TimelineManager {
  constructor() {
    this.storageKey = "medclarify_health_timeline_records";
    this.records = this.loadRecords();
    this.activeFilter = "All";
    this.searchQuery = "";
    this.sortOrder = "desc"; // 'desc' (newest first) or 'asc'
  }

  /**
   * Load timeline records from localStorage or seed initial data
   */
  loadRecords() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read records from localStorage:", e);
    }

    // Default Seed Data showing a realistic health journey
    return [
      {
        id: "rec-1",
        date: "2026-09-05",
        title: "Echocardiogram & Cardiac Stress Evaluation",
        category: "Imaging & Scans",
        doctor: "Dr. Sarah Al-Mansoor, MD (Cardiology)",
        facility: "Heart & Vascular Specialty Institute",
        summary: "Normal left ventricular ejection fraction (60-65%). Mild concentric left ventricular thickening related to chronic high blood pressure.",
        metrics: [
          { name: "Ejection Fraction", value: "62", unit: "%", status: "Normal" },
          { name: "Blood Pressure", value: "134/86", unit: "mmHg", status: "Attention" }
        ],
        tags: ["Heart", "Echo", "LVEF", "Hypertension"],
        reportText: "Transthoracic echocardiogram showed preserved EF 60-65% with mild LVH."
      },
      {
        id: "rec-2",
        date: "2026-06-18",
        title: "Lumbar Spine MRI (Lower Back & Sciatica)",
        category: "Imaging & Scans",
        doctor: "Dr. Marcus Chen, MD (Radiology)",
        facility: "Advanced Spine & Orthopedic Imaging Center",
        summary: "L4-L5 disc extrusion (4.5 mm) causing left L5 nerve root impingement and sciatica. Central spinal canal remains patent.",
        metrics: [
          { name: "Disc Extrusion Size", value: "4.5", unit: "mm", status: "Attention" }
        ],
        tags: ["Spine", "MRI", "Sciatica", "L4-L5"],
        reportText: "L4-L5 left paracentral disc herniation impinging traversing L5 nerve."
      },
      {
        id: "rec-3",
        date: "2026-04-12",
        title: "Annual Comprehensive Lab Panel (CMP & CBC)",
        category: "Lab Tests",
        doctor: "Dr. Evelyn Vance, MD (Internal Medicine)",
        facility: "Metro Health Diagnostic Center",
        summary: "Mild iron deficiency anemia (Hemoglobin 11.6, Ferritin 14). Fasting glucose 114 mg/dL and HbA1c 5.9% in prediabetes range. Kidneys normal.",
        metrics: [
          { name: "Fasting Glucose", value: "114", unit: "mg/dL", status: "Attention" },
          { name: "HbA1c", value: "5.9", unit: "%", status: "Attention" },
          { name: "Hemoglobin", value: "11.6", unit: "g/dL", status: "Attention" },
          { name: "Ferritin", value: "14", unit: "ng/mL", status: "Attention" },
          { name: "eGFR", value: ">90", unit: "mL/min", status: "Normal" }
        ],
        tags: ["Blood Test", "Anemia", "Glucose", "Iron", "CMP"],
        reportText: "CBC and CMP revealed microcytic anemia, prediabetes, and healthy kidneys."
      },
      {
        id: "rec-4",
        date: "2025-11-20",
        title: "Prescription: Iron Bisglycinate & Dietary Plan",
        category: "Prescriptions",
        doctor: "Dr. Evelyn Vance, MD",
        facility: "Metro Health Primary Care",
        summary: "Initiated gentle oral iron chelate 25mg daily with 500mg Vitamin C to address low ferritin and mild fatigue.",
        metrics: [
          { name: "Ferritin Target", value: "50+", unit: "ng/mL", status: "Normal" }
        ],
        tags: ["Prescription", "Iron", "Supplements", "Anemia"],
        reportText: "Ferrous bisglycinate 25 mg daily with citrus."
      },
      {
        id: "rec-5",
        date: "2025-08-14",
        title: "Primary Care Wellness Visit & Vitals",
        category: "Doctor Visits",
        doctor: "Dr. Evelyn Vance, MD",
        facility: "Metro Health Primary Care",
        summary: "Baseline physical exam. Blood pressure measured at 138/88 mmHg. Discussed weight management and scheduled routine baseline labs.",
        metrics: [
          { name: "Blood Pressure", value: "138/88", unit: "mmHg", status: "Attention" },
          { name: "Weight", value: "78.5", unit: "kg", status: "Normal" },
          { name: "Pulse", value: "72", unit: "bpm", status: "Normal" }
        ],
        tags: ["Checkup", "Vitals", "Blood Pressure", "Wellness"],
        reportText: "Annual physical exam; recommended dietary moderation."
      }
    ];
  }

  /**
   * Save records to browser localStorage
   */
  saveRecords() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.records));
    } catch (e) {
      console.error("Failed to save timeline to localStorage:", e);
    }
  }

  /**
   * Add a new medical record to the timeline
   */
  addRecord(record) {
    if (!record.id) {
      record.id = "rec-" + Date.now();
    }
    if (!record.date) {
      record.date = new Date().toISOString().split("T")[0];
    }
    this.records.unshift(record);
    this.saveRecords();
    return record;
  }

  /**
   * Remove a record by ID
   */
  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    this.saveRecords();
  }

  /**
   * Update an existing record
   */
  updateRecord(id, updatedFields) {
    const idx = this.records.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.records[idx] = { ...this.records[idx], ...updatedFields };
      this.saveRecords();
      return this.records[idx];
    }
    return null;
  }

  /**
   * Get filtered and sorted records for display
   */
  getFilteredRecords() {
    return this.records
      .filter(record => {
        // Filter by category
        if (this.activeFilter !== "All" && record.category !== this.activeFilter) {
          return false;
        }

        // Filter by search query
        if (this.searchQuery && this.searchQuery.trim() !== "") {
          const query = this.searchQuery.toLowerCase();
          const matchTitle = (record.title || "").toLowerCase().includes(query);
          const matchSummary = (record.summary || "").toLowerCase().includes(query);
          const matchDoctor = (record.doctor || "").toLowerCase().includes(query);
          const matchFacility = (record.facility || "").toLowerCase().includes(query);
          const matchTags = (record.tags || []).some(t => t.toLowerCase().includes(query));
          const matchMetrics = (record.metrics || []).some(m => m.name.toLowerCase().includes(query));
          if (!matchTitle && !matchSummary && !matchDoctor && !matchFacility && !matchTags && !matchMetrics) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return this.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }

  /**
   * Extract all historical metrics for longitudinal trend analysis
   */
  getTrackedMetricHistory(metricName) {
    const query = metricName.toLowerCase();
    const history = [];

    // Sort chronologically ascending for trends
    const sorted = [...this.records].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(record => {
      if (record.metrics && Array.isArray(record.metrics)) {
        record.metrics.forEach(m => {
          if (m.name.toLowerCase().includes(query)) {
            history.push({
              date: record.date,
              eventTitle: record.title,
              name: m.name,
              value: m.value,
              unit: m.unit,
              status: m.status
            });
          }
        });
      }
    });

    return history;
  }

  /**
   * Export all records as a JSON string for user backup
   */
  exportJSON() {
    return JSON.stringify(this.records, null, 2);
  }

  /**
   * Import records from an uploaded JSON file
   */
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        this.records = parsed;
        this.saveRecords();
        return { success: true, count: parsed.length };
      }
      return { success: false, error: "JSON must be an array of records." };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Reset timeline back to default sample records
   */
  resetToSampleData() {
    localStorage.removeItem(this.storageKey);
    this.records = this.loadRecords();
    this.saveRecords();
  }
}

// Global instance
const timelineManager = new TimelineManager();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TimelineManager, timelineManager };
}
