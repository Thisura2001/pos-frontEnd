const customerIdRegex = /^\d+$/; // Only digits allowed
const customerNameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces allowed
const salaryRegex = /^\d+(\.\d{1,2})?$/; // Only numbers and optional decimal points allowed
const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/; // Letters, digits, and some special characters allowed
    function loadCustomers() {
        $.ajax({
            url: 'http://localhost:8080/api/v1/customers',
            type: 'GET',
            contentType: 'application/json',
            success: function(response) {
                appendCustomersToTable(response);
            },
            error: function(error) {
                console.error("Error loading customers:", error);
            }
        });
    }

    function appendCustomersToTable(customers) {
        $('#CustomerTableBody').empty(); // Clear existing rows
        customers.forEach(function(customer) {
            var newRow = ` <tr>
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.salary}</td>
                            <td>${customer.address}</td>
                        </tr>`
            ;
            $('#CustomerTableBody').append(newRow);
        });
        // Add click event listener to table rows
        $("#CustomerTableBody").on('click', 'tr',function() {
            let id = $(this).find('td:first').text();
            let name = $(this).find('td:nth-child(2)').text();
            let salary = $(this).find('td:nth-child(3)').text();
            let address = $(this).find('td:nth-child(4)').text();

            $("#cus_id").val(id)
            $("#name").val(name);
            $("#salary").val(salary);
            $("#address").val(address);
        });
    }
$("#btnCustomerSave").on('click', () => {
    let customerId = $("#cus_id").val();
    let customerName = $("#name").val();
    let salary = $("#salary").val();
    let address = $("#address").val();

    // Perform validation before sending the request
    if (!customerIdRegex.test(customerId)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Customer Id',
            text: 'Only digits are allowed.'
        });
        return;
    }
    if (!customerNameRegex.test(customerName)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Customer Name',
            text: 'Only letters and spaces are allowed.'
        });
        return;
    }
    if (!salaryRegex.test(salary)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Salary',
            text: 'Only numbers are allowed.'
        });
        return;
    }
    if (!addressRegex.test(address)) {
        swal.fire({
            icon: 'error',
            title: 'Invalid Address',
            text: 'Only letters, digits, and some special characters are allowed.'
        });
        return;
    }

    const customerData = {
        id: customerId,
        name: customerName,
        salary: salary,
        address: address
    };
    console.log(customerData);

    const customerJson = JSON.stringify(customerData);

    $.ajax({
        url: "http://localhost:8080/api/v1/customers",
        type: "POST",
        data: customerJson,
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            swal.fire({
                icon: 'success',
                title: 'Customer Added Successfully',
            });
            clearFields();
            loadCustomers();
        },
        error: function (error) {
            console.log(error);
            swal.fire({
                icon: 'error',
                title: 'Error Add Customer',
                text: 'An error occurred while adding the customer data.'
            });
        }
    });
});
    $("#btnCustomerDelete").on('click', () => {
        var customerId = $("#cus_id").val();
        $.ajax({
            url: `http://localhost:8080/api/v1/customers/${customerId}`,
            type: "DELETE",
            success: function (response) {
                console.log(response);
                swal.fire({
                    icon: 'success',
                    title: 'Customer Deleted Successfully'
                });
                clearFields();
                loadCustomers();
            },
            error: function (error) {
                console.log(error);
                swal.fire({
                    icon: 'error',
                    title: 'Error Delete Customer',
                    text: 'An error occurred while deleting the customer data.'
                });
            }
        })
    })
    $("#btnCustomerUpdate").on('click', () => {
        let customerId = $("#cus_id").val();
        let customerName = $("#name").val();
        let salary = $("#salary").val();
        let address = $("#address").val();

        // Perform validation before sending the request
        if (!customerIdRegex.test(customerId)) {
            swal.fire({
                icon: 'error',
                title: 'Invalid Customer Id',
                text: 'Only digits are allowed.'
            });
            return;
        }
        if (!customerNameRegex.test(customerName)) {
            swal.fire({
                icon: 'error',
                title: 'Invalid Customer Name',
                text: 'Only letters and spaces are allowed.'
            });
            return;
        }
        if (!salaryRegex.test(salary)) {
            swal.fire({
                icon: 'error',
                title: 'Invalid Salary',
                text: 'Only numbers are allowed.'
            });
            return;
        }
        if (!addressRegex.test(address)) {
            swal.fire({
                icon: 'error',
                title: 'Invalid Address',
                text: 'Only letters, digits, and some special characters are allowed.'
            });
            return;
        }

        const customerData = {
            id: customerId,
            name: customerName,
            salary: salary,
            address: address
        };
        console.log(customerData);

        const customerJson = JSON.stringify(customerData);

        $.ajax({
            url: `http://localhost:8080/api/v1/customers/${customerId}`,
            type: "PUT",
            data: customerJson,
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                swal.fire({
                    icon: 'success',
                    title: 'Customer Updated Successfully',
                });
                clearFields();
                loadCustomers();
            },
            error: function (error) {
                console.log(error);
                swal.fire({
                    icon: 'error',
                    title: 'Error Update Customer',
                    text: 'An error occurred while updating the customer data.'
                });
            }
    });
    });
    $("#btnCustomerReset").on('click', () => {
        $("#cus_id").val("");
        $("#name").val("");
        $("#salary").val("");
        $("#address").val("");
    })

    function clearFields() {
        $("#cus_id").val("");
        $("#name").val("");
        $("#salary").val("");
        $("#address").val("");
    }
    window.loadCustomers = loadCustomers();
