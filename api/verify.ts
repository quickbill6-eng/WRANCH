import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const secret = process.env.HMAC_SECRET;
  if (!secret) return res.status(500).json({ error: "Missing HMAC_SECRET" });

  const { canonical, signature } = req.body as { canonical?: string; signature?: string };
  if (!canonical || !signature) return res.status(400).json({ error: "canonical & signature required" });

  const expected = crypto.createHmac("sha256", secret).update(canonical, "utf8").digest("hex");
  const ok = expected === signature;
  return res.status(200).json({ ok });
}
