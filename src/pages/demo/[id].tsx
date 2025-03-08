import { useRouter } from 'next/router';
import React, { useState } from 'react';
import FrameRenderer from '@/components/frame/frame-renderer';
import Layout from '@/components/Layout';
import { useFetch } from '@/hooks/use-fetch.hook';
import { ResponseApi } from '@/interfaces/response-api.interface';
import { Frame } from '@/interfaces/frame.interface';

const DemoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: demo, loading, error } = useFetch<ResponseApi<Frame[]>>(id ? `http://localhost:3000/api/demos/${id}/frames` : '');

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  React.useEffect(() => {
    if (demo?.dados?.length) {
      const sortedFrames = demo.dados.toSorted((a, b) => a.order - b.order);
      setSelectedFrame(sortedFrames[0]);
    }
  }, [demo]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar a demo.</p>;
  if (!demo) return <p>Nenhuma demo encontrada.</p>;

  const sortedFrames = demo.dados?.toSorted((a, b) => a.order - b.order) || [];

  return (
    <Layout title='{demo.title}'>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">a</h1>

        {demo.dados?.length > 0 && (
          <>
            <div className="mt-4">
              <select
                onChange={(e) => {
                  const frame = demo.dados.find((f) => f.id === e.target.value);
                  if (frame) setSelectedFrame(frame);
                }}
                className="border p-2"
              >
                {sortedFrames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    Frame {frame.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              {selectedFrame && <FrameRenderer src={selectedFrame.html} />}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DemoPage;
