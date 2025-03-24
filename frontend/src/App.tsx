import React, { useState } from 'react';
import { Box, Text, Container, TextField, Button, ScrollArea, Avatar, Flex, Badge, Tabs } from '@radix-ui/themes';
import IntentAnalysis from './components/IntentAnalysis';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box style={{ borderBottom: '1px solid var(--gray-5)', padding: '16px' }}>
        <Container size="3">
          <Flex align="center" justify="center">
            <Text size="5" weight="bold">Aurora Chat</Text>
          </Flex>
        </Container>
      </Box>

      {/* Chat Area */}
      <Box style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <ScrollArea style={{ height: '100%' }}>
          <Container size="3" style={{ padding: '16px' }}>
            {messages.length === 0 ? (
              <Flex direction="column" align="center" justify="center" gap="3" style={{ minHeight: '60vh' }}>
                <Avatar
                  size="6"
                  fallback="A"
                  color="blue"
                />
                <Text size="6" weight="bold">Welcome to Aurora</Text>
                <Text size="2" color="gray">Start a conversation by typing a message below.</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="4">
                {messages.map((message) => (
                  <Flex
                    key={message.id}
                    align="start"
                    gap="3"
                    style={{
                      flexDirection: 'row',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar
                        size="2"
                        fallback="A"
                        color="blue"
                      />
                    )}
                    <Box
                      style={{
                        maxWidth: '80%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: message.role === 'user' ? 'var(--accent-9)' : 'var(--gray-4)',
                      }}
                    >
                      <Text
                        size="2"
                        style={{
                          whiteSpace: 'pre-wrap',
                          color: message.role === 'user' ? 'var(--color-white)' : undefined,
                        }}
                      >
                        {message.content}
                      </Text>
                    </Box>
                    {message.role === 'user' && (
                      <Avatar
                        size="2"
                        fallback="U"
                        color="gray"
                      />
                    )}
                  </Flex>
                ))}
              </Flex>
            )}
          </Container>
        </ScrollArea>
      </Box>

      {/* Input Area */}
      <Box style={{ borderTop: '1px solid var(--gray-5)', padding: '16px' }}>
        <Container size="3">
          <form onSubmit={handleSubmit}>
            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <TextField.Root size="3">
                  <TextField.Input
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </TextField.Root>
              </Box>
              <Button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Flex>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Tabs.List>
          <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
          <Tabs.Trigger value="intent">Intent Analysis</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3" style={{ flex: 1, overflow: 'hidden' }}>
          <Tabs.Content value="chat" style={{ height: '100%' }}>
            <Chat />
          </Tabs.Content>
          <Tabs.Content value="intent" style={{ height: '100%' }}>
            <IntentAnalysis />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
};

export default App; 