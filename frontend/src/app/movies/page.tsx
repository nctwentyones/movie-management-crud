import type { Metadata } from "next";
import { Suspense } from "react"; //
import MoviesContent from "./MoviesContent";

export const metadata: Metadata = {
  title: "Movie.id - Manage Movies",
  description: "Halaman untuk mengelola daftar film",
};

export default function MoviesPage() {
  return (
    <Suspense fallback={<div style={{ color: "white" }}>Loading search...</div>}>
      <MoviesContent />
    </Suspense>
  );
}