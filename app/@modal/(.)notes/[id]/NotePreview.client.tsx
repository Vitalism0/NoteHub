"use client";

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/api";
import NoteDetails from "@/components/NoteDetails/NoteDetails";
import type { Note } from "@/types/note";

export default function NoteModalClient({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load note</p>}
      {data && <NoteDetails note={data} />}
    </Modal>
  );
}
