function printReceipt (barCodeInCar) {
    var groupedItem={};
    var allItems = loadAllItems();
    var promotionsItems = loadPromotions();
    var filteredItems;
    var result;
    var total=0;
    var totalBeforePromotion=0;
    //group item
    barCodeInCar.filter(items=>{
        groupedItem[items] = 0;
    });
    barCodeInCar.filter(items=>{
        let splitedItem=[];
        splitedItem = items.split('-');
        if(splitedItem.length==1){
            groupedItem[items]++;
        }
        else{
            if(groupedItem[splitedItem[0]]==null){
                groupedItem[splitedItem[0]] = groupedItem[items];
            }
            
            groupedItem[splitedItem[0]] += parseFloat(splitedItem[1]);
            delete groupedItem[items];

        }     
    });

    //filter item from allitems
    filteredItems= allItems.filter(item=>{
        if(item.barcode in groupedItem){
            return item;
        }
    });

    //map count to filtered items
    filteredItems.map(items=>items.count = groupedItem[items.barcode]);

    //map Promotion to filtered items
    filteredItems.map(items=>{
        if(promotionsItems[0].barcodes.includes(items.barcode)){
            if(items.count>=2){
                items.realCount = items.count-1;
            }
            else{
                items.realCount = items.count;
            }
        }
        else{
            items.realCount = items.count;
        }
    });

    //using filtered items to format string
    result = '***<store earning no money>Receipt ***\n';
    filteredItems.forEach(items=>{
        var newUnit;
        if(!(items.unit==='kg')){
            if(items.count>1){
                newUnit=items.unit+'s';
            }
            else{
                newUnit = items.unit;
            }
            result += 'Name: '+items.name+', Quantity: '+items.count+' '+newUnit+', Unit price: '+items.price.toFixed(2)+' (yuan), Subtotal: '+(items.realCount*items.price).toFixed(2)+' (yuan)\n';
        }
        else{
            result += 'Name: '+items.name+', Quantity: '+items.count+' '+items.unit+', Unit price: '+items.price.toFixed(2)+' (yuan), Subtotal: '+(items.realCount*items.price).toFixed(2)+' (yuan)\n';
        }
        total+=items.realCount*items.price;
        totalBeforePromotion+=items.count*items.price;

    });
    result +='----------------------\n' + 'Total: '+total.toFixed(2)+' (yuan)\n' + 'Saving: '+(totalBeforePromotion-total).toFixed(2)+' (yuan)\n'+'**********************';
    return result;
}

function CalulateSubTotal(){
    
}

function groupItem(){

}

function loadAllItems() {
    return [
      {
        barcode: 'ITEM000000',
        name: 'Coca-Cola',
        unit: 'bottle',
        price: 3.00
      },
      {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        price: 3.00
      },
      {
        barcode: 'ITEM000002',
        name: 'Apple',
        unit: 'kg',
        price: 5.50
      },
      {
        barcode: 'ITEM000003',
        name: 'Litchi',
        unit: 'kg',
        price: 15.00
      },
      {
        barcode: 'ITEM000004',
        name: 'Battery',
        unit: 'box',
        price: 2.00
      },
      {
        barcode: 'ITEM000005',
        name: 'Noodles',
        unit: 'bag',
        price: 4.50
      }
    ];
  }
  
  function loadPromotions() {
    return [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
  }

module.exports = printReceipt;