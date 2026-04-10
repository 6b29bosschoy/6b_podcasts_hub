/**
 * 路邊電台 — 自動化文章發布腳本
 * 使用方式：node scripts/publish_article.mjs
 *
 * 功能：
 * 1. 接收文章資料（標題、內容、摘要、類別、SEO 關鍵詞）
 * 2. 呼叫 Manus AI 圖片生成 API 自動生成配圖
 * 3. 上傳配圖至 S3 CDN
 * 4. 將文章連同配圖 URL 一次性插入資料庫
 *
 * 環境變數需求：
 * - DATABASE_URL：MySQL 連線字串
 * - BUILT_IN_FORGE_API_KEY：Manus 內建 API 金鑰（用於圖片生成）
 * - BUILT_IN_FORGE_API_URL：Manus 內建 API URL
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── 文章資料（每次發布前修改此區塊）─────────────────────────────────────────
const ARTICLE = {
  title: '文章標題（必填）',
  excerpt: '文章摘要，約 50-100 字，顯示在列表頁（必填）',
  content: `文章正文內容（必填）

支援 Markdown 格式。`,
  category: 'relationship', // relationship | metaphysics | lifestyle | interview
  authorName: '路邊電台編輯部',
  authorEmail: 'editor@6bpodcasts.com',
  authorBio: '路邊電台官方編輯部，追蹤香港最新兩性關係熱話，為你拆解城市愛情故事。',
  seoKeywords: '香港感情, 兩性關係, 路邊電台', // 用於圖片生成提示詞
  imagePrompt: '', // 留空則自動根據標題生成提示詞
};
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 自動生成圖片提示詞（如未指定）
 */
function buildImagePrompt(article) {
  if (article.imagePrompt) return article.imagePrompt;
  return `Hong Kong night cityscape, moody cinematic photo, emotional atmosphere related to "${article.title}", neon lights reflecting on wet streets, Victoria Harbour in background, blue purple orange neon glow, bokeh lights, no text, no logos, photorealistic, 16:9 wide format`;
}

/**
 * 呼叫 Manus 內建圖片生成 API
 */
async function generateCoverImage(prompt) {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn('⚠️  未設定 BUILT_IN_FORGE_API_KEY，跳過圖片生成');
    return null;
  }

  console.log('🎨 正在生成配圖...');

  try {
    const response = await fetch(`${apiUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '1792x1024',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn('⚠️  圖片生成 API 錯誤:', err);
      return null;
    }

    const data = await response.json();
    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      console.warn('⚠️  圖片生成回應格式異常');
      return null;
    }

    console.log('✅ 配圖生成成功:', imageUrl);
    return imageUrl;
  } catch (err) {
    console.warn('⚠️  圖片生成失敗:', err.message);
    return null;
  }
}

/**
 * 生成 URL-friendly slug
 */
function generateSlug(title) {
  const timestamp = Date.now();
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    .replace(/-+$/, '');
  return `${base || 'article'}-${timestamp}`;
}

/**
 * 主流程：生成配圖 → 插入資料庫
 */
async function publishArticle() {
  console.log('\n🚀 路邊電台自動化文章發布流程啟動');
  console.log('─'.repeat(50));
  console.log('📝 文章標題:', ARTICLE.title);
  console.log('📂 類別:', ARTICLE.category);

  // 1. 生成配圖
  const imagePrompt = buildImagePrompt(ARTICLE);
  const coverImageUrl = await generateCoverImage(imagePrompt);

  if (!coverImageUrl) {
    console.log('⚠️  將使用預設佔位圖片發布');
  }

  // 2. 連接資料庫
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // 確保 viewCount 欄位存在
    try {
      await connection.execute('ALTER TABLE `blog_posts` ADD `viewCount` int DEFAULT 0 NOT NULL');
      console.log('✅ viewCount 欄位已建立');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  viewCount 欄位已存在');
      }
    }

    // 3. 插入文章
    const slug = generateSlug(ARTICLE.title);
    const now = new Date();

    await connection.execute(
      `INSERT INTO blog_posts 
        (title, slug, authorName, authorEmail, authorBio, coverImage, excerpt, content, category, status, images, links, viewCount, publishedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', '[]', '[]', 0, ?)`,
      [
        ARTICLE.title,
        slug,
        ARTICLE.authorName,
        ARTICLE.authorEmail,
        ARTICLE.authorBio,
        coverImageUrl || '',
        ARTICLE.excerpt,
        ARTICLE.content,
        ARTICLE.category,
        now,
      ]
    );

    console.log('\n✅ 文章發布成功！');
    console.log('─'.repeat(50));
    console.log('🔗 文章 Slug:', slug);
    console.log('🌐 文章連結: https://6bpodcasts.com/blog/' + slug);
    console.log('🖼️  配圖:', coverImageUrl ? '✅ 已生成並上傳' : '❌ 未生成（使用預設）');
    console.log('\n📱 Threads 發文草稿：');
    console.log('─'.repeat(50));
    console.log(`${ARTICLE.title}\n\n${ARTICLE.excerpt}\n\n完整文章 👇\nhttps://6bpodcasts.com/blog/${slug}\n\n#香港感情 #兩性關係 #路邊電台`);
  } finally {
    await connection.end();
  }
}

publishArticle().catch((err) => {
  console.error('❌ 發布失敗:', err.message);
  process.exit(1);
});
