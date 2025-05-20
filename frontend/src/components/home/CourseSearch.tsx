import React, { useState, useRef, useEffect } from 'react';
import { Box, Text, Flex, TextField, Button, Card } from '@radix-ui/themes';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CourseSearch: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Expand the chat if it's not already expanded
    if (!isExpanded) {
      setIsExpanded(true);
    }

    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');

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

  return (
    <Card style={{ marginBottom: '3rem' }}>
      <Box style={{ 
        height: isExpanded ? '400px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s ease-in-out'
      }}>
        {/* Messages Container - Only show when expanded */}
        {isExpanded && (
          <Box style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '1rem',
            background: 'var(--gray-2)'
          }}>
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
                    background: message.role === 'user' ? 'var(--blue-9)' : 'white',
                    color: message.role === 'user' ? 'white' : 'inherit',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <Text size="3">{message.content}</Text>
                </Box>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}

        {/* Input Form */}
        <Box style={{ 
          padding: '1rem', 
          borderTop: isExpanded ? '1px solid var(--gray-5)' : 'none',
          background: 'white'
        }}>
          <form onSubmit={handleSubmit}>
            <Flex gap="2">
              <TextField.Root style={{ flex: 1 }}>
                <TextField.Input
                  placeholder="Ask about courses..."
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
    </Card>
  );
};

export default CourseSearch; 