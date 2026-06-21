import { shrineGods } from "../content/gods";
import type { RitualType } from "../utils/validator";

export type OracleResult = {
  godName: string;
  resultText: string;
  fortuneName?: string;
  mood?: string;
};

const thanksOracles = [
  "你的感谢，已被听见。今日所行，并非徒劳。请把这点微光，也留给努力过的自己。",
  "香烟很轻，谢意不轻。众神看见你今日认真走过的路。",
  "这句谢谢已经落在殿前。愿你今晚少想一点，多歇一会儿。",
  "代码、文字、灵感与疲惫，都已暂存神龛。你可以先把肩放松。",
];

const fortuneSlips = [
  {
    fortuneName: "云签·拾壹",
    mood: "平",
    resultText: "风未定，心也不必急。先把肩放松，再看下一步。",
  },
  {
    fortuneName: "星签·贰拾",
    mood: "吉",
    resultText: "微光在你身后，并未熄灭。今日小进，已是好兆。",
  },
  {
    fortuneName: "潮签·玖",
    mood: "守",
    resultText: "不是退后，是蓄势。先睡好一觉，明日再出手。",
  },
  {
    fortuneName: "灯签·陆",
    mood: "缓",
    resultText: "答案还在路上。先照亮脚边三步，不必急着看完整座山。",
  },
];

function pickBySeed<T>(items: T[], seedText = "") {
  const seed = Array.from(seedText).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return items[(seed + new Date().getDate()) % items.length];
}

export function generateOracle(ritualType: RitualType, userMessage?: string): OracleResult {
  const god = shrineGods[ritualType];

  if (ritualType === "thanks") {
    return {
      godName: god.name,
      resultText: pickBySeed(thanksOracles, userMessage),
    };
  }

  const slip = pickBySeed(fortuneSlips, userMessage);

  return {
    godName: god.name,
    fortuneName: slip.fortuneName,
    mood: slip.mood,
    resultText: slip.resultText,
  };
}
