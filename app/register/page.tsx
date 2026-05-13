"use client";

import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" required />
        <input name="email" placeholder="Email" required />
        <input name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>

      <div className="bottom-links">
        <a href="/login">Already have account? Login</a>
      </div>
    </div>
  );
}