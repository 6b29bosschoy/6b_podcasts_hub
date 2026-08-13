/**
 * 直接插入文章到資料庫（繞過 pending 審核狀態，直接設為 approved）
 * Usage: node scripts/insert_article.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { assertTopicSlug } from "./blog-slug.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

const now = new Date();
const slug = "district-love-dating-status";
assertTopicSlug(slug);

const article = {
  title: "住港島先夠格做我女友？香港人用地區篩選愛情，係自信定係自卑？",
  slug,
  authorName: "路邊電台編輯部",
  authorEmail: "hello@6bpodcasts.com",
  authorBio: "路邊電台嘉賓專欄，分享香港最真實的兩性故事與觀點。",
  excerpt: "一個港島男嫌棄深水埗女友的帖子鬧爆 Threads，笑完之後，我們反而想問：香港人係咪真係用地址來篩選愛情？呢種「地區 snobbery」，係自信定係自卑？",
  content: `最近 Threads 上有一條帖子鬧爆全港。

一個自稱港島長大的男生，發文直言：「我擇偶第一條件，係對方要住港島。聽到深水埗、葵涌，我真係忍唔住想 block 佢。」仲補充話，怕帶女朋友見朋友會尷尬——「佢個人唔錯，但住咁雜嘅地方……」

帖子一出，留言炸鑊。

「港島住壞腦？」「東區都有公屋啦！」「深水埗係香港文化發源地，仲有發哥舊居㗎！」

但係，笑完之後，我反而諗起一個問題：呢種「地區 snobbery」，係咪真係香港人嘅獨有病？

## 地區係篩選器，還是自我保護？

香港係一個極度密集、極度分層嘅城市。

港島、九龍、新界——唔單止係地理分隔，背後係一整套隱形嘅階級想像。住半山係有錢人，住深水埗係草根，住將軍澳係「移民」。呢套標籤，香港人由細到大都耳濡目染，唔知不覺就內化咗。

所以當嗰個男生話「住深水埗唔 match」，佢其實唔係在嫌棄一個地址，佢係在嫌棄一種他想像中的生活方式、一種社會位置、一種「唔夠格」的感覺。

問題係，呢種想像，係真實嘅嗎？

一個住深水埗的女生，可以係創業家、藝術家、社工、護士——任何一種令人尊敬的人。一個住半山的男人，可以係最不懂得珍惜人的廢物。地址從來唔代表一個人的價值，但我哋偏偏習慣用它來做第一道篩選。

更深層嘅問題係：**一個真正對自己有信心的人，需要靠女友的地址來證明自己嘅身份嗎？**

## 愛情唔係 status symbol

香港人太習慣將感情「功能化」——拍拖係為咗有伴、結婚係為咗穩定、選對象係為咗「配得上」自己嘅社交形象。

但係，呢種計算式的愛情，最終只會令自己愈來愈孤獨。

因為你篩走的，可能正是那個最真實、最適合你的人。

路邊電台訪問過幾百個嘉賓，見過太多「條件完美」的關係最終崩潰，亦見過太多「唔 match」的組合反而走得最遠。感情的化學反應，從來唔係靠地址計算出來的。

下次見到一個令你心動的人，不妨先問自己：**你係想要一段真實的感情，還是一個可以帶出街炫耀的配件？**

---

> 「好多人揀對象，其實係在揀一面鏡——照出自己想成為的那個人。」`,
  category: "relationship",
  status: "approved",
  images: JSON.stringify(["https://d2xsxph8kpxj0f.cloudfront.net/310519663073423209/XJagJnJEiagVDDmfVeExSL/column_001_cover-K4iBUKDAdps22BBZ8T7i6Z.webp"]),
  links: JSON.stringify([]),
  publishedAt: now,
  createdAt: now,
  updatedAt: now,
};

try {
  await connection.execute(
    `INSERT INTO blog_posts (title, slug, authorName, authorEmail, authorBio, excerpt, content, category, status, images, links, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      article.title,
      article.slug,
      article.authorName,
      article.authorEmail,
      article.authorBio,
      article.excerpt,
      article.content,
      article.category,
      article.status,
      article.images,
      article.links,
      article.publishedAt,
      article.createdAt,
      article.updatedAt,
    ]
  );
  console.log("✅ 文章已成功插入！");
  console.log(`   Slug: ${slug}`);
  console.log(`   URL: https://6bpodcasts.com/blog/${slug}`);
} catch (err) {
  console.error("❌ 插入失敗:", err);
} finally {
  await connection.end();
}
