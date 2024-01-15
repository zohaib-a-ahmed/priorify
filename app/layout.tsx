import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Priorify',
  description: 'AI Productivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}