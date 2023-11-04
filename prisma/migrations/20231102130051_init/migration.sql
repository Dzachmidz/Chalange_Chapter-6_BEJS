-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_post_id_key" ON "Images"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Images_image_id_key" ON "Images"("image_id");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
