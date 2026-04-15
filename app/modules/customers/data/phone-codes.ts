export const PHONE_CODES = [
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
] as const

export type PhoneCode = (typeof PHONE_CODES)[number]["code"]
