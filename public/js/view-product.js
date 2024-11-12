document.addEventListener('DOMContentLoaded', async () => {
  const productList = document.getElementById('product-list');
  const productCount = document.getElementById('product-count');
  const searchInput = document.getElementById('search-input');
  const manufacturerFilterDropdown = document.getElementById('manufacturer-filter');
  const sortDropdown = document.getElementById('sort');
  const historyButton = document.getElementById('history-product-btn');
  
  let products = [];
  let manufacturers = [];
  let selectedProductId = null;

  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:3000/products');
      products = await response.json();

      manufacturers = [...new Set(products.map(product => product.Manufacturer ? product.Manufacturer.Name : 'Не указан'))];

      manufacturers.forEach(manufacturer => {
        const option = document.createElement('option');
        option.value = manufacturer;
        option.textContent = manufacturer;
        manufacturerFilterDropdown.appendChild(option);
      });

      displayProducts(products);
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
    }
  }

  function displayProducts(productArray) {
    productList.innerHTML = '';

    if (productArray.length === 0) {
      productList.innerHTML = '<p>Продукты не найдены.</p>';
      updateProductCount(0, products.length);
      return;
    }

    productArray.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      if (!product.IsActive) {
        productDiv.classList.add('inactive');
      }

      const title = product.Title || 'Не указано';
      const cost = product.Cost || 'Не указана';
      const manufacturer = product.Manufacturer ? product.Manufacturer.Name : 'Не указан';
      const imageUrl = product.Photo ? `data:image/jpeg;base64,${product.Photo}` : '../assets/images/default-image.jpg';

      productDiv.innerHTML = `
        <img src="${imageUrl}" alt="${title}" />
        <h3>${title}</h3>
        <p class="price">Цена: <span class="price-amount">${cost} руб.</span></p>
        <p class="manufacturer">Производитель: ${manufacturer}</p>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editProduct(${product.ID})">Изменить</button>
          <button class="action-btn delete" onclick="deleteProduct(${product.ID})">Удалить</button>
        </div>
      `;

      productDiv.addEventListener('click', () => {
        document.querySelectorAll('.product').forEach(p => p.classList.remove('selected'));
        productDiv.classList.add('selected');
        selectedProductId = product.ID;
      });

      productList.appendChild(productDiv);
    });

    updateProductCount(productArray.length, products.length);
  }

  function updateProductCount(displayedCount, totalCount) {
    productCount.textContent = `${displayedCount} / ${totalCount}`;
  }

  function filterAndSortProducts() {
    let filteredProducts = products;

    const searchText = searchInput.value.toLowerCase();
    if (searchText) {
      filteredProducts = filteredProducts.filter(product =>
        product.Title.toLowerCase().includes(searchText) ||
        (product.Description && product.Description.toLowerCase().includes(searchText)) ||
        (product.Manufacturer && product.Manufacturer.Name.toLowerCase().includes(searchText)) ||
        (product.Cost && product.Cost.toString().includes(searchText))
      );
    }

    const selectedManufacturer = manufacturerFilterDropdown.value;
    if (selectedManufacturer) {
      filteredProducts = filteredProducts.filter(product =>
        product.Manufacturer && product.Manufacturer.Name === selectedManufacturer
      );
    }

    const sortValue = sortDropdown.value;
    if (sortValue === 'asc') {
      filteredProducts.sort((a, b) => a.Cost - b.Cost);
    } else if (sortValue === 'desc') {
      filteredProducts.sort((a, b) => b.Cost - a.Cost);
    }

    displayProducts(filteredProducts);
  }

  historyButton.addEventListener('click', () => {
    if (selectedProductId) {
      localStorage.setItem('selectedProductId', selectedProductId);
      window.location.href = 'history.html';
    } else {
      alert('Пожалуйста, выберите продукт для просмотра истории.');
    }
  });

  window.deleteProduct = async function(productId) {
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, { method: 'DELETE' });
      if (response.ok) {
        products = products.filter(product => product.ID !== productId);
        filterAndSortProducts();
      } else {
        console.error('Ошибка при удалении продукта');
      }
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  };

  window.editProduct = function(productId) {
    window.location.href = `add-product.html?productId=${productId}`;
  };

  searchInput.addEventListener('input', filterAndSortProducts);
  manufacturerFilterDropdown.addEventListener('change', filterAndSortProducts);
  sortDropdown.addEventListener('change', filterAndSortProducts);

  loadProducts();
});