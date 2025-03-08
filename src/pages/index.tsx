import React from 'react';
import DemoList from '../components/demo/demo-list';
import Layout from '../components/Layout';
import { Demo } from '@/interfaces/demo.interface';
import { useFetch } from '@/hooks/use-fetch.hook';
import { ResponseApi } from '@/interfaces/response-api.interface';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const HomePage: React.FC = () => {
  const { data: demosData, loading, error } = useFetch<ResponseApi<Demo[]>>(`${apiUrl}/demos`);
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout title="Lista de Demos">
      {demosData?.dados?.length ?
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Lista de Demos</h1>
          <DemoList demos={demosData.dados} />
        </div> : (
        <p>Nenhum demo encontrado.</p>
      )
      }
    </Layout>
  );
};

export default HomePage;
