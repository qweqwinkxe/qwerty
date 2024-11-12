document.addEventListener('DOMContentLoaded', async () => {
    const historyList = document.getElementById('history-list');
    const backBtn = document.getElementById('back-btn');
    const headerTitle = document.getElementById('header-title');
  
    const productId = localStorage.getItem('selectedProductId');
  
    async function loadProductHistory() {
      try {
        const response = await fetch(`http://localhost:3000/productsale?productId=${productId}`);
        const salesData = await response.json();
  
        if (salesData.length === 0) {
          historyList.innerHTML = '<p>История продаж не найдена.</p>';
          return;
        }
  
        salesData.forEach(sale => {
          const saleDiv = document.createElement('div');
          saleDiv.classList.add('history-item');
          saleDiv.innerHTML = `
            <p>Код продажи: ${sale.ID}</p>
            <p>Код продукта: ${sale.ProductID}</p>
            <p>Название продукта: ${sale.Product.Title}</p>
            <p>Дата продажи: ${new Date(sale.SaleDate).toLocaleString()}</p>
            <p>Количество: ${sale.Quantity}</p>
          `;
          historyList.appendChild(saleDiv);
        });
      } catch (error) {
        console.error('Ошибка при загрузке истории продаж:', error);
        historyList.innerHTML = '<p>Не удалось загрузить данные истории продаж.</p>';
      }
    }
  
    headerTitle.addEventListener('click', () => {
      window.location.href = 'view-product.html';
    });
  
    backBtn.addEventListener('click', () => {
      window.location.href = 'view-product.html';
    });
  
    loadProductHistory();
  });