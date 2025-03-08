import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Get Demo Levy" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="bg-blue-600 text-white p-4">
        <h1>Get Demo</h1>
      </header>
      <main className="flex-grow p-4">
        {children}
      </main>
      <footer className="bg-gray-200 text-center p-4">
        &copy; {new Date().getFullYear()} Get Demo - Levy
      </footer>
    </div>
  );
};


export default Layout;
