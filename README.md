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


	•	Conflict resolution strategy: server data takes precedence (“server wins”).
	•	Real-time notifications with visual toasts (notifyUser()).
	•	Periodic auto-sync every 60 seconds.
	•	Console message "Quotes synced with server!" confirms successful syncs.


🧩 Core Technologies

Technology	Purpose
HTML 5	Page structure and placeholders
CSS 3	Minimal UI styling
JavaScript (ES6)	Logic, DOM manipulation, data persistence
Web Storage API	Local & Session storage
JSON API	Import/export and mock server data
Fetch API	HTTP GET & POST requests to mock server



⚙️ How to Run Locally
	1.	Clone the repository

git clone https://github.com/joshua-odubu/alx_fe_javascript.git
cd alx_fe_javascript/dom-manipulation


	2.	Open index.html in your browser
        The application runs entirely client-side — no backend setup required.
	3.	Interact with the app
	•	Click “Show New Quote” to get a random quote.
	•	Use the category filter to view specific categories.
	•	Add your own quotes and export/import JSON files.
	•	Observe background sync logs and toasts when connecting to the mock API.



🧪 Testing Checklist

✅ Random quote display uses Math.random()
✅ Quotes persist after refresh (Local Storage)
✅ JSON import/export works with FileReader and readAsText()
✅ Category filter updates dynamically
✅ syncQuotes() fetches and merges server data
✅ method, POST, headers, and Content-Type appear in POST requests
✅ Console shows “Quotes synced with server!” after each sync



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
