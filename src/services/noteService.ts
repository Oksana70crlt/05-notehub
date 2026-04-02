import axios from "axios";
import type { Note, NoteTag } from "../types/note";

//створюємо окремий екземпляр axios з базовим URL та заголовком авторизації
const notehubApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

//типи для параметрів запиту та відповіді
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

//інтерфейс уже нормалізованої відповіді, з якою буде працювати React-код
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

//тип для даних, які потрібно відправити при створенні нової нотатки
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  //формуємо параметри запиту, додаючи search тільки якщо він не порожній
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search && search.trim() !== "") {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  //відправляємо GET-запит до API та отримуємо дані
  const { data } = await notehubApi.get<FetchNotesResponse>("/notes", {
    params,
  });

  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await notehubApi.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await notehubApi.delete<Note>(`/notes/${noteId}`);
  return data;
}
