import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Meu Projeto" }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="bg-blue-600 text-white p-4">
        <h1>Meu Projeto</h1>
      </header>
      <main className="p-4">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        &copy; {new Date().getFullYear()} Meu Projeto
      </footer>
    </div>
  );
};

export default Layout;
