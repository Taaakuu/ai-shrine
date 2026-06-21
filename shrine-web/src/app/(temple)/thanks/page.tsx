"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const incense = ["檀香", "白檀", "云木香"];

function getSessionId() {
  const stored = window.localStorage.getItem("ai-shrine-session");

  if (stored) {
    return stored;
  }

  const next = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem("ai-shrine-session", next);
  return next;
}

export default function ThanksPage() {
  const router = useRouter();
  const [selectedIncense, setSelectedIncense] = useState(incense[0]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
              onClick={() => setSelectedIncense(name)}
              className={`rounded-2xl border p-5 text-left transition hover:bg-violet-800/40 ${
                selectedIncense === name
                  ? "border-violet-100/45 bg-violet-800/55 shadow-[0_0_30px_rgba(196,181,253,0.15)]"
                  : "border-violet-200/20 bg-violet-900/35"
              }`}
            >
              <p className="text-xs text-violet-300">第 {idx + 1} 炷</p>
              <p className="mt-2 text-lg text-violet-100">{name}</p>
              <p className="mt-2 text-xs text-violet-300/80">
                {selectedIncense === name ? "香已拈起" : "点击上香"}
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
    </main>
  );
}
