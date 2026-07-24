<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1">

<title>

    Borrower Salary Management

</title>

<!-- BOOTSTRAP -->

<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet">

<!-- BOOTSTRAP ICONS -->

<link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    rel="stylesheet">

<!-- DATATABLE -->

<link
    rel="stylesheet"
    href="https://cdn.datatables.net/2.3.2/css/dataTables.bootstrap5.css">

<link
    rel="stylesheet"
    href="https://cdn.datatables.net/buttons/3.2.3/css/buttons.bootstrap5.min.css">

  <link rel="stylesheet" href="../assets/css/loan.css">

</head>

<body>

<!-- ===================================================== -->
<!-- SIDEBAR -->
<!-- ===================================================== -->

<?php include_once('common/sidenav.php') ?>

<!-- ===================================================== -->
<!-- MAIN CONTENT -->
<!-- ===================================================== -->

<div class="main-content">

    <!-- ================================================= -->
    <!-- TOPBAR -->
    <!-- ================================================= -->

    <div
        class="topbar d-flex justify-content-between align-items-center">

        <div>

            <h4 class="mb-0">

                Borrower Salary Management

            </h4>

            <small class="text-muted">

                Manage borrower monthly salary records.

            </small>

        </div>


    </div>

    <!-- ================================================= -->
    <!-- SUMMARY CARDS -->
    <!-- ================================================= -->

    <div class="row g-4 mt-1">

        <div class="col-md-2">

            <div class="stat-card p-4">

                <small>Total Borrowers</small>

                <h2 id="totalBorrowers">0</h2>

            </div>

        </div>

        <div class="col-md-2">

            <div class="stat-card p-4">

                <small>With Salary</small>

                <h2 id="withSalary">0</h2>

            </div>

        </div>

        <div class="col-md-2">

            <div class="stat-card p-4">

                <small>Without Salary</small>

                <h2 id="withoutSalary">0</h2>

            </div>

        </div>

        <div class="col-md-2">

            <div class="stat-card p-4">

                <small>Total ATM</small>

                <h2 id="totalATM">₱0.00</h2>

            </div>

        </div>

        <div class="col-md-2">

            <div class="stat-card p-4">

                <small>Total Auto Debit</small>

                <h2 id="totalAutoDebit">₱0.00</h2>

            </div>

        </div>

        <div class="col-md-2">

            <div class="stat-card p-4">

                <small>Total Gross Salary</small>

                <h2 id="totalGrossSalary">₱0.00</h2>

            </div>

        </div>

    </div>
        <!-- ================================================= -->
    <!-- SALARY LIST -->
    <!-- ================================================= -->

    <div class="page-card p-4 mt-4">

        <div class="row mb-4">

            <div class="col-md-3">

                <label>

                    Borrower

                </label>

                <select
                    class="form-select"
                    id="filterBorrower">

                    <option value="">

                        All Borrowers

                    </option>

                </select>

            </div>

            <div class="col-md-2">

                <label>

                    Status

                </label>

                <select
                    class="form-select"
                    id="filterStatus">

                    <option value="">

                        All

                    </option>

                    <option value="ACTIVE">

                        Active

                    </option>

                    <option value="INACTIVE">

                        Inactive

                    </option>

                </select>

            </div>

            <div class="col-md-4">

                <label>

                    Search

                </label>

                <input
                    type="text"
                    class="form-control"
                    id="txtSearch"
                    placeholder="Search borrower...">

            </div>

            <div class="col-md-3 d-flex align-items-end">

                <button
                    class="btn btn-primary me-2"
                    id="btnRefreshSalary">

                    <i class="bi bi-arrow-clockwise"></i>

                    Refresh

                </button>

                <button
                    class="btn btn-success"
                    id="btnSaveAllSalary">

                    <i class="bi bi-plus-circle"></i>

                    Save Salary

                </button>

            </div>

        </div>

        <div class="row mb-3">

    <div class="col-md-3">

        <label class="form-label fw-bold">

            Salary Month

        </label>

        <input
            type="month"
            class="form-control"
            id="salaryMonth">

    </div>

        <div class="col-md-3 d-flex align-items-end">

            <button
                class="btn btn-primary"
                id="btnLoadSalary">

                <i class="bi bi-search"></i>

                Load Salary

            </button>
            

        </div>

        

    </div>

        <div class="table-responsive">

            <table id="salaryTable" class="table table-hover table-bordered align-middle w-100">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Borrower</th>
                        <th>Gross Salary</th>
                        <th>ATM Withdrawal</th>
                        <th>Auto Debit</th>
                        <th>Remarks</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody></tbody>

            </table>

        </div>

    </div>
    <!-- ===================================================== -->
<!-- ADD / EDIT SALARY MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="salaryModal"
     tabindex="-1">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header bg-primary text-white">

                <h5
                    class="modal-title"
                    id="salaryModalTitle">

                    <i class="bi bi-cash-stack"></i>

                    Add Borrower Salary

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="salaryId">

                <div class="row">

                    <!-- Borrower -->

                    <div class="col-md-12 mb-3">

                        <label class="form-label">

                            Borrower
                            <span class="text-danger">*</span>

                        </label>

                        <select
                            class="form-select"
                            id="salaryBorrower">

                            <option value="">

                                Select Borrower

                            </option>

                        </select>

                    </div>

                    <!-- Salary Month -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Salary Month
                            <span class="text-danger">*</span>

                        </label>

                        <input
                            type="month"
                            class="form-control"
                            id="salaryMonth">

                    </div>

                    

                    <!-- Gross Salary -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Gross Salary
                            <span class="text-danger">*</span>

                        </label>

                        <input
                            type="number"
                            class="form-control"
                            id="grossSalary"
                            placeholder="0.00"
                            step="0.01"
                            min="0">

                    </div>

                    <!-- Status -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Status

                        </label>

                        <select
                            class="form-select"
                            id="salaryStatus">

                            <option value="ACTIVE">

                                ACTIVE

                            </option>

                            <option value="INACTIVE">

                                INACTIVE

                            </option>

                        </select>

                    </div>

                    <!-- Remarks -->

                    <div class="col-md-12">

                        <label class="form-label">

                            Remarks

                        </label>

                        <textarea
                            class="form-control"
                            id="salaryRemarks"
                            rows="4"
                            placeholder="Enter remarks..."></textarea>

                    </div>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    <i class="bi bi-x-circle"></i>

                    Close

                </button>

                <button
                    type="button"
                    class="btn btn-primary">

                    <i class="bi bi-check-circle"></i>

                    Save Salary

                </button>

            </div>

        </div>

    </div>

</div>
<!-- ===================================================== -->
<!-- VIEW SALARY MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="viewSalaryModal"
     tabindex="-1">

    <div class="modal-dialog modal-lg modal-dialog-scrollable">

        <div class="modal-content">

            <div class="modal-header bg-info text-white">

                <h5 class="modal-title">

                    <i class="bi bi-eye"></i>

                    Borrower Salary Details

                </h5>

                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div id="salaryDetails">

                    <div class="text-center py-5">

                        <div
                            class="spinner-border text-primary"
                            role="status">

                            <span class="visually-hidden">

                                Loading...

                            </span>

                        </div>

                        <div class="mt-3">

                            Loading salary details...

                        </div>

                    </div>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    <i class="bi bi-x-circle"></i>

                    Close

                </button>

            </div>

        </div>

    </div>

</div>
<!-- ===================================================== -->
<!-- JAVASCRIPT -->
<!-- ===================================================== -->

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/dataTables.buttons.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.bootstrap5.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.html5.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.print.min.js"></script>

<!-- ===================================================== -->
<!-- APPLICATION JS -->
<!-- ===================================================== -->

<script src="../assets/js/config.js"></script>

<script src="../assets/js/common.js"></script>

<script src="../assets/js/borrowerSalary.js"></script>

<script src="../assets/js/dashboardMain.js"></script>

</body>

</html>