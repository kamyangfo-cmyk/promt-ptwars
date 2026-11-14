/**
 * ==============================================================================
 *  MEDCLARIFY - MAIN APPLICATION CONTROLLER (APP.JS)
 * ==============================================================================
 *  Orchestrates the entire application:
 *  1. Dynamic UI Theme & Customization Engine (customizable by the user)
 *  2. Medical Report Simplifier with Google Gemini AI
 *  3. In-line Medical Terminology Highlighter & Tooltip Popovers
 *  4. Medical Timeline & Health Journey Tracker
 *  5. Medical Dictionary Explorer & Custom Term Manager
 * ==============================================================================
 */

// Global State
const AppState = {
  currentTab: "simplifier",
  currentAnalysis: null,
  activeReportText: "",
  activePopoverTerm: null
};

// ==============================================================================
// 1. INITIALIZATION & THEME ENGINE
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Load and apply theme & UI configuration
  initThemeAndBranding();

  // Setup navigation tabs
  initNavigation();

  // Setup Report Simplifier events
  initSimplifierEvents();

  // Setup Timeline events & initial render
  initTimelineEvents();
  renderTimeline();

  // Setup Dictionary events & initial render
  initDictionaryEvents();
  renderDictionary();

  // Setup UI Customizer panel
  initCustomizerPanel();

  // Setup Modals (API key, Add Record, Add Term)
  initModals();

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});

/**
 * Initializes theme colors, fonts, branding, and CSS variables from theme-config.js
 * or user saved preferences in localStorage
 */
function initThemeAndBranding() {
  // Check if user has saved custom UI config in localStorage
  let config = UI_CONFIG;
  try {
    const savedConfig = localStorage.getItem("medclarify_user_ui_config");
    if (savedConfig) {
      config = JSON.parse(savedConfig);
    }
  } catch (e) {
    console.warn("Using default theme configuration.");
  }

  // 1. Apply active theme colors to CSS Variables
  const activeThemeKey = config.activeTheme || "clinical-teal";
  const themeColors = config.themes[activeThemeKey] || config.themes["clinical-teal"];

  const root = document.documentElement;
  root.style.setProperty("--primary", themeColors.primary);
  root.style.setProperty("--primary-hover", themeColors.primaryHover);
  root.style.setProperty("--primary-light", themeColors.primaryLight);
  root.style.setProperty("--accent", themeColors.accent);
  root.style.setProperty("--bg-body", themeColors.bgBody);
  root.style.setProperty("--bg-card", themeColors.bgCard);
  root.style.setProperty("--text-main", themeColors.textMain);
  root.style.setProperty("--text-muted", themeColors.textMuted);
  root.style.setProperty("--border-color", themeColors.borderColor);

  // Apply font family and border radius
  if (config.styling?.fontFamily) {
    root.style.setProperty("--font-family", config.styling.fontFamily);
  }

  // 2. Apply branding labels to DOM
  const b = config.branding || {};
  document.title = `${b.appName || "MedClarify AI"} - Medical Report Simplifier`;
  
  const elAppName = document.getElementById("brand-app-name");
  if (elAppName) elAppName.textContent = b.appName || "MedClarify AI";

  const elAppTagline = document.getElementById("brand-app-tagline");
  if (elAppTagline) elAppTagline.textContent = b.appTagline || "AI Medical Report Simplifier & Health Timeline";

  const elVersion = document.getElementById("brand-version-badge");
  if (elVersion) elVersion.textContent = b.versionBadge || "v2.0 Pro";

  const elDisclaimer = document.getElementById("footer-disclaimer-text");
  if (elDisclaimer && b.footerDisclaimer) elDisclaimer.textContent = b.footerDisclaimer;

  const elOwner = document.getElementById("footer-owner-branding");
  if (elOwner && b.ownerName) elOwner.textContent = b.ownerName;

  // 3. Update API Key status indicator
  updateApiStatusIndicator();
}

/**
 * Updates the API status indicator dot in the header
 */
function updateApiStatusIndicator() {
  const dot = document.getElementById("api-status-dot");
  const label = document.getElementById("api-status-label");
  if (!dot) return;

  if (geminiService.hasApiKey()) {
    dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
    if (label) label.textContent = "Gemini Ready";
  } else {
    dot.className = "w-2.5 h-2.5 rounded-full bg-amber-400";
    if (label) label.textContent = "Demo Mode";
  }
}

// ==============================================================================
// 2. NAVIGATION MANAGEMENT
// ==============================================================================
function initNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Brand logo click goes to simplifier
  document.getElementById("nav-brand-logo")?.addEventListener("click", () => switchTab("simplifier"));

  // Quick print button
  document.getElementById("btn-quick-print")?.addEventListener("click", () => window.print());
}

function switchTab(tabId) {
  AppState.currentTab = tabId;

  // Update nav buttons appearance
  document.querySelectorAll(".nav-tab").forEach(tab => {
    const isTarget = tab.getAttribute("data-tab") === tabId;
    if (isTarget) {
      tab.classList.remove("text-slate-600", "font-medium");
      tab.classList.add("bg-white", "text-teal-700", "font-semibold", "shadow-sm");
    } else {
      tab.classList.remove("bg-white", "text-teal-700", "font-semibold", "shadow-sm");
      tab.classList.add("text-slate-600", "font-medium");
    }
  });

  // Hide all sections, show active
  const views = ["simplifier", "timeline", "dictionary", "customizer"];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === tabId) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  });

  // Re-run specific renders if needed
  if (tabId === "timeline") {
    renderTimeline();
  } else if (tabId === "dictionary") {
    renderDictionary();
  }

  // Refresh icons
  if (window.lucide) lucide.createIcons();
}

// ==============================================================================
// 3. REPORT SIMPLIFIER & GEMINI AI CONTROLLER
// ==============================================================================
function initSimplifierEvents() {
  const textarea = document.getElementById("report-input-text");
  const charCounter = document.getElementById("input-char-count");
  const btnSimplify = document.getElementById("btn-simplify-report");
  const btnClear = document.getElementById("btn-clear-input");

  // Character counter
  textarea?.addEventListener("input", () => {
    const count = textarea.value.length;
    if (charCounter) charCounter.textContent = `${count} characters`;
  });

  // Clear button
  btnClear?.addEventListener("click", () => {
    if (textarea) textarea.value = "";
    if (charCounter) charCounter.textContent = "0 characters";
    document.getElementById("simplifier-results")?.classList.add("hidden");
  });

  // Sample report buttons
  document.querySelectorAll(".btn-load-sample").forEach(btn => {
    btn.addEventListener("click", () => {
      const sampleId = btn.getAttribute("data-sample");
      const sample = SAMPLE_REPORTS.find(s => s.id === sampleId);
      if (sample && textarea) {
        textarea.value = sample.text;
        if (charCounter) charCounter.textContent = `${sample.text.length} characters`;
        // Scroll smoothly to textarea
        textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  // File upload trigger
  const fileInput = document.getElementById("file-upload-input");
  document.getElementById("btn-trigger-upload")?.addEventListener("click", () => fileInput?.click());
  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (textarea) {
        textarea.value = event.target.result;
        if (charCounter) charCounter.textContent = `${textarea.value.length} characters`;
      }
    };
    reader.readAsText(file);
  });

  // Simplify Report Action
  btnSimplify?.addEventListener("click", handleSimplifyAction);

  // Add to timeline button
  document.getElementById("btn-add-to-timeline")?.addEventListener("click", handleAddToTimelineFromResults);

  // Print report button
  document.getElementById("btn-print-report")?.addEventListener("click", () => window.print());

  // Follow-up chat form
  document.getElementById("report-chat-form")?.addEventListener("submit", handleReportChatSubmit);

  // Setup click listener to close terminology popover when clicking outside
  document.addEventListener("click", (e) => {
    const popover = document.getElementById("terminology-popover");
    if (popover && !popover.contains(e.target) && !e.target.classList.contains("med-term-highlight")) {
      popover.classList.add("hidden");
      popover.classList.remove("active");
    }
  });

  document.getElementById("btn-close-popover")?.addEventListener("click", () => {
    const popover = document.getElementById("terminology-popover");
    popover?.classList.add("hidden");
    popover?.classList.remove("active");
  });
}

/**
 * Executes report analysis via GeminiService
 */
async function handleSimplifyAction() {
  const textarea = document.getElementById("report-input-text");
  const reportText = (textarea?.value || "").trim();

  if (!reportText) {
    alert("Please enter or paste a medical report first, or select one of the sample buttons!");
    return;
  }

  const readingLevel = document.getElementById("select-reading-level")?.value || "5th-grade";
  const loadingEl = document.getElementById("simplifier-loading");
  const resultsEl = document.getElementById("simplifier-results");

  // Show loading spinner
  loadingEl?.classList.remove("hidden");
  resultsEl?.classList.add("hidden");
  loadingEl?.scrollIntoView({ behavior: "smooth", block: "center" });

  try {
    AppState.activeReportText = reportText;
    const analysis = await geminiService.simplifyReport(reportText, readingLevel);
    AppState.currentAnalysis = analysis;

    // Render results
    renderSimplificationResults(analysis);

    // Hide loader, show results
    loadingEl?.classList.add("hidden");
    resultsEl?.classList.remove("hidden");
    resultsEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    loadingEl?.classList.add("hidden");
    alert("An error occurred while simplifying the report: " + error.message);
  }
}

/**
 * Renders the structured simplification results into the DOM
 */
function renderSimplificationResults(data) {
  // Demo mode badge
  const demoBadge = document.getElementById("demo-mode-badge");
  if (demoBadge) {
    demoBadge.classList.toggle("hidden", !data._isDemo);
  }

  // 1. Executive Summary with Preloaded Terminology Highlighting
  const summaryContainer = document.getElementById("result-summary-text");
  if (summaryContainer) {
    const highlightedHtml = highlightMedicalTerminology(data.summary || "");
    summaryContainer.innerHTML = `<p>${highlightedHtml.replace(/\n\n/g, "</p><p>")}</p>`;
    // Bind click handlers to newly inserted term highlights
    bindTerminologyHighlights(summaryContainer);
  }

  // 2. Key Findings & Lab Values Table
  const tbody = document.getElementById("result-findings-tbody");
  if (tbody) {
    tbody.innerHTML = "";
    (data.keyFindings || []).forEach(item => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50/80 transition-colors";

      let statusBadge = "";
      if (item.status === "Critical") {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-bold status-badge-critical">Critical</span>`;
      } else if (item.status === "Attention") {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold status-badge-attention">Attention</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold status-badge-normal">Normal</span>`;
      }

      // Highlight any medical terms in plain English explanation as well
      const termHighlighted = highlightMedicalTerminology(item.plainEnglish || "");

      tr.innerHTML = `
        <td class="py-3 px-4 font-semibold text-slate-800">${escapeHtml(item.testOrFinding)}</td>
        <td class="py-3 px-4 font-mono text-xs text-slate-700">${escapeHtml(item.resultValue)}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-slate-600 leading-relaxed">${termHighlighted}</td>
      `;
      tbody.appendChild(tr);
    });
    bindTerminologyHighlights(tbody);
  }

  // 3. Daily Life & Lifestyle Impact
  const lifestyleList = document.getElementById("result-lifestyle-list");
  if (lifestyleList) {
    lifestyleList.innerHTML = "";
    (data.lifestyleImpact || []).forEach(point => {
      const li = document.createElement("li");
      li.className = "flex items-start space-x-2";
      li.innerHTML = `
        <span class="text-emerald-500 font-bold mt-0.5">•</span>
        <span class="leading-relaxed">${highlightMedicalTerminology(point)}</span>
      `;
      lifestyleList.appendChild(li);
    });
    bindTerminologyHighlights(lifestyleList);
  }

  // 4. Questions to Ask Your Doctor
  const questionsList = document.getElementById("result-questions-list");
  if (questionsList) {
    questionsList.innerHTML = "";
    (data.doctorQuestions || []).forEach((q, idx) => {
      const li = document.createElement("li");
      li.className = "flex items-start space-x-2 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 text-indigo-950";
      li.innerHTML = `
        <span class="font-bold text-indigo-600 text-xs shrink-0 mt-0.5">Q${idx + 1}:</span>
        <span class="leading-relaxed text-xs">${escapeHtml(q)}</span>
      `;
      questionsList.appendChild(li);
    });
  }

  // 5. Red Flags Warning Box
  const redFlagsCard = document.getElementById("result-red-flags-card");
  const redFlagsContent = document.getElementById("result-red-flags-content");
  if (redFlagsCard && redFlagsContent) {
    if (data.redFlags && data.redFlags.length > 0) {
      redFlagsCard.classList.remove("hidden");
      redFlagsContent.innerHTML = data.redFlags.map(rf => `<p class="mb-1">• ${escapeHtml(rf)}</p>`).join("");
    } else {
      redFlagsCard.classList.add("hidden");
    }
  }

  // Reinitialize icons in new content
  if (window.lucide) lucide.createIcons();
}

/**
 * Scans text and wraps medical terms with interactive tooltip highlight tags
 */
function highlightMedicalTerminology(text) {
  if (!text) return "";
  const allTerms = TerminologyService.getAllTerms();

  // Create an array of all terms and aliases sorted by longest first to avoid partial replacements
  const matchCandidates = [];
  allTerms.forEach(item => {
    matchCandidates.push({ searchWord: item.term.split("(")[0].trim(), item });
    item.aliases.forEach(alias => {
      if (alias.length > 2) {
        matchCandidates.push({ searchWord: alias.trim(), item });
      }
    });
  });

  // Sort by word length descending
  matchCandidates.sort((a, b) => b.searchWord.length - a.searchWord.length);

  // Escape HTML first
  let processed = escapeHtml(text);

  // Replace unique terms
  const seenTermIds = new Set();

  matchCandidates.forEach(({ searchWord, item }) => {
    // Only highlight each term id at most 2 times per section to avoid clutter
    if (seenTermIds.has(item.id)) return;

    // Word boundary regex case-insensitive
    const escaped = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');

    if (regex.test(processed)) {
      processed = processed.replace(regex, (match) => {
        seenTermIds.add(item.id);
        return `<span class="med-term-highlight" data-term-id="${item.id}" title="Click to view definition">${match}</span>`;
      });
    }
  });

  return processed;
}

/**
 * Attach click handlers to rendered term highlights to show the popover
 */
function bindTerminologyHighlights(container) {
  const highlights = container.querySelectorAll(".med-term-highlight");
  highlights.forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const termId = el.getAttribute("data-term-id");
      showTerminologyPopover(termId, el);
    });
  });
}

/**
 * Position and display the Terminology Popover near the target element
 */
function showTerminologyPopover(termId, targetElement) {
  const termData = TerminologyService.lookup(termId);
  if (!termData) return;

  const popover = document.getElementById("terminology-popover");
  if (!popover) return;

  document.getElementById("popover-term-title").textContent = termData.term;
  document.getElementById("popover-term-category").textContent = termData.category;
  document.getElementById("popover-term-plain").textContent = termData.plainEnglish;
  
  const rangeEl = document.getElementById("popover-term-range");
  const rangeWrapper = document.getElementById("popover-term-range-wrapper");
  if (termData.normalRange && termData.normalRange !== "Descriptive medical terms") {
    rangeWrapper?.classList.remove("hidden");
    if (rangeEl) rangeEl.textContent = termData.normalRange;
  } else {
    rangeWrapper?.classList.add("hidden");
  }

  // Calculate coordinates
  const rect = targetElement.getBoundingClientRect();
  const popoverWidth = 320;
  
  let left = rect.left + window.scrollX;
  if (left + popoverWidth > window.innerWidth - 20) {
    left = window.innerWidth - popoverWidth - 20;
  }
  if (left < 10) left = 10;

  const top = rect.bottom + window.scrollY + 6;

  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  popover.classList.remove("hidden");
  
  // Trigger animation
  setTimeout(() => popover.classList.add("active"), 10);
  if (window.lucide) lucide.createIcons();
}

/**
 * Adds the currently simplified report event directly into the Medical Timeline
 */
function handleAddToTimelineFromResults() {
  if (!AppState.currentAnalysis) {
    alert("No active analysis found.");
    return;
  }

  const eventData = AppState.currentAnalysis.timelineEvent || {
    date: new Date().toISOString().split("T")[0],
    category: "Lab Tests",
    title: "Analyzed Medical Record",
    doctor: "Medical Provider",
    facility: "Health Clinic",
    summary: AppState.currentAnalysis.summary?.slice(0, 150) + "...",
    metrics: []
  };

  timelineManager.addRecord(eventData);
  alert("Record successfully added to your Medical Timeline!");
  switchTab("timeline");
}

/**
 * Handles follow-up conversational questions about the active report
 */
async function handleReportChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("report-chat-input");
  const question = (input?.value || "").trim();
  if (!question) return;

  const chatContainer = document.getElementById("report-chat-messages");

  // Append user message
  const userMsg = document.createElement("div");
  userMsg.className = "flex items-start justify-end space-x-2";
  userMsg.innerHTML = `
    <div class="bg-teal-600 text-white p-3 rounded-xl max-w-md text-xs sm:text-sm shadow-xs leading-relaxed">
      ${escapeHtml(question)}
    </div>
    <div class="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">YOU</div>
  `;
  chatContainer?.appendChild(userMsg);
  input.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Append typing indicator
  const typingMsg = document.createElement("div");
  typingMsg.id = "chat-typing-indicator";
  typingMsg.className = "flex items-start space-x-2.5 text-xs text-slate-400 italic";
  typingMsg.innerHTML = `<span>Gemini is thinking...</span>`;
  chatContainer?.appendChild(typingMsg);

  try {
    const answer = await geminiService.askFollowUpQuestion(AppState.activeReportText, question);
    typingMsg.remove();

    const botMsg = document.createElement("div");
    botMsg.className = "flex items-start space-x-2.5";
    botMsg.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">AI</div>
      <div class="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed shadow-xs max-w-xl">
        ${highlightMedicalTerminology(answer)}
      </div>
    `;
    chatContainer?.appendChild(botMsg);
    bindTerminologyHighlights(botMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (err) {
    typingMsg.remove();
  }
}

// ==============================================================================
// 4. MEDICAL TIMELINE CONTROLLER
// ==============================================================================
function initTimelineEvents() {
  // Category filter clicks
  document.querySelectorAll(".btn-timeline-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-timeline-filter").forEach(b => {
        b.className = "btn-timeline-filter px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100";
      });
      btn.className = "btn-timeline-filter px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white";
      timelineManager.activeFilter = btn.getAttribute("data-cat");
      renderTimeline();
    });
  });

  // Search input
  document.getElementById("timeline-search-input")?.addEventListener("input", (e) => {
    timelineManager.searchQuery = e.target.value;
    renderTimeline();
  });

  // Sort order toggle
  document.getElementById("btn-toggle-sort-order")?.addEventListener("click", () => {
    timelineManager.sortOrder = timelineManager.sortOrder === "desc" ? "asc" : "desc";
    const label = document.getElementById("sort-order-label");
    if (label) label.textContent = timelineManager.sortOrder === "desc" ? "Newest" : "Oldest";
    renderTimeline();
  });

  // Export JSON backup
  document.getElementById("btn-export-timeline-json")?.addEventListener("click", () => {
    const data = timelineManager.exportJSON();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medical-timeline-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import JSON backup
  const importInput = document.getElementById("import-timeline-file");
  document.getElementById("btn-trigger-import-json")?.addEventListener("click", () => importInput?.click());
  importInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = timelineManager.importJSON(event.target.result);
      if (res.success) {
        alert(`Successfully imported ${res.count} timeline records!`);
        renderTimeline();
      } else {
        alert("Import failed: " + res.error);
      }
    };
    reader.readAsText(file);
  });
}

/**
 * Renders timeline records and key indicator trends
 */
function renderTimeline() {
  const container = document.getElementById("timeline-events-container");
  if (!container) return;

  const records = timelineManager.getFilteredRecords();

  // 1. Render Metrics Strip
  renderTimelineMetricsStrip();

  // 2. Render Events
  // Preserve vertical line
  container.innerHTML = `<div class="timeline-stem"></div>`;

  if (records.length === 0) {
    container.innerHTML += `
      <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
        <p class="text-sm font-semibold text-slate-700">No medical events match your filter.</p>
        <p class="text-xs text-slate-400">Add a new record or adjust your search filter above.</p>
      </div>
    `;
    return;
  }

  // Category Icon & Color Mapping
  const categoryConfig = {
    "Lab Tests": { icon: "flask-conical", color: "bg-teal-500", text: "text-teal-700", bgLight: "bg-teal-50", border: "border-teal-200" },
    "Imaging & Scans": { icon: "scan", color: "bg-sky-500", text: "text-sky-700", bgLight: "bg-sky-50", border: "border-sky-200" },
    "Doctor Visits": { icon: "stethoscope", color: "bg-indigo-500", text: "text-indigo-700", bgLight: "bg-indigo-50", border: "border-indigo-200" },
    "Prescriptions": { icon: "pill", color: "bg-amber-500", text: "text-amber-700", bgLight: "bg-amber-50", border: "border-amber-200" },
    "Hospital & Surgeries": { icon: "cross", color: "bg-rose-500", text: "text-rose-700", bgLight: "bg-rose-50", border: "border-rose-200" }
  };

  records.forEach((record, index) => {
    const cat = categoryConfig[record.category] || categoryConfig["Lab Tests"];
    const formattedDate = new Date(record.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

    // Build metric pills
    let metricsHtml = "";
    if (record.metrics && record.metrics.length > 0) {
      metricsHtml = `<div class="flex flex-wrap gap-2 pt-2 border-t border-slate-100">`;
      record.metrics.forEach(m => {
        let badgeClass = "bg-slate-100 text-slate-700";
        if (m.status === "Attention") badgeClass = "bg-amber-100 text-amber-800 font-semibold";
        if (m.status === "Critical") badgeClass = "bg-red-100 text-red-800 font-bold";
        metricsHtml += `
          <div class="px-2.5 py-1 rounded-lg text-xs ${badgeClass} border border-slate-200/50 flex items-center space-x-1">
            <span>${escapeHtml(m.name)}:</span>
            <span class="font-bold">${escapeHtml(m.value)} ${escapeHtml(m.unit || "")}</span>
          </div>
        `;
      });
      metricsHtml += `</div>`;
    }

    const card = document.createElement("div");
    card.className = "relative flex items-start space-x-4";
    card.innerHTML = `
      <!-- Node Dot on Timeline Stem -->
      <div class="absolute -left-12 sm:-left-16 w-8 h-8 rounded-full ${cat.color} text-white flex items-center justify-center shadow-md ring-4 ring-white z-10">
        <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
      </div>

      <!-- Main Event Card -->
      <div class="timeline-card w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat.bgLight} ${cat.text} border ${cat.border}">
              ${escapeHtml(record.category)}
            </span>
            <span class="text-xs text-slate-400 font-mono font-medium">${formattedDate}</span>
          </div>
          <div class="flex items-center space-x-2 text-xs text-slate-500">
            <span>${escapeHtml(record.doctor || "")}</span>
            ${record.facility ? `<span class="hidden sm:inline">• ${escapeHtml(record.facility)}</span>` : ""}
            <button data-delete-id="${record.id}" class="btn-delete-record text-slate-400 hover:text-red-500 p-1" title="Delete record">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-base font-bold text-slate-900">${escapeHtml(record.title)}</h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">${highlightMedicalTerminology(record.summary)}</p>
        </div>

        ${metricsHtml}
      </div>
    `;

    container.appendChild(card);
  });

  // Attach delete handlers
  container.querySelectorAll(".btn-delete-record").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-delete-id");
      if (confirm("Are you sure you want to remove this record from your timeline?")) {
        timelineManager.deleteRecord(id);
        renderTimeline();
      }
    });
  });

  bindTerminologyHighlights(container);
  if (window.lucide) lucide.createIcons();
}

/**
 * Renders the top Key Health Indicators strip (Fasting Glucose, HbA1c, BP, Ferritin)
 */
function renderTimelineMetricsStrip() {
  const strip = document.getElementById("timeline-metrics-strip");
  if (!strip) return;

  const trackedNames = [
    { name: "Glucose", label: "Fasting Glucose", ideal: "70-99 mg/dL" },
    { name: "HbA1c", label: "Hemoglobin A1c", ideal: "<5.7%" },
    { name: "Blood Pressure", label: "Blood Pressure", ideal: "<120/80 mmHg" },
    { name: "Ferritin", label: "Serum Ferritin", ideal: "20-200 ng/mL" }
  ];

  strip.innerHTML = "";

  trackedNames.forEach(t => {
    const history = timelineManager.getTrackedMetricHistory(t.name);
    const latest = history[history.length - 1];

    let valDisplay = "No data yet";
    let statusClass = "bg-slate-50 text-slate-500 border-slate-200";
    let dateDisplay = "";

    if (latest) {
      valDisplay = `${latest.value} ${latest.unit || ""}`;
      dateDisplay = latest.date;
      if (latest.status === "Attention") {
        statusClass = "bg-amber-50 text-amber-800 border-amber-200";
      } else if (latest.status === "Critical") {
        statusClass = "bg-rose-50 text-rose-800 border-rose-200 font-bold";
      } else {
        statusClass = "bg-teal-50 text-teal-800 border-teal-200";
      }
    }

    const card = document.createElement("div");
    card.className = `p-3 rounded-xl border ${statusClass} flex flex-col justify-between`;
    card.innerHTML = `
      <div>
        <span class="text-[11px] font-semibold text-slate-500 block uppercase">${t.label}</span>
        <span class="text-base font-bold tracking-tight">${valDisplay}</span>
      </div>
      <div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Target: ${t.ideal}</span>
        <span>${dateDisplay}</span>
      </div>
    `;
    strip.appendChild(card);
  });
}

// ==============================================================================
// 5. PRELOADED MEDICAL TERMINOLOGY DICTIONARY CONTROLLER
// ==============================================================================
function initDictionaryEvents() {
  // Search input
  document.getElementById("dictionary-search-input")?.addEventListener("input", (e) => {
    renderDictionary(e.target.value);
  });

  // Render category buttons
  const catContainer = document.getElementById("dictionary-category-filters");
  if (catContainer) {
    const categories = ["All", ...TerminologyService.getCategories()];
    catContainer.innerHTML = "";
    categories.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.className = index === 0
        ? "btn-dict-cat px-3 py-1 rounded-lg text-xs font-semibold bg-teal-600 text-white"
        : "btn-dict-cat px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100";
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-dict-cat").forEach(b => {
          b.className = "btn-dict-cat px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100";
        });
        btn.className = "btn-dict-cat px-3 py-1 rounded-lg text-xs font-semibold bg-teal-600 text-white";
        renderDictionary("", cat === "All" ? "" : cat);
      });
      catContainer.appendChild(btn);
    });
  }
}

/**
 * Renders terminology cards based on search query or category filter
 */
function renderDictionary(searchQuery = "", categoryFilter = "") {
  const grid = document.getElementById("dictionary-cards-grid");
  const countEl = document.getElementById("dictionary-results-count");
  if (!grid) return;

  let terms = TerminologyService.search(searchQuery);
  if (categoryFilter) {
    terms = terms.filter(t => t.category === categoryFilter);
  }

  if (countEl) {
    countEl.textContent = `Showing ${terms.length} preloaded medical terms`;
  }

  grid.innerHTML = "";

  if (terms.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
        <p class="text-sm font-semibold text-slate-700">No medical terms found matching "${escapeHtml(searchQuery)}".</p>
        <p class="text-xs text-slate-400">Try searching for lab tests like 'Hemoglobin', 'Glucose', or prefixes like '-itis'.</p>
      </div>
    `;
    return;
  }

  terms.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition flex flex-col justify-between space-y-3";
    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-start justify-between">
          <h3 class="font-bold text-slate-900 text-base">${escapeHtml(item.term)}</h3>
          <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
            ${escapeHtml(item.category)}
          </span>
        </div>

        <div class="bg-teal-50/50 p-3 rounded-xl border border-teal-100/60">
          <span class="text-[11px] font-bold text-teal-900 block mb-1">Everyday Meaning:</span>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(item.plainEnglish)}</p>
        </div>
      </div>

      <div class="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
        <div class="flex items-start justify-between text-slate-600">
          <span class="font-medium text-slate-500">Normal Range:</span>
          <span class="font-mono text-right text-[11px] text-slate-700">${escapeHtml(item.normalRange)}</span>
        </div>
        <div class="text-[11px] text-slate-500 leading-normal">
          <span class="font-semibold text-slate-700">Why checked:</span> ${escapeHtml(item.whyItMatters)}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==============================================================================
// 6. UI CUSTOMIZER STUDIO (EXCLUSIVELY FOR USER)
// ==============================================================================
function initCustomizerPanel() {
  const config = UI_CONFIG;

  // Render Theme Preset Options
  const presetContainer = document.getElementById("theme-preset-cards");
  if (presetContainer) {
    presetContainer.innerHTML = "";
    Object.keys(config.themes).forEach(key => {
      const theme = config.themes[key];
      const isSelected = (config.activeTheme || "clinical-teal") === key;

      const card = document.createElement("div");
      card.className = `p-4 rounded-xl border cursor-pointer transition ${isSelected ? 'border-teal-600 bg-teal-50/30 ring-2 ring-teal-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`;
      card.setAttribute("data-theme-key", key);
      card.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-900">${theme.name}</span>
          ${isSelected ? `<span class="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">Active</span>` : ""}
        </div>
        <div class="flex items-center space-x-1.5">
          <div class="w-6 h-6 rounded-full border border-black/10" style="background-color: ${theme.primary}"></div>
          <div class="w-6 h-6 rounded-full border border-black/10" style="background-color: ${theme.accent}"></div>
          <div class="w-6 h-6 rounded-full border border-black/10" style="background-color: ${theme.bgBody}"></div>
        </div>
      `;

      card.addEventListener("click", () => {
        config.activeTheme = key;
        initCustomizerPanel();
        initThemeAndBranding();
      });

      presetContainer.appendChild(card);
    });
  }

  // Populate form fields with current values
  const appNameInput = document.getElementById("cust-app-name");
  if (appNameInput) appNameInput.value = config.branding.appName;

  const versionBadgeInput = document.getElementById("cust-version-badge");
  if (versionBadgeInput) versionBadgeInput.value = config.branding.versionBadge;

  const taglineInput = document.getElementById("cust-app-tagline");
  if (taglineInput) taglineInput.value = config.branding.appTagline;

  const ownerInput = document.getElementById("cust-owner-name");
  if (ownerInput) ownerInput.value = config.branding.ownerName;

  // Feature toggles
  const tTooltips = document.getElementById("toggle-term-tooltips");
  if (tTooltips) tTooltips.checked = config.features.enablePreloadedTerminologyHighlights;

  const tQuestions = document.getElementById("toggle-doctor-questions");
  if (tQuestions) tQuestions.checked = config.features.enableDoctorQuestions;

  const tTimeline = document.getElementById("toggle-auto-timeline");
  if (tTimeline) tTimeline.checked = config.features.enableAutoTimelineSync;

  const tChat = document.getElementById("toggle-chat-assistant");
  if (tChat) tChat.checked = config.features.enableReportChatAssistant;

  // Save Custom Settings Action
  document.getElementById("btn-save-custom-settings")?.addEventListener("click", () => {
    config.branding.appName = appNameInput.value || config.branding.appName;
    config.branding.versionBadge = versionBadgeInput.value || config.branding.versionBadge;
    config.branding.appTagline = taglineInput.value || config.branding.appTagline;
    config.branding.ownerName = ownerInput.value || config.branding.ownerName;

    config.features.enablePreloadedTerminologyHighlights = tTooltips.checked;
    config.features.enableDoctorQuestions = tQuestions.checked;
    config.features.enableAutoTimelineSync = tTimeline.checked;
    config.features.enableReportChatAssistant = tChat.checked;

    localStorage.setItem("medclarify_user_ui_config", JSON.stringify(config));
    initThemeAndBranding();
    alert("UI Customizations applied successfully!");
  });

  // Download theme-config.js file
  document.getElementById("btn-download-theme-config")?.addEventListener("click", () => {
    const fileContent = `/**
 * ==============================================================================
 *  MEDCLARIFY - UI & THEME CONFIGURATION FILE (EXPORTED)
 * ==============================================================================
 */
const UI_CONFIG = ${JSON.stringify(config, null, 2)};

if (typeof module !== "undefined" && module.exports) {
  module.exports = UI_CONFIG;
}
`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme-config.js";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Reset to defaults
  document.getElementById("btn-reset-theme-defaults")?.addEventListener("click", () => {
    if (confirm("Reset all UI settings and themes back to factory defaults?")) {
      localStorage.removeItem("medclarify_user_ui_config");
      location.reload();
    }
  });
}

// ==============================================================================
// 7. MODALS CONTROLLER (API KEY, ADD RECORD, ADD TERM)
// ==============================================================================
function initModals() {
  // Generic close handlers
  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#modal-api-key, #modal-add-record, #modal-add-term").forEach(m => m.classList.add("hidden"));
    });
  });

  // 1. API Key Modal
  const modalApiKey = document.getElementById("modal-api-key");
  const inputApiKey = document.getElementById("input-gemini-key");
  const selectModel = document.getElementById("select-modal-model");

  document.getElementById("btn-open-api-modal")?.addEventListener("click", () => {
    if (inputApiKey) inputApiKey.value = geminiService.apiKey || "";
    if (selectModel) selectModel.value = geminiService.model;
    modalApiKey?.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  });

  // Toggle API Key visibility
  document.getElementById("btn-toggle-key-visibility")?.addEventListener("click", () => {
    if (!inputApiKey) return;
    inputApiKey.type = inputApiKey.type === "password" ? "text" : "password";
  });

  // Save API Key
  document.getElementById("btn-save-api-key")?.addEventListener("click", () => {
    const key = (inputApiKey?.value || "").trim();
    geminiService.setApiKey(key);
    if (selectModel) geminiService.setModel(selectModel.value);
    modalApiKey?.classList.add("hidden");
    updateApiStatusIndicator();
    alert("Gemini API Key configuration updated!");
  });

  // Clear API Key
  document.getElementById("btn-clear-api-key")?.addEventListener("click", () => {
    geminiService.setApiKey("");
    if (inputApiKey) inputApiKey.value = "";
    modalApiKey?.classList.add("hidden");
    updateApiStatusIndicator();
  });

  // 2. Add Health Record Modal
  const modalAddRecord = document.getElementById("modal-add-record");
  document.getElementById("btn-open-add-record-modal")?.addEventListener("click", () => {
    document.getElementById("record-date").value = new Date().toISOString().split("T")[0];
    modalAddRecord?.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  });

  document.getElementById("form-add-timeline-record")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("record-date")?.value;
    const category = document.getElementById("record-category")?.value;
    const title = document.getElementById("record-title")?.value;
    const doctor = document.getElementById("record-doctor")?.value;
    const facility = document.getElementById("record-facility")?.value;
    const summary = document.getElementById("record-summary")?.value;

    const metricName = document.getElementById("record-metric-name")?.value;
    const metricValue = document.getElementById("record-metric-value")?.value;
    const metricStatus = document.getElementById("record-metric-status")?.value;

    const metrics = [];
    if (metricName && metricValue) {
      metrics.push({ name: metricName, value: metricValue, status: metricStatus });
    }

    timelineManager.addRecord({
      date, category, title, doctor, facility, summary, metrics
    });

    modalAddRecord?.classList.add("hidden");
    e.target.reset();
    renderTimeline();
  });

  // 3. Add Custom Term Modal
  const modalAddTerm = document.getElementById("modal-add-term");
  document.getElementById("btn-open-custom-term-modal")?.addEventListener("click", () => {
    modalAddTerm?.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  });

  document.getElementById("form-add-custom-term")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = document.getElementById("newterm-name")?.value;
    const category = document.getElementById("newterm-category")?.value;
    const plainEnglish = document.getElementById("newterm-plain")?.value;
    const normalRange = document.getElementById("newterm-range")?.value;

    TerminologyService.addCustomTerm({ term, category, plainEnglish, normalRange });
    modalAddTerm?.classList.add("hidden");
    e.target.reset();
    renderDictionary();
    alert(`Term "${term}" has been added to your preloaded dictionary!`);
  });
}

/**
 * Utility function to escape HTML entities
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
