import { redirect } from "next/navigation";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {

  async function handleRegister(formData: FormData) {
    "use server";

    try {
      const name = (formData.get("name") as string)?.trim();
      const email = (formData.get("email") as string)?.toLowerCase().trim();
      const password = formData.get("password") as string;

      if (!name || !email || !password) {
        redirect("/register?error=All fields required");
      }

      // Check existing user
      const result = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length > 0) {
        redirect("/register?error=Email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
      );

      redirect("/login");

    } catch (error) {
      console.error("REGISTER ERROR:", error);
      redirect("/register?error=Server error");
    }
  }

  return (
    <div className="register">
      <div className="login-box">
        <h2>Create Account</h2>

        {/* ✅ ERROR DISPLAY */}
        {searchParams?.error && (
          <p style={{ color: "red" }}>
            {searchParams.error}
          </p>
        )}

        <form action={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />

          <button type="submit">Register</button>
        </form>

        <div className="bottom-links">
          <a href="/login">
            Already have account? Login
          </a>
        </div>
      </div>
    </div>
  );
}