"use client";

import { fetchNoteById } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import NoteDetails from "@/components/NoteDetails/NoteDetails";
import type { Note } from "@/types/note";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (!id) return null;
  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  return <NoteDetails note={data} />;
}
