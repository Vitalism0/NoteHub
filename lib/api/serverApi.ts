import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const cookieHeader = () => cookies().toString();

export async function fetchNotes(params?: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}) {
  const { data } = await api.get<Note[]>("/notes", {
    params,
    headers: { Cookie: cookieHeader() },
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader() },
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookieHeader() },
  });
  return data;
}

export async function checkSession() {
  const { data } = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader() },
  });
  return data;
}
