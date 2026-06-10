-- CreateTable
CREATE TABLE "Bieg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "miasto" TEXT NOT NULL,
    "wojewodztwo" TEXT NOT NULL DEFAULT 'śląskie',
    "dystanse" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "linkDoZapisow" TEXT,
    "opis" TEXT,
    "zrodlo" TEXT NOT NULL,
    "zewnetrznyId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'do_akceptacji',
    "lat" REAL,
    "lng" REAL,
    "emailKontakt" TEXT,
    "dataUtworzenia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAktualizacji" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Bieg_status_idx" ON "Bieg"("status");

-- CreateIndex
CREATE INDEX "Bieg_data_idx" ON "Bieg"("data");

-- CreateIndex
CREATE INDEX "Bieg_miasto_idx" ON "Bieg"("miasto");

-- CreateIndex
CREATE UNIQUE INDEX "Bieg_zewnetrznyId_zrodlo_key" ON "Bieg"("zewnetrznyId", "zrodlo");
