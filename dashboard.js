// 6.a: Show User Frequency (Gender & Age Group)
function ShowUserFrequency() {
    const registrations = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    const genderCount = { Male: 0, Female: 0, Other: 0 };
    const ageGroups = { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };

    registrations.forEach(user => {
        // Gender
        const g = user.gender || 'Other';
        if (genderCount[g] !== undefined) genderCount[g]++;
        else genderCount['Other']++;

        // Age
        const dob = new Date(user.dob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (today.getMonth() < dob.getMonth() || 
           (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age >= 18 && age <= 25) ageGroups['18-25']++;
        else if (age <= 35) ageGroups['26-35']++;
        else if (age <= 50) ageGroups['36-50']++;
        else if (age > 50) ageGroups['50+']++;
    });

    // Render Gender Chart
    let genderHTML = '';
    for (const [label, count] of Object.entries(genderCount)) {
        const width = count > 0 ? Math.max(50, count * 40) : 50;
        genderHTML += `<div class="bar" style="width: ${width}px;"><span class="bar-label">${label}:</span> ${count}</div>`;
    }
    document.getElementById('genderChart').innerHTML = genderHTML;

    // Render Age Group Chart
    let ageHTML = '';
    for (const [label, count] of Object.entries(ageGroups)) {
        const width = count > 0 ? Math.max(50, count * 40) : 50;
        ageHTML += `<div class="bar" style="width: ${width}px;"><span class="bar-label">${label}:</span> ${count}</div>`;
    }
    document.getElementById('ageGroupChart').innerHTML = ageHTML;
}

// 6.b: Log all invoices to console
function ShowInvoices() {
    const invoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    console.log('All Invoices:', invoices);
    return invoices;
}

// 6.c: Get invoices for a specific TRN
function GetUserInvoices(trn) {
    const registrations = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const user = registrations.find(u => u.trn === trn);
    if (user && user.invoices) {
        console.log(`Invoices for TRN ${trn}:`, user.invoices);
        return user.invoices;
    }
    console.log(`No invoices found for TRN: ${trn}`);
    return [];
}

// Search invoices by TRN (for dashboard UI)
function searchInvoicesByTRN() {
    const trn = document.getElementById('searchTRN').value.trim();
    if (!trn) {
        alert('Please enter a TRN.');
        return;
    }

    ShowInvoices(); // Ensure AllInvoices is loaded
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    const userInvoices = allInvoices.filter(inv => inv.trn === trn);

    const resultsDiv = document.getElementById('invoiceResults');
    if (userInvoices.length === 0) {
        resultsDiv.innerHTML = `<p>No invoices found for TRN: ${trn}</p>`;
    } else {
        let html = `<h3>Found ${userInvoices.length} invoice(s):</h3><ul>`;
        userInvoices.forEach(inv => {
            html += `<li>Invoice #${inv.invoiceNumber} - ${inv.date} - Total: $${inv.total.toFixed(2)}</li>`;
        });
        html += `</ul>`;
        resultsDiv.innerHTML = html;
    }
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', function () {
    ShowUserFrequency();
});