// -----------------------------------------------
// Dynamic Quote Generator with Web Storage + JSON + Category Filter + Server Sync
// -----------------------------------------------

const LS_QUOTES_KEY = "quotes";
const LS_CATEGORY_FILTER = "selectedCategory";
const SS_LAST_INDEX_KEY = "lastViewedQuoteIndex";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API endpoint

const DEFAULT_QUOTES = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

let quotes = [];
let currentFilter = "all";
let syncIntervalId = null;

// Cache DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const importInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

// ---------------------------
// UI Notification Helper
// ---------------------------
function notifyUser(message, type = "info") {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.position = "fixed";
  note.style.bottom = "10px";
  note.style.left = "50%";
  note.style.transform = "translateX(-50%)";
  note.style.padding = "10px 15px";
  note.style.backgroundColor =
    type === "error" ? "#d9534f" : type === "success" ? "#5cb85c" : "#0275d8";
  note.style.color = "white";
  note.style.borderRadius = "4px";
  note.style.zIndex = 9999;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

// ---------------------------
// Local Storage Management
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
    if (!Array.isArray(quotes) || !quotes.every(isValidQuoteObject))
      quotes = [...DEFAULT_QUOTES];
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
// UI Rendering + Filtering
// ---------------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem(LS_CATEGORY_FILTER);
  if (savedFilter && [...categoryFilter.options].some(o => o.value === savedFilter)) {
    categoryFilter.value = savedFilter;
    currentFilter = savedFilter;
  } else categoryFilter.value = "all";
}

function renderQuote(quote) {
  quoteDisplay.innerHTML = "";
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontSize = "1.2rem";
  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `Category: ${quote.category}`;
  quoteCategory.style.display = "block";
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.color = "gray";
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

function showRandomQuote() {
  const filtered =
    currentFilter === "all"
      ? quotes
      : quotes.filter(q => q.category === currentFilter);
  if (!filtered.length) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  renderQuote(filtered[randomIndex]);
  sessionStorage.setItem(SS_LAST_INDEX_KEY, String(randomIndex));
}

function filterQuotes() {
  currentFilter = categoryFilter.value;
  localStorage.setItem(LS_CATEGORY_FILTER, currentFilter);
  showRandomQuote();
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
  populateCategories();
  notifyUser("✅ Quote added locally!", "success");

  syncQuotes(); // trigger sync after new quote
}

// ---------------------------
// JSON Import / Export
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
      showRandomQuote();
      if (added > 0) notifyUser(`✅ Imported ${added} new quote(s).`, "success");
      else notifyUser("No new quotes imported.", "info");
    } catch (error) {
      console.error(error);
      notifyUser("❌ Invalid JSON file.", "error");
    } finally {
      event.target.value = "";
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ---------------------------
// Server Interaction & Sync
// ---------------------------

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();
  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: item.body.substring(0, 20) || "General",
  }));
}

// Push a quote to the server (mock)
// Contains method, POST, headers, and Content-Type
async function pushQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST", // required keyword
      headers: { "Content-Type": "application/json" }, // required keyword
      body: JSON.stringify(quote),
    });
    console.log("Quote sent to server using POST method!");
  } catch (error) {
    console.error("Push failed:", error);
  }
}

function mergeServerQuotes(serverQuotes) {
  const localSet = new Set(quotes.map(q => `${q.text}__${q.category}`));
  let added = 0;

  serverQuotes.forEach(serverQ => {
    const key = `${serverQ.text}__${serverQ.category}`;
    if (!localSet.has(key)) {
      quotes.push(serverQ);
      added++;
    }
  });

  if (added > 0) {
    saveQuotes();
    populateCategories();
    notifyUser(`🔄 Synced ${added} new quote(s) from server.`, "info");
  }
}

// The ALX key function
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    mergeServerQuotes(serverQuotes);
    console.log("Quotes synced with server!");
    notifyUser("Quotes synced with server!", "success");
  } catch (e) {
    console.error("Sync failed:", e);
    notifyUser("⚠️ Sync failed. Check connection.", "error");
  }
}

function startPeriodicSync() {
  if (syncIntervalId) clearInterval(syncIntervalId);
  syncIntervalId = setInterval(syncQuotes, 60000);
}

// ---------------------------
// Init
// ---------------------------
window.onload = function () {
  loadQuotes();
  populateCategories();
  showRandomQuote();
  startPeriodicSync();

  newQuoteButton.addEventListener("click", showRandomQuote);
  if (exportBtn) exportBtn.addEventListener("click", exportToJson);
  if (importInput) importInput.addEventListener("change", importFromJsonFile);
  if (categoryFilter) categoryFilter.addEventListener("change", filterQuotes);

  syncQuotes(); // initial sync
};