import { formatCurrency } from '../scripts/utils/money.js';

console.log('test suite: formatCurrency');

console.log('converts cents to dollars');

if (formatCurrency(2095) === '20.95') {
  console.log('formatCurrency test passed');
} else {
  console.log('formatCurrency test failed');
}

console.log('works with 0');

if (formatCurrency(0) === '0.00') {
  console.log('formatCurrency test passed');
} else {
  console.log('formatCurrency test failed');
}

console.log('rounds to nearest cent');

if (formatCurrency(2000.5) === '20.01') {
  console.log('formatCurrency test passed');
} else {
  console.log('formatCurrency test failed');
}
/*
if (formatCurrency(2000.4) === '20.00') {
  console.log('formatCurrency test passed');
} else {
  console.log('formatCurrency test failed');
}
*/