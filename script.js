// Wspólne funkcje dla obu stron
const STORAGE_KEY = 'restaurant_orders';

// Funkcja zapisująca zamówienia do localStorage
function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// Funkcja pobierająca zamówienia z localStorage
function getOrders() {
    const orders = localStorage.getItem(STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
}

// Funkcja generująca nowy ID zamówienia
function generateOrderId() {
    const orders = getOrders();
    return orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
}

// Funkcja formatowania czasu
function formatTime(date) {
    return new Date(date).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funkcja formatowania daty
function formatDate(date) {
    return new Date(date).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Funkcja pobierająca parametry z URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
