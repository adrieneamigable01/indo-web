<style>
    .profile-trigger{
    display:flex;
    align-items:center;
    justify-content:center;
}

.profile-avatar{
    position:relative;
    width:52px;
    height:52px;
    border-radius:50%;
    padding:3px;
    background:linear-gradient(135deg,#0d6efd,#6ea8fe);
    transition:all .25s ease;
    box-shadow:0 4px 12px rgba(13,110,253,.25);
}

.profile-avatar:hover{
    transform:translateY(-2px) scale(1.05);
    box-shadow:0 8px 18px rgba(13,110,253,.35);
}

.profile-avatar-img{
    width:100%;
    height:100%;
    border-radius:50%;
    object-fit:cover;
    border:3px solid #fff;
    background:#f8f9fa;
}

/* Optional online indicator */
.profile-avatar::after{
    content:"";
    position:absolute;
    bottom:4px;
    right:4px;
    width:12px;
    height:12px;
    border-radius:50%;
    background:#28a745;
    border:2px solid #fff;
}
</style>
<nav class="navbar bg-white shadow-sm rounded-4 px-4 py-3 mb-4">

    <!-- Left -->
    <div>

        <h4 class="fw-bold mb-0 text-primary">
            <?= $pageTitle ?? "Dashboard"; ?>
        </h4>

        <small class="text-muted">
            Indo-Pacific Lending Corporation
        </small>

    </div>

    <!-- Right -->
    <div class="dropdown">

        <a href="#"
            class="profile-trigger text-decoration-none"
            data-bs-toggle="dropdown"
            aria-expanded="false">

                <div class="profile-avatar">

                    <img
                        id="navProfileImage"
                        src=""
                        alt="Profile"
                        class="profile-avatar-img">

                </div>

            </a>

        <ul class="dropdown-menu dropdown-menu-end shadow border-0">

            <li>

                <div class="px-3 py-3 text-center">

                    <!-- Large Profile Image -->
                    <img
                        id="navProfileImageLarge"
                        src=""
                        class="rounded-circle border mb-2"
                        width="70"
                        height="70"
                        style="object-fit:cover;">

                    <!-- Large Name -->
                    <div
                        id="navFullNameLarge"
                        class="fw-bold">

                        -

                    </div>

                    <!-- Large Role -->
                    <small
                        id="navRoleLarge"
                        class="text-muted">

                        -

                    </small>

                </div>

            </li>

            <li><hr class="dropdown-divider"></li>

            <li>

                <a class="dropdown-item" href="<?= url('user-profile') ?>">

                    <i class="bi bi-person-circle me-2 text-primary"></i>

                    My Profile

                </a>

            </li>

            <li>

                <a class="dropdown-item" href="<?= url('security') ?>">

                    <i class="bi bi-shield-lock me-2 text-warning"></i>

                    Security Settings

                </a>

            </li>

            <li><hr class="dropdown-divider"></li>

            <li>

                <a class="dropdown-item text-danger" href="<?= url('logout') ?>">

                    <i class="bi bi-box-arrow-right me-2"></i>

                    Logout

                </a>

            </li>

        </ul>

    </div>

</nav>