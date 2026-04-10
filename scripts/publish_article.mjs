/**
 * 路邊電台 — 自動化文章發布腳本 v2
 * 使用方式：node scripts/publish_article.mjs
 *
 * 修復：使用正確的 Manus ImageService API 端點
 * API 端點：images.v1.ImageService/GenerateImage（回傳 base64，需上傳至 S3）
 */

import mysql from 'mysql2/promise';

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
  imagePrompt: '', // 留空則自動根據標題生成提示詞
};
// ─────────────────────────────────────────────────────────────────────────────

/** 自動生成圖片提示詞 */
function buildImagePrompt(article) {
  if (article.imagePrompt) return article.imagePrompt;
  return `Hong Kong night cityscape, moody cinematic photo, emotional atmosphere, neon lights reflecting on wet streets, Victoria Harbour in background, blue purple orange neon glow, bokeh lights, no text, no logos, photorealistic, 16:9 wide format`;
}

/** 呼叫 Manus ImageService 生成圖片（base64）並上傳至 S3 */
async function generateAndUploadImage(prompt) {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn('⚠️  未設定 BUILT_IN_FORGE_API_KEY，跳過圖片生成');
    return null;
  }

  console.log('🎨 正在生成配圖...');

  // Step 1: 呼叫 ImageService 生成圖片（回傳 base64）
  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
  const imageApiUrl = new URL('images.v1.ImageService/GenerateImage', baseUrl).toString();

  let base64Data, mimeType;
  try {
    const response = await fetch(imageApiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'connect-protocol-version': '1',
        'authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        original_images: [],
      }),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => '');
      console.warn(`⚠️  圖片生成 API 錯誤 (${response.status}):`, err.substring(0, 200));
      return null;
    }

    const data = await response.json();
    base64Data = data?.image?.b64Json;
    mimeType = data?.image?.mimeType || 'image/png';

    if (!base64Data) {
      console.warn('⚠️  圖片生成回應格式異常:', JSON.stringify(data).substring(0, 200));
      return null;
    }
    console.log('✅ 圖片生成成功，正在上傳至 S3...');
  } catch (err) {
    console.warn('⚠️  圖片生成失敗:', err.message);
    return null;
  }

  // Step 2: 上傳 base64 圖片至 S3
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const fileKey = `column-covers/${Date.now()}.png`;
    const uploadUrl = new URL(`v1/storage/upload?path=${fileKey}`, baseUrl).toString();

    const blob = new Blob([buffer], { type: mimeType });
    const formData = new FormData();
    formData.append('file', blob, `${Date.now()}.png`);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const err = await uploadResponse.text().catch(() => '');
      console.warn(`⚠️  S3 上傳失敗 (${uploadResponse.status}):`, err.substring(0, 200));
      return null;
    }

    const uploadData = await uploadResponse.json();
    const cdnUrl = uploadData?.url;

    if (!cdnUrl) {
      console.warn('⚠️  S3 上傳回應格式異常:', JSON.stringify(uploadData).substring(0, 200));
      return null;
    }

    console.log('✅ 配圖上傳成功:', cdnUrl);
    return cdnUrl;
  } catch (err) {
    console.warn('⚠️  S3 上傳失敗:', err.message);
    return null;
  }
}

/** 生成 URL-friendly slug */
function generateSlug(title) {
  const timestamp = Date.now();
  const base = title
    .toLowerCase()
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '') // 移除中文字
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
  return `hk-${base || 'article'}-${timestamp}`;
}

/** 主流程 */
async function publishArticle() {
  console.log('\n🚀 路邊電台自動化文章發布流程 v2 啟動');
  console.log('─'.repeat(50));
  console.log('📝 文章標題:', ARTICLE.title);
  console.log('📂 類別:', ARTICLE.category);

  // 1. 生成並上傳配圖
  const imagePrompt = buildImagePrompt(ARTICLE);
  const coverImageUrl = await generateAndUploadImage(imagePrompt);

  if (!coverImageUrl) {
    console.log('⚠️  配圖未能生成，文章將以無圖片方式發布');
  }

  // 2. 連接資料庫
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // 確保 viewCount 欄位存在
    try {
      await connection.execute('ALTER TABLE `blog_posts` ADD `viewCount` int DEFAULT 0 NOT NULL');
      console.log('✅ viewCount 欄位已建立');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  viewCount 欄位已存在，跳過');
      } else {
        console.warn('⚠️  viewCount 欄位建立失敗:', e.message);
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

    const articleUrl = `https://6bpodcasts.com/blog/${slug}`;

    console.log('\n✅ 文章發布成功！');
    console.log('─'.repeat(50));
    console.log('🔗 文章連結:', articleUrl);
    console.log('🖼️  配圖狀態:', coverImageUrl ? '✅ 已生成並上傳' : '❌ 未生成');

    console.log('\n📱 Threads 發文草稿：');
    console.log('─'.repeat(50));
    const threadsText = `${ARTICLE.title}\n\n${ARTICLE.excerpt}\n\n完整文章 👇\n${articleUrl}\n\n#香港感情 #兩性關係 #路邊電台`;
    console.log(threadsText);

    return { articleUrl, coverImageUrl, slug };
  } finally {
    await connection.end();
  }
}

publishArticle().catch((err) => {
  console.error('❌ 發布失敗:', err.message);
  process.exit(1);
});
