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
                console.log("Item details response:", response);

                // Update the fields with the item details
                $("#itemName").val(response.itemName || ""); // Use .text() for <h5> elements
                $("#itemPrice").val(response.price || ""); // Use .text() for <h5> elements
                $("#itemQut").val(response.qty || ""); // Use .text() for <h5> element
            },
            error: function(error) {
                console.error("Error fetching item details:", error);
                // Clear the fields if there's an error
                // $("#itemName").text("");
                // $("#itemQut").text("");
                // $("#itemPrice").text("");
            }
        });
    } else {
        // Clear the fields if no item is selected
        // $("#itemName").text("");
        // $("#itemQut").text("");
        // $("#itemPrice").text("");
    }
});
