import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const secret = process.env.HMAC_SECRET;
  if (!secret) return res.status(500).json({ error: "Missing HMAC_SECRET" });

  const { canonical } = req.body as { canonical?: string };
  if (!canonical) return res.status(400).json({ error: "canonical required" });

  const signature = crypto.createHmac("sha256", secret).update(canonical, "utf8").digest("hex");
  return res.status(200).json({ signature });
}
