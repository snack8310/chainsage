import React from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import App from './App';

// 导入 Radix UI 主题样式
import '@radix-ui/themes/styles.css';
// 导入自定义样式
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <Theme appearance="dark">
    <App />
  </Theme>
); 