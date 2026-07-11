<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1">

<title>
    Daily Close Management
</title>

<!-- Bootstrap -->

<link
href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
rel="stylesheet">

<!-- Bootstrap Icons -->

<link
href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
rel="stylesheet">

<!-- DataTables -->

<link
rel="stylesheet"
href="https://cdn.datatables.net/2.3.2/css/dataTables.bootstrap5.css">

<link
rel="stylesheet"
href="https://cdn.datatables.net/buttons/3.2.3/css/buttons.bootstrap5.min.css">


<link rel="stylesheet"
href="../assets/css/loan.css">
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

<!-- Sidebar -->

<?php include_once('/common/sidenav.php') ?>

<!-- Content -->

<div class="content">

    <!-- Topbar -->

    <div
        class="topbar d-flex justify-content-between align-items-center">

        <div>

            <h4 class="mb-1">

                Daily Close Management

            </h4>

            <small class="text-muted">

                Review, approve and monitor cashier daily returns

            </small>

        </div>


    </div>
        <!-- Statistics -->

    <div class="row mt-4 g-4">

        <div class="col-lg-3 col-md-6">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <small class="text-muted">
                            Pending
                        </small>

                        <h2
                            class="mt-2 mb-0"
                            id="lblPending">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-warning">

                        <i class="bi bi-hourglass-split"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-lg-3 col-md-6">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <small class="text-muted">
                            Approved
                        </small>

                        <h2
                            class="mt-2 mb-0"
                            id="lblApproved">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-success">

                        <i class="bi bi-check-circle-fill"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-lg-3 col-md-6">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <small class="text-muted">
                            Rejected
                        </small>

                        <h2
                            class="mt-2 mb-0"
                            id="lblRejected">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-danger">

                        <i class="bi bi-x-circle-fill"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-lg-3 col-md-6">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <small class="text-muted">
                            Cancelled
                        </small>

                        <h2
                            class="mt-2 mb-0"
                            id="lblCancelled">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-primary">

                        <i class="bi bi-slash-circle-fill"></i>

                    </div>

                </div>

            </div>

        </div>

    </div>

    <!-- Filters -->

    <!-- <div class="filter-card mt-4">

        <div class="row g-3">

            <div class="col-md-4">

                <label class="form-label">

                    Cashier

                </label>

                <select
                    class="form-select"
                    id="filterCashier">

                    <option value="">

                        All Cashiers

                    </option>

                </select>

            </div>

            <div class="col-md-3">

                <label class="form-label">

                    Business Date

                </label>

                <input
                    type="date"
                    class="form-control"
                    id="filterBusinessDate">

            </div>

            <div class="col-md-3">

                <label class="form-label">

                    Status

                </label>

                <select
                    class="form-select"
                    id="filterStatus">

                    <option value="">
                        All
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="APPROVED">
                        Approved
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>

                </select>

            </div>

            <div
                class="col-md-2 d-flex align-items-end">

                <button
                    class="btn btn-primary w-100"
                    id="btnSearch">

                    <i class="bi bi-search"></i>

                    Search

                </button>

            </div>

        </div>

    </div> -->

    <!-- Daily Close Table -->

    <div class="page-card mt-4 p-4">

        <table
            id="tblDailyClose"
            class="table table-striped table-hover align-middle w-100">

           <thead class="table-dark">

                <tr>

                    <th data-data="cashier_daily_close_id">
                        ID
                    </th>

                    <th data-data="cashier_name">
                        Cashier
                    </th>

                    <th data-data="business_date">
                        Business Date
                    </th>

                    <th data-data="expected_cash">
                        Expected
                    </th>

                    <th data-data="actual_cash">
                        Actual
                    </th>

                    <th data-data="variance">
                        Variance
                    </th>

                    <th data-data="returned_amount">
                        Returned
                    </th>

                    <th data-data="status">
                        Status
                    </th>

                    <th>
                        Action
                    </th>

                </tr>

            </thead>

        </table>

    </div>
        <!-- View Daily Close Modal -->

    <div
        class="modal fade"
        id="viewDailyCloseModal"
        tabindex="-1">

        <div class="modal-dialog modal-xl">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title">

                        Daily Close Details

                    </h5>

                    <button
                        class="btn-close"
                        data-bs-dismiss="modal"></button>

                </div>

                <div class="modal-body">

                    <div class="row">

                        <div class="col-md-6">

                            <table class="table table-bordered">

                                <tr>

                                    <th width="180">
                                        Cashier
                                    </th>

                                    <td id="viewCashier"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Business Date
                                    </th>

                                    <td id="viewBusinessDate"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Expected Cash
                                    </th>

                                    <td id="viewExpectedCash"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Actual Cash
                                    </th>

                                    <td id="viewActualCash"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Variance
                                    </th>

                                    <td id="viewVariance"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Returned Amount
                                    </th>

                                    <td id="viewReturnedAmount"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Status
                                    </th>

                                    <td id="viewStatus"></td>

                                </tr>

                                <tr>

                                    <th>
                                        Remarks
                                    </th>

                                    <td id="viewRemarks"></td>

                                </tr>

                            </table>

                        </div>

                        <div class="col-md-6">

                            <h6>

                                Denominations

                            </h6>

                            <table
                                class="table table-sm table-bordered">

                                <thead>

                                    <tr>

                                        <th>
                                            Denomination
                                        </th>

                                        <th>
                                            Qty
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody
                                    id="tblDenominations">

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <hr>

                    <h6>

                        Activity Logs

                    </h6>

                    <table
                        class="table table-striped">

                        <thead>

                            <tr>

                                <th>Date</th>
                                <th>Action</th>
                                <th>User</th>
                                <th>Remarks</th>

                            </tr>

                        </thead>

                        <tbody id="tblLogs">

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    </div>

    <!-- Approve Modal -->

    <div
        class="modal fade"
        id="approveModal"
        tabindex="-1">

        <div class="modal-dialog">

            <div class="modal-content">

                <div class="modal-header">

                    <h5>

                        Approve Daily Close

                    </h5>

                    <button
                        class="btn-close"
                        data-bs-dismiss="modal"></button>

                </div>

                <div class="modal-body">

                    <input
                        type="hidden"
                        id="approveId">

                    <label>

                        Remarks

                    </label>

                    <textarea
                        class="form-control"
                        id="approveRemarks"
                        rows="4"></textarea>

                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">

                        Close

                    </button>

                    <button
                        class="btn btn-success"
                        id="btnApprove">

                        Approve

                    </button>

                </div>

            </div>

        </div>

    </div>

    <!-- Reject Modal -->

    <div
        class="modal fade"
        id="rejectModal"
        tabindex="-1">

        <div class="modal-dialog">

            <div class="modal-content">

                <div class="modal-header">

                    <h5>

                        Reject Daily Close

                    </h5>

                    <button
                        class="btn-close"
                        data-bs-dismiss="modal"></button>

                </div>

                <div class="modal-body">

                    <input
                        type="hidden"
                        id="rejectId">

                    <label>

                        Reason

                    </label>

                    <textarea
                        class="form-control"
                        id="rejectRemarks"
                        rows="4"></textarea>

                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">

                        Close

                    </button>

                    <button
                        class="btn btn-danger"
                        id="btnReject">

                        Reject

                    </button>

                </div>

            </div>

        </div>

    </div>

    <!-- Cancel Modal -->

    <div
        class="modal fade"
        id="cancelModal"
        tabindex="-1">

        <div class="modal-dialog">

            <div class="modal-content">

                <div class="modal-header">

                    <h5>

                        Cancel Daily Close

                    </h5>

                    <button
                        class="btn-close"
                        data-bs-dismiss="modal"></button>

                </div>

                <div class="modal-body">

                    <input
                        type="hidden"
                        id="cancelId">

                    <label>

                        Cancellation Reason

                    </label>

                    <textarea
                        class="form-control"
                        id="cancelReason"
                        rows="4"></textarea>

                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">

                        Close

                    </button>

                    <button
                        class="btn btn-warning"
                        id="btnCancel">

                        Cancel Daily Close

                    </button>

                </div>

            </div>

        </div>

    </div>

</div>

<!-- jQuery -->

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- SweetAlert -->

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Bootstrap -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- DataTables -->

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<!-- Buttons -->

<script src="https://cdn.datatables.net/buttons/3.2.3/js/dataTables.buttons.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.bootstrap5.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.html5.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.print.min.js"></script>

<!-- Config -->

<script src="../assets/js/config.js"></script>

<!-- Common -->

<script src="../assets/js/common.js"></script>

<!-- Daily Close JS -->

<script src="../assets/js/dailyclose.js"></script>

</body>

</html>