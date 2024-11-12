const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async () => {
  return await prisma.product.findMany({
    include: { Manufacturer: true },
  });
};

exports.getProductById = async (productId) => {
  return await prisma.product.findUnique({
      where: { ID: productId },
  });
};

exports.addProduct = async ({ title, cost, description, isActive, manufacturerID, photo }) => {
  if (!title || !cost || !manufacturerID) {
    throw new Error('Не все обязательные поля переданы');
  }

  return await prisma.product.create({
    data: {
      Title: title,
      Cost: parseFloat(cost),
      Description: description || '',
      IsActive: Boolean(isActive),
      ManufacturerID: parseInt(manufacturerID),
      Photo: photo || null
    }
  });
};

exports.updateProduct = async (productId, { title, cost, description, isActive, manufacturerID, photo }) => {
  return await prisma.product.update({
      where: { ID: productId },
      data: {
          Title: title,
          Cost: parseFloat(cost),
          Description: description || '',
          IsActive: Boolean(isActive),
          ManufacturerID: parseInt(manufacturerID, 10),
          Photo: photo || undefined,
      }
  });
};

exports.deleteProduct = async (productId) => {
  await prisma.productSale.deleteMany({
    where: { ProductID: productId },
  });

  await prisma.attachedProduct.deleteMany({
    where: {
      OR: [
        { MainProductID: productId },
        { AttachedProductID: productId }
      ],
    },
  });

  return await prisma.product.delete({
    where: { ID: productId },
  });
};

exports.deleteProductSalesByProductId = async (productId) => {
  return await prisma.productSale.deleteMany({
    where: { ProductID: productId },
  });
};

exports.deleteAttachedProductsByMainProductId = async (mainProductId) => {
  return await prisma.attachedProduct.deleteMany({
    where: { MainProductID: mainProductId },
  });
};

exports.deleteAttachedProductsByAttachedProductId = async (attachedProductId) => {
  return await prisma.attachedProduct.deleteMany({
    where: { AttachedProductID: attachedProductId },
  });
};