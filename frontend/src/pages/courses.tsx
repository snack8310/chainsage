import type { NextPage } from 'next';
import { Box, Container, Grid, Heading, Text, Card, Flex, Badge } from '@radix-ui/themes';
import Link from 'next/link';

const courses = [
  {
    id: 'ai-basics',
    category: "基础入门",
    items: [
      {
        id: 'ai-tools-basic',
        title: "AI工具基础应用",
        description: "掌握ChatGPT、Claude等主流AI工具的基本使用方法，了解AI助手的工作方式",
        duration: "4周",
        level: "入门",
        skills: ["AI工具使用", "提示词编写", "结果优化"]
      },
      {
        id: 'ai-office',
        title: "AI办公效率提升",
        description: "学习使用AI工具处理日常办公任务，包括邮件撰写、会议纪要、文档整理等",
        duration: "3周",
        level: "入门",
        skills: ["文档处理", "邮件优化", "会议效率"]
      }
    ]
  },
  {
    category: "进阶应用",
    items: [
      {
        id: 'ai-decision',
        title: "AI辅助决策分析",
        description: "利用AI工具进行数据分析和决策支持，提升决策效率和准确性",
        duration: "6周",
        level: "中级",
        skills: ["数据分析", "决策支持", "报告生成"]
      },
      {
        id: 'ai-content',
        title: "AI内容创作与营销",
        description: "运用AI工具进行内容创作、营销文案撰写和社交媒体运营",
        duration: "5周",
        level: "中级",
        skills: ["内容创作", "营销文案", "社交媒体"]
      }
    ]
  },
  {
    category: "专业提升",
    items: [
      {
        id: 'ai-project',
        title: "AI项目管理与协作",
        description: "学习如何将AI工具整合到项目管理流程中，提升团队协作效率",
        duration: "8周",
        level: "高级",
        skills: ["项目管理", "团队协作", "流程优化"]
      },
      {
        id: 'ai-solution',
        title: "AI解决方案设计",
        description: "掌握如何设计和实施企业级AI解决方案，解决实际业务问题",
        duration: "10周",
        level: "高级",
        skills: ["方案设计", "系统集成", "效果评估"]
      }
    ]
  }
];

const CoursesPage: NextPage = () => {
  return (
    <Container style={{ padding: '4rem 0' }}>
      <Heading size="8" mb="6" align="center">AI工作能力提升课程</Heading>
      <Text size="4" color="gray" align="center" mb="8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        从基础应用到专业提升，全方位提升您的AI工作能力
      </Text>

      {courses.map((category, index) => (
        <Box key={index} mb="8">
          <Heading size="6" mb="4">{category.category}</Heading>
          <Grid columns="2" gap="6">
            {category.items.map((course, courseIndex) => (
              <Link 
                key={courseIndex} 
                href={`/courses/${course.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <Flex direction="column" gap="4">
                    <Box>
                      <Heading size="4" mb="2">{course.title}</Heading>
                      <Text color="gray" mb="4">{course.description}</Text>
                    </Box>
                    
                    <Flex gap="2" wrap="wrap">
                      {course.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} color="blue">{skill}</Badge>
                      ))}
                    </Flex>

                    <Flex justify="between" align="center">
                      <Text size="2" color="gray">课程时长：{course.duration}</Text>
                      <Badge color={course.level === "入门" ? "green" : course.level === "中级" ? "blue" : "purple"}>
                        {course.level}
                      </Badge>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default CoursesPage; 