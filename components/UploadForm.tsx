"use client";

import { useRouter } from "next/navigation";

export default function UploadForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget; 
    const formData = new FormData(form);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    form.reset();
    router.refresh();  
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Enter Title" required />
      <input type="text" name="subject" placeholder="Enter Subject" />
      <input type="file" name="file" required />
      <button type="submit">Upload Notes</button>
    </form>
  );
}
