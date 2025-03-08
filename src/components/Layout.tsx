import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LayoutProps } from '@/interfaces/layout-props.interface';
import GithubIcon from './icons/git-hub-icon';

const Layout: React.FC<LayoutProps> = ({ children, title = "Get Demo Levy" }) => {
  return (
    <div className="min-h-screen flex">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Get Demo - Visualize demos interativamente" />
      </Head>

      <aside className="w-24 bg-gradient-to-b from-blue-600 to-blue-500 shadow-lg flex flex-col justify-between fixed h-full">
        <div className="p-4 flex justify-center items-center h-24">
          <Link href="/" className="text-white text-0.5 font-bold hover:opacity-80 transition-opacity text-center">
            GetDemo
          </Link>
        </div>

        <div className="p-4 border-t border-blue-400 flex justify-center">
          <a
            href="https://github.com/levymc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-200 transition-colors"
          >
            <GithubIcon />
          </a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-48">
        <main className="flex-grow bg-gray-50 p-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 text-gray-600 py-4 px-8">
          <div className="container mx-auto text-center md:text-left">
            &copy; {new Date().getFullYear()} Get Demo - Levy
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;