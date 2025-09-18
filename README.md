Steam Profile Comparator

A web application that compares gaming statistics between two Steam profiles with real-time data from Steam Web API.

Features

- Profile comparison with gaming statistics
- Genre analysis by playtime
- Game recommendations based on libraries
- Co-op game finder with compatibility scoring
- Responsive Steam-inspired design

Tech Stack

**Frontend:** React, Vite, CSS3  
**Backend:** Node.js, Express.js  
**API:** Steam Web API

Prerequisites

- Node.js (version 16+)
- Steam Web API Key from https://steamcommunity.com/dev/apikey

Installation

1. Clone the repository
2. Install dependencies
npm install
npm install express node-fetch cors dotenv

3. Create .env file

STEAM_KEY=your_steam_api_key_here

text

Running the Application

1. Start the backend server

node server.js

text

2. Start the frontend

npm run dev

3. Open http://localhost:5173 in your browser

Usage

1. Get Steam IDs from steamidfinder.com (17-digit numbers)
2. Enter two Steam IDs in the input fields
3. Click "Compare Profiles" to view detailed comparison
4. Click profile cards to view full Steam profiles
5. Click game cards to visit Steam store pages
