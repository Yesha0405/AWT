# CampusFlow

CampusFlow is a modern college management dashboard built with React and Vite. It includes a premium university-style interface for managing students, courses, attendance, and academic reporting.

## Features

- Dashboard with KPI cards and chart summaries
- Student management with add, edit, delete, and search/filter tools
- Course catalog management with enrollment tracking
- Attendance monitoring and status classification
- Academic reports with CSV export
- Theme-aware settings panel and responsive layout

## Tech Stack

- React 19
- Vite
- React Router DOM
- Recharts
- Lucide React
- SCSS

## Getting Started

1. Install dependencies:
   npm install

2. Start the development server:
   npm run dev -- --host 0.0.0.0

3. Open the app in a browser:
   http://localhost:5173/

## Production Build

Run the following command to create a production build:

npm run build

## Project Structure

src/
- components/ - layout and reusable UI elements
- pages/ - dashboard, students, courses, attendance, reports, and settings screens
- styles/ - global styling and dashboard theme
- utils/ - app helpers such as attendance logic

## Notes

The project is designed to maintain a working academic management flow while offering a premium dashboard experience for a university or college administration panel.
