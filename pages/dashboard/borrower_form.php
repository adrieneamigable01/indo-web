<?php
    $title = "Add New Borrower";
    if(isset($_GET['id'])){
        $title = "Update Borrower";
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport"
      content="width=device-width, initial-scale=1">

<title><?php echo $title ?></title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet">

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
      rel="stylesheet">

<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
      rel="stylesheet">

<style>

:root{
    --primary:#2563eb;
    --secondary:#64748b;
    --success:#16a34a;
    --danger:#dc2626;
    --body:#f8fafc;
}

body{
    background:var(--body);
    font-family:'Segoe UI',sans-serif;
}

/* SIDEBAR */

.sidebar{
    position:fixed;
    top:0;
    left:0;
    width:270px;
    height:100vh;
    background:white;
    border-right:1px solid #e5e7eb;
    padding:20px;
    overflow-y:auto;
}

.logo{
    font-size:24px;
    font-weight:700;
    color:var(--primary);
    margin-bottom:25px;
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
    background:var(--primary);
    color:white;
}

/* CONTENT */

.content{
    margin-left:270px;
    padding:25px;
}

.topbar{
    background:white;
    border-radius:20px;
    padding:20px;
    box-shadow:0 4px 20px rgba(0,0,0,.05);
}

.page-card{
    background:white;
    border-radius:20px;
    padding:30px;
    margin-top:20px;
    box-shadow:0 4px 20px rgba(0,0,0,.05);
}
/* STEPPER */

.stepper-container{
    display:flex;
    justify-content:space-between;
    margin-bottom:40px;
    position:relative;
}

.stepper-container::before{
    content:'';
    position:absolute;
    top:30px;
    left:10%;
    width:80%;
    height:4px;
    background:#e5e7eb;
    z-index:1;
}

.step-item{
    position:relative;
    z-index:2;
    display:flex;
    flex-direction:column;
    align-items:center;
    flex:1;
}

.step-icon{
    width:60px;
    height:60px;
    border-radius:18px;
    background:#e5e7eb;
    color:#64748b;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:22px;
    margin-bottom:10px;
    transition:.3s;
}

.step-item.active .step-icon{
    background:#2563eb;
    color:white;
}

.step-item span{
    font-size:14px;
    font-weight:600;
}

.section-title{
    font-weight:700;
    margin-bottom:25px;
    color:#1e293b;
}

.form-step{
    display:none;
}

.form-step.active{
    display:block;
}

.form-control,
.form-select{
    border-radius:12px;
    min-height:48px;
}

.form-control:focus,
.form-select:focus{
    box-shadow:none;
    border-color:#2563eb;
}

label{
    font-weight:600;
    margin-bottom:5px;
}
</style>

</head>

<body>
<?php include_once('/common/sidenav.php') ?>

<div class="content">

<div class="topbar d-flex justify-content-between align-items-center">

    <div>

        <h4 class="mb-0">
            <?php echo $title ?>
        </h4>

        <small class="text-muted">

            Borrowers /
            <?php echo $title ?>

        </small>

    </div>

    <a href="borrowers.php"
       class="btn btn-secondary">

       <i class="bi bi-arrow-left"></i>

       Back

    </a>

</div>

<div class="page-card">

<form id="borrowerForm">
    <!-- STEPPER -->

<div class="stepper-container mb-5">

    <div class="step-item active">

        <div class="step-icon">

            <i class="bi bi-person"></i>

        </div>

        <span>Personal</span>

    </div>

    <div class="step-item">

        <div class="step-icon">

            <i class="bi bi-card-text"></i>

        </div>

        <span>Identification</span>

    </div>

    <div class="step-item">

        <div class="step-icon">

            <i class="bi bi-building"></i>

        </div>

        <span>Employment</span>

    </div>

    <div class="step-item">

        <div class="step-icon">

            <i class="bi bi-heart"></i>

        </div>

        <span>Spouse</span>

    </div>

</div>


<!-- STEP 1 -->

<div class="form-step active">

    <h5 class="section-title">

        Personal Information

    </h5>

    <div class="row g-3">

        <div class="col-md-4">

            <label class="form-label">
                Last Name
            </label>

            <input
                type="text"
                id="last_name"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label class="form-label">
                First Name
            </label>

            <input
                type="text"
                id="first_name"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label class="form-label">
                Middle Name
            </label>

            <input
                type="text"
                id="middle_name"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label class="form-label">
                Date of Birth
            </label>

            <input
                type="date"
                id="date_of_birth"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label class="form-label">
                Civil Status
            </label>

            <select
                id="civil_status"
                class="form-select">

                <option value="">
                    Select
                </option>

                <option>
                    SINGLE
                </option>

                <option>
                    MARRIED
                </option>

                <option>
                    WIDOWED
                </option>

            </select>

        </div>

        <div class="col-md-3">

            <label class="form-label">
                Gender
            </label>

            <select
                id="gender"
                class="form-select">

                <option value="">
                    Select
                </option>

                <option>
                    MALE
                </option>

                <option>
                    FEMALE
                </option>

            </select>

        </div>

        <div class="col-md-3">

            <label class="form-label">
                Mobile Number
            </label>

            <input
                id="mobile_no"
                class="form-control">

        </div>

        <div class="col-md-6">

            <label class="form-label">
                Email Address
            </label>

            <input
                id="email_address"
                class="form-control">

        </div>

        <div class="col-md-6">

            <label class="form-label">
                Home Address
            </label>

            <input
                id="home_address"
                class="form-control">

        </div>

    </div>

</div>


<!-- STEP 2 -->

<div class="form-step">

    <h5 class="section-title">

        Identification Information

    </h5>

    <div class="row g-3">

        <div class="col-md-4">

            <label class="form-label">
                TIN Number
            </label>

            <input
                id="tin_no"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label class="form-label">
                ID Presented
            </label>

            <select
                id="id_presented"
                class="form-select">

                <option>
                    UMID
                </option>

                <option>
                    SSS
                </option>

                <option>
                    PHILHEALTH
                </option>

                <option>
                    PAGIBIG
                </option>

                <option>
                    DRIVERS LICENSE
                </option>

            </select>

        </div>

        <div class="col-md-4">

            <label class="form-label">
                ID Number
            </label>

            <input
                id="id_no"
                class="form-control">

        </div>

    </div>

</div>


<!-- STEP 3 -->

<div class="form-step">

    <h5 class="section-title">

        Employment Information

    </h5>

    <div class="row g-3">

        <div class="col-md-6">

            <label>
                Company / School
            </label>

            <input
                id="company_school"
                class="form-control">

        </div>

        <div class="col-md-6">

            <label>
                Employer Name
            </label>

            <input
                id="employer_name"
                class="form-control">

        </div>

        <div class="col-md-6">

            <label>
                Company Address
            </label>

            <input
                id="company_address"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label>
                Employment Date
            </label>

            <input
                type="date"
                id="employment_date"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label>
                Position Name
            </label>

            <input
                id="position_name"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label>
                Basic Salary
            </label>

            <input
                id="basic_salary"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label>
                Annual Income
            </label>

            <input
                id="annual_income"
                class="form-control">

        </div>

    </div>

</div>


<!-- STEP 4 -->

<div class="form-step">

    <h5 class="section-title">

        Spouse Information

    </h5>

    <div class="row g-3">

        <div class="col-md-4">

            <label>
                Last Name
            </label>

            <input
                id="spouse_last_name"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label>
                First Name
            </label>

            <input
                id="spouse_first_name"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label>
                Middle Name
            </label>

            <input
                id="spouse_middle_name"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label>
                Date of Birth
            </label>

            <input
                type="date"
                id="spouse_date_of_birth"
                class="form-control">

        </div>

        <div class="col-md-3">

            <label>
                Mobile Number
            </label>

            <input
                id="spouse_mobile_no"
                class="form-control">

        </div>

        <div class="col-md-6">

            <label>
                Employer Name
            </label>

            <input
                id="spouse_employer_name"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label>
                Position Name
            </label>

            <input
                id="spouse_position_name"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label>
                Monthly Income
            </label>

            <input
                id="monthly_income"
                class="form-control">

        </div>

        <div class="col-md-4">

            <label>
                Home Address
            </label>

            <input
                id="spouse_home_address"
                class="form-control">

        </div>

    </div>

</div>


<!-- NAVIGATION -->

<div class="d-flex justify-content-between mt-5">

    <button
        type="button"
        id="btnPrev"
        class="btn btn-secondary">

        Previous

    </button>

    <button
        type="button"
        id="btnNext"
        class="btn btn-primary">

        Next

    </button>

</div>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/borrower_form.js"></script>