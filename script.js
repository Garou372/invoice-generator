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
        <td>${currency} ${price.toFixed(2)}</td>
        <td>${currency} ${rowTotal.toFixed(2)}</td>
      </tr>
    `;
  });

  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = subtotal + taxAmount;

  document.getElementById("preview-items").innerHTML = tableHTML;
  document.getElementById("preview-total").innerHTML = `
    <span>Subtotal: ${currency} ${subtotal.toFixed(2)}</span><br>
    <span>Tax (${taxPercent}%): ${currency} ${taxAmount.toFixed(2)}</span><br>
    <strong>Total: ${currency} ${grandTotal.toFixed(2)}</strong>
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
  `;
  itemRows.appendChild(newRow);
  newRow.addEventListener("input", calculateTotal);
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
