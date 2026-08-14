import React, { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Heart, LockKeyhole, PenLine, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import {
  TREEHOLE_MAX_CHARACTERS,
  TREEHOLE_MIN_CHARACTERS,
  isValidTreeholeStory,
  normaliseTreeholeStory,
} from "@shared/treehole";

type SubmissionCategory = "relationship" | "confession" | "question" | "other";

const CATEGORIES: Array<{ value: SubmissionCategory; label: string }> = [
  { value: "relationship", label: "感情關係" },
  { value: "confession", label: "心底話" },
  { value: "question", label: "想問嘅問題" },
  { value: "other", label: "其他" },
];

export default function TreeholeSubmission() {
  const [story, setStory] = useState("");
  const [category, setCategory] = useState<SubmissionCategory>("relationship");
  const [understoodPrivacy, setUnderstoodPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const reduceMotion = useReducedMotion();

  useSEO({
    title: "感情樹窿匿名投稿｜路邊電台",
    description: "匿名講出你嘅感情故事、心底話或關係困局。路邊電台會先審核內容，再以不識別身份方式分享。",
    keywords: "感情樹窿,匿名投稿,香港感情故事,兩性關係",
    canonical: "https://6bpodcasts.com/treehole",
  });

  const submitMutation = trpc.submission.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setStory("");
      setCategory("relationship");
      setUnderstoodPrivacy(false);
      setFormError("");
    },
    onError: () => {
      setFormError("而家未能送出投稿，請稍後再試一次。你的文字仍然留喺呢個頁面。 ");
    },
  });

  const charactersRemaining = TREEHOLE_MAX_CHARACTERS - story.length;
  const isReady = isValidTreeholeStory(story) && understoodPrivacy && !submitMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidTreeholeStory(story)) {
      setFormError(`請寫最少 ${TREEHOLE_MIN_CHARACTERS} 個字，最多 ${TREEHOLE_MAX_CHARACTERS} 個字。`);
      return;
    }
    if (!understoodPrivacy) {
      setFormError("請先確認你冇喺故事入面留下可識別個人資料。 ");
      return;
    }
    setFormError("");
    submitMutation.mutate({
      nickname: "匿名",
      category,
      content: story.trim(),
      isAnonymous: true,
      imageUrls: [],
    });
  }

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)" }}>
      <section className="container max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-3)" }}
        >
          <ChevronLeft size={16} /> 返回首頁
        </Link>

        <div className="mt-10 grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <header className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em]" style={{ color: "var(--gold)" }}>
              <Heart size={14} fill="currentColor" /> 感情樹窿
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>
              有啲說話，
              <br />
              可以喺呢度講。
            </h1>
            <p className="mt-5 max-w-md text-base leading-8" style={{ color: "var(--text-2)" }}>
              呢度唔使留名，唔使解釋你係邊個。你可以匿名寫低一段關係、一句未講出口嘅心底話，或者一個想有人回應嘅問題。
            </p>
            <div className="mt-7 border-t pt-5" style={{ borderColor: "var(--line)" }}>
              <div className="flex gap-3">
                <LockKeyhole size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                <p className="text-sm leading-6" style={{ color: "var(--text-3)" }}>
                  唔會要求你提供姓名、電話或電郵。請自行刪走人物真名、住址、公司名同其他可識別資料。
                </p>
              </div>
            </div>
          </header>

          <div className="relative overflow-hidden rounded-2xl p-5 md:p-7" style={{ background: "var(--bg-raise)", border: "1px solid var(--line)" }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold-dim), transparent)" }} />
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.section
                  key="success"
                  initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative py-8 text-center"
                  aria-live="polite"
                  data-testid="treehole-success"
                >
                  <motion.div
                    initial={reduceMotion ? false : { scale: 0.85, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 13, delay: reduceMotion ? 0 : 0.08 }}
                  >
                    <CheckCircle2 size={54} className="mx-auto" style={{ color: "var(--gold)" }} />
                  </motion.div>
                  <h2 className="mt-5 text-2xl font-bold" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>
                    你嘅故事已經收好。
                  </h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-7" style={{ color: "var(--text-3)" }}>
                    多謝你信任我哋。投稿會先經審核；如獲選討論，會以不識別身份方式處理。
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform active:scale-[0.98]"
                    style={{ background: "var(--gold)", color: "var(--bg)" }}
                  >
                    <PenLine size={15} /> 再寫一個故事
                  </button>
                </motion.section>
              ) : (
                <motion.form
                  key="form"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="relative space-y-6"
                  noValidate
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold" style={{ color: "var(--text)" }}>呢個故事關於</label>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="投稿類別">
                      {CATEGORIES.map((item) => {
                        const active = category === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setCategory(item.value)}
                            aria-pressed={active}
                            className="rounded-full px-3 py-2 text-sm transition-all active:scale-[0.98]"
                            style={{
                              background: active ? "rgba(201,164,92,0.16)" : "var(--bg-card)",
                              border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`,
                              color: active ? "var(--gold)" : "var(--text-2)",
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <label htmlFor="treehole-story" className="block text-sm font-bold" style={{ color: "var(--text)" }}>想講嘅故事</label>
                      <span className="text-xs" role="status" aria-live="polite" style={{ color: charactersRemaining < 80 ? "var(--gold)" : "var(--text-3)" }}>
                        尚餘 {charactersRemaining} 字
                      </span>
                    </div>
                    <textarea
                      id="treehole-story"
                      value={story}
                      onChange={(event) => setStory(normaliseTreeholeStory(event.target.value))}
                      minLength={TREEHOLE_MIN_CHARACTERS}
                      maxLength={TREEHOLE_MAX_CHARACTERS}
                      rows={9}
                      required
                      placeholder="由你最想講嘅一句開始。唔使寫得完美，亦唔使交代真名。"
                      className="w-full resize-y rounded-xl px-4 py-3 text-base leading-7 outline-none transition-colors focus:ring-2"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)", minHeight: "13rem" }}
                      aria-describedby="treehole-helper treehole-error"
                    />
                    <p id="treehole-helper" className="mt-2 text-xs leading-5" style={{ color: "var(--text-3)" }}>
                      最少 {TREEHOLE_MIN_CHARACTERS} 字，最多 {TREEHOLE_MAX_CHARACTERS} 字。請唔好留下可識別個人資料。
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
                    <input
                      type="checkbox"
                      checked={understoodPrivacy}
                      onChange={(event) => setUnderstoodPrivacy(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-[var(--gold)]"
                    />
                    <span className="text-sm leading-6" style={{ color: "var(--text-2)" }}>
                      我明白投稿會以匿名方式審核，並已移除姓名、電話、住址、公司或其他可識別資料。
                    </span>
                  </label>

                  {formError && <p id="treehole-error" className="text-sm" role="alert" style={{ color: "var(--red-bright)" }}>{formError}</p>}

                  <button
                    type="submit"
                    disabled={!isReady}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
                    style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}
                  >
                    {submitMutation.isPending ? "送緊去樹窿…" : <><Send size={16} /> 匿名送出故事</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
