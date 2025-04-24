// Simple tab switching functionality
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