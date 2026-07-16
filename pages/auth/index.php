<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Loan Management Information System</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

<style>

:root{
    --primary:#1f4e79;
    --secondary:#17375e;
    --light:#f5f7fb;
    --border:#dce3ea;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:var(--light);
    font-family:'Segoe UI',sans-serif;
    overflow:hidden;
}

.main-container{
    height:100vh;
}

/* LEFT PANEL */

.left-panel{
    height:100vh;
    background:
    linear-gradient(
        135deg,
        #1f4e79,
        #17375e
    );
    color:white;
    position:relative;
    padding:60px;
}

.logo-box{
    width:90px;
    height:90px;
    border-radius:20px;
    background:white;
    color:#1f4e79;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:40px;
    margin-bottom:25px;
}

.system-info{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    max-width:500px;
}

.system-info h1{
    font-size:42px;
    font-weight:700;
    margin-bottom:15px;
}

.system-info h5{
    font-weight:300;
    opacity:.9;
}

.security-box{
    margin-top:50px;
    background:rgba(255,255,255,.1);
    border:1px solid rgba(255,255,255,.2);
    border-radius:15px;
    padding:20px;
}

.security-box h6{
    margin-bottom:10px;
}

/* RIGHT PANEL */

.right-panel{
    height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#f7f9fc;
}

.login-card{
    width:100%;
    max-width:450px;
    border:none;
    border-radius:25px;
    box-shadow:0 10px 40px rgba(0,0,0,.08);
}

.login-header{
    text-align:center;
    margin-bottom:30px;
}

.login-header i{
    font-size:70px;
    color:#1f4e79;
}

.form-label{
    font-weight:600;
}

.form-control,
.form-select{
    height:52px;
    border-radius:12px;
}

.form-control:focus,
.form-select:focus{
    box-shadow:none;
    border-color:#1f4e79;
}

.btn-login{
    height:55px;
    border-radius:12px;
    background:#1f4e79;
    border:none;
    font-weight:600;
}

.btn-login:hover{
    background:#17375e;
}

.password-wrapper{
    position:relative;
}

.password-toggle{
    position:absolute;
    right:18px;
    top:17px;
    cursor:pointer;
    color:#777;
}

.footer-info{
    text-align:center;
    margin-top:25px;
    color:#777;
    font-size:13px;
}

.version-badge{
    background:#eef3f8;
    padding:5px 12px;
    border-radius:20px;
    display:inline-block;
    margin-top:10px;
}

@media(max-width:991px){

    .left-panel{
        display:none;
    }

    .right-panel{
        width:100%;
    }

    body{
        overflow:auto;
    }
}

.error{
    color:#dc3545;
    font-size:.875rem;
    margin-top:5px;
    display:block;
}

.is-invalid{
    border-color:#dc3545 !important;
}

.is-valid{
    border-color:#198754 !important;
}
.company-header {
    display: flex;
    align-items: center;
    justify-content: center; /* Center the whole header */
    gap: 15px;
    margin-bottom: 20px;
}

.logo-box {
    width: 70px;
    height: 70px;
    flex-shrink: 0;
}

.company-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.company-title h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff !important;
}
</style>

</head>
<body>

<div class="container-fluid">

<div class="row main-container">

    <!-- LEFT SIDE -->

    <div class="col-lg-7 left-panel">

        <div class="system-info">

            <div class="company-header">
                <div class="logo-box">
                    <img
                        src="assets/img/logo.png"
                        alt="Indo-Pacific Lending Corporation Logo"
                        class="company-logo"
                    >
                </div>

                <div class="company-title">
                    <h1>INDO - PACIFIC LENDING CORPORATION</h1>
                </div>
            </div>

            <h5>
                Internal Back Office Portal
            </h5>

            <p class="mt-4">
                Manage borrowers, loans, collections,
                payments, reports and administrative
                functions from a centralized platform.
            </p>

            <div class="security-box">

                <h6>
                    <i class="bi bi-shield-lock"></i>
                    Security Notice
                </h6>

                <small>
                    This system is restricted to authorized
                    personnel only. All activities are logged
                    and monitored by system administrators.
                </small>

            </div>

            <div class="mt-4">

                <p class="mb-1">
                    <i class="bi bi-calendar-event"></i>
                    <span id="currentDate"></span>
                </p>

                <p>
                    <i class="bi bi-clock"></i>
                    <span id="currentTime"></span>
                </p>

            </div>

        </div>

    </div>

    <!-- RIGHT SIDE -->

    <div class="col-lg-5 right-panel">

        <div class="card login-card">

            <div class="card-body p-5">

                <div class="login-header">

                    <i class="bi bi-person-circle"></i>

                    <h3 class="mt-3 fw-bold">
                        Welcome Back
                    </h3>

                    <p class="text-muted">
                        Sign in to continue
                    </p>

                </div>

                <!-- ERROR SAMPLE -->
                <!--
                <div class="alert alert-danger">
                    Invalid username or password.
                </div>
                -->

                <form id="login-form">

                    <div class="mb-3">

                        <label class="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            class="form-control"
                            name="email"
                            required>

                    </div>

                    <div class="mb-3">

                        <label class="form-label">
                            Password
                        </label>

                        <div class="password-wrapper">

                            <input
                                type="password"
                                id="password"
                                class="form-control"
                                name="password"
                                required>

                            <i
                                class="bi bi-eye password-toggle"
                                id="togglePassword">
                            </i>

                        </div>

                    </div>

                    <div class="mb-4">

                        <label class="form-label">
                            OTP
                        </label>

                        <select
                            class="form-select"
                            name="type">

                            <option value="">
                                Select OTP 
                            </option>

                            <option>
                                Email
                            </option>

                            <option>
                                Mobile
                            </option>


                        </select>

                    </div>

                    <!-- <div class="mb-4">

                        <label class="form-label">
                            Branch
                        </label>

                        <select
                            class="form-select"
                            name="branch">

                            <option value="">
                                Select Branch
                            </option>

                            <option>
                                Main Office
                            </option>

                            <option>
                                Cebu Branch
                            </option>

                            <option>
                                Carcar Branch
                            </option>

                            <option>
                                Toledo Branch
                            </option>

                            <option>
                                Talisay Branch
                            </option>

                        </select>

                    </div> -->

                    <div class="form-check mb-4">

                        <input
                            class="form-check-input"
                            type="checkbox">

                        <label class="form-check-label">
                            Remember Me
                        </label>

                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary btn-login w-100">

                        <i class="bi bi-box-arrow-in-right"></i>
                        Login

                    </button>

                </form>

                <div class="footer-info">

                    Loan Management Information System

                    <div class="version-badge">
                        Version 1.0
                    </div>

                    <div class="mt-3">
                        © 2026 Indo Pacific Lending
                    </div>

                </div>

            </div>

        </div>

    </div>

</div>

</div>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="assets/js/jquery-validate.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/login.js"></script>

</body>
</html>