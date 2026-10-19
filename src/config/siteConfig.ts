export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  primaryGlow: string;
  secondaryGlow: string;
}

export type ThemeConfig = ThemePreset;

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "qudwa-maroon-cream",
    name: "Qudwa Maroon & Champagne Cream (Official)",
    primary: "#6C0E0E",
    secondary: "#EBD5AA",
    background: "#060306",
    surface: "#140606",
    primaryGlow: "rgba(108, 14, 14, 0.45)",
    secondaryGlow: "rgba(235, 213, 170, 0.45)",
  },
  {
    id: "royal-emerald-gold",
    name: "Royal Emerald & Cyber Gold",
    primary: "#10b981",
    secondary: "#f59e0b",
    background: "#030b07",
    surface: "#07160e",
    primaryGlow: "rgba(16, 185, 129, 0.45)",
    secondaryGlow: "rgba(245, 158, 11, 0.45)",
  },
  {
    id: "electric-violet-cyan",
    name: "Electric Violet & Hyper Cyan",
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    background: "#06040d",
    surface: "#10091e",
    primaryGlow: "rgba(139, 92, 246, 0.45)",
    secondaryGlow: "rgba(6, 182, 212, 0.45)",
  },
  {
    id: "ruby-crimson-amber",
    name: "Ruby Crimson & Sunset Amber",
    primary: "#ef4444",
    secondary: "#f97316",
    background: "#0b0404",
    surface: "#180808",
    primaryGlow: "rgba(239, 68, 68, 0.45)",
    secondaryGlow: "rgba(249, 115, 22, 0.45)",
  },
  {
    id: "sapphire-blue-lime",
    name: "Deep Sapphire & Electric Lime",
    primary: "#3b82f6",
    secondary: "#84cc16",
    background: "#020617",
    surface: "#0b1229",
    primaryGlow: "rgba(59, 130, 246, 0.45)",
    secondaryGlow: "rgba(132, 204, 22, 0.45)",
  },
];

export const siteConfig = {
  // Main Festival & Organization Brand
  eventName: "QUDWA",
  edition: "2026",
  year: "2026",
  organization: "KUIA ARTS FEST",
  subTitle: "KUIA ARTS FEST",
  themeBadge: "فبهداهم اقتده",
  themeTitle: "QUDWA",
  themeSubtext: "KUIA Arts Fest",
  themeDescription:
    '“QUDWA” is inspired by the Qur’anic verse ﴿أُولَٰئِكَ الَّذِينَ هَدَى اللَّهُ فَبِهُدَاهُمُ اقْتَدِهْ﴾ — “Those are the ones whom Allah has guided, so follow their guidance” (Qur’an 6:90), which calls us to follow the footsteps of those whom Allah has guided in order to remain on the right and straight path. In this spirit, QUDWA, meaning an exemplary model whose footsteps are followed, seeks to remember and honour the scholars who showed the way for our community through their knowledge, scholarship, spiritual commitment and service. We especially remember the recently departed scholars of Kasaragod, including Ustād Taqā Aḥmad Musliyār, Professor Alikkutty Ustād—the Qāḍī of Kasaragod Samyuktha Jamāʿath—and the distinguished faqīh Thottiya Mahin Musliyār, along with earlier scholars such as C. M. Ustād and U.M Ustād, whose lives and contributions provided direction and a trajectory for the Ummah. Thus, QUDWA KUIA Arts Fest is not merely a celebration of talent and creativity, but an occasion to remember, honour and carry forward this legacy—transforming remembrance into responsibility by following the footsteps of those who showed the way and preserving their values for future generations. In this sense, QUDWA becomes a living archive of knowledge, heritage and creativity, connecting the legacy of the past with the aspirations of the present and the possibilities of the future.',
  dates: "OCT 12 13 14",
  venue: "KANNIYATH USTHAD ISLAMIC ACADEMY",
  locationCity: "KANNIYATH USTHAD ISLAMIC ACADEMY",
  
  // Contacts & Socials
  socials: {
    instagram: "https://www.instagram.com/ifada_kuia",
    youtube: "https://www.youtube.com/@Ifada_kuia",
    facebook: "https://www.facebook.com/share/1NzZRaNvkU/?mibextid=wwXIfr",
    website: "https://qudwa-2026.vercel.app/",
  },
  builtBy: "Shxmmi",
  brochureUrl: "#brochure",
  defaultPreset: THEME_PRESETS[0],
};

