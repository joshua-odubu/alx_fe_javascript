// -----------------------------------------------
// Dynamic Quote Generator with Web Storage + JSON + Category Filter
// -----------------------------------------------

const LS_QUOTES_KEY = "quotes";
const LS_CATEGORY_FILTER = "selectedCategory";
const SS_LAST_INDEX_KEY = "lastViewedQuoteIndex";

const DEFAULT_QUOTES = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

let quotes = [];
let currentFilter = "all";

// Cache DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const importInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

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
    quotes = stored ? JSON.parse(stored) : [...DEFAULT_QUOTES];
    if (!Array.isArray(quotes) || !quotes.every(isValidQuoteObject)) {
      quotes = [...DEFAULT_QUOTES];
    }
    saveQuotes();
  } catch {
    quotes = [...DEFAULT_QUOTES];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

// ---------------------------
// Populate Categories
// ---------------------------
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last filter from localStorage
  const savedFilter = localStorage.getItem(LS_CATEGORY_FILTER);
  if (savedFilter && [...categoryFilter.options].some(o => o.value === savedFilter)) {
    categoryFilter.value = savedFilter;
    currentFilter = savedFilter;
  } else {
    categoryFilter.value = "all";
  }
}

// ---------------------------
// Render Quotes (Filtered)
// ---------------------------
function renderQuotes(filteredQuotes) {
  quoteDisplay.innerHTML = "";

  if (!filteredQuotes.length) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  filteredQuotes.forEach(quote => {
    const container = document.createElement("div");
    container.style.marginBottom = "15px";

    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;
    quoteText.style.fontSize = "1.1rem";

    const quoteCategory = document.createElement("span");
    quoteCategory.textContent = `Category: ${quote.category}`;
    quoteCategory.style.display = "block";
    quoteCategory.style.fontStyle = "italic";
    quoteCategory.style.color = "gray";

    container.appendChild(quoteText);
    container.appendChild(quoteCategory);
    quoteDisplay.appendChild(container);
  });
}

// ---------------------------
// Filter Quotes by Category
// ---------------------------
function filterQuotes() {
  currentFilter = categoryFilter.value;
  localStorage.setItem(LS_CATEGORY_FILTER, currentFilter);

  const filteredQuotes =
    currentFilter === "all"
      ? quotes
      : quotes.filter(q => q.category === currentFilter);

  renderQuotes(filteredQuotes);
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

  populateCategories(); // update dropdown dynamically
  filterQuotes(); // refresh list
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
      populateCategories();
      filterQuotes();

      if (added > 0) {
        alert(`✅ Imported ${added} new quote${added === 1 ? "" : "s"} successfully!`);
      } else {
        alert("No new quotes added (duplicates or invalid data).");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to import. Please check your JSON file.");
    } finally {
      event.target.value = "";
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ---------------------------
// Init
// ---------------------------
window.onload = function () {
  loadQuotes();
  populateCategories();
  filterQuotes();

  newQuoteButton.addEventListener("click", filterQuotes);
  if (exportBtn) exportBtn.addEventListener("click", exportToJson);
  if (importInput) importInput.addEventListener("change", importFromJsonFile);
};