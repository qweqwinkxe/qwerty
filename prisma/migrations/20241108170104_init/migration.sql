-- CreateTable
CREATE TABLE "AttachedProduct" (
    "MainProductID" INTEGER NOT NULL,
    "AttachedProductID" INTEGER NOT NULL,

    CONSTRAINT "AttachedProduct_pkey" PRIMARY KEY ("MainProductID","AttachedProductID")
);

-- CreateTable
CREATE TABLE "Client" (
    "ID" SERIAL NOT NULL,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "Patronymic" VARCHAR(50),
    "Birthday" DATE,
    "RegistrationDate" TIMESTAMP(6) NOT NULL,
    "Email" VARCHAR(255),
    "Phone" VARCHAR(20) NOT NULL,
    "GenderCode" CHAR(1) NOT NULL,
    "PhotoPath" VARCHAR(1000),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ClientService" (
    "ID" SERIAL NOT NULL,
    "ClientID" INTEGER NOT NULL,
    "ServiceID" INTEGER NOT NULL,
    "StartTime" TIMESTAMP(6) NOT NULL,
    "Comment" TEXT,

    CONSTRAINT "ClientService_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "DocumentByService" (
    "ID" SERIAL NOT NULL,
    "ClientServiceID" INTEGER NOT NULL,
    "DocumentPath" VARCHAR(1000) NOT NULL,

    CONSTRAINT "DocumentByService_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Gender" (
    "Code" CHAR(1) NOT NULL,
    "Name" VARCHAR(10),

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("Code")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "ID" SERIAL NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "StartDate" DATE,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Product" (
    "ID" SERIAL NOT NULL,
    "Title" VARCHAR(100) NOT NULL,
    "Cost" DECIMAL(19,4) NOT NULL,
    "Description" TEXT,
    "Photo" BYTEA,
    "IsActive" BOOLEAN NOT NULL,
    "ManufacturerID" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "ProductSale" (
    "ID" SERIAL NOT NULL,
    "SaleDate" TIMESTAMP(6) NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "ClientServiceID" INTEGER,

    CONSTRAINT "ProductSale_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Service" (
    "ID" SERIAL NOT NULL,
    "Title" VARCHAR(100) NOT NULL,
    "Cost" DECIMAL(19,4) NOT NULL,
    "DurationInSeconds" INTEGER NOT NULL,
    "Description" TEXT,
    "Discount" DECIMAL,
    "Photo" BYTEA,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Tag" (
    "ID" SERIAL NOT NULL,
    "Title" VARCHAR(30) NOT NULL,
    "Color" CHAR(6) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "TagOfClient" (
    "ClientID" INTEGER NOT NULL,
    "TagID" INTEGER NOT NULL,

    CONSTRAINT "TagOfClient_pkey" PRIMARY KEY ("ClientID","TagID")
);

-- AddForeignKey
ALTER TABLE "AttachedProduct" ADD CONSTRAINT "AttachedProduct_AttachedProductID_fkey" FOREIGN KEY ("AttachedProductID") REFERENCES "Product"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AttachedProduct" ADD CONSTRAINT "AttachedProduct_MainProductID_fkey" FOREIGN KEY ("MainProductID") REFERENCES "Product"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_GenderCode_fkey" FOREIGN KEY ("GenderCode") REFERENCES "Gender"("Code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClientService" ADD CONSTRAINT "ClientService_ClientID_fkey" FOREIGN KEY ("ClientID") REFERENCES "Client"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClientService" ADD CONSTRAINT "ClientService_ServiceID_fkey" FOREIGN KEY ("ServiceID") REFERENCES "Service"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DocumentByService" ADD CONSTRAINT "DocumentByService_ClientServiceID_fkey" FOREIGN KEY ("ClientServiceID") REFERENCES "ClientService"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ManufacturerID_fkey" FOREIGN KEY ("ManufacturerID") REFERENCES "Manufacturer"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_ClientServiceID_fkey" FOREIGN KEY ("ClientServiceID") REFERENCES "ClientService"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TagOfClient" ADD CONSTRAINT "TagOfClient_ClientID_fkey" FOREIGN KEY ("ClientID") REFERENCES "Client"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TagOfClient" ADD CONSTRAINT "TagOfClient_TagID_fkey" FOREIGN KEY ("TagID") REFERENCES "Tag"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;
