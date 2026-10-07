import { StateCreator } from "zustand";
import {
  fetchBooks,
  insertBook,
  updateBook as updateBookDb,
  deleteBook,
} from "@/lib/supabase/db";

export interface Book {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  coverColor: string; // hex, used for card accent
  status: "reading" | "completed" | "paused";
  addedAt: string;
  reminderAt?: string; // ISO timestamp
}

export interface BookFormData {
  title: string;
  author: string;
  totalPages: number;
  coverColor: string;
  reminderAt?: string;
}

export interface BooksSlice {
  books: Book[];
  booksLoaded: boolean;
  loadBooks: () => Promise<void>;
  addBook: (data: BookFormData) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
  setBooks: (books: Book[]) => void; // kept for back-compat
}

// ─── Derived stats ────────────────────────────────────────────────────────────

export function deriveBooksStats(books: Book[]) {
  const total = books.length;
  const completed = books.filter((b) => b.status === "completed").length;
  const reading = books.filter((b) => b.status === "reading").length;
  const totalPagesRead = books.reduce((sum, b) => sum + b.currentPage, 0);
  const totalPages = books.reduce((sum, b) => sum + b.totalPages, 0);
  const overallProgress =
    totalPages === 0 ? 0 : Math.round((totalPagesRead / totalPages) * 100);

  return {
    total,
    completed,
    reading,
    totalPagesRead,
    totalPages,
    overallProgress,
  };
}

export function bookProgress(book: Book): number {
  return book.totalPages === 0
    ? 0
    : Math.round((book.currentPage / book.totalPages) * 100);
}

function generateBookId(): string {
  return (
    "book_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
  );
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export const createBooksSlice: StateCreator<BooksSlice, [], [], BooksSlice> = (
  set,
  get,
) => ({
  books: [],
  booksLoaded: false,

  setBooks: (books: Book[]) => set({ books }),

  loadBooks: async () => {
    const state = get() as any;
    if (state.booksLoaded) return;
    // Guest mode: no fetch needed
    if (!state.userId) {
      set({ booksLoaded: true } as any);
      return;
    }
    const cloudBooks = await fetchBooks();
    const localBooks = (get() as any).books as Book[];
    const mergedBooks = [
      ...localBooks.filter((b) => !cloudBooks.some((c) => c.id === b.id)),
      ...cloudBooks,
    ];
    set({ books: mergedBooks, booksLoaded: true } as any);
  },

  addBook: async (data: BookFormData) => {
    const newBook: Book = {
      id: generateBookId(),
      title: data.title,
      author: data.author,
      currentPage: 0,
      totalPages: data.totalPages,
      coverColor: data.coverColor,
      status: "reading",
      addedAt: new Date().toISOString(),
      reminderAt: data.reminderAt,
    };
    set((state) => ({ books: [...state.books, newBook] }));
    try {
      await insertBook(newBook);
    } catch {
      (get() as any).addOfflineMutation?.("insertBook", [newBook]);
    }
  },

  updateBook: async (id: string, updates: Partial<Book>) => {
    let updatedBook: Book | undefined;
    set((state) => ({
      books: state.books.map((b) => {
        if (b.id !== id) return b;
        updatedBook = { ...b, ...updates };
        // Auto-mark as completed when currentPage reaches totalPages
        if (
          updatedBook.currentPage >= updatedBook.totalPages &&
          updatedBook.totalPages > 0
        ) {
          updatedBook.status = "completed";
          updatedBook.currentPage = updatedBook.totalPages;
        }
        return updatedBook;
      }),
    }));
    if (updatedBook) {
      try {
        await updateBookDb(id, updates);
      } catch {
        (get() as any).addOfflineMutation?.("updateBook", [id, updates]);
      }
    }
  },

  removeBook: async (id: string) => {
    set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
    try {
      await deleteBook(id);
    } catch {
      (get() as any).addOfflineMutation?.("deleteBook", [id]);
    }
  },
});
