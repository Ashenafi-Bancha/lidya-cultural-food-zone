-- AlterTable: gallery section grouping (MOMENTS | LIFE)
ALTER TABLE "GalleryItem" ADD COLUMN "group" TEXT NOT NULL DEFAULT 'MOMENTS';
