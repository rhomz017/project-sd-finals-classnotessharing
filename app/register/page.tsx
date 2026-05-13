"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="register">
      <div className="login-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" required />
          <input name="email" type="email" placeholder="Email" required />

          <div className="password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />

            <i
              className={`fa-solid ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="bottom-links">
          <a href="/login">Already have account? Login</a>
        </div>
      </div>
    </div>
  );
}