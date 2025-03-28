from app.core.llm.service import LLMService
from app.agents.models import UserContext, IntentAnalysis
import json
import asyncio
import os
from pathlib import Path
import time
from typing import List, Dict, AsyncGenerator
import PyPDF2
import re
from collections import defaultdict
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CourseRecommendationAgent:
    def __init__(self):
        self.llm_service = LLMService()
        self.pdf_dir = os.path.join(os.path.dirname(__file__), "../data/courses")
        self.course_contents = {}  # 存储课程内容
        logger.info(f"初始化课程推荐代理，PDF目录: {self.pdf_dir}")
        self._load_course_contents()

    def _extract_text_from_pdf(self, pdf_path: str) -> List[Dict]:
        """从PDF文件中提取文本内容"""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                pages = []
                for page_num in range(len(reader.pages)):
                    page = reader.pages[page_num]
                    text = page.extract_text()
                    if text.strip():
                        pages.append({
                            "content": text,
                            "page": page_num + 1
                        })
                return pages
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {str(e)}")
            return []

    def _load_course_contents(self):
        """加载所有课程内容"""
        self.course_summaries = []
        if not os.path.exists(self.pdf_dir):
            logger.warning(f"PDF目录不存在，创建目录: {self.pdf_dir}")
            os.makedirs(self.pdf_dir)
            return

        logger.info(f"开始加载PDF文件，目录: {self.pdf_dir}")
        pdf_files = list(Path(self.pdf_dir).glob("*.pdf"))
        logger.info(f"找到 {len(pdf_files)} 个PDF文件")

        for pdf_file in pdf_files:
            try:
                pdf_path = str(pdf_file)
                logger.info(f"正在处理PDF文件: {pdf_file.name}")
                
                # 读取PDF内容
                pages = self._extract_text_from_pdf(pdf_path)
                
                if pages:
                    logger.info(f"成功提取 {len(pages)} 页内容")
                    self.course_contents[pdf_file.stem] = {
                        "title": pdf_file.stem,
                        "path": pdf_path,
                        "pages": pages,
                        "total_pages": len(pages)
                    }
                    logger.info(f"已加载课程: {pdf_file.stem}")
                    
                    # 创建课程摘要
                    self.course_summaries.append({
                        "title": pdf_file.stem,
                        "path": pdf_path,
                        "summary": f"这是{pdf_file.stem}课程的内容摘要",
                        "total_pages": len(pages)
                    })
                else:
                    logger.warning(f"无法从 {pdf_file.name} 提取内容")
                
            except Exception as e:
                logger.error(f"处理PDF文件 {pdf_file.name} 时出错: {str(e)}")

        logger.info(f"PDF加载完成，共加载 {len(self.course_contents)} 个课程")

    def _calculate_relevance(self, query: str, text: str) -> float:
        """计算文本与查询的相关度分数"""
        # 将查询和文本转换为小写
        query = query.lower()
        text = text.lower()
        
        # 计算关键词匹配
        query_words = set(query.split())
        text_words = set(text.split())
        
        # 计算重叠词数
        overlap = len(query_words.intersection(text_words))
        
        # 计算相关度分数 (0-1)
        if not query_words:
            return 0.0
        return min(1.0, overlap / len(query_words))

    async def _search_relevant_content(self, query: str, k: int = 5) -> AsyncGenerator[Dict, None]:
        """搜索相关内容"""
        yield {"type": "log", "message": f"开始搜索相关内容，查询: {query}"}
        results = []
        
        for course_title, course_info in self.course_contents.items():
            yield {"type": "log", "message": f"正在搜索课程: {course_title}"}
            for page in course_info["pages"]:
                relevance = self._calculate_relevance(query, page["content"])
                if relevance > 0.1:
                    message = f"找到相关内容 - 课程: {course_title}, 页码: {page['page']}, 相关度: {relevance:.2f}"
                    yield {"type": "log", "message": message}
                    results.append({
                        "content": page["content"][:500] + "...",
                        "source": course_info["title"],
                        "title": course_info["title"],
                        "page": page["page"],
                        "relevance_score": relevance
                    })
        
        # 按相关度排序
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        yield {"type": "log", "message": f"搜索完成，找到 {len(results)} 个相关结果"}
        yield {"type": "results", "data": results[:k]}

    async def recommend_courses_stream(self, context: UserContext, intent_analysis: IntentAnalysis):
        """基于用户意图和问题分析推荐相关课程"""
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        yield {"type": "log", "message": f"\n=== 课程推荐开始: {current_time} ==="}
        yield {"type": "log", "message": f"用户问题: {context.messages[0]['content']}"}
        yield {"type": "log", "message": f"意图分析: {json.dumps(intent_analysis.dict(), ensure_ascii=False)}"}

        try:
            # 首先进行相似度搜索
            query = context.messages[0]['content']
            yield {"type": "log", "message": "开始相似度搜索..."}
            
            search_results = []
            async for result in self._search_relevant_content(query):
                if result["type"] == "log":
                    yield result
                elif result["type"] == "results":
                    search_results = result["data"]

            # 构建推荐结果
            recommendations = []
            for result in search_results:
                recommendations.append({
                    "title": result["title"],
                    "relevance_score": result["relevance_score"],
                    "summary": result["content"],
                    "source": result["source"],
                    "page": result["page"]
                })
                yield {"type": "log", "message": f"添加推荐: {result['title']} (相关度: {result['relevance_score']:.2f})"}

            # 构建最终响应
            response = {
                "recommendations": recommendations,
                "metadata": {
                    "total_courses": len(recommendations),
                    "query_context": {
                        "intent": intent_analysis.intent,
                        "confidence": intent_analysis.confidence
                    }
                }
            }

            end_time = time.time()
            yield {"type": "log", "message": f"\n=== 课程推荐完成 ==="}
            yield {"type": "log", "message": f"耗时: {end_time - start_time:.1f}秒"}
            yield {"type": "log", "message": f"推荐结果: {json.dumps(response, ensure_ascii=False, indent=2)}"}
            yield {"type": "result", "data": response}

        except Exception as e:
            error_message = f"\n=== 课程推荐错误 ===\n错误: {str(e)}"
            yield {"type": "log", "message": error_message}
            yield {"type": "result", "data": {
                "error": f"课程推荐过程中出错: {str(e)}",
                "recommendations": []
            }} 