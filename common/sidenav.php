
<div class="sidebar">

    <div class="logo mb-4">
        🏦 LendingPro
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

    <a href="<?= url('vault/managers') ?>" class="menu-item <?= isActive('vault/managers') ? 'active' : '' ?>">
        <i class="bi bi-wallet2"></i>
        Managers Vault
    </a>

    <a href="<?= url('vault/cashier') ?>" class="menu-item <?= isActive('vault/cashier') ? 'active' : '' ?>">
        <i class="bi bi-file-earmark-bar-graph"></i>
        Cashier
    </a>

</div>