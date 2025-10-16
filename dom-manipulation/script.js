// -----------------------------------------------
// Dynamic Quote Generator with Web Storage + JSON
// -----------------------------------------------

// Local & Session storage keys
const LS_QUOTES_KEY = "quotes";
const SS_LAST_INDEX_KEY = "lastViewedQuoteIndex";

// Default data (used only if localStorage is empty or invalid)
const DEFAULT_QUOTES = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

let quotes = [];

// Cache DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const importInput = document.getElementById("importFile");

// ---------------------------
// Helpers: Load / Save quotes
// ---------------------------
function isValidQuoteObject(obj) {
  return (
    obj &&
    typeof obj.text === "string" &&
    obj.text.trim() &&
    typeof obj.category === "string" &&
    obj.category.trim()
  );
}

function loadQuotes() {
  try {
    const stored = localStorage.getItem(LS_QUOTES_KEY);
    if (!stored) {
      quotes = [...DEFAULT_QUOTES];
      saveQuotes();
      return;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.every(isValidQuoteObject)) {
      quotes = parsed;
    } else {
      quotes = [...DEFAULT_QUOTES];
      saveQuotes();
    }
  } catch (e) {
    console.error("Error loading quotes:", e);
    quotes = [...DEFAULT_QUOTES];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

// ---------------------------
// Render: Display a quote
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
  sessionStorage.setItem(SS_LAST_INDEX_KEY, String(randomIndex));
}

// Restore last viewed quote (if any)
function showLastViewedOrRandom() {
  const idx = sessionStorage.getItem(SS_LAST_INDEX_KEY);
  if (idx !== null && !isNaN(idx) && quotes[idx]) {
    renderQuote(quotes[idx]);
  } else {
    showRandomQuote();
  }
}

// ---------------------------
// Add Quote
// ---------------------------
function addQuote(text, category) {
  if (typeof text === "undefined" || typeof category === "undefined") {
    const textEl = document.getElementById("newQuoteText");
    const catEl = document.getElementById("newQuoteCategory");
    text = textEl ? textEl.value : "";
    category = catEl ? catEl.value : "";
    if (textEl) textEl.value = "";
    if (catEl) catEl.value = "";
  }

  const cleanedText = text.trim();
  const cleanedCat = category.trim();

  if (!cleanedText || !cleanedCat) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: cleanedText, category: cleanedCat });
  saveQuotes();
  renderQuote({ text: cleanedText, category: cleanedCat });
  sessionStorage.setItem(SS_LAST_INDEX_KEY, String(quotes.length - 1));
  alert("✅ New quote added successfully!");
}

// ---------------------------
// JSON Export
// ---------------------------
function exportToJson() {
  try {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    alert("❌ Export failed. Check console for details.");
  }
}

// ---------------------------
// JSON Import (FileReader version)
// ---------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: expected an array of quotes.");
        return;
      }

      // Validate and merge imported quotes
      const existingSet = new Set(quotes.map(q => `${q.text}__${q.category}`));
      let added = 0;

      for (const item of importedQuotes) {
        if (isValidQuoteObject(item)) {
          const key = `${item.text.trim()}__${item.category.trim()}`;
          if (!existingSet.has(key)) {
            quotes.push({
              text: item.text.trim(),
              category: item.category.trim(),
            });
            existingSet.add(key);
            added++;
          }
        }
      }

      saveQuotes();

      if (added > 0) {
        alert(`✅ Imported ${added} new quote${added === 1 ? "" : "s"} successfully!`);
        renderQuote(quotes[quotes.length - 1]);
        sessionStorage.setItem(SS_LAST_INDEX_KEY, String(quotes.length - 1));
      } else {
        alert("No new quotes added (duplicates or invalid data).");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to import. Please check your JSON file.");
    } finally {
      event.target.value = ""; // reset file input
    }
  };

  // Read file content as text
  fileReader.readAsText(event.target.files[0]);
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