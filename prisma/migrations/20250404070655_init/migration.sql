-- CreateTable
CREATE TABLE "Data4G" (
    "id" SERIAL NOT NULL,
    "e_node_b" TEXT NOT NULL,
    "e_utra_cell" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "vo_lte_erab_succ" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Data4G_pkey" PRIMARY KEY ("id")
);
