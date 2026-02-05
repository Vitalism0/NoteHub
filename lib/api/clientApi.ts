import { type Note, type CreateNote } from "@/types/note";
import { api } from "./api";
import type { User } from "@/types/user";

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

export type FetchNotesResult = { notes: Note[]; totalPages: number } | Note[];

export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get<FetchNotesResult>("/notes", { params });

  if (Array.isArray(data)) {
    return { notes: data, totalPages: 1 };
  }

  return data;
}

export const createNote = async (payload: CreateNote): Promise<Note> => {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
};
export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};
export async function fetchNoteById(id: Note["id"]) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}
// Auth
export async function register(payload: { email: string; password: string }) {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

// Users
export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: { username: string }) {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
