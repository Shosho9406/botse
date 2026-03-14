// Global products reference
let allProducts = [];

// Discount codes configuration
const discountCodes = {
  'NEWSLETTER10': { type: 'percentage', value: 10, description: '10% off for newsletter subscribers' },
  'WELCOME15': { type: 'percentage', value: 15, description: '15% welcome discount' },
  'WELCOME30': { type: 'percentage', value: 30, description: '30% welcome discount' },
  'SAVE20': { type: 'percentage', value: 20, description: '20% special savings' }
};

// Validate discount code
function validateDiscountCode(code) {
  if (!code || !code.trim()) return null;
  const upperCode = code.trim().toUpperCase();
  return discountCodes[upperCode] || null;
}

// Client-side JS to handle orders and payments
document.addEventListener('DOMContentLoaded', async () => {
  // Load all products first
  try {
    const res = await fetch(apiUrl('/api/products'));
    allProducts = await res.json();
  } catch (err) {
    console.error('Failed to load products:', err);
  }

  // Handle order form (order.html)
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    initializeOrderForm();
  }

  // Handle payment page (payment.html)
  const paymentInfo = document.getElementById('paymentInfo');
  if (paymentInfo) {
    initializePaymentPage();
  }
});

// ======== ORDER FORM ========
function initializeOrderForm() {
  const form = document.getElementById('orderForm');
  const productSelect = document.getElementById('product');
  const variantInput = document.getElementById('variant');
  const quantityInput = document.getElementById('quantity');
  const discountCodeInput = document.getElementById('discountCode');
  const resultDiv = document.getElementById('result');
  const priceInfo = document.getElementById('priceInfo');
  const unitPriceSpan = document.getElementById('unitPrice');
  const totalPriceSpan = document.getElementById('totalPrice');
  const depositPriceSpan = document.getElementById('depositPrice');

  // Populate products
  allProducts.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    productSelect.appendChild(opt);
  });

  // Real-time price calculation
  function updatePrice() {
    if (!productSelect.value) {
      priceInfo.style.display = 'none';
      return;
    }

    const product = allProducts.find(p => p.id === productSelect.value);
    if (!product) return;

    const variant = variantInput.value || '';
    const quantity = Math.max(1, parseInt(quantityInput.value) || 1);
    const discountCode = discountCodeInput.value.trim();

    let unitPrice = 0;
    if (variant && product.prices[variant]) {
      unitPrice = product.prices[variant];
    } else if (product.prices.one) {
      unitPrice = product.prices.one;
    } else if (product.prices.base) {
      unitPrice = product.prices.base;
    } else {
      unitPrice = Object.values(product.prices)[0] || 0;
    }

    let subtotal = unitPrice * quantity;
    let discountAmount = 0;
    let discountInfo = '';

    // Apply discount if valid code is entered
    const discount = validateDiscountCode(discountCode);
    if (discount) {
      if (discount.type === 'percentage') {
        discountAmount = Math.round((subtotal * discount.value / 100) * 100) / 100;
        discountInfo = ` (${discount.value}% off: -R${discountAmount.toFixed(2)})`;
      }
    }

    const total = subtotal - discountAmount;
    const deposit = Math.round((total * 0.5) * 100) / 100;

    unitPriceSpan.textContent = unitPrice.toFixed(2);
    totalPriceSpan.textContent = total.toFixed(2) + discountInfo;
    depositPriceSpan.textContent = deposit.toFixed(2);
    priceInfo.style.display = 'block';
  }

  productSelect.addEventListener('change', updatePrice);
  variantInput.addEventListener('input', updatePrice);
  quantityInput.addEventListener('change', updatePrice);
  discountCodeInput.addEventListener('input', updatePrice);

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    resultDiv.textContent = '';
    resultDiv.classList.remove('success', 'error');

    try {
      const formData = new FormData(form);
      const body = {};
      formData.forEach((v, k) => (body[k] = v));

      // Validation
      if (!body.name || body.name.trim().length < 2) {
        throw new Error('Please enter a valid name');
      }
      if (!body.phone || body.phone.trim().length < 6) {
        throw new Error('Please enter a valid phone number');
      }
      if (!body.productId) {
        throw new Error('Please select a product');
      }

      body.quantity = Math.max(1, parseInt(body.quantity) || 1);

      const resp = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to place order');

      resultDiv.classList.add('success');
      resultDiv.textContent = `✓ Order placed! Redirecting to payment page...`;
      setTimeout(() => {
        window.location.href = `/payment.html?orderId=${data.id}`;
      }, 1500);
    } catch (err) {
      resultDiv.classList.add('error');
      resultDiv.textContent = `✗ ${err.message}`;
      submitBtn.disabled = false;
    }
  });
}

// ======== PAYMENT PAGE ========
function initializePaymentPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const orderSummary = document.getElementById('orderSummary');
  const paymentInfo = document.getElementById('paymentInfo');
  const errorBox = document.getElementById('errorBox');

  if (!orderId) {
    showError('No order selected. Please place an order first.');
    return;
  }

  loadAndDisplayOrder(orderId);

  async function loadAndDisplayOrder(id) {
    try {
      const resp = await fetch(apiUrl(`/api/orders/${id}`));
      const data = await resp.json();

      if (data.error) {
        showError(data.error);
        return;
      }

      const o = data.order;
      const deposit = Math.round((o.total * 0.5) * 100) / 100;

      // Display order summary
      orderSummary.style.display = 'block';
      orderSummary.innerHTML = `
        <div class="summary-row">
          <strong>Order ID:</strong> <span>#${o.id}</span>
        </div>
        <div class="summary-row">
          <strong>Product:</strong> <span>${o.productName}</span>
        </div>
        ${o.variant ? `<div class="summary-row"><strong>Variant:</strong> <span>${o.variant}</span></div>` : ''}
        <div class="summary-row">
          <strong>Quantity:</strong> <span>${o.quantity}</span>
        </div>
        <div class="summary-row">
          <strong>Unit Price:</strong> <span>R${o.unitPrice.toFixed(2)}</span>
        </div>
        <div class="summary-total">
          <strong>Total Order Value:</strong> <span>R${o.total.toFixed(2)}</span>
        </div>
      `;

      // Display deposit section
      let paymentHTML = `
        <div class="deposit-section">
          <h3>💰 Payment Required</h3>
          <p>A 50% deposit is required to confirm your order.</p>
          <div class="deposit-amount">R${deposit.toFixed(2)}</div>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">After paying, send proof of payment via WhatsApp.</p>
        </div>
      `;

      // Payment methods
      paymentHTML += `
        <h3>Payment Methods</h3>
        <div class="payment-methods">
          <div class="payment-method">
            <h3>💳 Bank Transfer (IMMEDIATE PAYMENT REQUIRED)</h3>
            <p>Pay directly into our bank account immediately:</p>
            <div class="bank-details">
              <p><strong>Bank:</strong> Standard Bank</p>
              <p><strong>Account Name:</strong> Masego Magane</p>
              <p><strong>Account Number:</strong> 1024 9020 627</p>
              <p style="color:#c7758a;font-weight:700;margin-top:0.8rem;">⚠️ Immediate payment required to confirm your order</p>
            </div>
          </div>
          <div class="payment-method">
            <h3>📱 WhatsApp Payment</h3>
            <p>Chat with us to arrange payment and send proof via WhatsApp:</p>
            <a href="https://wa.me/27695895793?text=Hi%20I%20would%20like%20to%20pay%20for%20order%20${o.id}" target="_blank" class="btn whatsapp" style="width: 100%; margin-top: 1rem;">Open WhatsApp</a>
          </div>
        </div>
      `;

      if (o.paymentReceived) {
        paymentHTML += `
          <div class="status-paid">
            <strong>✓ Payment Received!</strong><br/>
            Thank you! We've received your payment and will start production on your order shortly. We'll keep you updated via WhatsApp.
          </div>
        `;
      } else {
        paymentHTML += `
          <div class="instructions">
            <h4>📋 Next Steps:</h4>
            <ol>
              <li>Choose a payment method above</li>
              <li>Send payment of R${deposit.toFixed(2)}</li>
              <li>Send proof of payment via WhatsApp: <a href="https://wa.me/27695895793" target="_blank">+27 69 589 5793</a></li>
              <li>We'll confirm receipt and start production</li>
              <li>You'll receive updates as we complete your order</li>
            </ol>
          </div>
        `;
      }

      paymentInfo.innerHTML = paymentHTML;
    } catch (err) {
      console.error(err);
      showError('Failed to load order details');
    }
  }

  function showError(msg) {
    errorBox.style.display = 'block';
    errorBox.className = 'error-box';
    errorBox.innerHTML = `<strong>⚠️ Error:</strong> ${msg}`;
  }
}
