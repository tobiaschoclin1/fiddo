-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "tiendanubeStoreId",
DROP COLUMN IF EXISTS "tiendanubeUserId",
DROP COLUMN IF EXISTS "tiendanubeAccessToken",
DROP COLUMN IF EXISTS "tiendanubeTokenType",
DROP COLUMN IF EXISTS "tiendanubeScope";
