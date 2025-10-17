🧠 Dynamic Quote Generator

Directory: alx_fe_javascript/dom-manipulation
Repository: alx_fe_javascript


📋 Project Overview

The Dynamic Quote Generator demonstrates advanced DOM manipulation, Web Storage, JSON handling, and client–server synchronization using vanilla JavaScript.
Each task progressively enhances the app from a static quote display into an interactive, network-aware web application that mimics real-world data syncing and conflict resolution.


🚀 Features by Task

Task 0 – Building a Dynamic Content Generator
	•	Created dynamic HTML content entirely through JavaScript DOM APIs.
	•	Displayed random quotes from an in-memory array.
	•	Implemented showRandomQuote() using Math.random() for randomized output.

Task 1 – Implementing Web Storage and JSON Handling
	•	Integrated Local Storage to persist quotes across sessions.
	•	Used Session Storage to remember the last displayed quote.
	•	Implemented JSON import/export with:
	•	FileReader + readAsText() for file uploads.
	•	Blob + URL.createObjectURL() for JSON downloads.

Task 2 – Creating a Dynamic Content Filtering System
	•	Added a category filter (<select>) dynamically populated from stored quotes.
	•	Implemented populateCategories() and filterQuotes() for real-time filtering.
	•	Persisted the user’s last selected filter using Local Storage.
	•	Automatically updated categories when new quotes were added or imported.

Task 3 – Syncing Data with Server and Conflict Resolution
	•	Introduced server simulation using the mock API https://jsonplaceholder.typicode.com/posts.
	•	Implemented two-way data syncing via syncQuotes():
	•	Fetches new quotes from the server (GET).
	•	Pushes local quotes to the server using fetch() with:

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
        The app runs entirely client-side — no server setup required.
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

By completing this project you learned how to:
	•	Manipulate the DOM dynamically without frameworks.
	•	Persist data with Local and Session Storage.
	•	Work with JSON data and files.
	•	Simulate real-world client/server syncing.
	•	Implement basic conflict resolution and user feedback systems.


✨ Author

Name: Joshua Odubu
Cohort: ALX Frontend Engineering Program
Module: JavaScript – DOM Manipulation

