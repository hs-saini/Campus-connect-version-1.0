# CampusConnect

A responsive college event portal demo. Students can browse campus events, create and edit a Student ID profile, and register for activities. The separate admin portal demonstrates event management, registration review, and entry-pass verification.

## Features

- Dashboard with event and registration statistics
- Browse events with text search and category filters
- Create and edit a Student ID, with student details shown in a separate profile section
- Use a Student ID to register for events
- View personal registrations and prevent duplicate registrations for the same event
- Manage events and review registrations in the admin portal
- Submit payment proof for paid events and verify entry passes
- Responsive layout for desktop and mobile screens
- Saves demo data in the browser's Local Storage

## Getting started

No build tools or package installation are required.

1. Clone or download this repository.
2. Open `index.html` in a modern web browser. Open `admin.html` for the admin demo.
3. Create a Student ID to try registering for events.

You can also serve the project with any static web server. For example, from the project directory:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Live demo

- Student portal: https://hs-saini.github.io/Campus-connect-version-1.0/
- Admin demo: https://hs-saini.github.io/Campus-connect-version-1.0/admin.html

## Built with

- HTML
- CSS
- Vanilla JavaScript

## Demo data and limitations

This is a front-end demo; it does not use a server, database, server-side authentication, or a payment processor. Events, student details, registrations, and uploaded payment proof are stored in Local Storage in the current browser. They are not shared across devices or users and may be cleared with browser data. The admin portal and its login are client-side demonstrations, not protected administrator accounts. Paid-event registrations only record submitted payment proof for review; no payment is processed. Do not enter real student or payment data.
