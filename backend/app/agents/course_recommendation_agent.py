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

    def _extract_text_from_pdf(self, pdf_path: str) -> List[Dict]:
        """从PDF文件中提取文本内容，并识别不同的课程"""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                courses = []
                current_course = {
                    "title": "",
                    "content": "",
                    "pages": []
                }
                
                for page_num in range(len(reader.pages)):
                    page = reader.pages[page_num]
                    text = page.extract_text()
                    if text.strip():
                        # 尝试识别课程标题（假设标题在页面开头，且格式特殊）
                        lines = text.split('\n')
                        if lines:
                            first_line = lines[0].strip()
                            # 检查是否是新的课程标题（可以根据实际PDF格式调整判断条件）
                            if first_line.startswith('《') and first_line.endswith('》'):
                                # 如果已经有内容，保存当前课程
                                if current_course["content"]:
                                    courses.append(current_course)
                                # 开始新课程
                                current_course = {
                                    "title": first_line.strip('《》'),
                                    "content": text,
                                    "pages": [page_num + 1]
                                }
                            else:
                                # 继续当前课程
                                current_course["content"] += "\n" + text
                                current_course["pages"].append(page_num + 1)
                
                # 添加最后一个课程
                if current_course["content"]:
                    courses.append(current_course)
                
                return courses
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {str(e)}")
            return []

    def _load_course_contents(self):
        """加载所有课程内容"""
        self.course_summaries = []
        if not os.path.exists(self.pdf_dir):
            logger.warning(f"PDF目录不存在，创建目录: {self.pdf_dir}")
            os.makedirs(self.pdf_dir)
            return "PDF目录不存在，已创建目录"

        logger.info(f"开始加载PDF文件，目录: {self.pdf_dir}")
        pdf_files = list(Path(self.pdf_dir).glob("*.pdf"))
        logger.info(f"找到 {len(pdf_files)} 个PDF文件")

        if not pdf_files:
            return "未找到任何PDF文件"

        loading_info = []
        for pdf_file in pdf_files:
            try:
                pdf_path = str(pdf_file)
                logger.info(f"正在处理PDF文件: {pdf_file.name}")
                loading_info.append(f"正在处理PDF文件: {pdf_file.name}")
                
                # 读取PDF内容
                courses = self._extract_text_from_pdf(pdf_path)
                
                if courses:
                    logger.info(f"成功提取 {len(courses)} 个课程")
                    loading_info.append(f"成功提取 {len(courses)} 个课程")
                    
                    for course in courses:
                        course_title = course["title"]
                        self.course_contents[course_title] = {
                            "title": course_title,
                            "path": pdf_path,
                            "content": course["content"],
                            "pages": course["pages"],
                            "total_pages": len(course["pages"])
                        }
                        logger.info(f"已加载课程: {course_title}")
                        loading_info.append(f"已加载课程: {course_title}")
                        
                        # 创建课程摘要
                        self.course_summaries.append({
                            "title": course_title,
                            "path": pdf_path,
                            "summary": f"这是{course_title}课程的内容摘要",
                            "total_pages": len(course["pages"])
                        })
                else:
                    logger.warning(f"无法从 {pdf_file.name} 提取内容")
                    loading_info.append(f"无法从 {pdf_file.name} 提取内容")
                
            except Exception as e:
                logger.error(f"处理PDF文件 {pdf_file.name} 时出错: {str(e)}")
                loading_info.append(f"处理PDF文件 {pdf_file.name} 时出错: {str(e)}")

        logger.info(f"PDF加载完成，共加载 {len(self.course_contents)} 个课程")
        loading_info.append(f"PDF加载完成，共加载 {len(self.course_contents)} 个课程")
        
        if not self.course_contents:
            loading_info.append("相关课程：无")
        else:
            loading_info.append("相关课程：")
            for title in self.course_contents.keys():
                loading_info.append(f"- {title}")

        return "\n".join(loading_info)

    async def _calculate_relevance(self, query: str, text: str) -> float:
        """使用LLM计算文本与查询的相关度分数"""
        messages = [
            {"role": "system", "content": """你是一个专业的文本相关性评估助手。请评估查询文本与目标文本的相关性，并返回一个0-1之间的分数。
分数说明：
- 1.0: 完全相关
- 0.8-0.9: 高度相关
- 0.6-0.7: 中度相关
- 0.4-0.5: 低度相关
- 0.0-0.3: 几乎不相关

请只返回分数，不要包含任何其他文字。"""},
            {"role": "user", "content": f"""查询文本：{query}
目标文本：{text}

请评估这两个文本的相关性，并返回一个0-1之间的分数。"""}
        ]

        try:
            response = await self.llm_service.create_chat_completion(
                messages=messages,
                temperature=0.1  # 使用较低的温度以获得更稳定的结果
            )
            
            if "error" in response:
                logger.error(f"LLM计算相关度时出错: {response['error']}")
                return 0.0
                
            content = response["choices"][0]["message"]["content"].strip()
            try:
                score = float(content)
                return max(0.0, min(1.0, score))  # 确保分数在0-1之间
            except ValueError:
                logger.error(f"无法将LLM响应转换为分数: {content}")
                return 0.0
                
        except Exception as e:
            logger.error(f"LLM计算相关度时发生异常: {str(e)}")
            return 0.0

    async def _search_relevant_content(self, query: str, k: int = 5) -> AsyncGenerator[Dict, None]:
        """搜索相关内容"""
        yield {"type": "log", "message": f"开始搜索相关内容，查询: {query}"}
        
        results = []
        for course_title, course_info in self.course_contents.items():
            yield {"type": "log", "message": f"正在搜索课程: {course_title}"}
            relevance = await self._calculate_relevance(query, course_info["content"])
            # 降低阈值到 0.05
            if relevance > 0.05:
                message = f"找到相关内容 - 课程: {course_title}, 相关度: {relevance:.2f}"
                yield {"type": "log", "message": message}
                results.append({
                    "content": course_info["content"][:500] + "...",
                    "source": course_info["title"],
                    "title": course_info["title"],
                    "pages": course_info["pages"],
                    "relevance_score": relevance
                })
        
        # 按相关度排序
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        yield {"type": "log", "message": f"搜索完成，找到 {len(results)} 个相关课程"}
        yield {"type": "results", "data": results[:k]}

    async def recommend_courses_stream(self, context: UserContext, intent_analysis: IntentAnalysis):
        """基于用户意图和问题分析推荐相关课程"""
        start_time = time.time()
        current_time = time.strftime('%H:%M:%S')
        logs = [f"\n=== 课程推荐开始: {current_time} ==="]

        try:
            # 重新加载课程内容
            logs.append("开始加载课程内容...")
            loading_info = self._load_course_contents()
            logs.extend(loading_info.split('\n'))

            # 首先进行相似度搜索
            query = context.messages[0]['content']
            logs.append("开始相似度搜索...")
            
            search_results = []
            async for result in self._search_relevant_content(query):
                if result["type"] == "log":
                    # 只保留重要的搜索日志，隐藏详细内容
                    if "找到相关内容" in result["message"]:
                        # 简化消息，只显示课程名和相关度
                        message = result["message"]
                        if "相关度:" in message:
                            course_name = message.split("课程:")[1].split(",")[0].strip()
                            relevance = message.split("相关度:")[1].strip()
                            logs.append(f"找到相关内容 - 课程: {course_name}, 相关度: {relevance}")
                    elif "搜索完成" in result["message"]:
                        logs.append(result["message"])
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
                    "pages": result["pages"]
                })
                logs.append(f"添加推荐: {result['title']} (相关度: {result['relevance_score']:.2f})")

            # 构建最终响应
            response = {
                "recommendations": recommendations,
                "metadata": {
                    "total_courses": len(recommendations),
                    "query_context": {
                        "intent": intent_analysis.intent,
                        "confidence": intent_analysis.confidence
                    }
                },
                "logs": logs
            }

            end_time = time.time()
            logs.append(f"\n=== 课程推荐完成 ===")
            logs.append(f"耗时: {end_time - start_time:.1f}秒")
            
            # 确保 JSON 数据是完整的
            try:
                response_json = json.dumps(response, ensure_ascii=False, indent=2)
                logs.append("推荐结果已生成")
            except Exception as e:
                error_msg = f"JSON序列化错误: {str(e)}"
                logger.error(error_msg)
                logger.error(f"问题数据: {response}")
                logs.append(error_msg)
                raise ValueError(error_msg)
            
            yield {"type": "course_recommendation", "data": response}

        except Exception as e:
            error_message = f"课程推荐过程中出错: {str(e)}"
            logger.error(f"完整错误信息: {error_message}")
            logger.error(f"上下文信息: {context.messages[0]['content']}")
            logs.append(f"\n=== 课程推荐错误 ===\n{error_message}")
            
            error_response = {
                "error": error_message,
                "recommendations": [],
                "logs": logs
            }
            try:
                error_json = json.dumps(error_response, ensure_ascii=False, indent=2)
                logs.append("错误详情已记录")
            except Exception as json_error:
                logger.error(f"错误响应JSON序列化错误: {str(json_error)}")
                logger.error(f"问题数据: {error_response}")
                logs.append("错误详情记录失败")
            
            yield {"type": "course_recommendation", "data": error_response} 