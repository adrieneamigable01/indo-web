const bankView = {

    bankAccountId: null,

    account: {},

    transactionTable: null,
    banks: [],
    funx: {

        initialize: function () {

            const params =
                new URLSearchParams(window.location.search);

            bankView.bankAccountId =
                params.get("bank_account_id");

            if (!bankView.bankAccountId) {

                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text: "Invalid bank account."

                });

                return;

            }
            bankView.funx.loadBanks();
            bankView.funx.initializeEvents();

            bankView.funx.loadAccountDetails();
            bankView.funx.loadTransactions();

            bankView.funx.loadDashboard();

      
        },

        initializeEvents: function () {

            $("#btnBack").on("click", function () {

                window.history.back();

            });

            $("#btnEditBank").on("click", function () {

               bankView.funx.editBankAccount(bankView.bankAccountId)

            });

            $("#btnDeposit").on("click", function () {

                bankView.funx.openTransactionForm("DEPOSIT");

            });

            $("#btnWithdraw").on("click", function () {

                bankView.funx.openTransactionForm("WITHDRAWAL");

            });

            $("#btnTransfer").on("click", function () {

                bankView.funx.openTransactionForm("TRANSFER");

            });

            $("#filterDateFrom,#filterDateTo,#filterTransactionType")
                .on("change", function () {

                    bankView.transactionTable.ajax.reload();

                });

            $("#filterSearch")
                .on("keyup", function () {

                    bankView.transactionTable.search(
                        this.value
                    ).draw();

                });

        },
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

                bankView.banks = response.data;

            });

        },
        loadAccountDetails: function () {

            jsAddon.display.ajaxRequest({

                url:`${bankDetailsApi}/${bankView.bankAccountId}`,

                type: "GET",

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

                const account =
                    response.data;

                bankView.account =
                    account;

                /*
                |--------------------------------------------------------------------------
                | ATM CARD
                |--------------------------------------------------------------------------
                */

                $(".atm-card")
                .removeClass(function(index, className) {
                    return (className.match(/(^|\s)theme-\S+/g) || []).join(" ");
                })
                .addClass("theme-" + account.card_theme);

                $("#bankName").text(
                    account.bank_name
                );

                $("#viewAccountName").text(
                    account.account_name
                );

                /*
                |--------------------------------------------------------------------------
                | MASK ACCOUNT NUMBER
                |--------------------------------------------------------------------------
                */

                let accountNumber =
                    account.account_number ?? "";

                if (accountNumber.length > 4) {

                    accountNumber =
                        "•••• •••• •••• " +
                        accountNumber.slice(-4);

                }

                $("#viewAccountNumber").text(
                    accountNumber
                );
                
                /*
                |--------------------------------------------------------------------------
                | BALANCES
                |--------------------------------------------------------------------------
                */
         
                $("#currentBalance").text(

                    jsAddon.display.money(
                        account.current_balance
                    )

                );
          
                $("#viewCurrentBalance").text(

                    jsAddon.display.money(
                        account.current_balance
                    )

                );

                $("#viewOpeningBalance").text(

                    jsAddon.display.money(
                        account.opening_balance
                    )

                );

                /*
                |--------------------------------------------------------------------------
                | INFORMATION
                |--------------------------------------------------------------------------
                */

                // $("#viewBranchName").text(
                //     account.branch_name
                // );

                $("#viewAccountType").text(
                    account.account_type
                );

                $("#viewCurrency").text(
                    account.currency
                );

                $("#viewDescription").text(
                    account.description || "-"
                );

                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                $("#viewStatus")
                    .removeClass(
                        "bg-success bg-danger"
                    )
                    .addClass(

                        account.account_status == "ACTIVE"
                            ? "bg-success"
                            : "bg-danger"

                    )
                    .text(

                        account.account_status == 1
                            ? "ACTIVE"
                            : "CLOSED"

                    );

                
                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                const isClosed = account.account_status === "CLOSED";

                $("#viewStatus")
                    .removeClass("bg-success bg-danger")
                    .addClass(
                        isClosed
                            ? "bg-danger"
                            : "bg-success"
                    )
                    .text(
                        isClosed
                            ? "CLOSED"
                            : "ACTIVE"
                    );

                /*
                |--------------------------------------------------------------------------
                | ENABLE / DISABLE ACTION BUTTONS
                |--------------------------------------------------------------------------
                */

                $("#btnEditBank").prop("disabled", isClosed);

                $("#btnDeposit").prop("disabled", isClosed);

                $("#btnWithdraw").prop("disabled", isClosed);

                $("#btnTransfer").prop("disabled", isClosed);

            });

            

        },
        loadTransactions: function () {

            if ($.fn.DataTable.isDataTable("#transactionTable")) {

                $("#transactionTable")
                    .DataTable()
                    .destroy();

            }

            bankView.transactionTable = $("#transactionTable").DataTable({

                processing: true,

                serverSide: true,

                responsive: true,

                autoWidth: false,

                searching: false,

                ordering: true,

                pageLength: 25,

                ajax: function (data, callback) {
                    
                    jsAddon.display.ajaxRequest({

                        url: bankTransactionsApi,

                        type: "GET",

                        dataType: "json",

                        payload: {

                            draw: data.draw,

                            start: data.start,

                            length: data.length,

                            search: $("#filterSearch").val(),

                            order: data.order,

                            columns: data.columns,

                            bank_account_id: bankView.bankAccountId,

                            transaction_type: $("#filterTransactionType").val(),

                            date_from: $("#filterDateFrom").val(),

                            date_to: $("#filterDateTo").val()

                        }

                    }).then(function (response) {
                        console.log(`tranaction response : ${JSON.stringify(response)}`);
                        callback({

                            draw: response.draw,

                            recordsTotal: response.recordsTotal,

                            recordsFiltered: response.recordsFiltered,

                            data: response.data

                        });

                    }).catch(function (error) {

                        console.error(error);

                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });

                    });

                },

                order: [

                    [0, "desc"]

                ],

                columns: [

                    {
                        data: "transaction_date",
                        render: function (data) {

                            return data
                                ? moment(data).format("MMM DD, YYYY hh:mm:ss A")
                                : "-";

                        }
                    },

                    {
                        data: "reference_no",
                        defaultContent: "-"
                    },

                    {
                        data: "check_no",
                        defaultContent: "-"
                    },

                    {
                        data: "transaction_type",
                        render: function (data) {

                            let badge = "secondary";

                           switch (data) {

                                case "DEPOSIT":
                                    badge = "success";
                                    break;

                                case "WITHDRAWAL":
                                    badge = "danger";
                                    break;

                                case "TRANSFER_OUT":
                                    badge = "warning";
                                    break;

                                case "TRANSFER_IN":
                                    badge = "info";
                                    break;

                                case "ADJUSTMENT":
                                    badge = "secondary";
                                    break;

                            }

                            return `<span class="badge bg-${badge}">${data}</span>`;

                        }
                    },

                    {
                        data: "description",
                        defaultContent: "-"
                    },

                    {
                        data: null,
                        className: "text-end",
                        render: function (row) {

                            return ["DEPOSIT", "TRANSFER_IN"].includes(row.transaction_type)
                            ? jsAddon.display.money(row.amount)
                            : "-";

                        }
                    },

                    {
                        data: null,
                        className: "text-end",
                        render: function (row) {

                            return ["WITHDRAWAL", "TRANSFER_OUT"].includes(row.transaction_type)
                            ? jsAddon.display.money(row.amount)
                            : "-";

                        }
                    },

                    {
                        data: "balance_after",
                        className: "text-end fw-bold",
                        render: function (data) {

                            return jsAddon.display.money(data);

                        }
                    },

                    {
                        data: null,
                        orderable: false,
                        searchable: false,
                        className: "text-center",
                        render: function (row) {

                            let actions = `
                                <li>
                                    <a
                                        class="dropdown-item"
                                        href="javascript:void(0)"
                                        onclick="bankView.funx.viewTransaction(${row.bank_transaction_id})">

                                        <i class="fas fa-eye text-primary me-2"></i>

                                        View

                                    </a>
                                </li>
                            `;

                            if (row.transaction_type !== "TRANSFER_IN") {

                                actions += `
                                    <li>

                                        <a
                                            class="dropdown-item"
                                            href="javascript:void(0)"
                                            onclick="bankView.funx.editTransaction(${row.bank_transaction_id})">

                                            <i class="fas fa-edit text-warning me-2"></i>

                                            Update

                                        </a>

                                    </li>

                                    <li><hr class="dropdown-divider"></li>

                                    <li>

                                        <a
                                            class="dropdown-item text-danger"
                                            href="javascript:void(0)"
                                            onclick="bankView.funx.voidTransaction(${row.bank_transaction_id})">

                                            <i class="fas fa-ban me-2"></i>

                                            Void Transaction

                                        </a>

                                    </li>
                                `;
                            }

                            return `
                                <div class="dropdown">

                                    <button
                                        class="btn btn-sm btn-light border"
                                        data-bs-toggle="dropdown">

                                        <i class="fas fa-ellipsis-v"></i>

                                    </button>

                                    <ul class="dropdown-menu dropdown-menu-end">

                                        ${actions}

                                    </ul>

                                </div>
                            `;

                        }
                    }

                ]

            });

        },
        loadDashboard: function () {

            jsAddon.display.ajaxRequest({

                url: `${bankTranactionDetailsDashboardApi}/${bankView.bankAccountId}`,
                type: "GET",
                dataType: "json"

            }).then(function (response) {

                if (response.isError) return;

                const d = response.data;
                $("#currentBalance").text(jsAddon.display.money(d.current_balance));
                $("#openingBalance").text(jsAddon.display.money(d.opening_balance));
                $("#totalDeposits").text(jsAddon.display.money(d.total_deposits));
                $("#totalWithdrawals").text(jsAddon.display.money(d.total_withdrawals));
                $("#totalTransfers").text(jsAddon.display.money(d.total_transfers));
                $("#totalTransactions").text(d.total_transactions);
                $("#lastTransactionDate").text(d.last_transaction_date ?? "-");
                $("#accountType").text(d.account_type ?? "-");

            });

        },
        loadSummary: function () {

            jsAddon.display.ajaxRequest({

                url:
                    bankSummaryApi +
                    "?bank_account_id=" +
                    bankView.bankAccountId,

                type: "GET",

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    return;

                }

                const summary =
                    response.data;

                $("#totalDeposits").text(

                    jsAddon.display.money(
                        summary.total_deposits ?? 0
                    )

                );

                $("#totalWithdrawals").text(

                    jsAddon.display.money(
                        summary.total_withdrawals ?? 0
                    )

                );

                $("#totalTransactions").text(

                    summary.total_transactions ?? 0

                );

                $("#lastTransactionDate").text(

                    summary.last_transaction ??
                    "-"

                );

            });

        },

        refresh: function () {

            bankView.funx.loadAccountDetails();

            bankView.funx.loadSummary();

            bankView.transactionTable.ajax.reload(
                null,
                false
            );

        },

        exportTransactions: function () {

            window.open(

                bankExportApi +

                "?bank_account_id=" +

                bankView.bankAccountId +

                "&date_from=" +

                $("#filterDateFrom").val() +

                "&date_to=" +

                $("#filterDateTo").val() +

                "&transaction_type=" +

                $("#filterTransactionType").val(),

                "_blank"

            );

        },
        openTransactionForm:function(type, transaction = null){

            const isEdit = transaction !== null;

            let title = "";
            let buttonClass = "";
            let buttonText = "";

            switch(type){

            case "DEPOSIT":

                title = isEdit ? "Edit Deposit" : "Deposit Funds";
                buttonClass = "#198754";
                buttonText = isEdit ? "Update" : "Deposit";

            break;

            case "WITHDRAWAL":

                title = isEdit ? "Edit Withdrawal" : "Withdraw Funds";
                buttonClass = "#dc3545";
                buttonText = isEdit ? "Update" : "Withdraw";

            break;

            case "TRANSFER":

                title = isEdit ? "Edit Transfer" : "Transfer Funds";
                buttonClass = "#0d6efd";
                buttonText = isEdit ? "Update" : "Transfer";

            break;

        }

            Swal.fire({

                title:title,

                width:700,

                confirmButtonColor:buttonClass,

                confirmButtonText:buttonText,

                showCancelButton:true,

                html:`

                    <div class="container-fluid text-start">

                        <div class="row">

                            <div class="col-md-6 mb-3">

                                <label class="form-label">

                                    Date

                                </label>

                                <input
                                    type="datetime-local"
                                    id="swal_transaction_date"
                                    class="form-control"
                                    value="${
                                        transaction
                                            ? moment(transaction.transaction_date).format('YYYY-MM-DDTHH:mm:ss')
                                            : moment().format('YYYY-MM-DDTHH:mm:ss')
                                    }">

                            </div>

                            <div class="col-md-6 mb-3">

                                <label class="form-label">

                                    Amount

                                </label>

                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    id="swal_amount"
                                    class="form-control"
                                    value="${transaction ? transaction.amount : ""}">

                            </div>

                            

                            <div class="col-md-12 mb-3">

                                <label class="form-label">

                                    Check No.

                                </label>

                                <input
                                    id="swal_check_no"
                                    class="form-control"
                                    value="${transaction ? transaction.check_no ?? "" : ""}">

                            </div>

                            ${type === "TRANSFER" ? `

                                <div class="col-md-6 mb-3">

                                    <label class="form-label">

                                        Transfer Type

                                    </label>

                                    <select
                                        id="swal_transfer_type"
                                        class="form-select">

                                        <option
                                            value="INTERNAL"
                                            ${transaction?.transfer_type === "INTERNAL" ? "selected" : ""}>

                                            Registered Bank Account

                                        </option>

                                        <option
                                            value="EXTERNAL"
                                            ${transaction?.transfer_type === "EXTERNAL" ? "selected" : ""}>

                                            Other Bank

                                        </option>

                                    </select>

                                </div>

                                <div
                                    class="col-md-6 mb-3"
                                    id="internalTransferDiv">

                                    <label class="form-label">

                                        Destination Account

                                    </label>

                                    <select
                                        id="swal_destination_bank_account_id"
                                        class="form-select"
                                        style="width:100%">

                                    </select>

                                </div>

                                <div
                                    id="externalTransferDiv"
                                    style="display:none;" class="row">

                                    <div class="col-md-4 mb-3">

                                        <label class="form-label">

                                            Bank Name

                                        </label>

                                        <input
                                            id="swal_destination_bank_name"
                                            class="form-control"
                                            value="${transaction ? transaction.destination_bank_name ?? "" : ""}">

                                    </div>

                                    <div class="col-md-4 mb-3">

                                        <label class="form-label">

                                            Account Name

                                        </label>

                                        <input
                                            id="swal_destination_account_name"
                                            class="form-control"
                                            value="${transaction ? transaction.destination_account_name ?? "" : ""}">

                                    </div>

                                    <div class="col-md-4 mb-3">

                                        <label class="form-label">

                                            Account Number

                                        </label>

                                        <input
                                            id="swal_destination_account_number"
                                            class="form-control"
                                            value="${transaction ? transaction.destination_account_number ?? "" : ""}">

                                    </div>

                                </div>

                            ` : ""}

                            <div class="col-md-12">

                                <label class="form-label">

                                    Description

                                </label>

                                <textarea
                                id="swal_description"
                                class="form-control"
                                rows="3">${transaction ? transaction.description ?? "" : ""}</textarea>

                            </div>

                        </div>

                    </div>

                `,

                preConfirm:function(){

                    return{

                        bank_account_id:
                            bankView.bankAccountId,

                         transfer_type:
                        type === "TRANSFER"
                            ? $("#swal_transfer_type").val()
                            : null,

                        destination_bank_account_id:
                            type === "TRANSFER"
                                ? $("#swal_destination_bank_account_id").val()
                                : null,

                        destination_bank_name:
                            type === "TRANSFER"
                                ? $("#swal_destination_bank_name").val()
                                : null,

                        destination_account_name:
                            type === "TRANSFER"
                                ? $("#swal_destination_account_name").val()
                                : null,

                        destination_account_number:
                            type === "TRANSFER"
                                ? $("#swal_destination_account_number").val()
                                : null,

                        transaction_type:
                            type,

                        transaction_date:
                            $("#swal_transaction_date").val(),

                        amount:
                            $("#swal_amount").val(),

                        // reference_no:
                        //     $("#swal_reference_no").val(),

                        check_no:
                            $("#swal_check_no").val(),

                        description:
                            $("#swal_description").val()

                    };

                },
                didOpen: function () {

               

                    if (type === "TRANSFER") {

                        $("#swal_destination_bank_account_id").select2({
                            theme: "bootstrap-5",
                            dropdownParent: $(".swal2-container"),
                            allowClear: true,
                            width: "100%"
                        });

                        bankView.funx.loadDestinationAccounts().then(function () {

                            if (transaction) {

                                $("#swal_destination_bank_account_id")
                                    .val(transaction.destination_bank_account_id)
                                    .trigger("change");

                            }

                        });

                        $("#swal_transfer_type").on("change", function () {

                            if ($(this).val() === "INTERNAL") {

                                $("#internalTransferDiv").show();
                                $("#externalTransferDiv").hide();

                            } else {

                                $("#internalTransferDiv").hide();
                                $("#externalTransferDiv").show();

                            }

                        });

                    }

                    if (transaction) {

                        $("#swal_transfer_type")
                            .val(transaction.transfer_type);

                        if (transaction.transfer_type === "INTERNAL") {

                            $("#internalTransferDiv").show();
                            $("#externalTransferDiv").hide();

                        } else {

                            $("#internalTransferDiv").hide();
                            $("#externalTransferDiv").show();

                        }

                    }

                }

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

               if (transaction) {

                    result.value.bank_transaction_id = transaction.bank_transaction_id;

                    bankView.funx.updateTransaction(result.value);

                } else {

                    bankView.funx.saveTransaction(result.value);

                }

            });

        },
        saveTransaction:function(data){

            jsAddon.display.ajaxRequest({

                url:bankTransactionsApi,

                type:"POST",

                payload:data,

                dataType:"json"

            }).then(function(response){

                if(response.isError){

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                Swal.fire({

                    icon:"success",

                    title:"Success",

                    text:response.message

                });

                bankView.funx.loadAccountDetails();

                bankView.funx.loadSummary();

                bankView.funx.loadTransactions();

            });

        },
        loadDestinationAccounts: function () {

            jsAddon.display.ajaxRequest({

                url: bankAccountAllApi,

                type: "GET",
                dataType: "json"

            }).then(function (response) {

                let html = `
                    <option value="">
                        Select Destination Account
                    </option>
                `;

                response.data.forEach(function (account) {

                    // Don't allow transfer to the same account
                    if (parseInt(account.bank_account_id) === parseInt(bankView.bankAccountId)) {
                        return;
                    }

                    html += `
                        <option value="${account.bank_account_id}">
                            ${account.bank_name}
                            - ${account.account_name}
                            (${account.account_number})
                        </option>
                    `;

                });

                $("#swal_destination_bank_account_id")
                    .html(html)
                    .trigger("change");

            });

        },
        viewTransaction:function (transactionId) {

            jsAddon.display.ajaxRequest({

                url: `${bankTranactionDetailsApi}/${transactionId}`,

                type: "GET"

            }).then(function (response) {

                const t = response.data;

                Swal.fire({

                    title: "Transaction Details",

                    width: 700,

                    html: `
                        <table class="table table-bordered table-sm text-start">
                            <tr>
                                <th width="35%">Transaction Ref</th>
                                <td>${t.transaction_ref}</td>
                            </tr>
                            <tr>
                                <th>Reference No</th>
                                <td>${t.reference_no ?? "-"}</td>
                            </tr>
                            <tr>
                                <th>Transaction Type</th>
                                <td>${t.transaction_type}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>${t.transaction_date}</td>
                            </tr>
                            <tr>
                                <th>Bank Account</th>
                                <td>${t.account_name}</td>
                            </tr>
                            <tr>
                                <th>Amount</th>
                                <td>₱ ${parseFloat(t.amount).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>${t.description ?? "-"}</td>
                            </tr>
                        </table>
                    `,

                    showCancelButton: true,

                    confirmButtonText: "Update",

                    cancelButtonText: "Close",

                    showDenyButton: true,

                    denyButtonText: "Void"

                }).then((result) => {

                    if (result.isConfirmed) {

                        bankView.funx.editTransaction(transactionId);

                    } else if (result.isDenied) {

                        bankView.funx.voidTransaction(transactionId);

                    }

                });

            });

        },
        editTransaction: function (transactionId) {

            jsAddon.display.ajaxRequest({

                url: `${bankTranactionDetailsApi}/${transactionId}`,
                type: "GET",
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

                const transaction = response.data;

                let type = transaction.transaction_type;

                // Convert database values back to the form type
                if (type === "TRANSFER_OUT" || type === "TRANSFER_IN") {
                    type = "TRANSFER";
                }

                bankView.funx.openTransactionForm(
                    type,
                    transaction
                );

            });

        },
        updateTransaction: function(data){

            jsAddon.display.ajaxRequest({

                url:`${bankTransactionsApi}/${data.bank_transaction_id}`,

                type: "PUT",

                payload: JSON.stringify(data),

                dataType: "json"

            }).then(function(response){

                Swal.fire({

                    icon: response.isError ? "error" : "success",

                    title: response.isError ? "Error" : "Success",

                    text: response.message

                });

                if(!response.isError){

                    bankView.table.ajax.reload(null, false);

                }

            });

        },
        editBankAccount: function (bankAccountId) {

            if (!bankView.account) {

                Swal.fire(
                    "Error",
                    "Bank account not found.",
                    "error"
                );

                return;

            }

            bankView.funx.openBankAccountForm(bankView.account);

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

                    bankView.banks.forEach(function (bank) {

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
                                bankView.banks.find(
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

                    bankView.funx.updateBankAccount(
                        result.value
                    );

                }

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

                      bankView.funx.loadAccountDetails();;

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
        voidTransaction: function (bankTransactionId) {

            Swal.fire({

                title: "Void Transaction?",

                html: `

                    <div class="text-start">

                        <div class="alert alert-warning">

                            <i class="fas fa-exclamation-triangle me-2"></i>

                            This transaction will be marked as VOID.

                            <br><br>

                            Account balances will be recalculated automatically.

                        </div>

                        <label class="form-label">

                            Reason

                        </label>

                        <textarea
                            id="swal_void_reason"
                            class="form-control"
                            rows="3"
                            placeholder="Reason for voiding..."></textarea>

                    </div>

                `,

                icon: "warning",

                showCancelButton: true,

                confirmButtonColor: "#dc3545",

                confirmButtonText: "Void Transaction",

                preConfirm: function () {

                    const reason = $("#swal_void_reason").val().trim();

                    if (!reason) {

                        Swal.showValidationMessage(
                            "Please provide a reason."
                        );

                        return false;

                    }

                    return {

                        reason: reason

                    };

                }

            }).then(function (result) {

                if (!result.isConfirmed) {

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: `${voidBankAccountTransactionApi}/${bankTransactionId}`,

                    type: "DELETE",

                    dataType: "json",

                    payload: result.value

                })
                .then(function (response) {

                    Swal.fire(

                        "Success",

                        response.message,

                        "success"

                    ).then(function () {

                        bankView.funx.loadDashboard();

                        bankView.funx.loadAccountDetails();

                        bankView.funx.loadTransactions();

                    });

                })
                .catch(function (error) {

                    Swal.fire(

                        "Error",

                        error.message,

                        "error"

                    );

                });

            });

        },

    }

};

$(function () {

    bankView.funx.initialize();

    $("#btnExportTransactions").on(

        "click",

        function () {

            bankView.funx.exportTransactions();

        }

    );

    
   

});