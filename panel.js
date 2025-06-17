let orders = [];
let alertInterval = null;
let alertActive = false;
let lastAlertTime = 0;

// Inicjalizacja panelu
function initPanel() {
    loadOrders();
    updateOrdersDisplay();
    updateStats();
    
    // Nasłuchiwanie na zmiany w localStorage (nowe zamówienia)
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY) {
            loadOrders();
            updateOrdersDisplay();
            updateStats();
            checkForNewOrders();
        }
    });
    
    // Sprawdzanie alertów co 30 sekund
    setInterval(checkAlerts, 30000);
    
    // Aktualizacja wyświetlania co 30 sekund
    setInterval(updateOrdersDisplay, 30000);
    
    // Obsługa kliknięcia w dowolne miejsce na stronie (wyłączenie alertu)
    document.addEventListener('click', function() {
        if (alertActive) {
            disableAlert();
            lastAlertTime = Date.now();
        }
    });
}

// Ładowanie zamówień z localStorage
function loadOrders() {
    orders = getOrders();
}

// Funkcja aktualizacji wyświetlania zamówień
function updateOrdersDisplay() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    
    // Sortowanie zamówień - najpierw oczekujące, potem według czasu (od najnowszych)
    const sortedOrders = [...orders].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    sortedOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = `order-item ${order.completed ? 'completed' : ''}`;
        
        // Sprawdzenie czy zamówienie jest przeterminowane (ponad 5 minut)
        const now = new Date();
        const orderAge = (now - new Date(order.timestamp)) / 1000 / 60; // w minutach
        const isOverdue = orderAge > 5 && !order.completed;
        
        if (isOverdue) {
            orderElement.classList.add('overdue');
        }
        
        orderElement.innerHTML = `
            <div class="order-header">
                <span class="order-id">Zamówienie #${order.id}</span>
                <span class="order-time">${formatTime(order.timestamp)}</span>
            </div>
            <div class="customer-name">
                ${order.deskNumber ? `<span class="desk-number">Stolik ${order.deskNumber}</span>` : ''}
                ${order.customerName}
            </div>
            <div class="order-details">${order.details}</div>
            <div class="order-status ${order.completed ? 'status-completed' : 'status-pending'}">
                ${order.completed ? 'Ukończone' : 'Oczekujące'}
            </div>
        `;
        
        // Dodanie funkcji kliknięcia
        orderElement.addEventListener('click', () => toggleOrderStatus(order.id));
        
        ordersList.appendChild(orderElement);
    });
}

// Funkcja przełączania statusu zamówienia
function toggleOrderStatus(orderId) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].completed = !orders[orderIndex].completed;
        saveOrders(orders);
        updateOrdersDisplay();
        updateStats();
    }
}

// Funkcja aktualizacji statystyk
function updateStats() {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => !o.completed).length;
    
    document.getElementById('total-orders').textContent = `Zamówienia: ${totalOrders}`;
    document.getElementById('pending-orders').textContent = `Oczekujące: ${pendingOrders}`;
}

// Funkcja sprawdzania alertów
function checkAlerts() {
    const now = new Date();
    const overdueOrders = orders.filter(order => {
        if (order.completed) return false;
        const orderAge = (now - new Date(order.timestamp)) / 1000 / 60; // w minutach
        return orderAge > 5;
    });
    
    // Jeśli są przeterminowane zamówienia i minęło co najmniej 30 sekund od ostatniego wyłączenia alertu
    if (overdueOrders.length > 0 && (Date.now() - lastAlertTime > 30000)) {
        enableAlert();
    }
}

// Funkcja sprawdzająca nowe zamówienia
function checkForNewOrders() {
    const now = Date.now();
    const newOrders = orders.filter(order => {
        // Sprawdzamy czy zamówienie jest nowe (dodane w ciągu ostatnich 10 sekund)
        return !order.completed && (now - new Date(order.timestamp).getTime() < 10000);
    });
    
    if (newOrders.length > 0) {
        enableAlert();
    }
}

// Włączenie alertu
function enableAlert() {
    const alertOverlay = document.getElementById('alert-overlay');
    alertOverlay.classList.add('active');
    alertActive = true;
}

// Wyłączenie alertu
function disableAlert() {
    const alertOverlay = document.getElementById('alert-overlay');
    alertOverlay.classList.remove('active');
    alertActive = false;
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', initPanel);
