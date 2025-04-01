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

    def _clean_text(self, text: str) -> str:
        """清理文本内容，移除特殊字符和格式问题"""
        # 替换特殊字符
        text = text.replace('', '•')
        text = text.replace('----', '')
        text = text.replace('——', '')
        
        # 移除多余的空格和换行
        text = re.sub(r'\s+', ' ', text)
        
        # 修复常见的格式问题
        text = re.sub(r'([。！？；])\s*([^。！？；])', r'\1\n\2', text)  # 在句号后添加换行
        text = re.sub(r'([：:])\s*([^•\n])', r'\1\n\2', text)  # 在冒号后添加换行
        
        return text.strip()

    def _structure_content(self, content: str) -> Dict:
        """将内容结构化处理"""
        structured_data = {
            "title": "",
            "description": "",
            "background": "",
            "objectives": [],
            "outline": [],
            "requirements": [],
            "target_audience": "",
            "duration": "",
            "level": "",
            "raw_content": content
        }
        
        # 按行分割内容
        lines = content.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # 识别章节标题
            if any(keyword in line for keyword in ['工作背景', '课程背景', '课程目标', '课程大纲', '课程要求', '适合人群', '课程时长', '课程级别']):
                current_section = line
                continue
                
            if current_section:
                if '工作背景' in current_section or '课程背景' in current_section:
                    structured_data['background'] += line + '\n'
                elif '课程目标' in current_section:
                    if line.startswith('•'):
                        structured_data['objectives'].append(line[1:].strip())
                    else:
                        structured_data['objectives'].append(line)
                elif '课程大纲' in current_section:
                    if line.startswith('•'):
                        structured_data['outline'].append(line[1:].strip())
                    else:
                        structured_data['outline'].append(line)
                elif '课程要求' in current_section:
                    if line.startswith('•'):
                        structured_data['requirements'].append(line[1:].strip())
                    else:
                        structured_data['requirements'].append(line)
                elif '适合人群' in current_section:
                    structured_data['target_audience'] = line
                elif '课程时长' in current_section:
                    structured_data['duration'] = line
                elif '课程级别' in current_section:
                    structured_data['level'] = line
            else:
                # 如果没有当前章节，假设第一行是标题
                if not structured_data['title']:
                    structured_data['title'] = line
                else:
                    structured_data['description'] += line + '\n'
        
        return structured_data

    async def _analyze_content_with_llm(self, content: str) -> Dict:
        """使用LLM分析课程内容，提取结构化信息"""
        messages = [
            {"role": "system", "content": """你是一个专业的课程内容分析助手。请分析给定的课程内容，提取关键信息并按照以下结构返回JSON格式的数据：
{
    "title": "课程标题",
    "description": "课程简介",
    "background": "课程背景",
    "objectives": ["课程目标1", "课程目标2", ...],
    "outline": ["课程大纲1", "课程大纲2", ...],
    "requirements": ["课程要求1", "课程要求2", ...],
    "target_audience": "适合人群",
    "duration": "课程时长",
    "level": "课程级别",
    "key_points": ["关键要点1", "关键要点2", ...],
    "practical_examples": ["实践案例1", "实践案例2", ...],
    "expected_outcomes": ["预期收获1", "预期收获2", ...],
    "prerequisites": ["前置知识1", "前置知识2", ...],
    "teaching_methods": ["教学方法1", "教学方法2", ...],
    "assessment_methods": ["考核方式1", "考核方式2", ...],
    "resources": ["学习资源1", "学习资源2", ...],
    "instructor_info": {
        "name": "讲师姓名（必填，如果找不到则返回'未知'）",
        "title": "讲师职称（如：教授、副教授、讲师等）",
        "background": "讲师背景（包括教育背景、工作经历等）",
        "expertise": ["专业领域1", "专业领域2", ...],
        "brief_intro": "一句话简介（如果有）",
        "achievements": ["主要成就1", "主要成就2", ...],
        "teaching_experience": "教学经验描述",
        "research_focus": "研究方向（如果有）"
    }
}

请确保：
1. 提取的信息准确且完整
2. 对于列表类型的字段，每个项目都应该是独立的要点
3. 如果某些信息在原文中没有明确提到，对应字段可以留空
4. 保持专业性和准确性
5. 去除任何特殊字符和格式问题
6. 对于讲师信息：
   - 必须提取讲师姓名，如果找不到则返回"未知"
   - 从工作背景、课程背景等描述中提取讲师信息
   - 提取讲师的一句话简介（如果有）
   - 提取讲师的专业领域和成就
   - 提取讲师的教学经验和研究方向
7. 确保所有提取的内容都经过适当的格式化和清理"""},
            {"role": "user", "content": content}
        ]

        try:
            response = await self.llm_service.create_chat_completion(
                messages=messages,
                temperature=0.3  # 使用较低的温度以获得更稳定的结果
            )
            
            if "error" in response:
                logger.error(f"LLM分析内容时出错: {response['error']}")
                return self._structure_content(content)  # 如果LLM失败，回退到基础结构化方法
                
            content = response["choices"][0]["message"]["content"].strip()
            try:
                # 尝试解析JSON响应
                structured_data = json.loads(content)
                # 添加原始内容
                structured_data["raw_content"] = content
                return structured_data
            except json.JSONDecodeError:
                logger.error(f"无法解析LLM响应为JSON: {content}")
                return self._structure_content(content)  # 如果JSON解析失败，回退到基础结构化方法
                
        except Exception as e:
            logger.error(f"LLM分析内容时发生异常: {str(e)}")
            return self._structure_content(content)  # 如果发生异常，回退到基础结构化方法

    async def _enhance_content_with_llm(self, structured_data: Dict) -> Dict:
        """使用LLM增强课程内容的结构化信息"""
        messages = [
            {"role": "system", "content": """你是一个专业的课程内容优化助手。请基于给定的结构化课程信息，进行以下优化：
1. 补充缺失的关键信息
2. 优化描述的专业性和准确性
3. 确保内容的完整性和连贯性
4. 添加相关的实践建议和案例
5. 优化内容的表达方式

请返回优化后的完整JSON数据，保持原有的数据结构。"""},
            {"role": "user", "content": json.dumps(structured_data, ensure_ascii=False, indent=2)}
        ]

        try:
            response = await self.llm_service.create_chat_completion(
                messages=messages,
                temperature=0.2  # 使用较低的温度以获得更稳定的结果
            )
            
            if "error" in response:
                logger.error(f"LLM优化内容时出错: {response['error']}")
                return structured_data
                
            content = response["choices"][0]["message"]["content"].strip()
            try:
                enhanced_data = json.loads(content)
                # 保留原始内容
                enhanced_data["raw_content"] = structured_data.get("raw_content", "")
                return enhanced_data
            except json.JSONDecodeError:
                logger.error(f"无法解析LLM优化响应为JSON: {content}")
                return structured_data
                
        except Exception as e:
            logger.error(f"LLM优化内容时发生异常: {str(e)}")
            return structured_data

    async def _extract_text_from_pdf(self, pdf_path: str) -> List[Dict]:
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
                        # 清理文本
                        text = self._clean_text(text)
                        
                        # 使用LLM分析当前页面内容
                        messages = [
                            {"role": "system", "content": """你是一个专业的课程内容分析助手。请分析给定的文本内容，判断是否包含新的课程信息。
如果是新课程的开始，请返回JSON格式：
{
    "is_new_course": true,
    "title": "课程标题",
    "content": "课程内容"
}
如果不是新课程，请返回：
{
    "is_new_course": false,
    "content": "课程内容"
}

请确保：
1. 准确识别课程标题（通常以《》或特殊格式标记）
2. 保持内容的完整性和连贯性
3. 去除任何特殊字符和格式问题
4. 如果无法确定，倾向于将其视为当前课程的继续"""},
                            {"role": "user", "content": text}
                        ]

                        try:
                            response = await self.llm_service.create_chat_completion(
                                messages=messages,
                                temperature=0.1
                            )
                            
                            if "error" not in response:
                                content = response["choices"][0]["message"]["content"].strip()
                                try:
                                    analysis = json.loads(content)
                                    
                                    if analysis["is_new_course"]:
                                        # 如果已经有内容，保存当前课程
                                        if current_course["content"]:
                                            # 使用LLM进行内容分析和优化
                                            structured_content = await self._analyze_content_with_llm(current_course["content"])
                                            enhanced_content = await self._enhance_content_with_llm(structured_content)
                                            current_course.update(enhanced_content)
                                            courses.append(current_course)
                                        
                                        # 开始新课程
                                        current_course = {
                                            "title": analysis["title"],
                                            "content": analysis["content"],
                                            "pages": [page_num + 1]
                                        }
                                    else:
                                        # 继续当前课程
                                        current_course["content"] += "\n" + analysis["content"]
                                        current_course["pages"].append(page_num + 1)
                                except json.JSONDecodeError:
                                    logger.error(f"无法解析LLM响应为JSON: {content}")
                                    # 如果解析失败，使用基础方法处理
                                    if text.startswith('《') and text.endswith('》'):
                                        if current_course["content"]:
                                            structured_content = await self._analyze_content_with_llm(current_course["content"])
                                            enhanced_content = await self._enhance_content_with_llm(structured_content)
                                            current_course.update(enhanced_content)
                                            courses.append(current_course)
                                        current_course = {
                                            "title": text.strip('《》'),
                                            "content": text,
                                            "pages": [page_num + 1]
                                        }
                                    else:
                                        current_course["content"] += "\n" + text
                                        current_course["pages"].append(page_num + 1)
                        except Exception as e:
                            logger.error(f"LLM分析页面内容时出错: {str(e)}")
                            # 如果LLM分析失败，使用基础方法处理
                            if text.startswith('《') and text.endswith('》'):
                                if current_course["content"]:
                                    structured_content = await self._analyze_content_with_llm(current_course["content"])
                                    enhanced_content = await self._enhance_content_with_llm(structured_content)
                                    current_course.update(enhanced_content)
                                    courses.append(current_course)
                                current_course = {
                                    "title": text.strip('《》'),
                                    "content": text,
                                    "pages": [page_num + 1]
                                }
                            else:
                                current_course["content"] += "\n" + text
                                current_course["pages"].append(page_num + 1)
                
                # 添加最后一个课程
                if current_course["content"]:
                    # 使用LLM进行内容分析和优化
                    structured_content = await self._analyze_content_with_llm(current_course["content"])
                    enhanced_content = await self._enhance_content_with_llm(structured_content)
                    current_course.update(enhanced_content)
                    courses.append(current_course)
                
                return courses
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path}: {str(e)}")
            return []

    async def _load_course_contents(self):
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
                courses = await self._extract_text_from_pdf(pdf_path)
                
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
                            "total_pages": len(course["pages"]),
                            "structured_data": course  # 保存结构化数据
                        }
                        logger.info(f"已加载课程: {course_title}")
                        loading_info.append(f"已加载课程: {course_title}")
                        
                        # 创建课程摘要
                        self.course_summaries.append({
                            "title": course_title,
                            "path": pdf_path,
                            "summary": course.get("description", f"这是{course_title}课程的内容摘要"),
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
                # 获取结构化数据
                structured_data = course_info.get("structured_data", {})
                results.append({
                    "title": course_info["title"],
                    "relevance_score": relevance,
                    "content": course_info["content"][:500] + "...",
                    "source": course_info["title"],
                    "pages": course_info["pages"],
                    "structured_data": {
                        "description": structured_data.get("description", ""),
                        "background": structured_data.get("background", ""),
                        "objectives": structured_data.get("objectives", []),
                        "outline": structured_data.get("outline", []),
                        "requirements": structured_data.get("requirements", []),
                        "target_audience": structured_data.get("target_audience", ""),
                        "duration": structured_data.get("duration", ""),
                        "level": structured_data.get("level", ""),
                        "key_points": structured_data.get("key_points", []),
                        "practical_examples": structured_data.get("practical_examples", []),
                        "expected_outcomes": structured_data.get("expected_outcomes", []),
                        "prerequisites": structured_data.get("prerequisites", []),
                        "teaching_methods": structured_data.get("teaching_methods", []),
                        "assessment_methods": structured_data.get("assessment_methods", []),
                        "resources": structured_data.get("resources", []),
                        "instructor_info": structured_data.get("instructor_info", {})
                    }
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
            loading_info = await self._load_course_contents()
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
                # 构建课程推荐信息
                recommendation = {
                    "title": result["title"],
                    "relevance_score": result["relevance_score"],
                    "summary": result["structured_data"]["description"],
                    "source": result["source"],
                    "pages": result["pages"],
                    "course_info": {
                        "background": result["structured_data"]["background"],
                        "objectives": result["structured_data"]["objectives"],
                        "outline": result["structured_data"]["outline"],
                        "requirements": result["structured_data"]["requirements"],
                        "target_audience": result["structured_data"]["target_audience"],
                        "duration": result["structured_data"]["duration"],
                        "level": result["structured_data"]["level"],
                        "key_points": result["structured_data"]["key_points"],
                        "practical_examples": result["structured_data"]["practical_examples"],
                        "expected_outcomes": result["structured_data"]["expected_outcomes"],
                        "prerequisites": result["structured_data"]["prerequisites"],
                        "teaching_methods": result["structured_data"]["teaching_methods"],
                        "assessment_methods": result["structured_data"]["assessment_methods"],
                        "resources": result["structured_data"]["resources"],
                        "instructor_info": result["structured_data"]["instructor_info"]
                    }
                }
                recommendations.append(recommendation)
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