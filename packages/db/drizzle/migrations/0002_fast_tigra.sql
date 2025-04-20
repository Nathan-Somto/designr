ALTER TABLE "projects" 
  ALTER COLUMN "width" SET DATA TYPE integer USING NULLIF(width::text, '')::integer,
  ALTER COLUMN "height" SET DATA TYPE integer USING NULLIF(height::text, '')::integer,
  ALTER COLUMN "height" SET NOT NULL;
