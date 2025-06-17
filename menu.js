// Inicjalizacja strony menu
function initMenu() {
    // Pobierz numer stolika z URL
    const deskNumber = getUrlParameter('desk');
    
    // Wyświetl numer stolika
    const deskNumberElement = document.getElementById('desk-number');
    if (deskNumber) {
        deskNumberElement.textContent = deskNumber;
    } else {
        deskNumberElement.textContent = 'Nieznany';
    }
    
    // Obsługa przycisku składania zamówienia
    document.getElementById('submit-order').addEventListener('click', submitOrder);
    
    // Obsługa przycisku nowego zamówienia
    document.getElementById('new-order-btn').addEventListener('click', resetOrderForm);
    
    // Ukryj potwierdzenie zamówienia na początku
    document.getElementById('order-confirmation').style.display = 'none';
}

// Funkcja składania zamówienia
function submitOrder() {
    const customerName = document.getElementById('customer-name').value.trim();
    const orderDetails = document.getElementById('order-details').value.trim();
    const deskNumber = getUrlParameter('desk');
    
    if (!customerName || !orderDetails) {
        alert('Proszę wypełnić wszystkie pola');
        return;
    }
    
    // Pobierz istniejące zamówienia
    const orders = getOrders();
    
    // Utwórz nowe zamówienie
    const newOrder = {
        id: generateOrderId(),
        customerName: customerName,
        details: orderDetails,
        deskNumber: deskNumber,
        timestamp: new Date().toISOString(),
        completed: false
    };
    
    // Dodaj zamówienie do listy
    orders.push(newOrder);
    
    // Zapisz zaktualizowaną listę
    saveOrders(orders);
    
    // Pokaż potwierdzenie
    showOrderConfirmation(newOrder.id);
}

// Funkcja pokazująca potwierdzenie zamówienia
function showOrderConfirmation(orderId) {
    // Ukryj formularz
    document.querySelector('.new-order-form').style.display = 'none';
    
    // Pokaż potwierdzenie
    const confirmationElement = document.getElementById('order-confirmation');
    confirmationElement.style.display = 'block';
    
    // Ustaw numer zamówienia
    document.getElementById('confirmation-order-id').textContent = orderId;
}

// Funkcja resetująca formularz zamówienia
function resetOrderForm() {
    // Wyczyść pola formularza
    document.getElementById('customer-name').value = '';
    document.getElementById('order-details').value = '';
    
    // Pokaż formularz
    document.querySelector('.new-order-form').style.display = 'block';
    
    // Ukryj potwierdzenie
    document.getElementById('order-confirmation').style.display = 'none';
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', initMenu);
