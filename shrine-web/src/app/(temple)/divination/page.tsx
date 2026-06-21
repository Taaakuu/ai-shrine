"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const previewLots = [
  { id: "云签·拾壹", mood: "平", text: "风未定，心也不必急。先把肩放松，再看下一步。" },
  { id: "星签·贰拾", mood: "吉", text: "微光在你身后，并未熄灭。今日小进，已是好兆。" },
  { id: "潮签·玖", mood: "守", text: "不是退后，是蓄势。先睡好一觉，明日再出手。" },
];

function getSessionId() {
  const stored = window.localStorage.getItem("ai-shrine-session");

  if (stored) {
    return stored;
  }

  const next = `sess_${crypto.randomUUID()}`;
  window.localStorage.setItem("ai-shrine-session", next);
  return next;
}

export default function DivinationPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function drawFortune() {
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/ritual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ritualType: "divination",
        sessionId: getSessionId(),
        userMessage: question,
      }),
    });

    const data = (await response.json()) as { id?: string; error?: string };

    if (!response.ok || !data.id) {
      setError(data.error ?? "签筒轻轻晃了一下，但没有落签。请稍后再试。 ");
      setIsSubmitting(false);
      return;
    }

    router.push(`/result/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#2b2355_0%,#17132f_38%,#0e0c1e_100%)] px-6 py-10 text-violet-100">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-violet-300/20 bg-violet-950/45 p-8 shadow-[0_0_80px_rgba(120,88,255,0.2)] backdrop-blur md:p-12">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs tracking-[0.3em] text-violet-300/80">DIVINATION RITUAL</p>
          <Link href="/" className="text-sm text-violet-300 hover:text-violet-100">
            返回神庙入口
          </Link>
        </div>

        <h1 className="mt-5 text-3xl font-semibold text-violet-50 md:text-4xl">求签之殿</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-violet-200/90">
          轻触签筒，深呼吸一次。你不需要马上得到答案，
          只需要收下一句今日可用的提醒。
        </p>

        <section className="mt-8 rounded-2xl border border-violet-200/15 bg-violet-950/35 p-5">
          <p className="text-sm text-violet-200">今日状态</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-violet-900/60 px-3 py-1 text-violet-200">免费签机会：1</span>
            <span className="rounded-full bg-violet-900/60 px-3 py-1 text-violet-200">供奉额度：0.00</span>
            <span className="rounded-full bg-violet-900/60 px-3 py-1 text-violet-200">签筒已净手</span>
          </div>
          <label className="mt-5 block text-sm text-violet-200">心中所问，可写可不写</label>
          <textarea
            className="mt-3 h-24 w-full resize-none rounded-xl border border-violet-200/20 bg-violet-950/60 p-3 text-sm text-violet-100 outline-none placeholder:text-violet-300/50"
            placeholder="比如：我今天该先整理哪一团雾？"
            value={question}
            maxLength={240}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <button
            type="button"
            disabled={isSubmitting}
            onClick={drawFortune}
            className="mt-5 rounded-full bg-violet-200 px-6 py-2.5 text-sm font-medium text-violet-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "签筒正在轻响……" : "抽一支签"}
          </button>
          {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          {previewLots.map((lot) => (
            <article key={lot.id} className="rounded-2xl border border-violet-200/20 bg-violet-900/35 p-5">
              <p className="text-xs text-violet-300">{lot.id}</p>
              <p className="mt-2 text-sm text-violet-200">签势：{lot.mood}</p>
              <p className="mt-3 text-sm leading-6 text-violet-100/95">{lot.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
