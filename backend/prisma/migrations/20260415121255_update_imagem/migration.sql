-- CreateTable
CREATE TABLE `imagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeOriginal` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `eventosId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `imagem` ADD CONSTRAINT `imagem_eventosId_fkey` FOREIGN KEY (`eventosId`) REFERENCES `eventos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
