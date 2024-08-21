window.onload = function() {
   cmbCustomer();
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
        url: "http://localhost:8080/customer", // Adjust URL to point to your servlet
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
                    let customerId = customer.customerId || customer.id; // Adjust the property name based on your data
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