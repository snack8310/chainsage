import type { AppProps } from 'next/app';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../styles/globals.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { useRouter } from 'next/router';

function AppContent({ Component, pageProps }: AppProps) {
  const { username, logout } = useAuth();
  const router = useRouter();
  
  // 如果是登录页面，不包装 MainLayout
  if (router.pathname === '/login') {
    return <Component {...pageProps} />;
  }
  
  return (
    <MainLayout username={username} onLogout={logout}>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default function App(props: AppProps) {
  return (
    <Theme appearance="light" accentColor="blue" grayColor="slate" scaling="100%">
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </Theme>
  );
} 