const productService = require('../services/ProductService');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.json(products.map(product => ({
                ...product,
                Photo: product.Photo ? product.Photo.toString('base64') : null,
            })));
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении продуктов', error });
        }
    }
    
    async getProductById(req, res) {
      const productId = parseInt(req.params.id, 10);

      try {
          const product = await productService.getProductById(productId);
          if (!product) {
              return res.status(404).json({ message: 'Продукт не найден' });
          }

          const productData = {
              ...product,
              Photo: product.Photo ? product.Photo.toString('base64') : null,
          };

          res.json(productData);
      } catch (error) {
          console.error('Ошибка при получении продукта:', error);
          res.status(500).json({ message: 'Ошибка при получении продукта', error });
      }
    }

    async deleteProduct(req, res) {
        const productId = parseInt(req.params.id, 10);
        try {
            await productService.deleteProduct(productId);
            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            res.status(500).json({ message: 'Ошибка при удалении продукта', error });
        }
    }

    async addProduct(req, res) {
      const { title, cost, description, isActive, manufacturerID } = req.body;
      const photo = req.file ? req.file.buffer : null;
      const isActiveBool = isActive === 'true' || isActive === true;
      
      try {
          const product = await productService.addProduct({
              title, cost, description, isActive: isActiveBool, manufacturerID, photo,
          });
          res.status(201).json(product);
      } catch (error) {
          console.error('Ошибка при добавлении продукта:', error);
          res.status(500).json({ message: 'Ошибка при добавлении продукта', error });
      }
  }
  
  async updateProduct(req, res) {
      const { title, cost, description, isActive, manufacturerID } = req.body;
      const productId = parseInt(req.params.id, 10);
      const photo = req.file ? req.file.buffer : null;
      const isActiveBool = isActive === 'true' || isActive === true;
      
      try {
          const updatedProduct = await productService.updateProduct(productId, {
              title, cost, description, isActive: isActiveBool, manufacturerID, photo,
          });
          res.json(updatedProduct);
      } catch (error) {
          console.error('Ошибка при обновлении продукта:', error);
          res.status(500).json({ message: 'Ошибка при обновлении продукта', error });
      }
  }
}

module.exports = new ProductController();