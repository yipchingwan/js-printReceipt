const printReciept = require('../main');
var itemBarCodeInCart = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2.5',
    'ITEM000005',
    'ITEM000005-2',
  ];

var expectedString = '***<store earning no money>Receipt ***\n'+
'Name: Sprite, Quantity: 5 bottles, Unit price: 3.00 (yuan), Subtotal: 12.00 (yuan)\n'+
'Name: Litchi, Quantity: 2.5 kg, Unit price: 15.00 (yuan), Subtotal: 37.50 (yuan)\n'+
'Name: Noodles, Quantity: 3 bags, Unit price: 4.50 (yuan), Subtotal: 9.00 (yuan)\n'+
'----------------------\n'+
'Total: 58.50 (yuan)\n'+
'Saving: 7.50 (yuan)\n'+
'**********************';

it ('should add two numbers', () => {
    expect(printReciept(itemBarCodeInCart)).toBe(expectedString);
});










