import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useData } from '@/context/DataContext';
import { ResultDetailView } from '@/components/ResultDetailView';

export default function ResultByIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const { competitions, brand } = useData();

  if (!id) {
    return (
      <div className="min-h-screen bg-[#060306] flex items-center justify-center text-white/50 text-xs">
        Loading result...
      </div>
    );
  }

  const queryId = String(id).trim().toLowerCase();
  const competition = competitions.find(
    (c) =>
      c.id.toLowerCase() === queryId ||
      String(c.resultNumber) === queryId ||
      c.name.toLowerCase().replace(/\s+/g, '-') === queryId
  ) || competitions[0];

  if (!competition) {
    return (
      <div className="min-h-screen bg-[#060306] flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl font-bold">Result Not Found</h2>
        <button
          onClick={() => router.push('/results')}
          className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold"
        >
          ← Back to Results
        </button>
      </div>
    );
  }

  return (
    <ResultDetailView
      competition={competition}
      onBack={() => router.push('/results')}
    />
  );
}
