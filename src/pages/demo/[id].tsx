import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import FrameRenderer from '@/components/frame/frame-renderer';
import Layout from '@/components/Layout';
import { useFetch } from '@/hooks/use-fetch.hook';
import { ResponseApi } from '@/interfaces/response-api.interface';
import { Frame } from '@/interfaces/frame.interface';
import { Demo } from '@/interfaces/demo.interface';

const DemoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: demoDetails, loading: loadingDetails, error: errorDetails } = 
    useFetch<ResponseApi<Demo>>(id ? `http://localhost:3000/api/demos/${id}` : '');

  const { data: demo, loading, error } = 
    useFetch<ResponseApi<Frame[]>>(id ? `http://localhost:3000/api/demos/${id}/frames` : '');

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  useEffect(() => {
    if (demo?.dados?.length) {
      const sortedFrames = demo.dados.toSorted((a, b) => a.order - b.order);
      setSelectedFrame(sortedFrames[0]);
    }
  }, [demo]);

  if (loading || loadingDetails) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os frames da demo.</p>;
  if (errorDetails) return <p>Erro ao carregar detalhes da demo.</p>;
  if (!demo || !demoDetails) return <p>Nenhuma demo encontrada.</p>;

  const sortedFrames = demo.dados?.toSorted((a, b) => a.order - b.order) || [];
  const demoName = demoDetails.dados?.name || 'Demo sem nome';

  return (
    <Layout title={demoName}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">{demoName}</h1>

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
              {selectedFrame && <FrameRenderer html={selectedFrame.html} />}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DemoPage;