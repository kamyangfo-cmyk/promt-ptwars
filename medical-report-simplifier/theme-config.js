/**
 * ==============================================================================
 *  MEDCLARIFY - UI & THEME CONFIGURATION FILE
 * ==============================================================================
 *  This file is specifically created for YOU to easily customize the entire UI,
 *  colors, branding, fonts, and features without having to touch complex code.
 *
 *  HOW TO CUSTOMIZE:
 *  1. Change the values below to match your preferred style.
 *  2. You can also customize these live inside the app using the "UI Customizer" tab.
 *  3. Save this file and refresh your browser!
 * ==============================================================================
 */

const UI_CONFIG = {
  // ----------------------------------------------------------------------------
  // 1. BRANDING & TEXT LABELS
  // ----------------------------------------------------------------------------
  branding: {
    // The main title shown in the top navigation bar and browser tab
    appName: "MedClarify AI",
    
    // Tagline / Subtitle shown below the logo
    appTagline: "AI Medical Report Simplifier & Health Timeline",
    
    // Personalized greeting or profile name (e.g. "My Health Dashboard", "Jane Doe")
    ownerName: "Personal Health Portal",
    
    // Badge text next to the logo
    versionBadge: "v2.0 Pro",
    
    // Footer copyright / disclaimer notice
    footerDisclaimer: "Educational tool powered by Google Gemini. Always consult a licensed healthcare professional for medical decisions."
  },

  // ----------------------------------------------------------------------------
  // 2. THEME & COLOR PALETTES
  // ----------------------------------------------------------------------------
  // Active Theme preset: 'clinical-teal' | 'royal-indigo' | 'emerald-wellness' | 'midnight-dark' | 'soft-rose'
  activeTheme: "clinical-teal",

  // Color Definitions for Presets (Hex or RGB values)
  themes: {
    "clinical-teal": {
      name: "Clinical Teal (Fresh Medical)",
      primary: "#0d9488",        // Teal-600
      primaryHover: "#0f766e",   // Teal-700
      primaryLight: "#ccfbf1",   // Teal-100
      accent: "#0284c7",         // Sky-600
      bgBody: "#f8fafc",         // Slate-50
      bgCard: "#ffffff",         // White
      textMain: "#0f172a",       // Slate-900
      textMuted: "#64748b",      // Slate-500
      borderColor: "#e2e8f0"     // Slate-200
    },
    "royal-indigo": {
      name: "Royal Indigo (Modern & Sleek)",
      primary: "#4f46e5",        // Indigo-600
      primaryHover: "#4338ca",   // Indigo-700
      primaryLight: "#e0e7ff",   // Indigo-100
      accent: "#06b6d4",         // Cyan-500
      bgBody: "#f8fafc",         // Slate-50
      bgCard: "#ffffff",         // White
      textMain: "#0f172a",       // Slate-900
      textMuted: "#64748b",      // Slate-500
      borderColor: "#e2e8f0"     // Slate-200
    },
    "emerald-wellness": {
      name: "Emerald Wellness (Calm Organic)",
      primary: "#059669",        // Emerald-600
      primaryHover: "#047857",   // Emerald-700
      primaryLight: "#d1fae5",   // Emerald-100
      accent: "#10b981",         // Emerald-500
      bgBody: "#fbfcf8",         // Warm white
      bgCard: "#ffffff",         // White
      textMain: "#1c1917",       // Stone-900
      textMuted: "#78716c",      // Stone-500
      borderColor: "#e7e5e4"     // Stone-200
    },
    "midnight-dark": {
      name: "Midnight Luxury (Dark Mode)",
      primary: "#38bdf8",        // Light Sky
      primaryHover: "#0284c7",   // Sky-600
      primaryLight: "#0f2d42",   // Deep Sky Navy
      accent: "#818cf8",         // Indigo-400
      bgBody: "#0b1120",         // Very dark navy
      bgCard: "#131d31",         // Dark blue slate
      textMain: "#f1f5f9",       // Slate-100
      textMuted: "#94a3b8",      // Slate-400
      borderColor: "#1e293b"     // Slate-800
    },
    "soft-rose": {
      name: "Soft Rose (Empathetic Care)",
      primary: "#e11d48",        // Rose-600
      primaryHover: "#be123c",   // Rose-700
      primaryLight: "#ffe4e6",   // Rose-100
      accent: "#8b5cf6",         // Purple-500
      bgBody: "#fffbfa",         // Warm light
      bgCard: "#ffffff",         // White
      textMain: "#1f2937",       // Gray-800
      textMuted: "#6b7280",      // Gray-500
      borderColor: "#f3f4f6"     // Gray-200
    }
  },

  // ----------------------------------------------------------------------------
  // 3. UI LAYOUT & STYLE PREFERENCES
  // ----------------------------------------------------------------------------
  styling: {
    // Corner roundedness: 'none' | 'small' | 'medium' | 'large' | 'full'
    borderRadius: "large",
    
    // Font family choice: 'Inter, sans-serif' | 'system-ui' | 'Roboto' | 'Poppins'
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    
    // UI Density: 'comfortable' (more padding) or 'compact' (tighter view)
    uiDensity: "comfortable",
    
    // Enable glowing status indicators for abnormal lab values
    enableGlowEffects: true,
    
    // Show quick sample reports buttons for testing
    showSampleReports: true
  },

  // ----------------------------------------------------------------------------
  // 4. GEMINI AI ASSISTANT SETTINGS
  // ----------------------------------------------------------------------------
  aiDefaults: {
    // Default Gemini model to use for report analysis
    // Recommended models: 'gemini-2.5-flash' or 'gemini-1.5-flash' (fast & free tier friendly)
    defaultModel: "gemini-2.5-flash",
    
    // Target reading level for simplification:
    // '5th-grade' (ultra-simple, conversational, everyday metaphors)
    // 'high-school' (clear & balanced, keeping formal terms with definitions)
    // 'detailed' (comprehensive clinical overview translated for educated patients)
    simplificationLevel: "5th-grade",
    
    // Creativity / hallucination prevention: 0.2 (more factual) to 0.7 (more creative)
    temperature: 0.2,
    
    // Maximum output tokens
    maxOutputTokens: 3500
  },

  // ----------------------------------------------------------------------------
  // 5. FEATURE TOGGLES (TURN FEATURES ON OR OFF)
  // ----------------------------------------------------------------------------
  features: {
    // Automatically detect and highlight medical terms with interactive tooltip explanations
    enablePreloadedTerminologyHighlights: true,
    
    // Enable interactive Q&A assistant to ask follow-up questions on reports
    enableReportChatAssistant: true,
    
    // Enable automated timeline event extraction from analyzed reports
    enableAutoTimelineSync: true,
    
    // Enable print & PDF export of simplified reports and timeline
    enableExportPrint: true,
    
    // Enable blood test lab range status badges (Normal, High, Low, Critical)
    enableLabFlagBadges: true,
    
    // Enable doctor questions generator (lists 3-5 smart questions for your next appointment)
    enableDoctorQuestions: true
  }
};

// Export configuration for browser or Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = UI_CONFIG;
}
