/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "named_entities" JSONB NOT NULL,
    "fetch_record_id" INTEGER NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fetch_record" (
    "id" SERIAL NOT NULL,
    "fetch_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fetch_record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_fetch_record_id_fkey" FOREIGN KEY ("fetch_record_id") REFERENCES "fetch_record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
