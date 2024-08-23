window.onload = function() {
   cmbCustomer();
   cmbItem();
}

function fetchOrderId() {
    $.ajax({
        url: "http://localhost:8080/orders", // Replace with your server URL
        method: "GET",
        success: function(response) {
            // Assuming response is in the format: { "orderId": "OR-100" }
            $("#Order_id").val(response.orderId);
        },
        error: function(error) {
            console.error("Error fetching order ID:", error);
        }
    });
}

// Call this function when the page loads or when needed
$(document).ready(function() {
    fetchOrderId();
});

function cmbCustomer() {
    $.ajax({
        url: "http://localhost:8080/customer",
        type: "GET",
        success: function(response) {
            console.log(response); // Log the entire response to check its structure

            // Clear existing options in the select element
            $('#selectCus_ID').empty();

            // Add default option
            const defaultOption = $('<option>').text("Select Customer ID").val("");
            $('#selectCus_ID').append(defaultOption);

            // Ensure the response is an array
            if (Array.isArray(response)) {
                response.forEach(function(customer) {
                    console.log(customer); // Log each customer object to verify its structure
                    let customerId =customer.id;
                    let option = $('<option>').val(customerId).text(customerId);
                    $('#selectCus_ID').append(option);
                });
            } else {
                console.error("Expected an array but got:", response);
            }
        },
        error: function(error) {
            console.error("Error loading customer IDs:", error);
        }
    });
}
function cmbItem() {
    $.ajax({
        url: "http://localhost:8080/item",
        method: "GET",
        success: function(response) {
            console.log(response);

            $("#select").empty();
            const defaultOption = document.createElement("option");
            defaultOption.text = "Select Item ID";
            $('#select').append(defaultOption);

            if (Array.isArray(response)) {
                response.forEach(function(item) {
                    console.log(item);
                    let itemId = item.code; // Ensure 'code' matches the key in the response
                    let option = $('<option>').val(itemId).text(itemId);
                    $("#select").append(option);
                });
            } else {
                console.error("Expected an array but got:", response);
            }
        },
        error: function(error) {
            console.error("Error fetching items:", error);
        }
    });
}

$("#select").on('change', function() {
    const selectedItemCode = $(this).val(); // Get the selected item code
    console.log("Selected Item Code:", selectedItemCode);

    if (selectedItemCode) {
        $.ajax({
            url: `http://localhost:8080/items?code=${selectedItemCode}`,
            method: "GET",
            success: function(response) {
                console.log( response);

                // Update the fields with the item details
                $("#itemName").text(response.itemName);
                $("#itemPrice").text(response.price);
                $("#itemQut").text(response.qty);
            },
            error: function(error) {
                console.error("Error fetching item details:", error);
            }
        });
    } else {
        $("#itemName").text("");
        $("#itemPrice").text("");
        $("#itemQut").text("");
    }
});
$(document).ready(function() {
    $("#btnAdd").on('click', function() {
        let item_id = $("#select").val();                      // Get selected item ID
        let item_name = $("#itemName").text();                 // Get item name
        let quantity = parseInt($("#quantity_placeOrder").val()); // Get quantity entered
        let unit_price = parseFloat($("#itemPrice").text());   // Get item price
        let available_qty = parseInt($("#itemQut").text());    // Get available quantity

        if (!item_id || isNaN(quantity) || quantity <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: 'Please select an item and enter a valid quantity.'
            });
            return;
        }

        if (quantity > available_qty) {
            Swal.fire({
                icon: 'error',
                title: 'Insufficient Stock',
                text: `Only ${available_qty} units available.`
            });
            return;
        }

        let total = quantity * unit_price;
        let discount = total * 0.20;
        let total_price = total - discount;

        let existingRow = $(`#placeOrder-tbody tr[data-item-id="${item_id}"]`);

        if (existingRow.length) {
            let existingQuantity = parseInt(existingRow.find('.quantity').text());
            let newQuantity = existingQuantity + quantity;
            let newTotal = newQuantity * unit_price;

            existingRow.find('.quantity').text(newQuantity);
            existingRow.find('.price').text(newTotal.toFixed(2));
        } else {
            let record = `
                <tr data-item-id="${item_id}">
                    <td class="item_id">${item_id}</td>
                    <td class="item_price">${unit_price.toFixed(2)}</td>
                    <td class="quantity">${quantity}</td>
                    <td class="price">${total_price.toFixed(2)}</td>
                    <td class="button">
                        <button class="removeButton" type="button">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;

            $("#placeOrder-tbody").append(record);
        }

        updateNetTotal();
        ClearFields();
    });

    function updateNetTotal() {
        let netTot = 0;
        $("#placeOrder-tbody tr").each(function() {
            netTot += parseFloat($(this).find('.price').text());
        });

        $("#tot").text(netTot.toFixed(2));
        $("#dis").text(`The amount saved by the 20% discount: = Rs.${(netTot * 0.20).toFixed(2)}`);
        $("#final").text(`New Total Rs: ${(netTot - (netTot * 0.20)).toFixed(2)}`);
    }

    // Event delegation for dynamically added remove buttons
    $("#placeOrder-tbody").on("click", ".removeButton", function() {
        $(this).closest('tr').remove();
        updateNetTotal();
    });
    //place order
    $("#place_Order").on('click',function (){
        let amount = parseFloat($('#amount').val());
        let netTotal = parseFloat($('#tot').text());
        let discount = netTotal * 0.20; // Calculate 20% discount
        let order_id = $("#Order_id").val();
        let finalTotal = netTotal - discount; // Calculate final total after discount

        const orderData ={
            orderId:order_id,
            amount:amount,
            netTotal:netTotal,
            discount:discount,
            finalTotal:finalTotal
        }
        const orderJson = JSON.stringify(orderData);


        $.ajax({
            url:`http://localhost:8080/orders`,
            method:"POST",
            data:orderJson,
            contentType: "application/json",
            success:function (response){
                Swal.fire({
                    icon: 'success',
                    title: 'order saved'
                });
                console.log(response);
            },
            error:function (error){
                Swal.fire({
                    icon: 'error',
                    title: 'error saving order'
                });
                console.log(error);
            }
        })
    })

    function ClearFields() {
        $("#select").val('');
        $("#quantity_placeOrder").val('');
        $('#itemName').text("______________________________");
        $('#itemQut').text("_____________");
        $('#itemPrice').text("___________");
    }
});
