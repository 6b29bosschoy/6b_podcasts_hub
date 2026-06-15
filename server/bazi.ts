/**
 * 八字推算核心演算法
 * 根據出生年月日時推算四柱八字、藏干、十神、大運、流年
 */

// ── 天干 ──────────────────────────────────────────────────
export const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export type Tiangan = typeof TIANGAN[number];

// 天干五行
export const TIANGAN_WUXING: Record<Tiangan, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

// 天干陰陽
export const TIANGAN_YINYANG: Record<Tiangan, string> = {
  甲: "陽", 乙: "陰", 丙: "陽", 丁: "陰", 戊: "陽",
  己: "陰", 庚: "陽", 辛: "陰", 壬: "陽", 癸: "陰",
};

// 天干顏色（用於命盤顯示）
export const TIANGAN_COLOR: Record<Tiangan, string> = {
  甲: "#22c55e", 乙: "#22c55e",   // 木 - 綠
  丙: "#ef4444", 丁: "#ef4444",   // 火 - 紅
  戊: "#f59e0b", 己: "#f59e0b",   // 土 - 黃
  庚: "#94a3b8", 辛: "#94a3b8",   // 金 - 灰白
  壬: "#3b82f6", 癸: "#3b82f6",   // 水 - 藍
};

// ── 地支 ──────────────────────────────────────────────────
export const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export type Dizhi = typeof DIZHI[number];

// 地支五行
export const DIZHI_WUXING: Record<Dizhi, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

// 地支顏色
export const DIZHI_COLOR: Record<Dizhi, string> = {
  子: "#3b82f6", 丑: "#f59e0b", 寅: "#22c55e", 卯: "#22c55e",
  辰: "#f59e0b", 巳: "#ef4444", 午: "#ef4444", 未: "#f59e0b",
  申: "#94a3b8", 酉: "#94a3b8", 戌: "#f59e0b", 亥: "#3b82f6",
};

// 地支藏干
export const DIZHI_CANGGAN: Record<Dizhi, Tiangan[]> = {
  子: ["壬"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

// 納音五行
const NAYIN: Record<string, string> = {
  "甲子": "海中金", "乙丑": "海中金", "丙寅": "爐中火", "丁卯": "爐中火",
  "戊辰": "大林木", "己巳": "大林木", "庚午": "路旁土", "辛未": "路旁土",
  "壬申": "劍鋒金", "癸酉": "劍鋒金", "甲戌": "山頭火", "乙亥": "山頭火",
  "丙子": "澗下水", "丁丑": "澗下水", "戊寅": "城頭土", "己卯": "城頭土",
  "庚辰": "白蠟金", "辛巳": "白蠟金", "壬午": "楊柳木", "癸未": "楊柳木",
  "甲申": "泉中水", "乙酉": "泉中水", "丙戌": "屋上土", "丁亥": "屋上土",
  "戊子": "霹靂火", "己丑": "霹靂火", "庚寅": "松柏木", "辛卯": "松柏木",
  "壬辰": "長流水", "癸巳": "長流水", "甲午": "沙中金", "乙未": "沙中金",
  "丙申": "山下火", "丁酉": "山下火", "戊戌": "平地木", "己亥": "平地木",
  "庚子": "壁上土", "辛丑": "壁上土", "壬寅": "金箔金", "癸卯": "金箔金",
  "甲辰": "覆燈火", "乙巳": "覆燈火", "丙午": "天河水", "丁未": "天河水",
  "戊申": "大驛土", "己酉": "大驛土", "庚戌": "釵釧金", "辛亥": "釵釧金",
  "壬子": "桑柘木", "癸丑": "桑柘木", "甲寅": "大溪水", "乙卯": "大溪水",
  "丙辰": "沙中土", "丁巳": "沙中土", "戊午": "天上火", "己未": "天上火",
  "庚申": "石榴木", "辛酉": "石榴木", "壬戌": "大海水", "癸亥": "大海水",
};

// 星運（長生十二宮）
const XING_YUN_ORDER = ["長生", "沐浴", "冠帶", "臨官", "帝旺", "衰", "病", "死", "墓", "絕", "胎", "養"];

// 長生起點（陽干順行，陰干逆行）
const CHANGSHENG_DIZHI: Record<Tiangan, Dizhi> = {
  甲: "亥", 乙: "午", 丙: "寅", 丁: "酉",
  戊: "寅", 己: "酉", 庚: "巳", 辛: "子",
  壬: "申", 癸: "卯",
};

function getXingYun(tg: Tiangan, dz: Dizhi): string {
  const isYang = TIANGAN_YINYANG[tg] === "陽";
  const startDz = CHANGSHENG_DIZHI[tg];
  const startIdx = DIZHI.indexOf(startDz);
  const dzIdx = DIZHI.indexOf(dz);
  let diff = dzIdx - startIdx;
  if (!isYang) diff = -diff;
  const idx = ((diff % 12) + 12) % 12;
  return XING_YUN_ORDER[idx];
}

// ── 十神 ──────────────────────────────────────────────────
// 以日干為基準，計算其他天干的十神
const SHISHEN_TABLE: Record<string, Record<string, string>> = {
  甲: { 甲: "比肩", 乙: "劫財", 丙: "食神", 丁: "傷官", 戊: "偏財", 己: "正財", 庚: "七殺", 辛: "正官", 壬: "偏印", 癸: "正印" },
  乙: { 乙: "比肩", 甲: "劫財", 丁: "食神", 丙: "傷官", 己: "偏財", 戊: "正財", 辛: "七殺", 庚: "正官", 癸: "偏印", 壬: "正印" },
  丙: { 丙: "比肩", 丁: "劫財", 戊: "食神", 己: "傷官", 庚: "偏財", 辛: "正財", 壬: "七殺", 癸: "正官", 甲: "偏印", 乙: "正印" },
  丁: { 丁: "比肩", 丙: "劫財", 己: "食神", 戊: "傷官", 辛: "偏財", 庚: "正財", 癸: "七殺", 壬: "正官", 乙: "偏印", 甲: "正印" },
  戊: { 戊: "比肩", 己: "劫財", 庚: "食神", 辛: "傷官", 壬: "偏財", 癸: "正財", 甲: "七殺", 乙: "正官", 丙: "偏印", 丁: "正印" },
  己: { 己: "比肩", 戊: "劫財", 辛: "食神", 庚: "傷官", 癸: "偏財", 壬: "正財", 乙: "七殺", 甲: "正官", 丁: "偏印", 丙: "正印" },
  庚: { 庚: "比肩", 辛: "劫財", 壬: "食神", 癸: "傷官", 甲: "偏財", 乙: "正財", 丙: "七殺", 丁: "正官", 戊: "偏印", 己: "正印" },
  辛: { 辛: "比肩", 庚: "劫財", 癸: "食神", 壬: "傷官", 乙: "偏財", 甲: "正財", 丁: "七殺", 丙: "正官", 己: "偏印", 戊: "正印" },
  壬: { 壬: "比肩", 癸: "劫財", 甲: "食神", 乙: "傷官", 丙: "偏財", 丁: "正財", 戊: "七殺", 己: "正官", 庚: "偏印", 辛: "正印" },
  癸: { 癸: "比肩", 壬: "劫財", 乙: "食神", 甲: "傷官", 丁: "偏財", 丙: "正財", 己: "七殺", 戊: "正官", 辛: "偏印", 庚: "正印" },
};

function getShishen(riGan: Tiangan, tg: Tiangan): string {
  return SHISHEN_TABLE[riGan]?.[tg] ?? "";
}

// ── 干支推算 ──────────────────────────────────────────────
// 以 1984年甲子年 為基準
function getGanZhi(offset: number): { tg: Tiangan; dz: Dizhi } {
  const tgIdx = ((offset % 10) + 10) % 10;
  const dzIdx = ((offset % 12) + 12) % 12;
  return { tg: TIANGAN[tgIdx], dz: DIZHI[dzIdx] };
}

// 年柱：以農曆年計（以立春換年）
// 簡化版：1984 = 甲子(0)
function getYearGanZhi(year: number): { tg: Tiangan; dz: Dizhi } {
  const offset = year - 1984;
  return getGanZhi(offset);
}

// 月柱：以節氣換月（寅月=1月，以下為近似）
// 月干 = 年干 * 2 + 月支偏移
const MONTH_DZ: Dizhi[] = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];

function getMonthGanZhi(year: number, month: number, day: number): { tg: Tiangan; dz: Dizhi } {
  // 節氣月份（近似，以公曆月份計）
  // 月份從寅月(1)開始，對應農曆正月
  // 公曆月份對應：1月=丑/寅, 2月=寅/卯...
  // 簡化：以公曆月份 - 1 作為月支索引（寅月=公曆2月）
  let monthIdx = month - 2;
  if (monthIdx < 0) monthIdx += 12;
  // 節氣調整（簡化版）
  const dz = MONTH_DZ[monthIdx];

  // 月干 = 年干決定起點
  const yearTgIdx = TIANGAN.indexOf(getYearGanZhi(year).tg);
  // 五虎遁年起月法
  const monthTgBase = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearTgIdx % 10]; // 甲己年起丙寅
  const tgIdx = (monthTgBase + monthIdx) % 10;
  return { tg: TIANGAN[tgIdx], dz };
}

// 日柱：以儒略日計算
function getJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getDayGanZhi(year: number, month: number, day: number): { tg: Tiangan; dz: Dizhi } {
  // 以 1900-01-01 甲戌(10) 為基準
  const baseJD = getJulianDay(1900, 1, 1); // 甲戌
  const baseOffset = 10; // 甲=0, 戌=10 → offset 10
  const jd = getJulianDay(year, month, day);
  const offset = jd - baseJD + baseOffset;
  return getGanZhi(offset);
}

// 時柱：以時辰計算
const HOUR_DZ: Dizhi[] = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

function getHourDizhi(hour: number): Dizhi {
  // 子時 23-1, 丑時 1-3, ...
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return HOUR_DZ[idx];
}

function getHourGanZhi(dayTg: Tiangan, hour: number): { tg: Tiangan; dz: Dizhi } {
  const dz = getHourDizhi(hour);
  const dzIdx = DIZHI.indexOf(dz);
  // 五鼠遁日起時法
  const dayTgIdx = TIANGAN.indexOf(dayTg);
  const hourTgBase = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][dayTgIdx % 10];
  const tgIdx = (hourTgBase + dzIdx) % 10;
  return { tg: TIANGAN[tgIdx], dz };
}

// ── 星座 ──────────────────────────────────────────────────
function getZodiac(month: number, day: number): string {
  const signs = [
    { name: "摩羯座", end: [1, 19] }, { name: "水瓶座", end: [2, 18] },
    { name: "雙魚座", end: [3, 20] }, { name: "牡羊座", end: [4, 19] },
    { name: "金牛座", end: [5, 20] }, { name: "雙子座", end: [6, 20] },
    { name: "巨蟹座", end: [7, 22] }, { name: "獅子座", end: [8, 22] },
    { name: "處女座", end: [9, 22] }, { name: "天秤座", end: [10, 22] },
    { name: "天蠍座", end: [11, 21] }, { name: "射手座", end: [12, 21] },
    { name: "摩羯座", end: [12, 31] },
  ];
  for (const s of signs) {
    if (month < s.end[0] || (month === s.end[0] && day <= s.end[1])) return s.name;
  }
  return "摩羯座";
}

// ── 生肖 ──────────────────────────────────────────────────
const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"];
function getShengxiao(year: number): string {
  return SHENGXIAO[((year - 1900) % 12 + 12) % 12];
}

// ── 大運 ──────────────────────────────────────────────────
function getDaYun(
  yearGanZhi: { tg: Tiangan; dz: Dizhi },
  monthGanZhi: { tg: Tiangan; dz: Dizhi },
  gender: "male" | "female",
  birthYear: number
): Array<{ age: number; year: number; tg: Tiangan; dz: Dizhi; shishen: string; xingYun: string }> {
  const yearTgIdx = TIANGAN.indexOf(yearGanZhi.tg);
  const isYangYear = yearTgIdx % 2 === 0;
  // 陽男陰女順行，陰男陽女逆行
  const forward = (gender === "male" && isYangYear) || (gender === "female" && !isYangYear);

  const monthDzIdx = DIZHI.indexOf(monthGanZhi.dz);
  const monthTgIdx = TIANGAN.indexOf(monthGanZhi.tg);

  const dayun: Array<{ age: number; year: number; tg: Tiangan; dz: Dizhi; shishen: string; xingYun: string }> = [];

  // 起運歲數：近似 10 歲（實際需節氣計算，此處簡化）
  const startAge = 10;

  for (let i = 1; i <= 8; i++) {
    let tgIdx: number, dzIdx: number;
    if (forward) {
      tgIdx = (monthTgIdx + i) % 10;
      dzIdx = (monthDzIdx + i) % 12;
    } else {
      tgIdx = ((monthTgIdx - i) % 10 + 10) % 10;
      dzIdx = ((monthDzIdx - i) % 12 + 12) % 12;
    }
    const tg = TIANGAN[tgIdx];
    const dz = DIZHI[dzIdx];
    const age = startAge + (i - 1) * 10;
    dayun.push({
      age,
      year: birthYear + age,
      tg,
      dz,
      shishen: getShishen(monthGanZhi.tg, tg),
      xingYun: getXingYun(tg, dz),
    });
  }
  return dayun;
}

// ── 流年 ──────────────────────────────────────────────────
function getLiuNian(birthYear: number, count = 20): Array<{ age: number; year: number; tg: Tiangan; dz: Dizhi }> {
  const result = [];
  for (let i = 0; i < count; i++) {
    const year = birthYear + i;
    const gz = getYearGanZhi(year);
    result.push({ age: i, year, tg: gz.tg, dz: gz.dz });
  }
  return result;
}

// ── 農曆轉換（近似版） ──────────────────────────────────────
function getLunarDateApprox(year: number, month: number, day: number): string {
  const lunarMonths = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
  const lunarDays = [
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
  ];
  const lunarYears = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

  // 非常近似的農曆月份（實際需要完整農曆表）
  const lunarMonth = ((month - 1 + 11) % 12);
  const lunarDay = Math.min(day - 1, 29);

  const yearStr = String(year).split("").map(d => lunarYears[parseInt(d)]).join("");
  return `${yearStr}年 ${lunarMonths[lunarMonth]}月${lunarDays[lunarDay]}`;
}

// ── 時辰名稱 ──────────────────────────────────────────────
function getShichen(hour: number): string {
  const names = ["子時", "丑時", "寅時", "卯時", "辰時", "巳時", "午時", "未時", "申時", "酉時", "戌時", "亥時"];
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return names[idx];
}

// ── 主函數：計算完整八字命盤 ──────────────────────────────
export interface BaziInput {
  name: string;
  gender: "male" | "female";
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
}

export interface Pillar {
  tg: Tiangan;
  dz: Dizhi;
  tgColor: string;
  dzColor: string;
  tgWuxing: string;
  dzWuxing: string;
  canggan: Array<{ tg: Tiangan; color: string; shishen: string }>;
  shishen: string; // 主星（以日干為基準）
  nayin: string;
  xingYun: string;
}

export interface BaziResult {
  // 基本資料
  name: string;
  gender: string;
  solarDate: string;
  lunarDate: string;
  shengxiao: string;
  zodiac: string;
  shichen: string;

  // 四柱
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;

  // 日主資料
  riZhu: Tiangan;
  riZhuWuxing: string;
  riZhuYinyang: string;

  // 五行統計
  wuxingCount: Record<string, number>;

  // 大運
  dayun: Array<{ age: number; year: number; tg: Tiangan; dz: Dizhi; tgColor: string; dzColor: string; shishen: string; xingYun: string }>;

  // 流年（未來20年）
  liuNian: Array<{ age: number; year: number; tg: Tiangan; dz: Dizhi; tgColor: string; dzColor: string }>;

  // 格局（簡化）
  geju: string;
}

function buildPillar(tg: Tiangan, dz: Dizhi, riGan: Tiangan): Pillar {
  const canggan = DIZHI_CANGGAN[dz].map(cg => ({
    tg: cg,
    color: TIANGAN_COLOR[cg],
    shishen: getShishen(riGan, cg),
  }));
  return {
    tg, dz,
    tgColor: TIANGAN_COLOR[tg],
    dzColor: DIZHI_COLOR[dz],
    tgWuxing: TIANGAN_WUXING[tg],
    dzWuxing: DIZHI_WUXING[dz],
    canggan,
    shishen: getShishen(riGan, tg),
    nayin: NAYIN[`${tg}${dz}`] ?? "",
    xingYun: getXingYun(tg, dz),
  };
}

// 簡單格局判斷
function getGeju(riGan: Tiangan, pillars: { tg: Tiangan; dz: Dizhi }[]): string {
  const riWuxing = TIANGAN_WUXING[riGan];
  const count: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of pillars) {
    count[TIANGAN_WUXING[p.tg]]++;
    count[DIZHI_WUXING[p.dz]]++;
    for (const cg of DIZHI_CANGGAN[p.dz]) count[TIANGAN_WUXING[cg]]++;
  }
  // 簡化格局判斷
  const maxWuxing = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  const geMap: Record<string, string> = {
    木: "從旺格（木旺）", 火: "炎上格（火旺）", 土: "稼穡格（土旺）",
    金: "從革格（金旺）", 水: "潤下格（水旺）",
  };
  if (count[maxWuxing] >= 6) return geMap[maxWuxing];

  // 日主強弱
  const supportWuxing: Record<string, string[]> = {
    木: ["水", "木"], 火: ["木", "火"], 土: ["火", "土"],
    金: ["土", "金"], 水: ["金", "水"],
  };
  const support = supportWuxing[riWuxing] ?? [];
  const supportCount = support.reduce((s, w) => s + (count[w] ?? 0), 0);
  const totalCount = Object.values(count).reduce((a, b) => a + b, 0);
  if (supportCount / totalCount > 0.5) return "身強格";
  if (supportCount / totalCount < 0.3) return "身弱格";
  return "中和格";
}

export function calculateBazi(input: BaziInput): BaziResult {
  const { name, gender, year, month, day, hour } = input;

  const yearGZ = getYearGanZhi(year);
  const monthGZ = getMonthGanZhi(year, month, day);
  const dayGZ = getDayGanZhi(year, month, day);
  const hourGZ = getHourGanZhi(dayGZ.tg, hour);

  const riGan = dayGZ.tg;

  const yearPillar = buildPillar(yearGZ.tg, yearGZ.dz, riGan);
  const monthPillar = buildPillar(monthGZ.tg, monthGZ.dz, riGan);
  const dayPillar = buildPillar(dayGZ.tg, dayGZ.dz, riGan);
  const hourPillar = buildPillar(hourGZ.tg, hourGZ.dz, riGan);

  // 五行統計
  const wuxingCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of [yearPillar, monthPillar, dayPillar, hourPillar]) {
    wuxingCount[p.tgWuxing] = (wuxingCount[p.tgWuxing] ?? 0) + 1;
    wuxingCount[p.dzWuxing] = (wuxingCount[p.dzWuxing] ?? 0) + 1;
  }

  const dayunList = getDaYun(yearGZ, monthGZ, gender, year);
  const liuNianList = getLiuNian(year, 30);

  const allPillars = [yearGZ, monthGZ, dayGZ, hourGZ];
  const geju = getGeju(riGan, allPillars);

  return {
    name,
    gender: gender === "male" ? "男" : "女",
    solarDate: `${year}年${month}月${day}日 ${hour}時`,
    lunarDate: getLunarDateApprox(year, month, day),
    shengxiao: getShengxiao(year),
    zodiac: getZodiac(month, day),
    shichen: getShichen(hour),

    yearPillar, monthPillar, dayPillar, hourPillar,

    riZhu: riGan,
    riZhuWuxing: TIANGAN_WUXING[riGan],
    riZhuYinyang: TIANGAN_YINYANG[riGan],

    wuxingCount,

    dayun: dayunList.map(d => ({
      ...d,
      tgColor: TIANGAN_COLOR[d.tg],
      dzColor: DIZHI_COLOR[d.dz],
    })),

    liuNian: liuNianList.map(l => ({
      ...l,
      tgColor: TIANGAN_COLOR[l.tg],
      dzColor: DIZHI_COLOR[l.dz],
    })),

    geju,
  };
}
