function printReceipt (barCodeInCar) {    
    const barCodeWithCount= groupItem(barCodeInCar);
    const filtereditemsWithCount = addCountToFilterItems(barCodeWithCount, loadAllItems);
    const itemWithCountAndSubTotal = addSubTotalToItems(filtereditemsWithCount,loadPromotions, "BUY_TWO_GET_ONE_FREE");
    const totalAndSaving = calTotalAndSaving(itemWithCountAndSubTotal);
    const receipt = formatReceipt(itemWithCountAndSubTotal, totalAndSaving);
    return receipt;
}

function groupItem(barCodeInCar){
	  // make object to store items with count
    var itemWithCount = {}
    barCodeInCar.filter((item,i)=>barCodeInCar.indexOf(item)===i).map(item=>{
    		itemWithCount[item] = barCodeInCar.filter(x=>item===x).length;
    });

    //Find out the items with '-', and change there count
    Object.keys(itemWithCount).forEach(barcode=>{
    	var splitedItem = barcode.split('-');
    	if(splitedItem.length>1){
    		if(itemWithCount[splitedItem[0]]==null){
    			itemWithCount[splitedItem[0]] = itemWithCount[barcode];
    			itemWithCount[splitedItem[0]] = parseFloat(splitedItem[1]);
    		}
    		else{
    			itemWithCount[splitedItem[0]] += parseFloat(splitedItem[1]);
    		}
    		delete itemWithCount[barcode];
    	}
    });
    return itemWithCount
}

function addCountToFilterItems(barCodeWithCount, loadAllItemsFn){	
	const filteredItems = filterItemsFromAll(barCodeWithCount,loadAllItemsFn); 
	return filteredItems.map(items=>{
			items.count = barCodeWithCount[items.barcode];
			return items;
	});
}

function filterItemsFromAll(barCodeWithCount,loadAllItemsFn){
	 return loadAllItemsFn().filter(item=>item.barcode in barCodeWithCount);
}

function addSubTotalToItems(filtereditemsWithCount, loadPromotionsFn, promotionType){
	 const subTotal = calSubTotalWithPromotion(filtereditemsWithCount, loadPromotionsFn);
	 return filtereditemsWithCount.map((items, index)=>{
	 		items.subTotal = subTotal[index];
	 		return items;
	 })
}

function calSubTotalWithPromotion(filtereditemsWithCount, loadPromotionsFn, promotionType){ 
		var subTotal = []
		var selectedPromotion = {}
		loadPromotionsFn().forEach(promotion=>{
			if(promotion.type==="BUY_TWO_GET_ONE_FREE"){
				selectedPromotion = promotion;
				filtereditemsWithCount.forEach(items=>{
					if(selectedPromotion.barcodes.includes(items.barcode)){
						if(items.count>2){
							subTotal.push(items.price*(items.count-parseInt(items.count/3)))
						}
						else{
							subTotal.push(items.price*items.count)
						}
					}
					else{
						subTotal.push(items.price*items.count)
					}
				})

			}
		});

		return subTotal
}

function calTotalAndSaving(itemWithCountAndSubTotal){
	var totalAndSaving= {};
	var totalBeforePromotion = 0;
	totalAndSaving.total = 0;
	totalAndSaving.saving = 0;
	itemWithCountAndSubTotal.forEach(item=>{
		totalAndSaving.total += item.subTotal;
		totalBeforePromotion += item.count*item.price;
	});
	totalAndSaving.saving = totalBeforePromotion - totalAndSaving.total;
	return totalAndSaving;
}

function formatReceipt(itemWithCountAndSubTotal, totalAndSaving){
	result = '***<store earning no money>Receipt ***\n';
    itemWithCountAndSubTotal.forEach(items=>{
        var newUnit;
        if(!(items.unit==='kg')){
            if(items.count>1){
                newUnit=items.unit+'s';
            }
            else{
                newUnit = items.unit;
            }
            result += 'Name: '+items.name+', Quantity: '+items.count+' '+newUnit+', Unit price: '+items.price.toFixed(2)+' (yuan), Subtotal: '+items.subTotal.toFixed(2)+' (yuan)\n';
        }
        else{
            result += 'Name: '+items.name+', Quantity: '+items.count+' '+items.unit+', Unit price: '+items.price.toFixed(2)+' (yuan), Subtotal: '+items.subTotal.toFixed(2)+' (yuan)\n';
        }
    });
    result +='----------------------\n' + 'Total: '+totalAndSaving.total.toFixed(2)+' (yuan)\n' + 'Saving: '+totalAndSaving.saving.toFixed(2)+' (yuan)\n'+'**********************';
    return result;
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