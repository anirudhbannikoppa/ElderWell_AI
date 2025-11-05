# 🌿 ElderWell — AI-Powered Health & Wellness Assistant

**ElderWell** is a full-stack health and wellness web application designed to empower elderly users to stay healthy, organized, and informed.  
It integrates an **AI Medical Assistant**, secure **Health Record Management**, **Nearby Hospital Mapping**, and **Health News Feed** — all in one modern, accessible interface.

---

## ⚙️ Tech Stack

| Layer          | Technology                                                                   |
| -------------- | ---------------------------------------------------------------------------- |
| **Frontend**   | React (Vite), Tailwind CSS, React Router, Auth0                              |
| **Backend**    | Flask (Python), LangChain, OpenAI GPT, Pinecone                              |
| **APIs**       | NewsAPI, OpenStreetMap (Leaflet)                                             |
| **Deployment** | Vercel (Frontend) + Render/AWS (Backend)                                     |
| **AI/RAG**     | Retrieval-Augmented Generation (RAG) pipeline for contextual medical answers |

---

## 🧩 Folder Structure

```
ElderWell/
├── python_rag_backend/       # Flask + RAG AI backend
│   ├── app.py               # Main Flask application
│   ├── store_index.py       # Vector store indexing script
│   ├── requirements.txt     # Python dependencies
│   ├── setup.py            # Package setup configuration
│   ├── Dockerfile          # Container configuration
│   ├── src/
│   │   ├── __init__.py
│   │   ├── helper.py       # Utility functions
│   │   └── prompt.py       # LLM prompt templates
│   └── data/              # Medical knowledge base
│
├── react_frontend/         # React-based frontend for ElderWell
│   ├── src/
│   │   ├── App.jsx        # Root component
│   │   ├── main.jsx       # Entry point
│   │   ├── App.css        # Global styles
│   │   ├── index.css      # Base styles
│   │   ├── assets/        # Static assets
│   │   │   └── img/       # Image assets
│   │   ├── components/    # Reusable components
│   │   │   ├── Aichat.jsx
│   │   │   ├── AllRoutes.jsx
│   │   │   ├── AuthContextProvider.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Hospitalmap.jsx
│   │   │   ├── MyHelathRecord.jsx
│   │   │   └── NewsFeed.jsx
│   │   ├── styles/        # Component-specific styles
│   │   └── UI/           # UI components
│   ├── public/           # Public assets
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── postcss.config.js  # PostCSS config
│   ├── eslint.config.js   # ESLint config
│   └── .env              # Environment variables
│
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

---

## 🚀 Installation & Setup

### 🧠 1. Clone the Repository

```bash
git clone https://github.com/anirudhbannikoppa/ElderWell.git
cd ElderWell
```

---

### 🔹 2. Backend Setup (Flask + RAG)

Navigate to the backend folder:

```bash
cd python_rag_backend
```

#### Create and activate a Conda environment:

```bash
conda create -n elderwell_backend python=3.10 -y
conda activate elderwell_backend
```

#### Install dependencies:

```bash
pip install -r requirements.txt
```

#### Create `.env` file:

```bash
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
```

#### Build your vector index (first time only):

```bash
python store_index.py
```

#### Run the backend:

```bash
python app.py
```

The Flask API will start at:  
👉 `http://127.0.0.1:8080`

---

### 💻 3. Frontend Setup (React + Vite)

Open another terminal and navigate to the frontend folder:

```bash
cd react_frontend
```

#### Install dependencies:

```bash
npm install
```

#### Create `.env` file:

```bash
VITE_API_URL=http://127.0.0.1:8080
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_API_NEWS_CLIENT=your_newsapi_key
```

#### Run the development server:

```bash
npm run dev
```

Access the app at 👉 [http://localhost:5173](http://localhost:5173)

---

## 🌟 Key Features

### 💬 AI Health Assistant

Chat with **Aira**, your AI companion, for medical and wellness advice.  
Powered by **Flask + RAG (LangChain + OpenAI + Pinecone)**, it retrieves accurate answers from trusted medical PDFs.

### 🩺 Health Record Management

Securely add and manage your medical data, prescriptions, and reports using **Auth0-protected routes**.

### 🏥 Nearby Hospitals

Find hospitals near your location with **Leaflet Maps** and **OpenStreetMap APIs**.

### 📰 Health News

Stay updated with health and wellness articles using **NewsAPI** integration.

### 🔒 Authentication

Integrated **Auth0 login** ensures your data and records remain private and secure.

---

## 🧠 How It Works

1. **Document Processing**

   - Medical PDFs are split into chunks.
   - Text embeddings are generated using OpenAI models.
   - Stored in Pinecone vector DB.

2. **Query Answering**

   - User question → embedded → context retrieved.
   - Flask server runs LangChain RAG pipeline.
   - GPT model generates a concise, context-based response.

3. **Frontend Chat**
   - React app sends user queries to Flask API (`/chat` endpoint).
   - Displays AI responses in a clean, accessible chat interface.

---

## 🔧 Environment Variables

### Backend (.env)

```
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
```

### Frontend (.env)

```
VITE_API_URL=http://127.0.0.1:8080
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_API_NEWS_CLIENT=your_newsapi_key
```

---

## 🧱 Deployment Guide

### Frontend (React)

- Build your app:
  ```bash
  npm run build
  ```
- Deploy the `dist/` folder to **Vercel**, **Netlify**, or **AWS Amplify**.

### Backend (Flask)

- Deploy to **Render**, **Railway**, or **AWS EC2**.
- Ensure CORS is enabled in Flask (`Flask-CORS`).
- Update the `VITE_API_URL` in frontend `.env` to your live backend URL.

---

## 🧩 Troubleshooting

| Issue                      | Possible Fix                                      |
| -------------------------- | ------------------------------------------------- |
| 🧠 AI chat not responding  | Ensure Flask backend is running at correct port   |
| 🔑 Auth0 login not working | Check callback URLs in Auth0 dashboard            |
| 📰 News not loading        | Verify your NewsAPI key and quota                 |
| 🗺️ Map not displaying      | Allow browser geolocation and check Leaflet setup |
| ⚙️ CORS errors             | Install and configure Flask-CORS in backend       |

---

## 🧰 Developer Notes

- Backend runs on **port 8080** (Flask)
- Frontend runs on **port 5173** (Vite)
- Use `npm run lint` to fix UI issues
- Run `pytest` or `python -m pytest` for backend testing
- All data is stored locally in the `/data` directory or vector database

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your updates
4. Push and open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Developer

**Anirudh Bannikoppa**  
Full Stack AI Developer  
📧 [anirudhbannikoppa@gmail.com](mailto:anirudhbannikoppa@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/anirudhbannikoppa)  
🐙 [GitHub](https://github.com/anirudhbannikoppa)
