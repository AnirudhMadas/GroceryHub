// Common utility functions
const util = {
    formatCurrency: (amount) => {
        return '$' + parseFloat(amount).toFixed(2);
    },
    
    generateId: () => {
        return 'ID_' + Math.random().toString(36).substr(2, 9);
    },
    
    showNotification: (message, type = 'info') => {
        const alertContainer = document.querySelector('.alert-container');
        if (!alertContainer) return;
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type === 'warning' ? 'alert-warning' : ''}`;
        
        alertDiv.innerHTML = `
            <div>
                <strong>${type === 'warning' ? 'Warning' : 'Notification'}!</strong>
                <p>${message}</p>
            </div>
            <button class="alert-close">&times;</button>
        `;
        
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        });
        
        alertContainer.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.opacity = '0';
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, 5000);
    }
};

// Data management - In a real app, this would connect to a backend
class DataStore {
    constructor() {
        this.inventory = [];
        this.categories = [];
        this.invoices = [];
        this.thresholds = {
            default: 10
        };
        
        // Load initial data
        this.loadInitialData();
    }
    
    async loadInitialData() {
        try {
            // In a real app, this would fetch from an API
            // For now, we'll load from a simulated Kaggle dataset
            const response = await fetch('./data/grocery_inventory.json');
            if (response.ok) {
                const data = await response.json();
                this.inventory = data.inventory || [];
                this.categories = data.categories || [];
                console.log('Data loaded successfully', this.inventory.length, 'items');
                
                // Dispatch event that data is loaded
                document.dispatchEvent(new CustomEvent('dataLoaded'));
            } else {
                console.error('Failed to load data');
                // Load fallback data
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Load fallback data
            this.loadFallbackData();
        }
    }
    
    loadFallbackData() {
        // Sample data for testing when API/file is not available
        this.categories = [
            'Dairy', 'Bakery', 'Produce', 'Meat', 'Beverages', 'Canned Goods',
            'Dry Goods', 'Snacks', 'Frozen Foods', 'Household'
        ];
        
        this.inventory = [
            {
                id: 'P001',
                name: 'Milk (2%)',
                category: 'Dairy',
                price: 3.99,
                stock: 5,
                reorderLevel: 10,
                sku: 'SKU12345',
                barcode: '123456789012',
                supplier: 'Local Dairy Co.',
                costPrice: 2.50
            },
            {
                id: 'P002',
                name: 'Bread (Whole Wheat)',
                category: 'Bakery',
                price: 4.50,
                stock: 0,
                reorderLevel: 15,
                sku: 'SKU12346',
                barcode: '123456789013',
                supplier: 'Healthy Bakery Inc.',
                costPrice: 2.75
            },
            {
                id: 'P003',
                name: 'Eggs (Large, Dozen)',
                category: 'Dairy',
                price: 5.99,
                stock: 12,
                reorderLevel: 10,
                sku: 'SKU12347',
                barcode: '123456789014',
                supplier: 'Farm Fresh Eggs',
                costPrice: 4.00
            },
            {
                id: 'P004',
                name: 'Apples (Red Delicious)',
                category: 'Produce',
                price: 1.99,
                priceType: 'per lb',
                stock: 34,
                reorderLevel: 20,
                sku: 'SKU12348',
                barcode: '123456789015',
                supplier: 'Local Farms',
                costPrice: 1.20
            },
            {
                id: 'P005',
                name: 'Chicken Breast',
                category: 'Meat',
                price: 8.99,
                priceType: 'per lb',
                stock: 25,
                reorderLevel: 15,
                sku: 'SKU12349',
                barcode: '123456789016',
                supplier: 'Premium Meats',
                costPrice: 6.50
            },
            {
                id: 'P006',
                name: 'Orange Juice',
                category: 'Beverages',
                price: 4.29,
                stock: 7,
                reorderLevel: 10,
                sku: 'SKU12350',
                barcode: '123456789017',
                supplier: 'Citrus Farms',
                costPrice: 2.80
            },
            {
                id: 'P007',
                name: 'Bananas',
                category: 'Produce',
                price: 0.59,
                priceType: 'per lb',
                stock: 8,
                reorderLevel: 15,
                sku: 'SKU12351',
                barcode: '123456789018',
                supplier: 'Tropical Imports',
                costPrice: 0.30
            }
        ];
        
        // Dispatch event that data is loaded
        document.dispatchEvent(new CustomEvent('dataLoaded'));
    }
    
    // Inventory Methods
    getInventory(filters = {}) {
        let filteredInventory = [...this.inventory];
        
        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredInventory = filteredInventory.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.id.toLowerCase().includes(searchTerm) ||
                (item.sku && item.sku.toLowerCase().includes(searchTerm)) ||
                (item.barcode && item.barcode.toLowerCase().includes(searchTerm))
            );
        }
        
        if (filters.category && filters.category !== 'All') {
            filteredInventory = filteredInventory.filter(item => 
                item.category === filters.category
            );
        }
        
        if (filters.stockStatus) {
            if (filters.stockStatus === 'low') {
                filteredInventory = filteredInventory.filter(item => 
                    item.stock <= item.reorderLevel
                );
            } else if (filters.stockStatus === 'out') {
                filteredInventory = filteredInventory.filter(item => 
                    item.stock === 0
                );
            }
        }
        
        return filteredInventory;
    }
    
    getProductById(id) {
        return this.inventory.find(item => item.id === id);
    }
    
    getProductByBarcode(barcode) {
        return this.inventory.find(item => item.barcode === barcode);
    }
    
    updateStock(id, newStockLevel) {
        const productIndex = this.inventory.findIndex(item => item.id === id);
        if (productIndex !== -1) {
            const oldStock = this.inventory[productIndex].stock;
            this.inventory[productIndex].stock = newStockLevel;
            
            // Check if we need to trigger low stock alert
            if (newStockLevel <= this.inventory[productIndex].reorderLevel) {
                this.checkLowStockAlert(this.inventory[productIndex]);
            }
            
            console.log(`Stock updated for ${this.inventory[productIndex].name} from ${oldStock} to ${newStockLevel}`);
            return true;
        }
        return false;
    }
    
    addProduct(product) {
        // Ensure product has an ID
        if (!product.id) {
            product.id = 'P' + (this.inventory.length + 1).toString().padStart(3, '0');
        }
        this.inventory.push(product);
        console.log('Product added:', product);
        return product;
    }
    
    updateProduct(product) {
        const index = this.inventory.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.inventory[index] = {...this.inventory[index], ...product};
            console.log('Product updated:', this.inventory[index]);
            return this.inventory[index];
        }
        return null;
    }
    
    deleteProduct(id) {
        const index = this.inventory.findIndex(item => item.id === id);
        if (index !== -1) {
            const deletedProduct = this.inventory.splice(index, 1)[0];
            console.log('Product deleted:', deletedProduct);
            return deletedProduct;
        }
        return null;
    }
    
    getCategories() {
        return this.categories;
    }
    
    // Low stock alerts
    checkLowStockAlert(product) {
        if (product.stock <= 0) {
            util.showNotification(`CRITICAL: ${product.name} is out of stock!`, 'warning');
        } else if (product.stock <= product.reorderLevel) {
            util.showNotification(`Low Stock Alert: ${product.name} is below threshold (${product.stock} units left)`, 'warning');
        }
    }
    
    // Invoice and billing methods
    createInvoice(items, customer = { name: 'Walk-in Customer' }) {
        const invoiceId = 'INV-' + Date.now();
        const date = new Date();
        
        // Calculate totals
        let subtotal = 0;
        items.forEach(item => {
            const product = this.getProductById(item.productId);
            if (product) {
                item.price = product.price;
                item.total = product.price * item.quantity;
                subtotal += item.total;
                
                // Update inventory
                this.updateStock(item.productId, product.stock - item.quantity);
            }
        });
        
        const taxRate = 0.08; // 8%
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        
        const invoice = {
            id: invoiceId,
            date: date,
            customer: customer,
            items: items,
            subtotal: subtotal,
            taxRate: taxRate,
            tax: tax,
            total: total,
            paymentMethod: 'Cash',
            status: 'Paid'
        };
        
        this.invoices.push(invoice);
        console.log('Invoice created:', invoice);
        return invoice;
    }
    
    getInvoices() {
        return this.invoices;
    }
    
    getInvoiceById(id) {
        return this.invoices.find(invoice => invoice.id === id);
    }
    
    // Save data - In a real app, this would send to a backend
    saveData() {
        // Simulate saving to a backend
        console.log('Saving data to backend...');
        localStorage.setItem('groceryInventory', JSON.stringify(this.inventory));
        localStorage.setItem('groceryInvoices', JSON.stringify(this.invoices));
        console.log('Data saved successfully!');
    }
}

// Initialize data store
const dataStore = new DataStore();

// Inventory Management UI Controller
class InventoryUI {
    constructor(dataStore) {
        this.dataStore = dataStore;
        this.currentView = 'grid'; // or 'table'
        this.filters = {
            search: '',
            category: 'All',
            stockStatus: 'all'
        };
        
        // Initialize UI when data is loaded
        document.addEventListener('dataLoaded', this.initUI.bind(this));
    }
    
    initUI() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.renderCategoryFilters();
        this.renderInventory();
        
        // Check for low stock items
        this.checkLowStockItems();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.renderInventory();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.renderInventory();
            });
        }
        
        // Stock status filter
        const stockFilter = document.getElementById('stock-filter');
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.filters.stockStatus = e.target.value;
                this.renderInventory();
            });
        }
        
        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showProductModal();
            });
        }
        
        // Toggle view buttons
        const gridViewBtn = document.getElementById('grid-view-btn');
        const tableViewBtn = document.getElementById('table-view-btn');
        
        if (gridViewBtn && tableViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                this.currentView = 'grid';
                gridViewBtn.classList.add('active');
                tableViewBtn.classList.remove('active');
                this.renderInventory();
            });
            
            tableViewBtn.addEventListener('click', () => {
                this.currentView = 'table';
                tableViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                this.renderInventory();
            });
        }
        
        // Set up modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-backdrop').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        // Product form submission
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }
        
        // Stock update form
        const stockUpdateForm = document.getElementById('stock-update-form');
        if (stockUpdateForm) {
            stockUpdateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateStockLevel();
            });
        }
    }
    
    renderCategoryFilters() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;
        
        const categories = this.dataStore.getCategories();
        
        // Clear existing options except 'All'
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Add categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    renderInventory() {
        const inventoryContainer = document.getElementById('inventory-container');
        if (!inventoryContainer) return;
        
        // Get filtered inventory
        const inventory = this.dataStore.getInventory(this.filters);
        
        // Clear container
        inventoryContainer.innerHTML = '';
        
        if (inventory.length === 0) {
            inventoryContainer.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or add a new product.</p>
                    <button id="empty-add-btn" class="btn btn-primary">Add Product</button>
                </div>
            `;
            
            document.getElementById('empty-add-btn').addEventListener('click', () => {
                this.showProductModal();
            });
            
            return;
        }
        
        if (this.currentView === 'grid') {
            this.renderGridView(inventory, inventoryContainer);
        } else {
            this.renderTableView(inventory, inventoryContainer);
        }
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.showProductModal(productId);
            });
        });
        
        // Add event listeners to stock update buttons
        document.querySelectorAll('.update-stock-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.showStockUpdateModal(productId);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this product?')) {
                    this.deleteProduct(productId);
                }
            });
        });
    }
    
    renderGridView(inventory, container) {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'inventory-grid';
        
        inventory.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            let stockClass = 'stock-good';
            if (product.stock <= 0) {
                stockClass = 'stock-low';
            } else if (product.stock <= product.reorderLevel) {
                stockClass = 'stock-medium';
            }
            
            card.innerHTML = `
                <div class="product-card-header">
                    <h3>${product.name}</h3>
                    <span class="stock-badge ${stockClass}">${product.stock}</span>
                </div>
                <div class="product-card-body">
                    <p class="product-id">ID: ${product.id}</p>
                    <p class="product-category">Category: ${product.category}</p>
                    <p class="product-price">Price: ${util.formatCurrency(product.price)}${product.priceType ? ' ' + product.priceType : ''}</p>
                    <p class="product-stock">Stock: ${product.stock} units</p>
                    <p class="product-reorder">Reorder at: ${product.reorderLevel} units</p>
                </div>
                <div class="product-card-footer">
                    <button class="btn btn-small edit-product-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-small update-stock-btn" data-id="${product.id}">Update Stock</button>
                    <button class="btn btn-small btn-danger delete-product-btn" data-id="${product.id}">Delete</button>
                </div>
            `;
            
            gridContainer.appendChild(card);
        });
        
        container.appendChild(gridContainer);
    }
    
    renderTableView(inventory, container) {
        const table = document.createElement('table');
        table.className = 'inventory-table';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Level</th>
                    <th>Reorder Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        inventory.forEach(product => {
            const tr = document.createElement('tr');
            
            let stockClass = 'stock-good';
            if (product.stock <= 0) {
                stockClass = 'stock-low';
            } else if (product.stock <= product.reorderLevel) {
                stockClass = 'stock-medium';
            }
            
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${util.formatCurrency(product.price)}${product.priceType ? ' ' + product.priceType : ''}</td>
                <td><span class="stock-level ${stockClass}">${product.stock}</span></td>
                <td>${product.reorderLevel}</td>
                <td>
                    <button class="btn btn-small edit-product-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-small update-stock-btn" data-id="${product.id}">Update Stock</button>
                    <button class="btn btn-small btn-danger delete-product-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        container.appendChild(table);
    }
    
    showProductModal(productId = null) {
        const productModal = document.getElementById('product-modal');
        const productForm = document.getElementById('product-form');
        if (!productModal || !productForm) return;
        
        const modalTitle = productModal.querySelector('.modal-title');
        
        // Reset form
        productForm.reset();
        
        // Set form action - Add or Edit
        if (productId) {
            // Edit existing product
            const product = this.dataStore.getProductById(productId);
            if (!product) return;
            
            modalTitle.textContent = 'Edit Product';
            
            // Fill form with product data
            productForm.elements['product-id'].value = product.id;
            productForm.elements['product-name'].value = product.name;
            productForm.elements['product-category'].value = product.category;
            productForm.elements['product-price'].value = product.price;
            productForm.elements['product-price-type'].value = product.priceType || '';
            productForm.elements['product-stock'].value = product.stock;
            productForm.elements['product-reorder'].value = product.reorderLevel;
            productForm.elements['product-sku'].value = product.sku || '';
            productForm.elements['product-barcode'].value = product.barcode || '';
            productForm.elements['product-supplier'].value = product.supplier || '';
            productForm.elements['product-cost'].value = product.costPrice || '';
        } else {
            // Add new product
            modalTitle.textContent = 'Add New Product';
            productForm.elements['product-id'].value = '';
        }
        
        // Show modal
        productModal.style.display = 'flex';
    }
    
    saveProduct() {
        const productForm = document.getElementById('product-form');
        if (!productForm) return;
        
        // Get form data
        const productId = productForm.elements['product-id'].value;
        const product = {
            name: productForm.elements['product-name'].value,
            category: productForm.elements['product-category'].value,
            price: parseFloat(productForm.elements['product-price'].value),
            priceType: productForm.elements['product-price-type'].value,
            stock: parseInt(productForm.elements['product-stock'].value),
            reorderLevel: parseInt(productForm.elements['product-reorder'].value),
            sku: productForm.elements['product-sku'].value,
            barcode: productForm.elements['product-barcode'].value,
            supplier: productForm.elements['product-supplier'].value,
            costPrice: parseFloat(productForm.elements['product-cost'].value) || 0
        };
        
        if (productId) {
            // Update existing product
            product.id = productId;
            this.dataStore.updateProduct(product);
            util.showNotification(`Product "${product.name}" updated successfully!`);
        } else {
            // Add new product
            this.dataStore.addProduct(product);
            util.showNotification(`Product "${product.name}" added successfully!`);
        }
        
        // Save data
        this.dataStore.saveData();
        
        // Close modal
        document.getElementById('product-modal').style.display = 'none';
        
        // Refresh inventory view
        this.renderInventory();
    }
    
    showStockUpdateModal(productId) {
        const stockModal = document.getElementById('stock-modal');
        const stockForm = document.getElementById('stock-update-form');
        if (!stockModal || !stockForm) return;
        
        const product = this.dataStore.getProductById(productId);
        if (!product) return;
        
        // Set product information
        stockModal.querySelector('.modal-title').textContent = `Update Stock: ${product.name}`;
        stockForm.elements['stock-product-id'].value = product.id;
        stockForm.elements['stock-product-name'].value = product.name;
        stockForm.elements['current-stock'].value = product.stock;
        stockForm.elements['new-stock'].value = product.stock;
        
        // Show modal
        stockModal.style.display = 'flex';
    }
    
    updateStockLevel() {
        const stockForm = document.getElementById('stock-update-form');
        if (!stockForm) return;
        
        const productId = stockForm.elements['stock-product-id'].value;
        const newStock = parseInt(stockForm.elements['new-stock'].value);
        
        // Update stock
        if (this.dataStore.updateStock(productId, newStock)) {
            const product = this.dataStore.getProductById(productId);
            util.showNotification(`Stock updated for ${product.name} to ${newStock} units`);
            
            // Save data
            this.dataStore.saveData();
            
            // Close modal
            document.getElementById('stock-modal').style.display = 'none';
            
            // Refresh inventory view
            this.renderInventory();
        }
    }
    
    deleteProduct(productId) {
        const deletedProduct = this.dataStore.deleteProduct(productId);
        if (deletedProduct) {
            util.showNotification(`Product "${deletedProduct.name}" deleted successfully!`);
            
            // Save data
            this.dataStore.saveData();
            
            // Refresh inventory view
            this.renderInventory();
        }
    }
    
    checkLowStockItems() {
        const inventory = this.dataStore.getInventory();
        const lowStockItems = inventory.filter(item => item.stock <= item.reorderLevel);
        
        lowStockItems.forEach(item => {
            this.dataStore.checkLowStockAlert(item);
        });
        
        // Update low stock counter
        const lowStockCounter = document.getElementById('low-stock-counter');
        if (lowStockCounter) {
            lowStockCounter.textContent = lowStockItems.length;
            
            // Show danger class if there are low stock items
            if (lowStockItems.length > 0) {
                lowStockCounter.classList.add('count-danger');
            } else {
                lowStockCounter.classList.remove('count-danger');
            }
        }
    }
}

// Billing System UI Controller
class BillingUI {
    constructor(dataStore) {
        this.dataStore = dataStore;
        this.cart = [];
        this.taxRate = 0.08; // 8%
        
        // Initialize UI when data is loaded
        document.addEventListener('dataLoaded', this.initUI.bind(this));
    }
    
    initUI() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize the cart
        this.renderCart();
    }
    
    setupEventListeners() {
        // Product search
        const productSearch = document.getElementById('product-search');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
            
            // Add product on Enter key press
            productSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.searchResults && this.searchResults.length > 0) {
                    this.addToCart(this.searchResults[0].id);
                    productSearch.value = '';
                    this.clearSearchResults();
                }
            });
        }
        
        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                const productSearch = document.getElementById('product-search');
                if (this.searchResults && this.searchResults.length > 0) {
                    this.addToCart(this.searchResults[0].id);
                    productSearch.value = '';
                    this.clearSearchResults();
                }
            });
        }
        
        // Barcode scanner simulation
        const barcodeInput = document.getElementById('barcode-input');
        if (barcodeInput) {
            barcodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const barcode = barcodeInput.value.trim();
                    if (barcode) {
                        this.addProductByBarcode(barcode);
                        barcodeInput.value = '';
                    }
                }
            });
        }
        
        // Complete sale button
        const completeSaleBtn = document.getElementById('complete-sale-btn');
        if (completeSaleBtn) {
            completeSaleBtn.addEventListener('click', () => {
                if (this.cart.length > 0) {
                    this.showPaymentModal();
                } else {
                    util.showNotification('Please add products to the cart before completing the sale.', 'warning');
                }
            });
        }
        
        // Cancel sale button
    }
}

