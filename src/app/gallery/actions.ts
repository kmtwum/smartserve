"use server";

import { list } from "@vercel/blob";

export async function fetchGalleryImages(cursor?: string) {
  const result = await list({
    prefix: 'gallery/',
    limit: 10, // Grab 1 extra just in case the folder itself takes up a slot
    cursor,
  });

  // Filter out the folder itself to prevent Next.js image optimization 400 errors
  const filteredBlobs = result.blobs.filter(blob => !blob.pathname.endsWith('/'));

  return {
    ...result,
    blobs: filteredBlobs.slice(0, 9), // Ensure we only return 9 items per page
  };
}
