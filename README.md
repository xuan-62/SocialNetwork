# Around — Geo-Social Media Web App

Around is a location-based social media web application that lets users share images and videos tied to their current geographic location. Users can browse nearby posts in a gallery or video view, and discover content on an interactive map. A face-clustering feature surfaces face photos from around the world.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Key Components](#key-components)
- [Scripts](#scripts)
- [Known Limitations](#known-limitations)

---

## Features

- **User Authentication** — Register and log in with a username and password; session token stored in `localStorage`.
- **Geo-location** — Automatically detects the user’s position via the browser Geolocation API.
- **Nearby Posts** — Fetches image and video posts within a configurable radius of the user’s location.
- **Image Gallery** — Browsable photo grid with hover overlays showing the uploader and caption.
- **Video Posts** — Grid layout for video posts with inline playback.
- **Interactive Map** — Google Maps view with marker pins for every nearby post; click/hover to preview the media inline. Panning or zooming re-fetches posts for the new viewport.
- **Face Clustering** — Toggleable topic mode that surfaces face images from around the world via a backend clustering endpoint.
- **Create Post** — Upload an image or video with a message; the post is geo-tagged to the user’s current position.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Routing | React Router DOM v6 |
| UI Components | Ant Design 5 |
| Legacy Form API | `@ant-design/compatible` |
| Maps | `@react-google-maps/api` |
| Image Gallery | `react-grid-gallery` v1 |
| HTTP | Native `fetch` |
| Auth | JWT (Bearer token) |
| Build Tool | Create React App / react-scripts |

---

## Project Structure

```
around-web/
├── public/               # Static HTML shell
├── src/
│   ├── assets/
│   │   └── images/       # Logo and custom map marker SVGs
│   ├── components/
│   │   ├── App.js            # Root component; owns auth state
│   │   ├── Main.js           # Route declarations
│   │   ├── TopBar.js         # App header with logout button
│   │   ├── Login.js          # Login form (legacy antd Form API)
│   │   ├── Register.js       # Registration form
│   │   ├── Home.js           # Main authenticated view; tabs + topic toggle
│   │   ├── Gallery.js        # Image grid powered by react-grid-gallery
│   │   ├── AroundMap.js      # Google Map wrapper; loads markers
│   │   ├── AroundMarker.js   # Single map marker with InfoWindow preview
│   │   ├── CreatePostButton.js  # Modal trigger for post creation
│   │   └── CreatePostForm.js    # File-upload + message form
│   ├── styles/           # Per-component CSS files
│   ├── constants.js      # API root, token keys, geo options, post types
│   ├── index.js          # React root render + BrowserRouter
│   ├── index.css         # Global styles
│   └── serviceWorker.js  # CRA service worker stub
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 16 or later (18+ recommended)
- **npm** 8 or later
- A **Google Maps JavaScript API key** with the following APIs enabled:
  - Maps JavaScript API
  - Geometry library

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd around-web

# Install dependencies
npm install
```

### Configuration

#### Google Maps API Key

Open `src/components/AroundMap.js` and replace the placeholder with your key:

```js
const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",  // <-- replace this
  libraries: ["geometry"],
});
```

#### Backend API

The backend base URL is set in `src/constants.js`:

```js
export const API_ROOT = "https://around-179500.uc.r.appspot.com";
```

Change this to your own backend URL if you are running the server locally or on a different host.

### Running the App

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads on file changes.

---

## Usage

1. **Register** — Navigate to `/register`, create a username and password.
2. **Log in** — Navigate to `/login` (or `/`), enter your credentials.
3. **Browse nearby posts** — On the Home screen the app requests your browser location and loads posts within a 20 km radius.
   - **Image Posts** tab — scrollable photo grid; hover a thumbnail to see the uploader and caption.
   - **Video Posts** tab — grid of videos with inline playback.
   - **Map** tab — Google Map centred on your location with a marker for each post. Hover image markers or click video markers to open a preview popup. Pan or zoom to reload posts for that area.
4. **Toggle topic** — Use the radio buttons at the top to switch between **Posts Around Me** (geo-filtered) and **Faces Around The World** (global face cluster).
5. **Create a post** — Click **Create New Post**, drag-and-drop or select an image/video file, add a message, and click **Create**.
6. **Log out** — Click the logout icon in the top-right corner of the header.

---

## API Reference

All requests hit the base URL defined in `src/constants.js`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | None | Register a new user (`{ username, password }`) |
| `POST` | `/login` | None | Log in; returns a Bearer token (`{ username, password }`) |
| `GET` | `/search?lat=&lon=&range=` | Bearer | Fetch posts within `range` km of `(lat, lon)` |
| `POST` | `/post` | Bearer | Create a new post (`multipart/form-data`: `lat`, `lon`, `message`, `image`) |
| `GET` | `/cluster?term=face` | Bearer | Fetch face-clustered posts globally |

---

## Key Components

### `App.js`
Owns the `isLoggedIn` boolean in state. Reads the stored token from `localStorage` on mount. Passes `handleLoginSucceed` and `handleLogout` callbacks down to child components.

### `Main.js`
Declares all client-side routes using React Router v6 `<Routes>`:
- `/` and `/home` → `Home` (redirect to `/login` if not authenticated)
- `/login` → `Login` form (redirect to `/home` if already authenticated)
- `/register` → `Register` form
- `*` → redirect to login (catch-all)

### `Home.js`
The core authenticated view. Manages posts, loading state, geo-location, and the active topic. Renders `Gallery`, video grid, and `AroundMap` inside an Ant Design `Tabs` component. The **Create New Post** button is mounted in the tab bar’s extra content slot.

### `AroundMap.js`
Uses `useJsApiLoader` to load the Google Maps JS API. Renders a `GoogleMap` centred on the stored position. On drag or zoom it recalculates the viewport radius and triggers a post reload. Renders an `AroundMarker` for every post.

### `AroundMarker.js`
Renders a `Marker` on the map. Image posts show a hover `InfoWindow` with a thumbnail; video posts use a click `InfoWindow` with inline video and a custom blue marker icon.

### `Gallery.js`
Thin wrapper around `react-grid-gallery` v1. Adds a `customOverlay` with the uploader name and caption to each image.

### `CreatePostButton.js` / `CreatePostForm.js`
A button that opens an Ant Design `Modal`. The form uses the legacy `@ant-design/compatible` Form API to collect a text message and a file upload. On submit, the file and geo-coordinates are sent as `multipart/form-data`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm test` | Run tests in interactive watch mode |
| `npm run build` | Production build into `build/` |
| `npm run eject` | Eject CRA configuration (irreversible) |

---

## Known Limitations

- **Google Maps API key** is currently a placeholder string in `AroundMap.js`. The map tab will not function until a valid key is supplied.
- **Backend availability** — The app points to a specific App Engine backend. If the backend is offline, all post fetch and create operations will fail.
- **Legacy Form API** — `Login`, `Register`, and `CreatePostForm` use `Form.create()` from `@ant-design/compatible` (the antd v3/v4 form style). These should be migrated to the antd v5 `Form` component if the compatibility package is ever removed.
- **Geolocation required** — The home feed depends on browser geolocation permission. Denying the permission will block post loading.
