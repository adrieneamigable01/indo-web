<style>

    .navbar{
        position: fixed;
        top: 0;
        left: 270px;          /* Same as sidebar width */
        right: 0;
        height: 70px;
        z-index: 1050;

        background: #fff;
        box-shadow: 0 4px 20px rgba(0,0,0,.05);
        border-bottom: 1px solid #e5e7eb;
    }

    .navbar .dropdown-toggle::after{
        margin-left:12px;
    }

    .dropdown-menu{
        width:260px;
        border-radius:15px;
    }

    .dropdown-item{
        padding:.75rem 1rem;
        transition:.2s;
    }

    .dropdown-item:hover{
        background:#f8f9fa;
    }

    .dropdown-item i{
        width:22px;
    }

    .navbar img{
        transition:.2s;
    }

    .navbar img:hover{
        transform:scale(1.05);
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
               class="d-flex align-items-center text-decoration-none dropdown-toggle"
               data-bs-toggle="dropdown"
               aria-expanded="false">

                <img
                    src=""
                    class="rounded-circle border shadow-sm"
                    width="45"
                    height="45"
                    style="object-fit:cover;">

                <div class="ms-3 text-start">

                    <div class="fw-semibold text-dark">


                    </div>

                    <small class="text-muted">


                    </small>

                </div>

            </a>

            <ul class="dropdown-menu dropdown-menu-end shadow border-0">

                <li>

                    <div class="px-3 py-3 text-center">

                        <img
                            src=""
                            class="rounded-circle border mb-2"
                            width="70"
                            height="70"
                            style="object-fit:cover;">

                        <div class="fw-bold">


                        </div>

                        <small class="text-muted">


                        </small>

                    </div>

                </li>

                <li><hr class="dropdown-divider"></li>

                <li>

                    <a class="dropdown-item" href="<?= url('profile') ?>">

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