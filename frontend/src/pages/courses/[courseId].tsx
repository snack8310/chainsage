import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import CourseDetail from '../../components/CourseDetail';

// 模拟课程数据
const courseData = {
  title: "AI工具基础应用",
  description: "掌握ChatGPT、Claude等主流AI工具的基本使用方法，了解AI助手的工作方式",
  duration: "4周",
  level: "入门",
  skills: ["AI工具使用", "提示词编写", "结果优化"],
  modules: [
    {
      title: "模块一：AI助手基础入门",
      description: "了解主流AI助手的特点和使用场景",
      lessons: [
        {
          title: "1.1 认识ChatGPT",
          duration: "30分钟",
          type: "video"
        },
        {
          title: "1.2 认识Claude",
          duration: "30分钟",
          type: "video"
        },
        {
          title: "1.3 AI助手对比练习",
          duration: "45分钟",
          type: "practice"
        }
      ]
    },
    {
      title: "模块二：提示词工程基础",
      description: "学习编写有效的提示词来获得更好的AI响应",
      lessons: [
        {
          title: "2.1 提示词基础结构",
          duration: "40分钟",
          type: "video"
        },
        {
          title: "2.2 角色设定与上下文",
          duration: "35分钟",
          type: "video"
        },
        {
          title: "2.3 提示词优化练习",
          duration: "60分钟",
          type: "practice"
        },
        {
          title: "2.4 提示词编写测验",
          duration: "30分钟",
          type: "quiz"
        }
      ]
    }
  ]
};

const CourseDetailPage: NextPage = () => {
  const router = useRouter();
  const { courseId } = router.query;

  if (!courseId || typeof courseId !== 'string') {
    return null;
  }

  return <CourseDetail course={courseData} />;
};

export default CourseDetailPage; 