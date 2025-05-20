import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Flex, TextField, Button, ScrollArea } from '@radix-ui/themes';
import { useRouter } from 'next/router';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CourseSearch: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullChatLink, setShowFullChatLink] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowFullChatLink(scrollHeight > clientHeight);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsExpanded(true);

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages([...newMessages, { role: 'assistant' as const, content: response }]);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    // This is a simple mock response generator
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('beginner') || lowerQuery.includes('start')) {
      return "Based on your interest in getting started, I recommend our 'AI for Business Analysis' course. It's perfect for beginners and covers fundamental concepts with practical examples.";
    } else if (lowerQuery.includes('productivity') || lowerQuery.includes('efficiency')) {
      return "You might be interested in our 'AI-Powered Productivity' course. It focuses on practical tools and techniques to enhance your daily workflow.";
    } else if (lowerQuery.includes('advanced') || lowerQuery.includes('expert')) {
      return "For advanced users, I recommend our 'Advanced AI Integration' course. It covers complex implementations and organizational AI strategies.";
    }
    return "I can help you find the right course. Could you tell me more about your experience level and specific interests in AI?";
  };

  const handleFullChatClick = () => {
    // Save current chat history
    localStorage.setItem('courseChatHistory', JSON.stringify(messages));
    // Navigate to full chat page
    router.push('/chat');
  };

  return (
    <Box
      style={{
        height: isExpanded ? '400px' : '60px',
        transition: 'height 0.3s ease-in-out',
        border: '1px solid var(--gray-5)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'white'
      }}
    >
      {isExpanded && (
        <ScrollArea
          ref={messagesContainerRef}
          style={{
            height: 'calc(100% - 60px)',
            padding: '1rem'
          }}
        >
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.role === 'user' ? 'end' : 'start'}
              mb="3"
            >
              <Box
                style={{
                  maxWidth: '80%',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: message.role === 'user' ? 'var(--blue-9)' : 'var(--gray-3)',
                  color: message.role === 'user' ? 'white' : 'inherit'
                }}
              >
                <Text size="3">{message.content}</Text>
              </Box>
            </Flex>
          ))}
          {showFullChatLink && (
            <Flex justify="center" mt="3">
              <Button
                variant="ghost"
                onClick={handleFullChatClick}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                Continue in full chat →
              </Button>
            </Flex>
          )}
        </ScrollArea>
      )}
      <Box
        style={{
          padding: isExpanded ? '1rem' : '16px 24px',
          borderTop: isExpanded ? '1px solid var(--gray-5)' : 'none',
          height: isExpanded ? 'auto' : '60px',
          display: 'flex',
          alignItems: isExpanded ? 'stretch' : 'center',
          justifyContent: 'center',
          background: 'white',
          width: '100%'
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%'
          }}
        >
          <Flex gap="2" align={isExpanded ? undefined : 'center'}>
            <TextField.Root style={{ flex: 1 }}>
              <TextField.Input
                placeholder="Ask about our courses..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </TextField.Root>
            <Button type="submit" variant="solid">
              Send
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default CourseSearch; 