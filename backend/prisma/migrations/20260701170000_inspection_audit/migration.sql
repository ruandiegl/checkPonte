ALTER TABLE "inspections" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "inspection_audits" (
    "id" SERIAL NOT NULL,
    "inspection_id" INTEGER NOT NULL,
    "actor_id" INTEGER NOT NULL,
    "action" VARCHAR(40) NOT NULL DEFAULT 'UPDATE',
    "before_data" JSONB,
    "after_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspection_audits_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "inspection_audits_inspection_id_idx" ON "inspection_audits"("inspection_id");
CREATE INDEX "inspection_audits_actor_id_idx" ON "inspection_audits"("actor_id");

ALTER TABLE "inspection_audits" ADD CONSTRAINT "inspection_audits_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inspection_audits" ADD CONSTRAINT "inspection_audits_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
