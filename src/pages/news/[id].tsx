import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { createClient } from '@supabase/supabase-js';
import { GetServerSideProps } from 'next';
import { NewsItem } from '@/data/mockData';

const SUPABASE_URL = 'https://ttttnhfpmyjasivanedt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QLP5XUCgUVb2FodlendPDw_xWW_3XCy';
const SITE_URL = 'https://qudwa-2026.vercel.app';

interface Props {
  ssrNews: NewsItem | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { id } = ctx.params as { id: string };
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await supabase
      .from('fest_news')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      // Map Supabase row to NewsItem shape
      const ssrNews: NewsItem = {
        id: data.id,
        titleMalayalam: data.title_malayalam || data.titleMalayalam || '',
        titleEnglish: data.title_english || data.titleEnglish || '',
        date: data.date || '',
        category: data.category || '',
        image: data.image_url || data.image || '',
        summary: data.summary || '',
        content: Array.isArray(data.content)
          ? data.content
          : data.content
          ? [data.content]
          : [],
      };
      return { props: { ssrNews } };
    }
  } catch (_) {
    // fall through to null
  }
  return { props: { ssrNews: null } };
};

export default function NewsDetailPage({ ssrNews }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const { currentTheme, brand, news } = useData();

  // Prefer client-side data (fresher), fall back to SSR data
  const article =
    news.find((n) => n.id === id) ||
    (ssrNews && ssrNews.id === id ? ssrNews : null) ||
    ssrNews;

  // --- OG meta values (from SSR data so crawlers see them) ---
  const ogTitle = ssrNews
    ? `${ssrNews.titleMalayalam} | ${ssrNews.titleEnglish}`
    : 'QUDWA 2026 News';
  const ogDescription = ssrNews?.summary || 'QUDWA KUIA Arts Fest 2026 – Official News';
  const ogImage = ssrNews?.image
    ? ssrNews.image.startsWith('http')
      ? ssrNews.image
      : `${SITE_URL}${ssrNews.image}`
    : `${SITE_URL}/images/og-default.jpg`;
  const ogUrl = `${SITE_URL}/news/${ssrNews?.id || id || ''}`;

  if (!article) {
    return (
      <div className="min-h-screen pt-32 text-center text-white">
        <h2>Article not found</h2>
        <Link href="/news" className="text-sm underline mt-2 block">
          Back to all news
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content="QUDWA 2026" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* WhatsApp uses og: tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />

      <div className="container max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
          {/* Metadata & Tag */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black"
                style={{ backgroundColor: currentTheme.secondary }}
              >
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {article.titleMalayalam}
            </h1>
            <p className="text-sm sm:text-base text-white/60 font-medium">{article.titleEnglish}</p>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl">
              <img
                src={article.image}
                alt={article.titleMalayalam}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary Lead */}
          {article.summary && (
            <div
              className="p-5 rounded-2xl bg-white/5 border-l-4 text-base font-semibold leading-relaxed"
              style={{ borderColor: currentTheme.primary }}
            >
              {article.summary}
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed font-normal">
            {article.content?.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Footer Share Action */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <span>{brand.eventName} Official Media Release</span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: ogTitle,
                    text: ogDescription,
                    url: ogUrl,
                  });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(ogUrl);
                  alert('Article link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
