import { StateCreator } from "zustand";

export interface Book {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  coverColor: string; // hex, used for card accent
  status: "reading" | "completed" | "paused";
  addedAt: number;
}

export interface BookFormData {
  title: string;
  author: string;
  totalPages: number;
  coverColor: string;
}

export interface BooksSlice {
  books: Book[];
  addBook: (data: BookFormData) => void;
  updateBook: (
    id: string,
    updates: Partial<Book>,
  ) => void;
  removeBook: (id: string) => void;
}

// Derived stats -- pure util, no store needed
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

export const createBooksSlice: StateCreator<BooksSlice, [], [], BooksSlice> = (
  set,
) => ({
  books: [],

  addBook: (data: BookFormData) => {
    const newBook: Book = {
      id: generateBookId(),
      title: data.title,
      author: data.author,
      currentPage: 0,
      totalPages: data.totalPages,
      coverColor: data.coverColor,
      status: "reading",
      addedAt: Date.now(),
    };
    set((state) => ({ books: [...state.books, newBook] }));
  },

  updateBook: (id, updates) => {
    set((state) => ({
      books: state.books.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, ...updates };
        // auto-mark as completed when currentPage reaches totalPages
        if (
          updated.currentPage >= updated.totalPages &&
          updated.totalPages > 0
        ) {
          updated.status = "completed";
          updated.currentPage = updated.totalPages;
        }
        return updated;
      }),
    }));
  },

  removeBook: (id) => {
    set((state) => ({ books: state.books.filter((b) => b.id !== id) }));
  },
});
