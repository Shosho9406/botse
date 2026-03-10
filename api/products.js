// Vercel serverless function for products
const products = [
  { id: 'open-slouchy', name: 'Open Slouchy', prices: { one: 120, two: 150, three: 180, custom: 200 } },
  { id: 'normal-slouchy', name: 'Normal Slouchy', prices: { one: 180, two: 200, three: 230, custom: 280 } },
  { id: 'big-slouchy', name: 'Big Slouchy', prices: { one: 250, two: 270, three: 290, custom: 320 } },

  // Ruffle hats added per customer request
  { id: 'ruffle-small', name: 'Ruffle Hat (Small)', prices: { one: 200, two: 220, three: 240, custom: 260 } },
  { id: 'ruffle-medium', name: 'Ruffle Hat (Medium)', prices: { one: 280, two: 300, three: 320, custom: 340 } },
  { id: 'ruffle-large', name: 'Ruffle Hat (Large)', prices: { one: 350, two: 370, three: 390, custom: 410 } },
  { id: 'ruffle-xl', name: 'Ruffle Hat (XL)', prices: { one: 420, two: 440, three: 460, custom: 480 } },

  // Scrunchies
  { id: 'standard-scrunchie', name: 'Standard Scrunchie', prices: { one: 20, two: 50, three: 90 } },
  { id: 'premium-scrunchie', name: 'Premium Scrunchie', prices: { one: 80, two: 100, custom: 130 } }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json(products);
}