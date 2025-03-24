from typing import Any, Dict, List, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models

from app.core.config import get_settings

class QdrantDB:
    def __init__(self):
        settings = get_settings()
        self.client = QdrantClient(
            host=settings.QDRANT_URL.replace("http://", ""),
            port=settings.QDRANT_PORT,
            api_key=settings.QDRANT_API_KEY
        )
        
    def upsert(self, collection_name: str, id: str, vector: List[float], payload: Dict[str, Any]) -> None:
        self.client.upsert(
            collection_name=collection_name,
            points=[models.PointStruct(id=id, vector=vector, payload=payload)]
        )
        
    def delete_vectors(self, collection_name: str, id: str) -> None:
        self.client.delete(
            collection_name=collection_name,
            points_selector=models.PointIdsList(
                points=[id]
            )
        )
        
    def search_points(
        self,
        collection_name: str,
        vector: List[float],
        filter: Optional[Dict[str, Any]] = None,
        top: int = 10,
        score_threshold: float = 0.0
    ) -> Dict[str, Any]:
        search_result = self.client.search(
            collection_name=collection_name,
            query_vector=vector,
            query_filter=models.Filter(**filter) if filter else None,
            limit=top,
            score_threshold=score_threshold
        )
        return {"result": [{"id": hit.id, "score": hit.score, "vector": hit.vector, "payload": hit.payload} for hit in search_result]} 