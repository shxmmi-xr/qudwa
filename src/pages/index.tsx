import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  Sparkles,
  ArrowRight,
  Play,
  Download,
  Calendar,
  MapPin,
  Trophy,
  User,
  Newspaper,
  Image as ImageIcon,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { VideoModal } from '@/components/VideoModal';
import { LightboxModal } from '@/components/LightboxModal';
import { HeroAnimation } from '@/components/HeroAnimation';
import { GalleryItem, MediaVideo } from '@/data/mockData';

export default function Home() {
  const { currentTheme, brand, news, gallery, videos } = useData();
  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  return (
    <div className="relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`${brand.eventName} ${brand.year} | Home`}</title>
      </Head>

      {/* ----------------- SECTION 1: HERO ----------------- */}
      <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-daisies.png"
            alt={`${brand.eventName} Background`}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle Scrim & Gradient Overlay for Contrast & Seamless Blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060306]/75 via-[#060306]/35 to-[#060306]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Dynamic Theme Banner Ribbons */}
        <HeroAnimation theme={currentTheme} brand={brand} />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        <div className="container max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center px-4">
          {/* AL IFADA STUDENTS UNION & LOGO (TOP OF HERO - ABOVE FABIHUDAHUM AYAH) */}
          <div className="mb-3.5 flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="w-5 h-7 sm:w-6 sm:h-8 flex items-center justify-center shrink-0">
              <img
                src="/images/ifada-logo.png"
                alt="Al Ifada Students Union Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase text-white drop-shadow-sm">
              AL IFADA STUDENTS UNION
            </span>
          </div>

          {/* Animated Tagline Pill (Kannur Style) */}
          <div className="mb-5 flex justify-center">
            <span
              className="inline-block -rotate-2 px-3.5 py-1 text-[11px] font-semibold rounded-sm tracking-normal font-sans shadow-md"
              style={{
                backgroundColor: currentTheme.primary,
                color: currentTheme.secondary,
                boxShadow: `0 0 20px ${currentTheme.primaryGlow}`,
                direction: 'rtl',
              }}
            >
              فبهداهم اقتده
            </span>
          </div>

          {/* Official QUDWA Calligraphy Footprint Emblem */}
          <div className="mb-2 flex justify-center">
            <div className="relative w-16 h-28 sm:w-20 sm:h-36 p-1 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img
                src="/images/qudwa-logo.png"
                alt="Qudwa Official Footprint Calligraphy Emblem"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Main Title & Subtitle (Modern Website Sans Style) */}
          <div
            className="flex flex-col items-center justify-center mt-2 text-center"
            style={{
              filter: `drop-shadow(0 0 35px ${currentTheme.secondaryGlow})`,
            }}
          >
            {/* Top Name: QUDWA */}
            <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-none uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              QUDWA
            </h1>

            {/* Under that: KUIA ARTS FEST (Solid Secondary - No Gradient) */}
            <span
              className="block font-sans text-sm sm:text-lg md:text-2xl font-black uppercase mt-2.5 sm:mt-3 tracking-[0.25em]"
              style={{
                color: currentTheme.secondary,
              }}
            >
              KUIA ARTS FEST
            </span>
          </div>

          {/* Under that: OCT 12 13 14  KANNIYATH USTHAD ISLAMIC ACADEMY */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
            <span
              className="font-serif text-base sm:text-xl italic font-medium tracking-wide"
              style={{ color: currentTheme.secondary }}
            >
              OCT 12 13 14
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="font-serif text-lg sm:text-2xl font-bold text-white tracking-wide uppercase">
              KANNIYATH USTHAD ISLAMIC ACADEMY
            </span>
          </div>

          {/* Action Buttons (Exact Kannur Sahityotsav Rounded-Full Style) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-[460px] px-4 pointer-events-auto">
            <Link href="/login" className="w-full sm:w-[210px] block">
              <button
                className="w-full rounded-full px-5 py-3 text-sm font-medium transition-all duration-200 active:scale-95 hover:brightness-105 shadow-xl"
                style={{
                  backgroundColor: currentTheme.secondary,
                  color: currentTheme.primary,
                  boxShadow: `0 10px 30px ${currentTheme.secondaryGlow}`,
                }}
              >
                Participant Login
              </button>
            </Link>
            <Link href="/results" className="w-full sm:w-[210px] block">
              <button
                className="w-full rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 active:scale-95 hover:bg-white/10"
                style={{
                  borderColor: currentTheme.secondary,
                  color: currentTheme.secondary,
                }}
              >
                Get Results
              </button>
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/40 flex flex-col items-center gap-1 animate-bounce">
            <span>Scroll</span>
            <div className="w-1 h-2.5 rounded-full bg-white/30" />
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: ABOUT THEME ----------------- */}
      <section
        id="about"
        className="relative w-full py-24 md:py-32 px-6 overflow-hidden flex flex-col items-center border-t border-white/5"
      >
        <div
          className="absolute top-10 left-0 w-[350px] h-[350px] blur-[140px] rounded-full pointer-events-none opacity-20"
          style={{ backgroundColor: currentTheme.primary }}
        />
        <div
          className="absolute bottom-10 right-0 w-[350px] h-[350px] blur-[140px] rounded-full pointer-events-none opacity-20"
          style={{ backgroundColor: currentTheme.secondary }}
        />

        <div className="mb-6">
          <span
            className="inline-block -rotate-2 px-3 py-1 text-xs font-extrabold italic text-white rounded-md shadow-lg"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 20px ${currentTheme.primaryGlow}`,
            }}
          >
            About Theme
          </span>
        </div>

        <h2 className="text-center mb-8 flex flex-col md:flex-row items-center justify-center gap-3 text-3xl sm:text-5xl font-black">
          <span
            className="text-white"
          >
            {(brand.themeTitle && !brand.themeTitle.toLowerCase().includes('sahityotsav') && !brand.themeTitle.toLowerCase().includes('millath')) ? brand.themeTitle : 'QUDWA'}
          </span>
          <span
            className="px-4 py-1 rounded-xl font-extrabold shadow-xl text-2xl sm:text-4xl"
            style={{
              backgroundColor: currentTheme.secondary,
              color: currentTheme.primary,
              boxShadow: `0 4px 25px ${currentTheme.secondaryGlow}`,
            }}
          >
            {(brand.themeSubtext && !brand.themeSubtext.toLowerCase().includes('literary')) ? brand.themeSubtext : 'Kuia Arts Fest'}
          </span>
        </h2>

        <div className="max-w-4xl mx-auto space-y-6 z-10">
          {/* Qur'anic Ayah Callout Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl text-center">
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentTheme.primary }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentTheme.secondary }}
            />

            {/* Arabic Verse */}
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-300 mb-3 tracking-wide leading-loose drop-shadow"
              dir="rtl"
            >
              ﴿ أُولَٰئِكَ الَّذِينَ هَدَى اللَّهُ فَبِهُدَاهُمُ اقْتَدِهْ ﴾
            </div>

            {/* Translation & Reference */}
            <p className="text-sm sm:text-base font-semibold text-white/90 italic max-w-2xl mx-auto leading-relaxed">
              &ldquo;Those are the ones whom Allah has guided, so follow their guidance&rdquo;
            </p>
            <span className="inline-block text-xs font-bold text-amber-400 mt-2 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Qur&rsquo;an 6:90
            </span>
          </div>

          {/* Full Narrative Text */}
          <div className="space-y-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-md text-left sm:text-justify">
            <p>
              <strong className="text-white font-bold">&ldquo;QUDWA&rdquo;</strong> is inspired by the Qur&rsquo;anic verse{' '}
              <span className="text-amber-300 font-semibold" dir="rtl">﴿أُولَٰئِكَ الَّذِينَ هَدَى اللَّهُ فَبِهُدَاهُمُ اقْتَدِهْ﴾</span>{' '}
              — &ldquo;Those are the ones whom Allah has guided, so follow their guidance&rdquo; (Qur&rsquo;an 6:90), which calls us to follow the footsteps of those whom Allah has guided in order to remain on the right and straight path. In this spirit, <strong className="text-white font-bold">QUDWA</strong>, meaning an exemplary model whose footsteps are followed, seeks to remember and honour the scholars who showed the way for our community through their knowledge, scholarship, spiritual commitment and service.
            </p>

            <p>
              We especially remember the recently departed scholars of Kasaragod, including <strong className="text-white font-bold">Ustād Taqā Aḥmad Musliyār</strong>, <strong className="text-white font-bold">Professor Alikkutty Ustād</strong>—the Qāḍī of Kasaragod Samyuktha Jamāʿath—and the distinguished faqīh <strong className="text-white font-bold">Thottiya Mahin Musliyār</strong>, along with earlier scholars such as <strong className="text-white font-bold">C. M. Ustād</strong> and <strong className="text-white font-bold">U.M Ustād</strong>, whose lives and contributions provided direction and a trajectory for the Ummah.
            </p>

            <p>
              Thus, <strong className="text-white font-bold">QUDWA KUIA Arts Fest</strong> is not merely a celebration of talent and creativity, but an occasion to remember, honour and carry forward this legacy—transforming remembrance into responsibility by following the footsteps of those who showed the way and preserving their values for future generations. In this sense, QUDWA becomes a living archive of knowledge, heritage and creativity, connecting the legacy of the past with the aspirations of the present and the possibilities of the future.
            </p>
          </div>
        </div>

        {/* Theme Artwork Card */}
        <div className="mt-12 w-full max-w-3xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-8 text-center relative overflow-hidden backdrop-blur-xl group hover:border-white/20 transition-all">
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${currentTheme.primary} 0%, transparent 70%)`,
            }}
          />
          <div className="w-24 h-40 mx-auto mb-4 relative flex items-center justify-center">
            <img
              src="/images/qudwa-logo.png"
              alt="QUDWA Theme Official Emblem"
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          <h3 className="text-2xl font-black text-white tracking-wide uppercase mb-2">
            Living Archive of Creativity • QUDWA
          </h3>
          <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
            Connecting the legacy of the past with the aspirations of the present and the possibilities of the future.
          </p>
        </div>
      </section>

      {/* ----------------- SECTION 3: LATEST NEWS ----------------- */}
      <section className="py-20 md:py-28 relative overflow-hidden border-t border-white/5" id="news">
        <div className="container max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Newspaper className="w-5 h-5" style={{ color: currentTheme.secondary }} />
                <span
                  className="text-xs uppercase tracking-widest font-black"
                  style={{ color: currentTheme.secondary }}
                >
                  Latest Updates
                </span>
              </div>
              <h2
                className="text-3xl md:text-5xl font-black text-white tracking-tight w-fit"
              >
                Festival News
              </h2>
            </div>

            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-white/80 hover:text-white group"
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {news.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group flex flex-col gap-4 rounded-3xl bg-white/[0.02] border border-white/10 p-4 sm:p-5 hover:bg-white/[0.05] hover:border-white/20 transition-all"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl">
                  <img
                    src={item.image}
                    alt={item.titleMalayalam}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>

                <div className="px-1">
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"
                    style={{ color: currentTheme.secondary }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentTheme.secondary }}
                    />
                    {item.date} • {item.category}
                  </p>
                  <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-white/90 transition-colors line-clamp-2 leading-snug">
                    {item.titleMalayalam}
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm line-clamp-2 mt-2 font-medium">
                    {item.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 4: EVENT GALLERY PREVIEW ----------------- */}
      <section className="py-20 md:py-28 relative border-t border-white/5 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none opacity-10"
          style={{ backgroundColor: currentTheme.primary }}
        />

        <div className="container max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                Event Gallery
              </h2>
              <p className="text-white/50 text-sm md:text-base font-medium max-w-2xl">
                Relive the moments. A visual journey through the energy and celebrations of {brand.eventName}.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all"
            >
              <ImageIcon className="w-4 h-4" style={{ color: currentTheme.secondary }} />
              <span>View Full Gallery</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {gallery.slice(0, 8).map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedGalleryItem(img)}
                className="aspect-square relative rounded-2xl overflow-hidden group bg-white/5 border border-white/10 cursor-pointer shadow-lg"
              >
                <img
                  src={img.image}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-xs font-bold text-white drop-shadow-md">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 5: VIDEO HIGHLIGHTS ----------------- */}
      <section className="py-20 md:py-28 relative overflow-hidden border-t border-white/5">
        <div className="container max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <div className="flex flex-col mb-12 text-center md:text-left">
            <h2
              className="text-3xl md:text-5xl font-black text-white tracking-tight pb-1"
            >
              Video Highlights & Reels
            </h2>
            <p className="text-sm md:text-base text-white/60 font-medium max-w-2xl mt-1">
              Catch the best keynote speeches, artistic performances, and highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {videos.slice(0, 2).map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-white/5 w-full shadow-xl hover:shadow-2xl transition-all aspect-[16/9] cursor-pointer"
              >
                <img
                  src={video.thumbnail || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform shadow-lg"
                    style={{ backgroundColor: `${currentTheme.primary}70` }}
                  >
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 to-transparent">
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded text-black mb-1 inline-block"
                    style={{ backgroundColor: currentTheme.secondary }}
                  >
                    {video.speaker}
                  </span>
                  <p className="text-white font-bold text-xs sm:text-sm line-clamp-2 drop-shadow-md">
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/media"
              className="text-xs uppercase font-bold tracking-wider flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: currentTheme.secondary }}
            >
              <span>View All Videos & Talks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 6: BROCHURE CTA BANNER ----------------- */}
      <section
        className="py-16 px-6 relative overflow-hidden text-white"
        style={{
          backgroundColor: currentTheme.primary,
        }}
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/20 rounded-full blur-[60px] pointer-events-none" />

        <div className="container max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Get the Full Details
            </h2>
            <p className="text-white/90 text-sm md:text-base font-medium">
              Download the official {brand.eventName} brochure to learn more about competition rules, stages, and schedules.
            </p>
          </div>

          <button
            onClick={() => {
              alert(`Downloading official brochure for ${brand.eventName} ${brand.year}...`);
            }}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-black hover:bg-black hover:text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all hover:scale-105 shadow-2xl"
          >
            <Download className="w-4 h-4" />
            <span>Download Brochure</span>
          </button>
        </div>
      </section>

      {/* Modals */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <LightboxModal item={selectedGalleryItem} onClose={() => setSelectedGalleryItem(null)} />
    </div>
  );
}
