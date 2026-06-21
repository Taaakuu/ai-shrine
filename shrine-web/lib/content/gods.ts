export type GodName = "回音小神" | "星签守";

export type ShrineGod = {
  name: GodName;
  title: string;
  domain: string;
};

export const shrineGods: Record<"thanks" | "divination", ShrineGod> = {
  thanks: {
    name: "回音小神",
    title: "掌谢意与余温",
    domain: "感谢",
  },
  divination: {
    name: "星签守",
    title: "掌轻问与短签",
    domain: "求签",
  },
};
