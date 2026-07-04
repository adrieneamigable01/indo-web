<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>
        Borrower Profile
    </title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet">

    <link href="https://cdn.datatables.net/2.0.8/css/dataTables.bootstrap5.css"
          rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
          rel="stylesheet">

    <style>

        body{
            background:#f8fafc;
            font-family:'Segoe UI',sans-serif;
        }

        /* SIDEBAR */

        .sidebar{

            position:fixed;
            left:0;
            top:0;

            width:270px;
            height:100vh;

            background:white;

            border-right:1px solid #e5e7eb;

            padding:20px;

            overflow-y:auto;

            z-index:1000;

        }

        .logo{

            font-size:24px;

            font-weight:700;

            color:#2563eb;

            margin-bottom:30px;

        }

        .menu-item{

            display:flex;

            align-items:center;

            gap:12px;

            padding:12px 15px;

            border-radius:12px;

            text-decoration:none;

            color:#334155;

            margin-bottom:8px;

            transition:.3s;

        }

        .menu-item:hover,
        .menu-item.active{

            background:#2563eb;

            color:white;

        }

        /* CONTENT */

        .main-content{

            margin-left:270px;

            padding:25px;

        }

        .topbar{

            background:white;

            border-radius:20px;

            padding:20px;

            margin-bottom:20px;

            box-shadow:0 4px 20px rgba(0,0,0,.05);

        }

        .profile-card{

            background:white;

            border-radius:20px;

            padding:25px;

            box-shadow:0 4px 20px rgba(0,0,0,.05);

            margin-bottom:20px;

        }

        .table-card{

            background:white;

            border-radius:20px;

            padding:25px;

            box-shadow:0 4px 20px rgba(0,0,0,.05);

        }

        .summary-card{

            background:white;

            border-radius:20px;

            padding:20px;

            box-shadow:0 4px 20px rgba(0,0,0,.05);

            height:100%;

        }

        .summary-label{

            color:#64748b;

            font-size:13px;

        }

        .summary-value{

            font-size:24px;

            font-weight:700;

        }

        .avatar{

            width:90px;
            height:90px;

            border-radius:50%;

            background:#2563eb;

            color:white;

            display:flex;

            justify-content:center;

            align-items:center;

            font-size:35px;

        }

        .info-label{

            color:#64748b;

            font-size:12px;

            text-transform:uppercase;

        }

        .info-value{

            font-weight:600;

        }

        .nav-pills .nav-link.active{

            background:#2563eb;

        }

        .select2-container {
            z-index: 999999 !important;
        }

        .select2-dropdown {
            z-index: 999999 !important;
        }
        .hidden{
            display:none
        }
        .settlement-product-card{

            cursor:pointer;

            transition:.2s;

        }

        .settlement-product-card:hover{

            transform:translateY(-5px);

        }

        .selected-card{

            border:3px solid #198754 !important;

            box-shadow:
                0 0 20px rgba(
                    25,
                    135,
                    84,
                    .25
                ) !important;

        }
        .settlement-product-card{
            cursor:pointer;
            transition:all .25s ease;
            border:2px solid #dee2e6;
            position:relative;
        }

        .settlement-product-card:hover{
            transform:translateY(-5px);
            box-shadow:0 8px 20px rgba(0,0,0,.10);
        }

        .settlement-product-card.selected-card{

            border:3px solid #198754 !important;

            background:#f0fff4;

            box-shadow:
                0 0 0 4px rgba(25,135,84,.15),
                0 12px 25px rgba(25,135,84,.20);

            transform:translateY(-5px);
        }

        .settlement-product-card .selected-icon{
            display:none;
        }

        .settlement-product-card.selected-card .selected-icon{
            display:block;
        }
    </style>

</head>

<body>
<!-- SIDEBAR -->
<?php include_once('common/sidenav.php') ?>

<!-- MAIN -->

<div class="main-content">

    <!-- TOPBAR -->

    <div class="topbar d-flex justify-content-between align-items-center">

        <div>

            <h4 class="mb-0">

                Borrower Profile

            </h4>

            <small class="text-muted">

                Borrowers /
                View Borrower

            </small>

        </div>

        <div>

            <a href="#"
               id="btnEditBorrower"
               class="btn btn-warning">

                <i class="bi bi-pencil"></i>

                Edit

            </a>

            <a href="borrowers.php"
               class="btn btn-secondary">

                <i class="bi bi-arrow-left"></i>

                Back

            </a>

        </div>

    </div>
    <!-- PROFILE CARD -->

<div class="profile-card">

    <div class="row align-items-center">

        <div class="col-md-2 text-center">

            <div class="avatar mx-auto">

                <i class="bi bi-person"></i>

            </div>

        </div>

        <div class="col-md-10">

            <div class="d-flex justify-content-between align-items-center">

                <div>

                    <h3 id="borrowerName">

                        Loading...

                    </h3>

                    <small
                        class="text-muted">

                        Borrower ID:
                        <span id="borrowerId">

                            -

                        </span>

                    </small>

                </div>

                <div>

                    <span
                        id="borrowerStatus"
                        class="badge bg-success">

                        ACTIVE

                    </span>

                </div>

            </div>

            <hr>

            <div class="row">

                <div class="col-md-4 mb-3">

                    <div class="info-label">

                        Mobile Number

                    </div>

                    <div
                        id="borrowerMobile"
                        class="info-value">

                    </div>

                </div>

                <div class="col-md-4 mb-3">

                    <div class="info-label">

                        Email Address

                    </div>

                    <div
                        id="borrowerEmail"
                        class="info-value">

                    </div>

                </div>

                <div class="col-md-4 mb-3">

                    <div class="info-label">

                        Civil Status

                    </div>

                    <div
                        id="borrowerCivilStatus"
                        class="info-value">

                    </div>

                </div>

                <div class="col-md-6 mb-3">

                    <div class="info-label">

                        Home Address

                    </div>

                    <div
                        id="borrowerAddress"
                        class="info-value">

                    </div>

                </div>

                <div class="col-md-3 mb-3">

                    <div class="info-label">

                        Gender

                    </div>

                    <div
                        id="borrowerGender"
                        class="info-value">

                    </div>

                </div>

                <div class="col-md-3 mb-3">

                    <div class="info-label">

                        Date of Birth

                    </div>

                    <div
                        id="borrowerDob"
                        class="info-value">

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>


<div class="row mb-4">

    <div class="col-lg-3">

        <div class="summary-card">

            <div class="summary-label">

                Total Loan Amount

            </div>

            <div
                id="loanAmount"
                class="summary-value">

                ₱0.00

            </div>

        </div>

    </div>

    <div class="col-lg-3">

        <div class="summary-card">

            <div class="summary-label">

                Total Balance

            </div>

            <div
                id="totalBalance"
                class="summary-value text-danger">

                ₱0.00

            </div>

        </div>

    </div>

    <div class="col-lg-3">

        <div class="summary-card">

            <div class="summary-label">

                Active Loans

            </div>

            <div
                id="activeLoans"
                class="summary-value">

                0

            </div>

        </div>

    </div>

    <div class="col-lg-3">

        <div class="summary-card">

            <div class="summary-label">

                Total Pending Loans

            </div>

            <div
                id="pendingLoans"
                class="summary-value text-warning">

                0

            </div>

        </div>

    </div>

</div>


<!-- TABS -->

<ul class="nav nav-pills mb-4">

    <li class="nav-item">

        <button
            class="nav-link active"
            data-bs-toggle="pill"
            data-bs-target="#loanTab">

            <i class="bi bi-cash-stack"></i>

            Loans

        </button>

    </li>

    <li class="nav-item hidden">

        <button
            class="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#scheduleTab">

            <i class="bi bi-calendar-check"></i>

            Schedules

        </button>

    </li>

    <li class="nav-item hidden">

        <button
            class="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#paymentTab">

            <i class="bi bi-receipt"></i>

            Payments

        </button>

    </li>
    <li class="nav-item">

        <button
            class="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#paymentReportTab">

            <i class="bi bi-receipt"></i>

            Payment Report

        </button>

    </li>

</ul>


<div class="tab-content">
    <!-- LOANS TAB -->

<div class="tab-pane fade show active"
     id="loanTab">

    <div class="table-card">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <h5 class="mb-0">

                Borrower Loans

            </h5>

            <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#loanModal">

                <i class="bi bi-plus-circle"></i>

                Add Loan

            </button>

        </div>

        <table
            id="loanTable"
            class="table table-hover align-middle">

            <thead>

                <tr>

                    <th>Loan No.</th>

                    <th>Amount</th>

                    <th>Purpose</th>

                    <th>Terms</th>

                    <th>Interest</th>

                    <th>Status</th>

                    <th>Balance</th>

                    <th>Next Due</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody id="loanBody">

                <tr>

                    <td colspan="9"
                        class="text-center">

                        Loading loans...

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>


<!-- SCHEDULE TAB -->

<div class="tab-pane fade"
     id="scheduleTab">

    <div class="table-card">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <h5 class="mb-0">

                Payment Schedules

            </h5>

        </div>

        <table
            id="scheduleTable"
            class="table table-hover">

            <thead>

                <tr>

                    <th>Due Date</th>

                    <th>Principal Due</th>

                    <th>Interest Due</th>

                    <th>Penalty Due</th>

                    <th>Balance</th>

                    <th>Status</th>
                    
                    <th>-</th>

                </tr>

            </thead>

            <tbody id="scheduleBody">

                <tr>

                    <td colspan="6"
                        class="text-center">

                        Select a loan to view schedules

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>

<div class="tab-pane fade"
     id="paymentTab">

    <div class="table-card">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <h5 class="mb-0">

                Payment History

            </h5>

        </div>

        <table
            id="paymentTable"
            class="table table-hover">

            <thead>

                <tr>

                    <th>OR No.</th>

                    <th>Date</th>

                    <th>Principal</th>

                    <th>Interest</th>

                    <th>Penalty</th>

                    <th>Total</th>

                    <th>Remarks</th>

                </tr>

            </thead>

            <tbody id="paymentBody">

                <tr>

                    <td colspan="7"
                        class="text-center">

                        Select a loan to view payments

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>


<!-- PAYMENT REPORT TAB -->
<div class="tab-pane fade"
     id="paymentReportTab">

    <div class="table-card">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <h5 class="mb-0">
                Payment Report Schedule
            </h5>

        </div>
        <div class="row mb-3">

            <div class="col-md-4">

                <label>Year</label>

                <select
                    id="schedule_year"
                    class="form-control">

                </select>

            </div>

            <div class="col-md-2">

                <label>&nbsp;</label>

                <button
                    class="btn btn-primary w-100"
                    id="btnGenerateSchedule">

                    Generate

                </button>

            </div>

        </div>

        <div id="scheduleContainer" class="row"></div>
        <div id="scheduleContainer" class="row"></div>

    </div>

</div>
<div
    class="modal fade"
    id="loanModal"
    tabindex="-1">

        <div
            class="modal-dialog modal-xl modal-dialog-scrollable">

            <div class="modal-content">

                <div class="modal-header bg-primary text-white">

                    <h5 class="modal-title">

                        Create Loan

                    </h5>

                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="modal">

                    </button>

                </div>

                <div class="modal-body">

                    <!-- Loan Information -->

                    <div class="card mb-3">

                        <div class="card-header">

                            Loan Information

                        </div>

                        <div class="card-body">

                            <div class="row">

                                <div class="col-md-4">

                                    <label>
                                        Loan Product
                                    </label>

                                    <select
                                        id="loan_product_id"
                                        class="form-control">
                                    </select>

                                </div>

                                <div class="col-md-4">

                                    <label>
                                        Loan Amount
                                    </label>

                                    <input
                                        type="number"
                                        id="loan_amount"
                                        class="form-control">

                                </div>

                                <div class="col-md-4">

                                    <label>
                                        Loan Terms
                                    </label>

                                    <input
                                        type="number"
                                        id="loan_terms"
                                        class="form-control">

                                </div>

                                <div class="col-md-4 mt-3">

                                    <label>

                                        Monthly Interest Deduction

                                    </label>

                                    <input
                                        type="number"
                                        class="form-control"
                                        id="monthly_interest_deduction"
                                        value="4000">

                                </div>

                                <div class="col-md-4 mt-3">

                                    <label>
                                        Interest Rate
                                    </label>

                                    <input
                                        type="number"
                                        id="approved_interest_rate"
                                        class="form-control">

                                </div>

                                <div class="col-md-4 mt-3">

                                    <label>
                                        Processing Fee
                                    </label>

                                    <input
                                        type="number"
                                        id="approved_processing_fee"
                                        value="0"
                                        class="form-control">

                                </div>

                                <div class="col-md-4 mt-3">
                                    <label>Interest Amount</label>
                                    <input
                                        type="number"
                                        id="interest_amount"
                                        class="form-control"
                                        readonly>
                                </div>

                                <div class="col-md-4 mt-3">
                                    <label>Processing Fee Amount</label>
                                    <input
                                        type="number"
                                        id="processingfee_amount"
                                        class="form-control"
                                        readonly>
                                </div>

                                <div class="col-md-4 mt-3">
                                    <label>Net Proceeds</label>
                                    <input
                                        type="number"
                                        id="net_proceeds"
                                        class="form-control"
                                        readonly>
                                </div>

                            </div>

                        </div>

                    </div>

                    <!-- ATM Cards -->

                    <div class="card mb-3">

                        <div class="card-header">

                            Collateral

                        </div>

                        <div class="card-body">

                            <div class="row">

                                <div class="col-md-3">

                                    <label>

                                        Primary Card

                                    </label>
                                    <select name="primary_card_name" id="primary_card_name" class="form-control">
                                        <option value="Development Bank of the Philippines (DBP)">Development Bank of the Philippines (DBP)</option>
                                        <option value="LAND BANK OF THE PHILIPPINES ( UMID )">LAND BANK OF THE PHILIPPINES ( UMID )</option>
                                        <option value="UNION BANK OF THE PHILIPPINES ( UBP )">UNION BANK OF THE PHILIPPINES ( UBP )</option>
                                    </select>
                                </div>

                                <div class="col-md-9">

                                    <label>

                                        Card Number

                                    </label>

                                    <input
                                        type="text"
                                        id="primary_card_number"
                                        class="form-control">

                                </div>

                                <div class="col-md-3 mt-3">

                                    <label>

                                        Secondary Card

                                    </label>
                                    <select name="secondary_card_name" id="secondary_card_name" class="form-control">
                                        <option value="Development Bank of the Philippines (DBP)">Development Bank of the Philippines (DBP)</option>
                                        <option value="LAND BANK OF THE PHILIPPINES ( UMID )">LAND BANK OF THE PHILIPPINES ( UMID )</option>
                                        <option value="UNION BANK OF THE PHILIPPINES ( UBP )">UNION BANK OF THE PHILIPPINES ( UBP )</option>
                                    </select>
                                </div>

                                <div class="col-md-9 mt-3">

                                    <label>

                                        Card Number

                                    </label>

                                    <input
                                        type="text"
                                        id="secondary_card_number"
                                        class="form-control">

                                </div>

                            </div>

                        </div>

                    </div>

                    <!-- CO-MAKERS -->

                    <div class="card">

                        <div class="card-header d-flex justify-content-between">

                            <span>

                                Co-Makers

                            </span>

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                id="addCoMaker">

                                + Add Co-Maker

                            </button>

                        </div>

                        <div
                            class="card-body"
                            id="coMakerContainer">

                        </div>

                    </div>

                    <div class="card mt-3">

                        <div class="card-header">

                            Bonus / Incentive Deductions

                        </div>

                        <div class="card-body">

                            <table class="table table-bordered">

                                <thead>

                                    <tr>

                                        <th>Deduction Type</th>

                                        <th>Amount</th>

                                        <th width="100">Action</th>

                                    </tr>

                                </thead>

                                <tbody id="bonusDeductionBody">

                                </tbody>

                            </table>

                            <button
                                type="button"
                                class="btn btn-primary"
                                id="btnAddBonusDeduction">

                                Add Deduction

                            </button>

                        </div>

                    </div>
                    <div class="card mt-3">

                        <div class="card-header">

                            Loan Purpose

                        </div>

                        <div class="card-body">

                           <div class="row">
                                <div class="col-md-12 mt-3">
                                    <textarea
                                        id="loan_purpose"
                                        class="form-control">

                                    </textarea>

                                </div>
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

                    <button
                        id="btnSaveLoan"
                        class="btn btn-success">

                        Save Loan

                    </button>

                </div>

            </div>

        </div>

    </div>
</div>
<div class="modal fade"
     id="settlementLoanModal"
     tabindex="-1">

    <div class="modal-dialog modal-xl modal-dialog-scrollable">

        <div class="modal-content border-0 shadow-lg">

            <div class="modal-header bg-warning">

                <div>

                    <h4 class="mb-0">

                        <i class="bi bi-wallet2"></i>

                        Deficit Settlement

                    </h4>

                    <small>

                        Create a new loan to settle the deficit.

                    </small>

                </div>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <!-- DEFICIT CARD -->

                <div class="card border-danger shadow-sm mb-4">

                    <div class="card-body">

                        <div class="row align-items-center">

                            <div class="col-md-8">

                                <h6 class="text-danger mb-1">

                                    Current Deficit

                                </h6>

                                <h2
                                    id="settlementAmountLabel"
                                    class="mb-0 text-danger">

                                </h2>

                            </div>

                            <div class="col-md-4 text-end">

                                <i
                                    class="bi bi-exclamation-triangle-fill text-danger"
                                    style="font-size:60px;">
                                </i>

                            </div>

                        </div>

                    </div>

                </div>

                <!-- PRODUCT SELECTION -->

                <h5 class="mb-3">

                    Select Loan Product

                </h5>

                <div
                    id="settlementProductCards"
                    class="row">

                </div>

                <input
                    type="hidden"
                    id="selected_loan_product_id">

                <!-- DETAILS -->

                <div class="card shadow-sm mt-4">

                    <div class="card-header">

                        Settlement Details

                    </div>

                    <div class="card-body">

                        <div class="row">

                            <div class="col-md-3 mb-3">

                                <label>

                                    Amount

                                </label>

                                <input
                                    type="number"
                                    id="settlement_amount"
                                    class="form-control">

                            </div>

                            <div class="col-md-3 mb-3">

                                <label>

                                    Term

                                </label>

                                <input
                                    type="number"
                                    id="settlement_term"
                                    class="form-control">

                            </div>

                            <div class="col-md-3 mb-3">

                                <label>

                                    Interest

                                </label>

                                <input
                                    type="text"
                                    id="settlement_interest"
                                    class="form-control">

                            </div>

                            <div class="col-md-3 mb-3">

                                <label>

                                    Penalty

                                </label>

                                <input
                                    type="text"
                                    id="settlement_penalty"
                                    class="form-control">

                            </div>

                        </div>

                        <div class="row mt-3">

                            

                            <div class="col-md-4">

                                <label>
                                    Interest Amount
                                </label>

                                <input
                                    type="text"
                                    id="settlement_interest_amount"
                                    class="form-control"
                                    readonly>

                            </div>

                            <div class="col-md-4">

                                <label>
                                    Penalty Amount
                                </label>

                                <input
                                    type="text"
                                    id="settlement_penalty_amount"
                                    class="form-control"
                                    readonly>

                            </div>

                            <div class="col-md-4">

                                <label>
                                    Total Loan Amount
                                </label>

                                <input
                                    type="text"
                                    id="settlement_total_amount"
                                    class="form-control fw-bold"
                                    readonly>

                            </div>

                        </div>

                        <div class="mb-3">

                            <label>

                                Remarks

                            </label>

                            <textarea
                                id="settlement_remarks"
                                rows="3"
                                class="form-control"></textarea>

                        </div>

                        <div class="card mt-3 border-success">

                            <div class="card-body">

                                <div class="row text-center">

                                    <div class="col-md-4">

                                        <h6>
                                            Settlement
                                        </h6>

                                        <h4 id="summarySettlement">

                                            ₱0.00

                                        </h4>

                                    </div>

                                    <div class="col-md-4">

                                        <h6>
                                            Net Release
                                        </h6>

                                        <h4
                                            id="summaryNet"
                                            class="text-success">

                                            ₱0.00

                                        </h4>

                                    </div>

                                    <div class="col-md-4">

                                        <h6>
                                            Total Loan
                                        </h6>

                                        <h4
                                            id="summaryTotal"
                                            class="text-primary">

                                            ₱0.00

                                        </h4>

                                    </div>

                                </div>

                            </div>

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

                <button
                    class="btn btn-success"
                    id="btnCreateSettlementLoan">

                    <i class="bi bi-check-circle"></i>

                    Submit Settlement Loan

                </button>

            </div>

        </div>

    </div>

</div>
</div>

<!-- JQUERY -->

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- BOOTSTRAP -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- SWEETALERT -->

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- DATATABLE -->

<script src="https://cdn.datatables.net/2.0.8/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.0.8/js/dataTables.bootstrap5.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>    
<!-- BORROWER VIEW JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/borrower_view.js"></script>

</body>

</html>