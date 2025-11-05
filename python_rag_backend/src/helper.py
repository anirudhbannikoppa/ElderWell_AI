"""
Document Processing Utilities
---------------------------
This module provides helper functions for processing medical documents:
1. Loading and parsing PDF files
2. Cleaning document metadata
3. Splitting text into chunks for embedding
4. Loading pre-trained embedding models
"""

from typing import List
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document

def load_pdf_file(data: str) -> List[Document]:
    """
    Load all PDF files from a directory and convert them to Document objects.
    
    Args:
        data (str): Path to directory containing PDF files
        
    Returns:
        List[Document]: List of processed documents with text content and metadata
    """
    loader = DirectoryLoader(
        data,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )
    return loader.load()

def filter_to_minimal_docs(docs: List[Document]) -> List[Document]:
    """
    Clean document metadata, keeping only source information.
    
    Args:
        docs (List[Document]): List of documents to clean
        
    Returns:
        List[Document]: Documents with minimal metadata (source only)
    """
    return [
        Document(
            page_content=doc.page_content,
            metadata={"source": doc.metadata.get("source")}
        )
        for doc in docs
    ]

def text_split(documents: List[Document]) -> List[Document]:
    """
    Split documents into smaller chunks for better processing.
    
    Args:
        documents (List[Document]): Documents to split
        
    Returns:
        List[Document]: Chunked documents with consistent size
    
    Note:
        chunk_size=500: Each chunk will have ~500 characters
        chunk_overlap=20: Consecutive chunks share 20 characters to maintain context
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20
    )
    return splitter.split_documents(documents)

def download_hugging_face_embeddings() -> HuggingFaceEmbeddings:
    """
    Initialize the Hugging Face embedding model for text vectorization.
    
    Returns:
        HuggingFaceEmbeddings: Loaded embedding model
    
    Note:
        Uses 'sentence-transformers/all-MiniLM-L6-v2' which produces
        384-dimensional embeddings, optimized for semantic similarity.
    """
    return HuggingFaceEmbeddings(
        model_name='sentence-transformers/all-MiniLM-L6-v2'
    )