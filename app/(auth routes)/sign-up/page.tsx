"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import css from "@/components/SignUpPage/SignUpPage.module.css";
import { register } from "@/lib/api/clientApi";

export default function SignUpPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      setIsPending(true);

      await register({ email, password });

      router.push("/profile");
    } catch (error) {
      setError("Registration failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={handleSubmit}>
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
            {isPending ? "Registering..." : "Register"}
          </button>
        </div>

        {error ? <p className={css.error}>{error}</p> : null}
      </form>
    </main>
  );
}
