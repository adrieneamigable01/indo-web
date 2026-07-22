
<div class="sidebar">

    <div class="text-center py-4 border-bottom">

        <div
            class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
            style="width:80px;height:80px;font-size:38px;">

            <i class="bi bi-bank2"></i>

        </div>

        <h5 class="mt-3 fw-bold text-primary">

            INDO-PACIFIC

        </h5>

        <div class="fw-semibold">

            LENDING CORPORATION

        </div>

        <small class="text-muted">

            Lending Management System

        </small>

    </div>

    <a href="<?= url('dashboard') ?>" class="menu-item <?= isActive('dashboard') ? 'active' : '' ?>">
        <i class="bi bi-grid"></i>
        Dashboard
    </a>

    <a href="<?= url('borrowers') ?>" class="menu-item <?= isActive('borrowers') ? 'active' : '' ?>">
        <i class="bi bi-people"></i>
        Borrowers
    </a>

    <a href="<?= url('loan') ?>" class="menu-item <?= isActive('loan') ? 'active' : '' ?>">
        <i class="bi bi-cash-stack"></i>
        Loans
    </a>

    <!-- <a href="<?= url('vault/managers') ?>" class="menu-item <?= isActive('vault/managers') ? 'active' : '' ?>">
        <i class="bi bi-wallet2"></i>
        Managers Vault
    </a>

    <a href="<?= url('vault/cashier') ?>" class="menu-item <?= isActive('vault/cashier') ? 'active' : '' ?>">
        <i class="bi bi-file-earmark-bar-graph"></i>
        Cashier
    </a> -->
    <!-- Vault -->

    <a class="menu-item d-flex justify-content-between align-items-center
        <?= (
            isActive('vault/managers') ||
            isActive('vault/cashier') ||
            isActive('vault/cashier-return')
        ) ? 'active' : '' ?>"
       data-bs-toggle="collapse"
       href="#vaultMenu"
       role="button"
       aria-expanded="<?= (
            isActive('vault/managers') ||
            isActive('vault/cashier') ||
            isActive('vault/cashier-return')
       ) ? 'true' : 'false' ?>"
       aria-controls="vaultMenu">

        <span>

            <i class="bi bi-wallet2"></i>

            Vault

        </span>

        <i class="bi bi-chevron-down"></i>

    </a>

    <div
        class="collapse <?= (
            isActive('vault/managers') ||
            isActive('vault/cashier') ||
            isActive('vault/cashier-return')
        ) ? 'show' : '' ?>"
        id="vaultMenu">

        <a href="<?= url('vault/managers') ?>"
           class="menu-item ps-5 <?= isActive('vault/managers') ? 'active' : '' ?>">

            <i class="bi bi-wallet2"></i>

            Managers Vault

        </a>

        <a href="<?= url('vault/cashier') ?>"
           class="menu-item ps-5 <?= isActive('vault/cashier') ? 'active' : '' ?>">

            <i class="bi bi-cash-coin"></i>

            Cashier Vault

        </a>

        <a href="<?= url('vault/cashier-return') ?>"
           class="menu-item ps-5 <?= isActive('vault/cashier-return') ? 'active' : '' ?>">

            <i class="bi bi-journal-check"></i>

            Daily Close

        </a>

    </div>

</div>

