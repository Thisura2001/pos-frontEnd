const itemCodeRegex = /^\d+$/;
const itemNameRegex = /^[a-zA-Z\s]+$/;
const priceRegex = /^[\d.\s]+$/;
const qtyRegex = /^[\d\s]+$/;

function loadItemTable() {
    $.ajax({
        url:"http://localhost:8080/api/v1/items",
        type:"GET",
        contentType:"application/json",

        success:function (success){
            appendItems(success);
        },
        error:function (error){
            console.error(error);
        }
    });
}
function appendItems(items) {
    $("#itemTableBody").empty();
    items.forEach(function (item) {
        var row = `<tr>
                    <td>${item.code}</td>
                    <td>${item.itemName}</td>
                    <td>${item.price}</td>
                    <td>${item.qty}</td>
        </tr>`;
        $('#itemTableBody').append(row);
    });
    $("#itemTableBody").on('click','tr',function (){
        let code = $(this).find('td:first').text();
        let itemName = $(this).find('td:nth-child(2)').text();
        let price = $(this).find('td:nth-child(3)').text();
        let qty = $(this).find('td:nth-child(4)').text();

        $("#Item_id").val(code);
        $("#item_Name").val(itemName);
        $("#item_Price").val(price);
        $("#itemQuantity").val(qty);
    })
}
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
        url:"http://localhost:8080/api/v1/items",
        type:"POST",
        data:itemJson,
        contentType:"application/json",

        success:function (result){
           swal.fire({
               icon:'success',
               title:'item added successfully'
           })
            loadItemTable();
           clearFields();
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
        url:`http://localhost:8080/api/v1/items/${itemCode}`,
        type:"DELETE",
        success:function (result) {
            swal.fire({
                icon:'success',
                title:'item deleted successfully'
            })
            console.log(result);
            loadItemTable();
            clearFields();
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
        url:`http://localhost:8080/api/v1/items/${itemCode}`,
        type:"PUT",
        data:itemJson,
        contentType:"application/json",
        success:function (result) {
            swal.fire({
                icon:'success',
                title:'item updated successfully'
            })
            console.log(result)
            loadItemTable();
            clearFields();
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
function clearFields() {
    $("#Item_id").val("");
    $("#item_Name").val("");
    $("#item_Price").val("");
    $("#itemQuantity").val("");
}
window.onload = loadItemTable();