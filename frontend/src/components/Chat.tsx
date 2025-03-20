import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Text,
  useColorMode,
  IconButton,
  Container,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

interface Message {
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Implement WebSocket connection and API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({ content: "This is a mock response." }), 1000)
      );

      const botMessage: Message = {
        content: (response as any).content,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxW="container.md" h="100vh">
      <Flex direction="column" h="100%" py={4}>
        <Flex justify="flex-end" mb={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </Flex>

        <Box
          flex="1"
          overflowY="auto"
          borderWidth={1}
          borderRadius="md"
          p={4}
          mb={4}
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.isBot ? 'flex-start' : 'flex-end'}
                maxW="70%"
                bg={message.isBot ? 'brand.100' : 'brand.500'}
                color={message.isBot ? 'black' : 'white'}
                p={3}
                borderRadius="lg"
              >
                <Text>{message.content}</Text>
                <Text fontSize="xs" opacity={0.8} mt={1}>
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <Flex>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            mr={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            isLoading={isLoading}
            loadingText="Sending"
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Chat; 