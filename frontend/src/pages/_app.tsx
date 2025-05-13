import type { AppProps } from 'next/app';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Theme appearance="light" accentColor="blue" grayColor="slate" scaling="100%">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Theme>
  );
} 