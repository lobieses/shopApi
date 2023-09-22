-- AlterTable
ALTER TABLE "Products" ADD CONSTRAINT quantity_min_value_check CHECK ( quantity >= 1 )