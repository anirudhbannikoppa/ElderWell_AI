# ElderWell

ElderWell is a modern, accessible web application designed to support the health and wellness of older adults. It provides AI-powered health chat, secure health record management, hospital location mapping, and curated health news—all in a user-friendly, privacy-focused interface.

---

## Features

- **AI Health Assistant**: Chat with an AI for health advice, reminders, and emotional support (integrates with a Flask backend).
- **Personal Health Records**: Securely add, edit, and manage your health records, prescriptions, and lab reports (client-side, Auth0-protected).
- **Nearby Hospitals Map**: Find associated hospitals near you using Leaflet and OpenStreetMap, with real-time geolocation.
- **Curated Health News**: Stay updated with the latest adult and aging health news, powered by NewsAPI.
- **Responsive UI**: Clean, accessible design with Tailwind CSS and custom styles.
- **Authentication**: Auth0 integration for secure login and data protection.
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support.

---

## Tech Stack & Architecture

- **Frontend**: React 19, Vite, React Router, Tailwind CSS, AOS (Animate On Scroll)
- **Authentication**: Auth0 (via `@auth0/auth0-react`)
- **Mapping**: Leaflet, React-Leaflet, OpenStreetMap
- **News**: NewsAPI (API key required)
- **AI Chat**: Flask backend (see `/api/chat` endpoint in Aichat.jsx)
- **State Management**: React Context API
- **Icons**: Remixicon, Lucide React
- **Linting**: ESLint (custom config)
- **Styling**: Tailwind CSS, custom CSS modules

---

## Folder Structure

```
ElderWell/
├── public/
├── src/
│   ├── assets/
│   │   └── img/
│   ├── components/
│   │   ├── Aichat.jsx
│   │   ├── AllRoutes.jsx
│   │   ├── AuthContextProvider.jsx
│   │   ├── Header.jsx
│   │   ├── Hospitalmap.jsx
│   │   ├── MyHelathRecord.jsx
│   │   └── NewsFeed.jsx
│   ├── styles/
│   │   ├── exercise.css
│   │   ├── hero.css
│   │   └── start.css
│   ├── UI/
│   │   ├── Exercise.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Home.jsx
│   │   ├── Loader.jsx
│   │   └── Start.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env example
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- [NewsAPI](https://newsapi.org/) key (for news feed)
- [Auth0](https://auth0.com/) application (for authentication)
- Flask backend running at `http://127.0.0.1:8080/api/chat` (for AI chat)

### 2. Installation

```bash
git clone https://github.com/anirudhbannikoppa/ElderWell.git
cd ElderWell
npm install
```

### 3. Environment Variables

Copy `.env example` to `.env` and fill in your credentials:

```
VITE_API_NEWS_CLIENT=your_newsapi_key
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
```

### 4. Running the App

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Linting

```bash
npm run lint
```

---

## Usage

- **AI Chat**: Navigate to `/aichat` and chat with the AI assistant.
- **Health Records**: Go to `/records` (login required) to manage your health data.
- **Hospital Map**: Visit `/map` to find hospitals near your location.
- **Health News**: Check `/newsfeed` for the latest curated news.

---

## Customization

- **Styling**: Edit `tailwind.config.js` and CSS files in `src/styles/`.
- **Routes**: Modify `src/components/AllRoutes.jsx` to add or change pages.
- **Auth0**: Update Auth0 settings in `.env` and the Auth0 dashboard.
- **NewsAPI**: Use your own NewsAPI key for news content.

---

## Deployment

1. Build the app:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your preferred static hosting (Vercel, Netlify, etc.).

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

---

## Troubleshooting

- **Auth0 Issues**: Ensure your domain and client ID are correct and allowed callback URLs are set in Auth0 dashboard.
- **News Feed Not Loading**: Check your NewsAPI key and API quota.
- **Map Not Displaying**: Allow browser geolocation and check network requests to OpenStreetMap.
- **AI Chat Not Working**: Ensure the Flask backend is running and accessible at the configured endpoint.

---

## License

MIT
