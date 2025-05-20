import React, { useState } from 'react';
import { Box, Container, Heading, Text, Flex, Card, Button, RadioGroup, TextArea } from '@radix-ui/themes';
import { useRouter } from 'next/router';

interface Question {
  id: number;
  type: 'multiple-choice' | 'text';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: '以下哪个提示词结构最有效？',
    options: [
      '直接问问题，不做任何说明',
      '设定角色、任务、输出格式，并提供示例',
      '使用复杂的专业术语',
      '只关注任务本身，忽略上下文'
    ],
    correctAnswer: '设定角色、任务、输出格式，并提供示例',
    explanation: '好的提示词应该包含角色设定、明确的任务要求、期望的输出格式，最好还能提供示例。这样可以帮助AI更好地理解你的需求。'
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: '在编写提示词时，以下哪个做法是错误的？',
    options: [
      '使用清晰、具体的语言',
      '提供必要的上下文信息',
      '一次性要求AI完成多个不相关的任务',
      '设定合理的输出格式'
    ],
    correctAnswer: '一次性要求AI完成多个不相关的任务',
    explanation: '一次要求AI完成多个不相关的任务会导致输出质量下降。应该将复杂任务拆分成多个小任务，逐个完成。'
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: '以下哪种提示词更适合用于内容创作？',
    options: [
      '写一篇文章',
      '作为专业作家，请创作一篇关于[主题]的文章，要求：1. 结构清晰 2. 语言生动 3. 包含具体例子',
      '给我写点东西',
      '随便写点什么'
    ],
    correctAnswer: '作为专业作家，请创作一篇关于[主题]的文章，要求：1. 结构清晰 2. 语言生动 3. 包含具体例子',
    explanation: '好的内容创作提示词应该明确角色定位、具体要求和输出标准，这样AI才能生成高质量的内容。'
  },
  {
    id: 4,
    type: 'text',
    question: '请编写一个提示词，要求AI帮助分析一篇关于人工智能的文章，并提取关键观点。',
    correctAnswer: 'role: 专业文章分析专家\ntask: 分析文章并提取关键观点\nformat: 1. 主要论点\n2. 支持论据\n3. 结论\n\n请分析以下文章：[文章内容]',
    explanation: '这个提示词包含了角色设定、明确的任务要求、结构化的输出格式，是一个很好的示例。'
  },
  {
    id: 5,
    type: 'text',
    question: '请编写一个提示词，要求AI帮助优化一段代码，使其更高效、更易读。',
    correctAnswer: 'role: 资深软件工程师\ntask: 代码优化\nrequirements: 1. 提高性能\n2. 提升可读性\n3. 保持功能不变\n\n请优化以下代码：[代码内容]',
    explanation: '代码优化提示词需要明确优化目标、保持功能不变的要求，以及具体的优化方向。'
  }
];

const QuizPage: React.FC = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Container size="2" style={{ padding: '2rem 0' }}>
      <Card style={{ padding: '2rem' }}>
        {!showResults ? (
          <>
            <Flex justify="between" mb="4">
              <Heading size="4">提示词编写练习</Heading>
              <Text color="gray">问题 {currentQuestion + 1} / {questions.length}</Text>
            </Flex>

            <Box 
              style={{ 
                width: '100%', 
                height: '4px', 
                background: 'var(--gray-4)', 
                borderRadius: '2px',
                marginBottom: '1rem'
              }}
            >
              <Box 
                style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  background: 'var(--blue-9)',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </Box>

            <Box mb="4">
              <Text size="4" mb="4">{currentQ.question}</Text>
              
              {currentQ.type === 'multiple-choice' ? (
                <RadioGroup.Root
                  value={answers[currentQuestion] || ''}
                  onValueChange={handleAnswer}
                >
                  <Flex direction="column" gap="3">
                    {currentQ.options?.map((option, index) => (
                      <Flex key={index} gap="2" align="center">
                        <RadioGroup.Item value={option} id={`option-${index}`} />
                        <Text as="label" htmlFor={`option-${index}`}>{option}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </RadioGroup.Root>
              ) : (
                <TextArea
                  placeholder="在这里输入你的提示词..."
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  style={{ minHeight: '150px' }}
                />
              )}
            </Box>

            <Flex justify="end" gap="3">
              <Button
                variant="outline"
                onClick={() => router.push('/courses/ai-tools-basic')}
              >
                返回课程
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
              >
                {currentQuestion === questions.length - 1 ? '完成练习' : '下一题'}
              </Button>
            </Flex>
          </>
        ) : (
          <Box>
            <Heading size="4" mb="4">练习总结</Heading>
            
            <Box mb="4">
              {questions.map((q, index) => (
                <Card key={index} style={{ marginBottom: '1rem', padding: '1rem' }}>
                  <Text weight="bold" mb="2">{q.question}</Text>
                  <Text mb="2">你的答案：{answers[index]}</Text>
                  <Text mb="2">参考答案：{q.correctAnswer}</Text>
                  <Text color="gray">{q.explanation}</Text>
                </Card>
              ))}
            </Box>

            <Flex justify="end">
              <Button onClick={() => router.push('/courses/ai-tools-basic')}>
                返回课程
              </Button>
            </Flex>
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default QuizPage; 