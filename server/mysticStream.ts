/**
 * Mystic Stream Routes
 * Provides SSE (Server-Sent Events) endpoints for streaming AI analysis.
 * Mounted at /api/mystic/stream-report and /api/mystic/stream-akashic
 */
import { Router, Request, Response } from "express";
import { ENV } from "./_core/env";
import { canUseMysticToday, hasActiveMysticMembership, incrementMysticUsage } from "./db";
import { sdk } from "./_core/sdk";

// 農曆轉公曆（使用 lunar-typescript）
function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap = false): { year: number; month: number; day: number } {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Lunar } = require("lunar-typescript") as typeof import("lunar-typescript");
    const lunar = Lunar.fromYmd(lunarYear, isLeap ? -lunarMonth : lunarMonth, lunarDay);
    const solar = lunar.getSolar();
    return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
  } catch {
    // fallback: return as-is (approximate)
    return { year: lunarYear, month: lunarMonth, day: lunarDay };
  }
}

const router = Router();

// ── Shared helpers ─────────────────────────────────────────────────────────

function buildApiUrl(): string {
  const base = ENV.forgeApiUrl?.trim().replace(/\/$/, "") || "https://forge.manus.im";
  return `${base}/v1/chat/completions`;
}

async function streamLLM(
  systemPrompt: string,
  userPrompt: string,
  res: Response
): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const payload = {
    model: "gemini-2.5-flash",
    stream: true,
    max_tokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  };

  let upstream: globalThis.Response;
  try {
    upstream = await fetch(buildApiUrl(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    res.write(`data: [ERROR] Network error\n\n`);
    res.end();
    return;
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    res.write(`data: [ERROR] ${upstream.status} ${text.slice(0, 200)}\n\n`);
    res.end();
    return;
  }

  if (!upstream.body) {
    res.write(`data: [ERROR] No response body\n\n`);
    res.end();
    return;
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") continue;
        if (!trimmed.startsWith("data:")) continue;

        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr) continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (delta) {
            // Forward each token as SSE
            res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  } catch {
    // stream interrupted
  }

  res.write(`data: [DONE]\n\n`);
  res.end();
}

// ── Build prompts (mirrors routers.ts logic) ───────────────────────────────

function buildReportPrompts(body: {
  name?: string;
  year: number;
  month: number;
  day: number;
  hour?: string;
  gender: "male" | "female";
  method: string;
  topics: string[];
  // lunar input support
  inputMode?: "solar" | "lunar";
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
  isLeapMonth?: boolean;
}): { systemPrompt: string; userPrompt: string } {
  const methodNames: Record<string, string> = {
    ziwei: "紫微斗數", qimen: "奇門遁甲", bazi: "八字命理", meihua: "梅花易數",
    fengshui: "風水流年", naming: "姓名學", astrology: "星座占星",
    numerology: "生命靈數", tarot: "塔羅牌", humandesign: "人類圖",
    "western-annual": "西洋占星流年", moon: "月亮星座分析",
  };
  const topicNames: Record<string, string> = {
    annual: "流年總運", career: "事業運", wealth: "財運", love: "感情運",
    family: "家庭運", health: "健康運", lucky: "貴人運", tips: "開運建議",
  };

  const method = methodNames[body.method] || body.method;
  const topics = body.topics.map((t) => topicNames[t] || t).join("、");
  const genderStr = body.gender === "male" ? "男" : "女";

  // Build birth info string — include lunar if provided
  let birthInfo = `${body.year}年${body.month}月${body.day}日，${genderStr}性${body.hour ? `，${body.hour}出生` : ""}`;
  if (body.inputMode === "lunar" && body.lunarYear && body.lunarMonth && body.lunarDay) {
    const leapStr = body.isLeapMonth ? "閏" : "";
    birthInfo += `（農曆：${body.lunarYear}年${leapStr}${body.lunarMonth}月${body.lunarDay}日）`;
  }

  const systemPrompts: Record<string, string> = {
    tarot: "你係一位有二十年經驗嘅塔羅師傅，解牌風格細膩有畫面感，唔會用罐頭句子，每次解讀都係獨一無二嘅故事。你嘅語言係廣東話，直接、真實，有時會講到令人雞皮疙瘩嘅細節。如果有唔好嘅跡象，你會直接講，唔會淨係講好聽嘅說話。",
    astrology: "你係一位擁有英國占星學院認證嘅占星師，精通本命盤、流年推運及人際合盤。你嘅解讀唔係泛泛而談，係按照真實星象位置分析，會指出具體月份嘅行星移動如何影響當事人。用廣東話解說，語氣專業但親切，唔會用過多術語。",
    numerology: "你係一位深研生命靈數超過十五年嘅靈數導師，熟悉 Pythagorean 及 Chaldean 兩套系統。你嘅分析唔只係講靈數係幾號，而係深入探討業力課題、靈魂課題同今生使命。用廣東話，語氣溫柔但直接，唔會迴避困難嘅課題。",
    humandesign: "你係一位人類圖分析師，熟悉九大能量中心、四種類型、六條爻線及十三個閘門。你嘅解讀會結合當事人嘅出生資料推算能量類型，指出策略同權威，幫助佢哋做出正確決定。用廣東話，語氣清晰，避免過多術語。",
    "western-annual": "你係一位精通太陽回歸盤及行運占星嘅占星師，擅長按月份分析流年星象。你嘅解讀係按照真實行星移動，指出每個季度嘅機遇同挑戰，唔係籠統嘅吉凶預測。用廣東話，語氣直接，提供可執行嘅建議。",
    moon: "你係一位月亮星座情感分析師，深諳月亮星座如何影響一個人嘅情感模式、安全感需求同親密關係。你嘅解讀會揭示當事人嘅情感底層邏輯，解釋點解佢哋會有某些感情模式。用廣東話，語氣溫柔細膩，有畫面感。",
  };

  const systemPrompt = systemPrompts[body.method] ||
    "你係一位精通中西玄學嘅師傅，擅長以廣東話解釋玄學概念，提供真實、有深度嘅人生指引。唔好用罐頭句子，每個分析都要針對當事人嘅具體情況，如有唔好嘅方面也要直接指出。";

  const methodPrompts: Record<string, string> = {
    tarot: `請以塔羅師傅嘅角色，為以下人士進行流年塔羅解讀：\n\n出生資料：${birthInfo}\n分析範疇：${topics}\n\n請用抽牌嘅形式解讀，為每個範疇各抽一張主牌，描述牌面畫面、象徵意義，再連結到當事人嘅現實情況。語言要有畫面感、情緒細膩，唔好用「此牌代表...」呢種罐頭句式。如有逆位牌或挑戰性牌面，直接說明需要注意嘅地方。約400字。最後加一句：本解讀只供靈性參考，重大決定請自行判斷。`,
    astrology: `請以占星師嘅角色，為以下人士進行流年占星分析：\n\n出生資料：${birthInfo}\n分析範疇：${topics}\n\n請按照2026年主要行星移動（木星、土星、天王星）分析對當事人嘅影響，指出具體月份嘅機遇同挑戰。唔好只講「運勢不錯」，要說明係哪個行星進入哪個宮位帶來咩影響。約400字。最後加一句：本分析只供參考，未來由你自己創造。`,
    numerology: `請以生命靈數導師嘅角色，為以下人士進行靈數分析：\n\n出生資料：${birthInfo}\n分析範疇：${topics}\n\n請計算生命靈數、個人年數及靈魂衝動數，分析今年嘅業力課題同靈魂課題。唔好只係講靈數係幾號，要深入探討今年嘅核心功課係乜，以及如何透過了解自己嘅靈數模式改善各範疇運勢。約400字。最後加一句：靈數係工具，唔係命運。`,
  };

  const userPrompt = methodPrompts[body.method] ||
    `請以精通${method}嘅師傅角色，為以下人士提供深入分析：\n\n出生資料：${birthInfo}\n分析範疇：${topics}\n\n分析要求：\n1. 唔好用罐頭句子，每個分析都要針對當事人嘅具體情況\n2. 如有唔好嘅方面，直接指出，唔好淨係講好聽嘅說話\n3. 提供具體、可執行嘅建議，唔係泛泛而談\n4. 語氣真實自然，像一位有經驗嘅師傅在傾談\n5. 約400字\n\n最後加一句：本分析只供娛樂參考，並不構成任何重大決策建議。`;

  return { systemPrompt, userPrompt };
}

function buildAkashicPrompts(body: {
  personA: { name: string; year: number; month: number; day: number };
  personB?: { name: string; year: number; month: number; day: number };
  readingType: string;
}): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = "你係一位阿卡西紀錄讀取師，能夠進入靈魂紀錄嘅高維空間，以廣東話傳遞靈魂層面嘅訊息。你嘅解讀唔係算命，而係靈魂層面嘅提醒同指引。語氣溫柔但直接，有時會有具體嘅畫面或隱喻。唔好用罐頭靈性語言，每個解讀都要係獨特嘅。";

  const readingPrompts: Record<string, string> = {
    pastLife: `請為 ${body.personA.name}（${body.personA.year}年${body.personA.month}月${body.personA.day}日出生）進行前世今生阿卡西紀錄解讀。\n\n請描述：\n1. 前世嘅地點、時代同身分（要具體，唔好太抽象）\n2. 前世帶來今生嘅業力課題\n3. 今生需要完成嘅靈魂任務\n4. 一個具體嘅行動建議\n\n約350字。`,
    soulAge: `請為 ${body.personA.name}（${body.personA.year}年${body.personA.month}月${body.personA.day}日出生）分析靈魂年齡及靈魂層次。\n\n請說明：\n1. 靈魂年齡（嬰兒/孩童/青年/成熟/老靈魂）及特徵\n2. 今生靈魂嘅主要課題\n3. 靈魂成長嘅方向\n4. 能量磁場嘅特質\n\n約350字。`,
    soulMate: `請為以下兩位進行靈魂伴侶阿卡西紀錄解讀：\n\n甲方：${body.personA.name}（${body.personA.year}年${body.personA.month}月${body.personA.day}日）\n乙方：${body.personB?.name || "對方"}（${body.personB?.year || ""}年${body.personB?.month || ""}月${body.personB?.day || ""}日）\n\n請分析：\n1. 兩人嘅靈魂連結類型（業力關係/靈魂伴侶/雙生火焰）\n2. 前世嘅相遇場景\n3. 今生相遇嘅靈魂目的\n4. 關係中需要療癒嘅課題\n\n約400字。`,
    energyField: `請為 ${body.personA.name}（${body.personA.year}年${body.personA.month}月${body.personA.day}日出生）分析能量磁場同補充建議。\n\n請說明：\n1. 當前能量磁場嘅狀態\n2. 能量流失嘅主要原因\n3. 具體嘅能量補充方法（食物、顏色、環境、習慣）\n4. 2026年下半年能量趨勢\n\n約350字。`,
    annualEnergy: `請為 ${body.personA.name}（${body.personA.year}年${body.personA.month}月${body.personA.day}日出生）解讀2026年下半年嘅靈魂能量流年。\n\n請分析：\n1. 2026年下半年嘅整體靈魂課題\n2. 事業同財運嘅高低點\n3. 感情能量嘅流動\n4. 健康能量需要注意嘅地方\n5. 最佳行動窗口月份\n\n約400字。`,
  };

  const userPrompt = readingPrompts[body.readingType] ||
    `請為 ${body.personA.name} 進行阿卡西紀錄解讀，約350字。`;

  return { systemPrompt, userPrompt };
}

// ── Auth + Quota middleware helper ─────────────────────────────────────────────────────

async function checkAuthAndQuota(req: Request, res: Response): Promise<{ userId: number; hasPaidMembership: boolean } | null> {
  let user;
  try {
    user = await sdk.authenticateRequest(req);
  } catch {
    res.status(401).json({ error: "LOGIN_REQUIRED", message: "請先登入以使用玄學分析功能" });
    return null;
  }
  if (!user) {
    res.status(401).json({ error: "LOGIN_REQUIRED", message: "請先登入以使用玄學分析功能" });
    return null;
  }
  const hasPaidMembership = await hasActiveMysticMembership(user.id);
  if (hasPaidMembership) return { userId: user.id, hasPaidMembership: true };
  const { allowed, remaining } = await canUseMysticToday(user.id);
  if (!allowed) {
    res.status(429).json({ error: "QUOTA_EXCEEDED", message: `今日免費額度已用盡，明日再來！`, remaining: 0 });
    return null;
  }
  return { userId: user.id, hasPaidMembership: false };
}

// ── Routes ───────────────────────────────────────────────────────────────────────────

router.post("/stream-report", async (req: Request, res: Response) => {
  try {
    const auth = await checkAuthAndQuota(req, res);
    if (!auth) return;

    const body = req.body as Parameters<typeof buildReportPrompts>[0];
    // If lunar input, convert to solar first
    if (body.inputMode === "lunar" && body.lunarYear && body.lunarMonth && body.lunarDay) {
      const solar = lunarToSolar(body.lunarYear, body.lunarMonth, body.lunarDay, body.isLeapMonth);
      body.year = solar.year;
      body.month = solar.month;
      body.day = solar.day;
    }
    if (!body.year || !body.month || !body.day || !body.gender || !body.method || !body.topics?.length) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    // Free accounts use the daily quota; an active paid membership does not.
    if (!auth.hasPaidMembership) await incrementMysticUsage(auth.userId);
    const { systemPrompt, userPrompt } = buildReportPrompts(body);
    await streamLLM(systemPrompt, userPrompt, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.post("/stream-akashic", async (req: Request, res: Response) => {
  try {
    const auth = await checkAuthAndQuota(req, res);
    if (!auth) return;

    const body = req.body as Parameters<typeof buildAkashicPrompts>[0];
    if (!body.personA?.name || !body.personA?.year || !body.readingType) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    // Free accounts use the daily quota; an active paid membership does not.
    if (!auth.hasPaidMembership) await incrementMysticUsage(auth.userId);
    const { systemPrompt, userPrompt } = buildAkashicPrompts(body);
    await streamLLM(systemPrompt, userPrompt, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
