import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Get Demo Levy" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Get Demo - Visualize demos interativamente" />
      </Head>
      
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <span className="text-2xl font-bold">Get Demo</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-100 font-medium">Home</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 text-gray-600 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Get Demo - Levy
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;