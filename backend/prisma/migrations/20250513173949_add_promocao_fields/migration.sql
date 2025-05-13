-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "imagem" TEXT,
    "categoria" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "emPromocao" BOOLEAN NOT NULL DEFAULT false,
    "precoOriginal" REAL,
    "dataFimPromocao" DATETIME,
    "fornecedorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prato_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prato" ("categoria", "createdAt", "descricao", "disponivel", "fornecedorId", "id", "imagem", "nome", "preco", "updatedAt") SELECT "categoria", "createdAt", "descricao", "disponivel", "fornecedorId", "id", "imagem", "nome", "preco", "updatedAt" FROM "Prato";
DROP TABLE "Prato";
ALTER TABLE "new_Prato" RENAME TO "Prato";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
