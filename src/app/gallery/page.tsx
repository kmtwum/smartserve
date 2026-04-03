import { fetchGalleryImages } from "./actions";
import GalleryClient from "./GalleryClient";

import type { ListBlobResult } from "@vercel/blob";

export const metadata = {
  title: "Gallery | smart.serve",
  description: "View our recent professional home appliance and device installations.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let initialData: ListBlobResult = { 
    blobs: [], 
    hasMore: false,
  };
  try {
    initialData = await fetchGalleryImages();
  } catch (err) {
    console.error("Failed to fetch gallery images during SSR:", err);
  }

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Our Work</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          Browse our recent installation projects. From mounted TVs to complete home theater setups, 
          see the quality of our craftsmanship firsthand.
        </p>
      </div>
      
      <GalleryClient 
        initialImages={initialData.blobs} 
        initialCursor={initialData.cursor} 
      />
    </main>
  );
}
