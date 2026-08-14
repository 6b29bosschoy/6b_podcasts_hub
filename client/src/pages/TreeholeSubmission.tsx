import React, { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Heart, LockKeyhole, PenLine, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";
import { useSEO } from "@/hooks/useSEO";
import {
  TREEHOLE_DEEP_INTERPRETATIONS,
  TREEHOLE_MAX_CHARACTERS,
  TREEHOLE_MIN_CHARACTERS,
  TREEHOLE_PUBLIC_PERMISSIONS,
  TREEHOLE_TOPIC_TAGS,
  normaliseTreeholeStory,
  requiresTreeholeContact,
} from "@shared/treehole";

const RELATIONSHIP_STATUSES = ["單身", "曖昧中", "拍拖中", "已婚", "分手中", "複雜"] as const;
const GENDERS = ["男", "女", "唔想講"] as const;
const AGE_GROUPS = ["18-24", "25-30", "31-40", "41-50", "50+"] as const;
const PROBLEM_DURATIONS = ["一個月內", "半年內", "一年以上", "好多年"] as const;

export default function TreeholeSubmission() {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [topicTags, setTopicTags] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [problemDuration, setProblemDuration] = useState("");
  const [publicPermission, setPublicPermission] = useState("");
  const [deepInterpretation, setDeepInterpretation] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const reduceMotion = useReducedMotion();

  useSEO({
    title: "路邊感情樹窿｜匿名投稿",
    description: "匿名分享你嘅感情問題，路邊Podcasts 會以不識別身份方式解讀與整理觀眾故事。",
    keywords: "感情樹窿,匿名投稿,香港感情故事,兩性關係",
    canonical: "https://6bpodcasts.com/treehole",
  });

  const submitMutation = trpc.submission.submitTreehole.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      trackEvent("treehole_submit", { source: "treehole_form" });
      setNickname("");
      setGender("");
      setAgeGroup("");
      setRelationshipStatus("");
      setTopicTags([]);
      setStory("");
      setProblemDuration("");
      setPublicPermission("");
      setDeepInterpretation("");
      setContactMethod("");
      setFormError("");
    },
    onError: () => setFormError("而家未能投入樹窿，請稍後再試一次。你填寫嘅內容仍然留喺呢個頁面。"),
  });

  const charactersRemaining = TREEHOLE_MAX_CHARACTERS - story.length;
  const contactRequired = requiresTreeholeContact(publicPermission, deepInterpretation);
  const isStoryValid = story.trim().length >= TREEHOLE_MIN_CHARACTERS && story.length <= TREEHOLE_MAX_CHARACTERS;
  const isReady = Boolean(
    nickname.trim()
    && relationshipStatus
    && topicTags.length > 0
    && isStoryValid
    && publicPermission
    && deepInterpretation
    && (!contactRequired || contactMethod.trim())
    && !submitMutation.isPending,
  );

  function toggleTopic(tag: string) {
    setTopicTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nickname.trim()) return setFormError("請留下一個花名，方便我哋稱呼你。");
    if (!relationshipStatus) return setFormError("請選擇你而家嘅感情狀態。");
    if (topicTags.length === 0) return setFormError("請最少揀一個問題類別。");
    if (!isStoryValid) return setFormError(`請寫最少 ${TREEHOLE_MIN_CHARACTERS} 個字，最多 ${TREEHOLE_MAX_CHARACTERS} 個字。`);
    if (!publicPermission) return setFormError("請選擇可唔可以喺節目入面匿名讀出。");
    if (!deepInterpretation) return setFormError("請選擇你想唔想有人同你深入解讀問題。");
    if (contactRequired && !contactMethod.trim()) return setFormError("因應你嘅選擇，請留下可聯絡你嘅方式。");

    setFormError("");
    submitMutation.mutate({
      nickname: nickname.trim(),
      content: story.trim(),
      gender: gender ? gender as (typeof GENDERS)[number] : undefined,
      ageGroup: ageGroup ? ageGroup as (typeof AGE_GROUPS)[number] : undefined,
      relationshipStatus: relationshipStatus as (typeof RELATIONSHIP_STATUSES)[number],
      topicTags: topicTags as Array<(typeof TREEHOLE_TOPIC_TAGS)[number]>,
      problemDuration: problemDuration ? problemDuration as (typeof PROBLEM_DURATIONS)[number] : undefined,
      publicPermission: publicPermission as (typeof TREEHOLE_PUBLIC_PERMISSIONS)[number],
      deepInterpretation: deepInterpretation as (typeof TREEHOLE_DEEP_INTERPRETATIONS)[number],
      contactMethod: contactRequired ? contactMethod.trim() : undefined,
    });
  }

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--bg)" }}>
      <section className="container max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-3)" }}>
          <ChevronLeft size={16} /> 返回首頁
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <header className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em]" style={{ color: "var(--gold)" }}>
              <Heart size={14} fill="currentColor" /> 感情樹窿
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>
              路邊感情樹窿
              <br />
              匿名投稿
            </h1>
            <p className="mt-5 max-w-md text-base leading-8" style={{ color: "var(--text-2)" }}>
              歡迎來到感情樹窿，請放心分享你嘅心事。<br />
              我哋會為你匿名解讀，療癒你嘅心靈。
            </p>
            <div className="mt-7 border-t pt-5" style={{ borderColor: "var(--line)" }}>
              <div className="flex gap-3">
                <LockKeyhole size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                <p className="text-sm leading-6" style={{ color: "var(--text-3)" }}>
                  請用花名代替真名，亦唔好留下電話、住址、公司名或其他可識別資料。你只需講你想講嘅部分。
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
                  className="relative py-10 text-center"
                  aria-live="polite"
                  data-testid="treehole-success"
                >
                  <motion.div initial={reduceMotion ? false : { scale: 0.85, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 13, delay: reduceMotion ? 0 : 0.08 }}>
                    <CheckCircle2 size={58} className="mx-auto" style={{ color: "var(--gold)" }} />
                  </motion.div>
                  <h2 className="mt-5 text-2xl font-bold" style={{ color: "var(--text)", fontFamily: "'Noto Serif TC', serif" }}>你嘅心事已經投入樹窿。</h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-7" style={{ color: "var(--text-3)" }}>
                    多謝你信任我哋。投稿會以匿名方式整理；如果你揀咗可聯絡，我哋會按你嘅意願跟進。
                  </p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform active:scale-[0.98]" style={{ background: "var(--gold)", color: "var(--bg)" }}>
                    <PenLine size={15} /> 再投一個故事
                  </button>
                </motion.section>
              ) : (
                <motion.form key="form" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit} className="relative space-y-7" noValidate>
                  <FieldLabel htmlFor="treehole-nickname" required>你想我哋點稱呼你？</FieldLabel>
                  <input id="treehole-nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} required maxLength={50} placeholder="花名就得，例：觀塘K小姐" className="treehole-input" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField id="treehole-gender" label="性別（選填）" value={gender} onChange={setGender} options={GENDERS} placeholder="唔想講都得" />
                    <SelectField id="treehole-age" label="年齡層（選填）" value={ageGroup} onChange={setAgeGroup} options={AGE_GROUPS} placeholder="揀返大概範圍" />
                  </div>

                  <SelectField id="treehole-status" label="感情狀態" value={relationshipStatus} onChange={setRelationshipStatus} options={RELATIONSHIP_STATUSES} placeholder="請選擇" required />

                  <fieldset>
                    <legend className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>你想投稿嘅問題屬於邊類？ <span style={{ color: "var(--red-bright)" }}>*</span></legend>
                    <div className="flex flex-wrap gap-2" aria-describedby="treehole-topics-help">
                      {TREEHOLE_TOPIC_TAGS.map((tag) => {
                        const active = topicTags.includes(tag);
                        return <button key={tag} type="button" onClick={() => toggleTopic(tag)} aria-pressed={active} className="rounded-full px-3 py-2 text-sm transition-all active:scale-[0.98]" style={{ background: active ? "rgba(201,164,92,0.16)" : "var(--bg-card)", border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`, color: active ? "var(--gold)" : "var(--text-2)" }}>{tag}</button>;
                      })}
                    </div>
                    <p id="treehole-topics-help" className="mt-2 text-xs" style={{ color: "var(--text-3)" }}>可以揀多個，最少揀一個。</p>
                  </fieldset>

                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <FieldLabel htmlFor="treehole-story" required>你嘅感情問題</FieldLabel>
                      <span className="text-xs" role="status" aria-live="polite" style={{ color: charactersRemaining < 100 ? "var(--gold)" : "var(--text-3)" }}>尚餘 {charactersRemaining} 字</span>
                    </div>
                    <textarea id="treehole-story" value={story} onChange={(event) => setStory(normaliseTreeholeStory(event.target.value))} minLength={TREEHOLE_MIN_CHARACTERS} maxLength={TREEHOLE_MAX_CHARACTERS} rows={10} required placeholder="越詳細，解得越準。發生咗咩事、你而家最掙扎嘅係咩，慢慢講。" className="treehole-input min-h-56 resize-y leading-7" aria-describedby="treehole-story-help treehole-error" />
                    <p id="treehole-story-help" className="mt-2 text-xs leading-5" style={{ color: "var(--text-3)" }}>越詳細，解得越準。發生咗咩事、你而家最掙扎嘅係咩，慢慢講。最少 {TREEHOLE_MIN_CHARACTERS} 字。</p>
                  </div>

                  <SelectField id="treehole-duration" label="呢個問題困擾咗你幾耐？（選填）" value={problemDuration} onChange={setProblemDuration} options={PROBLEM_DURATIONS} placeholder="如果想講，可以揀" />

                  <RadioGroup label="接唔接受你嘅問題（匿名）喺節目入面讀出？" options={TREEHOLE_PUBLIC_PERMISSIONS} value={publicPermission} onChange={setPublicPermission} />
                  <RadioGroup label="如果有機會，你想唔想有人同你深入解讀問題？" options={TREEHOLE_DEEP_INTERPRETATIONS} value={deepInterpretation} onChange={setDeepInterpretation} />

                  <AnimatePresence initial={false}>
                    {contactRequired && (
                      <motion.div initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduceMotion ? undefined : { opacity: 0, height: 0 }} className="overflow-hidden">
                        <FieldLabel htmlFor="treehole-contact" required>你嘅聯絡方式</FieldLabel>
                        <input id="treehole-contact" value={contactMethod} onChange={(event) => setContactMethod(event.target.value)} required={contactRequired} maxLength={255} placeholder="IG / WhatsApp / Telegram 都得" className="treehole-input" />
                        <p className="mt-2 text-xs" style={{ color: "var(--text-3)" }}>只會按你選擇嘅用途聯絡你。</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {formError && <p id="treehole-error" className="text-sm" role="alert" style={{ color: "var(--red-bright)" }}>{formError}</p>}

                  <button type="submit" disabled={!isReady} className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45" style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", color: "white" }}>
                    {submitMutation.isPending ? "投入緊樹窿…" : <><Send size={16} /> 投入樹窿 🌳</>}
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

function FieldLabel({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold" style={{ color: "var(--text)" }}>{children} {required && <span style={{ color: "var(--red-bright)" }}>*</span>}</label>;
}

function SelectField({ id, label, value, onChange, options, placeholder, required }: { id: string; label: string; value: string; onChange: (value: string) => void; options: readonly string[]; placeholder: string; required?: boolean }) {
  return <div><FieldLabel htmlFor={id} required={required}>{label}</FieldLabel><select id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="treehole-input"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
}

function RadioGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset><legend className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>{label} <span style={{ color: "var(--red-bright)" }}>*</span></legend><div className="space-y-2">{options.map((option) => <label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors" style={{ background: value === option ? "rgba(201,164,92,0.10)" : "var(--bg-card)", border: `1px solid ${value === option ? "var(--gold)" : "var(--line)"}` }}><input type="radio" name={label} value={option} checked={value === option} onChange={() => onChange(option)} className="mt-1 accent-[var(--gold)]" /><span className="text-sm leading-6" style={{ color: "var(--text-2)" }}>{option}</span></label>)}</div></fieldset>;
}
