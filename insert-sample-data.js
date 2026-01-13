// Insert sample orders for testing admin dashboard
const db = require('./db');

const sampleOrders = [
  {
    productId: '1',
    productName: 'Slouchy Beanies',
    variant: 'Open Slouchy - Red & White',
    quantity: 1,
    unitPrice: 150,
    total: 150,
    name: 'Thandi Khumalo',
    phone: '0695895793',
    address: '123 Main Street, Johannesburg',
    notes: 'Gift for sister',
    createdAt: new Date('2026-01-10').toISOString(),
    status: 'pending',
    paymentReceived: 0,
    depositAmount: 75
  },
  {
    productId: '1',
    productName: 'Slouchy Beanies',
    variant: 'Normal Slouchy - Purple & Black',
    quantity: 2,
    unitPrice: 200,
    total: 400,
    name: 'Naledi Mthembu',
    phone: '0798765432',
    address: '456 Oak Avenue, Cape Town',
    notes: 'Bulk order for store',
    createdAt: new Date('2026-01-11').toISOString(),
    status: 'paid',
    paymentReceived: 400,
    depositAmount: 200
  },
  {
    productId: '2',
    productName: 'Scrunchies',
    variant: 'Large - Pink',
    quantity: 5,
    unitPrice: 50,
    total: 250,
    name: 'Amara Johnson',
    phone: '0681234567',
    address: '789 Pine Road, Durban',
    notes: 'Birthday gift set',
    createdAt: new Date('2026-01-11').toISOString(),
    status: 'pending',
    paymentReceived: 0,
    depositAmount: 125
  },
  {
    productId: '1',
    productName: 'Slouchy Beanies',
    variant: 'Big Slouchy - Custom Colors',
    quantity: 1,
    unitPrice: 320,
    total: 320,
    name: 'Zanele Ndlela',
    phone: '0765432109',
    address: '321 Elm Street, Pretoria',
    notes: 'Custom 4-color design',
    createdAt: new Date('2026-01-12').toISOString(),
    status: 'pending',
    paymentReceived: 0,
    depositAmount: 160
  },
  {
    productId: '2',
    productName: 'Scrunchies',
    variant: 'Medium - Blue',
    quantity: 3,
    unitPrice: 35,
    total: 105,
    name: 'Precious Mokwena',
    phone: '0712345678',
    address: '654 Birch Lane, Bloemfontein',
    notes: '',
    createdAt: new Date('2026-01-12').toISOString(),
    status: 'paid',
    paymentReceived: 105,
    depositAmount: 52.50
  },
  {
    productId: '1',
    productName: 'Slouchy Beanies',
    variant: 'Open Slouchy - Green & Yellow',
    quantity: 1,
    unitPrice: 150,
    total: 150,
    name: 'Lerato Dlamini',
    phone: '0723456789',
    address: '987 Spruce Way, Soweto',
    notes: 'Casual wear',
    createdAt: new Date('2026-01-12').toISOString(),
    status: 'pending',
    paymentReceived: 0,
    depositAmount: 75
  }
];

async function insertSampleData() {
  for (const order of sampleOrders) {
    try {
      await db.insertOrder(order);
      console.log(`✅ Inserted order for ${order.name}`);
    } catch (err) {
      console.error(`❌ Error inserting order for ${order.name}:`, err.message);
    }
  }
  console.log('\n✅ Sample data insertion complete!');
  console.log('Navigate to http://localhost:3000/admin.html to see the dashboard');
  process.exit(0);
}

insertSampleData();
