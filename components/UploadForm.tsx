"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function UploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert("Server error");
      return;
    }

    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    // ✅ SAFE RESET (NO NULL ISSUES)
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <input name="subject" placeholder="Subject" />
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}