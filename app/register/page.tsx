import { redirect } from "next/navigation";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  async function handleRegister(formData: FormData) {
    "use server";

    try {
      const name = (formData.get("name") as string)?.trim();
      const email = (formData.get("email") as string)?.toLowerCase().trim();
      const password = formData.get("password") as string;

      if (!name || !email || !password) {
        redirect("/register?error=All fields required");
      }

      const result = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length > 0) {
        redirect("/register?error=Email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
      );

      redirect("/login");

    } catch (error) {
      console.error("REGISTER ERROR:", error);
      redirect("/register?error=Created Account Succesfully!");
    }
  }

  return (
    <div className="register">
      <div className="login-box">
        <h2>Create Account</h2>

        {params?.error && (
          <p style={{ color: "white" }}>{params.error}</p>
        )}

        <form action={handleRegister}>
          <input name="name" placeholder="Full Name" required />
          <input name="email" placeholder="Email" required />
          <input name="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>

        <div className="bottom-links">
          <a href="/login">Already have account? Login</a>
        </div>

      </div>
    </div>
  );
}