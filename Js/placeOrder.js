window.onload = function() {
   cmbCustomer();
   cmbItem();
}
//
// function setOrderID() {
//     $.ajax({
//         url: "http://localhost:8080/orders", // Adjust URL to point to your servlet
//         type: "GET",
//         success: function(response) {
//             // Set the generated orderId in the text field
//             response.orderId = undefined;
//             $("#Order_id").val(response.orderId);
//         },
//         error: function(error) {
//             console.error("Error generating orderId:", error);
//         }
//     });
// }
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
                console.log(response);  // Check what the structure of the response is

                // Ensure that the response structure matches what you're expecting
                // For example, if the response is an object like {itemName: "Item A", price: 100.00, qty: 5}
                $("#itemName").text(response.itemName || "N/A");
                $("#itemPrice").text(response.price !== undefined ? response.price : "N/A");
                $("#itemQut").text(response.qty !== undefined ? response.qty : "N/A");
            },
            error: function(error) {
                console.error("Error fetching item details:", error);
                // Clear the fields if there's an error
                $("#itemName").text("N/A");
                $("#itemPrice").text("N/A");
                $("#itemQut").text("N/A");
            }
        });
    } else {
        // Clear the fields if no item is selected
        $("#itemName").text("N/A");
        $("#itemPrice").text("N/A");
        $("#itemQut").text("N/A");
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

        // Clear the input fields after adding the item
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

    function ClearFields() {
        $("#select").val('');
        $("#quantity_placeOrder").val('');
        $('#itemName').text("______________________________");
        $('#itemQut').text("_____________");
        $('#itemPrice').text("___________");
    }
});
