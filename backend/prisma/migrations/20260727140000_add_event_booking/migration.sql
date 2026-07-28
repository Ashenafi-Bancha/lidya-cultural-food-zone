-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'ENGAGEMENT', 'HALL_RENTAL', 'CATERING', 'CORPORATE', 'BIRTHDAY', 'VIP', 'VVIP', 'OTHER');

-- CreateTable
CREATE TABLE "EventBooking" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "serviceType" "EventType" NOT NULL,
    "eventDate" TEXT NOT NULL,
    "guestCount" INTEGER,
    "message" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventBooking" ADD CONSTRAINT "EventBooking_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
