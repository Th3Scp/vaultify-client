export const fonts = {
  ziba: "زیبا",
  parsa: "پارسا",
  nazanin: "نازنین",
  lalezar: "لاله زار",
  koodak: "کودک",
  khodkar: "خودکار",
  darvish: "درویش",
};
export const clockFonts = ["n1", "n2", "n3", "n4", "n5", "n6"];
export const colors = ["#A294F9", "#F14A00", "#4DA1A9", "#5CB338"];

export function faviconApi(website: string) {
  return `https://powerful-cyan-carp.faviconkit.com/${website}/256`;
}

export function avatarApi(seed:string){
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`
}
export function avatarGlassApi(seed:string){
  return `https://api.dicebear.com/9.x/glass/svg?seed=${seed}`
}