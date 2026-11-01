import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});
export const metadata = {
    title: 'Outcome360 - CO-PO Attainment & Accreditation Management System',
    description: 'Next-generation Outcome-Based Education (OBE) and NBA/NAAC Accreditation Management Platform',
};
export default function RootLayout({ children, }) {
    return (<html lang="en" style={{ colorScheme: 'light' }} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body style={{ colorScheme: 'light' }} className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>);
}
