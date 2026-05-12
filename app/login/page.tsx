"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className="login">
      <div className="login-box">
        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
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

          <button type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "15px" }}>
          <a href="/register">Create new account</a>
        </div>
      </div>
    </div>
  );
}