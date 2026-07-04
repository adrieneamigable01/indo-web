```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Lending Management System</title>
<link rel="stylesheet" href="assets/css/style.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

<style>

:root{
    --sidebar:#1f4e79;
    --sidebar-hover:#17375e;
    --body:#f4f6f9;
}

body{
    background:var(--body);
    overflow-x:hidden;
}

.sidebar{
    position:fixed;
    top:0;
    left:0;
    width:260px;
    height:100vh;
    background:var(--sidebar);
    color:white;
    overflow-y:auto;
}

.sidebar-header{
    padding:20px;
    font-size:22px;
    font-weight:bold;
    border-bottom:1px solid rgba(255,255,255,.1);
}

.sidebar a{
    color:white;
    text-decoration:none;
    display:block;
    padding:12px 20px;
}

.sidebar a:hover{
    background:var(--sidebar-hover);
}

.main-content{
    margin-left:260px;
}

.topbar{
    background:white;
    height:70px;
    box-shadow:0 2px 10px rgba(0,0,0,.05);
}

.stat-card{
    border:none;
    border-radius:15px;
    box-shadow:0 2px 10px rgba(0,0,0,.05);
}

.stat-icon{
    font-size:40px;
}

@media(max-width:991px){

    .sidebar{
        width:100%;
        height:auto;
        position:relative;
    }

    .main-content{
        margin-left:0;
    }

}
</style>
</head>
<body>

<div class="sidebar">

    <div class="sidebar-header">
        <i class="bi bi-bank2"></i>
        Lending System
    </div>

    <a href="#">
        <i class="bi bi-speedometer2"></i>
        Dashboard
    </a>

    <a data-bs-toggle="collapse" href="#borrowersMenu">
        <i class="bi bi-people"></i>
        Borrowers
    </a>

    <div class="collapse" id="borrowersMenu">
        <a href="#" class="ps-5">Borrower List</a>
        <a href="#" class="ps-5">Co-Makers</a>
        <a href="#" class="ps-5">Employers</a>
    </div>

    <a data-bs-toggle="collapse" href="#loanMenu">
        <i class="bi bi-cash-stack"></i>
        Loans
    </a>

    <div class="collapse" id="loanMenu">
        <a href="#" class="ps-5">New Loan</a>
        <a href="#" class="ps-5">Active Loans</a>
        <a href="#" class="ps-5">Released Loans</a>
        <a href="#" class="ps-5">Renewals</a>
    </div>

    <a href="#">
        <i class="bi bi-wallet2"></i>
        Collections
    </a>

    <a href="#">
        <i class="bi bi-file-earmark-bar-graph"></i>
        Reports
    </a>

    <a href="#">
        <i class="bi bi-gear"></i>
        Settings
    </a>

    <a href="#">
        <i class="bi bi-box-arrow-right"></i>
        Logout
    </a>

</div>

<div class="main-content">

    <div class="topbar d-flex justify-content-between align-items-center px-4">

        <h5 class="mb-0">
            Dashboard
        </h5>

        <div class="dropdown">

            <button class="btn btn-light dropdown-toggle"
                    data-bs-toggle="dropdown">

                Administrator

            </button>

            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Logout</a></li>
            </ul>

        </div>

    </div>

    <div class="container-fluid mt-4">

        <div class="row g-3">

            <div class="col-md-3">

                <div class="card stat-card">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small>Borrowers</small>
                                <h3>1,250</h3>
                            </div>

                            <div class="stat-icon text-primary">
                                <i class="bi bi-people"></i>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div class="col-md-3">

                <div class="card stat-card">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small>Active Loans</small>
                                <h3>865</h3>
                            </div>

                            <div class="stat-icon text-success">
                                <i class="bi bi-cash-stack"></i>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div class="col-md-3">

                <div class="card stat-card">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small>Portfolio</small>
                                <h3>₱25.4M</h3>
                            </div>

                            <div class="stat-icon text-warning">
                                <i class="bi bi-wallet2"></i>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div class="col-md-3">

                <div class="card stat-card">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small>Past Due</small>
                                <h3>₱350K</h3>
                            </div>

                            <div class="stat-icon text-danger">
                                <i class="bi bi-exclamation-triangle"></i>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div class="row mt-4">

            <div class="col-lg-8">

                <div class="card">

                    <div class="card-header">
                        Recent Loan Releases
                    </div>

                    <div class="card-body">

                        <table class="table table-hover">

                            <thead>
                                <tr>
                                    <th>Ref No</th>
                                    <th>Borrower</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>LN-0001</td>
                                    <td>Juan Dela Cruz</td>
                                    <td>₱50,000</td>
                                    <td>
                                        <span class="badge bg-success">
                                            Released
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>LN-0002</td>
                                    <td>Maria Santos</td>
                                    <td>₱75,000</td>
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

            </div>

            <div class="col-lg-4">

                <div class="card">

                    <div class="card-header">
                        Due Today
                    </div>

                    <div class="list-group list-group-flush">

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

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>

