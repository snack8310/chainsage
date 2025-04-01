import React from 'react';
import { Box, Text, Card, Flex, Button } from '@radix-ui/themes';
import { useParams, useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  prerequisites?: string[];
  completed?: boolean;
  content?: {
    chapters: {
      title: string;
      description: string;
      duration: string;
    }[];
  };
}

// 模拟课程数据
const coursesData: Record<number, Course> = {
  1: {
    id: 1,
    title: '新员工入职培训',
    description: '帮助新员工快速融入公司文化和工作环境',
    level: 'beginner',
    duration: '2天',
    content: {
      chapters: [
        {
          title: '第一章：公司介绍',
          description: '了解公司历史、文化和价值观',
          duration: '0.5天'
        },
        {
          title: '第二章：工作流程',
          description: '熟悉基本工作流程和工具使用',
          duration: '0.5天'
        },
        {
          title: '第三章：团队协作',
          description: '学习团队协作和沟通方式',
          duration: '0.5天'
        },
        {
          title: '第四章：职业发展',
          description: '了解职业发展路径和机会',
          duration: '0.5天'
        }
      ]
    }
  },
  2: {
    id: 2,
    title: '领导力基础',
    description: '培养初级管理者的基本领导技能',
    level: 'beginner',
    duration: '3天',
    prerequisites: ['新员工入职培训'],
    content: {
      chapters: [
        {
          title: '第一章：领导力概述',
          description: '理解领导力的基本概念和重要性',
          duration: '1天'
        },
        {
          title: '第二章：团队管理',
          description: '学习团队组建和管理方法',
          duration: '1天'
        },
        {
          title: '第三章：决策制定',
          description: '掌握决策制定的方法和技巧',
          duration: '1天'
        }
      ]
    }
  },
  3: {
    id: 3,
    title: '高效沟通技巧',
    description: '提升职场沟通能力和影响力',
    level: 'intermediate',
    duration: '4天',
    prerequisites: ['领导力基础'],
    content: {
      chapters: [
        {
          title: '第一章：沟通基础',
          description: '了解沟通的基本原理和要素',
          duration: '1天'
        },
        {
          title: '第二章：倾听技巧',
          description: '掌握有效倾听的方法和技巧',
          duration: '1天'
        },
        {
          title: '第三章：表达技巧',
          description: '学习清晰、有说服力的表达方式',
          duration: '1天'
        },
        {
          title: '第四章：冲突处理',
          description: '掌握处理职场冲突的策略和方法',
          duration: '1天'
        }
      ]
    }
  }
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log('CourseDetail component rendered');
  console.log('Current URL:', window.location.pathname);
  console.log('Course ID from params:', id);
  console.log('Available courses:', Object.keys(coursesData));
  
  const course = coursesData[Number(id)];
  console.log('Found course:', course);

  if (!course) {
    console.log('Course not found for ID:', id);
    return (
      <Box style={{ padding: '2rem', height: '100%', overflow: 'auto' }}>
        <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '100%' }}>
          <Text size="6" weight="bold">课程未找到</Text>
          <Text size="2" color="gray">课程ID: {id}</Text>
          <Button onClick={() => navigate('/courses')}>返回课程地图</Button>
        </Flex>
      </Box>
    );
  }

  console.log('Rendering course details for:', course.title);
  return (
    <Box style={{ padding: '2rem', height: '100%', overflow: 'auto' }}>
      <Flex direction="column" gap="4">
        <Button onClick={() => navigate('/courses')} style={{ alignSelf: 'flex-start' }}>
          返回课程地图
        </Button>

        <Card>
          <Flex direction="column" gap="3">
            <Text size="6" weight="bold">{course.title}</Text>
            <Text size="3" color="gray">{course.description}</Text>
            <Flex gap="3">
              <Text size="2" color="gray">难度：{course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}</Text>
              <Text size="2" color="gray">时长：{course.duration}</Text>
            </Flex>
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Text size="2" color="gray">前置课程：{course.prerequisites.join('、')}</Text>
            )}
          </Flex>
        </Card>

        <Card>
          <Text size="4" weight="bold" mb="3">课程大纲</Text>
          <Flex direction="column" gap="3">
            {course.content?.chapters.map((chapter, index) => (
              <Card key={index} style={{ backgroundColor: 'var(--gray-1)' }}>
                <Flex direction="column" gap="2">
                  <Text size="3" weight="bold">{chapter.title}</Text>
                  <Text size="2" color="gray">{chapter.description}</Text>
                  <Text size="2" color="gray">时长：{chapter.duration}</Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
};

export default CourseDetail; 