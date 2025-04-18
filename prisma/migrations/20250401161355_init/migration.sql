-- CreateTable
CREATE TABLE "Calculation" (
    "id" SERIAL NOT NULL,
    "number" BIGINT NOT NULL,
    "result" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calculation_pkey" PRIMARY KEY ("id")
);
