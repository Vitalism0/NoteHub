"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import css from "@/components/SignInPage/SignInPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { login } from "@/lib/api/clientApi";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      setIsPending(true);

      const user = await login({ email, password });
      setUser(user);
      router.push("/profile");
    } catch {
      setError("Login failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
