import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CHINESE_METHODS, WESTERN_METHODS, ANALYSIS_TOPICS } from "@/data/mysticData";
import { trpc } from "@/lib/trpc";

// Steps: birth → tradition → method → topics → result
// After result, user can go back to "tradition" step without re-entering birth data
type Step = "birth" | "tradition" | "method" | "topics" | "result";
type AkashicStep = "readingType" | "personB" | "result";
type InputMode = "solar" | "lunar";

interface BirthData {
  name: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  gender: "male" | "female" | "";
  // Lunar input fields
  inputMode: InputMode;
  lunarYear: string;
  lunarMonth: string;
  lunarDay: string;
  isLeapMonth: boolean;
}

interface PersonData {
  name: string;
  year: string;
  month: string;
  day: string;
}

const AKASHIC_READING_TYPES = [
  { id: "pastLife", icon: "🌀", title: "前世今生解讀", desc: "探索前世身份、未完成課題，了解今生性格來源" },
  { id: "soulAge", icon: "✨", title: "靈魂年齡分析", desc: "老靈魂還是年輕靈魂？靈魂類型與今生使命" },
  { id: "soulMate", icon: "💞", title: "靈魂伴侶配對", desc: "兩人前世緣份、業力課題與今生吸引力來源（需輸入對方資料）" },
  { id: "energyField", icon: "🔮", title: "能量磁場補充", desc: "分析當前能量狀態，提供水晶、冥想、儀式等補充建議" },
  { id: "yearEnergy", icon: "🗓️", title: "2026下半年能量流年", desc: "按月份分析靈性能量走向，事業財運感情健康" },
];

const HOURS = [
  "不知道", "00:00-01:00 (子時)", "01:00-03:00 (丑時)", "03:00-05:00 (寅時)",
  "05:00-07:00 (卯時)", "07:00-09:00 (辰時)", "09:00-11:00 (巳時)", "11:00-13:00 (午時)",
  "13:00-15:00 (未時)", "15:00-17:00 (申時)", "17:00-19:00 (酉時)", "19:00-21:00 (戌時)", "21:00-23:00 (亥時)",
];

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function PersonForm({ data, onChange, title }: { data: PersonData; onChange: (d: PersonData) => void; title: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold" style={{ color: "oklch(0.75 0.20 290)" }}>{title}</h3>
      <div>
        <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>姓名 *</label>
        <input
          className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
          style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
          placeholder="例：小明"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>出生年份 *</label>
          <input
            className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
            placeholder="1990"
            type="number"
            min="1900"
            max="2010"
            value={data.year}
            onChange={(e) => onChange({ ...data, year: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>出生月份 *</label>
          <select
            className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
            value={data.month}
            onChange={(e) => onChange({ ...data, month: e.target.value })}
          >
            <option value="">月份</option>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>出生日期 *</label>
          <input
            className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
            style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
            placeholder="15"
            type="number"
            min="1"
            max="31"
            value={data.day}
            onChange={(e) => onChange({ ...data, day: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export default function MysticAnalysis() {
  // Core flow state
  const [step, setStep] = useState<Step>("birth");
  const [birth, setBirth] = useState<BirthData>({
    name: "", year: "", month: "", day: "", hour: "", gender: "",
    inputMode: "solar", lunarYear: "", lunarMonth: "", lunarDay: "", isLeapMonth: false,
  });
  const [tradition, setTradition] = useState<"chinese" | "western" | "">("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [report, setReport] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPremiumLocked] = useState(false); // 限時免費體驗中，稍後將改為付費功能

  // Akashic Records state
  const [isAkashic, setIsAkashic] = useState(false);
  const [akashicStep, setAkashicStep] = useState<AkashicStep>("readingType");
  const [personB, setPersonB] = useState<PersonData>({ name: "", year: "", month: "", day: "" });
  const [akashicReadingType, setAkashicReadingType] = useState("");
  const [akashicResult, setAkashicResult] = useState("");
  const [akashicError, setAkashicError] = useState("");

  const generateMutation = trpc.mystic.generateReport.useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setReport(typeof data.report === "string" ? data.report : "");
      setStep("result");
    },
  });

  // Streaming fetch helper
  const streamReport = async (body: object, onToken: (t: string) => void, onDone: () => void, onError: () => void) => {
    const endpoint = (body as { readingType?: string }).readingType !== undefined
      ? "/api/mystic/stream-akashic"
      : "/api/mystic/stream-report";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok || !res.body) { onError(); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (t === "data: [DONE]") { onDone(); return; }
          if (!t.startsWith("data:")) continue;
          try {
            const j = JSON.parse(t.slice(5).trim());
            if (j.token) onToken(j.token);
          } catch { /* skip */ }
        }
      }
      onDone();
    } catch { onError(); }
  };

  const akashicMutation = trpc.mystic.akashicReading.useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      setAkashicResult(typeof data.reading === "string" ? data.reading : "");
      setAkashicError("");
      setAkashicStep("result");
    },
    onError: () => {
      setAkashicError("解讀生成失敗，請稍後再試。");
    },
  });

  useEffect(() => {
    document.title = "玄學分析工具｜路邊玄學堂";
  }, []);

  const methods = tradition === "chinese" ? CHINESE_METHODS : tradition === "western" ? WESTERN_METHODS : [];

  // Resolve solar date from birth data (handles lunar input)
  const getSolarDate = () => {
    if (birth.inputMode === "lunar" && birth.lunarYear && birth.lunarMonth && birth.lunarDay) {
      // Use lunar-typescript on client side via a simple lookup
      // For now pass lunar info to backend; backend will use it in prompt
      return {
        year: parseInt(birth.lunarYear),
        month: parseInt(birth.lunarMonth),
        day: parseInt(birth.lunarDay),
        isLunar: true,
        isLeapMonth: birth.isLeapMonth,
      };
    }
    return { year: parseInt(birth.year), month: parseInt(birth.month), day: parseInt(birth.day), isLunar: false, isLeapMonth: false };
  };

  const handleGenerate = () => {
    const sd = getSolarDate();
    setReport("");
    setIsStreaming(true);
    setStep("result");
    streamReport(
      {
        name: birth.name,
        year: sd.year,
        month: sd.month,
        day: sd.day,
        hour: birth.hour,
        gender: birth.gender,
        method: selectedMethod,
        topics: selectedTopics,
        inputMode: birth.inputMode,
        ...(sd.isLunar ? { lunarYear: sd.year, lunarMonth: sd.month, lunarDay: sd.day, isLeapMonth: sd.isLeapMonth } : {}),
      },
      (token) => setReport((prev) => prev + token),
      () => setIsStreaming(false),
      () => { setIsStreaming(false); setReport("生成失敗，請稍後再試。"); }
    );
  };

  const handleAkashicGenerate = () => {
    const needsPersonB = akashicReadingType === "soulMate";
    setAkashicResult("");
    setAkashicError("");
    setIsStreaming(true);
    setAkashicStep("result");
    streamReport(
      {
        personA: {
          name: birth.name || "你",
          year: parseInt(birth.year),
          month: parseInt(birth.month),
          day: parseInt(birth.day),
        },
        ...(needsPersonB && personB.name && personB.year ? {
          personB: {
            name: personB.name,
            year: parseInt(personB.year),
            month: parseInt(personB.month),
            day: parseInt(personB.day),
          }
        } : {}),
        readingType: akashicReadingType,
      },
      (token) => setAkashicResult((prev) => prev + token),
      () => setIsStreaming(false),
      () => { setIsStreaming(false); setAkashicError("解讀生成失敗，請稍後再試。"); }
    );
  };

  // Go back to tradition selection, keeping birth data intact
  const goBackToTradition = () => {
    setIsAkashic(false);
    setAkashicStep("readingType");
    setAkashicReadingType("");
    setAkashicResult("");
    setAkashicError("");
    setSelectedMethod("");
    setSelectedTopics([]);
    setReport("");
    setStep("tradition");
  };

  // Full reset
  const resetAll = () => {
    setBirth({ name: "", year: "", month: "", day: "", hour: "", gender: "", inputMode: "solar", lunarYear: "", lunarMonth: "", lunarDay: "", isLeapMonth: false });
    setTradition("");
    setSelectedMethod("");
    setSelectedTopics([]);
    setReport("");
    setIsAkashic(false);
    setAkashicStep("readingType");
    setPersonB({ name: "", year: "", month: "", day: "" });
    setAkashicReadingType("");
    setAkashicResult("");
    setAkashicError("");
    setStep("birth");
  };

  const stepNum = { birth: 1, tradition: 2, method: 3, topics: 4, result: 5 }[step];

  // Birth info summary chip shown after step 1
  const BirthSummary = () => {
    const hasBirth = birth.inputMode === "solar" ? !!birth.year : !!birth.lunarYear;
    if (!hasBirth) return null;
    const dateStr = birth.inputMode === "solar"
      ? `${birth.year}/${birth.month}/${birth.day}`
      : `農曆${birth.lunarYear}/${birth.lunarMonth}/${birth.lunarDay}${birth.isLeapMonth ? "（閏）" : ""}`;
    return (
      <div className="mb-4 px-4 py-2 rounded-xl flex items-center gap-2 justify-between" style={{ background: "oklch(0.13 0.03 270)", border: "1px solid oklch(0.55 0.22 290 / 0.2)" }}>
        <span className="text-xs" style={{ color: "oklch(0.65 0.03 250)" }}>
          👤 {birth.name || "匿名"} · {dateStr} · {birth.gender === "male" ? "男" : "女"}
        </span>
        <button className="text-xs underline" style={{ color: "oklch(0.65 0.20 290)" }} onClick={() => setStep("birth")}>
          修改
        </button>
      </div>
    );
  };

  // ─── Akashic Records Flow ─────────────────────────────────────────────────
  if (isAkashic) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "oklch(0.08 0.02 270)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.75 0.20 290)" }}>AKASHIC RECORDS</p>
            <h1 className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>💫 阿卡西紀錄解讀</h1>
            <p className="text-sm mt-2" style={{ color: "oklch(0.60 0.03 250)" }}>前世今生 · 靈魂伴侶 · 靈魂年齡 · 能量磁場</p>
          </div>

          <BirthSummary />

          {/* Step: Reading Type */}
          {akashicStep === "readingType" && (
            <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: "oklch(0.88 0.03 80)" }}>🌌 選擇解讀類型</h2>
              <div className="space-y-3">
                {AKASHIC_READING_TYPES.map((t) => (
                  <button
                    key={t.id}
                    className="w-full p-4 rounded-xl border text-left transition-all hover:scale-[1.01]"
                    style={{
                      background: akashicReadingType === t.id ? "oklch(0.55 0.22 290 / 0.2)" : "oklch(0.13 0.03 270)",
                      borderColor: akashicReadingType === t.id ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.2)",
                    }}
                    onClick={() => setAkashicReadingType(t.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{t.icon}</span>
                      <div>
                        <div className="font-bold text-sm" style={{ color: "oklch(0.88 0.03 80)" }}>{t.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 250)" }}>{t.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {akashicError && (
                <div className="mt-3 p-3 rounded-xl text-sm text-center" style={{ background: "oklch(0.15 0.05 25)", color: "oklch(0.75 0.20 25)" }}>
                  {akashicError}
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3 rounded-xl border font-semibold" style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }} onClick={goBackToTradition}>
                  ← 換其他派別
                </button>
                <button
                  className="flex-1 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))", color: "oklch(0.95 0.02 80)" }}
                  disabled={!akashicReadingType || akashicMutation.isPending}
                  onClick={() => akashicReadingType === "soulMate" ? setAkashicStep("personB") : handleAkashicGenerate()}
                >
                  {akashicMutation.isPending
                    ? <><span className="animate-spin">⟳</span> 解讀中...</>
                    : akashicReadingType === "soulMate" ? "下一步 →" : "🔮 開始解讀"}
                </button>
              </div>
            </div>
          )}

          {/* Step: Person B (soulMate only) */}
          {akashicStep === "personB" && (
            <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <PersonForm data={personB} onChange={setPersonB} title="💞 對方的資料" />
              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3 rounded-xl border font-semibold" style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }} onClick={() => setAkashicStep("readingType")}>
                  ← 返回
                </button>
                <button
                  className="flex-1 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))", color: "oklch(0.95 0.02 80)" }}
                  disabled={!personB.name || !personB.year || !personB.month || !personB.day || akashicMutation.isPending}
                  onClick={handleAkashicGenerate}
                >
                  {akashicMutation.isPending ? <><span className="animate-spin">⟳</span> 解讀中...</> : "💞 開始靈魂伴侶解讀"}
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {akashicStep === "result" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
                <h2 className="text-lg font-bold mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>
                  💫 {birth.name || "你"} 的阿卡西紀錄解讀
                </h2>
                <p className="text-xs mb-4" style={{ color: "oklch(0.55 0.22 290)" }}>
                  {AKASHIC_READING_TYPES.find(t => t.id === akashicReadingType)?.title}
                </p>
                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "oklch(0.80 0.03 250)" }}>
                  {akashicResult}
                </div>
              </div>

              <div className="rounded-2xl p-5 border" style={{ background: "oklch(0.10 0.04 290)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
                <p className="text-xs text-center" style={{ color: "oklch(0.55 0.03 250)" }}>
                  💡 想深入了解？可以追問：「可以說得更具體嗎？」或「可以舉一個我今生生活裡可能出現的情境嗎？」
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl border font-semibold"
                  style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }}
                  onClick={goBackToTradition}
                >
                  換其他派別解讀
                </button>
                <button
                  className="flex-1 py-3 rounded-xl border font-semibold"
                  style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }}
                  onClick={() => { setAkashicStep("readingType"); setAkashicReadingType(""); setAkashicResult(""); }}
                >
                  換解讀類型
                </button>
              </div>
            </div>
          )}

          <p className="mt-8 text-xs text-center" style={{ color: "oklch(0.40 0.02 250)" }}>
            本平台內容只供娛樂、文化及參考用途，並不構成任何投資、醫療、法律或人生重大決策建議。
          </p>
        </div>
      </div>
    );
  }

  // ─── Standard Analysis Flow ───────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: "oklch(0.08 0.02 270)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "oklch(0.75 0.20 290)" }}>MYSTIC ANALYSIS</p>
          <h1 className="text-2xl md:text-3xl font-black" style={{ color: "oklch(0.92 0.05 80)" }}>玄學分析工具</h1>
          <p className="text-sm mt-2" style={{ color: "oklch(0.60 0.03 250)" }}>輸入一次出生資料，即可解鎖中西玄學全部派別</p>
        </div>

        {/* Progress Bar */}
        {step !== "result" && (
          <div className="flex items-center gap-2 mb-6">
            {[
              { n: 1, label: "出生資料" },
              { n: 2, label: "中/西式" },
              { n: 3, label: "選派別" },
              { n: 4, label: "選主題" },
            ].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: n <= stepNum ? "oklch(0.55 0.22 290)" : "oklch(0.15 0.03 270)",
                      color: n <= stepNum ? "oklch(0.95 0.02 80)" : "oklch(0.45 0.03 250)",
                    }}
                  >
                    {n}
                  </div>
                  <span className="text-xs hidden sm:block" style={{ color: n <= stepNum ? "oklch(0.75 0.20 290)" : "oklch(0.40 0.02 250)" }}>{label}</span>
                </div>
                {n < 4 && <div className="h-0.5 flex-1 mb-4" style={{ background: n < stepNum ? "oklch(0.55 0.22 290)" : "oklch(0.20 0.03 270)" }} />}
              </div>
            ))}
          </div>
        )}

        {/* Birth summary chip (shown after step 1) */}
        {step !== "birth" && <BirthSummary />}

        {/* Step 1: Birth Data */}
        {step === "birth" && (
          <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: "oklch(0.88 0.03 80)" }}>📋 輸入出生資料</h2>
            <p className="text-xs mb-5" style={{ color: "oklch(0.55 0.03 250)" }}>只需輸入一次，之後可自由切換中西玄學派別</p>
            <div className="space-y-4">
              {/* 陰曆/陽曆 toggle */}
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: "oklch(0.13 0.03 270)" }}>
                {(["solar", "lunar"] as const).map((mode) => (
                  <button
                    key={mode}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: birth.inputMode === mode ? "oklch(0.55 0.22 290)" : "transparent",
                      color: birth.inputMode === mode ? "oklch(0.95 0.02 80)" : "oklch(0.60 0.03 250)",
                    }}
                    onClick={() => setBirth({ ...birth, inputMode: mode })}
                  >
                    {mode === "solar" ? "☀️ 公曆（陽曆）" : "🌙 農曆（陰曆）"}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>稱呼（可匿名）</label>
                <input
                  className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                  placeholder="例：小明 / 匿名"
                  value={birth.name}
                  onChange={(e) => setBirth({ ...birth, name: e.target.value })}
                />
              </div>
              {/* 公曆輸入 */}
              {birth.inputMode === "solar" && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>公曆年份 *</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
                      style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                      placeholder="1990"
                      type="number" min="1900" max="2010"
                      value={birth.year}
                      onChange={(e) => setBirth({ ...birth, year: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>公曆月份 *</label>
                    <select
                      className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                      style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                      value={birth.month}
                      onChange={(e) => setBirth({ ...birth, month: e.target.value })}
                    >
                      <option value="">月份</option>
                      {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>公曆日期 *</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
                      style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                      placeholder="15" type="number" min="1" max="31"
                      value={birth.day}
                      onChange={(e) => setBirth({ ...birth, day: e.target.value })}
                    />
                  </div>
                </div>
              )}
              {/* 農曆輸入 */}
              {birth.inputMode === "lunar" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>農曆年份 *</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
                        style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                        placeholder="1990" type="number" min="1900" max="2010"
                        value={birth.lunarYear}
                        onChange={(e) => setBirth({ ...birth, lunarYear: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>農曆月份 *</label>
                      <select
                        className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                        style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                        value={birth.lunarMonth}
                        onChange={(e) => setBirth({ ...birth, lunarMonth: e.target.value })}
                      >
                        <option value="">月份</option>
                        {["正","二","三","四","五","六","七","八","九","十","十一","十二"].map((m, i) => (
                          <option key={i} value={i + 1}>{m}月</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>農曆日期 *</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none"
                        style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                        placeholder="15" type="number" min="1" max="30"
                        value={birth.lunarDay}
                        onChange={(e) => setBirth({ ...birth, lunarDay: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isLeapMonth"
                      checked={birth.isLeapMonth}
                      onChange={(e) => setBirth({ ...birth, isLeapMonth: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="isLeapMonth" className="text-sm" style={{ color: "oklch(0.70 0.03 250)" }}>閏月（如是閏五月，請勾選）</label>
                  </div>
                  <p className="text-xs" style={{ color: "oklch(0.50 0.03 250)" }}>農曆輸入將由系統自動轉換為公曆日期進行分析</p>
                </div>
              )}
              <div>
                <label className="text-sm mb-1.5 block" style={{ color: "oklch(0.70 0.03 250)" }}>出生時辰（可選，中式玄學更準確）</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "oklch(0.13 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.88 0.03 80)" }}
                  value={birth.hour}
                  onChange={(e) => setBirth({ ...birth, hour: e.target.value })}
                >
                  <option value="">選擇時辰</option>
                  {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm mb-2 block" style={{ color: "oklch(0.70 0.03 250)" }}>性別 *</label>
                <div className="flex gap-3">
                  {[{ val: "male", label: "男" }, { val: "female", label: "女" }].map((g) => (
                    <button
                      key={g.val}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all"
                      style={{
                        background: birth.gender === g.val ? "oklch(0.55 0.22 290)" : "oklch(0.13 0.03 270)",
                        borderColor: birth.gender === g.val ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.3)",
                        color: birth.gender === g.val ? "oklch(0.95 0.02 80)" : "oklch(0.70 0.03 250)",
                      }}
                      onClick={() => setBirth({ ...birth, gender: g.val as "male" | "female" })}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="w-full mt-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))", color: "oklch(0.95 0.02 80)" }}
              disabled={birth.inputMode === "solar"
                ? (!birth.year || !birth.month || !birth.day || !birth.gender)
                : (!birth.lunarYear || !birth.lunarMonth || !birth.lunarDay || !birth.gender)}
              onClick={() => setStep("tradition")}
            >
              下一步：選擇玄學系統 →
            </button>
          </div>
        )}

        {/* Step 2: Tradition */}
        {step === "tradition" && (
          <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>🌏 選擇玄學系統</h2>
            <p className="text-xs mb-5" style={{ color: "oklch(0.55 0.03 250)" }}>完成後可隨時返回換另一個系統，毋需重新輸入資料</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { val: "chinese", icon: "🐉", title: "中國玄學", desc: "紫微斗數、奇門遁甲、八字命理、風水流年、姓名學", color: "oklch(0.65 0.20 60)" },
                { val: "western", icon: "⭐", title: "西方玄學", desc: "星座占星、生命靈數、塔羅牌、人類圖、阿卡西紀錄", color: "oklch(0.65 0.20 290)" },
              ].map((t) => (
                <button
                  key={t.val}
                  className="p-5 rounded-xl border text-left transition-all hover:scale-[1.01]"
                  style={{
                    background: tradition === t.val ? "oklch(0.55 0.22 290 / 0.15)" : "oklch(0.13 0.03 270)",
                    borderColor: tradition === t.val ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.2)",
                  }}
                  onClick={() => setTradition(t.val as "chinese" | "western")}
                >
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div className="font-bold mb-1" style={{ color: "oklch(0.88 0.03 80)" }}>{t.title}</div>
                  <div className="text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>{t.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 rounded-xl border font-semibold" style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }} onClick={() => setStep("birth")}>
                ← 修改資料
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-bold disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))", color: "oklch(0.95 0.02 80)" }}
                disabled={!tradition}
                onClick={() => { setSelectedMethod(""); setStep("method"); }}
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Method */}
        {step === "method" && (
          <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
            <h2 className="text-lg font-bold mb-6" style={{ color: "oklch(0.88 0.03 80)" }}>
              {tradition === "chinese" ? "🐉 選擇中國玄學派別" : "⭐ 選擇西方玄學派別"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  className="p-4 rounded-xl border text-left transition-all hover:scale-[1.02] relative"
                  style={{
                    background: selectedMethod === m.id ? "oklch(0.55 0.22 290 / 0.2)" : "oklch(0.13 0.03 270)",
                    borderColor: selectedMethod === m.id ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.2)",
                  }}
                  onClick={() => setSelectedMethod(m.id)}
                >
                  {(m as { isNew?: boolean }).isNew && (
                    <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.65 0.20 60)", color: "oklch(0.10 0.02 60)" }}>NEW</span>
                  )}
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-sm font-bold" style={{ color: "oklch(0.88 0.03 80)" }}>{m.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 250)" }}>{m.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 rounded-xl border font-semibold" style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }} onClick={() => setStep("tradition")}>
                ← 換系統
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-bold disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))", color: "oklch(0.95 0.02 80)" }}
                disabled={!selectedMethod}
                onClick={() => {
                  if (selectedMethod === "akashic") {
                    setIsAkashic(true);
                    setAkashicStep("readingType");
                  } else {
                    setSelectedTopics([]);
                    setStep("topics");
                  }
                }}
              >
                {selectedMethod === "akashic" ? "💫 進入阿卡西解讀" : "下一步 →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Topics */}
        {step === "topics" && (
          <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: "oklch(0.88 0.03 80)" }}>📊 選擇分析範疇</h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.60 0.03 250)" }}>可選多個（最多4個）</p>
            <div className="grid grid-cols-2 gap-3">
              {ANALYSIS_TOPICS.map((t) => {
                const isSelected = selectedTopics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    className="p-4 rounded-xl border text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: isSelected ? "oklch(0.55 0.22 290 / 0.2)" : "oklch(0.13 0.03 270)",
                      borderColor: isSelected ? "oklch(0.55 0.22 290)" : "oklch(0.55 0.22 290 / 0.2)",
                    }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTopics(selectedTopics.filter((x) => x !== t.id));
                      } else if (selectedTopics.length < 4) {
                        setSelectedTopics([...selectedTopics, t.id]);
                      }
                    }}
                  >
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="text-sm font-bold" style={{ color: "oklch(0.88 0.03 80)" }}>{t.name}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 rounded-xl border font-semibold" style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }} onClick={() => setStep("method")}>
                ← 換派別
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.22 290), oklch(0.55 0.22 310))", color: "oklch(0.95 0.02 80)" }}
                disabled={selectedTopics.length === 0 || isStreaming}
                onClick={handleGenerate}
              >
                {isStreaming ? (
                  <><span className="animate-spin">⟳</span> 生成中...</>
                ) : "🔮 生成分析報告"}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Result */}
        {step === "result" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "oklch(0.88 0.03 80)" }}>
                🌟 {birth.name || "你"}的流年玄學分析
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {selectedTopics.slice(0, 4).map((topicId) => {
                  const topic = ANALYSIS_TOPICS.find((t) => t.id === topicId);
                  const score = 60 + Math.floor(Math.random() * 35);
                  return (
                    <div key={topicId} className="text-center p-4 rounded-xl" style={{ background: "oklch(0.13 0.03 270)" }}>
                      <div className="text-2xl mb-1">{topic?.icon}</div>
                      <div className="text-xs mb-2" style={{ color: "oklch(0.65 0.03 250)" }}>{topic?.name}</div>
                      <div className="text-2xl font-black" style={{ color: score >= 80 ? "oklch(0.75 0.20 150)" : score >= 65 ? "oklch(0.75 0.20 290)" : "oklch(0.65 0.20 60)" }}>
                        {score}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "oklch(0.75 0.03 250)" }}>
                {isStreaming && !report ? (
                  <span className="animate-pulse" style={{ color: "oklch(0.55 0.22 290)" }}>✨ AI 正在解讀中...</span>
                ) : report.slice(0, 400)}
                {!isStreaming && report.length > 400 ? "..." : ""}
              </div>
            </div>

            {/* Free Trial Banner */}
            <div className="rounded-2xl p-4 border flex items-start gap-3" style={{ background: "oklch(0.12 0.06 60 / 0.4)", borderColor: "oklch(0.65 0.20 60 / 0.5)" }}>
              <span className="text-xl flex-shrink-0 mt-0.5">🎉</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: "oklch(0.65 0.20 60)", color: "oklch(0.10 0.02 60)" }}>限時免費</span>
                  <span className="text-xs font-bold" style={{ color: "oklch(0.80 0.15 60)" }}>完整報告現已開放體驗</span>
                </div>
                <p className="text-xs" style={{ color: "oklch(0.65 0.03 250)" }}>完整流年分析現正免費開放，讓大家先體驗一下！此功能稍後將成為 Premium 付費功能，把握機會盡情使用。</p>
              </div>
            </div>

            {/* Full Report */}
            <div className="rounded-2xl p-6 border" style={{ background: "oklch(0.11 0.03 270)", borderColor: "oklch(0.55 0.22 290 / 0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold" style={{ color: "oklch(0.88 0.03 80)" }}>完整流年分析報告</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.65 0.20 60)", color: "oklch(0.10 0.02 60)" }}>限時免費</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "oklch(0.78 0.03 250)" }}>
                {report}
                {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 animate-pulse rounded" style={{ background: "oklch(0.55 0.22 290)" }} />}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className="py-3 rounded-xl border font-semibold text-sm"
                style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.75 0.20 290)" }}
                onClick={goBackToTradition}
              >
                🔄 換其他派別解讀
              </button>
              <button
                className="py-3 rounded-xl border font-semibold text-sm"
                style={{ borderColor: "oklch(0.55 0.22 290 / 0.3)", color: "oklch(0.70 0.03 250)" }}
                onClick={() => { setSelectedTopics([]); setStep("topics"); }}
              >
                📊 換分析範疇
              </button>
            </div>
            <button
              className="w-full py-2.5 rounded-xl text-sm"
              style={{ color: "oklch(0.45 0.02 250)" }}
              onClick={resetAll}
            >
              重新輸入出生資料
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-center" style={{ color: "oklch(0.40 0.02 250)" }}>
          本平台內容只供娛樂、文化及參考用途，並不構成任何投資、醫療、法律或人生重大決策建議。
        </p>
      </div>
    </div>
  );
}
