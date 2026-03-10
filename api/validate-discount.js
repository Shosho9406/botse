// Vercel serverless function for discount validation
const discountCodes = {
  'NEWSLETTER10': { type: 'percentage', value: 10, description: '10% off for newsletter subscribers' },
  'WELCOME15': { type: 'percentage', value: 15, description: '15% welcome discount' },
  'WELCOME30': { type: 'percentage', value: 30, description: '30% welcome discount' },
  'SAVE20': { type: 'percentage', value: 20, description: '20% special savings' }
};

function validateDiscountCode(code) {
  if (!code || !code.trim()) return null;
  const upperCode = code.trim().toUpperCase();
  return discountCodes[upperCode] || null;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body || {};
  const discount = validateDiscountCode(code);
  if (discount) {
    res.status(200).json(discount);
  } else {
    res.status(400).json({ error: 'Invalid discount code' });
  }
}