export type Brand = {
  name: string;
  home: string;
  logo: { src: string; width: number; height: number };
  logoWhite: { src: string; width: number; height: number };
  whyLabel: string;
};

export const brands = {
  zentrades: {
    name: "ZenTrades",
    home: "/",
    logo: { src: "/images/logo-zt.png", width: 2340, height: 327 },
    logoWhite: { src: "/images/logo-zt-white.png", width: 2340, height: 327 },
    whyLabel: "Why ZenTrades",
  },
  zenhvac: {
    name: "ZenHVAC",
    home: "/zenhvac",
    logo: { src: "/images/logo-zh.png", width: 2044, height: 327 },
    logoWhite: { src: "/images/logo-zh-white.png", width: 2044, height: 327 },
    whyLabel: "Why ZenTrades",
  },
  zenplumbing: {
    name: "ZenPlumbing",
    home: "/zenplumbing",
    logo: { src: "/images/logo-zp.png", width: 3017, height: 327 },
    logoWhite: { src: "/images/logo-zp-white.png", width: 3017, height: 327 },
    whyLabel: "Why ZenTrades",
  },
  zenelectrical: {
    name: "ZenElectrical",
    home: "/zenelectrical",
    logo: { src: "/images/logo-zel.png", width: 3356, height: 327 },
    logoWhite: { src: "/images/logo-zel-white.png", width: 3356, height: 327 },
    whyLabel: "Why ZenElectrical",
  },
} satisfies Record<string, Brand>;
