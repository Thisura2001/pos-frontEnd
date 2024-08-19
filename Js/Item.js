const itemCodeRegex = /^\d+$/;
const itemNameRegex = /^[a-zA-Z\s]+$/;
const priceRegex = /^[\d.\s]+$/;
const qtyRegex = /^[\d\s]+$/;
$("#btnItemSave").on('click', () => {
    let itemCode = $("#Item_id").val();
    let itemName = $("#item_Name").val();
    let price = $("#item_Price").val();
    let qty = $("#itemQuantity").val();

    // Validating input values using regular expressions
    if (!itemCodeRegex.test(itemCode)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Item Code',
            text: 'Only digits are allowed.'
        });
        return;
    }
    if (!itemNameRegex.test(itemName)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Item Name',
            text: 'Only letters and spaces are allowed.'
        });
        return;
    }
    if (!priceRegex.test(price)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Price',
            text: 'Only numbers are allowed.'
        });
        return;
    }
    if (!qtyRegex.test(qty)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Quantity',
            text: 'Only numbers are allowed.'
        });
        return;
    }
    const itemData = {
        code : itemCode,
        itemName:itemName,
        price:price,
        qty:qty
    }
    console.log(itemData)
    const itemJson = JSON.stringify(itemData);

    $.ajax({
        url:"http://localhost:8080/item",
        type:"POST",
        data:itemJson,
        contentType:"application/json",

        success:function (result){
           swal.fire({
               icon:'success',
               title:'item added successfully'
           })
            console.log(result)
        },
        error:function (error) {
            swal.fire({
                icon:'error',
                title:'error add item'
            })
            console.log(error)
        }
    })
});
$("#itemBtnDelete").on('click',()=>{
  var itemCode = $("#Item_id").val();
    $.ajax({
        url:`http://localhost:8080/item?code=${itemCode}`,
        type:"DELETE",
        success:function (result) {
            swal.fire({
                icon:'success',
                title:'item deleted successfully'
            })
            console.log(result)
        },
        error:function (error) {
            swal.fire({
                icon:'error',
                title:'error delete item'
            })
            console.log(error)
        }
    })
})
$("#itemBtnReset").on('click',()=>{
    $("#Item_id").val("");
    $("#item_Name").val("");
    $("#item_Price").val("");
    $("#itemQuantity").val("");
})
$("#btnItemUpdate").on('click',()=>{
    var itemCode = $("#Item_id").val();
    var itemName = $("#item_Name").val();
    var price = $("#item_Price").val();
    var qty = $("#itemQuantity").val();

    if (!itemCodeRegex.test(itemCode)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Item Code',
            text: 'Only digits are allowed.'
        });
        return;
    }
    if (!itemNameRegex.test(itemName)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Item Name',
            text: 'Only letters and spaces are allowed.'
        });
        return;
    }
    if (!priceRegex.test(price)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Price',
            text: 'Only numbers are allowed.'
        });
        return;
    }
    if (!qtyRegex.test(qty)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Quantity',
            text: 'Only numbers are allowed.'
        });
        return;
    }
    const itemData = {
        code : itemCode,
        itemName:itemName,
        price:price,
        qty:qty
    }
    const itemJson = JSON.stringify(itemData);
    $.ajax({
        url:`http://localhost:8080/item?code=${itemCode}`,
        type:"PUT",
        data:itemJson,
        contentType:"application/json",
        success:function (result) {
            swal.fire({
                icon:'success',
                title:'item updated successfully'
            })
            console.log(result)
        },
        error:function (error) {
            swal.fire({
                icon:'error',
                title:'error update item'
            })
            console.log(error)
        }

    });

});