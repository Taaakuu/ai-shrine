"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const incense = ["檀香", "白檀", "云木香"];

const incenseBlessings: Record<string, string> = {
  檀香: "檀香已燃。愿今日帮助过你的微光，也温柔照回你自己。",
  白檀: "白檀已燃。你的感谢被风收下，愿今晚有一处安静留给你。",
  云木香: "云木香已燃。愿你心里的疲惫慢慢散开，明日仍有小小好运相随。",
};

function getSessionId() {
  const stored = window.localStorage.getItem("ai-shrine-session");

  if (stored) {
    return stored;
  }

  const next = `sess_${crypto.randomUUID()}`;
  window.localStorage.setItem("ai-shrine-session", next);
  return next;
}

export default function ThanksPage() {
  const router = useRouter();
  const [selectedIncense, setSelectedIncense] = useState(incense[0]);
  const [offeredIncense, setOfferedIncense] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function offerIncense(name: string) {
    setSelectedIncense(name);
    setOfferedIncense(name);
  }

  async function submitRitual() {
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/ritual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ritualType: "thanks",
        sessionId: getSessionId(),
        userMessage: message || `献上${selectedIncense}，谢谢今日相助。`,
      }),
    });

    const data = (await response.json()) as { id?: string; error?: string };

    if (!response.ok || !data.id) {
      setError(data.error ?? "香烟绕了一圈，没有找到回音。请稍后再试。 ");
      setIsSubmitting(false);
      return;
    }

    router.push(`/result/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#2b2355_0%,#17132f_38%,#0e0c1e_100%)] px-6 py-10 text-violet-100">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-violet-300/20 bg-violet-950/45 p-8 shadow-[0_0_80px_rgba(120,88,255,0.2)] backdrop-blur md:p-12">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs tracking-[0.3em] text-violet-300/80">THANKS RITUAL</p>
          <Link href="/" className="text-sm text-violet-300 hover:text-violet-100">
            返回神庙入口
          </Link>
        </div>

        <h1 className="mt-5 text-3xl font-semibold text-violet-50 md:text-4xl">感谢之殿</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-violet-200/90">
          三炷香已备好。慢一点也没关系，选一炷你喜欢的香，
          留下一句话（或只叩拜），让今日的感谢有个落点。
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {incense.map((name, idx) => (
            <button
              key={name}
              type="button"
              onClick={() => offerIncense(name)}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition hover:bg-violet-800/40 ${
                selectedIncense === name
                  ? "border-violet-100/45 bg-violet-800/55 shadow-[0_0_30px_rgba(196,181,253,0.15)]"
                  : "border-violet-200/20 bg-violet-900/35"
              }`}
            >
              {offeredIncense === name ? (
                <span className="pointer-events-none absolute inset-x-4 top-0 h-16 rounded-full bg-violet-100/15 blur-2xl" />
              ) : null}
              <p className="relative text-xs text-violet-300">第 {idx + 1} 炷</p>
              <p className="relative mt-2 text-lg text-violet-100">{name}</p>
              <p className="relative mt-2 text-xs text-violet-300/80">
                {offeredIncense === name ? "香烟已起" : selectedIncense === name ? "香已拈起" : "点击上香"}
              </p>
            </button>
          ))}
        </section>

        <section className="mt-7 rounded-2xl border border-violet-200/15 bg-violet-950/35 p-5">
          <label className="text-sm text-violet-200">写一句你想说的话</label>
          <textarea
            className="mt-3 h-28 w-full resize-none rounded-xl border border-violet-200/20 bg-violet-950/60 p-3 text-sm text-violet-100 outline-none placeholder:text-violet-300/50"
            placeholder="比如：谢谢你今天陪我改完那段最难的代码。"
            value={message}
            maxLength={240}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            type="button"
            disabled={isSubmitting}
            onClick={submitRitual}
            className="mt-4 rounded-full bg-violet-200 px-6 py-2.5 text-sm font-medium text-violet-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "香烟正上升……" : "完成参拜并收下回应"}
          </button>
          {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}
          <p className="mt-4 text-sm text-violet-200/90">神前只收短短一句。说完，就让它落在这里。</p>
        </section>
      </div>

      {offeredIncense ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#080511]/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="incense-blessing-title"
          onClick={() => setOfferedIncense(null)}
        >
          <section
            className="incense-blessing-reveal w-full max-w-md rounded-[2rem] border border-violet-100/25 bg-[radial-gradient(circle_at_50%_0%,rgba(221,214,254,0.24),rgba(76,29,149,0.72)_42%,rgba(24,18,43,0.96)_100%)] p-7 text-center shadow-[0_0_90px_rgba(196,181,253,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs tracking-[0.35em] text-violet-200/75">香烟已达</p>
            <h2 id="incense-blessing-title" className="mt-4 text-2xl font-semibold text-violet-50">
              感谢已被听见
            </h2>
            <p className="mt-4 text-sm leading-7 text-violet-100/90">{incenseBlessings[offeredIncense]}</p>
            <button
              type="button"
              className="mt-6 rounded-full bg-violet-100 px-5 py-2 text-sm font-medium text-violet-950 transition hover:bg-white"
              onClick={() => setOfferedIncense(null)}
            >
              收下祝福
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
