-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
