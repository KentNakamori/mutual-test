import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).end();
  const resp = await fetch(process.env.BACKEND_URL+"/companies",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(req.body)
  });
  return res.status(resp.status).json(await resp.json());
}
