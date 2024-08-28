// window.onload = function(){
//     loadOrderIds();
// }
// function loadOrderIds() {
//     $.ajax({
//         url: "http://localhost:8080/orders",
//         method: "GET",
//         success: function(response) {
//             console.log(response);
//
//             $("#SelectOrderId").empty();
//
//             const defaultOption = $('<option>').text("Select Order ID").val("");
//             $('#SelectOrderId').append(defaultOption);
//
//             if (Array.isArray(response)){
//             response.forEach(function (order){
//                 console.log(order);
//                 let orderId = order.orderId;
//                 let option = $('<option>').val(orderId).text(orderId);
//                 $('#SelectOrderId').append(option);
//             });
//             }else{
//                 console.error("Expected an array but got:", response);
//             }
//         },
//         error: function(error) {
//             console.error("Error loading order IDs:", error);
//         }
//     })
// }