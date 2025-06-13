// src/lib/companySchema.ts
import { z } from "zod";

export const companySchema = z.object({
  companyName: z.string().min(1, "企業名は必須です"),
  industry: z.string().min(1, "業種は必須です"),
  securitiesCode: z.string().max(20).optional(),
  establishedDate: z.string().optional(), // YYYY-MM形式
  listingDate: z.string().optional(), // YYYY-MM-DD形式
  marketSegment: z.string().optional(), // 東証プライム、東証スタンダード等
  address: z.string().optional(),
  phone: z.string().optional(),
  ceo: z.string().optional(),
  businessDescription: z.string().optional(),
  capital: z.string().optional(), // 資本金（文字列として受け取り）
  employeeCount: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
    message: "有効な整数を入力してください"
  }),
  websiteUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "有効なURLを入力してください"
  }),
  contactEmail: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "有効なメールアドレスを入力してください"
  }),
  logoUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "有効なURLを入力してください"
  }),
});

export type CompanyInput = z.infer<typeof companySchema>;
