import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  await connection.execute('ALTER TABLE `blog_posts` ADD `viewCount` int DEFAULT 0 NOT NULL');
  console.log('✅ viewCount 欄位已成功添加到 blog_posts 表');
} catch (error) {
  if (error.code === 'ER_DUP_FIELDNAME') {
    console.log('ℹ️  viewCount 欄位已存在');
  } else {
    console.error('❌ 錯誤:', error.message);
  }
}
await connection.end();
