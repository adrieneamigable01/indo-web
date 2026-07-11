<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1">

<title>Manager Vault</title>

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
href="../assets/css/loan.css">

</head>

<body>

<!-- ===================================================== -->
<!-- SIDEBAR -->
<!-- ===================================================== -->

<?php include_once('common/sidenav.php'); ?>

<!-- ===================================================== -->
<!-- CONTENT -->
<!-- ===================================================== -->

<!-- ===================================================== -->
<!-- CONTENT -->
<!-- ===================================================== -->

<div class="content">

    <!-- ================================================= -->
    <!-- PAGE HEADER -->
    <!-- ================================================= -->

    <div
        class="d-flex
               justify-content-between
               align-items-center
               flex-wrap
               mb-4">

        <div>

            <h3 class="mb-1">

                <i class="bi bi-safe2-fill text-primary"></i>

                Manager Vault

            </h3>

            <small class="text-muted">

                Monitor and manage all vault transactions.

            </small>

        </div>

        <div
            class="d-flex gap-2">

            <button
                class="btn btn-success"
                id="btnCashIn">

                <i class="bi bi-plus-circle"></i>

                Cash In

            </button>

            <button
                class="btn btn-danger"
                id="btnCashOut">

                <i class="bi bi-dash-circle"></i>

                Cash Out

            </button>

            <button
                class="btn btn-warning text-dark"
                id="btnTransfer">

                <i class="bi bi-arrow-left-right"></i>

                Transfer

            </button>

            <button
                class="btn btn-secondary"
                id="btnRefresh">

                <i class="bi bi-arrow-clockwise"></i>

                Refresh

            </button>

        </div>

    </div>



    <!-- ================================================= -->
    <!-- SUMMARY -->
    <!-- ================================================= -->

    <div class="row g-4 mb-4">

        <!-- CURRENT BALANCE -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Current Vault Balance

                    </small>

                    <h3
                        id="managerBalance"
                        class="fw-bold text-success mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

        <!-- CASH IN -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Total Cash In

                    </small>

                    <h3
                        id="totalCashIn"
                        class="fw-bold text-primary mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

        <!-- CASH OUT -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Total Cash Out

                    </small>

                    <h3
                        id="totalCashOut"
                        class="fw-bold text-danger mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

        <!-- TRANSFER -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Transfer to Cashier

                    </small>

                    <h3
                        id="totalTransfer"
                        class="fw-bold text-warning mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

    </div>

    <!-- ================================================= -->
    <!-- FILTER -->
    <!-- ================================================= -->

    <div
        class="page-card p-4 mt-4">

        <div class="card shadow-sm border-0 mb-4">

            <div class="card-body">

                <div class="row g-3">

                    <div class="col-lg-3">

                        <label>

                            Business Date

                        </label>

                        <input
                            type="date"
                            id="filterBusinessDate"
                            class="form-control"
                            value="<?php echo date("Y-m-d")?>">

                    </div>

                    <div class="col-lg-3">

                        <label>

                            Cashier

                        </label>

                        <select
                            id="filterCashier"
                            class="form-select">

                            <option value="">

                                All Transactions

                            </option>

                        </select>

                    </div>

                    <div class="col-lg-3">

                        <label>

                            Transaction

                        </label>

                        <select
                            id="filterTransaction"
                            class="form-select">

                            <option value="">

                                All Transactions

                            </option>

                            <option value="CASH_IN">

                                Cash In

                            </option>

                            <option value="CASH_OUT">

                                Cash Out

                            </option>

                            <option value="TRANSFER">

                                Transfer

                            </option>

                            <option value="RETURN TO VAULT">

                                Return To Vault

                            </option>

                        </select>

                    </div>

                    <div class="col-lg-3">

                        <label>

                            Search

                        </label>

                        <div class="input-group">

                            <input
                                type="text"
                                id="txtSearch"
                                class="form-control"
                                placeholder="Reference">

                            <button
                                class="btn btn-primary"
                                id="btnSearch">

                                <i class="bi bi-search"></i>

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
                <!-- ================================================= -->
        <!-- MANAGER VAULT TABLE -->
        <!-- ================================================= -->

        <div class="table-responsive">

            <table
                id="tblManagerVault"
                class="table table-striped table-hover align-middle w-100">

                <thead class="table-dark">

                    <tr>

                        <th width="70">

                            #

                        </th>

                        <th>

                            Business Date

                        </th>

                        <th>

                            Reference #

                        </th>

                        <th>

                            Cashier

                        </th>

                        <th>

                            Transaction

                        </th>

                        <th class="text-end">

                            Amount

                        </th>

                        <th class="text-end">

                            Balance Before

                        </th>

                        <th>

                            Balance After

                        </th>
                        <th>
                            Created By
                        </th>

                        <th width="180">

                            Action

                        </th>

                    </tr>

                </thead>

                <tbody>

                </tbody>

            </table>

        </div>

    </div>

</div>


<!-- ===================================================== -->
<!-- VIEW TRANSACTION -->
<!-- ===================================================== -->

<div
    class="modal fade"
    id="modalViewTransaction"
    tabindex="-1">

    <div
        class="modal-dialog modal-xl">

        <div
            class="modal-content">

            <div
                class="modal-header">

                <h5>

                    Manager Vault Transaction

                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">

                </button>

            </div>

            <div
                class="modal-body">

                <div class="row">

                    <div class="col-md-4">

                        <label>

                            Reference #

                        </label>

                        <input
                            id="viewReferenceNo"
                            class="form-control"
                            readonly>

                    </div>

                    <div class="col-md-4">

                        <label>

                            Business Date

                        </label>

                        <input
                            id="viewBusinessDate"
                            class="form-control"
                            readonly>

                    </div>

                    <div class="col-md-4">

                        <label>

                            Cashier

                        </label>

                        <input
                            id="viewCashier"
                            class="form-control"
                            readonly>

                    </div>

                    <div class="col-md-4 mt-3">

                        <label>

                            Transaction

                        </label>

                        <input
                            id="viewTransactionType"
                            class="form-control"
                            readonly>

                    </div>

                    <div class="col-md-4 mt-3">

                        <label>

                            Amount

                        </label>

                        <input
                            id="viewAmount"
                            class="form-control"
                            readonly>

                    </div>

                    <div class="col-md-4 mt-3">

                        <label>

                            Status

                        </label>

                        <input
                            id="viewStatus"
                            class="form-control"
                            readonly>

                    </div>

                </div>

                <hr>

                <h6>

                    Daily Close Information

                </h6>

                <table
                    class="table table-bordered">

                    <tr>

                        <th width="250">

                            Expected Cash

                        </th>

                        <td id="expectedCash">

                        </td>

                    </tr>

                    <tr>

                        <th>

                            Returned Cash

                        </th>

                        <td id="returnedCash">

                        </td>

                    </tr>

                    <tr>

                        <th>

                            Variance

                        </th>

                        <td id="variance">

                        </td>

                    </tr>

                </table>

                <hr>

                <h6>

                    Denomination Breakdown

                </h6>

                <table
                    class="table table-bordered"
                    id="tblDenomination">

                    <thead>

                        <tr>

                            <th>

                                Denomination

                            </th>

                            <th>

                                Qty

                            </th>

                            <th>

                                Amount

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                    </tbody>

                </table>

                <hr>

                <h6>

                    Transaction Breakdown

                </h6>

                <table
                    class="table table-striped"
                    id="tblBreakdown">

                    <thead>

                        <tr>

                            <th>

                                Transaction

                            </th>

                            <th>

                                Description

                            </th>

                            <th class="text-end">

                                Amount

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                    </tbody>

                </table>

            </div>

            <div
                class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Close

                </button>

                <button
                    class="btn btn-success"
                    id="btnApproveClose">

                    <i class="bi bi-check-circle"></i>

                    Approve

                </button>

                <button
                    class="btn btn-danger"
                    id="btnRejectClose">

                    <i class="bi bi-x-circle"></i>

                    Reject

                </button>

            </div>

        </div>

    </div>

</div>

<div class="modal fade"
     id="cashInModal"
     tabindex="-1">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header bg-success text-white">

                <h5 class="modal-title">

                    <i class="bi bi-cash-stack"></i>

                    Cash In

                </h5>

                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="row">

                    <div class="col-md-12 mb-3">

                        <label>

                            Amount

                        </label>

                        <input
                            type="number"
                            id="cashInAmount"
                            class="form-control">

                    </div>

                    <div class="col-md-12">

                        <label>

                            Remarks

                        </label>

                        <textarea
                            id="cashInRemarks"
                            class="form-control"
                            rows="3"></textarea>

                    </div>

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
                    id="btnSaveCashIn">

                    <i class="bi bi-check-circle"></i>

                    Save

                </button>

            </div>

        </div>

    </div>

</div>

<div class="modal fade"
     id="cashOutModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-danger text-white">

                <h5 class="modal-title">

                    <i class="bi bi-cash-stack"></i>

                    Cash Out

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="mb-3">

                    <label>

                        Amount

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="cashOutAmount">

                </div>

                <div class="mb-3">

                    <label>

                        Remarks

                    </label>

                    <textarea
                        id="cashOutRemarks"
                        class="form-control"
                        rows="3"></textarea>

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
                    id="btnSaveCashOut">

                    Save

                </button>

            </div>

        </div>

    </div>

    
</div>

<div class="modal fade"
     id="transferModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-warning">

                <h5 class="modal-title">

                    <i class="bi bi-arrow-left-right"></i>

                    Transfer to Cashier

                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="mb-3">

                    <label>

                        Cashier

                    </label>

                    <select
                        id="transferCashier"
                        class="form-select">

                        <option value="">

                            Select Cashier

                        </option>

                    </select>

                </div>

                <div class="mb-3">

                    <label>

                        Amount

                    </label>

                    <input
                        type="number"
                        id="transferAmount"
                        class="form-control">

                </div>

                <div class="mb-3">

                    <label>

                        Remarks

                    </label>

                    <textarea
                        id="transferRemarks"
                        rows="3"
                        class="form-control"></textarea>

                </div>

            </div>

            <div class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cancel

                </button>

                <button
                    class="btn btn-warning"
                    id="btnSaveTransfer">

                    Transfer

                </button>

            </div>

        </div>

    </div>

</div> 

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<!-- SWEETALERT -->

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="../assets/js/config.js"></script>

<script src="../assets/js/common.js"></script>

<script src="../assets/js/managers-vault.js"></script>
</html>