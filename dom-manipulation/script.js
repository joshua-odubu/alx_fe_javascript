// -----------------------------------------------
// Dynamic Quote Generator
// -----------------------------------------------

// 1. Base data: an array of quote objects
let quotes = [
  { text: "Success is not final; failure is not fatal.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

// 2. Cache DOM elements (existing ones from index.html)
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// -----------------------------------------------
// 3. Function: Display a random quote
// -----------------------------------------------
function showRandomQuote() {
  // Clear existing content
  quoteDisplay.innerHTML = "";

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Create new elements for the quote and category
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;

  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  quoteCategory.style.display = "block";
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.color = "gray";

  // Append them to the display area
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// -----------------------------------------------
// 4. Function: Create a dynamic form for adding quotes
// -----------------------------------------------
function createAddQuoteForm() {
  // Create form container
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "20px";

  // Create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.style.marginRight = "10px";

  // Create input for quote category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.style.marginRight = "10px";

  // Create "Add Quote" button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  // Add event listener for button click
  addButton.addEventListener("click", function () {
    addQuote(quoteInput.value, categoryInput.value);
    quoteInput.value = "";
    categoryInput.value = "";
  });

  // Append all elements to the form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Finally, append the form to the body (or below the quote display)
  document.body.appendChild(formContainer);
}

// -----------------------------------------------
// 5. Function: Add a new quote to the array
// -----------------------------------------------
function addQuote(text, category) {
  // Validate input
  if (!text.trim() || !category.trim()) {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Push the new quote into the array
  quotes.push({ text: text.trim(), category: category.trim() });

  // Optional feedback for user
  alert("New quote added successfully!");
}

// -----------------------------------------------
// 6. Initialize the application
// -----------------------------------------------
window.onload = function () {
  // Show an initial random quote when the page loads
  showRandomQuote();

  // Connect the "Show New Quote" button to the quote display function
  newQuoteButton.addEventListener("click", showRandomQuote);
};