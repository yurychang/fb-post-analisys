/*
  Warnings:

  - You are about to drop the `fetch_record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_fetch_record_id_fkey";

-- DropTable
DROP TABLE "fetch_record";

-- DropTable
DROP TABLE "post";

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "named_entities" JSONB NOT NULL,
    "update_time" TIMESTAMP(3) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fetch_record_id" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FetchRecord" (
    "id" SERIAL NOT NULL,
    "fetch_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FetchRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_fetch_record_id_fkey" FOREIGN KEY ("fetch_record_id") REFERENCES "FetchRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
