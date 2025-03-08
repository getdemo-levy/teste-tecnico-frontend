import React from 'react';
import Link from 'next/link';
import { DemoListProps } from '@/interfaces/demo-list-props.interface';

const DemoList: React.FC<DemoListProps> = ({ demos }) => {
  if (!demos?.length) {
    return <p className="text-center text-gray-500">Nenhum dado foi encontrado!</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {demos.map((demo) => (
        <div
          key={demo.id}
          className="bg-white rounded-lg border border-gray-200 p-6 
          shadow-md hover:shadow-lg transition-all duration-300
          hover:-translate-y-1 min-h-[150px] flex flex-col justify-between"
        >
          <div>
            <Link
              href={`/demo/${demo.id}`}
              className="text-lg font-semibold text-blue-600 hover:text-blue-800 
              hover:underline decoration-2 transition-colors"
            >
              {demo.name}
            </Link>
            <p className="mt-2 text-sm text-gray-500 font-mono break-all">
              ID: {demo.id}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DemoList;
