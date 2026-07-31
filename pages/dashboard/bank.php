<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1">

<title>

    Bank Management

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css">
<link
    rel="stylesheet"
    href="assets/css/loan.css">
<link
    rel="stylesheet"
    href="assets/css/bank.css">
</head>

<body>

<!-- SIDEBAR -->

<?php include_once('common/sidenav.php') ?>


<!-- ========================================================= -->
<!-- TOPBAR -->
<!-- ========================================================= -->

<div class="topbar d-flex justify-content-between align-items-center">

    <div>

        <h4 class="mb-0">

            Bank Management

        </h4>

        <small class="text-muted">

            Manage bank accounts, deposits, withdrawals and account balances.

        </small>

    </div>

    <div>

        <button
            class="btn btn-primary"
            id="btnAddBankAccount">

            <i class="bi bi-plus-circle"></i>

            Add Bank Account

        </button>

    </div>

</div>

<!-- ========================================================= -->
<!-- SUMMARY -->
<!-- ========================================================= -->

<div class="row g-4 mt-1">

    <div class="col-md-3">

        <div class="stat-card p-4">

            <div class="d-flex justify-content-between">

                <div>

                    <small>

                        Total Accounts

                    </small>

                    <h2
                        class="mt-2"
                        id="totalAccounts">

                        0

                    </h2>

                </div>

                <div class="icon-box icon-primary">

                    <i class="bi bi-bank"></i>

                </div>

            </div>

        </div>

    </div>

    <div class="col-md-3">

        <div class="stat-card p-4">

            <div class="d-flex justify-content-between">

                <div>

                    <small>

                        Total Balance

                    </small>

                    <h2
                        class="mt-2"
                        id="totalBalance">

                        ₱0.00

                    </h2>

                </div>

                <div class="icon-box icon-success">

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

                        Today's Deposits

                    </small>

                    <h2
                        class="mt-2"
                        id="todayDeposits">

                        ₱0.00

                    </h2>

                </div>

                <div class="icon-box bg-info text-white">

                    <i class="bi bi-arrow-down-circle"></i>

                </div>

            </div>

        </div>

    </div>

    <div class="col-md-3">

        <div class="stat-card p-4">

            <div class="d-flex justify-content-between">

                <div>

                    <small>

                        Today's Withdrawals

                    </small>

                    <h2
                        class="mt-2"
                        id="todayWithdrawals">

                        ₱0.00

                    </h2>

                </div>

                <div class="icon-box icon-danger">

                    <i class="bi bi-arrow-up-circle"></i>

                </div>

            </div>

        </div>

    </div>

</div>

<!-- ========================================================= -->
<!-- BANK ACCOUNT LIST -->
<!-- ========================================================= -->

<div class="page-card p-4 mt-4">

    <div class="row mb-4">

        <div class="col-md-3">

            <label>

                Bank

            </label>

            <select
                class="form-select"
                id="filterBank">

                <option value="">

                    All Banks

                </option>

            </select>

        </div>

        <div class="col-md-3">

            <label>

                Account Type

            </label>

            <select
                class="form-select"
                id="filterAccountType">

                <option value="">

                    All Types

                </option>

                <option value="SAVINGS">

                    Savings

                </option>

                <option value="CHECKING">

                    Checking

                </option>

                <option value="CURRENT">

                    Current

                </option>

            </select>

        </div>

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

                <option
                    value="1"
                    selected>

                    Active

                </option>

                <option value="0">

                    Inactive

                </option>

            </select>

        </div>

    </div>

    <table
        id="bankTable"
        class="table table-hover align-middle">

        <thead class="table-dark">

        <tr>

            <th>Bank</th>

            <th>Account Name</th>

            <th>Account Number</th>

            <th>Branch</th>

            <th>Account Type</th>

            <th>Current Balance</th>

            <th>Status</th>

            <th width="220">

                Action

            </th>

        </tr>

        </thead>

        <tbody>

        </tbody>

    </table>

</div>
<!-- ===================================================== -->
<!-- ADD / EDIT BANK ACCOUNT MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="bankAccountModal"
     tabindex="-1">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header bg-primary text-white">

                <h5 class="modal-title">

                    <i class="bi bi-bank"></i>

                    Bank Account

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="bankAccountId">

                <div class="row">

                    <div class="col-md-6 mb-3">

                        <label>

                            Bank <span class="text-danger">*</span>

                        </label>

                        <select
                            class="form-select"
                            id="bankId">

                            <option value="">

                                Select Bank

                            </option>

                        </select>

                    </div>

                    <div class="col-md-6 mb-3">

                        <label>

                            Account Type

                        </label>

                        <select
                            class="form-select"
                            id="accountType">

                            <option value="SAVINGS">

                                Savings

                            </option>

                            <option value="CHECKING">

                                Checking

                            </option>

                            <option value="CURRENT">

                                Current

                            </option>

                        </select>

                    </div>

                    <div class="col-md-6 mb-3">

                        <label>

                            Account Name

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="accountName">

                    </div>

                    <div class="col-md-6 mb-3">

                        <label>

                            Account Number

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="accountNumber">

                    </div>

                    <div class="col-md-6 mb-3">

                        <label>

                            Branch

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="branchName">

                    </div>

                    <div class="col-md-6 mb-3">

                        <label>

                            Opening Balance

                        </label>

                        <input
                            type="number"
                            class="form-control"
                            id="openingBalance"
                            value="0">

                    </div>

                    <div class="col-md-6 mb-3">

                        <label>

                            Status

                        </label>

                        <select
                            class="form-select"
                            id="isActive">

                            <option value="1">

                                Active

                            </option>

                            <option value="0">

                                Inactive

                            </option>

                        </select>

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
                    class="btn btn-primary"
                    id="btnSaveBankAccount">

                    <i class="bi bi-check-circle"></i>

                    Save Account

                </button>

            </div>

        </div>

    </div>

</div>

<!-- ===================================================== -->
<!-- DEPOSIT MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="depositModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-success text-white">

                <h5>

                    <i class="bi bi-arrow-down-circle"></i>

                    Deposit

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="depositAccountId">

                <div class="mb-3">

                    <label>

                        Transaction Date

                    </label>

                    <input
                        type="date"
                        class="form-control"
                        id="depositDate">

                </div>

                <div class="mb-3">

                    <label>

                        Amount

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="depositAmount">

                </div>

                <div class="mb-3">

                    <label>

                        Reference No.

                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="depositReference">

                </div>

                <div class="mb-3">

                    <label>

                        Check No.

                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="depositCheckNo">

                </div>

                <div class="mb-3">

                    <label>

                        Description

                    </label>

                    <textarea
                        class="form-control"
                        rows="3"
                        id="depositDescription"></textarea>

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
                    id="btnDeposit">

                    <i class="bi bi-arrow-down-circle"></i>

                    Save Deposit

                </button>

            </div>

        </div>

    </div>

</div>

<!-- ===================================================== -->
<!-- WITHDRAWAL MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="withdrawModal"
     tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header bg-danger text-white">

                <h5>

                    <i class="bi bi-arrow-up-circle"></i>

                    Withdrawal

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <input
                    type="hidden"
                    id="withdrawAccountId">

                <div class="mb-3">

                    <label>

                        Transaction Date

                    </label>

                    <input
                        type="date"
                        class="form-control"
                        id="withdrawDate">

                </div>

                <div class="mb-3">

                    <label>

                        Amount

                    </label>

                    <input
                        type="number"
                        class="form-control"
                        id="withdrawAmount">

                </div>

                <div class="mb-3">

                    <label>

                        Reference No.

                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="withdrawReference">

                </div>

                <div class="mb-3">

                    <label>

                        Check No.

                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="withdrawCheckNo">

                </div>

                <div class="mb-3">

                    <label>

                        Description

                    </label>

                    <textarea
                        class="form-control"
                        rows="3"
                        id="withdrawDescription"></textarea>

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
                    id="btnWithdraw">

                    <i class="bi bi-arrow-up-circle"></i>

                    Save Withdrawal

                </button>

            </div>

        </div>

    </div>

</div>
<!-- ===================================================== -->
<!-- VIEW BANK ACCOUNT MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="viewBankModal"
     tabindex="-1">

    <div class="modal-dialog modal-xl modal-dialog-scrollable">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">

                    <i class="bi bi-bank"></i>

                    Bank Account Details

                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div id="bankDetails">

                    <div class="row">

                        <div class="col-md-6">

                            <table class="table table-bordered">

                                <tr>
                                    <th width="35%">Bank</th>
                                    <td id="viewBankName"></td>
                                </tr>

                                <tr>
                                    <th>Account Name</th>
                                    <td id="viewAccountName"></td>
                                </tr>

                                <tr>
                                    <th>Account Number</th>
                                    <td id="viewAccountNumber"></td>
                                </tr>

                                <tr>
                                    <th>Branch</th>
                                    <td id="viewBranch"></td>
                                </tr>

                                <tr>
                                    <th>Account Type</th>
                                    <td id="viewAccountType"></td>
                                </tr>

                            </table>

                        </div>

                        <div class="col-md-6">

                            <table class="table table-bordered">

                                <tr>
                                    <th width="40%">Opening Balance</th>
                                    <td id="viewOpeningBalance"></td>
                                </tr>

                                <tr>
                                    <th>Current Balance</th>
                                    <td
                                        id="viewCurrentBalance"
                                        class="fw-bold text-success">
                                    </td>
                                </tr>

                                <tr>
                                    <th>Status</th>
                                    <td id="viewStatus"></td>
                                </tr>

                                <tr>
                                    <th>Created At</th>
                                    <td id="viewCreatedAt"></td>
                                </tr>

                                <tr>
                                    <th>Updated At</th>
                                    <td id="viewUpdatedAt"></td>
                                </tr>

                            </table>

                        </div>

                    </div>

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
<!-- LEDGER MODAL -->
<!-- ===================================================== -->

<div class="modal fade"
     id="ledgerModal"
     tabindex="-1">

    <div class="modal-dialog modal-xl modal-dialog-scrollable">

        <div class="modal-content">

            <div class="modal-header bg-dark text-white">

                <h5>

                    <i class="bi bi-journal-bookmark"></i>

                    Bank Ledger

                </h5>

                <button
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="row mb-3">

                    <div class="col-md-3">

                        <strong>

                            Bank

                        </strong>

                        <div id="ledgerBank">

                        </div>

                    </div>

                    <div class="col-md-3">

                        <strong>

                            Account

                        </strong>

                        <div id="ledgerAccount">

                        </div>

                    </div>

                    <div class="col-md-3">

                        <strong>

                            Account Number

                        </strong>

                        <div id="ledgerAccountNumber">

                        </div>

                    </div>

                    <div class="col-md-3">

                        <strong>

                            Current Balance

                        </strong>

                        <div
                            id="ledgerCurrentBalance"
                            class="fw-bold text-success">

                        </div>

                    </div>

                </div>

                <table
                    class="table table-bordered table-striped align-middle"
                    id="ledgerTable">

                    <thead class="table-dark">

                    <tr>

                        <th>Date</th>

                        <th>Type</th>

                        <th>Reference</th>

                        <th>Check No.</th>

                        <th>Description</th>

                        <th class="text-end">

                            Deposit

                        </th>

                        <th class="text-end">

                            Withdrawal

                        </th>

                        <th class="text-end">

                            Balance

                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    </tbody>

                </table>

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
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.21.0/dist/jquery.validate.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js"></script>
<script src="assets/js/config.js"></script>

<script src="assets/js/common.js"></script>

<script src="assets/js/bank.js"></script>

<script src="assets/js/dashboardMain.js"></script>

</body>

</html>