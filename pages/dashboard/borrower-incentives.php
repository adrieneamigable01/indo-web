<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1">

    <title>
        Borrower Incentive Management
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

    <link
        rel="stylesheet"
        href="../assets/css/loan.css">

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

                Borrower Incentive Management

            </h4>

            <small class="text-muted">

                Manage borrower monthly incentive records.

            </small>

        </div>

        <div>

            <button
                type="button"
                class="btn btn-primary"
                id="btnAddIncentive">

                <i class="bi bi-plus-circle me-1"></i>

                Add Incentive

            </button>

        </div>

    </div>

    <!-- ================================================= -->
    <!-- SUMMARY CARDS -->
    <!-- ================================================= -->

    <div class="row g-4 mt-1">

        <div class="col-md-3">

            <div class="stat-card p-4">

                <small>Total Borrowers</small>

                <h2 id="totalIncentiveBorrowers">0</h2>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <small>With Incentive</small>

                <h2 id="withIncentive">0</h2>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <small>Without Incentive</small>

                <h2 id="withoutIncentive">0</h2>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <small>Total Incentive</small>

                <h2 id="totalIncentive">₱0.00</h2>

            </div>

        </div>

    </div>

    <!-- ================================================= -->
    <!-- INCENTIVE LIST -->
    <!-- ================================================= -->

    <div class="page-card p-4 mt-4">

        <!-- ================================================= -->
        <!-- FILTERS -->
        <!-- ================================================= -->

        <div class="row mb-4 g-3">

            <!-- Borrower Filter -->

            <div class="col-md-3">

                <label class="form-label">

                    Borrower

                </label>

                <select
                    class="form-select"
                    id="filterIncentiveBorrower">

                    <option value="">

                        All Borrowers

                    </option>

                </select>

            </div>

            <!-- Incentive Type Filter -->

            <div class="col-md-3">

                <label class="form-label">

                    Incentive Type

                </label>

                <select
                    class="form-select"
                    id="filterIncentiveType">

                    <option value="">

                        All Incentive Types

                    </option>

                </select>

            </div>

            <!-- Status Filter -->

            <div class="col-md-2">

                <label class="form-label">

                    Status

                </label>

                <select
                    class="form-select"
                    id="filterIncentiveStatus">

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

            <!-- Search -->

            <div class="col-md-4">

                <label class="form-label">

                    Search

                </label>

                <input
                    type="text"
                    class="form-control"
                    id="txtIncentiveSearch"
                    placeholder="Search borrower or incentive type...">

            </div>

        </div>

        <!-- ================================================= -->
        <!-- MONTH / ACTION BUTTONS -->
        <!-- ================================================= -->

        <div class="row mb-4 g-3">

            <!-- Incentive Month -->

            <div class="col-md-3">

                <label class="form-label fw-bold">

                    Incentive Month

                </label>

                <input
                    type="month"
                    class="form-control"
                    id="incentiveMonth">

            </div>

            <!-- Load Button -->

            <div class="col-md-2 d-flex align-items-end">

                <button
                    type="button"
                    class="btn btn-primary w-100"
                    id="btnLoadIncentive">

                    <i class="bi bi-search me-1"></i>

                    Load

                </button>

            </div>

            <!-- Refresh Button -->

            <div class="col-md-2 d-flex align-items-end">

                <button
                    type="button"
                    class="btn btn-outline-secondary w-100"
                    id="btnRefreshIncentive">

                    <i class="bi bi-arrow-clockwise me-1"></i>

                    Refresh

                </button>

            </div>

            <!-- Save All Button -->

            <div class="col-md-3 d-flex align-items-end">

                <button
                    type="button"
                    class="btn btn-success w-100"
                    id="btnSaveAllIncentive">

                    <i class="bi bi-save me-1"></i>

                    Save All Incentives

                </button>

            </div>

        </div>

        <!-- ================================================= -->
        <!-- TABLE -->
        <!-- ================================================= -->

        <div class="table-responsive">

            <table
                id="incentiveTable"
                class="table table-hover table-bordered align-middle w-100">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Borrower</th>

                        <th>Incentive Type</th>

                        <th>Incentive Amount</th>

                        <th>Remarks</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody></tbody>

            </table>

        </div>

    </div>

</div>

<!-- ===================================================== -->
<!-- ADD / EDIT INCENTIVE MODAL -->
<!-- ===================================================== -->

<div
    class="modal fade"
    id="incentiveModal"
    tabindex="-1"
    aria-hidden="true">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header bg-primary text-white">

                <h5
                    class="modal-title"
                    id="incentiveModalTitle">

                    <i class="bi bi-cash-coin me-1"></i>

                    Add Borrower Incentive

                </h5>

                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="incentiveId">

                <div class="row">

                    <!-- Borrower -->

                    <div class="col-md-12 mb-3">

                        <label class="form-label">

                            Borrower

                            <span class="text-danger">*</span>

                        </label>

                        <select
                            class="form-select"
                            id="incentiveBorrower">

                            <option value="">

                                Select Borrower

                            </option>

                        </select>

                    </div>

                    <!-- Incentive Type -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Incentive Type

                            <span class="text-danger">*</span>

                        </label>

                        <select
                            class="form-select"
                            id="filterIncentiveType">

                           

                        </select>

                    </div>

                    <!-- Incentive Month -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Incentive Month

                            <span class="text-danger">*</span>

                        </label>

                        <input
                            type="month"
                            class="form-control"
                            id="modalIncentiveMonth">

                    </div>

                    <!-- Incentive Amount -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Incentive Amount

                            <span class="text-danger">*</span>

                        </label>

                        <input
                            type="number"
                            class="form-control"
                            id="incentiveAmount"
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
                            id="incentiveStatus">

                            <option value="ACTIVE">

                                ACTIVE

                            </option>

                            <option value="INACTIVE">

                                INACTIVE

                            </option>

                        </select>

                    </div>

                    <!-- Remarks -->

                    <div class="col-md-12 mb-3">

                        <label class="form-label">

                            Remarks

                        </label>

                        <textarea
                            class="form-control"
                            id="incentiveRemarks"
                            rows="4"
                            placeholder="Enter incentive remarks..."></textarea>

                    </div>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    <i class="bi bi-x-circle me-1"></i>

                    Close

                </button>

                <button
                    type="button"
                    class="btn btn-primary"
                    id="btnSaveIncentive">

                    <i class="bi bi-check-circle me-1"></i>

                    Save Incentive

                </button>

            </div>

        </div>

    </div>

</div>

<!-- ===================================================== -->
<!-- VIEW INCENTIVE MODAL -->
<!-- ===================================================== -->

<div
    class="modal fade"
    id="viewIncentiveModal"
    tabindex="-1"
    aria-hidden="true">

    <div
        class="modal-dialog modal-lg modal-dialog-scrollable">

        <div class="modal-content">

            <div class="modal-header bg-info text-white">

                <h5 class="modal-title">

                    <i class="bi bi-eye me-1"></i>

                    Borrower Incentive Details

                </h5>

                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div id="incentiveDetails">

                    <div class="text-center py-5">

                        <div
                            class="spinner-border text-primary"
                            role="status">

                            <span class="visually-hidden">

                                Loading...

                            </span>

                        </div>

                        <div class="mt-3">

                            Loading incentive details...

                        </div>

                    </div>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    <i class="bi bi-x-circle me-1"></i>

                    Close

                </button>

            </div>

        </div>

    </div>

</div>

<!-- ===================================================== -->
<!-- JAVASCRIPT LIBRARIES -->
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
<!-- APPLICATION JAVASCRIPT -->
<!-- ===================================================== -->

<script src="../assets/js/config.js"></script>

<script src="../assets/js/common.js"></script>

<script src="../assets/js/borrowerIncentive.js"></script>

<script src="../assets/js/dashboardMain.js"></script>

</body>

</html>