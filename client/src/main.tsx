import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

initAnalytics();

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// ── WebMCP: Expose site tools to AI agents via the browser ────────────────────
if (typeof window !== "undefined" && "modelContext" in navigator) {
  const nav = navigator as Navigator & {
    modelContext: {
      provideContext: (tools: {
        name: string;
        description: string;
        inputSchema: object;
        execute: (input: unknown) => Promise<unknown>;
      }[]) => void;
    };
  };
  nav.modelContext.provideContext([
    {
      name: "list_articles",
      description: "列出路邊電台嘉賓專欄文章，可按分類篩選（兩性關係、玄學風水、生活態度、嘉賓訪談）",
      inputSchema: {
        type: "object",
        properties: {
          category: { type: "string", description: "Category filter: relationship | fengshui | lifestyle | interview | other" },
          limit: { type: "number", description: "Max number of articles to return (default 10)" },
        },
        additionalProperties: false,
      },
      execute: async (input: unknown) => {
        const params = input as { category?: string; limit?: number };
        const url = new URL("/api/trpc/blog.list", window.location.origin);
        url.searchParams.set("input", JSON.stringify({ json: { category: params.category, limit: params.limit ?? 10 } }));
        const res = await fetch(url.toString(), { credentials: "include" });
        return res.json();
      },
    },
    {
      name: "get_article",
      description: "取得路邊電台指定文章的完整內容，包括 FAQ 問答",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Article slug identifier" },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      execute: async (input: unknown) => {
        const params = input as { slug: string };
        const url = new URL("/api/trpc/blog.getBySlug", window.location.origin);
        url.searchParams.set("input", JSON.stringify({ json: { slug: params.slug } }));
        const res = await fetch(url.toString(), { credentials: "include" });
        return res.json();
      },
    },
    {
      name: "navigate_to",
      description: "導航至路邊電台網站的指定頁面",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "Page path: /, /blog, /booking, /services, /about, /contact, /podcasts" },
        },
        required: ["path"],
        additionalProperties: false,
      },
      execute: async (input: unknown) => {
        const params = input as { path: string };
        window.location.href = params.path;
        return { success: true, navigatedTo: params.path };
      },
    },
  ]);
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
