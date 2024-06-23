// src/components/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, FormControl, FormLabel, Heading, Text } from '@chakra-ui/react';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'user' && password === 'password') {
      localStorage.setItem('authenticated', 'true');
      navigate('/order-page');
    } else {
      setError('Invalid Credentials');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10" mb="10">
      <Heading as="h1">Login</Heading>
      <FormControl id="username" mt="4">
        <FormLabel>Username</FormLabel>
        <Input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter your username"
        />
      </FormControl>
      <FormControl id="password" mt="4">
        <FormLabel>Password</FormLabel>
        <Input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password"
        />
      </FormControl>
      {error && <Text color="red.500" mt="2">{error}</Text>}
      <Button onClick={handleLogin} mt="4" colorScheme="teal">Login</Button>
    </Box>
  );
};

export default Login;
