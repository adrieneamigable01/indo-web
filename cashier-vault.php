<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1">

<title>Cashier Vault</title>

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

<!-- ===================================================== -->
<!-- SIDEBAR -->
<!-- ===================================================== -->

<?php include_once('common/sidenav.php'); ?>

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

                <i class="bi bi-wallet2 text-primary"></i>

                Cashier Vault

            </h3>

            <small class="text-muted">

                Monitor your daily cash transactions and submit Daily Close.

            </small>

        </div>

        <div
            class="d-flex gap-2">

            <button
                class="btn btn-success"
                id="btnDailyClose">

                <i class="bi bi-cash-stack"></i>

                Daily Close

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

                        Current Cash Balance

                    </small>

                    <h3
                        id="cashierBalance"
                        class="fw-bold text-success mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

        <!-- CASH RECEIVED -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Cash Received

                    </small>

                    <h3
                        id="totalCashIn"
                        class="fw-bold text-primary mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

        <!-- CASH RELEASED -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Cash Released

                    </small>

                    <h3
                        id="totalCashOut"
                        class="fw-bold text-danger mt-2">

                        ₱0.00

                    </h3>

                </div>

            </div>

        </div>

        <!-- RETURN TO MANAGER -->

        <div class="col-lg-3 col-md-6">

            <div class="card shadow-sm border-0">

                <div class="card-body">

                    <small class="text-muted">

                        Returned to Manager

                    </small>

                    <h3
                        id="totalReturn"
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

                    <div class="col-lg-4">

                        <label>

                            Business Date

                        </label>

                        <input
                            type="date"
                            id="filterBusinessDate"
                            class="form-control">

                    </div>

                    <div class="col-lg-4">

                        <label>

                            Transaction

                        </label>

                        <select
                            id="filterTransaction"
                            class="form-select">

                            <option value="">

                                All Transactions

                            </option>

                            <option value="RECEIVED_FROM_MANAGER">

                                Received From Manager

                            </option>

                            <option value="LOAN_RELEASE">

                                Loan Release

                            </option>

                            <option value="PAYMENT_COLLECTION">

                                Payment Collection

                            </option>

                            <option value="RETURN TO VAULT">

                                Return To Manager

                            </option>

                            <option value="ADJUSTMENT">

                                Adjustment

                            </option>

                        </select>

                    </div>

                    <div class="col-lg-4">

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
                <!-- CASHIER VAULT TABLE -->
                <!-- ================================================= -->

                <div class="table-responsive">

                    <table
                        id="tblCashierVault"
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

                                    Transaction

                                </th>

                                <th class="text-end">

                                    Amount

                                </th>

                                <th class="text-end">

                                    Balance Before

                                </th>

                                <th class="text-end">

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

    </div>
    <!-- ===================================================== -->
<!-- DAILY CLOSE -->
<!-- ===================================================== -->

<div
    class="modal fade"
    id="dailyCloseModal"
    tabindex="-1">

    <div
        class="modal-dialog modal-xl">

        <div
            class="modal-content">

            <div
                class="modal-header bg-success text-white">

                <h5
                    class="modal-title">

                    <i class="bi bi-cash-stack"></i>

                    Daily Close

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">

                </button>

            </div>

            <div
                class="modal-body">

                <!-- ======================================== -->
                <!-- SUMMARY -->
                <!-- ======================================== -->

                <div class="row">

                    <div class="col-md-3">

                        <label>

                            Business Date

                        </label>

                        <input
                            type="date"
                            id="businessDate"
                            class="form-control">

                    </div>

                    <div class="col-md-3">

                        <label>

                            Expected Cash

                        </label>

                        <input
                            id="expectedCash"
                            class="form-control text-end"
                            readonly>

                    </div>

                    <div class="col-md-3">

                        <label>

                            Actual Cash

                        </label>

                        <input
                            id="actualCash"
                            class="form-control text-end"
                            readonly>

                    </div>

                    <div class="col-md-3">

                        <label>

                            Variance

                        </label>

                        <input
                            id="variance"
                            class="form-control text-end fw-bold"
                            readonly>

                    </div>

                </div>

                <hr>

                <!-- ======================================== -->
                <!-- DENOMINATIONS -->
                <!-- ======================================== -->

                <h5>

                    Cash Count

                </h5>

                <small class="text-muted">

                    Enter the quantity for each denomination.

                </small>

                <div class="table-responsive mt-3">

                    <table
                        class="table table-bordered table-striped">

                        <thead class="table-dark">

                            <tr>

                                <th width="200">

                                    Denomination

                                </th>

                                <th width="180">

                                    Quantity

                                </th>

                                <th>

                                    Amount

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>

                                    ₱1,000

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        class="form-control denominationQty"
                                        data-value="1000"
                                        id="qty1000"
                                        min="0"
                                        value="0">

                                </td>

                                <td
                                    id="total1000"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                            <tr>

                                <td>

                                    ₱500

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        class="form-control denominationQty"
                                        data-value="500"
                                        id="qty500"
                                        min="0"
                                        value="0">

                                </td>

                                <td
                                    id="total500"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                            <tr>

                                <td>

                                    ₱200

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        class="form-control denominationQty"
                                        data-value="200"
                                        id="qty200"
                                        min="0"
                                        value="0">

                                </td>

                                <td
                                    id="total200"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                            <tr>

                                <td>

                                    ₱100

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        class="form-control denominationQty"
                                        data-value="100"
                                        id="qty100"
                                        min="0"
                                        value="0">

                                </td>

                                <td
                                    id="total100"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                            <tr>

                                <td>

                                    ₱50

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        class="form-control denominationQty"
                                        data-value="50"
                                        id="qty50"
                                        min="0"
                                        value="0">

                                </td>

                                <td
                                    id="total50"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                            <tr>

                                <td>

                                    ₱20

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        class="form-control denominationQty"
                                        data-value="20"
                                        id="qty20"
                                        min="0"
                                        value="0">

                                </td>

                                <td
                                    id="total20"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                            <tr>

                                <td>

                                    Coins

                                </td>

                                <td>

                                    <button
                                        class="btn btn-outline-primary btn-sm"
                                        id="btnCoins">

                                        Count Coins

                                    </button>

                                </td>

                                <td
                                    id="coinsTotal"
                                    class="text-end">

                                    ₱0.00

                                </td>

                            </tr>

                        </tbody>

                        <tfoot class="table-success">

                            <tr>

                                <th colspan="2">

                                    TOTAL CASH

                                </th>

                                <th
                                    class="text-end"
                                    id="grandTotal">

                                    ₱0.00

                                </th>

                            </tr>

                        </tfoot>

                    </table>

                </div>

                <hr>

                <div class="mb-3">

                    <label>

                        Remarks

                    </label>

                    <textarea
                        id="dailyCloseRemarks"
                        class="form-control"
                        rows="3"
                        placeholder="Remarks">

                    </textarea>

                </div>

            </div>

            <div
                class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cancel

                </button>

                <button
                    class="btn btn-success"
                    id="btnSubmitDailyClose">

                    <i class="bi bi-check-circle"></i>

                    Submit Daily Close

                </button>

            </div>

        </div>

    </div>

</div>
<!-- ===================================================== -->
<!-- COINS COUNT -->
<!-- ===================================================== -->

<div
    class="modal fade"
    id="coinsModal"
    tabindex="-1">

    <div
        class="modal-dialog modal-lg">

        <div
            class="modal-content">

            <div
                class="modal-header bg-primary text-white">

                <h5
                    class="modal-title">

                    <i class="bi bi-coin"></i>

                    Coin Counter

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">

                </button>

            </div>

            <div
                class="modal-body">

                <table
                    class="table table-bordered table-striped">

                    <thead class="table-dark">

                        <tr>

                            <th width="180">

                                Coin

                            </th>

                            <th width="180">

                                Quantity

                            </th>

                            <th>

                                Amount

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>

                                ₱20

                            </td>

                            <td>

                                <input
                                    type="number"
                                    class="form-control coinQty"
                                    data-value="20"
                                    id="coin20"
                                    value="0"
                                    min="0">

                            </td>

                            <td
                                id="coin20Total"
                                class="text-end">

                                ₱0.00

                            </td>

                        </tr>

                        <tr>

                            <td>

                                ₱10

                            </td>

                            <td>

                                <input
                                    type="number"
                                    class="form-control coinQty"
                                    data-value="10"
                                    id="coin10"
                                    value="0"
                                    min="0">

                            </td>

                            <td
                                id="coin10Total"
                                class="text-end">

                                ₱0.00

                            </td>

                        </tr>

                        <tr>

                            <td>

                                ₱5

                            </td>

                            <td>

                                <input
                                    type="number"
                                    class="form-control coinQty"
                                    data-value="5"
                                    id="coin5"
                                    value="0"
                                    min="0">

                            </td>

                            <td
                                id="coin5Total"
                                class="text-end">

                                ₱0.00

                            </td>

                        </tr>

                        <tr>

                            <td>

                                ₱1

                            </td>

                            <td>

                                <input
                                    type="number"
                                    class="form-control coinQty"
                                    data-value="1"
                                    id="coin1"
                                    value="0"
                                    min="0">

                            </td>

                            <td
                                id="coin1Total"
                                class="text-end">

                                ₱0.00

                            </td>

                        </tr>

                        <tr>

                            <td>

                                ₱0.25

                            </td>

                            <td>

                                <input
                                    type="number"
                                    class="form-control coinQty"
                                    data-value="0.25"
                                    id="coin25"
                                    value="0"
                                    min="0">

                            </td>

                            <td
                                id="coin25Total"
                                class="text-end">

                                ₱0.00

                            </td>

                        </tr>

                    </tbody>

                    <tfoot class="table-success">

                        <tr>

                            <th colspan="2">

                                TOTAL COINS

                            </th>

                            <th
                                id="coinGrandTotal"
                                class="text-end">

                                ₱0.00

                            </th>

                        </tr>

                    </tfoot>

                </table>

            </div>

            <div
                class="modal-footer">

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cancel

                </button>

                <button
                    class="btn btn-primary"
                    id="btnSaveCoins">

                    <i class="bi bi-check-circle"></i>

                    Apply Coins

                </button>

            </div>

        </div>

    </div>

</div>
<!-- ===================================================== -->
<!-- VIEW TRANSACTION -->
<!-- ===================================================== -->

<div
    class="modal fade"
    id="viewTransactionModal"
    tabindex="-1">

    <div
        class="modal-dialog modal-xl">

        <div
            class="modal-content">

            <div
                class="modal-header bg-primary text-white">

                <h5
                    class="modal-title">

                    <i class="bi bi-eye"></i>

                    Transaction Details

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">

                </button>

            </div>

            <div
                class="modal-body">

                <div
                    id="transactionDetails">

                </div>

            </div>

            <div
                class="modal-footer">

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
<!-- LOADING -->
<!-- ===================================================== -->

<div
    id="loadingOverlay"
    style="
        display:none;
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(255,255,255,.6);
        z-index:9999;
    ">

    <div
        class="d-flex
               justify-content-center
               align-items-center
               h-100">

        <div
            class="spinner-border text-primary">

        </div>

    </div>

</div>

</div>

</section>

</div>

<!-- ===================================================== -->
<!-- JAVASCRIPT -->
<!-- ===================================================== -->

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script src="assets/js/config.js"></script>

<script src="assets/js/common.js"></script>

<script src="assets/js/cashier-vault.js"></script>

</body>

</html>