-- AlterTable: Amharic translation columns (all nullable, English remains source of truth)
ALTER TABLE "Category" ADD COLUMN "nameAm" TEXT;

ALTER TABLE "MenuItem" ADD COLUMN "nameAm" TEXT;
ALTER TABLE "MenuItem" ADD COLUMN "descriptionAm" TEXT;

ALTER TABLE "Branch" ADD COLUMN "nameAm" TEXT;
ALTER TABLE "Branch" ADD COLUMN "labelAm" TEXT;
ALTER TABLE "Branch" ADD COLUMN "workingHoursAm" TEXT;
ALTER TABLE "Branch" ADD COLUMN "noteAm" TEXT;

ALTER TABLE "GalleryItem" ADD COLUMN "titleAm" TEXT;
ALTER TABLE "GalleryItem" ADD COLUMN "descriptionAm" TEXT;
