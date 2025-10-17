🧠 Dynamic Quote Generator

📖 Project Overview

The Dynamic Quote Generator is a JavaScript web application that demonstrates advanced DOM manipulation, Web Storage, JSON handling, and client–server synchronization.

It evolves from a simple quote display into a fully interactive, data-driven web app that supports filtering, persistence, and simulated server syncing — reflecting real-world front-end engineering principles.

This project was developed as part of the ALX Front-End Engineering Program (JavaScript – DOM Manipulation Module).


🎯 Learning Objectives

By completing this project, you will:
	•	Apply advanced DOM manipulation techniques.
	•	Dynamically create, modify, and manage HTML elements using JavaScript.
	•	Implement Local Storage and Session Storage for persistence.
	•	Import and export JSON data using the FileReader API.
	•	Synchronize data with a mock server using Fetch API requests (GET, POST).
	•	Resolve data conflicts and provide user feedback via in-browser notifications.


🧩 Features

🧱 Task 0 – Dynamic Content Generator
	•	Dynamically generates all content using JavaScript DOM APIs.
	•	Displays random quotes from an in-memory array.
	•	Uses showRandomQuote() and Math.random() to select quotes randomly.

💾 Task 1 – Web Storage + JSON Handling
	•	Saves quotes in Local Storage so they persist across sessions.
	•	Tracks the last viewed quote in Session Storage.
	•	Supports JSON import/export using:
	•	FileReader + readAsText() (for uploads)
	•	Blob + URL.createObjectURL() (for downloads)

🎛️ Task 2 – Dynamic Filtering System
	•	Adds a <select> dropdown for category filtering.
	•	Functions populateCategories() and filterQuotes() dynamically update the UI.
	•	Remembers the last selected filter using Local Storage.
	•	Automatically updates categories when new quotes are added or imported.

☁️ Task 3 – Server Sync & Conflict Resolution
	•	Simulates a remote server using https://jsonplaceholder.typicode.com/posts.
	•	Implements two-way synchronization via syncQuotes():
	•	Fetches new quotes from the server (GET).
	•	Pushes local quotes to the server using:

method: "POST",
headers: { "Content-Type": "application/json" }


	•	Conflict-resolution strategy: server data takes precedence (“server wins”).
	•	Displays real-time toast notifications with notifyUser().
	•	Runs automatic sync every 60 seconds.
	•	Logs "Quotes synced with server!" in the console after successful sync.


🏗️ Project Structure

alx_fe_javascript/
└── dom-manipulation/
    ├── index.html
    ├── script.js
    └── README.md

	•	index.html — Base structure and placeholders for dynamic content.
	•	script.js — Core logic handling DOM updates, storage, filtering, and server sync.
	•	README.md — Documentation outlining learning outcomes and functionality.


⚙️ How to Run Locally
	1.	Clone the repository

git clone https://github.com/joshua-odubu/alx_fe_javascript.git
cd alx_fe_javascript/dom-manipulation


	2.	Open index.html in your browser
        The application runs entirely client-side — no backend setup required.
	3.	Interact with the app
	•	Click “Show New Quote” to display random quotes.
	•	Use the category filter to view specific groups.
	•	Add new quotes and categories using the input fields.
	•	Import/export JSON files to manage saved data.
	•	Observe background sync logs and toast notifications while connected to the mock API.


🧠 JavaScript Concepts Used
	•	DOM Selection & Manipulation: getElementById, createElement, appendChild
	•	Event Handling: addEventListener()
	•	Array Logic: push(), filter(), random index generation
	•	Web Storage: localStorage, sessionStorage
	•	File API: FileReader, readAsText()
	•	Fetch API: GET and POST requests with method, headers, Content-Type
	•	Error Handling & User Feedback: try/catch blocks and custom toast alerts


🧪 Testing Checklist

✅ Displays random quotes using Math.random()
✅ Persists quotes via Local Storage
✅ Imports/exports JSON files successfully
✅ Updates category filter dynamically
✅ Synchronizes with mock server using syncQuotes()
✅ Includes method, POST, headers, and Content-Type in requests
✅ Logs “Quotes synced with server!” on successful sync


🏁 Learning Outcomes

Through this project, you practiced how to:
	•	Manipulate the DOM programmatically.
	•	Persist and retrieve data using Web Storage.
	•	Handle JSON data and file operations.
	•	Communicate with servers through HTTP requests.
	•	Implement basic conflict resolution and UX feedback systems.


✨ Author

Name: Joshua Odubu
Cohort: ALX Front-End Engineering Program
Module: JavaScript – DOM Manipulation
