<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Lending Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
<link rel="stylesheet" href="assets/css/loan.css">
</head>
<body>

<!-- SIDEBAR -->
<?php include_once('common/sidenav.php') ?>




    <!-- KPI -->

    <div class="row mt-4 g-4">

        <div class="col-md-3">

            <div class="kpi-card">

                <div class="d-flex justify-content-between">

                    <div>
                        <small>Borrowers</small>
                        <h2>1,245</h2>
                        <small class="text-success">
                            +12%
                        </small>
                    </div>

                    <div class="icon-box">
                        <i class="bi bi-people"></i>
                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="kpi-card">

                <div class="d-flex justify-content-between">

                    <div>
                        <small>Active Loans</small>
                        <h2>865</h2>
                        <small class="text-success">
                            +8%
                        </small>
                    </div>

                    <div class="icon-box">
                        <i class="bi bi-cash-stack"></i>
                    </div>

                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="kpi-card">

                <div>
                    <small>Portfolio</small>
                    <h2>₱25.4M</h2>
                </div>

            </div>

        </div>

        <div class="col-md-3">

            <div class="kpi-card">

                <div>
                    <small>Today's Collection</small>
                    <h2>₱425K</h2>
                </div>

            </div>

        </div>

    </div>

    <!-- OPERATIONS DASHBOARD -->

<div class="row mt-4 g-4">

    <!-- EXPIRED ATM -->

    <div class="col-lg-6">

        <div class="table-card">

            <div class="d-flex justify-content-between mb-3">

                <h5>
                    Expired ATM Cards
                </h5>

                <span class="badge bg-danger">
                    15 Expired
                </span>

            </div>

            <table class="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>Borrower</th>
                        <th>ATM No.</th>
                        <th>Expiry Date</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>Juan Dela Cruz</td>
                        <td>****1234</td>
                        <td class="text-danger">
                            Jun 01, 2026
                        </td>

                    </tr>

                    <tr>

                        <td>Maria Santos</td>
                        <td>****5678</td>
                        <td class="text-danger">
                            May 20, 2026
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

    <!-- UPCOMING TEACHER BONUSES -->

    <div class="col-lg-6">

        <div class="table-card">

            <div class="d-flex justify-content-between mb-3">

                <h5>
                    Upcoming Teacher Bonuses
                </h5>

                <span class="badge bg-success">
                    Upcoming
                </span>

            </div>

            <table class="table table-hover">

                <thead>

                    <tr>

                        <th>Bonus</th>
                        <th>Date</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>Mid-Year Bonus</td>

                        <td>
                            May 15
                        </td>

                        <td>

                            <span class="badge bg-primary">
                                Upcoming
                            </span>

                        </td>

                    </tr>

                    <tr>

                        <td>Year-End Bonus</td>

                        <td>
                            Nov 15
                        </td>

                        <td>

                            <span class="badge bg-warning">
                                Scheduled
                            </span>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<div class="row mt-4 g-4">

    <!-- RECENT LOAN RELEASES -->

    <div class="col-lg-6">

        <div class="table-card">

            <div class="d-flex justify-content-between mb-3">

                <h5>
                    Recent Loan Releases
                </h5>

                <a href="#"
                   class="btn btn-sm btn-primary">

                    View All

                </a>

            </div>

            <table class="table table-hover">

                <thead>

                    <tr>

                        <th>Ref No</th>
                        <th>Borrower</th>
                        <th>Amount</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>LN-001</td>
                        <td>Juan Dela Cruz</td>
                        <td>₱50,000</td>

                    </tr>

                    <tr>

                        <td>LN-002</td>
                        <td>Maria Santos</td>
                        <td>₱80,000</td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

    <!-- PENDING RELEASES -->

    <div class="col-lg-6">

        <div class="table-card">

            <h5 class="mb-3">

                Pending Loan Releases

            </h5>

            <table class="table table-hover">

                <thead>

                    <tr>

                        <th>Borrower</th>
                        <th>Amount</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>Pedro Reyes</td>

                        <td>
                            ₱120,000
                        </td>

                        <td>

                            <span class="badge bg-warning">
                                For Release
                            </span>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<div class="row mt-4 g-4">

    <!-- TODAY SCHEDULE -->

    <div class="col-lg-6">

        <div class="table-card">

            <h5>

                Today's Schedule

            </h5>

            <table class="table table-hover">

                <thead>

                    <tr>

                        <th>Borrower</th>
                        <th>Activity</th>
                        <th>Time</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>Maria Santos</td>

                        <td>
                            Loan Signing
                        </td>

                        <td>
                            10:00 AM
                        </td>

                    </tr>

                    <tr>

                        <td>Jose Cruz</td>

                        <td>
                            ATM Submission
                        </td>

                        <td>
                            2:00 PM
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

    <!-- NEW BORROWERS -->

    <div class="col-lg-6">

        <div class="table-card">

            <h5>

                Newly Added Borrowers

            </h5>

            <table class="table table-hover">

                <thead>

                    <tr>

                        <th>Name</th>
                        <th>Date Added</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>Ana Lim</td>

                        <td>
                            Today
                        </td>

                    </tr>

                    <tr>

                        <td>Carlos Reyes</td>

                        <td>
                            Today
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>


<div class="row mt-4">

    <div class="col-12">

        <div class="table-card">

            <div class="d-flex justify-content-between mb-3">

                <h5>
                    Collections Due Today
                </h5>

                <span class="badge bg-danger">
                    ₱125,000 Due
                </span>

            </div>

            <table class="table table-hover">

                <thead>

                    <tr>

                        <th>Borrower</th>
                        <th>Due Date</th>
                        <th>Amount</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>Juan Dela Cruz</td>

                        <td>
                            Today
                        </td>

                        <td>
                            ₱1,250
                        </td>

                    </tr>

                    <tr>

                        <td>Maria Santos</td>

                        <td>
                            Today
                        </td>

                        <td>
                            ₱950
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>
    
    <!-- TABLES -->

    <div class="row mt-4">

        <div class="col-lg-8">

            <div class="table-card">

                <h5>Recent Loan Releases</h5>

                <table class="table">

                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Borrower</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>LN-001</td>
                            <td>Juan Dela Cruz</td>
                            <td>₱50,000</td>
                            <td>
                                <span class="badge bg-success">
                                    Released
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>LN-002</td>
                            <td>Maria Santos</td>
                            <td>₱80,000</td>
                            <td>
                                <span class="badge bg-warning">
                                    Processing
                                </span>
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

        <div class="col-lg-4">

            <div class="table-card">

                <h5>Due Today</h5>

                <div class="list-group">

                    <div class="list-group-item">
                        Juan Dela Cruz
                        <span class="float-end">
                            ₱1,250
                        </span>
                    </div>

                    <div class="list-group-item">
                        Maria Santos
                        <span class="float-end">
                            ₱950
                        </span>
                    </div>

                </div>

            </div>

        </div>

    </div>

</div>


<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.js"></script>

<script src="https://cdn.datatables.net/2.3.2/js/dataTables.bootstrap5.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script src="https://cdn.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js"></script>

<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="assets/js/config.js"></script>

<script src="assets/js/common.js"></script>

<script src="assets/js/dashboardMain.js"></script>
</body>
</html>