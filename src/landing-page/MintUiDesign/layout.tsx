import { ParticleConnectkit } from './particleconnect';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Particle Connect',
    description: 'Demo showcasing a quickstart for Particle Connect 2.0',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ParticleConnectkit>{children}</ParticleConnectkit>
            </body>
        </html>
    );
}
