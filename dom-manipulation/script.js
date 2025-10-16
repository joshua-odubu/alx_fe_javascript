// -----------------------------------------------
// Dynamic Quote Generator with Web Storage + JSON
// -----------------------------------------------

// Storage keys
const LS_QUOTES_KEY = "quotes";
const SS_LAST_INDEX_KEY = "lastViewedQuoteIndex";

// Base data (used only if localStorage is empty or invalid)
const DEFAULT_QUOTES = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

let quotes = [];

// Cache DOM
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const importInput = document.getElementById("importFile");

// ---------------------------
// Helpers: Load / Save quotes
// ---------------------------
function isValidQuoteObject(obj) {
  return obj && typeof obj.text === "string" && obj.text.trim() &&
         typeof obj.category === "string" && obj.category.trim();
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_QUOTES_KEY);
    if (!raw) {
      quotes = [...DEFAULT_QUOTES];
      saveQuotes();
      return;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isValidQuoteObject)) {
      quotes = parsed;
    } else {
      // Fallback if corrupted
      quotes = [...DEFAULT_QUOTES];
      saveQuotes();
    }
  } catch {
    quotes = [...DEFAULT_QUOTES];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

// ---------------------------
// Render: Show a quote
// ---------------------------
function renderQuote(quote) {
  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontSize = "1.2rem";
  quoteText.style.marginBottom = "6px";

  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `Category: ${quote.category}`;
  quoteCategory.style.display = "block";
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.color = "gray";

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ---------------------------
// Actions: Show random quote
// ---------------------------
function showRandomQuote() {
  if (!quotes.length) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  renderQuote(quotes[randomIndex]);

  // Optional: remember last viewed in this session
  sessionStorage.setItem(SS_LAST_INDEX_KEY, String(randomIndex));
}

// Optional: Restore last viewed quote this session
function showLastViewedOrRandom() {
  const idxStr = sessionStorage.getItem(SS_LAST_INDEX_KEY);
  if (idxStr !== null) {
    const idx = Number(idxStr);
    if (!Number.isNaN(idx) && idx >= 0 && idx < quotes.length) {
      renderQuote(quotes[idx]);
      return;
    }
  }
  showRandomQuote();
}

// ---------------------------
// Add Quote (supports both:
//  - dynamic call addQuote(text, category)
//  - HTML button with ids + onclick="addQuote()"
// ---------------------------
function addQuote(text, category) {
  // If args not provided, attempt to read from DOM inputs (static form case)
  if (typeof text === "undefined" || typeof category === "undefined") {
    const textEl = document.getElementById("newQuoteText");
    const catEl = document.getElementById("newQuoteCategory");
    text = textEl ? textEl.value : "";
    category = catEl ? catEl.value : "";
    if (textEl) textEl.value = "";
    if (catEl) catEl.value = "";
  }

  const cleanedText = String(text || "").trim();
  const cleanedCat = String(category || "").trim();

  if (!cleanedText || !cleanedCat) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: cleanedText, category: cleanedCat });
  saveQuotes();
  renderQuote({ text: cleanedText, category: cleanedCat });
  sessionStorage.setItem(SS_LAST_INDEX_KEY, String(quotes.length - 1));
  alert("New quote added successfully!");
}

// ---------------------------
// JSON Export
// ---------------------------
function exportToJson() {
  try {
    const pretty = JSON.stringify(quotes, null, 2);
    const blob = new Blob([pretty], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Export failed. Check console for details.");
    console.error(e);
  }
}

// ---------------------------
// JSON Import (via file input)
// ---------------------------
async function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const imported = JSON.parse(text);

    if (!Array.isArray(imported)) {
      alert("Invalid JSON format: expected an array of quotes.");
      return;
    }

    // Validate + dedupe (by text+category)
    const existingSet = new Set(quotes.map(q => `${q.text}__${q.category}`));
    let added = 0;

    for (const item of imported) {
      if (isValidQuoteObject(item)) {
        const key = `${item.text.trim()}__${item.category.trim()}`;
        if (!existingSet.has(key)) {
          quotes.push({ text: item.text.trim(), category: item.category.trim() });
          existingSet.add(key);
          added++;
        }
      }
    }

    saveQuotes();
    if (added > 0) {
      alert(`Quotes imported successfully! Added ${added} new entr${added === 1 ? "y" : "ies"}.`);
      // Show a newly added quote (last one), else show last viewed
      renderQuote(quotes[quotes.length - 1]);
      sessionStorage.setItem(SS_LAST_INDEX_KEY, String(quotes.length - 1));
    } else {
      alert("Import complete, but no new quotes were added (duplicates or invalid entries).");
    }
  } catch (e) {
    alert("Failed to import JSON. Make sure the file is valid.");
    console.error(e);
  } finally {
    // Reset file input so selecting the same file again re-triggers change
    event.target.value = "";
  }
}

// ---------------------------
// Init
// ---------------------------
window.onload = function () {
  loadQuotes();
  showLastViewedOrRandom();

  newQuoteButton.addEventListener("click", showRandomQuote);

  if (exportBtn) exportBtn.addEventListener("click", exportToJson);
  if (importInput) importInput.addEventListener("change", importFromJsonFile);
};