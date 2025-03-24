from typing import Any, List, Optional, Dict
from pydantic import BaseModel, Field
from app.core.db import get_qdrant_db
from app.core.utils import log

class VectorNode(BaseModel):
    """Vector node with embedding and metadata."""
    id: str
    embedding: List[float]
    metadata: Dict[str, Any] = Field(default_factory=dict)

class VectorQuery(BaseModel):
    """Query parameters for vector search."""
    query_embedding: List[float]
    similarity_top_k: int = 5
    filter_json: Dict[str, Any] = Field(default_factory=dict)

class VectorQueryResult(BaseModel):
    """Result of vector search query."""
    nodes: List[VectorNode]
    similarities: List[float]

class QdrantStore:
    """Qdrant vector store implementation."""
    
    collection_name: str
    
    def __init__(
        self,
        collection_name: str
    ) -> None:
        """Initialize Qdrant store.
        
        Args:
            collection_name: Name of the collection to use
        """
        self.collection_name = collection_name
    
    def add(self, nodes: List[VectorNode], **add_kwargs: Any) -> List[str]:
        """Add nodes to Qdrant store.
        
        Args:
            nodes: List of nodes to add
            **add_kwargs: Additional arguments
            
        Returns:
            List of node IDs
        """
        qdrant_db = get_qdrant_db()
        for node in nodes:
            result = qdrant_db.upsert(
                self.collection_name,
                node.id,
                node.embedding,
                node.metadata
            )
            log.info("qdrant add node result: %s", result)
        return [node.id for node in nodes]
    
    def delete(self, ref_doc_id: str, **delete_kwargs: Any) -> None:
        """Delete node from Qdrant store.
        
        Args:
            ref_doc_id: ID of node to delete
            **delete_kwargs: Additional arguments
        """
        qdrant_db = get_qdrant_db()
        result = qdrant_db.delete_vectors(self.collection_name, ref_doc_id)
        log.debug("qdrant delete node result: %s", result)
    
    def query(
        self,
        query: VectorQuery,
        **kwargs: Any,
    ) -> VectorQueryResult:
        """Query Qdrant store.
        
        Args:
            query: Query parameters
            **kwargs: Additional arguments
            
        Returns:
            Query results
        """
        qdrant_db = get_qdrant_db()
        filter = query.filter_json or {}
            
        response_json = qdrant_db.search_points(
            self.collection_name,
            query.query_embedding,
            filter=filter,
            top=query.similarity_top_k
        )
        
        result = response_json['result']
        vector_result = VectorQueryResult(nodes=[], similarities=[])
        
        if result is None or len(result) == 0:
            return vector_result
            
        nodes = []
        similarities = []
        
        for r in result:
            node = VectorNode(
                id=r['id'],
                embedding=r['vector'],
                metadata=r['payload']
            )
            nodes.append(node)
            similarities.append(r['score'])
            
        vector_result.nodes = nodes
        vector_result.similarities = similarities
        
        return vector_result 