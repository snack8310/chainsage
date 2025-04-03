from aliyunsdkalinlp.request.v20200629 import GetWeChGeneralRequest
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException, ServerException
import json
import os
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class AliyunEmbeddingService:
    """Aliyun NLP embedding service for text vectorization"""
    
    def __init__(self, access_key_id: Optional[str] = None, access_key_secret: Optional[str] = None, region: str = "cn-hangzhou"):
        """Initialize the Aliyun embedding service
        
        Args:
            access_key_id: Aliyun access key ID. If None, will try to get from env
            access_key_secret: Aliyun access key secret. If None, will try to get from env
            region: Aliyun region, defaults to cn-hangzhou
        """
        self.access_key_id = access_key_id or os.getenv("ALIYUN_ACCESS_KEY_ID")
        self.access_key_secret = access_key_secret or os.getenv("ALIYUN_ACCESS_KEY_SECRET")
        
        if not self.access_key_id or not self.access_key_secret:
            raise ValueError("Aliyun credentials not found. Please provide access_key_id and access_key_secret or set environment variables.")
            
        self.client = AcsClient(self.access_key_id, self.access_key_secret, region)
        
    async def get_embedding(self, text: str, size: int = 50, split_type: str = "word", operation: str = "average") -> Dict[str, Any]:
        """Get embedding for the given text using Aliyun NLP service
        
        Args:
            text: Input text to get embedding for
            size: Embedding dimension size, default 50
            split_type: Text split type ("word", "char_unigram", "char_bigram")
            operation: Sentence representation method ("none", "max", "average")
            
        Returns:
            Dict containing the embedding results
        """
        try:
            request = GetWeChGeneralRequest.GetWeChGeneralRequest()
            request.set_action_name("GetWeChGeneral")
            request.set_ServiceCode("alinlp")
            request.set_Text(text)
            request.set_Size(size)
            request.set_Type(split_type)
            request.set_Operation(operation)
            
            response = self.client.do_action_with_exception(request)
            if not isinstance(response, (str, bytes, bytearray)):
                raise ValueError("Unexpected response type from Aliyun API")
                
            if isinstance(response, (bytes, bytearray)):
                response = response.decode('utf-8')
                
            return json.loads(response)
            
        except (ClientException, ServerException) as e:
            logger.error(f"Error getting embedding from Aliyun: {str(e)}")
            raise
            
    async def get_embeddings_batch(self, texts: List[str], **kwargs) -> List[Dict[str, Any]]:
        """Get embeddings for multiple texts
        
        Args:
            texts: List of input texts
            **kwargs: Additional arguments passed to get_embedding()
            
        Returns:
            List of embedding results
        """
        results = []
        for text in texts:
            try:
                embedding = await self.get_embedding(text, **kwargs)
                results.append(embedding)
            except Exception as e:
                logger.error(f"Error getting embedding for text '{text[:100]}...': {str(e)}")
                results.append({"error": str(e)})
        return results 