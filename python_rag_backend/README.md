# Medical Chatbot with LangChain & Pinecone

AI-powered medical chatbot using LangChain, Pinecone, OpenAI, and React.

## Tech Stack

- **Backend**: Flask, LangChain, Pinecone, OpenAI GPT
- **Frontend**: React
- **Infrastructure**: Docker, AWS

## Quick Setup

1. **Clone and Setup Environment**

   ```bash
   git clone the project

   cd  projectfolder

   conda create -n medical_chatbot python=3.10

   conda activate medical_chatbot

   pip install -r requirements.txt
   ```

2. **Configure API Keys**
   Create `.env` file:

   ```env
   PINECONE_API_KEY=your_key
   OPENAI_API_KEY=your_key
   ```

3. **Start Services**

   ```bash
   python store_index.py  # First time only: Create vector index

   python app.py         # Start backend at http://localhost:8080


   # In another terminal: Start frontend
   cd frontend
   npm install
   npm start           # UI available at http://localhost:3000
   ```

## Project Structure

```
medibot_backend/
├── app.py              # Flask API
├── store_index.py      # Document indexing
├── src/
│   ├── helper.py       # Utilities
│   └── prompt.py       # System prompts
└── data/              # Medical documents
```

## Contact

Boktiar Ahmed Bappy - entbappy73@gmail.com

- PyPDF (Document Processing)

- **Frontend**
  - React
  - Modern UI Components
  - Real-time Chat Interface

## 📋 Prerequisites

1. Python 3.10+
2. Node.js 16+ (for React frontend)
3. Pinecone Account
4. OpenAI API Key
5. Docker (optional)

## 🚀 Getting Started

1. **Index Medical Documents**

   ```bash
   python store_index.py
   ```

   This creates the vector index from medical documents in the `data/` directory.

2. **Start the Flask Backend**

   ```bash
   python app.py
   ```

   The API will be available at http://localhost:8080

3. **Run the React Frontend** (if using separate frontend)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Access the UI at http://localhost:3000

## 📁 Project Structure

```
medibot_backend/
├── app.py                 # Flask application and API routes
├── store_index.py         # Document indexing script
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── src/
│   ├── helper.py         # Utility functions
│   └── prompt.py         # System prompts
├── data/                 # Medical PDF documents
└── templates/            # Flask templates (if not using React)
```

## 🔍 How It Works

1. **Document Processing**

   - Medical PDFs are loaded and split into chunks
   - Text chunks are converted to embeddings
   - Embeddings are stored in Pinecone

2. **Query Processing**

   - User question is embedded
   - Similar chunks retrieved from Pinecone
   - LangChain generates response using chunks

3. **Response Generation**
   - Retrieved context is used with GPT model
   - Response is formatted and returned
   - Sources are tracked for verification

## 📝 Development Notes

- Use `python -m pytest` to run tests
- Frontend is configured for CORS with backend
- Default chunk size is 500 characters
- Embeddings use 384 dimensions
- API accepts both JSON and form data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ✨ Acknowledgments

- Medical document providers
- LangChain community
- Pinecone team
- Flask-CORS maintainers
