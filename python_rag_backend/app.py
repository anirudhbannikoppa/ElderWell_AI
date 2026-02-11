# =========================================
# Medical Chatbot Backend API
# =========================================
# This Flask REST API powers the ElderWell medical chatbot. It leverages Retrieval Augmented Generation (RAG)
# using LangChain and Pinecone for context-aware medical Q&A. The API is designed to be consumed by a React frontend.
#
# Key Features:
# - User authentication via Auth0 (see @requires_auth)
# - Health record CRUD endpoints (protected)
# - Chat endpoint with user health context injection
# - RAG pipeline: Pinecone vector search + OpenAI LLM
# - CORS configured for local/prod frontend
# - Environment-based API key management
# - Request size validation for security
# =========================================
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

from db import get_db_connection
from auth import requires_auth
from health_context import get_user_health_context

import logging

# Local application imports
from src.helper import download_hugging_face_embeddings
from src.prompt import system_prompt

# Initialize Flask app with CORS support for React frontend
app = Flask(__name__)
# CORS is restricted to known frontend origins for security
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",          # local React dev
                "https://elderwell.netlify.app",  # production
                "https://www.elderwell.online"    # custom domain
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    }
)



# Load environment variables from .env file
load_dotenv()
# API keys are loaded from environment for security (never hardcoded)
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not PINECONE_API_KEY or not OPENAI_API_KEY:
    raise ValueError("Missing required API keys in environment variables")

# Initialize the embedding model for document search (HuggingFace)
embeddings = download_hugging_face_embeddings()

# Pinecone vector store for document retrieval (semantic search)
index_name = "medical-chatbot"
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)
# RAG pipeline: retrieves top 3 similar docs for each query
retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)
# OpenAI LLM (gpt-4o-mini) for answer generation
chatModel = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])
# Compose the RAG chain
question_answer_chain = create_stuff_documents_chain(chatModel, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# Configure logging for debugging and monitoring
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)






# ========== ROUTES ==========
# Health check endpoint (for uptime monitoring)
@app.route("/health")
def health_check():
    return jsonify({"status": "healthy"}), 200

# Root route: simple message for server root
@app.route("/")
def home():
    return jsonify({"message": "ElderWell Flask API Running"}), 200

# Request size limit for security (1MB)
@app.before_request
def validate_request():
    if request.content_length and request.content_length > 1024 * 1024:
        return jsonify({"error": "Request too large"}), 413

# --- Health Records CRUD (protected) ---
# Get all health records for the authenticated user
@app.route("/api/health-records", methods=["GET", "OPTIONS"])
@requires_auth
def get_health_records():
    auth0_id = request.user["sub"]
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, doctor_name, hospital_name, visit_date,
               diagnosis, doctor_suggestion, prescribed_medicines,
               special_notes, created_at
        FROM health_records
        WHERE auth0_id = %s
        ORDER BY created_at DESC
        """,
        (auth0_id,)
    )
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    records = [dict(zip(columns, row)) for row in rows]
    cur.close()
    conn.close()
    return jsonify(records)

# Create a new health record for the authenticated user
@app.route("/api/health-records", methods=["POST", "OPTIONS"])
@requires_auth
def create_health_record():
    auth0_id = request.user["sub"]
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO health_records (
            auth0_id,
            doctor_name,
            hospital_name,
            visit_date,
            diagnosis,
            doctor_suggestion,
            prescribed_medicines,
            special_notes
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            auth0_id,
            data["doctorName"],
            data["hospitalName"],
            data["date"],
            data.get("diagnosis"),
            data.get("doctorSuggestion"),
            data.get("prescribedMedicines"),
            data.get("specialNotes"),
        )
    )
    record_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"success": True, "id": record_id}), 201

# Update an existing health record (user can only update their own)
@app.route("/api/health-records/<record_id>", methods=["PUT", "OPTIONS"])
@requires_auth
def update_health_record(record_id):
    auth0_id = request.user["sub"]
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE health_records
        SET
            doctor_name = %s,
            hospital_name = %s,
            visit_date = %s,
            diagnosis = %s,
            doctor_suggestion = %s,
            prescribed_medicines = %s,
            special_notes = %s,
            updated_at = now()
        WHERE id = %s AND auth0_id = %s
        """,
        (
            data["doctorName"],
            data["hospitalName"],
            data["date"],
            data.get("diagnosis"),
            data.get("doctorSuggestion"),
            data.get("prescribedMedicines"),
            data.get("specialNotes"),
            record_id,
            auth0_id,
        ),
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"success": True})

# Delete a health record (user can only delete their own)
@app.route("/api/health-records/<record_id>", methods=["DELETE", "OPTIONS"])
@requires_auth
def delete_health_record(record_id):
    auth0_id = request.user["sub"]
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM health_records WHERE id = %s AND auth0_id = %s",
        (record_id, auth0_id),
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"success": True})




# --- Chatbot Endpoint ---
# POST /api/chat: Main endpoint for medical Q&A
# - Requires Auth0 authentication
# - Injects user's health history into the prompt for personalized answers
# - Uses RAG pipeline (Pinecone + OpenAI LLM)
@app.route("/api/chat", methods=["POST"])
@requires_auth
def chat():
    data = request.get_json()
    msg = data.get("message")
    if not msg:
        return jsonify({"error": "No message provided"}), 400
    try:
        # Identify user (from JWT)
        auth0_id = request.user["sub"]
        # Fetch user health history (as string)
        health_history = get_user_health_context(auth0_id)
        # Inject health history into the prompt for context-aware answers
        augmented_msg = f"""
USER HEALTH HISTORY:
{health_history}

USER QUESTION:
{msg}
""".strip()
        # RAG pipeline: retrieve docs + generate answer
        response = rag_chain.invoke({"input": augmented_msg})
        answer = response.get("answer", "")
        return jsonify({"reply": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Entrypoint: start Flask dev server
if __name__ == '__main__':
    app.run(
        host="0.0.0.0",  # Accept connections from all network interfaces
        port=8080,
        debug=True       # Enable debug mode for development
    )
