

# SmartRoad AI – Pothole Detection & Road Damage Management System

A modern, smart-city themed web application for pothole detection and road damage reporting — built for demo and presentation purposes with simulated AI processing and realistic mock data.

---

## 🎨 Design Theme
- **Dark blue smart-city** color scheme with gradient accents
- Professional government-style layout suitable for presentations
- Clean, modern AI-visual identity with glowing accents and data-driven aesthetics
- Fully responsive (mobile + desktop)
- No Lovable branding — fully white-labeled

---

## 📄 Pages & Features

### 1. Landing Page (Home)
- Hero section with animated smart-city visuals explaining the AI pothole detection system
- Key statistics (reports filed, roads repaired, AI accuracy) with animated counters
- How-it-works section (Upload → AI Detection → City Response)
- Call-to-action to report a pothole

### 2. User Registration & Login
- JWT-style simulated authentication (local state, no real backend)
- Login and signup forms with validation
- Role-based access: Citizen vs Admin

### 3. Citizen Portal – Report a Pothole
- Image upload with preview
- **Simulated AI processing** that:
  - Displays uploaded image with a drawn bounding box overlay
  - Shows a randomized confidence score (75-98%)
  - Classifies severity (Minor / Moderate / Dangerous) based on simulated logic
- GPS auto-location detection via browser geolocation API
- Manual location input as fallback
- Submit report with all detection results

### 4. Citizen Portal – My Reports
- List of past reports with status tracking:
  - Reported → Under Review → In Progress → Completed
- Each report shows image, AI result, severity, location, and timestamp

### 5. Interactive Map (Citizen View)
- Leaflet-based map showing nearby reported potholes
- Color-coded markers (Red/Yellow/Green by severity)
- Click marker to see report details

### 6. Admin Login
- Separate secure admin login page

### 7. Admin Dashboard – Overview
- Statistics cards: Total Reports, High Priority, Resolved, Pending
- Severity distribution pie/donut chart (Recharts)
- Monthly report trends line chart
- Recent reports list

### 8. Admin Dashboard – City Map
- Full interactive Leaflet map with all reports
- Color-coded markers by severity
- Filters: severity, area, date range
- Click report for full details (image, AI result, location, timestamp)

### 9. Admin Dashboard – Report Management
- Table of all reports with search and filters
- Click to view full report detail
- Update status (Mark In Progress / Completed)
- Priority alert badges for dangerous reports

### 10. Admin Dashboard – Analytics
- Severity distribution chart
- Monthly trends chart
- Area-based breakdown
- Downloadable PDF report placeholder (button with mock download)

---

## 🤖 Simulated AI Module
- When a user uploads an image, a simulated processing animation plays
- A bounding box is overlaid on the image at a random position
- Confidence score generated (75-98%)
- Severity classified based on randomized box size logic
- Results stored in local state/mock database

---

## 🧩 Extra Features
- Crowdsourced reporting: multiple users can report same area
- Duplicate report detection: warns if a report exists within 100m radius (simulated)
- Image authenticity placeholder: shows a "verified" badge after mock validation
- Predictive analytics section: placeholder charts with "coming soon" labels
- Responsive navigation with mobile hamburger menu

---

## 📊 Mock Data
- Pre-populated with ~15-20 sample pothole reports across different severities and statuses
- Realistic locations on the map
- Sample images with bounding box overlays

