import React, { useEffect } from 'react';
import DemoList from '../components/demo/demo-list';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchDemos } from '@/store/home.slice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { demos, loading, error } = useSelector((state: RootState) => state.home);
  useEffect(() => {
  dispatch(fetchDemos())
    .unwrap()
}, [dispatch]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return  (
    <Layout title="GetDemo - Levy Teste">
      {demos?.length ? (
        <div className="container mx-auto px-4 ">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
            Lista de Demos
          </h1>
          <DemoList demos={demos} />
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">Nenhum demo encontrado.</p>
      )}
    </Layout>
  );
};

export default HomePage;
