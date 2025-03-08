import React from 'react';
import Link from 'next/link';
import { DemoListProps } from '@/interfaces/demo-list-props.interface';

const DemoList: React.FC<DemoListProps> = ({ demos }) => {
  if (!demos?.length) {
    return <p>Nenhum dado foi encontrado!</p>;
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {demos.map((demo) => (
        <div
          key={demo.id}
          className="bg-white border rounded p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shadow hover:shadow-lg transition"
        >
          <Link
            href={`/demo/${demo.id}`}
            className="text-lg font-bold text-blue-500 hover:underline"
            target="_blank"
          >
            {demo.name}
          </Link>
          <p className="text-gray-600">ID: {demo.id}</p>
        </div>
      ))}
    </div>
  );
};

export default DemoList;
