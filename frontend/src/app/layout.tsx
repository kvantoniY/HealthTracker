import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AuthBootstrapper } from '@/shared/ui/AuthBootstrapper';

export const metadata: Metadata = {
  title: 'HealthTracker',
  description: 'HealthTracker app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <AuthBootstrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
