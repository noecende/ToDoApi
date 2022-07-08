/*
  Warnings:

  - You are about to drop the `UserOnWorkspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserOnWorkspace` DROP FOREIGN KEY `UserOnWorkspace_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserOnWorkspace` DROP FOREIGN KEY `UserOnWorkspace_workspaceId_fkey`;

-- DropTable
DROP TABLE `UserOnWorkspace`;

-- CreateTable
CREATE TABLE `UsersOnWorkspaces` (
    `userId` INTEGER NOT NULL,
    `workspaceId` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `workspaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsersOnWorkspaces` ADD CONSTRAINT `UsersOnWorkspaces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersOnWorkspaces` ADD CONSTRAINT `UsersOnWorkspaces_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
