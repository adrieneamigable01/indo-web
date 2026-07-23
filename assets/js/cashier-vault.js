"use strict";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/






// const cashierVaultDailyCloseApi =
//     base_url +
//     "api/cashierVault/dailyClose";

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/
let cashierVaultPage = {

    borrowerId:null,

    table:null,

    transactions:{},

    dashboard:{},

    userData:{},

    dailyCloseModal:null,

    coinsModal:null,

    borrowerList:[],

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

        

        cashierVaultPage.funx.events();

        // cashierVaultPage.funx.autoRefresh();

        cashierVaultPage.funx.keyboardShortcut();

        cashierVaultPage.funx.sessionCheck();

        let userData = JSON.parse(
            localStorage.getItem("userdata") || "{}"
        );

        cashierVaultPage.userData = userData;

        if(
            String(userData.usertype)
                .toUpperCase() === "ADMIN"
        ){

            $("#divCashierFilter").show();

            cashierVaultPage.funx.loadCashiers();

        }
        else{

            $("#divCashierFilter").hide();
            cashierVaultPage.funx.loadTransactions();

            cashierVaultPage.funx.loadSummary();

        }

        cashierVaultPage.funx.getBorrowers();

        // cashierVaultPage.funx.loadSummary();

    },

    funx:{
        /*
        |--------------------------------------------------------------------------
        | LOAD CASHIERS
        |--------------------------------------------------------------------------
        */
        getBorrowers:function(){

            if(cashierVaultPage.borrowerList.length > 0){
                return;
            }

            jsAddon.display.ajaxRequest({

                type:"GET",

                url:borrowerApi,

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

                cashierVaultPage.borrowerList =
                    response.data;

            });

        },
        buildBorrowerOptions:function(){

            let html = `
                <option value="">
                    Select Borrower
                </option>
            `;

            $.each(

                cashierVaultPage.borrowerList,

                function(index,row){

                    let fullName =

                        row.last_name + ", " +

                        row.first_name +

                        (row.middle_name
                            ? " " + row.middle_name
                            : "");

                    html += `

                        <option

                            value="${row.borrower_id}"

                            data-name="${fullName}"

                            data-phone="${row.mobile_no}"

                            data-address="${row.home_address}">

                            ${fullName}

                        </option>

                    `;

                }

            );

            return html;

        },
        loadCashiers:function(){

            jsAddon.display.ajaxRequest({

                url:userApi,

                type:"GET",

                payload:{

                    role:"CASHIER"

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

                let html = "";

                html +=
                `
                    <option value="">
                        -- Select Cashier --
                    </option>
                `;

                $.each(response.data,function(index,row){

                    html +=
                    `
                        <option
                            value="${row.userid}">
                            ${row.firstname}  ${row.lastname}
                        </option>
                    `;

                });

                $("#filterCashier").html(html);

                if(response.data.length > 0){

                    let firstCashierId = response.data[0].userid;

                    $("#filterCashier").val(firstCashierId);

                    console.log(
                        "Selected Cashier:",
                        $("#filterCashier").val()
                    );

                    $("#filterCashier").trigger("change");
                    cashierVaultPage.funx.loadTransactions();

                    cashierVaultPage.funx.loadSummary();
                }

            });

        },
        /*
        |--------------------------------------------------------------------------
        | EVENTS
        |--------------------------------------------------------------------------
        */
        getSelectedCashier:function(){

            let userData =
                cashierVaultPage.userData;

            if(
                String(userData.usertype)
                    .toUpperCase() === "ADMIN"
            ){

                return $("#filterCashier").val();

            }

            return userData.userid;

        },
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

                responsive:{
                    details:{
                        type:"column",
                        target:-1
                    }
                },
                autoWidth:false,
                scrollX:true,

                searching:false,

                ordering:true,

                pageLength:10,

                order:[[0,"desc"]],
                columnDefs:[

                {
                    targets:"_all",
                    width:"1%"
                },

                {
                    targets:4, // Remarks column
                    width:"auto"
                }

            ],

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

                                .val(),
                            cashier_id:
    cashierVaultPage.funx.getSelectedCashier()

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
                        data:"business_date",
                        render:function(data){

                            let d = new Date(data);

                            return `
                                <div class="fw-bold">

                                    ${d.toLocaleDateString("en-US",{

                                        month:"short",

                                        day:"2-digit",

                                        year:"numeric"

                                    })}

                                </div>

                                <small class="text-muted">

                                    ${d.toLocaleTimeString([],{

                                        hour:"numeric",

                                        minute:"2-digit"

                                    })}

                                </small>
                            `;

                        }
                    },

                    {

                        data:"transaction_type",
                        render:function(data){

                            return cashierVaultPage.funx.transactionBadge(

                                data

                            );

                        }

                    },

                    {
                        data: "amount_with_balance",
                        render:function(data, type, row){

                            if(!data){

                                return "";

                            }

                            let matches = data.match(

                                /^([\d,.-]+)\s*\((.*?)\)$/

                            );

                            if(!matches){

                                return cashierVaultPage.funx.money(data);

                            }

                            let textcolor = "text-success";

                            if(

                                row.transaction_type === "CASH IN" ||

                                row.transaction_type === "TRANSFER_IN"

                            ){

                                textcolor = "text-success";

                            }
                            else{

                                textcolor = "text-danger";

                            }

                            return `

                                <div class="fw-bold fs-6 ${textcolor}">

                                    ${cashierVaultPage.funx.money(matches[1])}

                                </div>

                                <span class="badge bg-light text-dark border">

                                    ${cashierVaultPage.funx.money(matches[2])}

                                </span>

                            `;

                        }
                    },

                    {

                        data:"created_by_name",
                        render:function(data){

                            return `

                                <div class="fw-semibold">

                                    <i class="bi bi-person-circle text-primary"></i>

                                    ${data}

                                </div>

                            `;

                        }

                    },
                   

                    {

                        data:"remarks_display",
                        render:function(data){

                            if(!data){

                                return "";

                            }

                            return `

                                <div

                                    class="text-wrap"

                                    style="max-width:280px">

                                    ${data}

                                </div>

                            `;

                        }

                    },

                    {

                        data:null,

                        orderable:false,

                        searchable:false,

                        render:function(data,type,row){

                            return `<div class="btn-group btnAction">${
                                cashierVaultPage.funx.actionButtons(row)
                            } </div">`;

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

            let userData = JSON.parse(

                localStorage.getItem("userdata") || "{}"

            );

            let html = `
            
                <button

                    class="btn btn-primary btnView"

                    data-id="${row.cashier_transaction_id}"

                    title="View">

                    <i class="bi bi-eye"></i>

                </button>

            `;

            if(

                Number(userData.userid) ===

                Number(row.created_by)

            ){

                html += `

                    <button

                        class="btn btn-danger btnDelete"

                        data-id="${row.cashier_transaction_id}"

                        title="Delete">

                        <i class="bi bi-trash"></i>

                    </button>

                `;

            }

            return html;

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

                case "TRANSFER_IN":

                    return `

                        <span class="badge bg-success">

                            FROM MANAGER

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
                case "CASH IN":

                    return `

                        <span class="badge bg-success">

                            CASH IN

                        </span>

                    `;
                case "CASH OUT":

                    return `

                        <span class="badge bg-danger">

                            CASH OUT

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

                        .val(),
                    cashier_id:
    cashierVaultPage.funx.getSelectedCashier()

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

                /*
                |--------------------------------------------------------------------------
                | BUSINESS DATE CLOSED
                |--------------------------------------------------------------------------
                */

                if(response.isClosing){

                    $("#btnTransaction")

                    .prop("disabled", true)

                    .removeClass("btn-success")

                    .addClass("btn-secondary")

                    .html(`

                        <i class="bi bi-lock-fill"></i>

                        Transaction Closed

                    `);

                    $("#btnDailyClose")

                    .prop("disabled", true)

                    .removeClass("btn-warning")

                    .addClass("btn-secondary")

                    .html(`

                        <i class="bi bi-check-circle-fill"></i>

                        Already Closed

                    `);

                    $("#businessDateStatus")

                    .removeClass("d-none");

                    $(".btnAction").remove()

                }
                else{

                    $("#btnTransaction")

                    .prop("disabled", false)

                    .removeClass("btn-secondary")

                    .addClass("btn-success")

                    .html(`

                        <i class="bi bi-plus-circle"></i>

                        Transaction

                    `);

                    $("#btnDailyClose")

                    .prop("disabled", false)

                    .removeClass("btn-secondary")

                    .addClass("btn-warning")

                    .html(`

                        <i class="bi bi-cash-stack"></i>

                        Daily Close

                    `);

                    $("#businessDateStatus")

                    .addClass("d-none");

                }

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

                dataType:"json",
                payload:{
                    cashier_id:cashierVaultPage.funx.getSelectedCashier(),
                    business_date:$("#filterBusinessDate").val()
                },

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

            // $("#dailyCloseForm")[0].reset();

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
                cashier_id:
                cashierVaultPage.funx.getSelectedCashier(),
                business_date:

                    $("#filterBusinessDate").val(),

                actual_cash:

                    $("#actualCash").val(),

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

                        cashierVaultReturnApi,

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

                let detailsHtml = "";

                if(row.details && row.details.length){

                    detailsHtml = `
                        <strong class="mt-3">

                                Transaction Details

                            </strong>

                        <table class="table table-bordered table-sm">

                            <thead class="table-light">

                                <tr>

                                    <th width="130">

                                        Type

                                    </th>

                                    <th width="130">

                                        Reference

                                    </th>

                                    <th>

                                        Description

                                    </th>

                                    <th class="text-end" width="140">

                                        Amount

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                    `;

                    $.each(

                        row.details,

                        function(_,item){

                            detailsHtml += `

                                <tr>

                                    <td>

                                        ${cashierVaultPage.funx.transactionTypeBadge(

                                            item.transaction_type

                                        )}

                                    </td>

                                    <td>

                                        ${item.reference_type ?? "-"}

                                    </td>

                                    <td>

                                        ${item.reference_id ?? "-"}

                                    </td>

                                    <td>

                                        ${item.description ?? "-"}

                                    </td>

                                    <td class="text-end">

                                        ${cashierVaultPage.funx.money(

                                            item.amount

                                        )}

                                    </td>

                                </tr>

                                `;

                        }

                    );

                    detailsHtml += `

                            </tbody>

                        </table>

                    `;

                }

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

                                                Borrower

                                            </th>

                                            <td class="text-end">
                                                ${row.borrower}
                                            </td>

                                        </tr>
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

                            ${detailsHtml} 
                            ${denominationHtml} 

                        </div>

                    `

                });

            });

        },
        transactionTypeBadge:function(type){

            switch(String(type).toUpperCase()){

                case "CASH IN":

                    return `

                        <span class="badge bg-success">

                            CASH IN

                        </span>

                    `;

                case "CASH OUT":

                    return `

                        <span class="badge bg-danger">

                            CASH OUT

                        </span>

                    `;

                default:

                    return `

                        <span class="badge bg-secondary">

                            -

                        </span>

                    `;

            }

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

        },
        showCashIn:function(){

            Swal.fire({

                title:"Cash In",

                width:650,

                html:`

                    <div class="mb-3 text-start">

                        <label>

                            Business Date

                        </label>

                        <input

                            id="cashInBusinessDate"

                            type="date"

                            class="form-control"

                            value="${moment().format("YYYY-MM-DD")}">

                    </div>

                    <div class="mb-3 text-start">

                        <label>

                            Amount

                        </label>

                        <input

                            id="cashInAmount"

                            type="number"

                            class="form-control">

                    </div>

                    <div class="mb-3 text-start">

                        <label>

                            Remarks

                        </label>

                        <textarea

                            id="cashInRemarks"

                            class="form-control">

                        </textarea>

                    </div>

                `,

                showCancelButton:true,

                confirmButtonText:"Save"

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                cashierVaultPage.funx.saveCashIn();

            });

        },
        showCashTransaction:function(){

            Swal.fire({

                title:false,

                width:1500,

                confirmButtonText:"Save Transaction",

                confirmButtonColor:"#198754",

                cancelButtonText:"Cancel",

                showCancelButton:true,

                html:`

                <div class="container-fluid p-0">

                    <div class="row">

                        <!-- ===================================================== -->
                        <!-- LEFT PANEL -->
                        <!-- ===================================================== -->

                        <div class="col-lg-4">

                            <div class="card shadow-sm border-0 h-100"
                            style="min-height:600px;">

                                <div class="card-header bg-primary text-white">

                                    <h5 class="mb-0">

                                        <i class="bi bi-cash-stack me-2"></i>

                                        Transaction Information

                                    </h5>

                                </div>

                                <div class="card-body">

                                    <div class="mb-3 text-align-left">

                                        <label class="form-label fw-bold d-block text-start">

                                            <i class="bi bi-arrow-left-right me-1"></i>

                                            Transaction Type

                                        </label>

                                        <select
                                            id="cashTransactionType"
                                            class="form-select">

                                            <option value="CASH OUT">

                                                🔴 CASH OUT

                                            </option>

                                            <option value="CASH IN">

                                                🟢 CASH IN

                                            </option>

                                            <option value="CASH OUT">

                                                🔴 EXPENSE

                                            </option>

                                        </select>

                                    </div>

                                    <div class="mb-3">

                                        <label class="form-label fw-bold d-block text-start">

                                            <i class="bi bi-upc me-1"></i>

                                            Reference No.

                                        </label>

                                        <input
                                            type="text"
                                            class="form-control"
                                            readonly
                                            value="AUTO GENERATED">

                                    </div>

                                    <div class="mb-3">

                                        <label class="form-label fw-bold d-block text-start">

                                            <i class="bi bi-clock me-1"></i>

                                            Transaction Time

                                        </label>

                                        <input
                                            type="time"
                                            id="transactionTime"
                                            class="form-control">

                                    </div>

                                    <hr>

                                    <div class="form-check mb-3">

                                        <input
                                            type="checkbox"
                                            class="form-check-input"
                                            id="chkBorrower">

                                        <label
                                            class="form-label fw-bold d-block text-start"
                                            for="chkBorrower">

                                            Transaction is for Borrower

                                        </label>

                                    </div>

                                    <div
                                        id="borrowerWrapper"
                                        class="mb-3 d-none">

                                        <label class="form-label fw-bold d-block text-start">

                                            <i class="bi bi-person me-1"></i>

                                            Borrower

                                        </label>

                                        <select
                                            id="cashBorrower"
                                            class="form-select">

                                            ${cashierVaultPage.funx.buildBorrowerOptions()}

                                        </select>

                                    </div>

                                    <div>

                                        <label class="form-label fw-bold d-block text-start">

                                            <i class="bi bi-chat-left-text me-1"></i>

                                            Remarks

                                        </label>

                                        <textarea
                                            id="cashOutRemarks"
                                            rows="7"
                                            class="form-control"
                                            placeholder="Enter remarks..."></textarea>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- ===================================================== -->
                        <!-- RIGHT PANEL -->
                        <!-- ===================================================== -->

                        <div class="col-lg-8">

                            <div class="card shadow-sm border-0 h-100">

                                <div class="card-header d-flex justify-content-between align-items-center">

                                    <h5 class="mb-0">

                                        <i class="bi bi-list-check me-2"></i>

                                        Transaction Details

                                    </h5>

                                    <button
                                        type="button"
                                        id="btnAddCashOutRow"
                                        class="btn btn-primary btn-sm">

                                        <i class="bi bi-plus-circle"></i>

                                        Add Item

                                    </button>

                                </div>

                                <div class="card-body p-0 d-flex flex-column">

                                    <div class="table-responsive flex-grow-1"
                                        style="
                                            overflow-y:auto;
                                            max-height:520px;
                                        ">

                                        <table
                                            class="table table-bordered table-hover align-middle mb-0"
                                            id="tblCashOutDetails">

                                            <thead class="table-light">

                                                <tr>

                                                    <th width="130">

                                                        Type

                                                    </th>

                                                    <th width="170">

                                                        Reference Type

                                                    </th>

                                                    <th width="150">

                                                        Reference #

                                                    </th>

                                                    <th>

                                                        Description

                                                    </th>

                                                    <th
                                                        width="150"
                                                        class="text-end">

                                                        Amount

                                                    </th>

                                                    <th width="60"></th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <!-- ===================================================== -->
                    <!-- TOTALS -->
                    <!-- ===================================================== -->

                    <div class="row mt-3">

                        <div class="col-md-4">

                            <div class="card border-success shadow-sm">

                                <div class="card-body text-center">

                                    <div class="text-muted">

                                        Total Cash In

                                    </div>

                                    <h2
                                        class="text-success fw-bold mb-0"
                                        id="lblCashIn">

                                        ₱0.00

                                    </h2>

                                </div>

                            </div>

                        </div>

                        <div class="col-md-4">

                            <div class="card border-danger shadow-sm">

                                <div class="card-body text-center">

                                    <div class="text-muted">

                                        Total Cash Out

                                    </div>

                                    <h3
                                        class="text-danger mb-0"
                                        id="lblCashOut">

                                        ₱0.00

                                    </h3>

                                </div>

                            </div>

                        </div>

                        <div class="col-md-4">

                            <div class="card border-primary shadow-sm">

                                <div class="card-body text-center">

                                    <div class="text-muted">

                                        Net Transaction

                                    </div>

                                    <h1
                                        class="text-primary fw-bold mb-0"
                                        id="lblNetCashOut">

                                        ₱0.00

                                    </h1>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
                `,
                didOpen:function(){

                    /*
                    |--------------------------------------------------------------------------
                    | DEFAULT TIME
                    |--------------------------------------------------------------------------
                    */

                    const now = new Date();

                    const hours =
                        String(now.getHours())
                        .padStart(2,"0");

                    const minutes =
                        String(now.getMinutes())
                        .padStart(2,"0");

                    $("#transactionTime").val(
                        hours + ":" + minutes
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | INITIALIZE BORROWER SELECT2
                    |--------------------------------------------------------------------------
                    */

                    $("#cashBorrower").select2({

                        width:"100%",

                        placeholder:"Search Borrower...",

                        allowClear:true,

                        dropdownParent:$(".swal2-popup")

                    });

                    /*
                    |--------------------------------------------------------------------------
                    | FIRST DETAIL ROW
                    |--------------------------------------------------------------------------
                    */

                    cashierVaultPage.funx.addTransactionRow();

                    /*
                    |--------------------------------------------------------------------------
                    | TRANSACTION TYPE
                    |--------------------------------------------------------------------------
                    */

                    $("#cashTransactionType")

                    .off("change")

                    .on("change",function(){

                        let type = $(this).val();

                        $("#tblCashOutDetails tbody .transactionType")

                        .each(function(){

                            if(!$(this).data("changed")){

                                $(this).val(type);

                            }

                        });

                        cashierVaultPage.funx.computeTransaction();

                    });

                    /*
                    |--------------------------------------------------------------------------
                    | ADD ROW
                    |--------------------------------------------------------------------------
                    */

                    $(document)

                    .off(

                        "click",

                        "#btnAddCashOutRow"

                    )

                    .on(

                        "click",

                        "#btnAddCashOutRow",

                        function(){

                            cashierVaultPage.funx.addTransactionRow();

                        }

                    );

                    /*
                    |--------------------------------------------------------------------------
                    | BORROWER CHECKBOX
                    |--------------------------------------------------------------------------
                    */

                    $("#chkBorrower").on("change",function(){

                        $("#borrowerWrapper").toggleClass(
                            "d-none",
                            !$(this).is(":checked")
                        );

                    });

                    /*
                    |--------------------------------------------------------------------------
                    | BORROWER SELECT
                    |--------------------------------------------------------------------------
                    */

                    // $("#cashBorrower")

                    // .off("change")

                    // .on("change",function(){

                    //     let borrowerId = $(this).val();
                    //     console.log(
                    //         "Borrower:",
                    //         borrowerId
                    //     );
                    //     // Future:
                    //     // Load borrower loans
                    //     // Auto-fill remarks
                    //     // Auto-create transaction details

                    // });

                    /*
                    |--------------------------------------------------------------------------
                    | REMARKS AUTO UPDATE (OPTIONAL)
                    |--------------------------------------------------------------------------
                    */

                    $("#cashBorrower")

                    .on("select2:select",function(){
                        

                        if($("#chkBorrower").is(":checked")){

                            cashierVaultPage.borrowerId = $(this).val();

                        }
                    });

                    /*
                    |--------------------------------------------------------------------------
                    | COMPUTE TOTALS
                    |--------------------------------------------------------------------------
                    */

                    cashierVaultPage.funx.computeTransaction();

                    }
                }).then(function(result){

                if(result.isConfirmed){

                    cashierVaultPage.funx.saveTransaction();

                }

            });

        },

        // showCashTransaction:function(){

        //     Swal.fire({

        //         title:false,

        //         width:1300,

        //         confirmButtonText:"Save Transaction",

        //         confirmButtonColor:"#198754",

        //         cancelButtonText:"Cancel",

        //         showCancelButton:true,

        //         html:`

        //             <div class="container-fluid p-0">

        //                 <div class="card shadow-sm border-0">

        //                     <div class="card-header bg-primary text-white">

        //                         <div class="d-flex justify-content-between align-items-center">

        //                             <h5 class="mb-0">

        //                                 <i class="bi bi-cash-stack me-2"></i>

        //                                 Cash Transaction

        //                             </h5>


        //                         </div>

        //                     </div>

        //                     <div class="card-body">

        //                         <div class="row g-3">

        //                             <div class="col-md-4">

        //                                 <label class="form-label fw-bold d-block text-start">

        //                                     Transaction Type

        //                                 </label>

        //                                 <select

        //                                     id="cashTransactionType"

        //                                     class="form-select">

        //                                     <option value="CASH OUT">

        //                                         🔴 CASH OUT

        //                                     </option>

        //                                     <option value="CASH IN">

        //                                         🟢 CASH IN

        //                                     </option>

        //                                 </select>

        //                             </div>

        //                             <div class="col-md-4">

        //                                 <label class="form-label fw-bold d-block text-start">

        //                                     Reference No.

        //                                 </label>

        //                                 <input

        //                                     type="text"

        //                                     class="form-control"

        //                                     value="AUTO GENERATED"

        //                                     readonly>

        //                             </div>

        //                             <div class="col-md-4">

        //                                 <label class="form-label fw-bold d-block text-start">

        //                                     Time

        //                                 </label>

        //                                  <input
        //                                     type="time"
        //                                     id="transactionTime"
        //                                     class="form-control"                                           ">

        //                             </div>

        //                             <div class="col-md-12">

        //                                 <label class="form-label fw-bold d-block text-start">

        //                                     Remarks

        //                                 </label>

        //                                 <textarea

        //                                     id="cashOutRemarks"

        //                                     class="form-control"

        //                                     rows="2"

        //                                     placeholder="Enter remarks..."></textarea>

        //                             </div>

        //                             <div class="col-md-12">

        //                                     <div class="form-check">

        //                                         <input
        //                                             class="form-check-input"
        //                                             type="checkbox"
        //                                             id="chkBorrower">

        //                                         <label
        //                                             class="form-check-label fw-bold"
        //                                             for="chkBorrower">

        //                                             This transaction is for a Borrower

        //                                         </label>

        //                                     </div>

        //                                 </div>

        //                                 <div
        //                                     class="col-md-12 d-none"
        //                                     id="borrowerWrapper">

        //                                     <label class="form-label fw-bold d-block text-start">

        //                                         Borrower

        //                                     </label>

        //                                     <select
        //                                         id="cashBorrower"
        //                                         class="form-select">

        //                                         <option value="">
        //                                             ${cashierVaultPage.funx.buildBorrowerOptions()}
        //                                         </option>

        //                                     </select>

        //                                 </div>

        //                         </div>

        //                     </div>

        //                 </div>

        //                 <div class="card shadow-sm border-0 mt-3">

        //                     <div class="card-header d-flex justify-content-between align-items-center">

        //                         <h6 class="mb-0">

        //                             <i class="bi bi-list-check me-2"></i>

        //                             Transaction Details

        //                         </h6>

        //                         <button

        //                             type="button"

        //                             class="btn btn-primary btn-sm"

        //                             id="btnAddCashOutRow">

        //                             <i class="bi bi-plus-circle"></i>

        //                             Add Item

        //                         </button>

        //                     </div>

        //                     <div class="card-body p-0">

        //                         <div class="table-responsive">

        //                             <table

        //                                 class="table table-hover table-bordered align-middle mb-0"

        //                                 id="tblCashOutDetails">

        //                                 <thead class="table-light">

        //                                     <tr>

        //                                         <th width="130">

        //                                             Type

        //                                         </th>

        //                                         <th width="170">

        //                                             Reference Type

        //                                         </th>

        //                                         <th width="150">

        //                                             Reference #

        //                                         </th>

        //                                         <th>

        //                                             Description

        //                                         </th>

        //                                         <th width="150"

        //                                             class="text-end">

        //                                             Amount

        //                                         </th>

        //                                         <th width="60">

        //                                         </th>

        //                                     </tr>

        //                                 </thead>

        //                                 <tbody>

        //                                 </tbody>

        //                             </table>

        //                         </div>

        //                     </div>

        //                 </div>

        //                 <div class="row mt-3">

        //                     <div class="col-md-4">

        //                         <div class="card border-success shadow-sm">

        //                             <div class="card-body text-center">

        //                                 <div class="text-muted">

        //                                     Total Cash In

        //                                 </div>

        //                                 <h3

        //                                     class="text-success mb-0"

        //                                     id="lblCashIn">

        //                                     ₱0.00

        //                                 </h3>

        //                             </div>

        //                         </div>

        //                     </div>

        //                     <div class="col-md-4">

        //                         <div class="card border-danger shadow-sm">

        //                             <div class="card-body text-center">

        //                                 <div class="text-muted">

        //                                     Total Cash Out

        //                                 </div>

        //                                 <h3

        //                                     class="text-danger mb-0"

        //                                     id="lblCashOut">

        //                                     ₱0.00

        //                                 </h3>

        //                             </div>

        //                         </div>

        //                     </div>

        //                     <div class="col-md-4">

        //                         <div class="card border-primary shadow-sm">

        //                             <div class="card-body text-center">

        //                                 <div class="text-muted">

        //                                     Net Transaction

        //                                 </div>

        //                                 <h2

        //                                     class="text-primary mb-0"

        //                                     id="lblNetCashOut">

        //                                     ₱0.00

        //                                 </h2>

        //                             </div>

        //                         </div>

        //                     </div>

        //                 </div>

        //             </div>

        //         `,

        //         didOpen:function(){

        //             const now = new Date();

        //             const hours = String(
        //                 now.getHours()
        //             ).padStart(2,"0");

        //             const minutes = String(
        //                 now.getMinutes()
        //             ).padStart(2,"0");

        //             $("#transactionTime").val(
        //                 hours + ":" + minutes
        //             );

        //             cashierVaultPage.funx.addTransactionRow();
        //                         $("#cashTransactionType")

        //             .off("change")

        //             .on("change",function(){

        //                 let type =

        //                     $(this).val();

        //                 $("#tblCashOutDetails tbody .transactionType")

        //                 .each(function(){

        //                     if(

        //                         !$(this).data("changed")

        //                     ){

        //                         $(this).val(type);

        //                     }

        //                 });

        //                 cashierVaultPage.funx.computeTransaction();

        //             });

        //             $(document)

        //             .off(

        //                 "click",

        //                 "#btnAddCashOutRow"

        //             )

        //             .on(

        //                 "click",

        //                 "#btnAddCashOutRow",

        //                 function(){

        //                     cashierVaultPage.funx.addTransactionRow();

        //                 });

        //             $("#chkBorrower")

        //             .off("change")

        //             .on("change", function () {

        //                 if ($(this).is(":checked")) {

        //                     $("#borrowerWrapper")
        //                         .removeClass("d-none");

        //                     $("#cashBorrower")
        //                         .select2({
        //                             width: "100%",
        //                             placeholder: "Search Borrower...",
        //                             allowClear: true,
        //                             dropdownParent: $(".swal2-container")
        //                         });

        //                 } else {

        //                     $("#borrowerWrapper")
        //                         .addClass("d-none");

        //                     $("#cashBorrower")
        //                         .val(null)
        //                         .trigger("change");

        //                 }

        //             });

        //             cashierVaultPage.funx.computeTransaction();



        //         }

        //     }).then(function(result){

        //         if(result.isConfirmed){

        //             cashierVaultPage.funx.saveTransaction();

        //         }

        //     });

        // },
        addTransactionRow:function(){

            const refNo =

                cashierVaultPage.funx.generateReferenceNo();

            let defaultType =

                $("#cashTransactionType").val()

                ||

                "CASH OUT";

            let html = `

                <tr>

                    <td>

                        <select

                            class="form-select transactionType">

                            <option value="CASH OUT"

                                ${defaultType=="CASH OUT"?"selected":""}>

                                CASH OUT

                            </option>

                            <option value="CASH IN"

                                ${defaultType=="CASH IN"?"selected":""}>

                                CASH IN

                            </option>

                        </select>

                    </td>

                    <td>

                        <select

                            class="form-select referenceType">

                            <option value="">

                                -

                            </option>

                            <option value="Long Term Loan">

                                Long Term Loan

                            </option>

                            <option value="SALARY PRINCIPAL + INTEREST">

                                SALARY PRINCIPAL + INTEREST

                            </option>

                            <option value="Short Term Loan">

                                Short Term Loan

                            </option>

                            <option value="Bracket Loan">

                                Bracket Loan

                            </option>
                            <option value="Bracket Loan">

                                Bracket Loan

                            </option>

                            <option value="Partial Payment">

                                Partial Payment

                            </option>

                            <option value="Principal Payment">

                                Principal Payment

                            </option>

                            <option value="Full Payment">

                                Full Payment

                            </option>

                            <option value="Expense">

                                Expense

                            </option>

                            <option value="SUKLI">

                                SUKLI

                            </option>

                            <option value="Deposit">

                                Deposit

                            </option>

                            <option value="HARDSHIP">

                                HARDSHIP

                            </option>

                            <option value="DIFFERENTIAL">

                                DIFFERENTIAL

                            </option>

                            <option value="MONETIZATION">

                                MONETIZATION

                            </option>

                            <option value="LOYALTY">

                                LOYALTY

                            </option>

                            <option value="REFUND">

                                REFUND

                            </option>

                            <option value="ANNIVERSARY BONUS">

                                ANNIVERSARY BONUS

                            </option>

                            <option value="MEDICAL ALLOWANCE">

                                MEDICAL ALLOWANCE

                            </option>

                            <option value="TAX REFUND">

                                TAX REFUND

                            </option>

                            <option value="TEACHERS CASH GIFT">

                                TEACHERS CASH GIFT

                            </option>


                            <option value="Expense">

                                OTHERS

                            </option>

                        </select>

                    </td>

                    <td>

                        <input

                            type="text"

                            class="form-control referenceId"

                            value="${refNo}"

                            readonly>

                    </td>

                    <td>

                        <input

                            type="text"

                            class="form-control description"

                            placeholder="Description">

                    </td>

                    <td>

                        <input

                            type="number"

                            class="form-control amount text-end"

                            value="0"

                            min="0"

                            step="0.01">

                    </td>

                    <td class="text-center">

                        <button

                            type="button"

                            class="btn btn-danger btn-sm btnRemoveRow">

                            <i class="bi bi-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

            $("#tblCashOutDetails tbody")

            .append(html);

            cashierVaultPage.funx.bindTranasctionEvents();

            cashierVaultPage.funx.computeTransaction();

        },
        generateReferenceNo:function(){

            let counter = $("#tblCashOutDetails tbody tr").length + 1;

            let today = new Date();

            let date =
                today.getFullYear() +
                String(today.getMonth()+1).padStart(2,'0') +
                String(today.getDate()).padStart(2,'0');

            return `CO-${date}-${String(counter).padStart(4,'0')}`;
        },
        bindTranasctionEvents:function(){

            /*
            |--------------------------------------------------------------------------
            | REMOVE ROW
            |--------------------------------------------------------------------------
            */

            $(".btnRemoveRow")

            .off("click")

            .on("click",function(){

                $(this)

                .closest("tr")

                .remove();

                cashierVaultPage.funx.computeTransaction();

            });

            /*
            |--------------------------------------------------------------------------
            | COMPUTE
            |--------------------------------------------------------------------------
            */

            $(".amount")

            .off("keyup change")

            .on("keyup change",function(){

                cashierVaultPage.funx.computeTransaction();

            });

            /*
            |--------------------------------------------------------------------------
            | TRANSACTION TYPE
            |--------------------------------------------------------------------------
            */

            $(".transactionType")

            .off("change")

            .on("change",function(){

                $(this)

                .data(

                    "changed",

                    true

                );

                cashierVaultPage.funx.computeTransaction();

            });

            /*
            |--------------------------------------------------------------------------
            | REFERENCE TYPE
            |--------------------------------------------------------------------------
            */

            $(".referenceType")

            .off("change")

            .on("change",function(){

                let row =

                    $(this)

                    .closest("tr");

                let referenceType =

                    $(this)

                    .val();

                if(

                    !row.find(".description").val()

                ){

                    row.find(".description")

                    .val(referenceType);

                }

            });

        },
        computeTransaction:function(){

            let cashOut = 0;

            let cashIn = 0;

            $("#tblCashOutDetails tbody tr")

            .each(function(){

                let amount =

                    parseFloat(

                        $(this)

                        .find(".amount")

                        .val()

                    ) || 0;

                let type =

                    String(

                        $(this)

                        .find(".transactionType")

                        .val()

                    )

                    .toUpperCase();

                if(type == "CASH OUT"){

                    cashOut += amount;

                }
                else if(type == "CASH IN"){

                    cashIn += amount;

                }

            });

            let net = cashOut - cashIn;

            /*
            |--------------------------------------------------------------------------
            | TOTALS
            |--------------------------------------------------------------------------
            */

            $("#lblCashOut")

            .html(

                cashierVaultPage.funx.money(

                    cashOut

                )

            );

            $("#lblCashIn")

            .html(

                cashierVaultPage.funx.money(

                    cashIn

                )

            );

            $("#lblNetCashOut")

            .html(

                cashierVaultPage.funx.money(

                    Math.abs(net)

                )

            );

            /*
            |--------------------------------------------------------------------------
            | HEADER TRANSACTION
            |--------------------------------------------------------------------------
            */

            let headerType =

                $("#cashTransactionType")

                .val();

            if(headerType == "CASH OUT"){

                $("#lblNetCashOut")

                .closest("tr")

                .removeClass(

                    "table-success"

                )

                .addClass(

                    "table-warning"

                );

                $("#lblNetCashOut")

                .closest("tr")

                .find("th:first")

                .html(

                    "Net Cash Out"

                );

            }
            else{

                $("#lblNetCashOut")

                .closest("tr")

                .removeClass(

                    "table-warning"

                )

                .addClass(

                    "table-success"

                );

                $("#lblNetCashOut")

                .closest("tr")

                .find("th:first")

                .html(

                    "Net Cash In"

                );

            }

            /*
            |--------------------------------------------------------------------------
            | NEGATIVE CHECK
            |--------------------------------------------------------------------------
            */

            if(net < 0){

                $("#lblNetCashOut")

                .removeClass(

                    "text-success"

                )

                .addClass(

                    "text-danger"

                );

            }
            else{

                $("#lblNetCashOut")

                .removeClass(

                    "text-danger"

                )

                .addClass(

                    "text-success"

                );

            }

        },
        saveTransaction:function(){

            let details = [];

            let cashOut = 0;

            let cashIn = 0;

            /*
            |--------------------------------------------------------------------------
            | DETAILS
            |--------------------------------------------------------------------------
            */

            $("#tblCashOutDetails tbody tr").each(function(){

                let type =

                    $(this)

                    .find(".transactionType")

                    .val();

                let amount =

                    parseFloat(

                        $(this)

                        .find(".amount")

                        .val()

                    ) || 0;

                if(type == "CASH OUT"){

                    cashOut += amount;

                }else{

                    cashIn += amount;

                }

                details.push({

                    transaction_type:

                        type,

                    reference_type:

                        $(this)

                        .find(".referenceType")

                        .val(),

                    reference_id:

                        $(this)

                        .find(".referenceId")

                        .val(),

                    description:

                        $(this)

                        .find(".description")

                        .val(),

                    amount:

                        amount

                });

            });

            /*
            |--------------------------------------------------------------------------
            | VALIDATION
            |--------------------------------------------------------------------------
            */

            if(details.length == 0){

                Swal.fire(

                    "Warning",

                    "Please add at least one transaction.",

                    "warning"

                );

                return;

            }

            let netAmount =

                Math.abs(

                    cashOut - cashIn

                );

            if(netAmount < 0){

                Swal.fire(

                    "Warning",

                    "Net transaction amount must be greater than zero.",

                    "warning"

                );

                return;

            }

            let headerType =

                $("#cashTransactionType")

                .val();

            /*
            |--------------------------------------------------------------------------
            | PAYLOAD
            |--------------------------------------------------------------------------
            */  
            let userData = JSON.parse(

                localStorage.getItem("userdata") || "{}"

            );

            let payload = {

                cashier_id:
                cashierVaultPage.funx.getSelectedCashier(),
                borrower_id:cashierVaultPage.borrowerId,
                transaction_time :

                    $("#transactionTime")

                    .val(),
                business_date :

                    $("#cashOutBusinessDate")

                    .val(),

                transaction_type :

                    headerType,
                business_date :$("#filterBusinessDate").val(),

                reference_no : "",

                remarks :

                    $("#cashOutRemarks")

                    .val(),
                created_by : userData.userid,

                amount :

                    netAmount,

                details :

                    details

            };

            /*
            |--------------------------------------------------------------------------
            | CONFIRM
            |--------------------------------------------------------------------------
            */

            Swal.fire({

                title:

                    "Confirm Transaction",

                html:

                    "<b>Transaction Type:</b> " +

                    headerType +

                    "<br><br>" +

                    "<b>Net Amount:</b> " +

                    cashierVaultPage.funx.money(

                        netAmount

                    ),

                icon:"question",

                showCancelButton:true,

                confirmButtonText:"Save",

                confirmButtonColor:"#198754"

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                /*
                |--------------------------------------------------------------------------
                | SAVE
                |--------------------------------------------------------------------------
                */

                jsAddon.display.ajaxRequest({

                    url:

                        cashierVaultApi,

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

                    Swal.fire({

                        icon:"success",

                        title:"Success",

                        text:response.message,

                        timer:1800,

                        showConfirmButton:false

                    });

                    cashierVaultPage.funx.loadSummary();

                    cashierVaultPage.funx.loadTransactions();

                });

            });

        },
        
    }

};

/*
|--------------------------------------------------------------------------
| PAGE READY
|--------------------------------------------------------------------------
*/

$(function(){

    cashierVaultPage.init();
    /*
    |--------------------------------------------------------------------------
    | CASH IN
    |--------------------------------------------------------------------------
    */

    $("#btnCashIn")

    .off("click")

    .on("click", function () {

        cashierVaultPage.funx.showCashIn();

    });

    /*
    |--------------------------------------------------------------------------
    | CASH OUT
    |--------------------------------------------------------------------------
    */

    $("#btnTransaction")

    .off("click")

    .on("click", function () {

        cashierVaultPage.funx.showCashTransaction();

    });

    
    $(document)

    .off(

        "click",

        "#btnAddCashOutRow"

    )

    .on(

        "click",

        "#btnAddCashOutRow",

        function(){

            cashierVaultPage.funx.addTransactionRow();

        }

    );
    $(document)

    .off(

        "click",

        "#btnDailyClose"

    )

    .on(

        "click",

        "#btnDailyClose",

        function(){

            cashierVaultPage.funx.openDailyClose();

        }

    );
    $("#filterCashier")
    .off("change")
    .on("change", function () {

        cashierVaultPage.funx.loadTransactions();

        cashierVaultPage.funx.loadSummary();

    });

    $(document)

    .off("input", ".denominationQty")

    .on("input", ".denominationQty", function(){

        cashierVaultPage.funx.calculateCoins();

    });

    $(document)

    .off("click",".btnDelete")

    .on("click",".btnDelete",function(){

        let id = $(this).data("id");
        Swal.fire({

            icon:"warning",

            title:"Delete Transaction?",

            html:`

                This transaction will be marked as

                <b>VOID</b>.

                <br><br>

                Continue?

            `,

            showCancelButton:true,

            confirmButtonColor:"#dc3545",

            confirmButtonText:"Delete"

        }).then(function(result){

            if(!result.isConfirmed){

                return;

            }

            jsAddon.display.ajaxRequest({

                url:cashierVaultApi,

                type:"DELETE",

                payload:JSON.stringify({
                    cashier_id:cashierVaultPage.funx.getSelectedCashier(),
                    cashier_transaction_id:id,
                    business_date:$("#filterBusinessDate").val(),

                }),

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

                    title:"Deleted",

                    text:response.message,

                    timer:1500,

                    showConfirmButton:false

                });

                cashierVaultPage.funx.loadTransactions();

                cashierVaultPage.funx.loadSummary();

            });

        });

    });

});