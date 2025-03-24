import numpy as np
import pytest
from qdrant_client.http import models
from app.core.vector_store.qdrant import QdrantStore, VectorNode, VectorQuery
from app.core.utils import log
from app.core.db import get_qdrant_db

TEST_COLLECTION = "test_collection"

@pytest.fixture(scope="session", autouse=True)
def setup_test_collection():
    """Create test collection before all tests and delete it after."""
    qdrant_db = get_qdrant_db()
    
    # 创建测试 collection
    try:
        qdrant_db.client.create_collection(
            collection_name=TEST_COLLECTION,
            vectors_config=models.VectorParams(
                size=1536,
                distance=models.Distance.COSINE
            )
        )
        log.info(f"Created test collection: {TEST_COLLECTION}")
    except Exception as e:
        log.warning(f"Collection {TEST_COLLECTION} might already exist: {str(e)}")
    
    yield
    
    # 测试结束后删除 collection
    try:
        qdrant_db.client.delete_collection(TEST_COLLECTION)
        log.info(f"Deleted test collection: {TEST_COLLECTION}")
    except Exception as e:
        log.warning(f"Failed to delete collection {TEST_COLLECTION}: {str(e)}")

@pytest.fixture
def qdrant_store():
    """Fixture to create a Qdrant store instance."""
    store = QdrantStore(collection_name=TEST_COLLECTION)
    return store

@pytest.fixture
def test_nodes():
    """Fixture to create test nodes."""
    test_texts = [
        "The quick brown fox jumps over the lazy dog",
        "A quick brown dog runs in the park",
        "The lazy fox sleeps under the tree"
    ]
    
    nodes = []
    for i, text in enumerate(test_texts):
        # 确保生成的是 List[float]
        embedding = [float(x) for x in np.random.rand(1536)]
        node = VectorNode(
            id=f"doc_{i}",
            embedding=embedding,
            metadata={
                "text": text,
                "index": i
            }
        )
        nodes.append(node)
    return nodes

def test_add_nodes(qdrant_store, test_nodes):
    """Test adding nodes to Qdrant store."""
    try:
        qdrant_store.add(test_nodes)
        log.info("Successfully added test nodes")
    except Exception as e:
        pytest.fail(f"Failed to add nodes: {str(e)}")

def test_query_nodes(qdrant_store, test_nodes):
    """Test querying nodes from Qdrant store."""
    # First add nodes
    qdrant_store.add(test_nodes)
    
    # Query using first node's embedding
    query = VectorQuery(
        query_embedding=test_nodes[0].embedding,
        similarity_top_k=2,
        filter_json={}
    )
    
    results = qdrant_store.query(query)
    
    # Verify results
    assert len(results.nodes) > 0, "Query should return results"
    assert len(results.nodes) <= 2, "Should return at most 2 results"
    assert len(results.similarities) == len(results.nodes), "Number of similarities should match number of nodes"
    
    # Log results for debugging
    log.info("Query results:")
    for i, (node, similarity) in enumerate(zip(results.nodes, results.similarities)):
        log.info(f"Result {i+1}:")
        log.info(f"  Text: {node.metadata.get('text')}")
        log.info(f"  Similarity: {similarity}")

def test_delete_node(qdrant_store, test_nodes):
    """Test deleting a node from Qdrant store."""
    # First add nodes
    qdrant_store.add(test_nodes)
    
    # Delete first node
    qdrant_store.delete(test_nodes[0].id)
    
    # Verify deletion by querying
    query = VectorQuery(
        query_embedding=test_nodes[0].embedding,
        similarity_top_k=1,
        filter_json={"id": test_nodes[0].id}
    )
    results = qdrant_store.query(query)
    assert len(results.nodes) == 0, "Deleted node should not be found"

def test_full_workflow(qdrant_store, test_nodes):
    """Test the complete workflow of add, query, and delete operations."""
    # Add nodes
    qdrant_store.add(test_nodes)
    
    # Query nodes
    query = VectorQuery(
        query_embedding=test_nodes[0].embedding,
        similarity_top_k=2,
        filter_json={}
    )
    results = qdrant_store.query(query)
    assert len(results.nodes) > 0, "Query should return results"
    
    # Delete a node
    qdrant_store.delete(test_nodes[0].id)
    
    # Verify deletion
    query = VectorQuery(
        query_embedding=test_nodes[0].embedding,
        similarity_top_k=1,
        filter_json={"id": test_nodes[0].id}
    )
    results = qdrant_store.query(query)
    assert len(results.nodes) == 0, "Deleted node should not be found" 