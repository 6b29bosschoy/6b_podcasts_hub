/**
 * YouTube Data API v3 helper
 * Fetches latest videos and channel info for 6B Podcasts channels
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// Channel IDs for the two channels
export const CHANNELS = {
  podcasts: "@6bpodcasts",
  fengshui: "@6bfengshui",
} as const;

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  channelTitle: string;
  channelId: string;
  url: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  customUrl: string;
}

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

/**
 * Resolve a channel handle (@username) to a channel ID
 */
export async function resolveChannelId(handle: string): Promise<string> {
  const apiKey = getApiKey();
  // Remove @ prefix if present
  const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

  const url = new URL(`${YOUTUBE_API_BASE}/channels`);
  url.searchParams.set("part", "id");
  url.searchParams.set("forHandle", cleanHandle);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube API error (resolveChannelId): ${res.status} ${err}`);
  }
  const data = await res.json() as { items?: Array<{ id: string }> };
  const channelId = data.items?.[0]?.id;
  if (!channelId) throw new Error(`Channel not found for handle: ${handle}`);
  return channelId;
}

/**
 * Get channel info by channel ID
 */
export async function getChannelInfo(channelId: string): Promise<YouTubeChannel> {
  const apiKey = getApiKey();
  const url = new URL(`${YOUTUBE_API_BASE}/channels`);
  url.searchParams.set("part", "snippet,statistics,brandingSettings");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube API error (getChannelInfo): ${res.status} ${err}`);
  }
  const data = await res.json() as {
    items?: Array<{
      id: string;
      snippet: { title: string; description: string; thumbnails: { default: { url: string } }; customUrl: string };
      statistics: { subscriberCount: string; videoCount: string; viewCount: string };
    }>;
  };
  const item = data.items?.[0];
  if (!item) throw new Error(`Channel not found: ${channelId}`);

  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.default?.url ?? "",
    subscriberCount: item.statistics.subscriberCount ?? "0",
    videoCount: item.statistics.videoCount ?? "0",
    viewCount: item.statistics.viewCount ?? "0",
    customUrl: item.snippet.customUrl ?? "",
  };
}

/**
 * Get latest videos from a channel using search API
 */
export async function getLatestVideos(channelId: string, maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = getApiKey();

  // Step 1: Search for latest video IDs
  const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
  searchUrl.searchParams.set("part", "id");
  searchUrl.searchParams.set("channelId", channelId);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("order", "date");
  searchUrl.searchParams.set("maxResults", String(maxResults));
  searchUrl.searchParams.set("key", apiKey);

  const searchRes = await fetch(searchUrl.toString());
  if (!searchRes.ok) {
    const err = await searchRes.text();
    throw new Error(`YouTube API error (search): ${searchRes.status} ${err}`);
  }
  const searchData = await searchRes.json() as {
    items?: Array<{ id: { videoId: string } }>;
  };

  const videoIds = (searchData.items ?? [])
    .map((item) => item.id?.videoId)
    .filter(Boolean) as string[];

  if (videoIds.length === 0) return [];

  // Step 2: Get full video details (statistics, contentDetails)
  const videosUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
  videosUrl.searchParams.set("part", "snippet,statistics,contentDetails");
  videosUrl.searchParams.set("id", videoIds.join(","));
  videosUrl.searchParams.set("key", apiKey);

  const videosRes = await fetch(videosUrl.toString());
  if (!videosRes.ok) {
    const err = await videosRes.text();
    throw new Error(`YouTube API error (videos): ${videosRes.status} ${err}`);
  }
  const videosData = await videosRes.json() as {
    items?: Array<{
      id: string;
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        channelTitle: string;
        channelId: string;
        thumbnails: {
          maxres?: { url: string };
          high?: { url: string };
          medium?: { url: string };
          default?: { url: string };
        };
      };
      statistics: { viewCount?: string; likeCount?: string };
      contentDetails: { duration: string };
    }>;
  };

  return (videosData.items ?? []).map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.medium?.url ??
      item.snippet.thumbnails?.default?.url ??
      "",
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics.viewCount ?? "0",
    likeCount: item.statistics.likeCount ?? "0",
    duration: item.contentDetails.duration,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    url: `https://www.youtube.com/watch?v=${item.id}`,
  }));
}

/**
 * Parse ISO 8601 duration (e.g. PT1H2M3S) to human-readable string
 */
export function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Format view count (e.g. 12345 → 1.2萬)
 */
export function formatViewCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return "0";
  if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
