module.exports = class InitCalculation1744801888007 {
  name = 'InitCalculation1744801888007';

  async up(queryRunner) {
    await queryRunner.query('ALTER TABLE "Calculation" ALTER COLUMN "createdAt" TYPE TIMESTAMP');
    await queryRunner.query('ALTER TABLE "Calculation" ALTER COLUMN "createdAt" SET DEFAULT now()');
  }

  async down(queryRunner) {
    await queryRunner.query('ALTER TABLE "Calculation" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP');
    await queryRunner.query('ALTER TABLE "Calculation" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3)');
  }
};
