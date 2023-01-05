/*
  Warnings:

  - You are about to drop the column `emaiL` on the `schedulings` table. All the data in the column will be lost.
  - Added the required column `email` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedulings` RENAME COLUMN `emaiL` TO `email`;
