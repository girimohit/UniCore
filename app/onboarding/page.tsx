"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitCode() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Join your institute</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Institute Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={submitCode} disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? "Verifying..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
