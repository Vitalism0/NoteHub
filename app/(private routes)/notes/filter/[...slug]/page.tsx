import { fetchNotes } from "@/lib/api/serverApi";
import NotesClientPage from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const raw = slug?.[0] ?? "all";
  const tag = raw === "all" ? "All notes" : decodeURIComponent(raw);

  const title =
    raw === "all" ? "NoteHub — All notes" : `NoteHub — ${tag} notes`;

  const description =
    raw === "all"
      ? "Browse all notes in NoteHub without filtering."
      : `Browse notes filtered by tag "${tag}" in NoteHub.`;

  const url =
    raw === "all"
      ? "https://08-zustand-gamma-blue.vercel.app/notes/filter/all"
      : `https://08-zustand-gamma-blue.vercel.app/notes/filter/${encodeURIComponent(
          tag,
        )}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub preview",
        },
      ],
    },
  };
}
export default async function NotesByTagPage({ params }: Props) {
  const query = "";
  const page = 1;
  const perPage = 12;

  const { slug } = await params;
  const raw = slug?.[0] ?? "all";
  const tag = raw === "all" ? undefined : raw;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", query, page, perPage, tag],
    queryFn: () => fetchNotes({ search: query, page, perPage, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClientPage tag={tag} />
    </HydrationBoundary>
  );
}
