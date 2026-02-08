// lib/api/clientApi.ts
import { api } from "./api";
import type { Note, CreateNote } from "@/types/note";
import type { User } from "@/types/user";

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

type NotesApiResponse = { notes: Note[]; totalPages: number } | Note[];

function normalizeNotesResponse(data: NotesApiResponse) {
  if (Array.isArray(data)) {
    return { notes: data, totalPages: 1 };
  }
  return data;
}

// Notes
export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get<NotesApiResponse>("/notes", { params });
  return normalizeNotesResponse(data);
}

export async function fetchNoteById(id: Note["id"]) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: CreateNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(noteId: Note["id"]): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
}

// Auth
export type AuthPayload = { email: string; password: string };

export async function register(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

// Users
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: { username: string }): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

/**
 * IMPORTANT:
 * GoIT api-files інколи повертають { success: boolean } з /auth/session,
 * а не User. Тому робимо функцію "стійку" до обох форматів.
 */
type SessionResponse = User | "" | null | undefined | { success: boolean };

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<SessionResponse>("/auth/session");

  if (!data) return null;
  if (typeof data === "string") return null;

  // варіант коли route.ts повертає { success: true/false }
  if ("success" in data) {
    if (!data.success) return null;
    // сесія валідна -> витягуємо реального користувача
    return await getMe();
  }

  // варіант коли route.ts повертає User
  return data as User;
}
