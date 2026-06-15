import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Streamdown } from "streamdown";

// ── Types ──────────────────────────────────────────────────────────────────
interface Pillar {
  tg: string; dz: string;
  tgColor: string; dzColor: string;
  tgWuxing: string; dzWuxing: string;
  canggan: Array<{ tg: string; color: string; shishen: string }>;
  shishen: string;
  nayin: string;
  xingYun: string;
}
interface BaziResult {
  name: string; gender: string;
  solarDate: string; lunarDate: string;
  shengxiao: string; zodiac: string; shichen: string;
  yearPillar: Pillar; monthPillar: Pillar; dayPillar: Pillar; hourPillar: Pillar;
  riZhu: string; riZhuWuxing: string; riZhuYinyang: string;
  wuxingCount: Record<string, number>;
  dayun: Array<{ age: number; year: number; tg: string; dz: string; tgColor: string; dzColor: string; shishen: string; xingYun: string }>;
  liuNian: Array<{ age: number; year: number; tg: string; dz: string; tgColor: string; dzColor: string }>;
  geju: string;
}

const WUXING_COLOR: Record<string, string> = {
  木: "#22c55e", 火: "#ef4444", 土: "#f59e0b", 金: "#94a3b8", 水: "#3b82f6",
};

// ── Pillar Card ─────────────────────────────────────────────────────────────
function PillarCard({ label, pillar, isDay }: { label: string; pillar: Pillar; isDay?: boolean }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl p-3 gap-1 min-w-[72px]"
      style={{
        background: isDay ? "oklch(0.18 0.06 290 / 0.6)" : "oklch(0.12 0.03 260 / 0.5)",
        border: isDay ? "1px solid oklch(0.55 0.22 290 / 0.5)" : "1px solid oklch(0.25 0.04 260 / 0.4)",
      }}
    >
      <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.55 0.03 260)" }}>{label}</div>
      <div className="text-xs" style={{ color: "oklch(0.65 0.08 60)" }}>{pillar.shishen || "元男"}</div>
      <div className="text-3xl font-black" style={{ color: pillar.tgColor, textShadow: `0 0 12px ${pillar.tgColor}60` }}>
        {pillar.tg}
      </div>
      <div className="text-3xl font-black" style={{ color: pillar.dzColor, textShadow: `0 0 12px ${pillar.dzColor}60` }}>
        {pillar.dz}
      </div>
      <div className="flex flex-col items-center gap-0.5 mt-1">
        {pillar.canggan.map((cg, i) => (
          <div key={i} className="text-xs" style={{ color: cg.color }}>
            {cg.tg} <span style={{ color: "oklch(0.50 0.03 260)", fontSize: "0.65rem" }}>{cg.shishen}</span>
          </div>
        ))}
      </div>
      <div className="text-xs mt-1" style={{ color: "oklch(0.50 0.03 260)" }}>{pillar.nayin}</div>
      <div className="text-xs" style={{ color: "oklch(0.55 0.12 60)" }}>{pillar.xingYun}</div>
    </div>
  );
}

// ── Wuxing Bar ──────────────────────────────────────────────────────────────
function WuxingBar({ count }: { count: Record<string, number> }) {
  const total = Object.values(count).reduce((a, b) => a + b, 0);
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(count).map(([wx, n]) => (
        <div key={wx} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: WUXING_COLOR[wx] }} />
          <span className="text-sm font-bold" style={{ color: WUXING_COLOR[wx] }}>{wx}</span>
          <span className="text-sm" style={{ color: "oklch(0.65 0.03 260)" }}>×{n}</span>
          <div className="h-2 rounded-full" style={{ width: `${(n / total) * 80}px`, background: WUXING_COLOR[wx], opacity: 0.7 }} />
        </div>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function MysticBazi() {
  const [form, setForm] = useState({
    surname: "", givenName: "",
    gender: "male" as "male" | "female",
    year: 1990, month: 1, day: 1,
    timeStr: "08:00", // HH:MM format
  });
  const [result, setResult] = useState<BaziResult | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "chart" | "dayun">("basic");
  const [selectedTopic, setSelectedTopic] = useState<"overall" | "career" | "wealth" | "love" | "health">("overall");
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  const calculateMutation = trpc.mystic.calculateBazi.useMutation({
    onSuccess: (data) => {
      setResult(data as unknown as BaziResult);
      setActiveTab("basic");
      setAiAnalysis("");
    },
  });

  const analyzeMutation = trpc.mystic.analyzeBazi.useMutation({
    onSuccess: (data) => {
      const analysisText = typeof data.analysis === "string" ? data.analysis : String(data.analysis);
      setAiAnalysis(analysisText);
      setAiLoading(false);
    },
    onError: () => setAiLoading(false),
  });

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return { hour: isNaN(h) ? 8 : h, minute: isNaN(m) ? 0 : m };
  };

  const getShichenLabel = (timeStr: string) => {
    const { hour, minute } = parseTime(timeStr);
    const totalMinutes = hour * 60 + minute;
    const adjustedMinutes = (totalMinutes + 60) % 1440;
    const idx = Math.floor(adjustedMinutes / 120);
    const labels = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    return labels[idx] + "時";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { hour, minute } = parseTime(form.timeStr);
    const fullName = (form.surname + form.givenName).trim();
    calculateMutation.mutate({
      name: fullName,
      gender: form.gender,
      year: form.year,
      month: form.month,
      day: form.day,
      hour,
      minute,
    });
  };

  const handleAnalyze = () => {
    if (!result) return;
    setAiLoading(true);
    setAiAnalysis("");
    const summary = `姓名：${result.name}，${result.gender}性
出生：${result.solarDate}（${result.shichen}）
農曆：${result.lunarDate}
生肖：${result.shengxiao}，星座：${result.zodiac}
四柱：年柱${result.yearPillar.tg}${result.yearPillar.dz}，月柱${result.monthPillar.tg}${result.monthPillar.dz}，日柱${result.dayPillar.tg}${result.dayPillar.dz}，時柱${result.hourPillar.tg}${result.hourPillar.dz}
日主：${result.riZhu}（${result.riZhuYinyang}${result.riZhuWuxing}）
格局：${result.geju}
五行：${Object.entries(result.wuxingCount).map(([k, v]) => `${k}×${v}`).join("、")}
大運：${result.dayun.slice(0, 4).map(d => `${d.age}歲${d.tg}${d.dz}`).join("、")}`;
    analyzeMutation.mutate({ baziSummary: summary, topic: selectedTopic });
  };

  const topics = [
    { key: "overall", label: "整體命格", icon: "🔮" },
    { key: "career", label: "事業運", icon: "💼" },
    { key: "wealth", label: "財運", icon: "💰" },
    { key: "love", label: "感情運", icon: "❤️" },
    { key: "health", label: "健康運", icon: "🌿" },
  ] as const;

  // ── Free Summary ─────────────────────────────────────────────────────────
  const renderFreeSummary = (r: BaziResult) => {
    const sorted = Object.entries(r.wuxingCount).sort((a, b) => b[1] - a[1]);
    const strongest = sorted[0][0];
    const weakest = sorted[sorted.length - 1][0];
    const thisYear = new Date().getFullYear();
    const thisYearLN = r.liuNian.find(l => l.year === thisYear);
    const nextYearLN = r.liuNian.find(l => l.year === thisYear + 1);
    const currentDayun = r.dayun.find((d, i) => {
      const next = r.dayun[i + 1];
      const age = thisYear - (r.solarDate ? parseInt(r.solarDate) : 1990);
      return d.age <= age && (!next || next.age > age);
    }) ?? r.dayun[0];

    const wuxingAdvice: Record<string, string> = {
      木: "宜多接觸大自然、綠色植物，向東方發展，春季行事最佳",
      火: "宜多社交、展現才華，向南方發展，夏季行事最佳",
      土: "宜穩紮穩打、積累資產，中央方位最旺，四季交替時留意健康",
      金: "宜從事金融、法律、精密行業，向西方發展，秋季行事最佳",
      水: "宜從事創意、流通行業，向北方發展，冬季行事最佳",
    };

    const gejuAdvice: Record<string, string> = {
      "身強格": "命主身強，自主性高，適合創業或擔任領導職位，惟需注意不可過於固執",
      "身弱格": "命主身弱，宜借助貴人之力，適合合作、輔助型工作，感情上需要穩定支持",
      "中和格": "命主五行均衡，適應力強，各行各業皆可發展，人緣較佳",
      "從旺格（木旺）": "命主從旺，木氣極旺，宜從事教育、文化、出版，忌金剋制",
      "炎上格（火旺）": "命主從旺，火氣極旺，宜從事娛樂、傳媒、餐飲，忌水剋制",
      "稼穡格（土旺）": "命主從旺，土氣極旺，宜從事地產、農業、建築，忌木剋制",
      "從革格（金旺）": "命主從旺，金氣極旺，宜從事金融、法律、機械，忌火剋制",
      "潤下格（水旺）": "命主從旺，水氣極旺，宜從事航運、貿易、科技，忌土剋制",
    };

    return (
      <div className="space-y-4 text-sm" style={{ color: "oklch(0.80 0.03 60)" }}>
        {/* 日主格局 */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: "oklch(0.13 0.05 290 / 0.5)", border: "1px solid oklch(0.30 0.08 290 / 0.4)" }}>
          <div className="font-bold text-base" style={{ color: "oklch(0.92 0.05 80)" }}>
            🌟 命格概覽
          </div>
          <p>
            你係<span className="font-bold px-1 rounded" style={{ color: WUXING_COLOR[r.riZhuWuxing], background: WUXING_COLOR[r.riZhuWuxing] + "20" }}>
              {r.riZhuYinyang}{r.riZhuWuxing}
            </span>日主，格局為<span className="font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>「{r.geju}」</span>。
          </p>
          <p style={{ color: "oklch(0.70 0.03 60)" }}>
            {gejuAdvice[r.geju] ?? "命主格局獨特，宜多方嘗試，尋找最適合自己的發展方向。"}
          </p>
        </div>

        {/* 五行分析 */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: "oklch(0.13 0.05 290 / 0.5)", border: "1px solid oklch(0.30 0.08 290 / 0.4)" }}>
          <div className="font-bold" style={{ color: "oklch(0.92 0.05 80)" }}>
            ⚡ 五行強弱
          </div>
          <p>
            五行分佈：{sorted.map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-0.5 mx-0.5">
                <span className="font-bold" style={{ color: WUXING_COLOR[k] }}>{k}</span>
                <span style={{ color: "oklch(0.55 0.03 260)" }}>({v})</span>
              </span>
            ))}
          </p>
          <p>
            五行偏強為<span className="font-bold" style={{ color: WUXING_COLOR[strongest] }}>「{strongest}」</span>，
            偏弱為<span className="font-bold" style={{ color: WUXING_COLOR[weakest] }}>「{weakest}」</span>，
            宜補<span className="font-bold" style={{ color: WUXING_COLOR[weakest] }}>{weakest}</span>以達平衡。
          </p>
          <p style={{ color: "oklch(0.70 0.03 60)" }}>
            {wuxingAdvice[weakest] ?? "宜多方補充不足五行，以達命格平衡。"}
          </p>
        </div>

        {/* 今明年流年 */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: "oklch(0.13 0.05 290 / 0.5)", border: "1px solid oklch(0.30 0.08 290 / 0.4)" }}>
          <div className="font-bold" style={{ color: "oklch(0.92 0.05 80)" }}>
            📅 近年流年運勢
          </div>
          {thisYearLN && (
            <p>
              <span className="font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>{thisYear}年</span>流年為
              <span className="font-bold" style={{ color: thisYearLN.tgColor }}>{thisYearLN.tg}</span>
              <span className="font-bold" style={{ color: thisYearLN.dzColor }}>{thisYearLN.dz}</span>年，
              {thisYearLN.tg}屬{["甲","乙"].includes(thisYearLN.tg) ? "木" : ["丙","丁"].includes(thisYearLN.tg) ? "火" : ["戊","己"].includes(thisYearLN.tg) ? "土" : ["庚","辛"].includes(thisYearLN.tg) ? "金" : "水"}，
              今年宜把握機遇，積極行動。
            </p>
          )}
          {nextYearLN && (
            <p style={{ color: "oklch(0.70 0.03 60)" }}>
              <span className="font-bold" style={{ color: "oklch(0.65 0.15 290)" }}>{thisYear + 1}年</span>流年為
              <span className="font-bold" style={{ color: nextYearLN.tgColor }}>{nextYearLN.tg}</span>
              <span className="font-bold" style={{ color: nextYearLN.dzColor }}>{nextYearLN.dz}</span>年，
              宜提前規劃，為明年做好準備。
            </p>
          )}
        </div>

        {/* 當前大運 */}
        {currentDayun && (
          <div className="rounded-xl p-4 space-y-2" style={{ background: "oklch(0.13 0.05 290 / 0.5)", border: "1px solid oklch(0.30 0.08 290 / 0.4)" }}>
            <div className="font-bold" style={{ color: "oklch(0.92 0.05 80)" }}>
              🌊 當前大運
            </div>
            <p>
              現正行<span className="font-bold" style={{ color: currentDayun.tgColor }}>{currentDayun.tg}</span>
              <span className="font-bold" style={{ color: currentDayun.dzColor }}>{currentDayun.dz}</span>大運
              （{currentDayun.age}歲起，{currentDayun.year}年），
              主星為<span className="font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>{currentDayun.shishen}</span>，
              星運為<span className="font-bold" style={{ color: "oklch(0.65 0.15 60)" }}>{currentDayun.xingYun}</span>。
            </p>
            <p style={{ color: "oklch(0.70 0.03 60)" }}>
              此大運影響你約10年的整體運勢走向，宜善加把握。
            </p>
          </div>
        )}

        <div className="text-xs text-center pt-1" style={{ color: "oklch(0.40 0.03 260)" }}>
          以上為免費基本分析 · 如需深度解讀請使用下方 AI 分析功能
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.07 0.04 290)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3" style={{ background: "oklch(0.08 0.04 290 / 0.95)", borderBottom: "1px solid oklch(0.20 0.04 290)" }}>
        <Link href="/mystic">
          <span className="text-sm cursor-pointer" style={{ color: "oklch(0.55 0.03 260)" }}>← 返回</span>
        </Link>
        <h1 className="text-lg font-black" style={{ color: "oklch(0.92 0.05 80)" }}>🔮 八字命盤</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Input Form */}
        <div className="rounded-2xl p-5" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
          <h2 className="text-base font-bold mb-4" style={{ color: "oklch(0.75 0.20 290)" }}>輸入出生資料</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — 姓名分開 */}
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "oklch(0.55 0.03 260)" }}>姓名（可選）</label>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-1/3">
                  <span className="text-xs" style={{ color: "oklch(0.45 0.03 260)" }}>姓</span>
                  <input
                    type="text"
                    value={form.surname}
                    onChange={e => setForm(f => ({ ...f, surname: e.target.value }))}
                    placeholder="姓"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none text-center"
                    style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs" style={{ color: "oklch(0.45 0.03 260)" }}>名</span>
                  <input
                    type="text"
                    value={form.givenName}
                    onChange={e => setForm(f => ({ ...f, givenName: e.target.value }))}
                    placeholder="名"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "oklch(0.55 0.03 260)" }}>性別</label>
              <div className="flex gap-2">
                {[{ v: "male", l: "男" }, { v: "female", l: "女" }].map(g => (
                  <button
                    key={g.v} type="button"
                    onClick={() => setForm(f => ({ ...f, gender: g.v as "male" | "female" }))}
                    className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: form.gender === g.v ? "oklch(0.55 0.22 290)" : "oklch(0.14 0.03 260)",
                      color: form.gender === g.v ? "oklch(0.95 0.02 80)" : "oklch(0.55 0.03 260)",
                      border: "1px solid oklch(0.25 0.04 260)",
                    }}
                  >{g.l}</button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "oklch(0.55 0.03 260)" }}>年份</label>
                <input type="number" value={form.year} min={1900} max={2100}
                  onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 1990 }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "oklch(0.55 0.03 260)" }}>月份</label>
                <select value={form.month} onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}月</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "oklch(0.55 0.03 260)" }}>日期</label>
                <select value={form.day} onChange={e => setForm(f => ({ ...f, day: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}日</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time — HH:MM 精確輸入 */}
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "oklch(0.55 0.03 260)" }}>
                出生時間
                <span className="ml-2 font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>
                  → {getShichenLabel(form.timeStr)}
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={form.timeStr}
                  onChange={e => setForm(f => ({ ...f, timeStr: e.target.value || "08:00" }))}
                  className="flex-1 px-3 py-2.5 rounded-lg text-base outline-none font-mono"
                  style={{
                    background: "oklch(0.14 0.03 260)",
                    border: "1px solid oklch(0.35 0.12 290 / 0.6)",
                    color: "oklch(0.85 0.03 60)",
                    colorScheme: "dark",
                  }}
                />
                <div className="text-xs text-center" style={{ color: "oklch(0.50 0.03 260)", minWidth: "80px" }}>
                  <div className="text-2xl font-black" style={{ color: "oklch(0.75 0.20 290)" }}>
                    {getShichenLabel(form.timeStr)}
                  </div>
                  <div style={{ color: "oklch(0.45 0.03 260)" }}>時辰</div>
                </div>
              </div>
              <div className="mt-2 text-xs" style={{ color: "oklch(0.45 0.03 260)" }}>
                不知出生時間可輸入 12:00（午時）
              </div>
            </div>

            <button
              type="submit"
              disabled={calculateMutation.isPending}
              className="w-full py-3 rounded-xl font-black text-base transition-all"
              style={{
                background: calculateMutation.isPending ? "oklch(0.30 0.08 290)" : "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.45 0.18 310))",
                color: "oklch(0.95 0.02 80)",
                boxShadow: calculateMutation.isPending ? "none" : "0 4px 20px oklch(0.55 0.22 290 / 0.4)",
              }}
            >
              {calculateMutation.isPending ? "推算中..." : "🔮 立即推算八字"}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.22 0.06 290)" }}>
              {[
                { k: "basic", l: "基本" },
                { k: "chart", l: "命盤" },
                { k: "dayun", l: "大運" },
              ].map(t => (
                <button key={t.k} onClick={() => setActiveTab(t.k as typeof activeTab)}
                  className="flex-1 py-2.5 text-sm font-bold transition-all"
                  style={{
                    background: activeTab === t.k ? "oklch(0.55 0.22 290)" : "oklch(0.10 0.04 290)",
                    color: activeTab === t.k ? "oklch(0.95 0.02 80)" : "oklch(0.55 0.03 260)",
                  }}
                >{t.l}</button>
              ))}
            </div>

            {/* Basic Tab */}
            {activeTab === "basic" && (
              <div className="rounded-2xl p-5 space-y-3" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>
                      {result.name || "（未填姓名）"}
                    </div>
                    <div className="text-sm" style={{ color: "oklch(0.55 0.03 260)" }}>{result.gender}性 · {result.riZhuYinyang}{result.riZhuWuxing}日主</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>{result.geju}</div>
                    <div className="text-xs" style={{ color: "oklch(0.55 0.03 260)" }}>格局</div>
                  </div>
                </div>
                {[
                  { l: "西曆", v: result.solarDate },
                  { l: "農曆", v: result.lunarDate },
                  { l: "時辰", v: result.shichen },
                  { l: "生肖", v: result.shengxiao },
                  { l: "星座", v: result.zodiac },
                ].map(row => (
                  <div key={row.l} className="flex justify-between py-2" style={{ borderBottom: "1px solid oklch(0.16 0.03 260)" }}>
                    <span className="text-sm" style={{ color: "oklch(0.55 0.03 260)" }}>{row.l}</span>
                    <span className="text-sm font-bold" style={{ color: "oklch(0.85 0.03 60)" }}>{row.v}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="text-xs mb-2" style={{ color: "oklch(0.55 0.03 260)" }}>五行分佈</div>
                  <WuxingBar count={result.wuxingCount} />
                </div>
              </div>
            )}

            {/* Chart Tab */}
            {activeTab === "chart" && (
              <div className="rounded-2xl p-4 space-y-4" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
                <div className="text-sm font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>四柱命盤</div>
                <div className="grid grid-cols-4 gap-2">
                  <PillarCard label="時柱" pillar={result.hourPillar} />
                  <PillarCard label="日柱" pillar={result.dayPillar} isDay />
                  <PillarCard label="月柱" pillar={result.monthPillar} />
                  <PillarCard label="年柱" pillar={result.yearPillar} />
                </div>
                <div className="text-xs text-center" style={{ color: "oklch(0.40 0.03 260)" }}>
                  天干顏色：<span style={{ color: "#22c55e" }}>木</span> <span style={{ color: "#ef4444" }}>火</span> <span style={{ color: "#f59e0b" }}>土</span> <span style={{ color: "#94a3b8" }}>金</span> <span style={{ color: "#3b82f6" }}>水</span>
                </div>
              </div>
            )}

            {/* Dayun Tab — 優化版面 */}
            {activeTab === "dayun" && (
              <div className="rounded-2xl p-4 space-y-5" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
                <div className="text-sm font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>大運（每10年一換）</div>
                {/* 大運 — 垂直列表，每個大運一行，更清晰 */}
                <div className="space-y-2">
                  {result.dayun.map((d, i) => {
                    const isCurrentDayun = (() => {
                      const thisYear = new Date().getFullYear();
                      const next = result.dayun[i + 1];
                      return d.year <= thisYear && (!next || next.year > thisYear);
                    })();
                    return (
                      <div key={i}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{
                          background: isCurrentDayun ? "oklch(0.18 0.08 290 / 0.6)" : "oklch(0.13 0.04 260)",
                          border: isCurrentDayun ? "1px solid oklch(0.55 0.22 290 / 0.5)" : "1px solid oklch(0.20 0.03 260)",
                        }}
                      >
                        {isCurrentDayun && (
                          <div className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0" style={{ background: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.75 0.20 290)" }}>
                            現在
                          </div>
                        )}
                        <div className="shrink-0 text-center" style={{ minWidth: "52px" }}>
                          <div className="text-xs" style={{ color: "oklch(0.55 0.03 260)" }}>{d.age}歲起</div>
                          <div className="text-xs" style={{ color: "oklch(0.45 0.03 260)" }}>{d.year}年</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-black" style={{ color: d.tgColor, textShadow: `0 0 8px ${d.tgColor}50` }}>{d.tg}</span>
                          <span className="text-2xl font-black" style={{ color: d.dzColor, textShadow: `0 0 8px ${d.dzColor}50` }}>{d.dz}</span>
                        </div>
                        <div className="flex-1 flex gap-3">
                          <div className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.18 0.05 60 / 0.5)", color: "oklch(0.70 0.12 60)" }}>
                            {d.shishen}
                          </div>
                          <div className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.16 0.04 260 / 0.5)", color: "oklch(0.60 0.05 260)" }}>
                            {d.xingYun}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 流年 */}
                <div>
                  <div className="text-sm font-bold mb-3" style={{ color: "oklch(0.75 0.20 290)" }}>流年（未來30年）</div>
                  <div className="grid grid-cols-5 gap-2">
                    {result.liuNian.slice(0, 30).map((l, i) => {
                      const isThisYear = l.year === new Date().getFullYear();
                      return (
                        <div key={i} className="flex flex-col items-center rounded-xl p-2 gap-0.5"
                          style={{
                            background: isThisYear ? "oklch(0.55 0.22 290 / 0.25)" : "oklch(0.12 0.03 260)",
                            border: isThisYear ? "1px solid oklch(0.55 0.22 290 / 0.6)" : "1px solid oklch(0.18 0.03 260)",
                          }}
                        >
                          <div className="text-xs" style={{ color: isThisYear ? "oklch(0.75 0.20 290)" : "oklch(0.45 0.03 260)" }}>
                            {l.year}
                          </div>
                          <div className="text-base font-bold" style={{ color: l.tgColor }}>{l.tg}</div>
                          <div className="text-base font-bold" style={{ color: l.dzColor }}>{l.dz}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Free Summary — 加長版 */}
            <div className="rounded-2xl p-5" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
              <div className="text-sm font-bold mb-4" style={{ color: "oklch(0.75 0.20 290)" }}>✨ 免費命盤總結</div>
              {renderFreeSummary(result)}
            </div>

            {/* AI Analysis */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.55 0.22 290 / 0.4)" }}>
              <div className="p-5" style={{ background: "linear-gradient(135deg, oklch(0.12 0.06 290), oklch(0.10 0.04 290))" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔮</span>
                  <div className="text-sm font-black" style={{ color: "oklch(0.92 0.05 80)" }}>深度命盤分析</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.75 0.20 290)" }}>免費體驗</span>
                </div>
                <p className="text-xs mb-4" style={{ color: "oklch(0.55 0.03 260)" }}>
                  根據你嘅八字命盤，提供詳細嘅事業、財運、感情、健康深度分析，約800字專屬解讀。
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {topics.map(t => (
                    <button key={t.key} onClick={() => setSelectedTopic(t.key)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: selectedTopic === t.key ? "oklch(0.55 0.22 290)" : "oklch(0.14 0.03 260)",
                        color: selectedTopic === t.key ? "oklch(0.95 0.02 80)" : "oklch(0.55 0.03 260)",
                        border: "1px solid oklch(0.25 0.04 260)",
                      }}
                    >{t.icon} {t.label}</button>
                  ))}
                </div>

                {aiAnalysis ? (
                  <div className="rounded-xl p-4" style={{ background: "oklch(0.08 0.03 260)", border: "1px solid oklch(0.20 0.04 260)" }}>
                    <Streamdown>{aiAnalysis}</Streamdown>
                  </div>
                ) : (
                  <button
                    onClick={handleAnalyze}
                    disabled={aiLoading}
                    className="w-full py-3 rounded-xl font-black text-sm transition-all"
                    style={{
                      background: aiLoading ? "oklch(0.30 0.08 290)" : "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.65 0.18 60))",
                      color: "oklch(0.95 0.02 80)",
                      boxShadow: aiLoading ? "none" : "0 4px 20px oklch(0.55 0.22 290 / 0.4)",
                    }}
                  >
                    {aiLoading ? "🔮 分析中（約15-30秒）..." : `✨ 生成 ${topics.find(t => t.key === selectedTopic)?.label}深度分析`}
                  </button>
                )}
                {aiAnalysis && (
                  <button
                    onClick={() => setAiAnalysis("")}
                    className="w-full mt-2 py-2 rounded-xl text-xs transition-all"
                    style={{ background: "oklch(0.14 0.03 260)", color: "oklch(0.55 0.03 260)", border: "1px solid oklch(0.22 0.04 260)" }}
                  >換一個主題分析</button>
                )}
                <div className="mt-3 text-xs text-center" style={{ color: "oklch(0.40 0.03 260)" }}>
                  ⚠️ 本分析只供娛樂參考，不構成任何重大決策建議
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
