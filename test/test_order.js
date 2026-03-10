const axios = require('axios');
(async () => {
  try {
    // original slouchy test
    let res = await axios.post('http://localhost:3000/api/orders', {
      productId: 'open-slouchy',
      variant: 'one',
      quantity: 1,
      name: 'Test User',
      phone: '0790000000',
      address: '123 Test St',
      notes: 'Test order'
    });
    console.log('Slouchy order response:', res.data);

    // new ruffle sample order with discount
    res = await axios.post('http://localhost:3000/api/orders', {
      productId: 'ruffle-small',
      variant: 'two',
      quantity: 2,
      name: 'Ruffle Tester',
      phone: '0791111111',
      address: '456 Sample Ave',
      notes: 'Testing ruffle hat pricing with discount',
      discountCode: 'NEWSLETTER10'
    });
    console.log('Ruffle order with discount response:', res.data);

    // test WELCOME30 discount
    res = await axios.post('http://localhost:3000/api/orders', {
      productId: 'ruffle-medium',
      variant: 'three',
      quantity: 1,
      name: 'Welcome Tester',
      phone: '0792222222',
      address: '789 Welcome St',
      notes: 'Testing WELCOME30 discount',
      discountCode: 'WELCOME30'
    });
    console.log('Ruffle order with WELCOME30 discount response:', res.data);

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.message);
    if (err.response) console.error(err.response.data);
    process.exit(1);
  }
})();
