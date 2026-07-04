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

<style>

:root{
    --primary:#2563eb;
    --body:#f8fafc;
}

body{
    background:var(--body);
    font-family:'Segoe UI',sans-serif;
}

/* SIDEBAR */

.sidebar{
    position:fixed;
    top:0;
    left:0;
    width:270px;
    height:100vh;
    background:#fff;
    border-right:1px solid #e5e7eb;
    padding:20px;
    overflow-y:auto;
}

.logo{
    font-size:24px;
    font-weight:700;
    color:var(--primary);
}

.menu-item{
    display:flex;
    align-items:center;
    gap:10px;
    padding:12px 15px;
    border-radius:12px;
    text-decoration:none;
    color:#334155;
    margin-bottom:8px;
    transition:.3s;
}

.menu-item:hover,
.menu-item.active{
    background:var(--primary);
    color:white;
}

/* CONTENT */

.content{
    margin-left:270px;
    padding:25px;
}

.topbar{
    background:white;
    border-radius:20px;
    padding:15px 20px;
    box-shadow:0 4px 20px rgba(0,0,0,.05);
}

/* CARDS */

.stat-card,
.page-card{
    background:white;
    border:none;
    border-radius:20px;
    box-shadow:0 4px 20px rgba(0,0,0,.05);
}

.icon-box{
    width:55px;
    height:55px;
    border-radius:15px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:24px;
}

.icon-primary{
    background:#dbeafe;
    color:#2563eb;
}

.icon-success{
    background:#dcfce7;
    color:#16a34a;
}

.icon-danger{
    background:#fee2e2;
    color:#dc2626;
}

/* DATATABLE */

.dataTables_wrapper .dataTables_filter input{
    border-radius:12px;
    border:1px solid #dee2e6;
    padding:8px 12px;
}

.dataTables_wrapper .dataTables_length select{
    border-radius:12px;
}

.dt-buttons .btn{
    border-radius:10px;
}

.table > :not(caption) > * > *{
    padding:15px;
    vertical-align:middle;
}

.page-link{
    border-radius:10px !important;
}

.badge{
    padding:8px 12px;
}

/* MOBILE */

@media(max-width:991px){

    .sidebar{
        position:relative;
        width:100%;
        height:auto;
    }

    .content{
        margin-left:0;
    }

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

            <a href="borrower_form.php" class="btn btn-primary">

                <i class="bi bi-person-plus"></i>
                Add Borrower

            </a>

        </div>

    </div>

    <!-- STATS -->

    <div class="row g-4 mt-1">

        <div class="col-md-4">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Total Borrowers</small>

                        <h2 class="mt-2">
                            1,245
                        </h2>

                    </div>

                    <div class="icon-box icon-primary">

                        <i class="bi bi-people"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-4">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Active Borrowers</small>

                        <h2 class="mt-2">
                            1,180
                        </h2>

                    </div>

                    <div class="icon-box icon-success">

                        <i class="bi bi-check-circle"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-4">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>Blacklisted</small>

                        <h2 class="mt-2">
                            65
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

             <thead class="table-light">

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