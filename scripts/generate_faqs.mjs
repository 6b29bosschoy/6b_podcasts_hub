/**
 * Batch FAQ generation script for existing blog posts.
 * Uses the Manus built-in LLM API to generate 2-3 FAQ items per article.
 * Run: node scripts/generate_faqs.mjs
 */
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function invokeLLM(messages, responseFormat) {
  const body = { messages };
  if (responseFormat) body.response_format = responseFormat;

  const res = await fetch(`${FORGE_API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM API error ${res.status}: ${text}`);
  }

  return res.json();
}

const CATEGORY_LABELS = {
  relationship: '兩性關係',
  fengshui: '玄學風水',
  lifestyle: '生活態度',
  interview: '嘉賓訪談',
  other: '其他',
};

async function generateFaqForPost(post) {
  const response = await invokeLLM(
    [
      {
        role: 'system',
        content: `你係一個香港 SEO 專家，專門為文章生成 FAQ 結構化資料。
請根據文章內容，生成 2-3 個最有可能被香港讀者搜尋的問題及答案。
要求：
1. 問題用繁體中文，語氣自然，貼近香港讀者的搜尋習慣
2. 答案簡潔有力，50-120 字，直接回答問題
3. 問題應涵蓋文章核心主題，有助於 Google AI Overview 及 Perplexity 引用
4. 輸出 JSON 格式`,
      },
      {
        role: 'user',
        content: `文章標題：${post.title}
文章分類：${CATEGORY_LABELS[post.category] || post.category}
文章摘要：${post.excerpt || ''}
文章內容：${post.content.slice(0, 1500)}

請生成 FAQ JSON 陣列，格式如下：
[{"question": "問題一？", "answer": "答案一"}, ...]`,
      },
    ],
    {
      type: 'json_schema',
      json_schema: {
        name: 'faq_list',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            faqs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  answer: { type: 'string' },
                },
                required: ['question', 'answer'],
                additionalProperties: false,
              },
            },
          },
          required: ['faqs'],
          additionalProperties: false,
        },
      },
    }
  );

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty LLM response');
  const parsed = JSON.parse(content);
  return parsed.faqs.slice(0, 3);
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Get all approved/published posts that have empty FAQ
  const [posts] = await conn.execute(
    "SELECT id, slug, title, category, excerpt, content, faq FROM blog_posts WHERE status = 'approved' ORDER BY id ASC"
  );

  console.log(`Found ${posts.length} approved posts`);

  let generated = 0;
  let skipped = 0;

  for (const post of posts) {
    // Skip if FAQ already exists
    let existingFaq = [];
    try { existingFaq = JSON.parse(post.faq || '[]'); } catch {}
    if (existingFaq.length > 0) {
      console.log(`  [SKIP] "${post.title}" — FAQ already exists (${existingFaq.length} items)`);
      skipped++;
      continue;
    }

    console.log(`  [GEN]  "${post.title}" (${post.category})...`);
    try {
      const faqs = await generateFaqForPost(post);
      await conn.execute(
        'UPDATE blog_posts SET faq = ? WHERE id = ?',
        [JSON.stringify(faqs), post.id]
      );
      console.log(`         ✓ Generated ${faqs.length} FAQ items`);
      faqs.forEach((f, i) => console.log(`         Q${i + 1}: ${f.question}`));
      generated++;
    } catch (err) {
      console.error(`         ✗ Error: ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }

  await conn.end();
  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
}

main().catch(console.error);
