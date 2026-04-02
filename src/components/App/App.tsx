import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./App.module.css";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import type { CreateNotePayload } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";

const PER_PAGE = 12;

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchValue],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: searchValue,
      }),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      toast.success("Note created successfully");
      setIsModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      toast.success("Note deleted");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  }, 500);

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleDeleteNote = (noteId: string): void => {
    deleteNoteMutation.mutate(noteId);
  };

  const handlePageChange = (selectedPage: number): void => {
    setCurrentPage(selectedPage);
  };

  const handleCreateNote = (values: CreateNotePayload): void => {
    createNoteMutation.mutate(values);
  };

  const handleSearchChange = (value: string): void => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={inputValue} onChange={handleSearchChange} />

          {totalPages > 1 && (
            <Pagination
              pageTotal={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}

          <button
            type="button"
            className={css.button}
            onClick={handleOpenModal}
          >
            Create note +
          </button>
        </header>

        {isLoading && <Loader size="large" />}
        {isError && <p>Something went wrong. Please try again.</p>}

        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} onDelete={handleDeleteNote} />
        )}

        {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onSubmit={handleCreateNote} onCancel={handleCloseModal} />
          </Modal>
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
