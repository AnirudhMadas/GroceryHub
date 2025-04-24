        // Sample inventory data based on Kaggle grocery dataset format
        let inventoryData = [
            { id: "P001", name: "Milk (2%)", category: "Dairy", price: 3.99, stock: 5, reorderLevel: 10, description: "Fresh 2% milk, 1 gallon" },
            { id: "P002", name: "Bread (Whole Wheat)", category: "Bakery", price: 4.50, stock: 0, reorderLevel: 15, description: "Whole wheat bread, 24 oz loaf" },
            { id: "P003", name: "Eggs (Large, Dozen)", category: "Dairy", price: 5.99, stock: 12, reorderLevel: 10, description: "Farm fresh large eggs, dozen" },
            { id: "P004", name: "Apples (Red Delicious)", category: "Produce", price: 1.99, stock: 34, reorderLevel: 20, description: "Red delicious apples, price per lb" },
            { id: "P005", name: "Chicken Breast", category: "Meat", price: 8.99, stock: 25, reorderLevel: 15, description: "Boneless skinless chicken breast, price per lb" },
            { id: "P006", name: "Orange Juice", category: "Beverages", price: 4.29, stock: 7, reorderLevel: 10, description: "100% pure orange juice, 64 fl oz" },
            { id: "P007", name: "Bananas", category: "Produce", price: 0.59, stock: 8, reorderLevel: 15, description: "Fresh bananas, price per lb" },
            { id: "P008", name: "Ground Beef", category: "Meat", price: 6.99, stock: 18, reorderLevel: 12, description: "80/20 ground beef, price per lb" },
            { id: "P009", name: "Tomatoes", category: "Produce", price: 2.49, stock: 22, reorderLevel: 15, description: "Roma tomatoes, price per lb" },
            { id: "P010", name: "Cereal (Corn Flakes)", category: "Breakfast", price: 3.79, stock: 15, reorderLevel: 8, description: "Corn flakes cereal, 18 oz box" },
            { id: "P011", name: "Yogurt (Greek)", category: "Dairy", price: 5.49, stock: 19, reorderLevel: 12, description: "Plain Greek yogurt, 32 oz" },
            { id: "P012", name: "Pasta (Spaghetti)", category: "Dry Goods", price: 1.79, stock: 27, reorderLevel: 15, description: "Spaghetti pasta, 16 oz" },
            { id: "P013", name: "Potato Chips", category: "Snacks", price: 3.49, stock: 31, reorderLevel: 20, description: "Original potato chips, 8 oz bag" },
            { id: "P014", name: "Canned Soup", category: "Canned Goods", price: 2.29, stock: 42, reorderLevel: 25, description: "Chicken noodle soup, 10.5 oz can" },
            { id: "P015", name: "Coffee", category: "Beverages", price: 8.99, stock: 13, reorderLevel: 8, description: "Ground coffee, medium roast, 12 oz" }
        ];
        
        // Current page for pagination
        let currentPage = 1;
        const itemsPerPage = 10;
        let currentProductId = null;
        
        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            loadInventoryTable();
            
            // Form submission handling
            document.getElementById('productForm').addEventListener('submit', function(e) {
                e.preventDefault();
                saveProduct();
            });
            
            // CSV import handling
            document.getElementById('importFile').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    importFromCSV(file);
                }
            });
        });
        
        // Load inventory table with data
        function loadInventoryTable() {
            const tableBody = document.querySelector('#inventoryTable tbody');
            tableBody.innerHTML = '';
            
            // Calculate pagination
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = inventoryData.slice(startIndex, endIndex);
            
            // Create table rows
            paginatedData.forEach(product => {
                const row = document.createElement('tr');
                
                // Determine stock level class
                let stockLevelClass = 'stock-good';
                if (product.stock <= product.reorderLevel * 0.5) {
                    stockLevelClass = 'stock-low';
                } else if (product.stock <= product.reorderLevel) {
                    stockLevelClass = 'stock-medium';
                }
                
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td><span class="stock-level ${stockLevelClass}">${product.stock}</span></td>
                    <td>${product.reorderLevel}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button class="btn" onclick="decrementStock('${product.id}')">-</button>
                            <input type="number" class="stock-edit-input" value="${product.stock}" id="stock-${product.id}" min="0">
                            <button class="btn" onclick="incrementStock('${product.id}')">+</button>
                            <button class="btn btn-primary" onclick="updateStock('${product.id}')">Update</button>
                        </div>
                    </td>
                    <td class="actions">
                        <button class="btn btn-primary" onclick="editProduct('${product.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Update pagination
            updatePagination();
        }
        
        // Update pagination buttons
        function updatePagination() {
            const totalPages = Math.ceil(inventoryData.length / itemsPerPage);
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            
            // Generate pagination buttons
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    const button = document.createElement('button');
                    button.textContent = i;
                    button.onclick = function() { changePage(i); };
                    
                    if (i === currentPage) {
                        button.classList.add('active');
                    }
                    
                    pagination.appendChild(button);
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    const ellipsis = document.createElement('button');
                    ellipsis.textContent = '...';
                    ellipsis.disabled = true;
                    pagination.appendChild(ellipsis);
                }
            }
        }
        
        // Change page
        function changePage(page) {
            currentPage = page;
            loadInventoryTable();
        }
        
        // Open the add product modal
        function openAddProductModal() {
            document.getElementById('modalTitle').textContent = 'Add New Product';
            document.getElementById('productForm').reset();
            currentProductId = null;
            document.getElementById('productModal').style.display = 'flex';
        }
        
        // Edit product
        function editProduct(id) {
            const product = inventoryData.find(p => p.id === id);
            if (product) {
                document.getElementById('modalTitle').textContent = 'Edit Product';
                document.getElementById('productId').value = product.id;
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('reorderLevel').value = product.reorderLevel;
                document.getElementById('productDescription').value = product.description || '';
                
                currentProductId = id;
                document.getElementById('productModal').style.display = 'flex';
            }
        }
        
        // Close the modal
        function closeModal() {
            document.getElementById('productModal').style.display = 'none';
        }
        
        // Save product
        function saveProduct() {
            const id = document.getElementById('productId').value;
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const stock = parseInt(document.getElementById('productStock').value);
            const reorderLevel = parseInt(document.getElementById('reorderLevel').value);
            const description = document.getElementById('productDescription').value;
            
            if (!id || !name || isNaN(price) || isNaN(stock)) {
                alert('Please fill all required fields correctly.');
                return;
            }
            
            const productData = {
                id,
                name,
                category,
                price,
                stock,
                reorderLevel,
                description
            };
            
            if (currentProductId) {
                // Update existing product
                const index = inventoryData.findIndex(p => p.id === currentProductId);
                if (index !== -1) {
                    inventoryData[index] = productData;
                }
            } else {
                // Check if ID already exists
                if (inventoryData.some(p => p.id === id)) {
                    alert('A product with this ID already exists.');
                    return;
                }
                
                // Add new product
                inventoryData.push(productData);
            }
            
            closeModal();
            loadInventoryTable();
            showAlert('Product saved successfully!');
            updateLastUpdated();
        }
        
        // Delete product
