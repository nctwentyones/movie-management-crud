import type { Metadata } from "next";
import SeriesContent from "./SeriesContent";

export const metadata: Metadata = {
  title: "Movie.id - Manage Series",
  description: "Halaman untuk mengelola daftar series",
};

export default function SeriesPage() {
  return <SeriesContent />;
}