import React, { useState } from 'react';
import { Box, Container, Heading, Text, Flex, Card, Button, TextArea, Grid, Separator } from '@radix-ui/themes';
import { useRouter } from 'next/router';
import CourseNavigation from '../../../../components/CourseNavigation';

const QuizPage: React.FC = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    
    // 模拟AI响应
    const response = "让我帮你分析一下这个提示词...\n\n1. 角色设定：你设定了明确的角色\n2. 任务要求：目标清晰\n3. 输出格式：结构合理\n\n建议：可以添加一些具体的示例，这样AI能更好地理解你的需求。";
    setAiResponse(response);
  };

  const handleRate = () => {
    setShowFeedback(true);
  };

  return (
    <Box style={{ 
      height: 'calc(100vh - 80px)',
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--gray-1)'
    }}>
      {/* 主内容区域 */}
      <Box style={{ 
        flex: 1, 
        display: 'flex',
        padding: '0.5rem 0'
      }}>
        {/* 左侧课程内容 */}
        <Box style={{ 
          flex: 1,
          padding: '0 1.5rem',
          borderRight: '1px solid var(--gray-4)',
          background: 'white',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box style={{ maxWidth: '800px', margin: '0 auto', flex: 1 }}>
            <Box>
              <Heading size="3" mb="2">练习目标</Heading>
              <Text mb="2">
                在这个练习中，你将学习如何编写有效的提示词。我们将通过实际案例来练习提示词的结构和技巧。
              </Text>

              <Heading size="3" mb="2">提示词结构</Heading>
              <Text mb="2">
                一个好的提示词通常包含以下要素：
              </Text>
              <Box mb="2" style={{ padding: '0.75rem', background: 'var(--gray-2)', borderRadius: '4px' }}>
                <Text>1. 角色设定：明确AI应该扮演的角色</Text>
                <Text>2. 任务要求：具体说明需要完成的任务</Text>
                <Text>3. 输出格式：指定期望的输出结构</Text>
                <Text>4. 示例说明：提供参考示例（可选）</Text>
              </Box>

              <Heading size="3" mb="2">练习任务</Heading>
              <Text mb="2">
                尝试编写一个提示词，要求AI帮助分析一篇关于人工智能的文章，并提取关键观点。
                在右侧的交互区域中，你可以：
              </Text>
              <Box mb="2" style={{ padding: '0.75rem', background: 'var(--gray-2)', borderRadius: '4px' }}>
                <Text>1. 输入你的提示词</Text>
                <Text>2. 获得AI的反馈和建议</Text>
                <Text>3. 根据反馈优化提示词</Text>
              </Box>
            </Box>

            {/* 检查反馈区域 */}
            {showFeedback && (
              <Box 
                mt="4" 
                style={{ 
                  padding: '1rem',
                  background: 'var(--gray-2)',
                  borderRadius: '4px',
                  border: '1px solid var(--gray-4)'
                }}
              >
                <Heading size="3" mb="2">检查结果</Heading>
                
                <Box mb="3">
                  <Text weight="medium" mb="1">做得好的地方：</Text>
                  <Box style={{ padding: '0.5rem', background: 'var(--green-3)', borderRadius: '4px' }}>
                    <Text>✓ 提示词结构完整，包含了角色设定和任务要求</Text>
                    <Text>✓ 任务目标明确，便于AI理解和执行</Text>
                  </Box>
                </Box>

                <Box mb="3">
                  <Text weight="medium" mb="1">需要改进的地方：</Text>
                  <Box style={{ padding: '0.5rem', background: 'var(--yellow-3)', borderRadius: '4px' }}>
                    <Text>⚠️ 可以添加具体的示例，帮助AI更好地理解需求</Text>
                    <Text>⚠️ 建议明确指定输出格式，如"请以列表形式呈现"</Text>
                  </Box>
                </Box>

                <Box>
                  <Text weight="medium" mb="1">建议：</Text>
                  <Text>尝试在提示词中加入一个具体的文章示例，并明确指定期望的输出格式。这样可以帮助AI更准确地理解你的需求，提供更有针对性的分析。</Text>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* 右侧交互区域 */}
        <Box style={{ 
          flex: 1,
          padding: '0 1.5rem',
          background: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            width: '100%', 
            height: '100%',
            display: 'flex', 
            flexDirection: 'column'
          }}>
            <Heading size="4" mb="2">交互练习</Heading>
            
            {/* 输入区域 */}
            <Box mb="4">
              <TextArea
                placeholder="在这里输入你的提示词..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <Button onClick={handleSubmit}>发送</Button>
            </Box>

            {/* AI响应区域 */}
            <Box 
              style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--gray-2)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <Box 
                style={{ 
                  padding: '0.75rem 1rem',
                  background: 'var(--gray-3)',
                  borderBottom: '1px solid var(--gray-4)'
                }}
              >
                <Text weight="medium">AI 响应</Text>
              </Box>
              <Box 
                style={{ 
                  flex: 1,
                  padding: '1rem',
                  overflowY: 'auto'
                }}
              >
                {aiResponse ? (
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</Text>
                ) : (
                  <Text color="gray">发送提示词后，AI 将在这里给出反馈和建议</Text>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 底部导航栏 */}
      <CourseNavigation
        title="2.4 提示词编写练习"
        prevLesson={{
          title: "2.3 提示词优化练习",
          path: "/courses/ai-tools-basic/quiz/2-3"
        }}
        nextLesson={{
          title: "3.1 AI辅助内容创作",
          path: "/courses/ai-tools-basic/lesson/3-1"
        }}
        onRate={handleRate}
      />
    </Box>
  );
};

export default QuizPage; 