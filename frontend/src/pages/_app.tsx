import type { AppProps } from 'next/app';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Theme appearance="light" accentColor="blue" grayColor="slate" scaling="100%">
      <Component {...pageProps} />
    </Theme>
  );
} 