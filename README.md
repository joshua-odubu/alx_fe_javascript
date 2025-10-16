# Dynamic Quote Generator

## 📖 Project Overview
The **Dynamic Quote Generator** is a JavaScript web application that demonstrates **advanced DOM manipulation** by dynamically generating and managing content on a web page. Users can view random quotes, add new quotes with categories, and see the updates reflected instantly — all without using any external frameworks.

This project was created as part of the **ALX Front-End Engineering Program** (DOM Manipulation module).

---

## 🎯 Learning Objectives
By completing this project, you will:
- Understand and apply **advanced DOM manipulation techniques**.
- Dynamically create, modify, and append HTML elements using JavaScript.
- Manage data within JavaScript objects and arrays.
- Handle user input and interactive events.
- Update the webpage dynamically without reloading.

---

## 🧩 Features
- Displays a **random quote** each time the “Show New Quote” button is clicked.  
- Allows users to **add new quotes and categories** dynamically through an input form.  
- Updates both the **DOM** and **JavaScript data structure** in real-time.  
- Demonstrates **clean, modular JavaScript functions** (`showRandomQuote()`, `addQuote()`, etc.).

---

## 🏗️ Project Structure
alx_fe_javascript/
└── dom-manipulation/
├── index.html
└── script.js

- **index.html** — Provides the base structure and placeholders for dynamic content.  
- **script.js** — Handles all DOM manipulation logic and user interactions.

---

## ⚙️ How It Works
1. The page displays a random quote on load.
2. Clicking **“Show New Quote”** fetches a new random quote from the in-memory `quotes` array.
3. Users can add a new quote and category through the input form.
4. When added, the new quote becomes part of the available list — visible immediately in the app.

---

## 🚀 How to Run the Project
1. Clone or download the repository.
2. Navigate to the `dom-manipulation` directory.
3. Open `index.html` in your preferred browser.
4. Interact with the quote generator — add quotes, switch quotes, explore the DOM in action.

---

## 🧠 JavaScript Concepts Used
- **DOM Selection:** `getElementById`, `createElement`, `appendChild`
- **Event Handling:** `addEventListener()`
- **Array Manipulation:** `push()`, random index generation
- **Dynamic Element Creation:** building input forms and text nodes in real-time

---

## 🧪 Optional Enhancement (Bonus)
For extended functionality, you can integrate **Web Storage (localStorage)** to persist user-added quotes across browser sessions.

Example snippet:
```js
// Save quotes
localStorage.setItem("quotes", JSON.stringify(quotes));

// Load quotes
const savedQuotes = JSON.parse(localStorage.getItem("quotes"));
if (savedQuotes) quotes = savedQuotes;