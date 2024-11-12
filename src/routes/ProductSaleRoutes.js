const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const productId = parseInt(req.query.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const salesData = await prisma.productSale.findMany({
      where: { ProductID: productId },
      include: {
        Product: true,
      },
      orderBy: {
        SaleDate: 'desc',
      },
    });
    res.json(salesData);
  } catch (error) {
    console.error('Ошибка при получении истории продаж:', error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

module.exports = router;