import { prisma } from './prisma.js';

let schemaPromise;

export function ensureInspectionAuditSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await prisma.$executeRawUnsafe('ALTER TABLE "inspections" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "inspection_audits" (
          "id" SERIAL NOT NULL,
          "inspection_id" INTEGER NOT NULL,
          "actor_id" INTEGER NOT NULL,
          "action" VARCHAR(40) NOT NULL DEFAULT 'UPDATE',
          "before_data" JSONB,
          "after_data" JSONB,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "inspection_audits_pkey" PRIMARY KEY ("id")
        )
      `);
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "inspection_audits_inspection_id_idx" ON "inspection_audits"("inspection_id")');
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "inspection_audits_actor_id_idx" ON "inspection_audits"("actor_id")');
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'inspection_audits_inspection_id_fkey'
          ) THEN
            ALTER TABLE "inspection_audits"
              ADD CONSTRAINT "inspection_audits_inspection_id_fkey"
              FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'inspection_audits_actor_id_fkey'
          ) THEN
            ALTER TABLE "inspection_audits"
              ADD CONSTRAINT "inspection_audits_actor_id_fkey"
              FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;
        END $$;
      `);
    })();
  }

  return schemaPromise;
}
