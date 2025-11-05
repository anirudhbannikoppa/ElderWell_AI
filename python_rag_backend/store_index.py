"""
Medical Document Indexer
-----------------------
This script processes medical PDF documents and creates a searchable vector index in Pinecone.
The index enables semantic search capabilities for the medical chatbot.
"""

import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from src.helper import (
    load_pdf_file,
    filter_to_minimal_docs,
    text_split,
    download_hugging_face_embeddings
)

# Initialize environment variables from .env file
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables")

# Step 1: Load and process PDF documents
DATA_DIR = 'data/'
extracted_data = load_pdf_file(data=DATA_DIR)                    # Load PDFs from data directory
filtered_data = filter_to_minimal_docs(extracted_data)           # Clean metadata
text_chunks = text_split(filtered_data)                         # Split into searchable chunks

# Step 2: Initialize embeddings model
embeddings = download_hugging_face_embeddings()                 # Load Hugging Face embedding model

# Step 3: Setup Pinecone vector database
index_name = "medical-chatbot"
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create Pinecone index if it doesn't exist
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=384,                                          # Dimension matches embedding model
        metric="cosine",                                       # Similarity metric for search
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),  # Serverless Pinecone configuration
    )

# Step 4: Create vector store from processed documents
docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    index_name=index_name,
    embedding=embeddings,
)