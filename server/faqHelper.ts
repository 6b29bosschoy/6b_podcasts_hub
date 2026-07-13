/**
 * faqHelper.ts
 * Shared helper to auto-generate FAQ for a blog post using AI.
 * Called after a post is created/published so it runs in the background
 * without blocking the HTTP response.
 */

import { invokeLLM } from "./_core/llm";
import { updateBlogPostFaq } from "./db";

const CATEGORY_LABEL: Record<string, string> = {
  relationship: "兩性關係",
  fengshui: "玄學風水",
  lifestyle: "生活態度",
  interview: "嘉賓訪談",
  other: "其他",
};

interface PostInfo {
  slug: string;
  title: string;
  category: string;
  excerpt?: string | null;
  content: string;
}

/**
 * Generates 2-3 FAQ items for a post and persists them to the database.
 * Designed to be called with `.catch(() => {})` so failures are silent.
 */
export async function generateFaqForPost(post: PostInfo): Promise<void> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `你係一個香港 SEO 專家，專門為文章生成 FAQ 結構化資料。
請根據文章內容，生成 2-3 個最有可能被香港讀者搜尋的問題及答案。
要求：
1. 問題用繁體中文，語氣自然，貼近香港讀者的搜尋習慣
2. 答案簡潔有力，50-120 字，直接回答問題
3. 問題應涵蓋文章核心主題，有助於 Google AI Overview 及 Perplexity 引用
4. 輸出 JSON 格式`,
      },
      {
        role: "user",
        content: `文章標題：${post.title}
文章分類：${CATEGORY_LABEL[post.category] ?? post.category}
文章摘要：${post.excerpt ?? ""}
文章內容：${post.content.slice(0, 1500)}

請生成 FAQ JSON 陣列，格式如下：
[{"question": "問題一？", "answer": "答案一"}, ...]`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "faq_list",
        strict: true,
        schema: {
          type: "object",
          properties: {
            faqs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                },
                required: ["question", "answer"],
                additionalProperties: false,
              },
            },
          },
          required: ["faqs"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") return;

  const parsed = JSON.parse(content) as { faqs: { question: string; answer: string }[] };
  const faqs = parsed.faqs.slice(0, 3);
  await updateBlogPostFaq(post.slug, faqs);
}
