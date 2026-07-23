<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>User Profile</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

<link rel="stylesheet" href="assets/css/loan.css">

<style>

.profile-image{
    width:180px;
    height:180px;
    object-fit:cover;
    border-radius:50%;
    border:6px solid #fff;
    box-shadow:0 10px 30px rgba(0,0,0,.15);
}

.table-card{
    background:#fff;
    border-radius:18px;
    padding:25px;
    box-shadow:0 8px 25px rgba(0,0,0,.05);
}

.form-control[]{
    background:#f8f9fa;
}

.info-label{
    font-size:.82rem;
    color:#6c757d;
    margin-bottom:4px;
}
.profile-image-wrapper{

    position:relative;

    display:inline-block;

}

.profile-image{

    width:170px;
    height:170px;

    border-radius:50%;

    object-fit:cover;

    border:4px solid #fff;

    box-shadow:0 3px 10px rgba(0,0,0,.15);

}

.profile-image-edit{

    position:absolute;

    bottom:8px;

    right:8px;

    width:42px;

    height:42px;

    border:none;

    border-radius:50%;

    background:#0d6efd;

    color:#fff;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    box-shadow:0 3px 8px rgba(0,0,0,.25);

    transition:.2s;

}

.profile-image-edit:hover{

    background:#0b5ed7;

    transform:scale(1.08);

}

.profile-image-edit i{

    font-size:18px;

}
</style>

</head>

<body>

<?php include_once('common/sidenav.php'); ?>


<div class="d-flex justify-content-between align-items-center mb-4 mt-5">

    <div>

        <h3 class="fw-bold mb-1 mt-5">

            User Profile

        </h3>

        <small class="text-muted">

            View and manage your account information

        </small>

    </div>

    

</div>


    <div class="row g-4">

        <!-- LEFT -->

        <div class="col-lg-4">

        <div class="table-card text-center">
            <input
                type="file"
                id="cameraInput"
                accept="image/*"
                capture="environment"
                class="d-none">

            <input
                type="file"
                id="galleryInput"
                accept="image/*"
                class="d-none">
            <div class="profile-image-wrapper">

                <img id="profile_image"
                    src="assets/images/user-image.jpg"
                    class="profile-image">

                <button
                    type="button"
                    id="btnEditPhoto"
                    class="profile-image-edit">

                    <i class="bi bi-pencil-fill"></i>

                </button>

            </div>

            <input
                type="file"
                id="profileImageInput"
                accept="image/png,image/jpeg,image/webp"
                class="d-none">

            <h3 id="full_name" class="mt-4 mb-1">
                -
            </h3>

            <span id="role"
                class="badge bg-primary px-3 py-2">
                -
            </span>

            <span id="user_type"
                class="badge bg-success px-3 py-2">
                -
            </span>

            <hr>

           <button id="btnUploadPhoto"
                    type="button"
                    class="btn btn-primary w-100 mb-4 d-none">

                <i class="bi bi-cloud-upload-fill"></i>

                Update Profile Photo

            </button>

            <!-- Account Information -->

            <div class="text-start">

                <h5 class="mb-3">

                    <i class="bi bi-person-badge me-2 text-primary"></i>

                    Account Information

                </h5>

                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">

                    <span class="text-muted">

                        User ID

                    </span>

                    <strong id="account_userid">

                        -

                    </strong>

                </div>

                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">

                    <span class="text-muted">

                        Role

                    </span>

                    <span id="account_role"
                        class="badge bg-primary">

                        -

                    </span>

                </div>

                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">

                    <span class="text-muted">

                        User Type

                    </span>

                    <span id="account_usertype"
                        class="badge bg-success">

                        -

                    </span>

                </div>

                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">

                    <span class="text-muted">

                        Status

                    </span>

                    <span id="account_status"
                        class="badge bg-success">

                        -

                    </span>

                </div>

                <div class="d-flex justify-content-between align-items-start pt-3">

                    <span class="text-muted">

                        Date Added

                    </span>

                    <div id="date_added"
                        class="text-end fw-semibold">

                        -

                    </div>

                </div>

            </div>

        </div>

    </div>


    <!-- RIGHT -->
    <div class="col-lg-8">

        <!-- Personal Information -->

        <div class="table-card">

            <h5 class="mb-4">

                Personal Information

            </h5>

            <div class="row g-3">

                <div class="col-md-4">

                    <label class="info-label">

                        First Name

                    </label>

                    <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        class="form-control">

                </div>

                <div class="col-md-4">

                    <label class="info-label">

                        Middle Name

                    </label>

                    <input
                        id="middlename"
                        name="middlename"
                        type="text"
                        class="form-control">

                </div>

                <div class="col-md-4">

                    <label class="info-label">

                        Last Name

                    </label>

                    <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        class="form-control">

                </div>

                <div class="col-md-6">

                    <label class="info-label">

                        Birthdate

                    </label>

                    <input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        class="form-control">

                </div>

                <div class="col-md-6">

                    <label class="info-label">

                        Mobile Number

                    </label>

                    <input
                        id="mobile_number"
                        name="mobile_number"
                        type="text"
                        class="form-control">

                </div>

                <div class="col-md-12">

                    <label class="info-label">

                        Email Address

                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        class="form-control">

                </div>

                <div class="col-12 text-end mt-3">

                    <button
                        id="btnUpdateProfile"
                        class="btn btn-success">

                        <i class="bi bi-check-circle"></i>

                        Save Changes

                    </button>

                </div>

            </div>

        </div>

        <!-- Security -->

        <div class="table-card mt-4">

            <div class="d-flex justify-content-between align-items-center">

                <div>

                    <h5 class="mb-1">

                        Security

                    </h5>

                    <small class="text-muted">

                        Protect your account credentials.

                    </small>

                </div>

                <button
                    id="btnChangePassword"
                    class="btn btn-warning">

                    <i class="bi bi-key-fill"></i>

                    Change Password

                </button>

            </div>

            <hr>

            <div class="row">

                <div class="col-md-6">

                    <label class="info-label">

                        Password

                    </label>

                    <input
                        id="password"
                        type="password"
                        class="form-control"
                        readonly
                        value="********">

                </div>

                <div class="col-md-6">

                    <label class="info-label">

                        Last Password Update

                    </label>

                    <input
                        id="last_password_update"
                        class="form-control"
                        readonly
                        value="Not Available">

                </div>

            </div>

        </div>

        

    </div>
    <div class="col-lg-12 table-card mt-4">

        <div class="d-flex justify-content-between align-items-center mb-3">

            <h5 class="mb-0">

                <i class="bi bi-clock-history me-2"></i>

                Activity Logs

            </h5>

        </div>

        <div class="table-responsive">

            <table
                id="tblActivityLogs"
                class="table table-hover align-middle mb-0 w-100">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Action</th>

                        <th>Remarks</th>

                        <th>Data</th>

                    </tr>

                </thead>

            </table>

        </div>

    </div>

</div>
    <div class="modal fade" id="cropModal" tabindex="-1">

        <div class="modal-dialog modal-lg modal-dialog-centered">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title">
                        Crop Profile Photo
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                    </button>

                </div>

                <div class="modal-body text-center">

                    <!-- Cropper uses this image -->
                    <img
                        id="cropImage"
                        src=""
                        style="max-width:100%; display:block;">

                </div>

                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">

                        Cancel

                    </button>

                    <button
                        type="button"
                        id="btnCropSave"
                        class="btn btn-primary">

                        Save

                    </button>

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
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>    
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css">

<script src="https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js"></script>
<script src="assets/js/config.js"></script>

<script src="assets/js/common.js"></script>

<script src="assets/js/profile.js"></script>
<script src="assets/js/dashboardMain.js"></script>
</html>
</body>
</html>