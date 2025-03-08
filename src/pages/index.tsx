import React, { useEffect, useState } from 'react';
import DemoList from '../components/demo/demo-list';
import Layout from '../components/Layout';
import { Demo } from '@/interfaces/demo.interface';

const HomePage: React.FC = () => {
  const [demos, setDemos] = useState<Demo[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/demos')
      .then((res) => res.json())
      .then((data) => setDemos(data?.dados))
      .catch((error) => console.error('Erro ao carregar demos', error));
  }, []);

  return (
    <Layout title="Lista de Demos">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Lista de Demos</h1>
        <DemoList demos={demos} />
      </div>
    </Layout>
  );
};

export default HomePage;
