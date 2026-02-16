import type { Metadata } from "next";
import MoviesContent from "./MoviesContent";

export const metadata: Metadata = {
  title: "Movie.id - Manage Movies",
  description: "Halaman untuk mengelola daftar film",
};

export default function MoviesPage() {
  return <MoviesContent />;
}