// ─── Mock Data for 路邊玄學堂 MVP ───────────────────────────────────────────

export interface MysticMaster {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  tradition: "chinese" | "western";
  bio: string;
  avatar: string; // 【待 Ray 提供：真實相片 URL】
  videoCount: number;
  articleCount: number;
  rayEndorsement: string; // Ray 親身推薦語（廣東話）
  tags: string[];
}

export interface MysticVideo {
  id: string;
  title: string;
  masterId: string;
  masterName: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: number;
  isPremium: boolean;
  publishedAt: string;
  description: string;
}

export interface MysticArticle {
  id: string;
  title: string;
  masterId: string;
  masterName: string;
  category: string;
  excerpt: string;
  readTime: number;
  views: number;
  isPremium: boolean;
  publishedAt: string;
  tags: string[];
}

// ─── Masters ────────────────────────────────────────────────────────────────

// 【待 Ray 提供：師傅真實姓名、相片、資歷數字、一句自我介紹（廣東話）】
export const MYSTIC_MASTERS: MysticMaster[] = [
  {
    id: "master-1",
    name: "【待 Ray 提供師傅姓名】",
    title: "紫微斗數 / 奇門遁甲",
    specialty: ["紫微斗數", "奇門遁甲", "流年運程"],
    tradition: "chinese",
    bio: "【待 Ray 提供：師傅簡介，建議包含實際資歷年數、擅長領域、服務區域】",
    avatar: "【待提供相片 URL】",
    videoCount: 0,
    articleCount: 0,
    rayEndorsement: "【待 Ray 提供：親身推薦語，廣東話，30 字以內】",
    tags: ["紫微斗數", "奇門遁甲", "流年"],
  },
  {
    id: "master-2",
    name: "【待 Ray 提供師傅姓名】",
    title: "八字命理 / 風水勘察",
    specialty: ["八字命理", "風水勘察", "奇門遁甲"],
    tradition: "chinese",
    bio: "【待 Ray 提供：師傅簡介】",
    avatar: "【待提供相片 URL】",
    videoCount: 0,
    articleCount: 0,
    rayEndorsement: "【待 Ray 提供：親身推薦語】",
    tags: ["八字命理", "風水", "財運"],
  },
  {
    id: "master-3",
    name: "【待 Ray 提供師傅姓名】",
    title: "西洋占星 / 星座分析",
    specialty: ["星座占星", "月亮星座", "西洋占星流年"],
    tradition: "western",
    bio: "【待 Ray 提供：師傅簡介】",
    avatar: "【待提供相片 URL】",
    videoCount: 0,
    articleCount: 0,
    rayEndorsement: "【待 Ray 提供：親身推薦語】",
    tags: ["星座", "占星", "月亮星座"],
  },
  {
    id: "master-4",
    name: "【待 Ray 提供師傅姓名】",
    title: "生命靈數 / 塔羅占卜",
    specialty: ["生命靈數", "塔羅牌", "人類圖"],
    tradition: "western",
    bio: "【待 Ray 提供：師傅簡介】",
    avatar: "【待提供相片 URL】",
    videoCount: 0,
    articleCount: 0,
    rayEndorsement: "【待 Ray 提供：親身推薦語】",
    tags: ["生命靈數", "塔羅", "人類圖"],
  },
];

// ─── Videos ─────────────────────────────────────────────────────────────────

export const MYSTIC_VIDEOS: MysticVideo[] = [
  {
    id: "v1",
    title: "2026 十二星座流年大解析｜事業財運感情全面睇",
    masterId: "master-3",
    masterName: "Stella 星",
    category: "星座",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "28:45",
    views: 15420,
    isPremium: false,
    publishedAt: "2025-12-15",
    description: "2026年十二星座完整流年分析，涵蓋事業、財運、感情三大範疇。",
  },
  {
    id: "v2",
    title: "紫微斗數睇事業轉機｜2026年邊幾個月最有利？",
    masterId: "master-1",
    masterName: "陳天命",
    category: "紫微斗數",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "35:12",
    views: 8930,
    isPremium: false,
    publishedAt: "2025-12-20",
    description: "以紫微斗數分析2026年事業轉機，找出最有利的行動月份。",
  },
  {
    id: "v3",
    title: "奇門遁甲睇財位｜2026年財運方位大公開",
    masterId: "master-2",
    masterName: "李玄機",
    category: "奇門遁甲",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "22:30",
    views: 6750,
    isPremium: true,
    publishedAt: "2025-12-22",
    description: "奇門遁甲財位分析，2026年財運方位及開運佈局。",
  },
  {
    id: "v4",
    title: "生命靈數睇感情模式｜點解你總係遇到同一類人？",
    masterId: "master-4",
    masterName: "數字王",
    category: "生命靈數",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "31:08",
    views: 12300,
    isPremium: false,
    publishedAt: "2025-12-18",
    description: "用生命靈數解析感情模式，了解自己的感情課題。",
  },
  {
    id: "v5",
    title: "2026年邊幾個月份要小心？玄學家聯合預警",
    masterId: "master-1",
    masterName: "陳天命",
    category: "流年運程",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "18:55",
    views: 21500,
    isPremium: false,
    publishedAt: "2025-12-28",
    description: "多位玄學家聯合分析2026年需要特別注意的月份。",
  },
  {
    id: "v6",
    title: "開運顏色教學｜根據你的命盤選擇最強開運色",
    masterId: "master-3",
    masterName: "Stella 星",
    category: "開運教學",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "15:20",
    views: 9870,
    isPremium: true,
    publishedAt: "2026-01-05",
    description: "根據個人命盤及星座選擇最適合的開運顏色。",
  },
  {
    id: "v7",
    title: "流年桃花運分析｜2026年感情運最旺係邊個星座？",
    masterId: "master-3",
    masterName: "Stella 星",
    category: "星座",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "24:40",
    views: 18900,
    isPremium: false,
    publishedAt: "2026-01-10",
    description: "2026年感情運及桃花運完整分析。",
  },
  {
    id: "v8",
    title: "玄學家訪談｜點解我會走上玄學這條路？",
    masterId: "master-2",
    masterName: "李玄機",
    category: "嘉賓訪談",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "42:15",
    views: 5430,
    isPremium: false,
    publishedAt: "2026-01-15",
    description: "玄學家分享自己走上玄學研究之路的故事。",
  },
];

// ─── Articles ───────────────────────────────────────────────────────────────

export const MYSTIC_ARTICLES: MysticArticle[] = [
  {
    id: "a1",
    title: "紫微斗數入門：點睇自己嘅命宮？",
    masterId: "master-1",
    masterName: "陳天命",
    category: "紫微斗數",
    excerpt: "紫微斗數係中國傳統命理學中最精密嘅系統之一，以出生年月日時排出命盤，分析人生各個範疇。今篇帶你了解命宮嘅基本概念。",
    readTime: 8,
    views: 4230,
    isPremium: false,
    publishedAt: "2025-12-10",
    tags: ["紫微斗數", "入門", "命宮"],
  },
  {
    id: "a2",
    title: "奇門遁甲係乜？同八字有咩分別？",
    masterId: "master-2",
    masterName: "李玄機",
    category: "奇門遁甲",
    excerpt: "奇門遁甲係中國古代兵法及預測學，以時空能量分析吉凶方位。同八字命理最大分別係，奇門更側重於時機選擇及方位佈局。",
    readTime: 6,
    views: 3150,
    isPremium: false,
    publishedAt: "2025-12-12",
    tags: ["奇門遁甲", "入門", "八字"],
  },
  {
    id: "a3",
    title: "生命靈數點計？一分鐘知道你嘅靈數",
    masterId: "master-4",
    masterName: "數字王",
    category: "生命靈數",
    excerpt: "生命靈數係西方玄學中最易入門嘅系統，只需要你嘅出生日期即可計算。今篇教你計算自己嘅生命靈數，了解你嘅人生課題。",
    readTime: 5,
    views: 8920,
    isPremium: false,
    publishedAt: "2025-12-15",
    tags: ["生命靈數", "入門", "計算方法"],
  },
  {
    id: "a4",
    title: "2026 十二星座運程｜事業財運感情全面分析",
    masterId: "master-3",
    masterName: "Stella 星",
    category: "星座",
    excerpt: "2026年對十二星座嚟講係充滿變化嘅一年。木星進入雙子座，帶來溝通及學習機遇；土星繼續在雙魚座，考驗精神層面嘅成長。",
    readTime: 15,
    views: 22400,
    isPremium: false,
    publishedAt: "2025-12-20",
    tags: ["星座", "2026", "流年運程"],
  },
  {
    id: "a5",
    title: "2026年流年財運分析｜邊幾個月最旺財？",
    masterId: "master-1",
    masterName: "陳天命",
    category: "流年運程",
    excerpt: "以紫微斗數及奇門遁甲分析2026年整體財運走勢，找出最適合投資、轉工、創業嘅黃金月份。",
    readTime: 10,
    views: 15600,
    isPremium: true,
    publishedAt: "2025-12-25",
    tags: ["財運", "2026", "紫微斗數"],
  },
  {
    id: "a6",
    title: "感情運注意事項｜點解有人年年失戀？",
    masterId: "master-3",
    masterName: "Stella 星",
    category: "感情運",
    excerpt: "從占星角度分析感情模式，了解為何某些人總是遇到相似嘅感情困境，以及如何透過了解自己嘅星盤改善感情運。",
    readTime: 8,
    views: 11200,
    isPremium: false,
    publishedAt: "2026-01-02",
    tags: ["感情運", "星座", "感情模式"],
  },
  {
    id: "a7",
    title: "家居風水基本位｜2026年財位在哪裡？",
    masterId: "master-2",
    masterName: "李玄機",
    category: "風水",
    excerpt: "2026年流年財位分析，教你如何佈置家居以配合流年風水，提升財運及事業運。",
    readTime: 7,
    views: 9340,
    isPremium: true,
    publishedAt: "2026-01-05",
    tags: ["風水", "財位", "家居佈置"],
  },
  {
    id: "a8",
    title: "開運方法懶人包｜唔使花錢嘅開運秘訣",
    masterId: "master-4",
    masterName: "數字王",
    category: "開運教學",
    excerpt: "整合中西玄學嘅開運方法，包括顏色、方位、數字、時間等，簡單易行，唔需要花費大量金錢。",
    readTime: 6,
    views: 18700,
    isPremium: false,
    publishedAt: "2026-01-08",
    tags: ["開運", "懶人包", "生命靈數"],
  },
];

// ─── Analysis Categories ─────────────────────────────────────────────────────

export const CHINESE_METHODS = [
  { id: "ziwei", name: "紫微斗數", icon: "🌟", desc: "以命盤分析人生各範疇" },
  { id: "qimen", name: "奇門遁甲", icon: "☯", desc: "時空能量吉凶方位分析" },
  { id: "bazi", name: "八字命理", icon: "📜", desc: "以生辰八字分析命格" },
  { id: "meihua", name: "梅花易數", icon: "🌸", desc: "以易理卜算吉凶" },
  { id: "fengshui", name: "風水流年", icon: "🏠", desc: "流年風水方位佈局" },
  { id: "naming", name: "姓名學", icon: "✍️", desc: "以姓名筆劃分析運勢" },
];

export const WESTERN_METHODS = [
  { id: "astrology", name: "星座占星", icon: "⭐", desc: "以星盤分析性格及運勢" },
  { id: "numerology", name: "生命靈數", icon: "🔢", desc: "以出生日期計算靈數" },
  { id: "tarot", name: "塔羅牌", icon: "🃏", desc: "塔羅牌解讀人生課題" },
  { id: "humandesign", name: "人類圖", icon: "💫", desc: "了解自身能量類型" },
  { id: "western-annual", name: "西洋占星流年", icon: "🪐", desc: "流年星象分析" },
  { id: "moon", name: "月亮星座分析", icon: "🌙", desc: "月亮星座情感分析" },
  { id: "akashic", name: "阿卡西紀錄", icon: "💫✨", desc: "前世今生、靈魂伴侶解讀", isNew: true },
];

export const ANALYSIS_TOPICS = [
  { id: "annual", name: "流年總運", icon: "📅" },
  { id: "career", name: "事業運", icon: "💼" },
  { id: "wealth", name: "財運", icon: "💰" },
  { id: "love", name: "感情運", icon: "❤️" },
  { id: "family", name: "家庭運", icon: "🏠" },
  { id: "health", name: "健康運", icon: "💪" },
  { id: "lucky", name: "貴人運", icon: "🌟" },
  { id: "tips", name: "開運建議", icon: "✨" },
];

export const VIDEO_CATEGORIES = ["全部", "星座", "紫微斗數", "奇門遁甲", "生命靈數", "流年運程", "開運教學", "嘉賓訪談"];
export const ARTICLE_CATEGORIES = ["全部", "紫微斗數", "奇門遁甲", "生命靈數", "星座", "流年運程", "感情運", "風水", "開運教學"];
