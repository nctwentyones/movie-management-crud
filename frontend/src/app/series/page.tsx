import type { Metadata } from "next";
import { Suspense } from "react"; //
import SeriesContent from "./SeriesContent";

export const metadata: Metadata = {
  title: "Movie.id - Manage Series",
  description: "Halaman untuk mengelola daftar series",
};

export default function SeriesPage() {
  return (
    <Suspense fallback={<div style={{ color: "white" }}>Loading search...</div>}>
      <SeriesContent />
    </Suspense>
  );
}