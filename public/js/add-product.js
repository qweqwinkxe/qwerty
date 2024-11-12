document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    const form = document.getElementById('add-product-form');
    const manufacturerSelect = document.getElementById('manufacturer');
    const previewPhoto = document.getElementById('previewPhoto');
    const photoInput = document.getElementById('photo');

    try {
        const response = await fetch('http://localhost:3000/manufacturers');
        const manufacturers = await response.json();
        manufacturers.forEach(manufacturer => {
            const option = document.createElement('option');
            option.value = manufacturer.ID;
            option.textContent = manufacturer.Name;
            manufacturerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка при загрузке производителей:', error);
    }

    if (productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            const product = await response.json();

            form.querySelector('#title').value = product.Title || '';
            form.querySelector('#price').value = product.Cost || '';
            form.querySelector('#description').value = product.Description || '';
            form.querySelector('#isActive').checked = product.IsActive || false;
            manufacturerSelect.value = product.ManufacturerID || '';

            if (product.Photo) {
                previewPhoto.src = `data:image/jpeg;base64,${product.Photo}`;
                previewPhoto.style.display = 'block';
            }

            form.setAttribute('data-product-id', productId);
        } catch (error) {
            console.error('Ошибка при загрузке данных продукта:', error);
        }
    }

    const updatePhotoPreview = () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewPhoto.src = e.target.result;
                previewPhoto.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewPhoto.style.display = 'none';
        }
    };

    photoInput.addEventListener('change', updatePhotoPreview);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const productData = {
            title: form.querySelector('#title').value,
            cost: parseFloat(form.querySelector('#price').value),
            description: form.querySelector('#description').value,
            isActive: form.querySelector('#isActive').checked ? true : false,
            manufacturerID: parseInt(manufacturerSelect.value, 10),
        };
    
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => formData.append(key, value));
    
        const photoFile = photoInput.files[0];
        if (photoFile) formData.append('photo', photoFile);
    
        try {
            const method = productId ? 'PUT' : 'POST';
            const url = productId
                ? `http://localhost:3000/products/${productId}`
                : 'http://localhost:3000/products';
    
            const response = await fetch(url, { method, body: formData });
            if (response.ok) {
                alert(productId ? 'Продукт успешно обновлен' : 'Продукт успешно добавлен');
                window.location.href = 'view-product.html';
            } else {
                const errorResponse = await response.json();
                alert('Ошибка: ' + errorResponse.message);
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
    });
});