from app.core.db.qdrant import QdrantDB

_qdrant_db = None

def get_qdrant_db():
    global _qdrant_db
    if _qdrant_db is None:
        _qdrant_db = QdrantDB()
    return _qdrant_db 