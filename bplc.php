<!DOCTYPE html>
<html>
<head>
    <title>Borrowers Paid List</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- DataTables -->
    <link href="https://cdn.datatables.net/1.13.8/css/jquery.dataTables.min.css" rel="stylesheet">

</head>
<body>

<div class="container mt-4">
    <h3>Borrowers Paid List</h3>

    <table id="borrowerTable" class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>Borrower Name</th>
                <th>Balance</th>
            </tr>
        </thead>
    </table>
</div>

<!-- JQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- DataTables -->
<script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>

<script>
$(document).ready(function() {

    $('#borrowerTable').DataTable({
        processing: true,
        ajax: {
            url: 'https://bplcapi.doitcebutech.com/borrower/get_borrowersForPaidAll/1',
            dataSrc: 'data.data'
        },
        columns: [
            {
                data: null,
                render: function(data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: 'name'
            },
            {
                data: 'balance',
                className: 'text-end'
            }
        ],
        pageLength: 25,
        order: [[1, 'asc']]
    });

});
</script>

</body>
</html>