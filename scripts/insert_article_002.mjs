import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const article = {
  title: '月入 3 萬唔配拍拖？香港人係咪真係用薪金定義愛情價值？',
  slug: 'hk-30k-salary-dating-standard-' + Date.now(),
  authorName: '路邊電台編輯部',
  authorEmail: 'editor@6bpodcasts.com',
  authorBio: '路邊電台官方編輯部，追蹤香港最新兩性關係熱話，為你拆解城市愛情故事。',
  coverImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/column_002_cover-ZihFB7FrWCHPc4XKdK6D9K.webp',
  excerpt: '最近 Threads 有條帖子鬧爆全港——一名港女直言，喺香港拍拖根本係燒銀紙，男方月入唔夠三萬，食頓好嘢、睇場戲、偶爾去旅行，分分鐘已經見底。呢個話題踩中咗香港人最敏感嘅神經——錢同愛情嘅邊界。',
  content: `最近 Threads 有條帖子鬧爆全港——一名港女直言，喺香港拍拖根本係燒銀紙，男方月入唔夠三萬，食頓好嘢、睇場戲、偶爾去旅行，分分鐘已經見底。帖子一出，男女網民即刻開戰，有人話「三萬係基本」，有人話「唔係錢嘅問題係態度」，仲有人反問：「咁你自己月入幾多？」

呢個話題之所以炸鑊，係因為佢踩中咗香港人最敏感嘅神經——**錢同愛情嘅邊界**。

---

**香港嘅拍拖成本，係真係貴**

唔好話佢哋物質，香港嘅消費水平擺喺度。一頓像樣嘅晚飯，隨時五六百；睇場戲加爆谷，二百幾蚊冇晒；去一次短途旅行，幾千蚊係基本。如果月入只有兩萬幾，扣埋租金、交通、日常開支，所謂「拍拖預算」根本係奢侈品。

所以港女嘅三萬門檻，某程度上唔係無道理——佢哋要嘅唔係豪華生活，係**一種基本嘅生活質素保障**。

---

**但問題係，三萬係門檻定係篩選工具？**

係度就要拆解一個心理現象：好多人用「收入門檻」嚟篩選對象，表面係理性計算，骨子裡係**用數字逃避真正嘅親密關係**。

月入三萬嘅人，唔代表佢識得珍惜你；月入一萬五嘅人，唔代表佢唔願意為你拼命。路邊電台訪問過唔少嘉賓，有人由窮小子變成功老闆，有人由高薪白領變到一無所有——令關係破裂嘅，從來唔係薪金，係**兩個人係咪願意喺最難嘅時候企喺一齊**。

---

**真正嘅問題：你要嘅係安全感，定係愛情？**

心理學上有個概念叫「物質安全感替代情感安全感」——當一個人唔確定自己係咪值得被愛，就會用外在條件嚟填補內心嘅空洞。三萬唔係愛情嘅保證，係**焦慮嘅安慰劑**。

真正嘅問題唔係對方月入幾多，而係：**你哋係咪真係 Feel 到對方？係咪願意一齊面對香港呢個又貴又難搵食嘅城市？**

如果係，三萬係起點；如果唔係，三十萬都係終點。

---

*路邊電台訪問過超過 486 位嘉賓，每一個真實故事都話你聽：愛情從來唔係計數題。*`,
  category: 'relationship',
  status: 'approved',
  images: '[]',
  links: '[]',
  viewCount: 0,
  publishedAt: new Date(),
};

try {
  // First ensure viewCount column exists
  try {
    await connection.execute('ALTER TABLE `blog_posts` ADD `viewCount` int DEFAULT 0 NOT NULL');
    console.log('✅ viewCount 欄位已添加');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  viewCount 欄位已存在');
    } else {
      console.log('⚠️  viewCount 欄位狀態:', e.message);
    }
  }

  // Insert article (without viewCount if column doesn't exist yet)
  try {
    await connection.execute(
      `INSERT INTO blog_posts (title, slug, authorName, authorEmail, authorBio, coverImage, excerpt, content, category, status, images, links, viewCount, publishedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [article.title, article.slug, article.authorName, article.authorEmail, article.authorBio,
       article.coverImage, article.excerpt, article.content, article.category, article.status,
       article.images, article.links, article.viewCount, article.publishedAt]
    );
    console.log('✅ 文章已成功發布！');
    console.log('🔗 Slug:', article.slug);
  } catch (e) {
    if (e.message.includes('viewCount')) {
      // Try without viewCount
      await connection.execute(
        `INSERT INTO blog_posts (title, slug, authorName, authorEmail, authorBio, coverImage, excerpt, content, category, status, images, links, publishedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [article.title, article.slug, article.authorName, article.authorEmail, article.authorBio,
         article.coverImage, article.excerpt, article.content, article.category, article.status,
         article.images, article.links, article.publishedAt]
      );
      console.log('✅ 文章已成功發布（不含 viewCount）！');
      console.log('🔗 Slug:', article.slug);
    } else {
      throw e;
    }
  }
} catch (error) {
  console.error('❌ 錯誤:', error.message);
} finally {
  await connection.end();
}
