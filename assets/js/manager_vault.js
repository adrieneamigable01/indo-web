let managerVault = {

    table: null,

    transactions: [],

    summary: {},

    init:function(){

        managerVault.funx.loadSummary();

        managerVault.funx.loadTransactions();

        managerVault.funx.bindEvents();

    },

    funx:{

        /*
        |--------------------------------------------------------------------------
        | EVENTS
        |--------------------------------------------------------------------------
        */

        bindEvents:function(){

            $("#btnRefresh")

            .off("click")

            .on(

                "click",

                function(){

                    managerVault.funx
                        .loadSummary();

                    managerVault.funx
                        .loadTransactions();

                }

            );

            $("#filterType")

            .off("change")

            .on(

                "change",

                function(){

                    managerVault.funx
                        .filterTable();

                }

            );

            $("#filterCashier")

            .off("change")

            .on(

                "change",

                function(){

                    managerVault.funx
                        .filterTable();

                }

            );

            $("#dateFrom,#dateTo")

            .off("change")

            .on(

                "change",

                function(){

                    managerVault.funx
                        .loadTransactions();

                }

            );

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD SUMMARY
        |--------------------------------------------------------------------------
        */

        loadSummary:function(){

            jsAddon.display.ajaxRequest({

                url:managerVaultSummaryApi,

                type:"GET",

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

                managerVault.summary =
                    response.data;

                managerVault.funx
                    .renderSummary();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        renderSummary:function(){

            $("#currentBalance")

            .text(

                "₱"+

                parseFloat(

                    managerVault.summary.current_balance || 0

                ).toLocaleString(

                    undefined,

                    {

                        minimumFractionDigits:2

                    }

                )

            );

            $("#cashInToday")

            .text(

                "₱"+

                parseFloat(

                    managerVault.summary.cash_in_today || 0

                ).toLocaleString(

                    undefined,

                    {

                        minimumFractionDigits:2

                    }

                )

            );

            $("#cashOutToday")

            .text(

                "₱"+

                parseFloat(

                    managerVault.summary.cash_out_today || 0

                ).toLocaleString(

                    undefined,

                    {

                        minimumFractionDigits:2

                    }

                )

            );

            $("#transferToday")

            .text(

                "₱"+

                parseFloat(

                    managerVault.summary.transfer_today || 0

                ).toLocaleString(

                    undefined,

                    {

                        minimumFractionDigits:2

                    }

                )

            );

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        loadTransactions:function(){

            jsAddon.display.ajaxRequest({

                url:managerVaultTransactionsApi,

                type:"GET",

                payload:{

                    date_from:
                        $("#dateFrom").val(),

                    date_to:
                        $("#dateTo").val()

                },

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

                managerVault.transactions =
                    response.data;

                managerVault.funx
                    .renderTable();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | TABLE
        |--------------------------------------------------------------------------
        */

        renderTable:function(){

            let html = "";

            $.each(

                managerVault.transactions,

                function(_,row){

                    let cashIn = "";

                    let cashOut = "";

                    if(

                        row.transaction_type == "CASH_IN"

                    ){

                        cashIn =

                            "₱"+

                            parseFloat(

                                row.amount

                            ).toLocaleString(

                                undefined,

                                {

                                    minimumFractionDigits:2

                                }

                            );

                    }
                    else{

                        cashOut =

                            "₱"+

                            parseFloat(

                                row.amount

                            ).toLocaleString(

                                undefined,

                                {

                                    minimumFractionDigits:2

                                }

                            );

                    }

                    html += `

                        <tr>

                            <td>

                                ${row.created_at}

                            </td>

                            <td>

                                ${row.transaction_type}

                            </td>

                            <td>

                                ${row.reference_no ?? ""}

                            </td>

                            <td>

                                ${row.cashier_name ?? "-"}

                            </td>

                            <td class="text-success">

                                ${cashIn}

                            </td>

                            <td class="text-danger">

                                ${cashOut}

                            </td>

                            <td>

                                ₱${parseFloat(

                                    row.balance_after || 0

                                ).toLocaleString(

                                    undefined,

                                    {

                                        minimumFractionDigits:2

                                    }

                                )}

                            </td>

                            <td>

                                ${row.remarks ?? ""}

                            </td>

                            <td>

                                ${managerVault.funx.actionButtons(row)}

                            </td>

                        </tr>

                    `;

                }

            );

            if(

                $.fn.DataTable.isDataTable(

                    "#vaultTable"

                )

            ){

                $("#vaultTable")

                .DataTable()

                .destroy();

            }

            $("#vaultTable tbody")

            .html(html);

            managerVault.table =

            $("#vaultTable")

            .DataTable({

                responsive:true,

                pageLength:10,

                ordering:true,

                searching:true,

                destroy:true,

                lengthMenu:[

                    [10,25,50,100],

                    [10,25,50,100]

                ]

            });

        },

        /*
        |--------------------------------------------------------------------------
        | FILTER TABLE
        |--------------------------------------------------------------------------
        */

        filterTable:function(){

            let type =

                $("#filterType")

                .val();

            let cashier =

                $("#filterCashier option:selected")

                .text();

            if(type==""){

                managerVault.table

                .column(1)

                .search("")

                .draw();

            }
            else{

                managerVault.table

                .column(1)

                .search(type)

                .draw();

            }

            if(

                cashier == "All Cashiers"

            ){

                cashier = "";

            }

            managerVault.table

            .column(3)

            .search(cashier)

            .draw();

        },

        /*
        |--------------------------------------------------------------------------
        | ACTION BUTTONS
        |--------------------------------------------------------------------------
        */

        actionButtons:function(row){

            return `

                <button

                    class="btn btn-sm btn-primary btn-view"

                    data-id="${row.manager_transaction_id}">

                    <i class="bi bi-eye"></i>

                </button>

                <button

                    class="btn btn-sm btn-danger btn-delete"

                    data-id="${row.manager_transaction_id}">

                    <i class="bi bi-trash"></i>

                </button>

            `;

        },
        /*
        |--------------------------------------------------------------------------
        | SHOW CASH IN
        |--------------------------------------------------------------------------
        */

        showCashIn:function(){

            $("#cashInAmount")
            .val("");

            $("#cashInReference")
            .val("");

            $("#cashInRemarks")
            .val("");

            new bootstrap.Modal(

                document.getElementById(
                    "cashInModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE CASH IN
        |--------------------------------------------------------------------------
        */

        saveCashIn:function(){

            let amount =
                parseFloat(
                    $("#cashInAmount").val()
                );

            if(

                isNaN(amount)

                ||

                amount <= 0

            ){

                Swal.fire(

                    "Warning",

                    "Please enter a valid amount.",

                    "warning"

                );

                return;

            }

            let payload = {

                amount:
                    amount,

                reference_no:
                    $("#cashInReference").val(),

                remarks:
                    $("#cashInRemarks").val()

            };

            Swal.fire({

                title:"Cash In?",

                text:"Confirm cash in transaction.",

                icon:"question",

                showCancelButton:true,

                confirmButtonText:"Save",

                confirmButtonColor:"#198754"

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:managerVaultCashInApi,

                    type:"POST",

                    payload:payload,

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

                    bootstrap.Modal
                    .getInstance(

                        document.getElementById(
                            "cashInModal"
                        )

                    ).hide();

                    Swal.fire({

                        icon:"success",

                        title:"Cash In Saved",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVault.funx
                        .loadSummary();

                    managerVault.funx
                        .loadTransactions();

                });

            });

        },


    },
    /*
    |--------------------------------------------------------------------------
    | SHOW CASH OUT
    |--------------------------------------------------------------------------
    */

    showCashOut:function(){

        $("#cashOutAmount")
        .val("");

        $("#cashOutCategory")
        .val("");

        $("#cashOutReference")
        .val("");

        $("#cashOutRemarks")
        .val("");

        let today = new Date();

        $("#cashOutDate")
        .val(
            today.toISOString().split("T")[0]
        );

        new bootstrap.Modal(

            document.getElementById(
                "cashOutModal"
            )

        ).show();

    },

    /*
    |--------------------------------------------------------------------------
    | SAVE CASH OUT
    |--------------------------------------------------------------------------
    */

    saveCashOut:function(){

        let amount = parseFloat(
            $("#cashOutAmount").val()
        );

        if(
            isNaN(amount) ||
            amount <= 0
        ){

            Swal.fire(
                "Warning",
                "Please enter a valid amount.",
                "warning"
            );

            return;

        }

        if(
            $("#cashOutCategory").val() == ""
        ){

            Swal.fire(
                "Warning",
                "Please select a category.",
                "warning"
            );

            return;

        }

        let currentBalance =
            parseFloat(
                managerVault.summary.current_balance || 0
            );

        if(
            amount > currentBalance
        ){

            Swal.fire(
                "Insufficient Fund",
                "Cash out amount exceeds the current manager vault balance.",
                "warning"
            );

            return;

        }

        let payload = {

            amount:
                amount,

            category:
                $("#cashOutCategory").val(),

            reference_no:
                $("#cashOutReference").val(),

            transaction_date:
                $("#cashOutDate").val(),

            remarks:
                $("#cashOutRemarks").val()

        };

        Swal.fire({

            title:"Cash Out?",

            html:`

                <div class="text-start">

                    <strong>Category:</strong>

                    ${payload.category}

                    <br>

                    <strong>Amount:</strong>

                    ₱${amount.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )}

                    <br>

                    <strong>Remaining Balance:</strong>

                    ₱${(
                        currentBalance -
                        amount
                    ).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )}

                </div>

            `,

            icon:"question",

            showCancelButton:true,

            confirmButtonColor:"#dc3545",

            confirmButtonText:"Cash Out"

        }).then(function(result){

            if(!result.isConfirmed)
                return;

            jsAddon.display.ajaxRequest({

                url:managerVaultCashOutApi,

                type:"POST",

                payload:payload,

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

                bootstrap.Modal
                .getInstance(

                    document.getElementById(
                        "cashOutModal"
                    )

                ).hide();

                Swal.fire({

                    icon:"success",

                    title:"Cash Out Saved",

                    timer:1500,

                    showConfirmButton:false

                });

                managerVault.funx
                    .loadSummary();

                managerVault.funx
                    .loadTransactions();

            });

        });

    },
    /*
    |--------------------------------------------------------------------------
    | SHOW TRANSFER MODAL
    |--------------------------------------------------------------------------
    */

    showTransfer:function(){

        $("#transferCashier").val("");

        $("#transferAmount").val("");

        $("#transferReference").val("");

        $("#transferRemarks").val("");

        let today = new Date();

        $("#transferDate").val(

            today.toISOString().split("T")[0]

        );

        let balance =

            parseFloat(

                managerVault.summary.current_balance || 0

            );

        $("#managerCurrentBalance").text(

            "₱"+

            balance.toLocaleString(

                undefined,

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            )

        );

        $("#managerRemainingBalance").text(

            "₱"+

            balance.toLocaleString(

                undefined,

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            )

        );

        managerVault.funx.loadCashiers();

        new bootstrap.Modal(

            document.getElementById(

                "transferModal"

            )

        ).show();

    },

    /*
    |--------------------------------------------------------------------------
    | LOAD CASHIERS
    |--------------------------------------------------------------------------
    */

    loadCashiers:function(){

        jsAddon.display.ajaxRequest({

            url:cashierApi,

            type:"GET",

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

            let html = `

                <option value="">

                    Select Cashier

                </option>

            `;

            $.each(

                response.data,

                function(_,cashier){

                    html += `

                        <option

                            value="${cashier.user_id}">

                            ${cashier.full_name}

                        </option>

                    `;

                }

            );

            $("#transferCashier").html(

                html

            );

        });

    },

    /*
    |--------------------------------------------------------------------------
    | COMPUTE REMAINING BALANCE
    |--------------------------------------------------------------------------
    */

    computeTransferBalance:function(){

        let current =

            parseFloat(

                managerVault.summary.current_balance || 0

            );

        let amount =

            parseFloat(

                $("#transferAmount").val()

            ) || 0;

        let remaining =

            current - amount;

        if(

            remaining < 0

        ){

            remaining = 0;

        }

        $("#managerRemainingBalance")

        .text(

            "₱"+

            remaining.toLocaleString(

                undefined,

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            )

        );

        if(

            amount > current

        ){

            $("#managerRemainingBalance")

            .removeClass(

                "text-success"

            )

            .addClass(

                "text-danger"

            );

        }
        else{

            $("#managerRemainingBalance")

            .removeClass(

                "text-danger"

            )

            .addClass(

                "text-success"

            );

        }

    },

    /*
    |--------------------------------------------------------------------------
    | SAVE TRANSFER
    |--------------------------------------------------------------------------
    */

    saveTransfer:function(){

        let cashierId =

            $("#transferCashier")
            .val();

        if(

            cashierId == ""

        ){

            Swal.fire(

                "Warning",

                "Please select a cashier.",

                "warning"

            );

            return;

        }

        let amount =

            parseFloat(

                $("#transferAmount")
                .val()

            );

        if(

            isNaN(amount)

            ||

            amount <= 0

        ){

            Swal.fire(

                "Warning",

                "Please enter a valid transfer amount.",

                "warning"

            );

            return;

        }

        let currentBalance =

            parseFloat(

                managerVault.summary.current_balance || 0

            );

        if(

            amount >

            currentBalance

        ){

            Swal.fire(

                "Insufficient Balance",

                "Transfer amount exceeds the current manager vault balance.",

                "warning"

            );

            return;

        }

        let payload = {

            cashier_id:

                cashierId,

            transfer_date:

                $("#transferDate")
                .val(),

            amount:

                amount,

            reference_no:

                $("#transferReference")
                .val(),

            remarks:

                $("#transferRemarks")
                .val()

        };

        Swal.fire({

            title:

                "Transfer Fund?",

            html:`

                <div class="text-start">

                    <div class="mb-2">

                        <strong>

                            Cashier

                        </strong>

                        <br>

                        ${$("#transferCashier option:selected").text()}

                    </div>

                    <div class="mb-2">

                        <strong>

                            Amount

                        </strong>

                        <br>

                        ₱${amount.toLocaleString(

                            undefined,

                            {

                                minimumFractionDigits:2,

                                maximumFractionDigits:2

                            }

                        )}

                    </div>

                    <div class="mb-2">

                        <strong>

                            Current Balance

                        </strong>

                        <br>

                        ₱${currentBalance.toLocaleString(

                            undefined,

                            {

                                minimumFractionDigits:2,

                                maximumFractionDigits:2

                            }

                        )}

                    </div>

                    <div>

                        <strong>

                            Remaining Balance

                        </strong>

                        <br>

                        ₱${(

                            currentBalance -

                            amount

                        ).toLocaleString(

                            undefined,

                            {

                                minimumFractionDigits:2,

                                maximumFractionDigits:2

                            }

                        )}

                    </div>

                </div>

            `,

            icon:

                "question",

            showCancelButton:true,

            confirmButtonColor:"#f59e0b",

            confirmButtonText:

                "Transfer",

            cancelButtonText:

                "Cancel"

        }).then(function(result){

            if(

                !result.isConfirmed

            ){

                return;

            }
            
            /*
            |--------------------------------------------------------------------------
            | TRANSFER AJAX
            |--------------------------------------------------------------------------
            */

            Swal.fire({

                title:"Processing Transfer...",

                allowOutsideClick:false,

                didOpen(){

                    Swal.showLoading();

                }

            });

            jsAddon.display.ajaxRequest({

                url:managerVaultTransferApi,

                type:"POST",

                payload:payload,

                dataType:"json"

            })

            .then(function(response){

                Swal.close();

                if(

                    response.isError

                ){

                    Swal.fire(

                        "Transfer Failed",

                        response.message,

                        "error"

                    );

                    return;

                }

                Swal.fire({

                    icon:"success",

                    title:"Transfer Successful",

                    text:"Cash has been transferred successfully.",

                    timer:1800,

                    showConfirmButton:false

                });

                    /*
                    |--------------------------------------------------------------------------
                    | SUCCESS
                    |--------------------------------------------------------------------------
                    */

                    bootstrap.Modal

                    .getInstance(

                        document.getElementById(

                            "transferModal"

                        )

                    )

                    .hide();

                    /*
                    |--------------------------------------------------------------------------
                    | RESET FORM
                    |--------------------------------------------------------------------------
                    */

                    $("#transferCashier")

                    .val("");

                    $("#transferAmount")

                    .val("");

                    $("#transferReference")

                    .val("");

                    $("#transferRemarks")

                    .val("");

                    $("#managerRemainingBalance")

                    .text("₱0.00")

                    .removeClass(

                        "text-danger"

                    )

                    .addClass(

                        "text-success"

                    );

                    $("#btnTransferFund")

                    .prop(

                        "disabled",

                        true

                    );

                    /*
                    |--------------------------------------------------------------------------
                    | REFRESH DASHBOARD
                    |--------------------------------------------------------------------------
                    */

                    managerVault.funx

                    .loadSummary();

                    managerVault.funx

                    .loadTransactions();

                    managerVault.funx

                    .loadCashiers();

                })

                .catch(function(xhr){

                    Swal.close();

                    Swal.fire(

                        "Error",

                        "Unable to process transfer.",

                        "error"

                    );

                });

                }); // SweetAlert

            }, // saveTransfer
            /*
            |--------------------------------------------------------------------------
            | VIEW TRANSACTION
            |--------------------------------------------------------------------------
            */
            viewTransaction:function(

                managerTransactionId

            ){

                let row =

                    managerVault.transactions.find(

                        x =>

                            x.manager_transaction_id ==

                            managerTransactionId

                    );

                if(!row){

                    Swal.fire(

                        "Error",

                        "Transaction not found.",

                        "error"

                    );

                    return;

                }

                /*
                |--------------------------------------------------------------------------
                | MANAGER TRANSACTION
                |--------------------------------------------------------------------------
                */

                $("#viewReferenceNo")

                    .text(

                        row.reference_no || "-"

                    );

                $("#viewTransactionType")

                    .html(

                        managerVault.funx.transactionBadge(

                            row.transaction_type

                        )

                    );

                $("#viewCashier")

                    .text(

                        row.cashier_name || "-"

                    );

                $("#viewBusinessDate")

                    .text(

                        row.business_date || "-"

                    );

                $("#viewCreatedBy")

                    .text(

                        row.created_by_name || "-"

                    );

                $("#viewApprovedBy")

                    .text(

                        row.approved_by_name || "-"

                    );

                $("#viewStatus")

                    .html(

                        managerVault.funx.statusBadge(

                            row.status

                        )

                    );

                /*
                |--------------------------------------------------------------------------
                | CASH DETAILS
                |--------------------------------------------------------------------------
                */

                $("#viewAmount")

                    .text(

                        managerVault.funx.money(

                            row.amount

                        )

                    );

                $("#viewBalanceBefore")

                    .text(

                        managerVault.funx.money(

                            row.balance_before

                        )

                    );

                $("#viewBalanceAfter")

                    .text(

                        managerVault.funx.money(

                            row.balance_after

                        )

                    );

                $("#viewExpectedCash")

                    .text(

                        managerVault.funx.money(

                            row.expected_cash

                        )

                    );

                $("#viewActualCash")

                    .text(

                        managerVault.funx.money(

                            row.actual_cash

                        )

                    );

                $("#viewReturnedCash")

                    .text(

                        managerVault.funx.money(

                            row.returned_amount

                        )

                    );

                $("#viewVariance")

                    .text(

                        managerVault.funx.money(

                            row.variance

                        )

                    );

                /*
                |--------------------------------------------------------------------------
                | REMARKS
                |--------------------------------------------------------------------------
                */

                $("#viewRemarks")

                    .text(

                        row.remarks || "-"

                    );

                $("#viewDailyCloseRemarks")

                    .text(

                        row.daily_close_remarks || "-"

                    );

                /*
                |--------------------------------------------------------------------------
                | DATES
                |--------------------------------------------------------------------------
                */

                $("#viewCreatedAt")

                    .text(

                        row.created_at || "-"

                    );

                $("#viewClosedAt")

                    .text(

                        row.closed_at || "-"

                    );

                $("#viewApprovedAt")

                    .text(

                        row.approved_at || "-"

                    );

                /*
                |--------------------------------------------------------------------------
                | SHOW MODAL
                |--------------------------------------------------------------------------
                */

                $("#viewTransactionModal")

                    .modal("show");

            },
            

};

$(function(){

    managerVault.init();

    /*
    |--------------------------------------------------------------------------
    | CASH IN BUTTON
    |--------------------------------------------------------------------------
    */

    $("#btnCashIn")

    .off("click")

    .on(

        "click",

        function(){

            managerVault.funx
                .showCashIn();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | SAVE CASH IN
    |--------------------------------------------------------------------------
    */

    $("#btnSaveCashIn")

    .off("click")

    .on(

        "click",

        function(){

            managerVault.funx
                .saveCashIn();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | CASH OUT BUTTON
    |--------------------------------------------------------------------------
    */

    $("#btnCashOut")

    .off("click")

    .on(

        "click",

        function(){

            managerVault.funx
                .showCashOut();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | SAVE CASH OUT
    |--------------------------------------------------------------------------
    */

    $("#btnSaveCashOut")

    .off("click")

    .on(

        "click",

        function(){

            managerVault.funx
                .saveCashOut();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | OPEN TRANSFER MODAL
    |--------------------------------------------------------------------------
    */

    $("#btnTransfer")

    .off("click")

    .on(

        "click",

        function(){

            managerVault.funx
                .showTransfer();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | COMPUTE REMAINING BALANCE
    |--------------------------------------------------------------------------
    */

    $("#transferAmount")

    .off("keyup change")

    .on(

        "keyup change",

        function(){

            managerVault.funx
                .computeTransferBalance();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | CASHIER CHANGE
    |--------------------------------------------------------------------------
    */

    $("#transferCashier")

    .off("change")

    .on(

        "change",

        function(){

            managerVault.funx
                .computeTransferBalance();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | ENABLE / DISABLE TRANSFER BUTTON
    |--------------------------------------------------------------------------
    */

    $("#transferAmount")

    .off("keyup.transfer")

    .on(

        "keyup.transfer",

        function(){

            let amount =

                parseFloat(

                    $(this).val()

                ) || 0;

            let balance =

                parseFloat(

                    managerVault.summary.current_balance || 0

                );

            if(

                amount <= 0 ||

                amount > balance ||

                $("#transferCashier").val() == ""

            ){

                $("#btnTransferFund")

                .prop(

                    "disabled",

                    true

                );

            }
            else{

                $("#btnTransferFund")

                .prop(

                    "disabled",

                    false

                );

            }

        }

    );

    /*
    |--------------------------------------------------------------------------
    | CASHIER SELECTION
    |--------------------------------------------------------------------------
    */

    $("#transferCashier")

    .off("change.transfer")

    .on(

        "change.transfer",

        function(){

            let amount =

                parseFloat(

                    $("#transferAmount").val()

                ) || 0;

            let balance =

                parseFloat(

                    managerVault.summary.current_balance || 0

                );

            if(

                amount <= 0 ||

                amount > balance ||

                $(this).val() == ""

            ){

                $("#btnTransferFund")

                .prop(

                    "disabled",

                    true

                );

            }
            else{

                $("#btnTransferFund")

                .prop(

                    "disabled",

                    false

                );

            }

        }

    );

    /*
    |--------------------------------------------------------------------------
    | RESET WHEN MODAL CLOSES
    |--------------------------------------------------------------------------
    */

    $("#transferModal")

    .on(

        "hidden.bs.modal",

        function(){

            $("#transferCashier").val("");

            $("#transferAmount").val("");

            $("#transferReference").val("");

            $("#transferRemarks").val("");

            $("#btnTransferFund")

            .prop(

                "disabled",

                true

            );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | SAVE TRANSFER
    |--------------------------------------------------------------------------
    */

    $("#btnTransferFund")

    .off("click")

    .on(

        "click",

        function(){

            managerVault.funx

            .saveTransfer();

        }

    );
    
    /*
    |--------------------------------------------------------------------------
    | VIEW BUTTON
    |--------------------------------------------------------------------------
    */

    $(document)

    .off(

        "click",

        ".btn-view"

    )

    .on(

        "click",

        ".btn-view",

        function(){

            managerVault.funx

            .viewTransaction(

                $(this)

                .data("id")

            );

        }

    );
});