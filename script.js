// Inputs
const nameInput = document.getElementById("name");
const businessInput = document.getElementById("business-name");
const emailInput = document.getElementById("email");
const clientNameInput = document.getElementById("client-name");
const clientBusinessInput = document.getElementById("client-business-name");
const clientEmailInput = document.getElementById("client-email");
const invoiceNumberInput = document.getElementById("invoice-number");
const invoiceDateInput = document.getElementById("invoice-date");
const dueDateInput = document.getElementById("due-date");
const notesInput = document.getElementById("notes");

// Preview update
function updatePreview() {
  document.getElementById("preview-name").textContent = nameInput.value;
  document.getElementById("preview-email").textContent = emailInput.value;
  document.getElementById("preview-business").textContent = businessInput.value;
  document.getElementById("preview-client-name").textContent =
    clientNameInput.value;
  document.getElementById("preview-client-business").textContent =
    clientBusinessInput.value;
  document.getElementById("preview-client-email").textContent =
    clientEmailInput.value;
  document.getElementById("preview-invoice-number").textContent =
    invoiceNumberInput.value ? "Invoice #: " + invoiceNumberInput.value : "";
  document.getElementById("preview-invoice-date").textContent =
    invoiceDateInput.value ? "Date: " + invoiceDateInput.value : "";
  document.getElementById("preview-due-date").textContent = dueDateInput.value
    ? "Due: " + dueDateInput.value
    : "";
  document.getElementById("preview-notes").textContent = notesInput.value;
}

// Listeners
nameInput.addEventListener("input", updatePreview);
emailInput.addEventListener("input", updatePreview);
businessInput.addEventListener("input", updatePreview);
clientNameInput.addEventListener("input", updatePreview);
clientBusinessInput.addEventListener("input", updatePreview);
clientEmailInput.addEventListener("input", updatePreview);
invoiceNumberInput.addEventListener("input", updatePreview);
invoiceDateInput.addEventListener("input", updatePreview);
dueDateInput.addEventListener("input", updatePreview);
notesInput.addEventListener("input", updatePreview);

// Calculate total
function calculateTotal() {
  const descriptions = document.querySelectorAll(".item-description");

  const quantities = document.querySelectorAll(".item-quantity");

  const prices = document.querySelectorAll(".item-price");

  const currency = document.getElementById("currency").value;

  const taxPercent = parseFloat(document.getElementById("tax").value) || 0;

  const discountPercent =
    parseFloat(document.getElementById("discount").value) || 0;

  const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
  };

  const symbol = symbols[currency] || currency;

  let subtotal = 0;
  let tableHTML = "";

  quantities.forEach((qty, index) => {
    const desc = descriptions[index].value || "-";

    const quantity = parseFloat(qty.value) || 0;

    const price = parseFloat(prices[index].value) || 0;

    const rowTotal = quantity * price;

    subtotal += rowTotal;

    tableHTML += `
      <tr>
        <td>${desc}</td>
        <td>${quantity}</td>
        <td>${symbol}${price.toFixed(2)}</td>
        <td>${symbol}${rowTotal.toFixed(2)}</td>
      </tr>
    `;
  });

  const discountAmount = (subtotal * discountPercent) / 100;

  const afterDiscount = subtotal - discountAmount;

  const taxAmount = (afterDiscount * taxPercent) / 100;

  const grandTotal = afterDiscount + taxAmount;

  document.getElementById("preview-items").innerHTML = tableHTML;

  document.getElementById("preview-total").innerHTML = `
      <div>Subtotal: ${symbol}${subtotal.toFixed(2)}</div>
      <div>Discount: -${symbol}${discountAmount.toFixed(2)}</div>
      <div>Tax: ${symbol}${taxAmount.toFixed(2)}</div>
      <hr>
      <strong>Total: ${symbol}${grandTotal.toFixed(2)}</strong>
  `;
}
document.getElementById("item-rows").addEventListener("input", calculateTotal);
document.getElementById("currency").addEventListener("change", calculateTotal);
document.getElementById("tax").addEventListener("input", calculateTotal);

// Add item
document.getElementById("add-item").addEventListener("click", function () {
  const itemRows = document.getElementById("item-rows");

  const newRow = document.createElement("div");

  newRow.classList.add("item-row");

  newRow.innerHTML = `
      <label>Item Description:</label>
      <input type="text" class="item-description" />

      <label>Item Quantity:</label>
      <input type="number" class="item-quantity" />

      <label>Item Price:</label>
      <input type="number" class="item-price" step="0.01" />

      <button type="button" class="remove-item">
        Remove Item
      </button>
  `;

  itemRows.appendChild(newRow);

  newRow.querySelector(".remove-item").addEventListener("click", () => {
    newRow.remove();
    calculateTotal();
    saveFormData();
  });

  newRow.addEventListener("input", () => {
    calculateTotal();
    saveFormData();
  });
});

// Logo
document.getElementById("logo-upload").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const logo = document.getElementById("preview-logo");
    logo.src = e.target.result;
    logo.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// Print
document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});
if (!invoiceNumberInput.value) {
  const random = Math.floor(1000 + Math.random() * 9000);

  invoiceNumberInput.value = `INV-${new Date().getFullYear()}-${random}`;

  updatePreview();
}
function saveFormData() {
  const data = {
    name: nameInput.value,
    business: businessInput.value,
    email: emailInput.value,

    clientName: clientNameInput.value,

    clientBusiness: clientBusinessInput.value,

    clientEmail: clientEmailInput.value,

    invoiceNumber: invoiceNumberInput.value,

    invoiceDate: invoiceDateInput.value,

    dueDate: dueDateInput.value,

    notes: notesInput.value,

    tax: document.getElementById("tax").value,

    discount: document.getElementById("discount").value,

    currency: document.getElementById("currency").value,
  };

  localStorage.setItem("invoiceDraft", JSON.stringify(data));
}

function loadFormData() {
  const saved = localStorage.getItem("invoiceDraft");

  if (!saved) return;

  const data = JSON.parse(saved);

  nameInput.value = data.name || "";

  businessInput.value = data.business || "";

  emailInput.value = data.email || "";

  clientNameInput.value = data.clientName || "";

  clientBusinessInput.value = data.clientBusiness || "";

  clientEmailInput.value = data.clientEmail || "";

  invoiceNumberInput.value = data.invoiceNumber || "";

  invoiceDateInput.value = data.invoiceDate || "";

  dueDateInput.value = data.dueDate || "";

  notesInput.value = data.notes || "";

  document.getElementById("tax").value = data.tax || "";

  document.getElementById("discount").value = data.discount || "";

  document.getElementById("currency").value = data.currency || "USD";

  updatePreview();
  calculateTotal();
}

document.querySelectorAll("input,textarea,select").forEach((el) => {
  el.addEventListener("input", saveFormData);
});

loadFormData();

const companyAddressInput = document.getElementById("company-address");

const clientAddressInput = document.getElementById("client-address");

const paymentStatusInput = document.getElementById("payment-status");

const paymentMethodInput = document.getElementById("payment-method");

const termsInput = document.getElementById("terms");

/* =========================
   EXTEND PREVIEW
========================= */

const oldUpdatePreview = updatePreview;

updatePreview = function () {
  oldUpdatePreview();

  document.getElementById("preview-company-address").textContent =
    companyAddressInput?.value || "";

  document.getElementById("preview-client-address").textContent =
    clientAddressInput?.value || "";

  document.getElementById("preview-status").textContent =
    paymentStatusInput?.value || "";

  document.getElementById("preview-payment-method").innerHTML =
    "<strong>Payment Method:</strong> " + (paymentMethodInput?.value || "");

  document.getElementById("preview-terms").innerHTML =
    "<strong>Terms & Conditions:</strong><br>" + (termsInput?.value || "");
};

/* =========================
   NEW LISTENERS
========================= */

[
  companyAddressInput,
  clientAddressInput,
  paymentStatusInput,
  paymentMethodInput,
  termsInput,
].forEach((el) => {
  if (!el) return;

  el.addEventListener("input", updatePreview);
});

/* =========================
   SAVE DRAFT BUTTON
========================= */

const saveBtn = document.getElementById("save-draft-btn");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveFormData();

    alert("Draft Saved Successfully");
  });
}

/* =========================
   ANALYTICS
========================= */

function updateAnalytics() {
  const totalInvoices = Number(localStorage.getItem("totalInvoices")) || 0;

  document.getElementById("total-invoices").textContent = totalInvoices;
}

updateAnalytics();

/* =========================
   AUTO INVOICE NUMBER
========================= */

if (!localStorage.getItem("invoiceGenerated")) {
  const invoiceCount = (Number(localStorage.getItem("totalInvoices")) || 0) + 1;

  localStorage.setItem("totalInvoices", invoiceCount);

  localStorage.setItem("invoiceGenerated", "true");

  invoiceNumberInput.value = `INV-${new Date().getFullYear()}-${invoiceCount}`;

  updatePreview();
}

/* =========================
   DARK MODE
========================= */

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    document.body.classList.add("dark");

    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark");

    localStorage.setItem(
      "theme",

      document.body.classList.contains("dark") ? "dark" : "light",
    );
  });
}
document.getElementById('theme-label').textContent = 
  document.body.classList.contains('dark') ? 'Dark' : 'Light';

/* =========================
   REMOVE FIRST ITEM
========================= */

document.querySelectorAll(".remove-item").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (document.querySelectorAll(".item-row").length > 1) {
      this.parentElement.remove();

      calculateTotal();
    }
  });
});

/* =========================
   PDF EXPORT
========================= */

document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});

/* =========================
   LOAD EXTRA FIELDS
========================= */

const oldLoad = loadFormData;

loadFormData = function () {
  oldLoad();

  const saved = JSON.parse(localStorage.getItem("invoiceDraft"));

  if (!saved) return;

  companyAddressInput.value = saved.companyAddress || "";

  clientAddressInput.value = saved.clientAddress || "";

  paymentStatusInput.value = saved.paymentStatus || "Draft";

  paymentMethodInput.value = saved.paymentMethod || "";

  termsInput.value = saved.terms || "";

  updatePreview();
};

/* =========================
   EXTEND SAVE
========================= */

const originalSave = saveFormData;

saveFormData = function () {
  originalSave();

  const data = JSON.parse(localStorage.getItem("invoiceDraft"));

  data.companyAddress = companyAddressInput.value;

  data.clientAddress = clientAddressInput.value;

  data.paymentStatus = paymentStatusInput.value;

  data.paymentMethod = paymentMethodInput.value;

  data.terms = termsInput.value;

  localStorage.setItem("invoiceDraft", JSON.stringify(data));
};

updatePreview();
calculateTotal();
// FEEDBACK POPUP
setTimeout(() => {
  const shown = localStorage.getItem('feedbackShown');
  if (!shown) {
    const overlay = document.getElementById('feedback-overlay');
    overlay.style.display = 'flex';
  }
}, 45000); // 45 seconds baad show hoga

document.querySelectorAll('.fb-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const answer = this.getAttribute('data-val');
    localStorage.setItem('feedbackShown', 'true');
    document.getElementById('feedback-overlay').style.display = 'none';
    
    // GA4 event
    gtag('event', 'feedback_submitted', {
      'answer': answer
    });

    alert('Thanks for your feedback! 🙏');
  });
});

document.getElementById('feedback-skip').addEventListener('click', () => {
  localStorage.setItem('feedbackShown', 'true');
  document.getElementById('feedback-overlay').style.display = 'none';
});
