# 🏥 MedClarify AI — Medical Report Simplifier & Health Timeline

> **A single-file, zero-dependency, open-source web application powered by Google Gemini that translates complex clinical reports into compassionate, everyday language, cross-references a preloaded medical terminology dictionary, and tracks your health journey in an organized timeline.**

---

## ✨ Features at a Glance

- **🤖 Google Gemini AI Report Simplifier**:
  - Translates dense clinical jargon into friendly 5th-grade everyday language.
  - Highlights *The Big Picture*, *Key Findings & Lab Values Table* with color-coded status badges (`Normal`, `Attention`, `Critical`).
  - Outlines *What This Means for Daily Life* (diet, physical activity, precautions).
  - Detects *Red Flags & Warning Signs* requiring prompt medical care.
  - Generates 3–5 smart *Questions to Ask Your Doctor*.
  - **Interactive Follow-up Chat**: Ask Gemini specific questions directly about your report.
  - **Demo Mode**: Includes 1-click sample reports (Blood Panel, Lumbar MRI, Heart Echo) to test offline or without an API key.

- **📚 Preloaded Medical Terminology Knowledge Base**:
  - 150+ medical tests, blood markers, imaging terms, prefixes, suffixes, and prescription shorthand preloaded.
  - **Automatic In-Line Highlighting**: Scans reports and underlines medical terms; click or hover any term for an instant popup card with everyday explanations and normal reference ranges.
  - Built-in search and category filtering (CBC, Metabolic, Lipids, Radiology, Prescriptions).
  - Ability to add your own custom terms.

- **📅 Chronological Medical Timeline**:
  - Automatically imports events from analyzed reports or allows manual record entry.
  - Categorizes into 🔬 Lab Tests, 🩻 Imaging & Scans, 🩺 Doctor Consultations, 💊 Prescriptions, and 🏥 Hospitalizations.
  - **Biomarker Trends Strip**: Tracks Fasting Glucose, HbA1c, Blood Pressure, and Ferritin over time.
  - **100% Private**: Stores all data strictly in your browser's local storage.
  - Backup & restore your timeline via JSON files.
  - Clean, printer-friendly layout for doctor appointments.

- **🎨 Easily Customizable UI (Only by You)**:
  - In-app **UI Customizer Tab**: Select from 5 theme presets (*Clinical Teal*, *Royal Indigo*, *Emerald Wellness*, *Midnight Luxury*, *Soft Rose*).
  - Change App Title, Version Badge, Tagline, and Owner Name with live preview.
  - Single-file structure: tweak CSS variables and the `UI_CONFIG` object directly in code without touching complicated dependencies.

---

## 🚀 Live Deployment on GitHub Pages (In 60 Seconds)

Because this entire app is **100% self-contained in `index.html`**, you can host it for free on GitHub Pages without any build steps or node modules:

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `medical-report-simplifier`).
2. Push this file to your repository:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Initial commit: MedClarify AI single-file web app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings** → **Pages**.
4. Under **Branch**, select `main` and root (`/`), then click **Save**.
5. Your live app is now accessible at:  
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

---

## 💻 Running Locally

### Method 1: Just Double Click!
Simply double-click `index.html` in your file explorer. It will open directly in Chrome, Microsoft Edge, Firefox, or Safari.

### Method 2: Local HTTP Server (Optional)
If you prefer running via a local web server:
```bash
# Using Python
python -m http.server 3000

# Or using Node.js / npx
npx serve .
```
Then open `http://localhost:3000` in your browser.

---

## 🔑 Adding Your Google Gemini API Key

1. Generate a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click the **"Gemini API"** button in the top navigation bar of the app.
3. Paste your key and choose your preferred model (`Gemini 2.5 Flash`, `Gemini 1.5 Flash`, or `Gemini 1.5 Pro`).
4. Click **Save & Connect**. The indicator dot turns green.
*(Your key is stored only in your local browser storage and is never transmitted to any third-party servers).*

---

## 🛠️ Code Structure

Everything lives cleanly in [`index.html`](index.html):
- **Lines 1–150**: HTML Head, CSS variables (`:root`), print styles, and responsive layout.
- **Lines 150–450**: Semantic interface layout (Header, Simplifier, Timeline, Dictionary, Customizer, and Modals).
- **Lines 450–900**: 
  - `UI_CONFIG`: Theme presets, colors, branding labels, and feature toggles.
  - `MEDICAL_TERMINOLOGY_DATABASE`: 150+ plain-English medical definitions.
  - `SAMPLE_REPORTS`: Preloaded test reports.
  - `GeminiService`: Google Gemini REST API integration and chat assistant.
  - `TimelineManager`: Local storage persistence, search, filtering, and export/import.
  - `AppController`: Event listeners, DOM manipulation, and tooltip popover positioning.

---

## 🔒 Privacy & Medical Disclaimer

- **Privacy**: All personal medical records, timeline events, and API keys are stored exclusively in your browser's `localStorage`. No data is saved to any remote backend.
- **Medical Disclaimer**: MedClarify AI is an educational patient-advocacy tool. It does not provide medical diagnoses or replace the professional judgment of a licensed healthcare provider. Always consult your physician regarding any medical condition or treatment plan.
