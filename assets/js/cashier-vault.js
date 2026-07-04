"use strict";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/




// const cashierVaultTransactionApi =
//     base_url +
//     "api/cashierVault/getTransactionDetails";

// const cashierVaultDailyCloseApi =
//     base_url +
//     "api/cashierVault/dailyClose";

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

let cashierVaultPage = {

    table:null,

    transactions:{},

    dashboard:{},

    dailyCloseModal:null,

    coinsModal:null,

    init:function(){

        cashierVaultPage.dailyCloseModal =

            new bootstrap.Modal(

                document.getElementById(

                    "dailyCloseModal"

                )

            );

        cashierVaultPage.coinsModal =

            new bootstrap.Modal(

                document.getElementById(

                    "coinsModal"

                )

            );

        cashierVaultPage.funx.loadTransactions();

        cashierVaultPage.funx.loadSummary();

        cashierVaultPage.funx.events();

        cashierVaultPage.funx.autoRefresh();

        cashierVaultPage.funx.keyboardShortcut();

        cashierVaultPage.funx.sessionCheck();

    },

    funx:{

        /*
        |--------------------------------------------------------------------------
        | EVENTS
        |--------------------------------------------------------------------------
        */

        events:function(){

            /*
            |--------------------------------------------------------------------------
            | SEARCH
            |--------------------------------------------------------------------------
            */

            $("#btnSearch")

            .off("click")

            .on("click",function(){

                cashierVaultPage.table.ajax.reload();

                cashierVaultPage.funx.loadSummary();

            });

            /*
            |--------------------------------------------------------------------------
            | ENTER SEARCH
            |--------------------------------------------------------------------------
            */

            $("#txtSearch")

            .off("keypress")

            .on("keypress",function(e){

                if(

                    e.which == 13

                ){

                    cashierVaultPage.table.ajax.reload();

                    cashierVaultPage.funx.loadSummary();

                }

            });

            /*
            |--------------------------------------------------------------------------
            | FILTERS
            |--------------------------------------------------------------------------
            */

            $("#filterBusinessDate,#filterTransaction")

            .off("change")

            .on("change",function(){

                cashierVaultPage.table.ajax.reload();

                cashierVaultPage.funx.loadSummary();

            });

            /*
            |--------------------------------------------------------------------------
            | REFRESH
            |--------------------------------------------------------------------------
            */

            $("#btnRefresh")

            .off("click")

            .on("click",function(){

                cashierVaultPage.table.ajax.reload();

                cashierVaultPage.funx.loadSummary();

            });

            /*
            |--------------------------------------------------------------------------
            | DAILY CLOSE
            |--------------------------------------------------------------------------
            */

            $("#btnDailyClose")

            .off("click")

            .on("click",function(){

                cashierVaultPage.funx.showDailyClose();

            });

            /*
            |--------------------------------------------------------------------------
            | COINS
            |--------------------------------------------------------------------------
            */

            $("#btnCoins")

            .off("click")

            .on("click",function(){

                cashierVaultPage.coinsModal.show();

            });

            /*
            |--------------------------------------------------------------------------
            | SAVE COINS
            |--------------------------------------------------------------------------
            */

            $("#btnSaveCoins")

            .off("click")

            .on("click",function(){

                cashierVaultPage.coinsModal.hide();

                cashierVaultPage.funx.calculateCoins();

            });

            /*
            |--------------------------------------------------------------------------
            | SUBMIT DAILY CLOSE
            |--------------------------------------------------------------------------
            */

            $("#btnSubmitDailyClose")

            .off("click")

            .on("click",function(){

                cashierVaultPage.funx.submitDailyClose();

            });

            /*
            |--------------------------------------------------------------------------
            | VIEW
            |--------------------------------------------------------------------------
            */

            $(document)

            .off(

                "click",

                ".btnView"

            )

            .on(

                "click",

                ".btnView",

                function(){

                    cashierVaultPage.funx.viewTransaction(

                        $(this).data("id")

                    );

                }

            );

        },
                /*
        |--------------------------------------------------------------------------
        | LOAD TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        loadTransactions:function(){

            if(

                cashierVaultPage.table

            ){

                cashierVaultPage.table.destroy();

            }

            cashierVaultPage.table =

            $("#tblCashierVault")

            .DataTable({

                processing:true,

                serverSide:true,

                destroy:true,

                responsive:true,

                searching:false,

                ordering:true,

                pageLength:10,

                order:[[0,"desc"]],

                ajax:function(data,callback){

                    jsAddon.display.ajaxRequest({

                        url:cashierVaultApi,

                        type:"GET",

                        payload:{

                            draw:data.draw,

                            start:data.start,

                            length:data.length,

                            orderColumn:

                                data.columns[

                                    data.order[0].column

                                ].data,

                            orderDir:

                                data.order[0].dir,

                            business_date:

                                $("#filterBusinessDate")

                                .val(),

                            transaction_type:

                                $("#filterTransaction")

                                .val(),

                            search:

                                $("#txtSearch")

                                .val()

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

                        cashierVaultPage.transactions = {};

                        $.each(

                            response.data,

                            function(_,row){

                                cashierVaultPage.transactions[

                                    row.cashier_transaction_id

                                ] = row;

                            }

                        );

                        callback({

                            draw:

                                response.draw,

                            recordsTotal:

                                response.recordsTotal,

                            recordsFiltered:

                                response.recordsFiltered,

                            data:

                                response.data

                        });

                    });

                },

                columns:[

                    {

                        data:

                            "cashier_transaction_id"

                    },

                    {

                        data:

                            "created_at"

                    },

                    {

                        data:

                            "reference_no"

                    },

                    {

                        data:

                            "transaction_type",

                        render:function(data){

                            return cashierVaultPage.funx.transactionBadge(

                                data

                            );

                        }

                    },

                    {

                        data:

                            "amount",

                        className:

                            "text-end",

                        render:function(data){

                            return cashierVaultPage.funx.money(

                                data

                            );

                        }

                    },

                    {

                        data:

                            "balance_before",

                        className:

                            "text-end",

                        render:function(data){

                            return cashierVaultPage.funx.money(

                                data

                            );

                        }

                    },

                    {

                        data:

                            "balance_after",

                        className:

                            "text-end",

                        render:function(data){

                            return cashierVaultPage.funx.money(

                                data

                            );

                        }

                    },

                    {

                        data:

                            "created_by_name"

                    },

                    {

                        data:null,

                        orderable:false,

                        searchable:false,

                        render:function(data,type,row){

                            return cashierVaultPage.funx.actionButtons(

                                row

                            );

                        }

                    }

                ]

            });

        },

        /*
        |--------------------------------------------------------------------------
        | ACTION BUTTONS
        |--------------------------------------------------------------------------
        */

        actionButtons:function(row){

            return `

                <button

                    class="btn btn-primary btn-sm btnView"

                    data-id="${row.cashier_transaction_id}"

                    title="View">

                    <i class="bi bi-eye"></i>

                </button>

            `;

        },

        /*
        |--------------------------------------------------------------------------
        | TRANSACTION BADGE
        |--------------------------------------------------------------------------
        */

        transactionBadge:function(type){

            switch(

                String(type).toUpperCase()

            ){

                case "RECEIVED_FROM_MANAGER":

                    return `

                        <span class="badge bg-success">

                            Received

                        </span>

                    `;

                case "PAYMENT_COLLECTION":

                    return `

                        <span class="badge bg-primary">

                            Collection

                        </span>

                    `;

                case "LOAN_RELEASE":

                    return `

                        <span class="badge bg-danger">

                            Loan Release

                        </span>

                    `;

                case "EXPENSE":

                    return `

                        <span class="badge bg-warning text-dark">

                            Expense

                        </span>

                    `;

                case "RETURN TO VAULT":

                    return `

                        <span class="badge bg-info text-dark">

                            Return To Vault

                        </span>

                    `;

                case "ADJUSTMENT":

                    return `

                        <span class="badge bg-secondary">

                            Adjustment

                        </span>

                    `;

                default:

                    return `

                        <span class="badge bg-dark">

                            ${type}

                        </span>

                    `;

            }

        },

        /*
        |--------------------------------------------------------------------------
        | MONEY FORMAT
        |--------------------------------------------------------------------------
        */

        money:function(value){

            return "₱"+

                parseFloat(

                    value || 0

                )

                .toLocaleString(

                    undefined,

                    {

                        minimumFractionDigits:2,

                        maximumFractionDigits:2

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

                url:cashierVaultSummaryApi,

                type:"GET",

                payload:{

                    business_date:

                        $("#filterBusinessDate")

                        .val(),

                    transaction_type:

                        $("#filterTransaction")

                        .val(),

                    search:

                        $("#txtSearch")

                        .val()

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

                let data =

                    response.data;

                $("#cashierBalance")

                .html(

                    cashierVaultPage.funx.money(

                        data.current_balance || 0

                    )

                );

                $("#totalCashIn")

                .html(

                    cashierVaultPage.funx.money(

                        data.cash_in || 0

                    )

                );

                $("#totalCashOut")

                .html(

                    cashierVaultPage.funx.money(

                        data.cash_out || 0

                    )

                );

                $("#totalReturn")

                .html(

                    cashierVaultPage.funx.money(

                        data.return_to_manager || 0

                    )

                );

            });

        },

        /*
        |--------------------------------------------------------------------------
        | DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        showDailyClose:function(){

            cashierVaultPage.funx.resetDailyClose();

            jsAddon.display.ajaxRequest({

                url:

                    cashierVaultSummaryApi,

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

                $("#businessDate")

                .val(

                    response.data.business_date

                );

                $("#expectedCash")

                .val(

                    parseFloat(

                        response.data.current_balance || 0

                    ).toFixed(2)

                );

                cashierVaultPage.dailyCloseModal.show();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | RESET DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        resetDailyClose:function(){

            $("#dailyCloseForm")[0].reset();

            $(".denominationQty")

            .val(0);

            $(".coinQty")

            .val(0);

            $(".denominationTotal")

            .html("₱0.00");

            $("#coinGrandTotal")

            .html("₱0.00")

            .data("value",0);

            $("#grandTotal")

            .html("₱0.00");

            $("#actualCash")

            .val("0.00");

            $("#variance")

            .val("0.00");

        },

        /*
        |--------------------------------------------------------------------------
        | DENOMINATION EVENTS
        |--------------------------------------------------------------------------
        */

        bindDenominationEvents:function(){

            $(".denominationQty")

            .off("keyup change")

            .on("keyup change",function(){

                cashierVaultPage.funx.calculateDenominations();

            });

            $(".coinQty")

            .off("keyup change")

            .on("keyup change",function(){

                cashierVaultPage.funx.calculateCoins();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | CALCULATE DENOMINATIONS
        |--------------------------------------------------------------------------
        */

        calculateDenominations:function(){

            let total = 0;

            $(".denominationQty")

            .each(function(){

                let qty =

                    parseFloat(

                        $(this).val()

                    ) || 0;

                let value =

                    parseFloat(

                        $(this).data("value")

                    );

                let amount =

                    qty * value;

                total += amount;

                $("#total"+value)

                .html(

                    cashierVaultPage.funx.money(

                        amount

                    )

                );

            });

            total +=

                parseFloat(

                    $("#coinGrandTotal")

                    .data("value")

                ) || 0;

            $("#grandTotal")

            .html(

                cashierVaultPage.funx.money(

                    total

                )

            );

            $("#actualCash")

            .val(

                total.toFixed(2)

            );

            cashierVaultPage.funx.calculateVariance();

        },

        /*
        |--------------------------------------------------------------------------
        | CALCULATE COINS
        |--------------------------------------------------------------------------
        */

        calculateCoins:function(){

            let total = 0;

            $(".coinQty")

            .each(function(){

                let qty =

                    parseFloat(

                        $(this).val()

                    ) || 0;

                let value =

                    parseFloat(

                        $(this).data("value")

                    );

                let amount =

                    qty * value;

                total += amount;

                let id =

                    $(this)

                    .attr("id")

                    .replace(

                        "coin",

                        ""

                    );

                $("#coin"+id+"Total")

                .html(

                    cashierVaultPage.funx.money(

                        amount

                    )

                );

            });

            $("#coinGrandTotal")

            .data(

                "value",

                total

            )

            .html(

                cashierVaultPage.funx.money(

                    total

                )

            );

            cashierVaultPage.funx.calculateDenominations();

        },

        /*
        |--------------------------------------------------------------------------
        | VARIANCE
        |--------------------------------------------------------------------------
        */

        calculateVariance:function(){

            let expected =

                parseFloat(

                    $("#expectedCash")

                    .val()

                ) || 0;

            let actual =

                parseFloat(

                    $("#actualCash")

                    .val()

                ) || 0;

            let variance =

                actual -

                expected;

            $("#variance")

            .val(

                variance.toFixed(2)

            );

        },
                /*
        |--------------------------------------------------------------------------
        | BUILD DENOMINATIONS
        |--------------------------------------------------------------------------
        */

        buildDenominations:function(){

            let denominations = [];

            $(".denominationQty").each(function(){

                let qty =
                    parseFloat($(this).val()) || 0;

                if(qty <= 0){

                    return;

                }

                let value =
                    parseFloat($(this).data("value"));

                denominations.push({

                    denomination:value,

                    quantity:qty,

                    amount:value * qty

                });

            });

            $(".coinQty").each(function(){

                let qty =
                    parseFloat($(this).val()) || 0;

                if(qty <= 0){

                    return;

                }

                let value =
                    parseFloat($(this).data("value"));

                denominations.push({

                    denomination:value,

                    quantity:qty,

                    amount:value * qty

                });

            });

            return denominations;

        },

        /*
        |--------------------------------------------------------------------------
        | SUBMIT DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        submitDailyClose:function(){

            let payload = {

                business_date:

                    $("#businessDate").val(),

                expected_cash:

                    $("#expectedCash").val(),

                actual_cash:

                    $("#actualCash").val(),

                variance:

                    $("#variance").val(),

                remarks:

                    $("#dailyCloseRemarks").val(),

                denominations:

                    cashierVaultPage.funx
                    .buildDenominations()

            };

            Swal.fire({

                title:

                    "Submit Daily Close?",

                text:

                    "This will submit your Daily Close to the Manager.",

                icon:

                    "question",

                showCancelButton:true,

                confirmButtonColor:

                    "#198754",

                confirmButtonText:

                    "Submit"

            }).then(function(result){

                if(

                    !result.isConfirmed

                ){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        cashierVaultDailyCloseApi,

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

                    Swal.fire(

                        "Success",

                        response.message,

                        "success"

                    );

                    cashierVaultPage.dailyCloseModal.hide();

                    cashierVaultPage.table.ajax.reload();

                    cashierVaultPage.funx.loadSummary();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | VIEW TRANSACTION
        |--------------------------------------------------------------------------
        */

        viewTransaction:function(id){

            jsAddon.display.ajaxRequest({

                url:

                    cashierVaultTransactionApi,

                type:"GET",

                payload:{

                    cashier_transaction_id:id

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

                let row = response.data;

                let denominationHtml = "";

                if(

                    row.denominations

                    &&

                    row.denominations.length

                ){

                    denominationHtml += `

                        <table class="table table-bordered table-sm">

                            <thead>

                                <tr>

                                    <th>

                                        Denomination

                                    </th>

                                    <th class="text-end">

                                        Qty

                                    </th>

                                    <th class="text-end">

                                        Amount

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                    `;

                    $.each(

                        row.denominations,

                        function(_,item){

                            denominationHtml += `

                                <tr>

                                    <td>

                                        ₱${parseFloat(item.denomination).toLocaleString()}

                                    </td>

                                    <td class="text-end">

                                        ${item.quantity}

                                    </td>

                                    <td class="text-end">

                                        ${cashierVaultPage.funx.money(item.amount)}

                                    </td>

                                </tr>

                            `;

                        }

                    );

                    denominationHtml += `

                            </tbody>

                        </table>

                    `;

                }

                Swal.fire({

                    title:

                        "<b>Cashier Transaction</b>",

                    width:900,

                    confirmButtonText:"Close",

                    html:`

                        <div class="container-fluid text-start">

                            <div class="row">

                                <div class="col-md-6">

                                    <table class="table table-sm">

                                        <tr>

                                            <th width="170">

                                                Reference #

                                            </th>

                                            <td>

                                                ${row.reference_no}

                                            </td>

                                        </tr>

                                        <tr>

                                            <th>

                                                Transaction

                                            </th>

                                            <td>

                                                ${cashierVaultPage.funx.transactionBadge(row.transaction_type)}

                                            </td>

                                        </tr>

                                        <tr>

                                            <th>

                                                Business Date

                                            </th>

                                            <td>

                                                ${row.business_date ?? "-"}

                                            </td>

                                        </tr>

                                        <tr>

                                            <th>

                                                Created By

                                            </th>

                                            <td>

                                                ${row.created_by_name}

                                            </td>

                                        </tr>

                                        <tr>

                                            <th>

                                                Date

                                            </th>

                                            <td>

                                                ${row.created_at}

                                            </td>

                                        </tr>

                                    </table>

                                </div>

                                <div class="col-md-6">

                                    <table class="table table-sm">

                                        <tr>

                                            <th width="170">

                                                Amount

                                            </th>

                                            <td class="text-end">

                                                ${cashierVaultPage.funx.money(row.amount)}

                                            </td>

                                        </tr>

                                        <tr>

                                            <th>

                                                Balance Before

                                            </th>

                                            <td class="text-end">

                                                ${cashierVaultPage.funx.money(row.balance_before)}

                                            </td>

                                        </tr>

                                        <tr>

                                            <th>

                                                Balance After

                                            </th>

                                            <td class="text-end">

                                                ${cashierVaultPage.funx.money(row.balance_after)}

                                            </td>

                                        </tr>

                                    </table>

                                </div>

                            </div>

                            <hr>

                            <strong>

                                Remarks

                            </strong>

                            <div class="border rounded p-2 mb-3">

                                ${row.remarks ?? "-"}

                            </div>

                            ${denominationHtml}

                        </div>

                    `

                });

            });

        },
                /*
        |--------------------------------------------------------------------------
        | STATUS BADGE
        |--------------------------------------------------------------------------
        */

        getStatusBadge:function(status){

            status = String(status || "").toUpperCase();

            switch(status){

                case "PENDING":

                    return `
                        <span class="badge bg-warning text-dark">
                            Pending
                        </span>
                    `;

                case "APPROVED":

                    return `
                        <span class="badge bg-success">
                            Approved
                        </span>
                    `;

                case "REJECTED":

                    return `
                        <span class="badge bg-danger">
                            Rejected
                        </span>
                    `;

                default:

                    return `
                        <span class="badge bg-secondary">
                            ${status}
                        </span>
                    `;

            }

        },

        /*
        |--------------------------------------------------------------------------
        | DATE FORMAT
        |--------------------------------------------------------------------------
        */

        formatDate:function(date){

            if(!date){

                return "-";

            }

            let d = new Date(date);

            return d.toLocaleDateString(

                "en-PH",

                {

                    year:"numeric",

                    month:"short",

                    day:"2-digit"

                }

            ) + " " +

            d.toLocaleTimeString(

                "en-PH",

                {

                    hour:"2-digit",

                    minute:"2-digit"

                }

            );

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW LOADING
        |--------------------------------------------------------------------------
        */

        showLoading:function(){

            $("#loadingOverlay").fadeIn(150);

        },

        /*
        |--------------------------------------------------------------------------
        | HIDE LOADING
        |--------------------------------------------------------------------------
        */

        hideLoading:function(){

            $("#loadingOverlay").fadeOut(150);

        },

        /*
        |--------------------------------------------------------------------------
        | RESET FILTERS
        |--------------------------------------------------------------------------
        */

        resetFilters:function(){

            $("#filterBusinessDate").val("");

            $("#filterTransaction").val("");

            $("#txtSearch").val("");

            cashierVaultPage.table.ajax.reload();

            cashierVaultPage.funx.loadSummary();

        },

        /*
        |--------------------------------------------------------------------------
        | REFRESH
        |--------------------------------------------------------------------------
        */

        refresh:function(){

            cashierVaultPage.table.ajax.reload(

                null,

                false

            );

            cashierVaultPage.funx.loadSummary();

        },

        /*
        |--------------------------------------------------------------------------
        | EXPORT (PLACE HOLDER)
        |--------------------------------------------------------------------------
        */

        exportExcel:function(){

            Swal.fire(

                "Coming Soon",

                "Excel export is not yet available.",

                "info"

            );

        },

        /*
        |--------------------------------------------------------------------------
        | PRINT (PLACE HOLDER)
        |--------------------------------------------------------------------------
        */

        printDailyClose:function(id){

            window.open(

                base_url +

                "cashierVault/print/" +

                id,

                "_blank"

            );

        },
        /*
        |--------------------------------------------------------------------------
        | RECEIVE FROM MANAGER
        |--------------------------------------------------------------------------
        */

        receiveFromManager:function(transactionId){

            Swal.fire({

                title:"Receive Cash?",

                text:"Confirm receiving cash from Manager?",

                icon:"question",

                showCancelButton:true,

                confirmButtonText:"Receive",

                confirmButtonColor:"#198754"

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        base_url +

                        "api/cashierVault/receiveFromManager",

                    type:"POST",

                    payload:{

                        cashier_transaction_id:

                            transactionId

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

                    Swal.fire(

                        "Success",

                        response.message,

                        "success"

                    );

                    cashierVaultPage.funx.refresh();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | RETURN TO MANAGER
        |--------------------------------------------------------------------------
        */

        returnToManager:function(){

            Swal.fire({

                title:"Return Cash?",

                html:`

                    <div class="mb-3 text-start">

                        <label>

                            Remarks

                        </label>

                        <textarea

                            id="returnRemarks"

                            class="form-control"

                            rows="3">

                        </textarea>

                    </div>

                `,

                showCancelButton:true,

                confirmButtonText:"Submit",

                preConfirm:function(){

                    return{

                        remarks:

                            $("#returnRemarks")

                            .val()

                    };

                }

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        base_url +

                        "api/cashierVault/returnToVault",

                    type:"POST",

                    payload:result.value,

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

                    Swal.fire(

                        "Success",

                        response.message,

                        "success"

                    );

                    cashierVaultPage.funx.refresh();

                });

            });

        },
                /*
        |--------------------------------------------------------------------------
        | PRINT TRANSACTION
        |--------------------------------------------------------------------------
        */

        printTransaction:function(id){

            window.open(

                base_url +

                "cashierVault/printTransaction/" +

                id,

                "_blank"

            );

        },

        /*
        |--------------------------------------------------------------------------
        | PRINT DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        printDailyClose:function(id){

            window.open(

                base_url +

                "cashierVault/printDailyClose/" +

                id,

                "_blank"

            );

        },

        /*
        |--------------------------------------------------------------------------
        | EXPORT EXCEL
        |--------------------------------------------------------------------------
        */

        exportExcel:function(){

            window.location =

                base_url +

                "cashierVault/exportExcel?" +

                $.param({

                    business_date:

                        $("#filterBusinessDate").val(),

                    transaction_type:

                        $("#filterTransaction").val(),

                    search:

                        $("#txtSearch").val()

                });

        },

        /*
        |--------------------------------------------------------------------------
        | EXPORT PDF
        |--------------------------------------------------------------------------
        */

        exportPDF:function(){

            window.open(

                base_url +

                "cashierVault/exportPDF?" +

                $.param({

                    business_date:

                        $("#filterBusinessDate").val(),

                    transaction_type:

                        $("#filterTransaction").val(),

                    search:

                        $("#txtSearch").val()

                }),

                "_blank"

            );

        },

        /*
        |--------------------------------------------------------------------------
        | AUTO REFRESH
        |--------------------------------------------------------------------------
        */

        autoRefresh:function(){

            setInterval(function(){

                if(

                    cashierVaultPage.table

                ){

                    cashierVaultPage.table

                    .ajax

                    .reload(

                        null,

                        false

                    );

                }

                cashierVaultPage.funx

                .loadSummary();

            },30000);

        },

        /*
        |--------------------------------------------------------------------------
        | RESET FILTERS
        |--------------------------------------------------------------------------
        */

        resetFilters:function(){

            $("#filterBusinessDate")

            .val("");

            $("#filterTransaction")

            .val("");

            $("#txtSearch")

            .val("");

            cashierVaultPage.table

            .ajax

            .reload();

            cashierVaultPage.funx

            .loadSummary();

        },

        /*
        |--------------------------------------------------------------------------
        | REFRESH
        |--------------------------------------------------------------------------
        */

        refresh:function(){

            cashierVaultPage.table

            .ajax

            .reload(

                null,

                false

            );

            cashierVaultPage.funx

            .loadSummary();

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW LOADING
        |--------------------------------------------------------------------------
        */

        showLoading:function(){

            $("#loadingOverlay")

            .fadeIn(150);

        },

        /*
        |--------------------------------------------------------------------------
        | HIDE LOADING
        |--------------------------------------------------------------------------
        */

        hideLoading:function(){

            $("#loadingOverlay")

            .fadeOut(150);

        },

                /*
        |--------------------------------------------------------------------------
        | FIND TRANSACTION
        |--------------------------------------------------------------------------
        */

        getTransaction:function(id){

            if(

                cashierVaultPage.transactions[id]

            ){

                return cashierVaultPage.transactions[id];

            }

            return null;

        },

        /*
        |--------------------------------------------------------------------------
        | RELOAD TABLE
        |--------------------------------------------------------------------------
        */

        reloadTable:function(resetPaging=false){

            if(

                cashierVaultPage.table

            ){

                cashierVaultPage.table.ajax.reload(

                    null,

                    resetPaging

                );

            }

        },

        /*
        |--------------------------------------------------------------------------
        | RELOAD PAGE
        |--------------------------------------------------------------------------
        */

        reload:function(){

            cashierVaultPage.funx.loadSummary();

            cashierVaultPage.funx.reloadTable(false);

        },

        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        success:function(message){

            Swal.fire({

                icon:"success",

                title:"Success",

                text:message,

                timer:1800,

                showConfirmButton:false

            });

        },

        /*
        |--------------------------------------------------------------------------
        | ERROR
        |--------------------------------------------------------------------------
        */

        error:function(message){

            Swal.fire(

                "Error",

                message,

                "error"

            );

        },

        /*
        |--------------------------------------------------------------------------
        | LOADING
        |--------------------------------------------------------------------------
        */

        showLoading:function(){

            $("#loadingOverlay")

            .fadeIn(150);

        },

        hideLoading:function(){

            $("#loadingOverlay")

            .fadeOut(150);

        },

        /*
        |--------------------------------------------------------------------------
        | AJAX START
        |--------------------------------------------------------------------------
        */

        ajaxStart:function(){

            cashierVaultPage.funx.showLoading();

        },

        /*
        |--------------------------------------------------------------------------
        | AJAX END
        |--------------------------------------------------------------------------
        */

        ajaxEnd:function(){

            cashierVaultPage.funx.hideLoading();

        },

        /*
        |--------------------------------------------------------------------------
        | RESET SEARCH
        |--------------------------------------------------------------------------
        */

        clearSearch:function(){

            $("#txtSearch")

            .val("");

            $("#filterBusinessDate")

            .val("");

            $("#filterTransaction")

            .val("");

            cashierVaultPage.funx.reload();

        },

        /*
        |--------------------------------------------------------------------------
        | REFRESH DASHBOARD
        |--------------------------------------------------------------------------
        */

        refreshDashboard:function(){

            cashierVaultPage.funx.loadSummary();

        },

        /*
        |--------------------------------------------------------------------------
        | REFRESH ALL
        |--------------------------------------------------------------------------
        */

        refreshAll:function(){

            cashierVaultPage.funx.refreshDashboard();

            cashierVaultPage.funx.reloadTable(false);

        },

        /*
        |--------------------------------------------------------------------------
        | OPEN DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        openDailyClose:function(){

            cashierVaultPage.funx.showDailyClose();

        },

        /*
        |--------------------------------------------------------------------------
        | CLOSE DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        closeDailyClose:function(){

            cashierVaultPage.dailyCloseModal.hide();

        },

        /*
        |--------------------------------------------------------------------------
        | OPEN COINS
        |--------------------------------------------------------------------------
        */

        openCoins:function(){

            cashierVaultPage.coinsModal.show();

        },

        /*
        |--------------------------------------------------------------------------
        | CLOSE COINS
        |--------------------------------------------------------------------------
        */

        closeCoins:function(){

            cashierVaultPage.coinsModal.hide();

        },

                /*
        |--------------------------------------------------------------------------
        | ADD COLLECTION
        |--------------------------------------------------------------------------
        */

        addCollection:function(){

            Swal.fire({

                title:"Record Collection",

                html:`

                    <input

                        id="collectionAmount"

                        class="form-control mb-3"

                        type="number"

                        placeholder="Amount">

                    <textarea

                        id="collectionRemarks"

                        class="form-control"

                        placeholder="Remarks">

                    </textarea>

                `,

                showCancelButton:true,

                confirmButtonText:"Save",

                preConfirm:function(){

                    return{

                        amount:

                            $("#collectionAmount").val(),

                        remarks:

                            $("#collectionRemarks").val()

                    };

                }

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        base_url +

                        "api/cashierVault/addCollection",

                    type:"POST",

                    payload:result.value,

                    dataType:"json"

                }).then(function(response){

                    if(response.isError){

                        cashierVaultPage.funx.error(

                            response.message

                        );

                        return;

                    }

                    cashierVaultPage.funx.success(

                        response.message

                    );

                    cashierVaultPage.funx.refreshAll();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | ADD EXPENSE
        |--------------------------------------------------------------------------
        */

        addExpense:function(){

            Swal.fire({

                title:"Cash Expense",

                html:`

                    <input

                        id="expenseAmount"

                        class="form-control mb-3"

                        type="number"

                        placeholder="Amount">

                    <textarea

                        id="expenseRemarks"

                        class="form-control"

                        placeholder="Purpose">

                    </textarea>

                `,

                showCancelButton:true,

                confirmButtonText:"Save",

                preConfirm:function(){

                    return{

                        amount:

                            $("#expenseAmount").val(),

                        remarks:

                            $("#expenseRemarks").val()

                    };

                }

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        base_url +

                        "api/cashierVault/addExpense",

                    type:"POST",

                    payload:result.value,

                    dataType:"json"

                }).then(function(response){

                    if(response.isError){

                        cashierVaultPage.funx.error(

                            response.message

                        );

                        return;

                    }

                    cashierVaultPage.funx.success(

                        response.message

                    );

                    cashierVaultPage.funx.refreshAll();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | ADJUSTMENT
        |--------------------------------------------------------------------------
        */

        addAdjustment:function(){

            Swal.fire({

                title:"Vault Adjustment",

                html:`

                    <select

                        id="adjustmentType"

                        class="form-select mb-3">

                        <option value="PLUS">

                            Add Balance

                        </option>

                        <option value="MINUS">

                            Deduct Balance

                        </option>

                    </select>

                    <input

                        id="adjustmentAmount"

                        class="form-control mb-3"

                        type="number"

                        placeholder="Amount">

                    <textarea

                        id="adjustmentRemarks"

                        class="form-control"

                        placeholder="Reason">

                    </textarea>

                `,

                showCancelButton:true,

                confirmButtonText:"Save",

                preConfirm:function(){

                    return{

                        adjustment_type:

                            $("#adjustmentType").val(),

                        amount:

                            $("#adjustmentAmount").val(),

                        remarks:

                            $("#adjustmentRemarks").val()

                    };

                }

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        base_url +

                        "api/cashierVault/addAdjustment",

                    type:"POST",

                    payload:result.value,

                    dataType:"json"

                }).then(function(response){

                    if(response.isError){

                        cashierVaultPage.funx.error(

                            response.message

                        );

                        return;

                    }

                    cashierVaultPage.funx.success(

                        response.message

                    );

                    cashierVaultPage.funx.refreshAll();

                });

            });

        },

                /*
        |--------------------------------------------------------------------------
        | DASHBOARD
        |--------------------------------------------------------------------------
        */

        dashboard:function(){

            let dashboard = {

                currentBalance:0,

                totalReceived:0,

                totalCollection:0,

                totalLoanRelease:0,

                totalExpense:0,

                totalReturn:0,

                totalAdjustmentPlus:0,

                totalAdjustmentMinus:0,

                transactionCount:0

            };

            $.each(

                cashierVaultPage.transactions,

                function(index,row){

                    let amount =

                        parseFloat(

                            row.amount || 0

                        );

                    dashboard.transactionCount++;

                    dashboard.currentBalance =

                        parseFloat(

                            row.balance_after || 0

                        );

                    switch(

                        String(

                            row.transaction_type

                        ).toUpperCase()

                    ){

                        case "RECEIVED_FROM_MANAGER":

                            dashboard.totalReceived += amount;

                        break;

                        case "PAYMENT_COLLECTION":

                            dashboard.totalCollection += amount;

                        break;

                        case "LOAN_RELEASE":

                            dashboard.totalLoanRelease += amount;

                        break;

                        case "EXPENSE":

                            dashboard.totalExpense += amount;

                        break;

                        case "RETURN TO VAULT":

                            dashboard.totalReturn += amount;

                        break;

                        case "ADJUSTMENT_PLUS":

                            dashboard.totalAdjustmentPlus += amount;

                        break;

                        case "ADJUSTMENT_MINUS":

                            dashboard.totalAdjustmentMinus += amount;

                        break;

                    }

                }

            );

            cashierVaultPage.dashboard =

                dashboard;

            cashierVaultPage.funx.renderDashboard();

        },

        /*
        |--------------------------------------------------------------------------
        | RENDER DASHBOARD
        |--------------------------------------------------------------------------
        */

        renderDashboard:function(){

            $("#lblCurrentBalance")

            .html(

                cashierVaultPage.funx.money(

                    cashierVaultPage.dashboard.currentBalance

                )

            );

            $("#lblReceived")

            .html(

                cashierVaultPage.funx.money(

                    cashierVaultPage.dashboard.totalReceived

                )

            );

            $("#lblCollection")

            .html(

                cashierVaultPage.funx.money(

                    cashierVaultPage.dashboard.totalCollection

                )

            );

            $("#lblLoanRelease")

            .html(

                cashierVaultPage.funx.money(

                    cashierVaultPage.dashboard.totalLoanRelease

                )

            );

            $("#lblExpense")

            .html(

                cashierVaultPage.funx.money(

                    cashierVaultPage.dashboard.totalExpense

                )

            );

            $("#lblReturn")

            .html(

                cashierVaultPage.funx.money(

                    cashierVaultPage.dashboard.totalReturn

                )

            );

            $("#lblTransactions")

            .html(

                cashierVaultPage.dashboard.transactionCount

            );

        },

        /*
        |--------------------------------------------------------------------------
        | UPDATE DASHBOARD
        |--------------------------------------------------------------------------
        */

        updateDashboard:function(){

            cashierVaultPage.funx.dashboard();

        },

        /*
        |--------------------------------------------------------------------------
        | RESET DASHBOARD
        |--------------------------------------------------------------------------
        */

        resetDashboard:function(){

            cashierVaultPage.dashboard={

                currentBalance:0,

                totalReceived:0,

                totalCollection:0,

                totalLoanRelease:0,

                totalExpense:0,

                totalReturn:0,

                totalAdjustmentPlus:0,

                totalAdjustmentMinus:0,

                transactionCount:0

            };

            cashierVaultPage.funx.renderDashboard();

        },
                /*
        |--------------------------------------------------------------------------
        | AUTO REFRESH
        |--------------------------------------------------------------------------
        */

        autoRefresh:function(){

            if(

                cashierVaultPage.autoRefreshTimer

            ){

                clearInterval(

                    cashierVaultPage.autoRefreshTimer

                );

            }

            cashierVaultPage.autoRefreshTimer =

                setInterval(function(){

                    cashierVaultPage.funx.reload();

                },30000);

        },

        /*
        |--------------------------------------------------------------------------
        | STOP AUTO REFRESH
        |--------------------------------------------------------------------------
        */

        stopAutoRefresh:function(){

            if(

                cashierVaultPage.autoRefreshTimer

            ){

                clearInterval(

                    cashierVaultPage.autoRefreshTimer

                );

            }

        },

        /*
        |--------------------------------------------------------------------------
        | KEYBOARD SHORTCUTS
        |--------------------------------------------------------------------------
        */

        keyboardShortcut:function(){

            $(document)

            .off("keydown.cashierVault")

            .on("keydown.cashierVault",function(e){

                /*
                ----------------------------------------------------------
                F5
                ----------------------------------------------------------
                */

                if(

                    e.which == 116

                ){

                    e.preventDefault();

                    cashierVaultPage.funx.reload();

                }

                /*
                ----------------------------------------------------------
                Ctrl + F
                ----------------------------------------------------------
                */

                if(

                    e.ctrlKey &&

                    e.which == 70

                ){

                    e.preventDefault();

                    $("#txtSearch")

                    .focus();

                }

                /*
                ----------------------------------------------------------
                ESC
                ----------------------------------------------------------
                */

                if(

                    e.which == 27

                ){

                    $(".modal")

                    .modal("hide");

                }

            });

        },

        /*
        |--------------------------------------------------------------------------
        | RELOAD
        |--------------------------------------------------------------------------
        */

        reload:function(){

            cashierVaultPage.funx.loadSummary();

            cashierVaultPage.table.ajax.reload(

                null,

                false

            );

        },

        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        success:function(message){

            Swal.fire({

                toast:true,

                position:"top-end",

                icon:"success",

                title:message,

                timer:2000,

                showConfirmButton:false

            });

        },

        /*
        |--------------------------------------------------------------------------
        | ERROR
        |--------------------------------------------------------------------------
        */

        error:function(message){

            Swal.fire({

                icon:"error",

                title:"Error",

                text:message

            });

        },

        /*
        |--------------------------------------------------------------------------
        | LOADING
        |--------------------------------------------------------------------------
        */

        loading:function(show=true){

            if(show){

                $("#loadingOverlay")

                .fadeIn(150);

            }else{

                $("#loadingOverlay")

                .fadeOut(150);

            }

        },

        /*
        |--------------------------------------------------------------------------
        | CONFIRM
        |--------------------------------------------------------------------------
        */

        confirm:function(title,text,callback){

            Swal.fire({

                title:title,

                text:text,

                icon:"question",

                showCancelButton:true,

                confirmButtonColor:"#198754",

                cancelButtonColor:"#6c757d"

            }).then(function(result){

                if(result.isConfirmed){

                    callback();

                }

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SESSION CHECK
        |--------------------------------------------------------------------------
        */

        sessionCheck:function(){

            setInterval(function(){

                $.get(

                    base_url +

                    "api/session/check"

                );

            },300000);

        }

    }

};

/*
|--------------------------------------------------------------------------
| PAGE READY
|--------------------------------------------------------------------------
*/

$(function(){

    cashierVaultPage.init();

});