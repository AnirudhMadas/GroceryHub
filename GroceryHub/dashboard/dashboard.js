// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab').forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Activate clicked tab and content
            tab.classList.add('active');
            document.querySelectorAll('.tab-content')[index].classList.add('active');
        });
    });

    // Close alert functionality
    document.querySelectorAll('.alert-close').forEach(button => {
        button.addEventListener('click', () => {
            const alert = button.parentElement;
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
    });

    // Initialize billing system functionality
    initializeBillingSystem();

    // Initialize inventory search
    initializeInventorySearch();

    // Initialize stock alerts
    initializeStockAlerts();

    // Add new product button functionality
    document.querySelector('.btn-primary').addEventListener('click', () => {
        alert('Add New Product form would open here');
    });
});

// Function to initialize billing system
function initializeBillingSystem() {
    // Handle quantity changes in billing
    const billingTable = document.querySelector('.tab-content:nth-child(2) table tbody');
    if (billingTable) {
        billingTable.addEventListener('change', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
                updateBillingTotals();
            }
        });

        // Remove item from bill
        billingTable.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') && e.target.textContent === '×') {
                e.target.closest('tr').remove();
                updateBillingTotals();
            }
        });

        // Add product to bill
        const addProductBtn = document.querySelector('.tab-content:nth-child(2) .search-bar .btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                const searchInput = document.querySelector('.tab-content:nth-child(2) .search-bar input');
                if (searchInput && searchInput.value.trim()) {
                    addProductToBill(searchInput.value.trim());
                    searchInput.value = '';
                }
            });
        }

        // Complete sale button
        const completeSaleBtn = document.querySelector('.tab-content:nth-child(2) .btn-primary');
        if (completeSaleBtn) {
            completeSaleBtn.addEventListener('click', () => {
                if (billingTable.children.length > 0) {
                    alert('Sale completed successfully!');
                    // Clear the billing table
                    billingTable.innerHTML = '';
                    updateBillingTotals();
                } else {
                    alert('Please add products to complete a sale.');
                }
            });
        }

        // Cancel button
        const cancelBtn = document.querySelector('.tab-content:nth-child(2) .btn:not(.btn-primary)');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                billingTable.innerHTML = '';
                updateBillingTotals();
            });
        }
    }
}

// Function to add a product to the billing table
function addProductToBill(productName) {
    // This is a simplified mock function - in a real app, you'd fetch the product details from a database
    const products = {
        'milk': { name: 'Milk (2%)', price: 3.99 },
        'bread': { name: 'Bread (Whole Wheat)', price: 4.50 },
        'eggs': { name: 'Eggs (Large, Dozen)', price: 5.99 },
        'apple': { name: 'Apples (Red Delicious)', price: 1.99 },
        'chicken': { name: 'Chicken Breast', price: 8.99 },
        'orange juice': { name: 'Orange Juice', price: 3.49 },
        'banana': { name: 'Bananas', price: 0.59 }
    };

    const searchTerm = productName.toLowerCase();
    let product = null;

    // Find product or use first match
    for (const key in products) {
        if (key.includes(searchTerm) || products[key].name.toLowerCase().includes(searchTerm)) {
            product = products[key];
            break;
        }
    }

    if (product) {
        const billingTable = document.querySelector('.tab-content:nth-child(2) table tbody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <input type="number" value="1" min="1" style="width: 60px; padding: 0.25rem;">
            </td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="btn">&times;</button>
            </td>
        `;
        
        billingTable.appendChild(newRow);
        updateBillingTotals();
    } else {
        alert(`Product "${productName}" not found.`);
    }
}

// Function to update billing totals
function updateBillingTotals() {
    const rows = document.querySelectorAll('.tab-content:nth-child(2) table tbody tr');
    let subtotal = 0;
    
    rows.forEach(row => {
        const price = parseFloat(row.children[1].textContent.replace('$', ''));
        const quantity = parseInt(row.querySelector('input').value);
        const total = price * quantity;
        
        // Update row total
        row.children[3].textContent = `$${total.toFixed(2)}`;
        
        subtotal += total;
    });
    
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Update bill summary
    document.querySelector('.tab-content:nth-child(2) div[style*="border-bottom"] div:first-child span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tab-content:nth-child(2) div[style*="border-bottom"] div:last-child span:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.tab-content:nth-child(2) div[style*="font-size: 1.25rem"] span:last-child').textContent = `$${total.toFixed(2)}`;
}

// Function to initialize inventory search
function initializeInventorySearch() {
    const inventorySearchInput = document.querySelector('.tab-content:first-child .search-bar input');
    const inventorySearchBtn = document.querySelector('.tab-content:first-child .search-bar .btn');
    const inventoryTable = document.querySelector('.tab-content:first-child table tbody');
    
    if (inventorySearchInput && inventorySearchBtn && inventoryTable) {
        inventorySearchBtn.addEventListener('click', () => {
            const searchTerm = inventorySearchInput.value.toLowerCase().trim();
            if (searchTerm) {
                // Filter inventory items
                const rows = inventoryTable.querySelectorAll('tr');
                rows.forEach(row => {
                    const productName = row.children[1].textContent.toLowerCase();
                    const category = row.children[2].textContent.toLowerCase();
                    
                    if (productName.includes(searchTerm) || category.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            } else {
                // Show all if search is empty
                inventoryTable.querySelectorAll('tr').forEach(row => {
                    row.style.display = '';
                });
            }
        });

        // Reset search on clear
        inventorySearchInput.addEventListener('input', () => {
            if (inventorySearchInput.value === '') {
                inventoryTable.querySelectorAll('tr').forEach(row => {
                    row.style.display = '';
                });
            }
        });

        // Edit and reorder buttons functionality
        inventoryTable.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                const row = e.target.closest('tr');
                const productName = row.children[1].textContent;
                
                if (e.target.textContent === 'Edit') {
                    alert(`Edit form would open for: ${productName}`);
                } else if (e.target.textContent === 'Reorder') {
                    alert(`Reorder form would open for: ${productName}`);
                }
            }
        });
    }
}

// Function to initialize stock alerts
function initializeStockAlerts() {
    const alertsTable = document.querySelector('.tab-content:nth-child(3) table tbody');
    const saveSettingsBtn = document.querySelector('.tab-content:nth-child(3) .btn-primary');
    
    if (alertsTable) {
        // Handle alert actions
        alertsTable.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                const row = e.target.closest('tr');
                const productName = row.children[0].textContent;
                
                if (e.target.textContent === 'Reorder') {
                    alert(`Reorder process started for: ${productName}`);
                } else if (e.target.textContent === 'Dismiss') {
                    row.remove();
                    updateAlertCount();
                }
            }
        });
    }
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            alert('Alert settings saved successfully!');
        });
    }

    // Initialize alert count
    updateAlertCount();
}

// Function to update the alert count in the dashboard card
function updateAlertCount() {
    const lowStockCard = document.querySelector('.card:nth-child(2) .card-value');
    const alertsCount = document.querySelector('.tab-content:nth-child(3) table tbody').children.length;
    
    if (lowStockCard) {
        lowStockCard.textContent = alertsCount;
        
        // Count critically low items (out of stock)
        const criticalItems = Array.from(document.querySelectorAll('.tab-content:nth-child(3) table tbody tr')).filter(row => 
            row.children[4].textContent.includes('Out of Stock')
        ).length;
        
        document.querySelector('.card:nth-child(2) div:last-child').textContent = `${criticalItems} critically low items`;
    }
}

// Show system alerts (uncomment to activate)
function showSystemAlerts() {
    const alertsHTML = `
        <div class="alert-container">
            <div class="alert alert-warning">
                <div>
                    <strong>Low Stock Alert!</strong>
                    <p>Milk (2%) is below threshold (5 units left)</p>
                </div>
                <button class="alert-close">&times;</button>
            </div>
            <div class="alert">
                <div>
                    <strong>Critical Stock Alert!</strong>
                    <p>Bread (Whole Wheat) is out of stock!</p>
                </div>
                <button class="alert-close">&times;</button>
            </div>
        </div>
    `;
    
    // Insert alerts at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', alertsHTML);
    
    // Initialize close buttons
    document.querySelectorAll('.alert-close').forEach(button => {
        button.addEventListener('click', () => {
            const alert = button.parentElement;
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
    });
}

// Uncomment the line below to show system alerts on page load
// document.addEventListener('DOMContentLoaded', showSystemAlerts);
