# Premium Jigsaw Puzzle Game

A modern, responsive full-stack Jigsaw Puzzle application built with React, Node.js, and MongoDB.

## Features
- **Modern Dark Theme**: Premium aesthetic with glassmorphism and smooth animations.
- **Login system**: Access via Name and Phone Number (no password needed).
- **Player Dashboard**: Track your puzzle solving history and stats.
- **Interactive Gameplay**: Drag-and-drop jigsaw pieces with snapping functionality.
- **Fully Responsive**: Optimized for all devices from mobile to desktop.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or a cloud instance)

### Backend Setup
1.  Navigate to `/server`
2.  Install dependencies: `npm install`
3.  Ensure MongoDB is running at `localhost:27017` or update the `.env` file.
4.  Start server: `npm start` (or `npm run dev` with nodemon)

### Frontend Setup
1.  Navigate to `/client`
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev`
4.  Open `http://localhost:3000`

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Axios, Lucide-React.
- **Backend**: Express.js, Mongoose.
- **Database**: MongoDB.
