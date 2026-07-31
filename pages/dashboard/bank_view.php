<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1">

    <title>

        Bank Account Details

    </title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css">
        <link
        rel="stylesheet"
        href="../assets/css/loan.css">
    
    <link
        rel="stylesheet"
        href="../assets/css/bank.css">
    

</head>

<body>

<!-- ========================================================= -->
<!-- SIDEBAR -->
<!-- ========================================================= -->

<?php include_once('common/sidenav.php') ?>

<!-- ========================================================= -->
<!-- TOPBAR -->
<!-- ========================================================= -->

<div class="topbar d-flex justify-content-between align-items-center">

    <div>

        <h4 class="mb-0">

            Bank Account Details

        </h4>

        <small class="text-muted">

            View bank account information and transaction history.

        </small>

    </div>

    <div>

        <button
            class="btn btn-outline-secondary"
            id="btnBack">

            <i class="bi bi-arrow-left"></i>

            Back

        </button>

        <button
            class="btn btn-warning"
            id="btnEditBank">

            <i class="bi bi-pencil-square"></i>

            Edit

        </button>

        <button
            class="btn btn-success"
            id="btnDeposit">

            <i class="bi bi-arrow-down-circle"></i>

            Deposit

        </button>

        <button
            class="btn btn-danger"
            id="btnWithdraw">

            <i class="bi bi-arrow-up-circle"></i>

            Withdraw

        </button>
        <button
            class="btn btn-primary"
            id="btnTransfer">

            <i class="bi bi-arrow-up-circle"></i>

            Transfer

        </button>

    </div>

</div>

<!-- ========================================================= -->
<!-- BANK ACCOUNT INFORMATION -->
<!-- ========================================================= -->

<div class="page-card p-4 mt-4">

    <div class="row">

        <!-- ATM CARD -->

        <div class="col-lg-7">

            <div class="atm-card">

                <div class="d-flex justify-content-between align-items-start">

                    <div>

                        <small>

                            Bank

                        </small>

                        <h4 id="bankName">

                            -

                        </h4>

                    </div>

                    <span
                        id="viewStatus"
                        class="badge bg-success">

                        -

                    </span>

                </div>

                <div class="mt-5">

                    <small>

                        Account Holder

                    </small>

                    <h3 id="viewAccountName">

                    -

                    </h3>

                </div>

                <div class="mt-4">

                    <div
                        class="account-number"
                        id="viewAccountNumber">

                  

                    </div>

                </div>

                <div class="d-flex justify-content-between mt-5">

                    <div>

                        <small>

                            Current Balance

                        </small>

                        <h2
                            id="viewCurrentBalance">

                            -

                        </h2>

                    </div>

                    <i class="bi bi-bank2 atm-icon"></i>

                </div>

            </div>

        </div>
        <div class="col-lg-5">

    <div class="row g-3">

        <div class="col-6">

            <div class="info-box">

                <small>

                    Branch

                </small>

                <h6 id="viewBranchName">

                    -

                </h6>

            </div>

        </div>

        <div class="col-6">

            <div class="info-box">

                <small>

                    Account Type

                </small>

                <h6 id="viewAccountType">

                    -

                </h6>

            </div>

        </div>

        <div class="col-6">

            <div class="info-box">

                <small>

                    Currency

                </small>

                <h6 id="viewCurrency">

                    PHP

                </h6>

            </div>

        </div>

        <div class="col-6">

            <div class="info-box">

                <small>

                    Opening Balance

                </small>

                <h6 id="viewOpeningBalance">

                    ₱0.00

                </h6>

            </div>

        </div>

        <div class="col-12">

            <div class="info-box">

                <small>

                    Description

                </small>

                <p
                    class="mb-0"
                    id="viewDescription">

                    -

                </p>

            </div>

        </div>

    </div>

</div>

</div>

</div>
<!-- ========================================================= -->
<!-- SUMMARY -->
<!-- ========================================================= -->

<div class="row g-4 mt-1">

    <!-- Current Balance -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Current Balance</small>
                    <h2 class="mt-2 text-primary" id="currentBalance">
                        ₱0.00
                    </h2>
                </div>
                <div class="icon-box icon-primary">
                    <i class="bi bi-wallet2"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Opening Balance -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Opening Balance</small>
                    <h2 class="mt-2 text-secondary" id="openingBalance">
                        ₱0.00
                    </h2>
                </div>
                <div class="icon-box bg-secondary text-white">
                    <i class="bi bi-cash-stack"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Total Deposits -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Total Deposits</small>
                    <h2 class="mt-2 text-success" id="totalDeposits">
                        ₱0.00
                    </h2>
                </div>
                <div class="icon-box icon-success">
                    <i class="bi bi-arrow-down-circle"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Total Withdrawals -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Total Withdrawals</small>
                    <h2 class="mt-2 text-danger" id="totalWithdrawals">
                        ₱0.00
                    </h2>
                </div>
                <div class="icon-box icon-danger">
                    <i class="bi bi-arrow-up-circle"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Total Transfers -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Total Transfers</small>
                    <h2 class="mt-2 text-warning" id="totalTransfers">
                        ₱0.00
                    </h2>
                </div>
                <div class="icon-box bg-warning text-white">
                    <i class="bi bi-arrow-left-right"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Total Transactions -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Total Transactions</small>
                    <h2 class="mt-2 text-info" id="totalTransactions">
                        0
                    </h2>
                </div>
                <div class="icon-box bg-info text-white">
                    <i class="bi bi-receipt"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Last Transaction -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Last Transaction</small>
                    <h6 class="mt-3" id="lastTransactionDate">
                        -
                    </h6>
                </div>
                <div class="icon-box bg-primary text-white">
                    <i class="bi bi-clock-history"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Account Type -->
    <div class="col-md-3">
        <div class="stat-card p-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <small>Account Type</small>
                    <h5 class="mt-3" id="accountType">
                        -
                    </h5>
                </div>
                <div class="icon-box bg-dark text-white">
                    <i class="bi bi-bank"></i>
                </div>
            </div>
        </div>
    </div>

</div>

<!-- ========================================================= -->
<!-- TRANSACTION RECORDS -->
<!-- ========================================================= -->

<div class="page-card p-4 mt-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

            <h5 class="mb-1">

                <i class="bi bi-journal-text"></i>

                Transaction Records

            </h5>

            <small class="text-muted">

                Complete transaction history of this bank account.

            </small>

        </div>

        <div>

            <button
                class="btn btn-outline-success"
                id="btnExportTransactions">

                <i class="bi bi-file-earmark-excel"></i>

                Export

            </button>

        </div>

    </div>

    <!-- ===================================================== -->
    <!-- FILTERS -->
    <!-- ===================================================== -->

    <div class="row mb-4">

        <div class="col-md-3">

            <label>

                Date From

            </label>

            <input
                type="date"
                class="form-control"
                id="filterDateFrom">

        </div>

        <div class="col-md-3">

            <label>

                Date To

            </label>

            <input
                type="date"
                class="form-control"
                id="filterDateTo">

        </div>

        <div class="col-md-3">

            <label>

                Transaction Type

            </label>

            <select
                class="form-select"
                id="filterTransactionType">

                <option value="">

                    All

                </option>

                <option value="DEPOSIT">

                    Deposit

                </option>

                <option value="WITHDRAWAL">

                    Withdrawal

                </option>

            </select>

        </div>

        <div class="col-md-3">

            <label>

                Search

            </label>

            <input
                type="text"
                class="form-control"
                id="filterSearch"
                placeholder="Reference / Description">

        </div>

    </div>

    <!-- ===================================================== -->
    <!-- TABLE -->
    <!-- ===================================================== -->

    <table
        id="transactionTable"
        class="table table-hover table-striped align-middle w-100">

        <thead class="table-dark">

        <tr>

            <th width="120">

                Date

            </th>

            <th>

                Reference No.

            </th>

            <th>

                Check No.

            </th>

            <th width="140">

                Transaction Type

            </th>

            <th>

                Description

            </th>

            <th
                class="text-end"
                width="150">

                Deposit

            </th>

            <th
                class="text-end"
                width="150">

                Withdrawal

            </th>

            <th
                class="text-end"
                width="150">

                Balance

            </th>

            <th
                width="120">

                Action

            </th>

        </tr>

        </thead>

        <tbody>

        </tbody>

    </table>

</div>
<!-- ===================================================== -->
<!-- JAVASCRIPT -->
<!-- ===================================================== -->

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- ===================================================== -->
<!-- DATATABLES -->
<!-- ===================================================== -->

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/dataTables.buttons.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.bootstrap5.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.html5.min.js"></script>

<script src="https://cdn.datatables.net/buttons/3.2.3/js/buttons.print.min.js"></script>

<!-- ===================================================== -->
<!-- SELECT2 -->
<!-- ===================================================== -->

<link
    href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
    rel="stylesheet" />

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<!-- ===================================================== -->
<!-- VALIDATION -->
<!-- ===================================================== -->

<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.21.0/dist/jquery.validate.min.js"></script>

<!-- ===================================================== -->
<!-- OTHER LIBRARIES -->
<!-- ===================================================== -->

<script src="https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>    
<!-- ===================================================== -->
<!-- PROJECT JS -->
<!-- ===================================================== -->

<script src="../assets/js/config.js"></script>

<script src="../assets/js/common.js"></script>

<script src="../assets/js/dashboardMain.js"></script>

<!-- ===================================================== -->
<!-- PAGE SCRIPT -->
<!-- ===================================================== -->

<script src="../assets/js/bank_view.js"></script>

</body>

</html>