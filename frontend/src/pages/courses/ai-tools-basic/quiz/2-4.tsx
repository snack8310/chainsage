import React, { useState } from 'react';
import { Box, Container, Heading, Text, Flex, Card, Button, TextArea, Grid, Separator } from '@radix-ui/themes';
import { useRouter } from 'next/router';

const QuizPage: React.FC = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    
    // 添加用户输入到聊天历史
    setChatHistory(prev => [...prev, { role: 'user', content: userInput }]);
    
    // 模拟AI响应
    const aiResponse = "让我帮你分析一下这个提示词...\n\n1. 角色设定：你设定了明确的角色\n2. 任务要求：目标清晰\n3. 输出格式：结构合理\n\n建议：可以添加一些具体的示例，这样AI能更好地理解你的需求。";
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    
    setUserInput('');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
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
          overflowY: 'auto'
        }}>
          <Box style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Heading size="3" mb="4">2.4 提示词编写练习</Heading>
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
            
            {/* 聊天历史 */}
            <Box 
              style={{ 
                flex: 1,
                overflowY: 'auto',
                marginBottom: '0.75rem',
                padding: '0.75rem',
                background: 'var(--gray-2)',
                borderRadius: '4px'
              }}
            >
              {chatHistory.map((message, index) => (
                <Box 
                  key={index} 
                  mb="2"
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: message.role === 'user' ? 'var(--blue-3)' : 'white',
                    borderRadius: '4px',
                    maxWidth: '80%',
                    marginLeft: message.role === 'user' ? 'auto' : '0'
                  }}
                >
                  <Text>{message.content}</Text>
                </Box>
              ))}
            </Box>

            {/* 输入区域 */}
            <Flex gap="2">
              <TextArea
                placeholder="在这里输入你的提示词..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button onClick={handleSubmit}>发送</Button>
            </Flex>

            <Flex justify="end" mt="2">
              <Button
                variant="outline"
                onClick={() => router.push('/courses/ai-tools-basic')}
              >
                返回课程
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>

      {/* 底部导航栏 */}
      <Box 
        style={{ 
          borderTop: '1px solid var(--gray-4)',
          background: 'white',
          padding: '0.5rem 0',
          flexShrink: 0
        }}
      >
        <Container size="4">
          <Flex justify="between" align="center">
            {/* 左侧标题 */}
            <Text size="3" style={{ color: 'var(--gray-11)' }}>2.4 提示词编写练习</Text>

            {/* 中间导航按钮 */}
            <Flex gap="4" align="center">
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/courses/ai-tools-basic/quiz/2-3')}
              >
                ← 2.3 提示词优化练习
              </Button>
              <Button 
                variant="ghost"
                onClick={() => router.push('/courses/ai-tools-basic')}
              >
                评价
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/courses/ai-tools-basic/lesson/3-1')}
              >
                3.1 AI辅助内容创作 →
              </Button>
            </Flex>

            {/* 右侧占位，保持布局平衡 */}
            <Box style={{ width: '120px' }} />
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default QuizPage; 