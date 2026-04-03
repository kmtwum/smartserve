"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListBlobResultBlob } from "@vercel/blob";
import { fetchGalleryImages } from "./actions";
import styles from "./page.module.css";

export default function GalleryClient({ 
  initialImages, 
  initialCursor 
}: { 
  initialImages: ListBlobResultBlob[],
  initialCursor?: string 
}) {
  const [images, setImages] = useState<ListBlobResultBlob[]>(initialImages);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (!cursor) return;
    
    setIsLoading(true);
    try {
      const moreData = await fetchGalleryImages(cursor);
      setImages(prev => [...prev, ...moreData.blobs]);
      setCursor(moreData.cursor);
    } catch (err) {
      console.error("Failed to load more images:", err);
      // Optional: Add toast here
    } finally {
      setIsLoading(false);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
        No gallery images found yet.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {images.map((img) => (
          <div key={img.url} className={styles.imageCard}>
            {/* The wrapper handles Next.js intrinsic image filling responsively */}
            <div className={styles.imageWrapper}>
              <Image 
                src={img.url} 
                alt="Installation Project"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
          </div>
        ))}
      </div>

      {cursor && (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <button 
            onClick={loadMore} 
            disabled={isLoading}
            className={styles.loadMoreBtn}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
