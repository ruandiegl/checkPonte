-- CreateEnum
CREATE TYPE "Role" AS ENUM ('master', 'operator');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('OK', 'NC', 'IMP');

-- CreateEnum
CREATE TYPE "ResultAnswer" AS ENUM ('C', 'NC');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "email" VARCHAR(200),
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(200),
    "location" VARCHAR(200),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "is_imperative" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "inspection_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" VARCHAR(200),
    "user_id" INTEGER NOT NULL,
    "observations" TEXT,
    "status" "InspectionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_results" (
    "id" SERIAL NOT NULL,
    "inspection_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "answer" "ResultAnswer" NOT NULL,
    "observation" TEXT,

    CONSTRAINT "inspection_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_name_key" ON "equipment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_items_description_key" ON "checklist_items"("description");

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_results" ADD CONSTRAINT "inspection_results_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_results" ADD CONSTRAINT "inspection_results_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "checklist_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
