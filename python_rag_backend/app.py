"""
Medical Chatbot Backend API
Implements a Flask REST API that uses LangChain and Pinecone for medical question answering.
"""
# Standard library imports
import os

# Third-party imports
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

import logging

# Local application imports
from src.helper import download_hugging_face_embeddings
from src.prompt import system_prompt

# Initialize Flask app with CORS support for React frontend
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://elderwell.vercel.app",  # or your frontend live domain
            "https://www.elderwell.in"       # if you have a custom domain
        ],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})


# Load environment variables from .env file
load_dotenv()

# Setup API keys from environment
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

if not PINECONE_API_KEY or not OPENAI_API_KEY:
    raise ValueError("Missing required API keys in environment variables")

# Initialize the embedding model for document search
embeddings = download_hugging_face_embeddings()
index_name = "medical-chatbot"

# Setup Pinecone vector store for document retrieval
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

# Configure RAG (Retrieval Augmented Generation) pipeline
retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}  # Return top 3 most similar documents
)

# Initialize OpenAI chat model and prompt template
chatModel = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# Create the RAG chain by combining retriever and question-answering
question_answer_chain = create_stuff_documents_chain(chatModel, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)





# Add health check
@app.route("/health")
def health_check():
    return jsonify({"status": "healthy"}), 200

# Root route so visiting the server root (e.g. http://13.234.56.78:8080/) returns a simple JSON message.
@app.route("/")
def home():
    return jsonify({"message": "ElderWell Flask API Running"}), 200

# Add request size limit and validation
@app.before_request
def validate_request():
    if request.content_length and request.content_length > 1024 * 1024:  # 1MB limit
        return jsonify({"error": "Request too large"}), 413

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Handle chat messages from React frontend.
    
    Expects JSON payload: { "message": "user question" }
    Returns JSON: { "reply": "AI response" } or { "error": "error message" }
    """
    data = request.get_json()
    msg = data.get("message")
    if not msg:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Process message through RAG pipeline
        response = rag_chain.invoke({"input": msg})
        answer = response.get("answer", "")
        return jsonify({"reply": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Start Flask development server
    app.run(
        host="0.0.0.0",  # Accept connections from all network interfaces
        port=8080,
        debug=True       # Enable debug mode for development
    )
