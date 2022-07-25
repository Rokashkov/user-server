/*
  Warnings:

  - You are about to drop the `Actiovation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Actiovation" DROP CONSTRAINT "Actiovation_userId_fkey";

-- DropTable
DROP TABLE "Actiovation";

-- CreateTable
CREATE TABLE "Activation" (
    "id" SERIAL NOT NULL,
    "link" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Activation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activation_userId_key" ON "Activation"("userId");

-- AddForeignKey
ALTER TABLE "Activation" ADD CONSTRAINT "Activation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
