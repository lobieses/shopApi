ALTER TABLE "public"."Products"
    DROP CONSTRAINT "quantity_min_value_check" RESTRICT;

ALTER TABLE "public"."Products"
    ADD CONSTRAINT "quantity_min_value_check" CHECK ( quantity >= 0 );