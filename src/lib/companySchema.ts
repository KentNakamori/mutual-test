// src/lib/companySchema.ts
import { z } from "zod";

export const companySchema = z.object({
  companyName: z.string().min(1, "必須"),
  industry: z.string().optional(),
  logoUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "有効なURLを入力してください"
  }),
  securitiesCode: z.string().max(20).optional(),
  establishedDate: z.string().optional(),        // ISO yyyy-mm-dd
  address: z.string().optional(),
  ceo: z.string().optional(),
  businessDescription: z.string().optional(),
  capital: z.string().optional().refine((val) => !val || !isNaN(Number(val)), {
    message: "有効な数値を入力してください"
  }),
  employeeCount: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
    message: "有効な整数を入力してください"
  }),
  websiteUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "有効なURLを入力してください"
  }),
  contactEmail: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: "有効なメールアドレスを入力してください"
  }),
});
export type CompanyInput = z.infer<typeof companySchema>;
