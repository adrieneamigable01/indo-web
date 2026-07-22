<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width, initial-scale=1">

<title>Borrowers Management</title>

<!-- BOOTSTRAP -->

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
rel="stylesheet">

<!-- BOOTSTRAP ICONS -->

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
rel="stylesheet">

<!-- DATATABLE -->

<link rel="stylesheet"
href="https://cdn.datatables.net/2.3.2/css/dataTables.bootstrap5.css">

<link rel="stylesheet"
href="https://cdn.datatables.net/buttons/3.2.3/css/buttons.bootstrap5.min.css">
<link rel="stylesheet"
href="assets/css/loan.css">
<style>
    #tblCashierVault{

        font-size:.92rem;

    }

    #tblCashierVault thead th{

        vertical-align:middle;

        white-space:nowrap;

    }

    #tblCashierVault tbody td{

        vertical-align:middle;

    }

    #tblCashierVault tbody tr:hover{

        background:#f8fbff;

    }

    #tblCashierVault .badge{

        font-size:.8rem;

    }

    #tblCashierVault .btn{

        min-width:34px;

    }
    #tblCashierVault{
        width:auto !important;
    }

    #tblCashierVault thead th{
        white-space:nowrap;
    }

    #tblCashierVault tbody td{
        white-space:nowrap;
        vertical-align:middle;
    }

    #tblCashierVault tbody td:nth-child(5){
        white-space:normal;
        min-width:250px;
    }
</style>

</head>

<body>

<!-- SIDEBAR -->
<?php include_once('common/sidenav.php') ?>


<!-- CONTENT -->

<div class="content">

    <!-- TOPBAR -->
    
    <div class="topbar d-flex justify-content-between align-items-center">

        <div>

            <h4 class="mb-0">
                Borrowers Management
            </h4>

            <small class="text-muted">
                Manage borrower profiles and records
            </small>

        </div>

        <div>

            <button class="btn btn-success">

                <i class="bi bi-file-earmark-excel"></i>
                Export

            </button>

            <a href="add/borrower" class="btn btn-primary">

                <i class="bi bi-person-plus"></i>
                Add Borrower

            </a>

        </div>

    </div>

    <!-- STATS -->

    <div class="row g-4 mt-1">

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Total Borrowers</small>

                        <h2 class="mt-2" id="totalBorrowers">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-primary">

                        <i class="bi bi-people"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Active Borrowers</small>

                        <h2 class="mt-2" id="activeBorrowers">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-success">

                        <i class="bi bi-check-circle"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Delinquent</small>

                        <h2 class="mt-2" id="delinquentBorrowers">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-danger">

                        <i class="bi bi-exclamation-circle"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Blacklisted</small>

                        <h2 class="mt-2" id="blacklistedBorrowers">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-danger">

                        <i class="bi bi-x-circle"></i>

                    </div>

                </div>

            </div>

        </div>

    </div>

    <!-- TABLE -->

    <div class="page-card p-4 mt-4">

        <table id="borrowerTable"
               class="table table-hover align-middle">

             <thead class="table-dark">

            <tr>
                <th>ID</th>
                <th>Borrower</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Civil Status</th>
                <th>Status</th>
                <th width="100">Action</th>
            </tr>

            </thead>

            <tbody id="borrowerBody"></tbody>

        </table>

    </div>

</div>

<!-- JQUERY -->

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!-- BOOTSTRAP -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- DATATABLE -->

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<!-- BUTTONS -->

<script src="https://cdn.datatables.net/buttons/3.2.3/js/dataTables.buttons.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.bootstrap5.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.html5.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.print.min.js"></script>

<script src="assets/js/config.js"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/borrower.js"></script>

</body>
</html>