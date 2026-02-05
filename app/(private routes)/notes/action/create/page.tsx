import css from "@/app/Home.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a new note | NoteHub",
  description: "Create a new note in NoteHub: add a title, content, and tag.",
  openGraph: {
    title: "NoteHub",
    description: "A simple app for creating, searching and organizing notes.",
    url: `https://08-zustand-gamma-blue.vercel.app/notes/action/create`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — Create note page preview",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
