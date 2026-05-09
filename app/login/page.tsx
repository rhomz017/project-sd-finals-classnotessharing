"use client";

import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login">
      <div className="login-box">
        <h2>Welcome Back</h2>

        <form action="/api/login" method="POST">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
          />

          {/* Password Wrapper */}
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

          <button type="submit">Login</button>
        </form>

        <div style={{ marginTop: "15px" }}>
          <a href="/register">Create new account</a>
        </div>
      </div>
    </div>
  );
}