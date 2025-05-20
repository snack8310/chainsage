import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import CourseDetail from '../../components/CourseDetail';

type LessonType = 'video' | 'practice' | 'quiz';

interface Lesson {
  title: string;
  duration: string;
  type: LessonType;
  path?: string;
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  description: string;
  duration: string;
  level: string;
  skills: string[];
  modules: Module[];
}

const courseData: Course = {
  title: "AI工具基础应用",
  description: "掌握ChatGPT、Claude等主流AI工具的基本使用方法，了解AI助手的工作方式，学习如何有效利用这些工具完成各种任务",
  duration: "4周",
  level: "入门",
  skills: ["AI工具使用", "提示词工程", "AI助手应用", "任务自动化"],
  modules: [
    {
      title: "模块一：AI助手基础入门",
      description: "了解主流AI助手的特点和使用场景",
      lessons: [
        {
          title: "1.1 ChatGPT入门指南",
          duration: "30分钟",
          type: "video"
        },
        {
          title: "1.2 Claude使用教程",
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
          title: "2.4 提示词编写练习",
          duration: "30分钟",
          type: "quiz",
          path: "/courses/ai-tools-basic/quiz/2-4"
        }
      ]
    },
    {
      title: "模块三：实战应用",
      description: "将AI工具应用到实际场景中",
      lessons: [
        {
          title: "3.1 AI辅助内容创作",
          duration: "45分钟",
          type: "video"
        },
        {
          title: "3.2 数据分析与研究",
          duration: "50分钟",
          type: "video"
        },
        {
          title: "3.3 任务自动化项目",
          duration: "90分钟",
          type: "practice"
        }
      ]
    }
  ]
};

const AIToolsBasicPage: NextPage = () => {
  const router = useRouter();

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.path) {
      router.push(lesson.path);
    }
  };

  return <CourseDetail course={courseData} onLessonClick={handleLessonClick} />;
};

export default AIToolsBasicPage; 