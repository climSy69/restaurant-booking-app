# Theatre Booking App

A full-stack mobile theatre booking application built with **React Native (Expo)**, **Node.js**, **Express**, and **MySQL**.

## Features

- Register / Login authentication
- JWT authentication
- Session persistence
- Auto login
- Logout
- Browse theatres
- Browse shows by theatre
- Browse showtimes
- Booking flow with guest selection
- My Bookings page
- Cancel booking
- Home navigation button
- Modern polished mobile UI
- REST API backend

## Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- AsyncStorage

### Backend
- Node.js
- Express.js
- MySQL

## Project Structure

project-root/
- frontend/
- backend/

## Installation

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

## Network Configuration

The frontend uses a centralized API client (`frontend/utils/apiClient.ts`)
that auto-detects the backend URL. **In normal development you do not
need to configure anything.**

### How it works

1. **Auto-detect (default):** The app reads the IP of the machine
   running `expo start` from `Constants.expoConfig.hostUri` and uses
   that same IP to reach the backend on port `5000`. This works
   automatically on any network (home, university, hotspot).
2. **Manual override (optional):** Set `EXPO_PUBLIC_API_URL` in
   `frontend/.env` to force a specific backend URL. See
   `frontend/.env.example` for the template.

### Running locally

Backend (port 5000):

```bash
cd backend
npm install
npm run dev
```

Frontend (Expo):

```bash
cd frontend
npm install
npx expo start
```

Make sure the backend and `expo start` run on the **same machine**
so the auto-detected IP points to the correct host. The backend
already binds to `0.0.0.0`, so it accepts connections from devices
on the same network.

### Troubleshooting

If the app shows "Network request timed out":

1. Check the Metro terminal for the line:
   `[API] Base URL resolved to: http://<ip>:5000`
2. From the phone's browser, open `http://<ip>:5000/api/theatres`.
   You should see JSON. If not, the network blocks device-to-host
   traffic — try `npx expo start --tunnel` or set
   `EXPO_PUBLIC_API_URL` manually in `frontend/.env`.
3. Make sure the backend firewall allows incoming connections on
   port 5000.

## Screens

- Login Screen
- Register Screen
- Theatres Screen
- Shows Screen
- Showtimes Screen
- Booking Screen
- My Bookings Screen

## Future Improvements

- Edit booking
- Admin dashboard
- Search & filters
- Push notifications
- Payment integration

## Author

Alexandru Sacara Marian
