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
      {/* 十神 */}
      <div className="text-xs" style={{ color: "oklch(0.65 0.08 60)" }}>{pillar.shishen || "元男"}</div>
      {/* 天干 */}
      <div className="text-3xl font-black" style={{ color: pillar.tgColor, textShadow: `0 0 12px ${pillar.tgColor}60` }}>
        {pillar.tg}
      </div>
      {/* 地支 */}
      <div className="text-3xl font-black" style={{ color: pillar.dzColor, textShadow: `0 0 12px ${pillar.dzColor}60` }}>
        {pillar.dz}
      </div>
      {/* 藏干 */}
      <div className="flex flex-col items-center gap-0.5 mt-1">
        {pillar.canggan.map((cg, i) => (
          <div key={i} className="text-xs" style={{ color: cg.color }}>
            {cg.tg} <span style={{ color: "oklch(0.50 0.03 260)", fontSize: "0.65rem" }}>{cg.shishen}</span>
          </div>
        ))}
      </div>
      {/* 納音 */}
      <div className="text-xs mt-1" style={{ color: "oklch(0.50 0.03 260)" }}>{pillar.nayin}</div>
      {/* 星運 */}
      <div className="text-xs" style={{ color: "oklch(0.55 0.12 60)" }}>{pillar.xingYun}</div>
    </div>
  );
}

// ── Wuxing Bar ──────────────────────────────────────────────────────────────
function WuxingBar({ count }: { count: Record<string, number> }) {
  const total = Object.values(count).reduce((a, b) => a + b, 0);
  const colors: Record<string, string> = {
    木: "#22c55e", 火: "#ef4444", 土: "#f59e0b", 金: "#94a3b8", 水: "#3b82f6",
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(count).map(([wx, n]) => (
        <div key={wx} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: colors[wx] }} />
          <span className="text-sm font-bold" style={{ color: colors[wx] }}>{wx}</span>
          <span className="text-sm" style={{ color: "oklch(0.65 0.03 260)" }}>×{n}</span>
          <div className="h-2 rounded-full" style={{ width: `${(n / total) * 80}px`, background: colors[wx], opacity: 0.7 }} />
        </div>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function MysticBazi() {
  const [form, setForm] = useState({
    name: "", gender: "male" as "male" | "female",
    year: 1990, month: 1, day: 1, hour: 8, minute: 0,
  });
  const [result, setResult] = useState<BaziResult | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "chart" | "dayun">("basic");
  const [showPaywall, setShowPaywall] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMutation.mutate(form);
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
五行：${Object.entries(result.wuxingCount).map(([k, v]) => `${k}×${v}`).join("、")}`;
    analyzeMutation.mutate({ baziSummary: summary, topic: selectedTopic });
  };

  const topics = [
    { key: "overall", label: "整體命格" },
    { key: "career", label: "事業運" },
    { key: "wealth", label: "財運" },
    { key: "love", label: "感情運" },
    { key: "health", label: "健康運" },
  ] as const;

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
            {/* Name */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "oklch(0.55 0.03 260)" }}>姓名（可選）</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="輸入姓名"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
              />
            </div>
            {/* Gender */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "oklch(0.55 0.03 260)" }}>性別</label>
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
                <label className="text-xs mb-1 block" style={{ color: "oklch(0.55 0.03 260)" }}>年份</label>
                <input type="number" value={form.year} min={1900} max={2100}
                  onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 1990 }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.14 0.03 260)", border: "1px solid oklch(0.25 0.04 260)", color: "oklch(0.85 0.03 60)" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "oklch(0.55 0.03 260)" }}>月份</label>
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
                <label className="text-xs mb-1 block" style={{ color: "oklch(0.55 0.03 260)" }}>日期</label>
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
            {/* Time */}
            <div>
              <label className="text-xs mb-1 block" style={{ color: "oklch(0.55 0.03 260)" }}>出生時辰（時）</label>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { h: 0, l: "子\n23-1" }, { h: 2, l: "丑\n1-3" }, { h: 4, l: "寅\n3-5" },
                  { h: 6, l: "卯\n5-7" }, { h: 8, l: "辰\n7-9" }, { h: 10, l: "巳\n9-11" },
                  { h: 12, l: "午\n11-13" }, { h: 14, l: "未\n13-15" }, { h: 16, l: "申\n15-17" },
                  { h: 18, l: "酉\n17-19" }, { h: 20, l: "戌\n19-21" }, { h: 22, l: "亥\n21-23" },
                ].map(t => (
                  <button key={t.h} type="button"
                    onClick={() => setForm(f => ({ ...f, hour: t.h }))}
                    className="py-1.5 rounded-lg text-xs font-bold transition-all whitespace-pre-line leading-tight"
                    style={{
                      background: form.hour === t.h ? "oklch(0.55 0.22 290)" : "oklch(0.14 0.03 260)",
                      color: form.hour === t.h ? "oklch(0.95 0.02 80)" : "oklch(0.55 0.03 260)",
                      border: "1px solid oklch(0.25 0.04 260)",
                    }}
                  >{t.l}</button>
                ))}
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

            {/* Dayun Tab */}
            {activeTab === "dayun" && (
              <div className="rounded-2xl p-4 space-y-3" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
                <div className="text-sm font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>大運（每10年一換）</div>
                <div className="overflow-x-auto">
                  <div className="flex gap-2 pb-2" style={{ minWidth: "max-content" }}>
                    {result.dayun.map((d, i) => (
                      <div key={i} className="flex flex-col items-center rounded-xl p-3 gap-1 min-w-[64px]"
                        style={{ background: "oklch(0.13 0.04 260)", border: "1px solid oklch(0.22 0.04 260)" }}
                      >
                        <div className="text-xs" style={{ color: "oklch(0.55 0.03 260)" }}>{d.age}歲</div>
                        <div className="text-xs" style={{ color: "oklch(0.45 0.03 260)" }}>{d.year}</div>
                        <div className="text-2xl font-black" style={{ color: d.tgColor }}>{d.tg}</div>
                        <div className="text-2xl font-black" style={{ color: d.dzColor }}>{d.dz}</div>
                        <div className="text-xs" style={{ color: "oklch(0.55 0.08 60)" }}>{d.shishen}</div>
                        <div className="text-xs" style={{ color: "oklch(0.50 0.03 260)" }}>{d.xingYun}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm font-bold pt-2" style={{ color: "oklch(0.75 0.20 290)" }}>流年（未來30年）</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {result.liuNian.slice(0, 30).map((l, i) => (
                    <div key={i} className="flex flex-col items-center rounded-lg p-1.5 gap-0.5"
                      style={{
                        background: l.year === new Date().getFullYear() ? "oklch(0.55 0.22 290 / 0.25)" : "oklch(0.12 0.03 260)",
                        border: l.year === new Date().getFullYear() ? "1px solid oklch(0.55 0.22 290 / 0.6)" : "1px solid oklch(0.18 0.03 260)",
                      }}
                    >
                      <div className="text-xs" style={{ color: "oklch(0.45 0.03 260)" }}>{l.year}</div>
                      <div className="text-sm font-bold" style={{ color: l.tgColor }}>{l.tg}</div>
                      <div className="text-sm font-bold" style={{ color: l.dzColor }}>{l.dz}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free Summary */}
            <div className="rounded-2xl p-5" style={{ background: "oklch(0.10 0.04 290)", border: "1px solid oklch(0.22 0.06 290)" }}>
              <div className="text-sm font-bold mb-3" style={{ color: "oklch(0.75 0.20 290)" }}>✨ 免費簡單總結</div>
              <div className="space-y-2 text-sm" style={{ color: "oklch(0.75 0.03 60)" }}>
                <p>
                  你係<span className="font-bold" style={{ color: WUXING_COLOR[result.riZhuWuxing] }}>
                    {result.riZhuYinyang}{result.riZhuWuxing}
                  </span>日主，格局為<span className="font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>{result.geju}</span>。
                </p>
                <p>
                  五行方面，{Object.entries(result.wuxingCount).sort((a, b) => b[1] - a[1]).map(([k, v]) =>
                    `${k}（${v}個）`
                  ).join("、")}。
                  {(() => {
                    const sorted = Object.entries(result.wuxingCount).sort((a, b) => b[1] - a[1]);
                    const strongest = sorted[0][0];
                    const weakest = sorted[sorted.length - 1][0];
                    return ` 五行偏強為${strongest}，偏弱為${weakest}，宜補${weakest}。`;
                  })()}
                </p>
                <p>
                  今年（2026年）流年為
                  <span className="font-bold" style={{ color: result.liuNian.find(l => l.year === 2026)?.tgColor }}>
                    {result.liuNian.find(l => l.year === 2026)?.tg}
                  </span>
                  <span className="font-bold" style={{ color: result.liuNian.find(l => l.year === 2026)?.dzColor }}>
                    {result.liuNian.find(l => l.year === 2026)?.dz}
                  </span>年。
                </p>
              </div>
            </div>

            {/* Paywall / AI Analysis */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.55 0.22 290 / 0.4)" }}>
              <div className="p-5" style={{ background: "linear-gradient(135deg, oklch(0.12 0.06 290), oklch(0.10 0.04 290))" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔐</span>
                  <div className="text-sm font-black" style={{ color: "oklch(0.92 0.05 80)" }}>AI 深度命盤分析</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.75 0.20 290)" }}>會員專享</span>
                </div>
                <p className="text-xs mb-4" style={{ color: "oklch(0.55 0.03 260)" }}>
                  由 AI 玄學師傅根據你嘅八字命盤，提供詳細嘅事業、財運、感情、健康深度分析，約500字專屬解讀。
                </p>
                {/* Topic selector */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {topics.map(t => (
                    <button key={t.key} onClick={() => setSelectedTopic(t.key)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: selectedTopic === t.key ? "oklch(0.55 0.22 290)" : "oklch(0.14 0.03 260)",
                        color: selectedTopic === t.key ? "oklch(0.95 0.02 80)" : "oklch(0.55 0.03 260)",
                        border: "1px solid oklch(0.25 0.04 260)",
                      }}
                    >{t.label}</button>
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
                    {aiLoading ? "AI 分析中..." : `✨ 免費體驗 AI ${topics.find(t => t.key === selectedTopic)?.label}分析`}
                  </button>
                )}
                {aiAnalysis && (
                  <button
                    onClick={() => { setAiAnalysis(""); }}
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

// Helper color map
const WUXING_COLOR: Record<string, string> = {
  木: "#22c55e", 火: "#ef4444", 土: "#f59e0b", 金: "#94a3b8", 水: "#3b82f6",
};
