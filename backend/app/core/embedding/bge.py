from typing import List, Optional
import requests
import os
from app.core.utils import log

class BGEEmbedding:
    """BGE embedding service for text vectorization."""
    
    def __init__(self, base_url: Optional[str] = None):
        """Initialize BGE embedding service.
        
        Args:
            base_url: Base URL of the BGE embedding service. If None, will use BGE_BASE_URL env var.
        """
        self.base_url = base_url or os.getenv("BGE_BASE_URL", "http://stark-vector.x-amc.wke-office.test.wacai.info").rstrip('/')
        self.embedding_endpoint = "/bge/em"
        log.info(f"Initialized BGE embedding service with base URL: {self.base_url}")
    
    def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for input text.
        
        Args:
            text: Input text to get embedding for
            
        Returns:
            List of floats representing the embedding vector
            
        Raises:
            Exception: If embedding request fails
        """
        try:
            # Clean text by replacing newlines with spaces
            cleaned_text = text.replace("\n", " ")
            
            # Prepare request data
            data = {
                "data": cleaned_text,
            }
            
            # Make request to embedding service
            response = requests.post(
                f"{self.base_url}{self.embedding_endpoint}",
                json=data
            )
            
            # Check if request was successful
            response.raise_for_status()
            
            # Parse and return embedding vector
            result = response.json()
            if "data" not in result:
                raise ValueError("No embedding data in response")
                
            return result["data"]
            
        except requests.exceptions.RequestException as e:
            log.error("Failed to get embedding: %s", str(e))
            raise Exception(f"Failed to get embedding: {str(e)}")
        except Exception as e:
            log.error("Error processing embedding: %s", str(e))
            raise 