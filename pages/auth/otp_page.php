<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>OTP Verification</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

<style>

:root{
    --primary:#1f4e79;
    --secondary:#17375e;
    --light:#f5f7fb;
}

body{
    margin:0;
    background:var(--light);
    font-family:'Segoe UI',sans-serif;
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
    align-items:center;
    justify-content:center;
    font-size:40px;
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
}

.security-box{
    margin-top:35px;
    background:rgba(255,255,255,.12);
    border:1px solid rgba(255,255,255,.2);
    border-radius:15px;
    padding:20px;
}

/* RIGHT PANEL */

.right-panel{
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
}

.otp-card{
    width:100%;
    max-width:550px;
    border:none;
    border-radius:25px;
    box-shadow:0 15px 40px rgba(0,0,0,.08);
}

.verification-icon{
    width:90px;
    height:90px;
    border-radius:50%;
    background:#e9f2fb;
    color:var(--primary);
    display:flex;
    justify-content:center;
    align-items:center;
    margin:auto;
}

.verification-icon i{
    font-size:42px;
}

.otp-input{
    width:60px;
    height:65px;
    text-align:center;
    font-size:26px;
    font-weight:700;
    border-radius:12px;
}

.verify-btn{
    height:55px;
    border-radius:12px;
    font-weight:600;
    background:var(--primary);
    border:none;
}

.verify-btn:hover{
    background:var(--secondary);
}

.resend-link{
    text-decoration:none;
}

@media(max-width:991px){

    .left-panel{
        display:none;
    }

}

</style>
</head>
<body>

<div class="container-fluid">

<div class="row main-container">

    <!-- LEFT SIDE -->

    <div class="col-lg-7 left-panel">

        <div class="system-info">

            <div class="logo-box">
                <i class="bi bi-bank2"></i>
            </div>

            <h1 class="mt-4">
                Loan Management
                Information System
            </h1>

            <p class="mt-3">
                Secure multi-factor authentication
                is required before accessing
                borrower records, loan processing,
                collections and reports.
            </p>

            <div class="security-box">

                <h5>
                    <i class="bi bi-shield-lock"></i>
                    Security Verification
                </h5>

                <small>
                    For security purposes, please verify
                    your identity using the One-Time Password
                    sent to your registered email or mobile number.
                </small>

            </div>

        </div>

    </div>

    <!-- RIGHT SIDE -->

    <div class="col-lg-5 right-panel">

        <div class="card otp-card">

            <div class="card-body p-5">

                <div class="text-center">

                    <div class="verification-icon mb-4">
                        <i class="bi bi-envelope-check"></i>
                    </div>

                    <h3 class="fw-bold">
                        OTP Verification
                    </h3>

                    <p class="text-muted">
                        Enter the verification code sent to
                    </p>

                    <strong id="email-data">
                        
                    </strong>

                </div>

                <form id="otp-form" class="mt-4">

                    <div class="d-flex justify-content-center gap-2 mb-4">
                        <input type="text" maxlength="1" class="form-control otp-input otp"
                            inputmode="numeric" autocomplete="one-time-code">
                        <input type="text" maxlength="1" class="form-control otp-input otp"
                            inputmode="numeric">
                        <input type="text" maxlength="1" class="form-control otp-input otp"
                            inputmode="numeric">
                        <input type="text" maxlength="1" class="form-control otp-input otp"
                            inputmode="numeric">
                        <input type="text" maxlength="1" class="form-control otp-input otp"
                            inputmode="numeric">
                        <input type="text" maxlength="1" class="form-control otp-input otp"
                            inputmode="numeric">
                    </div>

                    <button type="submit"
                            class="btn verify-btn w-100 text-white">

                        <i class="bi bi-check-circle"></i>
                        Verify OTP

                    </button>

                </form>

                <div class="text-center mt-4">

                    <span class="text-muted">
                        Didn't receive the code?
                    </span>

                    <br>

                    <a href="#"
                       id="resendOtp"
                       class="resend-link disabled">

                        Resend OTP
                        (<span id="timer">60</span>s)

                    </a>

                </div>

                <hr>

                <div class="text-center text-muted">

                    Loan Management Information System

                    <br>

                    <small>
                        Internal Back Office Portal
                    </small>

                </div>

            </div>

        </div>

    </div>

</div>

</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/otp.js"></script>

</body>
</html>