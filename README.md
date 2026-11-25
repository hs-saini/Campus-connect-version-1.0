# CampusConnect

A responsive college event portal mini project. Students can browse campus events, create a student profile, and register for activities. An admin overview shows event and registration details.

## Features

- Dashboard with event and registration statistics
- Browse events with text search and category filters
- Create a Student ID and use it to register for events
- View personal registrations and prevent duplicate registrations for the same event
- Add events from built-in templates, including free and paid events
- Submit payment proof for paid events and review registration records
- Responsive layout for desktop and mobile screens
- Saves demo data in the browser's Local Storage

## Getting started

No build tools or package installation are required.

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.
3. Create a Student ID to try registering for events.

You can also serve the project with any static web server. For example, from the project directory:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deploy with GitHub Pages

1. Open the repository's **Settings** on GitHub.
2. Go to **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.

GitHub Pages will publish the site using `index.html` as its entry point.

## Built with

- HTML
- CSS
- Vanilla JavaScript

## Demo data and limitations

This is a front-end demo; it does not use a server, database, authentication, or a payment processor. Events, student details, registrations, and uploaded payment proof are stored in Local Storage in the current browser. They are not shared across devices or users and may be cleared with browser data. The Admin Overview is a demo view, not a protected administrator account. Paid-event registrations only record submitted payment proof for review; no payment is processed.
