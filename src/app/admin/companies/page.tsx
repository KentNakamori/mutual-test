"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { fetcher } from "@/lib/fetcher";

const schema = z.object({
  companyName:z.string().min(1),
  industry:z.string(),
  logoUrl:z.string().url().optional(),
  securitiesCode:z.string().optional(),
  establishedDate:z.string().optional(),
  address:z.string(),
  ceo:z.string(),
  businessDescription:z.string(),
  capital:z.string().optional(),
  employeeCount:z.coerce.number().optional(),
  websiteUrl:z.string().url().optional(),
  contactEmail:z.string().email()
});
type Form = z.infer<typeof schema>;

export default function CompanyForm(){
  const {register,handleSubmit,formState:{errors}}=
        useForm<Form>({resolver:zodResolver(schema)});
  const [done,setDone]=useState(false);

  const onSubmit=async(data:Form)=>{
      await fetcher("/api/company-create",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      });
      setDone(true);
  };

  if(done) return <p>登録完了。招待メールを確認してください。</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("companyName")} placeholder="会社名"/>
      {/* ...必要な入力フィールドをすべて並べる（略） */}
      <button type="submit" className="btn-primary">登録</button>
      {Object.values(errors).map(e=><p key={e.message}>{e.message}</p>)}
    </form>
  );
}
