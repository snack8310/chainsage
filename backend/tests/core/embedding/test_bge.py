import pytest
import os
import numpy as np
from app.core.embedding.bge import BGEEmbedding
from app.core.utils import log

@pytest.fixture
def embedding_service():
    """Fixture to create a BGE embedding service instance."""
    return BGEEmbedding()

@pytest.fixture
def test_texts():
    """Fixture to create test texts."""
    return [
        "The quick brown fox jumps over the lazy dog",
        "A quick brown dog runs in the park",
        "The lazy fox sleeps under the tree"
    ]

@pytest.fixture
def mock_env_vars(monkeypatch):
    """Fixture to set up test environment variables."""
    test_url = "http://test-bge-service.example.com"
    monkeypatch.setenv("BGE_BASE_URL", test_url)
    return test_url

def test_real_embedding(embedding_service):
    """Test getting real embedding and verify its properties."""
    text = "测试文本：这是一个中文测试句子"
    try:
        embedding = embedding_service.get_embedding(text)
        
        # 验证基本属性
        assert isinstance(embedding, list), "Embedding should be a list"
        assert all(isinstance(x, float) for x in embedding), "All elements should be floats"
        assert len(embedding) > 0, "Embedding should not be empty"
        
        # 验证向量维度（BGE 模型通常输出 1024 维向量）
        assert len(embedding) == 1024, "BGE embedding should be 1024-dimensional"
        
        # 验证向量归一化（BGE 模型输出归一化向量）
        norm = np.linalg.norm(embedding)
        assert np.isclose(norm, 1.0, rtol=1e-5), "Embedding should be normalized"
        
        # 验证向量值范围
        assert all(-1 <= x <= 1 for x in embedding), "All values should be in [-1, 1]"
        
        log.info(f"Successfully got embedding of length {len(embedding)}")
        log.info(f"Vector norm: {norm}")
        
    except Exception as e:
        pytest.fail(f"Failed to get real embedding: {str(e)}")

def test_embedding_similarity(embedding_service):
    """Test that similar texts have similar embeddings."""
    similar_texts = [
        "今天天气很好",
        "今天天气不错"
    ]
    
    different_texts = [
        "今天天气很好",
        "这是一个完全不同的句子"
    ]
    
    try:
        # 获取相似文本的向量
        similar_embeddings = [embedding_service.get_embedding(text) for text in similar_texts]
        similar_similarity = np.dot(similar_embeddings[0], similar_embeddings[1])
        
        # 获取不同文本的向量
        different_embeddings = [embedding_service.get_embedding(text) for text in different_texts]
        different_similarity = np.dot(different_embeddings[0], different_embeddings[1])
        
        # 验证相似文本的相似度应该高于不同文本
        assert similar_similarity > different_similarity, "Similar texts should have higher similarity"
        
        log.info(f"Similar texts similarity: {similar_similarity}")
        log.info(f"Different texts similarity: {different_similarity}")
        
    except Exception as e:
        pytest.fail(f"Failed to test embedding similarity: {str(e)}")

def test_get_embedding(embedding_service, test_texts):
    """Test getting embedding for a single text."""
    text = test_texts[0]
    try:
        embedding = embedding_service.get_embedding(text)
        
        # Verify embedding properties
        assert isinstance(embedding, list), "Embedding should be a list"
        assert all(isinstance(x, float) for x in embedding), "All elements should be floats"
        assert len(embedding) > 0, "Embedding should not be empty"
        
        log.info(f"Successfully got embedding of length {len(embedding)}")
        
    except Exception as e:
        pytest.fail(f"Failed to get embedding: {str(e)}")

def test_get_embedding_with_newlines(embedding_service):
    """Test getting embedding for text with newlines."""
    text = "First line\nSecond line\nThird line"
    try:
        embedding = embedding_service.get_embedding(text)
        assert isinstance(embedding, list), "Embedding should be a list"
        assert len(embedding) > 0, "Embedding should not be empty"
        log.info("Successfully got embedding for text with newlines")
    except Exception as e:
        pytest.fail(f"Failed to get embedding for text with newlines: {str(e)}")

def test_get_embedding_empty_text(embedding_service):
    """Test getting embedding for empty text."""
    text = ""
    try:
        embedding = embedding_service.get_embedding(text)
        assert isinstance(embedding, list), "Embedding should be a list"
        assert len(embedding) > 0, "Embedding should not be empty"
        log.info("Successfully got embedding for empty text")
    except Exception as e:
        pytest.fail(f"Failed to get embedding for empty text: {str(e)}")

def test_get_embedding_special_characters(embedding_service):
    """Test getting embedding for text with special characters."""
    text = "Special chars: !@#$%^&*()_+{}[]|\\:;\"'<>,.?/~`"
    try:
        embedding = embedding_service.get_embedding(text)
        assert isinstance(embedding, list), "Embedding should be a list"
        assert len(embedding) > 0, "Embedding should not be empty"
        log.info("Successfully got embedding for text with special characters")
    except Exception as e:
        pytest.fail(f"Failed to get embedding for text with special characters: {str(e)}")

def test_multiple_embeddings(embedding_service, test_texts):
    """Test getting embeddings for multiple texts."""
    try:
        embeddings = []
        for text in test_texts:
            embedding = embedding_service.get_embedding(text)
            embeddings.append(embedding)
            
        # Verify all embeddings
        assert len(embeddings) == len(test_texts), "Should get embedding for each text"
        assert all(len(emb) > 0 for emb in embeddings), "All embeddings should be non-empty"
        assert all(len(emb) == len(embeddings[0]) for emb in embeddings), "All embeddings should have same length"
        
        log.info(f"Successfully got embeddings for {len(test_texts)} texts")
        
    except Exception as e:
        pytest.fail(f"Failed to get multiple embeddings: {str(e)}")

def test_embedding_service_error_handling(embedding_service):
    """Test error handling of the embedding service."""
    # Test with invalid URL
    invalid_service = BGEEmbedding(base_url="http://invalid-url")
    with pytest.raises(Exception):
        invalid_service.get_embedding("test text")
    
    # Test with None text
    with pytest.raises(Exception):
        embedding_service.get_embedding(None)  # type: ignore

def test_environment_variable_usage(mock_env_vars):
    """Test that the service uses environment variables correctly."""
    # Create service without explicit URL
    service = BGEEmbedding()
    assert service.base_url == mock_env_vars, "Service should use BGE_BASE_URL environment variable"
    
    # Create service with explicit URL
    explicit_url = "http://explicit-url.example.com"
    service = BGEEmbedding(base_url=explicit_url)
    assert service.base_url == explicit_url, "Service should use explicitly provided URL"

def test_default_url_fallback():
    """Test that the service falls back to default URL when environment variable is not set."""
    # Temporarily remove BGE_BASE_URL if it exists
    if "BGE_BASE_URL" in os.environ:
        del os.environ["BGE_BASE_URL"]
    
    service = BGEEmbedding()
    default_url = "http://stark-vector.x-amc.wke-office.test.wacai.info"
    assert service.base_url == default_url, "Service should fall back to default URL" 