// ==========================================
// FINANCE MANAGEMENT SYSTEM
// ==========================================

let customers =
    JSON.parse(localStorage.getItem("financeCustomers")) || [];

let selectedMonthDate = new Date();


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "financeCustomers",
        JSON.stringify(customers)
    );

}


// ==========================================
// MONEY FORMAT
// ==========================================

function money(amount) {

    return "₹" + Number(amount || 0).toLocaleString("en-IN");

}


// ==========================================
// SAVE CUSTOMER
// ==========================================

function saveCustomer() {

    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const amount =
        Number(document.getElementById("loanAmount").value);

    const interest =
        Number(document.getElementById("interestRate").value);

    const months =
        Number(document.getElementById("loanMonths").value);

    const date =
        document.getElementById("loanDate").value;


    if (!name) {
        alert("Enter customer name");
        return;
    }

    if (!phone) {
        alert("Enter phone number");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Enter loan amount");
        return;
    }

    if (!months || months <= 0) {
        alert("Enter number of months");
        return;
    }


    // Interest calculation
    const interestAmount =
        amount * (interest / 100);

    const totalPayable =
        amount + interestAmount;

    const monthlyPayment =
        totalPayable / months;


    const customer = {

        id: Date.now(),

        name: name,

        phone: phone,

        loanAmount: amount,

        interest: interest,

        months: months,

        interestAmount: interestAmount,

        totalPayable: totalPayable,

        monthlyPayment: monthlyPayment,

        loanDate:
            date ||
            new Date().toISOString().split("T")[0],

        payments: []

    };


    customers.push(customer);

    saveData();

    alert("Customer saved successfully");


    // Clear form

    document.getElementById("customerName").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("loanAmount").value = "";

    document.getElementById("interestRate").value = "";

    document.getElementById("loanMonths").value = "";

    document.getElementById("loanDate").value = "";


    refreshAll();

}


// ==========================================
// TOTAL PAID
// ==========================================

function totalPaid(customer) {

    return customer.payments.reduce(
        (sum, payment) =>
            sum + Number(payment.amount),
        0
    );

}


// ==========================================
// BALANCE
// ==========================================

function balance(customer) {

    return Math.max(
        0,
        customer.totalPayable - totalPaid(customer)
    );

}


// ==========================================
// ADD PAYMENT
// ==========================================

function addPayment() {

    const customerId =
        Number(
            document.getElementById("paymentCustomer").value
        );

    const amount =
        Number(
            document.getElementById("paymentAmount").value
        );

    const date =
        document.getElementById("paymentDate").value;


    if (!customerId) {

        alert("Select customer");

        return;

    }

    if (!amount || amount <= 0) {

        alert("Enter payment amount");

        return;

    }

    if (!date) {

        alert("Select payment date");

        return;

    }


    const customer =
        customers.find(c => c.id === customerId);


    if (!customer) {

        alert("Customer not found");

        return;

    }


    if (amount > balance(customer)) {

        alert(
            "Payment is greater than remaining balance"
        );

        return;

    }


    customer.payments.push({

        id: Date.now(),

        amount: amount,

        date: date

    });


    saveData();


    document.getElementById("paymentAmount").value = "";

    document.getElementById("paymentDate").value = "";


    alert("Payment saved successfully");

    refreshAll();

}


// ==========================================
// CUSTOMER LIST
// ==========================================

function displayCustomers() {

    const table =
        document.getElementById("customerTable");

    const search =
        document
            .getElementById("searchCustomer")
            .value
            .toLowerCase();


    table.innerHTML = "";


    const filtered =
        customers.filter(customer =>

            customer.name
                .toLowerCase()
                .includes(search)

            ||

            customer.phone
                .toLowerCase()
                .includes(search)

        );


    filtered.forEach((customer, index) => {

        const paid =
            totalPaid(customer);

        const remaining =
            balance(customer);

        const status =
            remaining === 0
                ? "Completed"
                : "Pending";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>
                <strong>${customer.name}</strong>
            </td>

            <td>
                ${customer.phone}
            </td>

            <td>
                ${money(customer.loanAmount)}
            </td>

            <td>
                ${money(customer.totalPayable)}
            </td>

            <td class="paid">
                ${money(paid)}
            </td>

            <td class="pending">
                ${money(remaining)}
            </td>

            <td>
                ${status}
            </td>

            <td>

                <button
                    class="details-btn"
                    onclick="showCustomerDetails(${customer.id})"
                >
                    View
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCustomer(${customer.id})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// CUSTOMER DROPDOWN
// ==========================================

function updateCustomerDropdown() {

    const select =
        document.getElementById("paymentCustomer");


    select.innerHTML =
        `<option value="">Select Customer</option>`;


    customers.forEach(customer => {

        const option =
            document.createElement("option");

        option.value = customer.id;

        option.textContent =
            `${customer.name} - ${customer.phone}`;

        select.appendChild(option);

    });

}


// ==========================================
// CUSTOMER DETAILS
// ==========================================

function showCustomerDetails(id) {

    const customer =
        customers.find(c => c.id === id);


    if (!customer) return;


    const paid =
        totalPaid(customer);

    const remaining =
        balance(customer);


    let paymentRows = "";


    customer.payments.forEach(
        (payment, index) => {

            paymentRows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${payment.date}
                    </td>

                    <td>
                        ${money(payment.amount)}
                    </td>

                </tr>

            `;

        }
    );


    if (!paymentRows) {

        paymentRows = `

            <tr>

                <td colspan="3">
                    No payments yet
                </td>

            </tr>

        `;

    }


    const details =
        document.getElementById("customerDetails");


    details.innerHTML = `

        <h2>
            ${customer.name}
        </h2>

        <div class="detail-box">

            <p>
                <strong>Phone:</strong>
                ${customer.phone}
            </p>

            <p>
                <strong>Loan Date:</strong>
                ${customer.loanDate}
            </p>

            <p>
                <strong>Loan Amount:</strong>
                ${money(customer.loanAmount)}
            </p>

            <p>
                <strong>Interest:</strong>
                ${customer.interest}%
            </p>

            <p>
                <strong>Interest Amount:</strong>
                ${money(customer.interestAmount)}
            </p>

            <p>
                <strong>Total Payable:</strong>
                ${money(customer.totalPayable)}
            </p>

            <p>
                <strong>Monthly Payment:</strong>
                ${money(customer.monthlyPayment)}
            </p>

            <p class="paid">
                <strong>Total Paid:</strong>
                ${money(paid)}
            </p>

            <p class="pending">
                <strong>Balance:</strong>
                ${money(remaining)}
            </p>

        </div>


        <h3>
            Monthly / Payment History
        </h3>


        <table class="payment-table">

            <thead>

                <tr>

                    <th>No</th>

                    <th>Date</th>

                    <th>Amount</th>

                </tr>

            </thead>

            <tbody>

                ${paymentRows}

            </tbody>

        </table>

    `;


    document.getElementById("customerModal").style.display =
        "block";

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    document.getElementById("customerModal").style.display =
        "none";

}


// ==========================================
// DELETE CUSTOMER
// ==========================================

function deleteCustomer(id) {

    const customer =
        customers.find(c => c.id === id);


    if (!customer) return;


    const confirmDelete =
        confirm(
            `Delete ${customer.name}?`
        );


    if (!confirmDelete) return;


    customers =
        customers.filter(
            c => c.id !== id
        );


    saveData();

    refreshAll();

}


// ==========================================
// TODAY COLLECTION
// ==========================================

function getTodayCollection() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    let total = 0;


    customers.forEach(customer => {

        customer.payments.forEach(payment => {

            if (payment.date === today) {

                total += Number(payment.amount);

            }

        });

    });


    return total;

}


// ==========================================
// MONTH COLLECTION
// ==========================================

function getMonthCollection(year, month) {

    let total = 0;


    customers.forEach(customer => {

        customer.payments.forEach(payment => {

            const d =
                new Date(payment.date);


            if (
                d.getFullYear() === year &&
                d.getMonth() === month
            ) {

                total += Number(payment.amount);

            }

        });

    });


    return total;

}


// ==========================================
// MONTH PENDING
// ==========================================

function getMonthPending(year, month) {

    let expected = 0;

    let received = 0;


    customers.forEach(customer => {

        const loanDate =
            new Date(customer.loanDate);


        for (
            let i = 0;
            i < customer.months;
            i++
        ) {

            const dueDate =
                new Date(
                    loanDate.getFullYear(),
                    loanDate.getMonth() + i,
                    loanDate.getDate()
                );


            if (
                dueDate.getFullYear() === year &&
                dueDate.getMonth() === month
            ) {

                expected += customer.monthlyPayment;

            }

        }


        customer.payments.forEach(payment => {

            const d =
                new Date(payment.date);


            if (
                d.getFullYear() === year &&
                d.getMonth() === month
            ) {

                received += Number(payment.amount);

            }

        });

    });


    return Math.max(
        0,
        expected - received
    );

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const today =
        getTodayCollection();


    const now =
        new Date();


    const month =
        getMonthCollection(
            now.getFullYear(),
            now.getMonth()
        );


    const pending =
        getMonthPending(
            now.getFullYear(),
            now.getMonth()
        );


    let totalPending = 0;


    customers.forEach(customer => {

        totalPending += balance(customer);

    });


    document.getElementById("todayCollection")
        .textContent = money(today);


    document.getElementById("monthCollection")
        .textContent = money(month);


    document.getElementById("monthPending")
        .textContent = money(pending);


    document.getElementById("totalPending")
        .textContent = money(totalPending);


    document.getElementById("totalCustomers")
        .textContent = customers.length;

}


// ==========================================
// MONTH VIEW
// ==========================================

function updateSelectedMonth() {

    const year =
        selectedMonthDate.getFullYear();

    const month =
        selectedMonthDate.getMonth();


    const monthName =
        selectedMonthDate.toLocaleString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById("selectedMonth")
        .textContent = monthName;


    const collection =
        getMonthCollection(
            year,
            month
        );


    document.getElementById(
        "selectedMonthCollection"
    ).textContent =
        money(collection);

}


// ==========================================
// CHANGE MONTH
// ==========================================

function changeMonth(direction) {

    selectedMonthDate.setMonth(
        selectedMonthDate.getMonth() + direction
    );


    updateSelectedMonth();

}


// ==========================================
// VIEW ALL CUSTOMERS
// ==========================================

function showAllCustomers() {

    document.getElementById("searchCustomer").value = "";

    displayCustomers();

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });

}


// ==========================================
// EXCEL EXPORT
// ==========================================

function exportExcel() {

    if (customers.length === 0) {

        alert("No customers to export");

        return;

    }


    let csv =
        "No,Customer Name,Phone,Loan Amount,Interest %,Total Payable,Total Paid,Balance,Loan Date,Status\n";


    customers.forEach((customer, index) => {

        const paid =
            totalPaid(customer);

        const remaining =
            balance(customer);

        const status =
            remaining === 0
                ? "Completed"
                : "Pending";


        csv +=
            `${index + 1},` +
            `"${customer.name}",` +
            `"${customer.phone}",` +
            `${customer.loanAmount},` +
            `${customer.interest},` +
            `${customer.totalPayable.toFixed(2)},` +
            `${paid.toFixed(2)},` +
            `${remaining.toFixed(2)},` +
            `${customer.loanDate},` +
            `${status}\n`;

    });


    const blob =
        new Blob(
            ["\ufeff" + csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "Finance_Customers.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


// ==========================================
// REFRESH EVERYTHING
// ==========================================

function refreshAll() {

    displayCustomers();

    updateCustomerDropdown();

    updateDashboard();

    updateSelectedMonth();

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshAll();

    }
);