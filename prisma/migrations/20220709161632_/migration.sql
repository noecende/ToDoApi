-- DropForeignKey
ALTER TABLE `UsersOnWorkspaces` DROP FOREIGN KEY `UsersOnWorkspaces_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersOnWorkspaces` DROP FOREIGN KEY `UsersOnWorkspaces_workspaceId_fkey`;

-- AddForeignKey
ALTER TABLE `UsersOnWorkspaces` ADD CONSTRAINT `UsersOnWorkspaces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersOnWorkspaces` ADD CONSTRAINT `UsersOnWorkspaces_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
