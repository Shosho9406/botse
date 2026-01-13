const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/orders', {
      productId: 'open-slouchy',
      variant: 'one',
      quantity: 1,
      name: 'Test User',
      phone: '0790000000',
      address: '123 Test St',
      notes: 'Test order'
    });
    console.log('Test order response:', res.data);
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.message);
    if (err.response) console.error(err.response.data);
    process.exit(1);
  }
})();
