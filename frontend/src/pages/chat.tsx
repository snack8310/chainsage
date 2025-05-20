import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Flex, TextField, Button, Container, ScrollArea } from '@radix-ui/themes';
import { useRouter } from 'next/router';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 加载保存的对话历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('courseChatHistory');
    if (savedHistory) {
      const messages = JSON.parse(savedHistory);
      if (messages.length > 0) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: 'Course Search Conversation',
          messages,
          createdAt: new Date()
        };
        setConversations([newConversation]);
        setCurrentConversation(newConversation);
        // 清除保存的历史记录
        localStorage.removeItem('courseChatHistory');
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversation) return;

    // Add user message
    const newMessages = [...currentConversation.messages, { role: 'user' as const, content: input }];
    const updatedConversation = {
      ...currentConversation,
      messages: newMessages
    };
    
    setCurrentConversation(updatedConversation);
    setInput('');

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const response = generateResponse(input);
      const finalMessages = [...newMessages, { role: 'assistant' as const, content: response }];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages
      };
      setCurrentConversation(finalConversation);
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === finalConversation.id ? finalConversation : conv
        )
      );
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

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date()
    };
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
  };

  return (
    <Container size="4" style={{ height: '100vh', padding: '2rem 0' }}>
      <Flex style={{ height: '100%' }} gap="4">
        {/* Sidebar */}
        <Box style={{ width: '260px', borderRight: '1px solid var(--gray-5)' }}>
          <Flex direction="column" gap="4" p="4">
            <Button onClick={createNewConversation} variant="solid">
              New Chat
            </Button>
            <ScrollArea style={{ height: 'calc(100vh - 120px)' }}>
              <Flex direction="column" gap="2">
                {conversations.map(conv => (
                  <Box
                    key={conv.id}
                    onClick={() => setCurrentConversation(conv)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: currentConversation?.id === conv.id ? 'var(--gray-3)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentConversation?.id !== conv.id) {
                        e.currentTarget.style.backgroundColor = 'var(--gray-3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentConversation?.id !== conv.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Text size="2" weight="bold" style={{ marginBottom: '0.25rem' }}>
                      {conv.title}
                    </Text>
                    <Text size="1" color="gray">
                      {conv.messages.length} messages
                    </Text>
                  </Box>
                ))}
              </Flex>
            </ScrollArea>
          </Flex>
        </Box>

        {/* Main Chat Area */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {currentConversation ? (
            <>
              {/* Messages */}
              <ScrollArea style={{ flex: 1, padding: '1rem' }}>
                {currentConversation.messages.map((message, index) => (
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
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Form */}
              <Box style={{ padding: '1rem', borderTop: '1px solid var(--gray-5)' }}>
                <form onSubmit={handleSubmit}>
                  <Flex gap="2">
                    <TextField.Root style={{ flex: 1 }}>
                      <TextField.Input
                        placeholder="Type your message..."
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
            </>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              style={{ height: '100%' }}
              gap="4"
            >
              <Text size="5" weight="bold">Welcome to ChainSage Chat</Text>
              <Text size="3" color="gray" align="center">
                Start a new conversation or continue from where you left off
              </Text>
              <Button size="3" onClick={createNewConversation}>
                Start New Chat
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default ChatPage; 