"use client";
import css from "@/components/NotesPage/NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "@/lib/api/clientApi";
import { useDebounce } from "use-debounce";

import Link from "next/link";

export default function NotesClientPage({ tag }: { tag?: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);

  const [debouncedQuery] = useDebounce(query, 1000);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedQuery, page, perPage, tag ?? "all"],
    queryFn: () => fetchNotes({ search: debouncedQuery, page, perPage, tag }),
    placeholderData: keepPreviousData,
  });
  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={query} onChange={handleSearchChange} />
        {isSuccess && data?.totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={data?.totalPages}
            onPageChange={setPage}
          />
        ) : null}

        <Link className={css.button} href={"/notes/action/create"}>
          Create note +
        </Link>
      </header>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Erroro</p>}

      {isSuccess && (
        <>
          {data.notes.length ? (
            <NoteList notes={data.notes} />
          ) : (
            <p>
              No notes with this tag: <strong>{tag}</strong>.
            </p>
          )}
        </>
      )}
    </div>
  );
}
