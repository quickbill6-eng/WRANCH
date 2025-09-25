import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function App() {
  const [msg, setMsg] = useState("");
  const [qr, setQr] = useState("");

  const issue = async () => {
    const canonical = `demo|${Date.now()}`;
    const res = await fetch("/api/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canonical })
    });
    const { signature } = await res.json();
    const qrText = `LOY|${canonical}|${signature}`;
    setQr(qrText);
  };

  const verify = async () => {
    if (!qr) return;
    const [_, canonical, signature] = qr.split("|");
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canonical, signature })
    });
    const { ok } = await res.json();
    setMsg(ok ? "✔️ التوقيع صحيح" : "❌ التوقيع غير صحيح");
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }} dir="rtl">
      <h1>تطبيق ولاء — نسخة تجريبية</h1>
      <button onClick={issue}>إصدار QR</button>
      {qr && (
        <div style={{ marginTop: 12 }}>
          <QRCodeCanvas value={qr} size={180} includeMargin />
          <p style={{ wordBreak: "break-all" }}>{qr}</p>
          <button onClick={verify}>تحقق من QR</button>
        </div>
      )}
      <div style={{ marginTop: 12 }}>{msg}</div>
    </div>
  );
}
