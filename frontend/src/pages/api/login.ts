import type { NextApiRequest, NextApiResponse } from 'next';

// Mock user database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];

// Real API configuration
const REAL_API_URL = process.env.API_URL || 'http://localhost:3001';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Check if we should use mock data
  if (process.env.USE_MOCK === 'true') {
    // Find user in mock database
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      username: user.username,
      message: 'Login successful (Mock)',
    });
  } else {
    try {
      // Call real API
      const response = await fetch(`${REAL_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json({
        ...data,
        message: 'Login successful (Real API)',
      });
    } catch (error) {
      console.error('Error calling real API:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 