-- CreateIndex
CREATE FULLTEXT INDEX `User_name_idx` ON `User`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `User_name_lastname_idx` ON `User`(`name`, `lastname`);
