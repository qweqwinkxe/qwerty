const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3000;
const prisma = new PrismaClient();

const productRoutes = require('./routes/ProductRoutes');
const manufacturerRoutes = require('./routes/ManufacturerRoutes');
const productSaleRoutes = require('./routes/ProductSaleRoutes');

app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/products', productRoutes);
app.use('/manufacturers', manufacturerRoutes);
app.use('/productsale', productSaleRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/view-product.html'));
});

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Manufacturer: true,
      },
    });

    const productsWithPhoto = products.map(product => ({
      ...product,
      Photo: product.Photo ? product.Photo.toString('base64') : null,
    }));

    res.json(productsWithPhoto);
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Неверный идентификатор продукта' });
  }

  try {
    const productToDelete = await prisma.product.findUnique({
      where: { ID: productId },
    });

    if (!productToDelete) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }

    const relatedSalesCount = await prisma.productSale.count({
      where: { ProductID: productId },
    });
    const relatedAttachedProductsCount = await prisma.attachedProduct.count({
      where: {
        OR: [
          { MainProductID: productId },
          { AttachedProductID: productId },
        ],
      },
    });

    if (relatedSalesCount > 0) {
      return res.status(409).json({ error: 'Нельзя удалить продукт, так как он связан с продажами.' });
    }

    if (relatedAttachedProductsCount > 0) {
      return res.status(409).json({ error: 'Нельзя удалить продукт, так как он имеет прикрепленные продукты.' });
    }

    await prisma.product.delete({
      where: { ID: productId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    res.status(500).json({ error: 'Ошибка при удалении продукта', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});