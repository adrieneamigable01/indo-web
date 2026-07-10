<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1">

<title>Loan Management</title>

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

                Loan Management

            </h4>

            <small class="text-muted">

                Review, approve, release and monitor loan applications.

            </small>

        </div>

        <!-- <div>

            <button
                class="btn btn-success"
                id="btnExportLoan">

                <i class="bi bi-file-earmark-excel"></i>

                Export

            </button>

            <button
                class="btn btn-primary"
                id="btnRefreshLoan">

                <i class="bi bi-arrow-clockwise"></i>

                Refresh

            </button>

        </div> -->

    </div>

    <!-- SUMMARY -->

    <div class="row g-4 mt-1">

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>

                            Pending Approval

                        </small>

                        <h2
                            class="mt-2"
                            id="pendingCount">

                            0

                        </h2>

                    </div>

                    <div class="icon-box bg-warning text-white">

                        <i class="bi bi-hourglass-split"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>

                            Approved

                        </small>

                        <h2
                            class="mt-2"
                            id="approvedCount">

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

                        <small>

                            Released

                        </small>

                        <h2
                            class="mt-2"
                            id="releasedCount">

                            0

                        </h2>

                    </div>

                    <div class="icon-box icon-primary">

                        <i class="bi bi-cash-stack"></i>

                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="stat-card p-4">

                <div class="d-flex justify-content-between">

                    <div>

                        <small>

                            Disapproved

                        </small>

                        <h2
                            class="mt-2"
                            id="disapprovedCount">

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

    <!-- LOAN LIST -->

    <div class="page-card p-4 mt-4">

        <div class="row mb-4">

            <div class="col-md-3">

                <label>

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

                    <option value="RELEASED" selected>

                        Released

                    </option>

                    <option value="DISAPPROVED">

                        Disapproved

                    </option>

                </select>

            </div>

            <div class="col-md-3">

                <label>

                    Loan Product

                </label>

                <select
                    class="form-select"
                    id="filterProduct">

                    <option value="">

                        All Products

                    </option>

                </select>

            </div>


        </div>

        <table
            id="loanTable"
            class="table table-hover align-middle">

            <thead class="table-dark">

            <tr>

                <th>Loan ID</th>

                <th>Borrower</th>

                <th>Loan Product</th>

                <th>Loan Amount</th>

                <th>Interest</th>

                <th>Terms</th>

                <th>Applied</th>

                <th>Status</th>

                <th width="220">

                    Action

                </th>

            </tr>

            </thead>

            <tbody></tbody>

        </table>

    </div>

</div>

<!-- ===================================================== -->
<!-- VIEW LOAN MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="viewLoanModal"
     tabindex="-1">

    <div class="modal-dialog modal-xl modal-dialog-scrollable">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">

                    <i class="bi bi-file-earmark-text"></i>

                    Loan Details

                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div id="loanDetails">

                </div>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Close

                </button>

            </div>

        </div>

    </div>

</div>


<!-- ===================================================== -->
<!-- APPROVE MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="approveModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-success text-white">

                <h5>

                    <i class="bi bi-check-circle"></i>

                    Approve Loan

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="approveLoanId">

                <div class="mb-3">

                    <label>

                        Approved Amount

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="approvedAmount">

                </div>

                <div class="mb-3">

                    <label>

                        Interest Rate (%)

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="approvedInterest">

                </div>

                <div class="mb-3">

                    <label>

                        Processing Fee (%)

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="approvedProcessingFee">

                </div>

                <div class="mb-3">

                    <label>

                        Loan Terms

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="approvedTerms">

                </div>

                <div class="mb-3">

                    <label>

                        Remarks

                    </label>

                    <textarea
                        class="form-control"
                        id="approveRemarks"
                        rows="4"></textarea>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cancel

                </button>

                <button
                    class="btn btn-success"
                    id="btnApproveLoan">

                    <i class="bi bi-check-circle"></i>

                    Approve Loan

                </button>

            </div>

        </div>

    </div>

</div>


<!-- ===================================================== -->
<!-- DISAPPROVE MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="disapproveModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-danger text-white">

                <h5>

                    <i class="bi bi-x-circle"></i>

                    Disapprove Loan

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="disapproveLoanId">

                <div class="mb-3">

                    <label>

                        Reason

                    </label>

                    <textarea
                        class="form-control"
                        id="disapproveReason"
                        rows="5"
                        placeholder="Enter reason..."></textarea>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cancel

                </button>

                <button
                    class="btn btn-danger"
                    id="btnDisapproveLoan">

                    <i class="bi bi-x-circle"></i>

                    Disapprove

                </button>

            </div>

        </div>

    </div>

</div>


<!-- ===================================================== -->
<!-- RELEASE MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="releaseModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-primary text-white">

                <h5>

                    <i class="bi bi-cash-stack"></i>

                    Release Loan

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="releaseLoanId">

                <div id="releaseSummary">

                    <table class="table table-bordered">

                        <tr>

                            <th>

                                Approved Amount

                            </th>

                            <td id="releaseLoanAmount">

                                ₱0.00

                            </td>

                        </tr>

                        <tr>

                            <th>

                                Processing Fee

                            </th>

                            <td id="releaseProcessing">

                                ₱0.00

                            </td>

                        </tr>

                        <tr>

                            <th>

                                Interest

                            </th>

                            <td id="releaseInterest">

                                ₱0.00

                            </td>

                        </tr>

                        <tr class="table-success">

                            <th>

                                Net Proceeds

                            </th>

                            <td id="releaseNet">

                                ₱0.00

                            </td>

                        </tr>

                    </table>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cancel

                </button>

                <button
                    class="btn btn-primary"
                    id="btnReleaseLoan">

                    <i class="bi bi-cash-stack"></i>

                    Release Loan

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

<script src="assets/js/config.js"></script>

<script src="assets/js/common.js"></script>

<script src="assets/js/loan.js"></script>

</body>

</html>