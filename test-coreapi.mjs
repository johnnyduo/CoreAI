// Test script for Core DAO API
console.log('Testing Core DAO API...');

import { getRecentWhaleTransactions, getCorePrice } from './src/lib/coreDAOService.js';

(async () => {
  try {
    console.log('Fetching Core price...');
    const price = await getCorePrice();
    console.log('Core price:', price);
    
    console.log('Fetching whale transactions...');
    const transactions = await getRecentWhaleTransactions(50000, 5, price);
    console.log('Whale transactions:', transactions);
    
    if (transactions.length > 0) {
      console.log('✅ Successfully fetched real whale transactions!');
    } else {
      console.log('⚠️ No whale transactions found');
    }
  } catch (error) {
    console.error('❌ Error testing Core DAO API:', error);
  }
})();
