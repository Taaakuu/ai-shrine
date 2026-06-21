import Link from "next/link";
import { emptyResultCopy, boundaryCopy } from "../../../../../lib/content/copy";
import { getRitualResult } from "../../../../../lib/services/ritual";
import { formatShrineTime } from "../../../../../lib/utils/time";

type ResultPageProps = {
  params: Promise<{ id: string }>;
};

function parseStoredResult(eventType: string, resultText: string | null) {
  if (!resultText) {
    return {
      text: "神前回音很轻，暂时没有留下文字。",
    };
  }

  if (eventType === "divination") {
    const [fortuneName, mood, text] = resultText.split("｜");

    if (fortuneName && mood && text) {
      return { fortuneName, mood, text };
    }
  }

  return {
    text: resultText,
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const event = await getRitualResult(id);

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0e0c1e] px-6 text-violet-100">
        <section className="w-full max-w-xl rounded-[2rem] border border-violet-300/20 bg-violet-950/45 p-8 text-center shadow-[0_0_70px_rgba(120,88,255,0.2)]">
          <p className="text-xs tracking-[0.3em] text-violet-300/80">RESULT NOT FOUND</p>
          <h1 className="mt-5 text-3xl font-semibold text-violet-50">{emptyResultCopy.title}</h1>
          <p className="mt-4 text-sm leading-7 text-violet-200/90">{emptyResultCopy.body}</p>
          <Link href="/" className="mt-7 inline-flex rounded-full bg-violet-200 px-6 py-2.5 text-sm font-medium text-violet-950 hover:bg-white">
            回到神庙入口
          </Link>
        </section>
      </main>
    );
  }

  const result = parseStoredResult(event.eventType, event.resultText);
  const isDivination = event.eventType === "divination";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#2b2355_0%,#17132f_38%,#0e0c1e_100%)] px-6 py-10 text-violet-100">
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-violet-300/20 bg-violet-950/45 p-8 shadow-[0_0_80px_rgba(120,88,255,0.2)] backdrop-blur md:p-12">
        <p className="text-xs tracking-[0.3em] text-violet-300/80">{isDivination ? "FORTUNE RESULT" : "THANKS RESULT"}</p>
        <h1 className="mt-5 text-3xl font-semibold text-violet-50 md:text-4xl">
          {isDivination ? "今日之签已落下" : "神前回音已落下"}
        </h1>

        <div className="mt-8 rounded-[1.5rem] border border-violet-200/20 bg-black/20 p-6">
          <p className="text-sm text-violet-300">{event.godName ?? "殿中小神"}</p>
          {result.fortuneName ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-violet-900/70 px-3 py-1 text-violet-100">{result.fortuneName}</span>
              <span className="rounded-full bg-violet-900/70 px-3 py-1 text-violet-100">签势：{result.mood}</span>
            </div>
          ) : null}
          <p className="mt-5 text-xl leading-9 text-violet-50">{result.text}</p>
        </div>

        {event.userMessage ? (
          <div className="mt-5 rounded-2xl border border-violet-200/15 bg-violet-950/35 p-5">
            <p className="text-xs tracking-[0.25em] text-violet-300/80">你留在殿前的话</p>
            <p className="mt-3 text-sm leading-7 text-violet-100/90">{event.userMessage}</p>
          </div>
        ) : null}

        <p className="mt-6 text-xs text-violet-300/75">回音时间：{formatShrineTime(event.createdAt)}</p>
        <p className="mt-3 text-xs text-violet-300/65">{boundaryCopy}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-violet-200 px-6 py-2.5 text-sm font-medium text-violet-950 hover:bg-white">
            回到神庙入口
          </Link>
          <Link href={`/share/${event.id}`} className="rounded-full border border-violet-200/25 px-6 py-2.5 text-sm text-violet-100 hover:bg-violet-900/45">
            生成分享页
          </Link>
        </div>
      </section>
    </main>
  );
}
