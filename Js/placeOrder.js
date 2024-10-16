window.onload = function() {
   cmbCustomer();
   cmbItem();
}

function fetchOrderId() {
    $.ajax({
        url:"http://localhost:8080/api/v1/orders/new-order-id", // Replace with your server URL
        method: "GET",
        success: function(response) {
            // Assuming response is in the format: { "orderId": "OR-100" }
            $("#Order_id").val(response);
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
function updateCustomerDropdown(customers) {
    // Assuming the customer combo box has the id 'selectCus_ID'
    let customerDropdown = $('#selectCus_ID');
    customerDropdown.empty();  // Clear the existing options

    // Append new customer options
    customers.forEach(function(customer) {
        customerDropdown.append(new Option(customer.name, customer.id));
    });

    // Optionally, set the selected customer to the newly added customer
    let lastCustomer = customers[customers.length - 1];  // Get the last customer (recently added)
    customerDropdown.val(lastCustomer.id);  // Set the new customer as selected
}


function cmbCustomer() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/customers',
        type: "GET",
        success: function(response) {
            updateCustomerDropdown(response)
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
        url: "http://localhost:8080/api/v1/items",
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
            url: `http://localhost:8080/api/v1/items/${selectedItemCode}`,
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
                    <td class="itemName" style="margin-left: 620px;width: 20px;margin-top: 155px;">${item_name}</td>
                    <td class="item_price">${unit_price.toFixed(2)}</td>
                    <td class="quantity">${quantity}</td>
                    <td class="price" style="margin-left: 1240px;width: 20px;margin-top: 75px;">${total_price.toFixed(2)}</td>
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
    // Place order
    $("#place_Order").on('click', function () {
        // Fetch values from the input fields and text elements
        let amount = parseFloat($('#amount').val());
        let netTotal = parseFloat($('#tot').text());
        let discount = netTotal * 0.20; // Calculate 20% discount
        let order_id = $("#Order_id").val();
        let finalTotal = netTotal - discount;
        let customerId = $("#selectCus_ID").val();


        // Create order request
        const orderRequest = {
            orderId: order_id,
            amount: amount,
            netTotal: netTotal,
            discount: discount,
            finalTotal: finalTotal,
            orderDetails: [] // This will hold the order details
        };

        // Collect order details
        $('#placeOrder-tbody tr').each(function () {
            const itemCode = $(this).find('td:eq(0)').text(); // Assuming itemCode is in the first column
            const itemName = $(this).find('td:eq(1)').text();
            const itemPrice = parseFloat($(this).find('td:eq(2)').text());
            const itemQuantity = parseInt($(this).find('td:eq(3)').text());


            orderRequest.orderDetails.push({
                orderId: order_id,
                itemCode: itemCode,
                qty: itemQuantity,
                unitPrice: itemPrice,
                customerId: customerId,
                itemName: itemName
            });
        });

        // Make an AJAX request to save the order
        $.ajax({
            url: `http://localhost:8080/api/v1/orders`,
            method: "POST",
            data: JSON.stringify(orderRequest),
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    title: 'Order Saved Successfully'
                });
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Save Order'
                });
            }
        });
    });


    function ClearFields() {
        $("#select").val('');
        $("#quantity_placeOrder").val('');
        $('#itemName').text("______________________________");
        $('#itemQut').text("_____________");
        $('#itemPrice').text("___________");
    }
});
