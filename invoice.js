// Function to generate and save invoice after successful checkout
// Call this inside confirmCheckout() in script.js after validation
function generateInvoice(checkoutData) {
    const cart = JSON.parse(localStorage.getItem('spaCart')) || {};
    if (Object.keys(cart).length === 0) return null;

    // Calculate totals
    let subtotal = 0;
    const items = [];
    for (const id in cart) {
        const item = cart[id];
        subtotal += item.product.price * item.quantity;
        items.push({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        });
    }
    const discount = subtotal * 0.10; // 10%
    const tax = (subtotal - discount) * 0.15; // 15% on discounted amount
    const total = subtotal - discount + tax;

    // Create unique invoice number
    const invoiceNumber = 'INV-' + Date.now();

    // Build invoice object (Task 5.a)
    const invoice = {
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        trn: checkoutData.trn,
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email,
        address: checkoutData.address,
        city: checkoutData.city,
        items: items,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total
    };

    // Task 5.b: Save to global AllInvoices
    let allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    allInvoices.push(invoice);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));

    // Task 5.b: Save to user's RegistrationData record
    let registrations = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const userIndex = registrations.findIndex(user => user.trn === checkoutData.trn);
    if (userIndex !== -1) {
        if (!registrations[userIndex].invoices) {
            registrations[userIndex].invoices = [];
        }
        registrations[userIndex].invoices.push(invoice);
        localStorage.setItem('RegistrationData', JSON.stringify(registrations));
    }

    // Save as latest for invoice.html
    localStorage.setItem('latestInvoice', JSON.stringify(invoice));

    return invoice;
}

// Display invoice on invoice.html (Task 5.a + 5.c)
function displayInvoice() {
    const invoice = JSON.parse(localStorage.getItem('latestInvoice'));
    const container = document.getElementById('invoice-content');
    if (!invoice) {
        container.innerHTML = '<p>No invoice found. Please complete a checkout first.</p>';
        return;
    }

    // Build items table rows
    let itemsHtml = '';
    invoice.items.forEach(item => {
        const lineTotal = (item.price * item.quantity).toFixed(2);
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${lineTotal}</td>
            </tr>
        `;
    });

    // Build full invoice HTML
    const html = `
        <div>
            <h2>Lily of the Valley Spa</h2>
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoice.date}</p>
            <p><strong>TRN:</strong> ${invoice.trn}</p>

            <h3>Shipping Information</h3>
            <p>${invoice.firstName} ${invoice.lastName}</p>
            <p>${invoice.address}, ${invoice.city}</p>
            <p>${invoice.email}</p>

            <h3>Purchased Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div>
                <p><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</p>
                <p><strong>Discount (10%):</strong> -$${invoice.discount.toFixed(2)}</p>
                <p><strong>Tax (15%):</strong> $${invoice.tax.toFixed(2)}</p>
                <h3>Total: $${invoice.total.toFixed(2)}</h3>
            </div>

            <p>A copy of this invoice has been sent to <strong>${invoice.email}</strong>.</p>
        </div>
    `;
    container.innerHTML = html;
}

// Auto-run on invoice.html
if (document.getElementById('invoice-content')) {
    displayInvoice();
}