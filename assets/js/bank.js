let bankPage = {

    table: null,

    bankAccounts: {},
    banks: [],

    init: function () {

        bankPage.funx.loadBanks();
        bankPage.funx.loadBankAccounts();
    },

    funx: {

        /*
        |--------------------------------------------------------------------------
        | LOAD BANK ACCOUNTS
        |--------------------------------------------------------------------------
        */
        loadBanks: function () {

            jsAddon.display.ajaxRequest({

                url: banksApi,

                type: "GET",

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                bankPage.banks = response.data;

            });

        },
        getBankDropdown: function (selectedBankId = "") {

            let html = '<option value="">Select Bank</option>';

            bankPage.banks.forEach(function (bank) {

                html += `
                    <option value="${bank.bank_id}"
                        ${bank.bank_id == selectedBankId ? "selected" : ""}>
                        ${bank.bank_name}
                    </option>
                `;

            });

            return html;

        },
        loadBankAccounts: function () {

            if (bankPage.table) {

                bankPage.table.destroy();

            }

            bankPage.table = $("#bankTable").DataTable({

                processing: true,

                serverSide: true,

                destroy: true,

                responsive: true,

                autoWidth: false,

                searching: false,

                ordering: true,

                pageLength: 10,

                order: [[0, "desc"]],

                ajax: function (data, callback) {

                    jsAddon.display.ajaxRequest({

                        url: bankApi,

                        type: "GET",

                        payload: {

                            draw: data.draw,

                            start: data.start,

                            length: data.length,

                            orderColumn:
                                data.columns[data.order[0].column].data,

                            orderDir:
                                data.order[0].dir,

                            bank:
                                $("#filterBank").val(),

                            account_type:
                                $("#filterAccountType").val(),

                            status:
                                $("#filterStatus").val(),

                            search:
                                $("#txtSearch").val()

                        },

                        dataType: "json"

                    }).then(function (response) {

                        if (response.isError) {

                            Swal.fire(

                                "Error",

                                response.message,

                                "error"

                            );

                            return;

                        }

                        bankPage.bankAccounts = {};

                        $.each(response.data, function (_, row) {

                            bankPage.bankAccounts[row.bank_account_id] = row;

                        });

                        bankPage.funx.summary(response.data);

                        callback({

                            draw: response.draw,

                            recordsTotal: response.recordsTotal,

                            recordsFiltered: response.recordsFiltered,

                            data: response.data

                        });

                    });

                },

                columns: [

                    {
                        data: "bank_name"
                    },

                    {
                        data: "account_name"
                    },

                    {
                        data: "account_number"
                    },

                    {
                        data: null,
                        render: function (data) {
                            return `${data.branch_name} Branch` || "-";
                        }
                    },

                    {
                        data: "account_type"
                    },

                    {
                        data: "current_balance",

                        render: function (data) {

                            return jsAddon.display.money(data);

                        }

                    },

                    {
                        data: "account_status",

                        render: function (data) {

                            return bankPage.funx.statusBadge(data);

                        }

                    },

                    {

                        data: null,

                        orderable: false,

                        searchable: false,

                        render: function (data, type, row) {

                            return bankPage.funx.actionButtons(row);

                        }

                    }

                ]

            });

        },

        /*
        |--------------------------------------------------------------------------
        | STATUS BADGE
        |--------------------------------------------------------------------------
        */

        statusBadge: function (status) {

            if (

                status == "ACTIVE" ||

                String(status).toUpperCase() == "ACTIVE"

            ) {

                return `

                    <span class="badge bg-success">

                        ACTIVE

                    </span>

                `;

            }

            return `

                <span class="badge bg-danger">

                    CLOSED

                </span>

            `;

        },

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        summary: function (data) {

            let active = 0;

            let inactive = 0;

            let totalBalance = 0;

            $.each(data, function (_, row) {

                totalBalance +=
                    parseFloat(
                        row.current_balance || 0
                    );

                if (

                    row.is_active == 1 ||

                    String(row.is_active).toUpperCase() == "ACTIVE"

                ) {

                    active++;

                } else {

                    inactive++;

                }

            });

            $("#totalAccounts")
                .text(data.length);

            $("#activeAccounts")
                .text(active);

            $("#inactiveAccounts")
                .text(inactive);

            $("#totalBalance")
                .text(

                    jsAddon.display.money(
                        totalBalance
                    )

                );

        },

        /*
        |--------------------------------------------------------------------------
        | ACTION BUTTONS
        |--------------------------------------------------------------------------
        */

        actionButtons: function (row) {

            let html = `
                <div class="dropdown">

                    <button
                        class="btn btn-sm btn-light border"
                        data-bs-toggle="dropdown">

                        <i class="bi bi-three-dots"></i>

                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">

                        <li>
                            <a
                                class="dropdown-item"
                                href="javascript:void(0)"
                                onclick="bankPage.funx.viewBankAccount(${row.bank_account_id})">

                                <i class="fas fa-eye text-primary me-2"></i>

                                View

                            </a>
                        </li>
            `;

            // Only show when account is ACTIVE
            if (row.account_status === "ACTIVE") {

                html += `
                    <li>
                        <a
                            class="dropdown-item"
                            href="javascript:void(0)"
                            onclick="bankPage.funx.editBankAccount(${row.bank_account_id})">

                            <i class="fas fa-edit text-warning me-2"></i>

                            Edit

                        </a>
                    </li>

                    <li>
                        <a
                            class="dropdown-item text-danger"
                            href="javascript:void(0)"
                            onclick="bankPage.funx.closeBankAccount(${row.bank_account_id})">

                            <i class="fas fa-lock me-2"></i>

                            Close Account

                        </a>
                    </li>
                `;
            }

            html += `
                    </ul>

                </div>
            `;

            return html;

        },

        editBankAccount: function (bankAccountId) {

            const account = bankPage.bankAccounts[bankAccountId];
 
            if (!account) {

                Swal.fire(
                    "Error",
                    "Bank account not found.",
                    "error"
                );

                return;

            }

            bankPage.funx.openBankAccountForm(account);

        },

                /*
        |--------------------------------------------------------------------------
        | VIEW BANK ACCOUNT
        |--------------------------------------------------------------------------
        */

        viewBank: function (bankAccountId) {

            jsAddon.display.ajaxRequest({

                url: bankDetailsApi + "/" + bankAccountId,

                type: "GET",

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                let bank = response.data;

                $("#viewBankName")
                    .text(bank.bank_name);

                $("#viewAccountName")
                    .text(bank.account_name);

                $("#viewAccountNumber")
                    .text(bank.account_number);

                $("#viewBranch")
                    .text(bank.branch_name);

                $("#viewAccountType")
                    .text(bank.account_type);

                $("#viewOpeningBalance")
                    .text(
                        jsAddon.display.money(
                            bank.opening_balance
                        )
                    );

                $("#viewCurrentBalance")
                    .text(
                        jsAddon.display.money(
                            bank.current_balance
                        )
                    );

                $("#viewStatus")
                    .html(
                        bankPage.funx.statusBadge(
                            bank.is_active
                        )
                    );

                $("#viewCreatedAt")
                    .text(bank.created_at);

                $("#viewUpdatedAt")
                    .text(bank.updated_at);

                new bootstrap.Modal(

                    document.getElementById(
                        "viewBankModal"
                    )

                ).show();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW ADD / EDIT MODAL
        |--------------------------------------------------------------------------
        */

        showBankModal: function (bankAccountId = null) {
            
            $("#bankAccountForm")[0].reset();

            $("#bankAccountId").val("");

            if (bankAccountId == null) {

                $("#bankModalTitle")
                    .text("Add Bank Account");

                new bootstrap.Modal(

                    document.getElementById(
                        "bankAccountModal"
                    )

                ).show();

                return;

            }

            let bank =
                bankPage.bankAccounts[bankAccountId];

            if (!bank) {

                Swal.fire(
                    "Error",
                    "Bank account not found.",
                    "error"
                );

                return;

            }

            $("#bankModalTitle")
                .text("Edit Bank Account");

            $("#bankAccountId")
                .val(bank.bank_account_id);

            $("#bankId")
                .val(bank.bank_id);

            $("#accountName")
                .val(bank.account_name);

            $("#accountNumber")
                .val(bank.account_number);

            $("#branchName")
                .val(bank.branch_name);

            $("#accountType")
                .val(bank.account_type);

            $("#openingBalance")
                .val(bank.opening_balance);

            $("#isActive")
                .val(bank.is_active);

            new bootstrap.Modal(

                document.getElementById(
                    "bankAccountModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE BANK ACCOUNT
        |--------------------------------------------------------------------------
        */

        saveBank: function () {

            let payload = {

                bank_account_id:
                    $("#bankAccountId").val(),

                bank_id:
                    $("#bankId").val(),

                account_name:
                    $("#accountName").val(),

                account_number:
                    $("#accountNumber").val(),

                branch_name:
                    $("#branchName").val(),

                account_type:
                    $("#accountType").val(),

                opening_balance:
                    $("#openingBalance").val(),

                is_active:
                    $("#isActive").val()

            };

            let isUpdate =
                payload.bank_account_id != "";

            jsAddon.display.ajaxRequest({

                url: bankApi,

                type: isUpdate
                    ? "PUT"
                    : "POST",

                payload: payload,

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                bootstrap.Modal
                    .getInstance(
                        document.getElementById(
                            "bankAccountModal"
                        )
                    )
                    .hide();

                Swal.fire({

                    icon: "success",

                    title:
                        isUpdate
                            ? "Bank Updated"
                            : "Bank Added",

                    timer: 1500,

                    showConfirmButton: false

                });

                bankPage.funx.loadBanks();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | DELETE BANK ACCOUNT
        |--------------------------------------------------------------------------
        */

        viewBankAccount: function (bankAccountId) {
            window.location =
                "view/bank?bank_account_id=" + bankAccountId;
        },
        deleteBank: function (bankAccountId) {

            Swal.fire({

                title:
                    "Delete Bank Account?",

                text:
                    "This action cannot be undone.",

                icon:
                    "warning",

                showCancelButton: true,

                confirmButtonColor:
                    "#dc3545",

                confirmButtonText:
                    "Delete"

            }).then(function (result) {

                if (!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url: bankApi,

                    type: "DELETE",

                    payload: {

                        bank_account_id:
                            bankAccountId

                    },

                    dataType: "json"

                }).then(function (response) {

                    if (response.isError) {

                        Swal.fire(
                            "Error",
                            response.message,
                            "error"
                        );

                        return;

                    }

                    Swal.fire({

                        icon: "success",

                        title:
                            "Deleted Successfully",

                        timer: 1500,

                        showConfirmButton: false

                    });

                    bankPage.funx.loadBanks();

                });

            });

        },
                /*
        |--------------------------------------------------------------------------
        | SHOW DEPOSIT
        |--------------------------------------------------------------------------
        */

        showDeposit: function (bankAccountId) {

            $("#depositForm")[0].reset();

            $("#depositAccountId")
                .val(bankAccountId);

            new bootstrap.Modal(

                document.getElementById(
                    "depositModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE DEPOSIT
        |--------------------------------------------------------------------------
        */

        saveDeposit: function () {

            let payload = {

                bank_account_id:
                    $("#depositAccountId").val(),

                transaction_date:
                    $("#depositDate").val(),

                amount:
                    $("#depositAmount").val(),

                reference_no:
                    $("#depositReference").val(),

                check_no:
                    $("#depositCheckNo").val(),

                description:
                    $("#depositDescription").val()

            };

            jsAddon.display.ajaxRequest({

                url: bankDepositApi,

                type: "POST",

                payload: payload,

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                bootstrap.Modal
                    .getInstance(
                        document.getElementById(
                            "depositModal"
                        )
                    )
                    .hide();

                Swal.fire({

                    icon: "success",

                    title: "Deposit Saved",

                    timer: 1500,

                    showConfirmButton: false

                });

                bankPage.funx.loadBanks();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW WITHDRAW
        |--------------------------------------------------------------------------
        */

        showWithdraw: function (bankAccountId) {

            $("#withdrawForm")[0].reset();

            $("#withdrawAccountId")
                .val(bankAccountId);

            new bootstrap.Modal(

                document.getElementById(
                    "withdrawModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE WITHDRAW
        |--------------------------------------------------------------------------
        */

        saveWithdraw: function () {

            let payload = {

                bank_account_id:
                    $("#withdrawAccountId").val(),

                transaction_date:
                    $("#withdrawDate").val(),

                amount:
                    $("#withdrawAmount").val(),

                reference_no:
                    $("#withdrawReference").val(),

                check_no:
                    $("#withdrawCheckNo").val(),

                description:
                    $("#withdrawDescription").val()

            };

            jsAddon.display.ajaxRequest({

                url: bankWithdrawApi,

                type: "POST",

                payload: payload,

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                bootstrap.Modal
                    .getInstance(
                        document.getElementById(
                            "withdrawModal"
                        )
                    )
                    .hide();

                Swal.fire({

                    icon: "success",

                    title: "Withdrawal Saved",

                    timer: 1500,

                    showConfirmButton: false

                });

                bankPage.funx.loadBanks();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | VIEW LEDGER
        |--------------------------------------------------------------------------
        */

        viewLedger: function (bankAccountId) {

            jsAddon.display.ajaxRequest({

                url: bankLedgerApi + "/" + bankAccountId,

                type: "GET",

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                let html = "";

                $.each(response.data, function (_, row) {

                    html += `

                        <tr>

                            <td>${row.transaction_date}</td>

                            <td>${row.transaction_type}</td>

                            <td>${row.reference_no ?? ""}</td>

                            <td>${row.check_no ?? ""}</td>

                            <td>${row.description ?? ""}</td>

                            <td class="text-end">

                                ${row.transaction_type == "DEPOSIT"
                                    ? jsAddon.display.money(row.amount)
                                    : "-"}

                            </td>

                            <td class="text-end">

                                ${row.transaction_type == "WITHDRAWAL"
                                    ? jsAddon.display.money(row.amount)
                                    : "-"}

                            </td>

                            <td class="text-end">

                                ${jsAddon.display.money(row.balance_after)}

                            </td>

                        </tr>

                    `;

                });

                $("#ledgerTable tbody")
                    .html(html);

                new bootstrap.Modal(

                    document.getElementById(
                        "ledgerModal"
                    )

                ).show();

            });

        },
        openBankAccountForm: (account = null) => {

            Swal.fire({

                title: account
                ? "Edit Bank Account"
                : "Add Bank Account",

                width: 700,

                showCancelButton: true,

                confirmButtonText: "Save",

                cancelButtonText: "Cancel",

                focusConfirm: false,

               html: `

                <div class="container-fluid text-start">

                    <!-- BANK INFORMATION -->
                    <div class="mb-4">

                        <label class="form-label fw-semibold">

                            Card Preview

                        </label>

                        <div
                            id="swalCardPreview"
                            class="atm-card theme-${account?.card_theme ?? 'blue'}">

                            <div class="card-chip"></div>

                            <div class="card-header">

                                <div>

                                    <small>Bank</small>

                                    <h6 id="previewBankName">

                                        ${account?.bank_name ?? 'Bank Name'}

                                    </h6>

                                </div>

                            </div>

                            <div class="card-holder">

                                <small>Account Holder</small>

                                <div id="previewAccountName">

                                    ${account?.account_name ?? 'Account Holder'}

                                </div>

                            </div>

                            <div
                                class="account-number"
                                id="previewAccountNumber">

                                ${account?.account_number ?? '0000 0000 0000 0000'}

                            </div>

                        </div>

                    </div>


                    <div class="bg-light rounded p-3 mb-3 border">

                        <h6 class="fw-bold text-primary mb-3">

                            <i class="fas fa-university me-2"></i>

                            Bank Information

                        </h6>

                        <div class="row">

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-semibold">

                                    Bank

                                </label>

                                <select
                                    id="swal_bank_id"
                                    class="form-select"
                                    style="width:100%">
                                </select>

                            </div>

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-semibold">

                                    Currency

                                </label>

                                <select
                                    id="swal_currency"
                                    class="form-select">

                                    <option
                                        value="PHP"
                                        ${account?.currency == "PHP" ? "selected" : ""}>

                                        🇵🇭 Philippine Peso (PHP)

                                    </option>

                                    <option
                                        value="USD"
                                        ${account?.currency == "USD" ? "selected" : ""}>

                                        🇺🇸 US Dollar (USD)

                                    </option>

                                </select>

                            </div>

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-semibold">

                                    Card Theme

                                </label>

                                <select
                                    id="swal_card_theme"
                                    class="form-select">

                                    <option value="blue" ${account?.card_theme=="blue"?"selected":""}>
                                        🔵 Blue
                                    </option>

                                    <option value="gold" ${account?.card_theme=="gold"?"selected":""}>
                                        🥇 Gold
                                    </option>

                                    <option value="green" ${account?.card_theme=="green"?"selected":""}>
                                        🟢 Green
                                    </option>

                                    <option value="lightgreen" ${account?.card_theme=="lightgreen"?"selected":""}>
                                        🍃 Light Green
                                    </option>

                                    <option value="red" ${account?.card_theme=="red"?"selected":""}>
                                        🔴 Red
                                    </option>

                                    <option value="purple" ${account?.card_theme=="purple"?"selected":""}>
                                        🟣 Purple
                                    </option>

                                    <option value="black" ${account?.card_theme=="black"?"selected":""}>
                                        ⚫ Black
                                    </option>

                                    <option value="silver" ${account?.card_theme=="silver"?"selected":""}>
                                        ⚪ Silver
                                    </option>

                                    <option value="orange" ${account?.card_theme=="orange"?"selected":""}>
                                        🟠 Orange
                                    </option>

                                    <option value="teal" ${account?.card_theme=="teal"?"selected":""}>
                                        🩵 Teal
                                    </option>

                                    <option value="rose" ${account?.card_theme=="rose"?"selected":""}>
                                        🌹 Rose
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>
                    

                    <!-- ACCOUNT INFORMATION -->

                    <div class="bg-light rounded p-3 mb-3 border">

                        <h6 class="fw-bold text-success mb-3">

                            <i class="fas fa-credit-card me-2"></i>

                            Account Information

                        </h6>

                        <div class="row">

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-semibold">

                                    Account Name

                                </label>

                                <input
                                    id="swal_account_name"
                                    class="form-control"
                                    value="${account?.account_name ?? ''}">

                            </div>

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-semibold">

                                    Account Number

                                </label>

                                <input
                                    id="swal_account_number"
                                    class="form-control"
                                    value="${account?.account_number ?? ''}">

                            </div>

                            <div class="col-md-6">

                                <label class="form-label fw-semibold">

                                    Account Type

                                </label>

                                <select
                                    id="swal_account_type"
                                    class="form-select">

                                    <option
                                        value="SAVINGS"
                                        ${account?.account_type == "SAVINGS" ? "selected" : ""}>

                                        Savings

                                    </option>

                                    <option
                                        value="CHECKING"
                                        ${account?.account_type == "CHECKING" ? "selected" : ""}>

                                        Checking

                                    </option>

                                    <option
                                        value="CURRENT"
                                        ${account?.account_type == "CURRENT" ? "selected" : ""}>

                                        Current

                                    </option>

                                    <option
                                        value="PAYROLL"
                                        ${account?.account_type == "PAYROLL" ? "selected" : ""}>

                                        Payroll

                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                    <!-- FINANCIAL INFORMATION -->

                    <div class="bg-light rounded p-3 mb-3 border">

                        <h6 class="fw-bold text-warning mb-3">

                            <i class="fas fa-wallet me-2"></i>

                            Financial Information

                        </h6>

                        <div class="row">

                            <div class="col-md-6">

                                <label class="form-label fw-semibold">

                                    Opening Balance

                                </label>

                                <div class="input-group">

                                    <span class="input-group-text">

                                        ₱

                                    </span>

                                    <input
                                        id="swal_opening_balance"
                                        class="form-control"
                                        type="number"
                                        value="${account?.opening_balance ?? 0}">

                                </div>

                            </div>

                        </div>

                    </div>

                    <!-- DESCRIPTION -->

                    <div class="bg-light rounded p-3 border">

                        <h6 class="fw-bold text-secondary mb-3">

                            <i class="fas fa-file-alt me-2"></i>

                            Description

                        </h6>

                        <textarea
                            id="swal_description"
                            class="form-control"
                            rows="3">${account?.description ?? ""}</textarea>

                    </div>

                </div>

                `,

                didOpen: function () {

                    let options =
                        '<option value="">Select Bank</option>';

                    bankPage.banks.forEach(function (bank) {

                        options += `
                            <option value="${bank.bank_id}">
                                ${bank.bank_name}
                            </option>
                        `;

                    });

                    $("#swal_bank_id").html(options);

                    $("#swal_bank_id").select2({

                        theme: "bootstrap-5",

                        placeholder: "Search Bank",

                        allowClear: true,

                        width: "100%",

                        dropdownParent: $(".swal2-container")

                    });

                    // Pre-select the bank when editing
                    if (account) {

                        $("#swal_bank_id")
                            .val(account.bank_id)
                            .trigger("change");

                    }


                    $("#swal_card_theme").on("change", function () {

                        const theme = $(this).val();

                        $("#swalCardPreview")
                            .removeClass(function (i, cls) {

                                return (
                                    cls.match(/theme-\S+/g) || []
                                ).join(" ");

                            })
                            .addClass("theme-" + theme);

                    });

                    $("#swal_account_name").on("keyup", function(){

                            $("#previewAccountName").text(
                                $(this).val() || "Account Holder"
                            );

                        });

                        $("#swal_account_number").on("keyup", function(){

                            $("#previewAccountNumber").text(
                                $(this).val() || "0000 0000 0000 0000"
                            );

                        });

                        $("#swal_bank_id").on("change", function(){

                            const bank =
                                bankPage.banks.find(
                                    x => x.bank_id == $(this).val()
                                );

                            if(bank){

                                $("#previewBankName").text(
                                    bank.bank_name
                                );

                            }

                        });

                },
                willClose: function () {

                    if ($("#swal_bank_id").hasClass("select2-hidden-accessible")) {

                        $("#swal_bank_id").select2("destroy");

                    }

                },
                preConfirm: () => {

                    if ($("#swal_bank_id").val() == "") {

                        Swal.showValidationMessage(
                            "Please select a bank."
                        );

                        return false;

                    }

                    if ($("#swal_account_name").val().trim() == "") {

                        Swal.showValidationMessage(
                            "Account Name is required."
                        );

                        return false;

                    }

                    if ($("#swal_account_number").val().trim() == "") {

                        Swal.showValidationMessage(
                            "Account Number is required."
                        );

                        return false;

                    }
                    return {
                        bank_account_id: account ? account.bank_account_id : null,
                        bank_id:
                            $("#swal_bank_id").val(),

                        account_name:
                            $("#swal_account_name").val(),

                        account_number:
                            $("#swal_account_number").val(),

                        account_type:
                            $("#swal_account_type").val(),

                        currency:
                            $("#swal_currency").val(),

                        opening_balance:
                            $("#swal_opening_balance").val(),

                        description:
                            $("#swal_description").val(),
                        card_theme:
                            $("#swal_card_theme").val(),

                    };

                }

            }).then(function (result) {

                if (!result.isConfirmed) {

                    return;

                }
                if (result.value.bank_account_id) {

                    bankPage.funx.updateBankAccount(
                        result.value
                    );

                }
                else {

                    bankPage.funx.saveBankAccount(
                        result.value
                    );

                }

            });

        },
        closeBankAccount: function (bankAccountId) {

            Swal.fire({

                title: "Close Bank Account?",

                html: `

                    <div class="text-start">

                        <div class="alert alert-warning">

                            <i class="fas fa-exclamation-triangle me-2"></i>

                            Closing this account will prevent any future
                            deposits, withdrawals, or transfers.

                            <br><br>

                            This action cannot be undone.

                        </div>

                        <label class="form-label">

                            Reason

                        </label>

                        <textarea
                            id="swal_close_reason"
                            class="form-control"
                            rows="3"
                            placeholder="Reason for closing account..."></textarea>

                    </div>

                `,

                icon: "warning",

                showCancelButton: true,

                confirmButtonColor: "#dc3545",

                confirmButtonText: "Close Account",

                preConfirm: function () {

                    return {

                        reason: $("#swal_close_reason").val()

                    };

                }

            }).then(function (result) {

                if (!result.isConfirmed) {

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: `${closeBankAccountApi}/${bankAccountId}`,

                    type: "DELETE",

                    payload: result.value,

                    dataType: "json"

                })
                .then(function(response){

                    Swal.fire(
                        "Success",
                        response.message,
                        "success"
                    );

                })
                .catch(function(error){

                    Swal.fire(
                        "Error",
                        error.message,
                        "error"
                    );

                });

            });

        },
        saveBankAccount: function (data) {
            jsAddon.display.ajaxRequest({

                url: bankApi,

                type: "POST",

                dataType: "json",

                payload: data

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire({

                        icon: "error",

                        title: "Error",

                        text: response.message

                    });

                    return;

                }

                Swal.fire({

                    icon: "success",

                    title: "Success",

                    text: response.message,

                    timer: 1500,

                    showConfirmButton: false

                }).then(function () {

                    bankPage.funx.loadBankAccounts();

                });

            }).catch(function (error) {

                console.error(error);

                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text: "Unable to save bank account."

                });

            });

        },
        updateBankAccount: function (data) {

            jsAddon.display.ajaxRequest({

                url: bankApi,

                type: "PUT",

                payload: JSON.stringify(data),

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.fire({

                        icon: "error",

                        title: "Error",

                        text: response.message

                    });

                    return;

                }

                Swal.fire({

                    icon: "success",

                    title: "Success",

                    text: response.message,

                    timer: 1500,

                    showConfirmButton: false

                }).then(function () {

                    bankPage.funx.loadBankAccounts();

                });

            }).catch(function (error) {

                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text: "Unable to update bank account."

                });

                console.error(error);

            });

        },

    },
    

};

$(function () {

    bankPage.init();

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click", ".btn-view")

    .on("click", ".btn-view", function () {

        bankPage.funx.viewBank(

            $(this).data("id")

        );

    });

    /*
    |--------------------------------------------------------------------------
    | ADD
    |--------------------------------------------------------------------------
    */

    $("#btnAddBank")

    .off("click")

    .on("click", function () {

        bankPage.funx.showBankModal();

    });

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click", ".btn-edit")

    .on("click", ".btn-edit", function () {

        bankPage.funx.showBankModal(

            $(this).data("id")

        );

    });

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click", ".btn-delete")

    .on("click", ".btn-delete", function () {

        bankPage.funx.deleteBank(

            $(this).data("id")

        );

    });

    /*
    |--------------------------------------------------------------------------
    | SAVE BANK
    |--------------------------------------------------------------------------
    */

    $("#btnSaveBankAccount")

    .off("click")

    .on("click", function () {

        bankPage.funx.saveBank();

    });

    /*
    |--------------------------------------------------------------------------
    | DEPOSIT
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click", ".btn-deposit")

    .on("click", ".btn-deposit", function () {

        bankPage.funx.showDeposit(

            $(this).data("id")

        );

    });

    $("#btnDeposit")

    .off("click")

    .on("click", function () {

        bankPage.funx.saveDeposit();

    });

    /*
    |--------------------------------------------------------------------------
    | WITHDRAW
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click", ".btn-withdraw")

    .on("click", ".btn-withdraw", function () {

        bankPage.funx.showWithdraw(

            $(this).data("id")

        );

    });

    $("#btnWithdraw")

    .off("click")

    .on("click", function () {

        bankPage.funx.saveWithdraw();

    });

    /*
    |--------------------------------------------------------------------------
    | LEDGER
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click", ".btn-ledger")

    .on("click", ".btn-ledger", function () {

        bankPage.funx.viewLedger(

            $(this).data("id")

        );

    });

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    $("#filterBank,#filterAccountType,#filterStatus")

    .off("change")

    .on("change", function () {

        bankPage.funx.loadBanks();

    });

    $("#txtSearch")

    .off("keypress")

    .on("keypress", function (e) {

        if (e.which == 13) {

            bankPage.funx.loadBanks();

        }

    });

    $(document).on("click", "#btnAddBankAccount", function () {
        bankPage.funx.openBankAccountForm();
    });

});