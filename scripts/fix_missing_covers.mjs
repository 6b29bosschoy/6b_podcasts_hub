/**
 * fix_missing_covers.mjs
 * 為所有缺少封面圖片（coverImage 為空或 null）的文章，
 * 重新生成 AI 配圖並上傳至 S3 CDN，然後更新資料庫。
 *
 * 使用方式：
 *   node scripts/fix_missing_covers.mjs
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// ─── 圖片生成與上傳 ───────────────────────────────────────────────────────────

/**
 * 根據文章標題和類別，建立圖片生成 prompt
 */
function buildImagePrompt(title, category) {
  const categoryHints = {
    relationship: '兩性關係、感情、約會',
    lifestyle: '生活方式、都市生活',
    culture: '香港文化、本地社會',
    metaphysics: '玄學、命理',
    other: '香港都市',
  };
  const hint = categoryHints[category] || '香港都市生活';
  return `Hong Kong neon-lit cityscape at night, cinematic photography style, 
blue orange purple color palette, bokeh lights, urban atmosphere, 
moody and emotional, 16:9 aspect ratio, no text, no logo, no watermark, 
photorealistic, high quality. Theme: ${hint}. Inspired by: "${title}".`;
}

/**
 * 呼叫 Manus ImageService 生成圖片，並上傳至 S3
 * 回傳 CDN URL 或 null（失敗時）
 */
async function generateAndUploadImage(prompt) {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!apiUrl || !apiKey) {
    console.warn('  ⚠️  未設定 BUILT_IN_FORGE_API_KEY，跳過圖片生成');
    return null;
  }

  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
  const imageApiUrl = new URL('images.v1.ImageService/GenerateImage', baseUrl).toString();

  // Step 1: 生成圖片（回傳 base64）
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
      body: JSON.stringify({ prompt, original_images: [] }),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => '');
      console.warn(`  ⚠️  圖片生成 API 錯誤 (${response.status}):`, err.substring(0, 200));
      return null;
    }

    const data = await response.json();
    base64Data = data?.image?.b64Json;
    mimeType = data?.image?.mimeType || 'image/png';

    if (!base64Data) {
      console.warn('  ⚠️  圖片生成回應格式異常:', JSON.stringify(data).substring(0, 200));
      return null;
    }
    console.log('  ✅ 圖片生成成功，正在上傳至 S3...');
  } catch (err) {
    console.warn('  ⚠️  圖片生成失敗:', err.message);
    return null;
  }

  // Step 2: 上傳至 S3
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
      console.warn(`  ⚠️  S3 上傳失敗 (${uploadResponse.status}):`, err.substring(0, 200));
      return null;
    }

    const uploadData = await uploadResponse.json();
    const cdnUrl = uploadData?.url;
    if (!cdnUrl) {
      console.warn('  ⚠️  S3 上傳回應格式異常:', JSON.stringify(uploadData).substring(0, 200));
      return null;
    }

    console.log('  ✅ 配圖上傳成功:', cdnUrl);
    return cdnUrl;
  } catch (err) {
    console.warn('  ⚠️  S3 上傳失敗:', err.message);
    return null;
  }
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

async function fixMissingCovers() {
  console.log('\n🔧 路邊電台批量補圖工具');
  console.log('─'.repeat(50));

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // 1. 查詢所有缺少封面圖的已發布文章
    const [rows] = await connection.execute(
      `SELECT id, title, slug, category, coverImage 
       FROM blog_posts 
       WHERE status = 'approved' 
         AND (coverImage IS NULL OR coverImage = '' OR coverImage = 'null')
       ORDER BY id`
    );

    if (rows.length === 0) {
      console.log('✅ 所有文章均已有封面圖，無需補圖！');
      return;
    }

    console.log(`📋 找到 ${rows.length} 篇缺少封面圖的文章：`);
    rows.forEach((r, i) => {
      console.log(`  ${i + 1}. [ID:${r.id}] ${r.title} (${r.category})`);
    });
    console.log('');

    // 2. 逐篇生成並更新
    let successCount = 0;
    let failCount = 0;

    for (const article of rows) {
      console.log(`\n📝 處理文章 [ID:${article.id}]: ${article.title}`);
      
      const prompt = buildImagePrompt(article.title, article.category);
      console.log(`  🎨 Prompt: ${prompt.substring(0, 100)}...`);

      const cdnUrl = await generateAndUploadImage(prompt);

      if (cdnUrl) {
        // 更新資料庫
        await connection.execute(
          `UPDATE blog_posts SET coverImage = ?, updatedAt = NOW() WHERE id = ?`,
          [cdnUrl, article.id]
        );
        console.log(`  ✅ 資料庫已更新`);
        successCount++;
      } else {
        console.log(`  ❌ 圖片生成失敗，跳過此文章`);
        failCount++;
      }

      // 每篇之間稍作等待，避免 API 過載
      if (rows.indexOf(article) < rows.length - 1) {
        console.log('  ⏳ 等待 3 秒...');
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    // 3. 最終報告
    console.log('\n' + '─'.repeat(50));
    console.log('📊 補圖完成報告：');
    console.log(`  ✅ 成功：${successCount} 篇`);
    console.log(`  ❌ 失敗：${failCount} 篇`);

    if (successCount > 0) {
      // 驗證結果
      const [updated] = await connection.execute(
        `SELECT id, title, coverImage FROM blog_posts 
         WHERE status = 'approved' AND coverImage IS NOT NULL AND coverImage != '' 
         ORDER BY id`
      );
      console.log(`\n🖼️  目前共有 ${updated.length} 篇文章有封面圖：`);
      updated.forEach(r => {
        console.log(`  ✅ [ID:${r.id}] ${r.title}`);
        console.log(`     ${r.coverImage}`);
      });
    }

  } finally {
    await connection.end();
  }
}

fixMissingCovers().catch((err) => {
  console.error('❌ 補圖失敗:', err.message);
  process.exit(1);
});
