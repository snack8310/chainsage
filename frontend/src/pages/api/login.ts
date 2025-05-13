import type { NextApiRequest, NextApiResponse } from 'next';

// Mock user database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Find user in mock database
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real application, you would generate a JWT token here
  return res.status(200).json({
    username: user.username,
    message: 'Login successful',
  });
} 