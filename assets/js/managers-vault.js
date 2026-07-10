let managerVaultPage = {

    table: null,

    transactions: [],

    cashiers: [],

    dashboard: {},

    init:function(){

        managerVaultPage.funx
            .loadCashiers();

        managerVaultPage.funx
            .loadTransactions();

    },

    funx:{

        /*
        |--------------------------------------------------------------------------
        | LOAD CASHIERS
        |--------------------------------------------------------------------------
        */

        loadCashiers:function(){

            jsAddon.display.ajaxRequest({

                url:userApi,

                type:'GET',

                payload:{

                    role:'CASHIER'

                },

                dataType:'json'

            }).then(function(response){

                if(response.isError)
                    return;

                managerVaultPage.cashiers =
                    response.data;

                let html =
                    '<option value="">All Cashiers</option>';

                $.each(

                    response.data,

                    function(_,row){

                        html += `

                            <option
                                value="${row.userid}">

                                ${row.firstname}
                                ${row.lastname}

                            </option>

                        `;

                    }

                );

                $("#filterCashier")
                    .html(html);
                $("#transferCashier")
                    .html(html);

            });

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD MANAGER VAULT MANUAL
        |--------------------------------------------------------------------------
        */

        loadTransactions_manual:function(){

            jsAddon.display.ajaxRequest({

                url:managerVaultApi,

                type:'GET',

                payload:{

                    business_date:
                        $("#filterBusinessDate").val(),

                    cashier_id:
                        $("#filterCashier").val(),

                    search:
                        $("#txtSearch").val()

                },

                dataType:'json'

            }).then(function(response){

                if(response.isError){

                    Swal.fire(

                        "Error",

                        response.message,

                        "error"

                    );

                    return;

                }

                managerVaultPage.transactions =
                    response.data;

                managerVaultPage.funx.summary(
                    response.data
                );

                managerVaultPage.funx.renderTable(
                    response.data
                );

            });

        },
        /*
        |--------------------------------------------------------------------------
        | LOAD MANAGER VAULT SERVER SIDE
        |--------------------------------------------------------------------------
        */
        
        loadTransactions:function(){

            if(

                managerVaultPage.table

            ){

                managerVaultPage.table.destroy();

            }

            managerVaultPage.table =

            $("#tblManagerVault")

            .DataTable({

                processing:true,

                serverSide:true,

                destroy:true,

                responsive:true,

                searching:false,

                ordering:true,

                pageLength:10,

                order:[[0,"desc"]], // Latest manager_transaction_id first

                ajax:function(data, callback){

                    jsAddon.display.ajaxRequest({

                        url: managerVaultApi,

                        type: "GET",

                        payload:{

                            draw:data.draw,

                            start:data.start,

                            length:data.length,

                            orderColumn:
                                data.columns[data.order[0].column].data,

                            orderDir:
                                data.order[0].dir,

                            search:
                                $("#txtSearch").val(),

                            cashier_id:
                                $("#filterCashier").val(),

                            transaction_type:
                                $("#filterTransaction").val(),

                            business_date:
                                $("#filterBusinessDate").val()

                        },

                        dataType:"json"

                    }).then(function(response){

                        managerVaultPage.transactions = {};

                        $.each(

                            response.data,

                            function(_, row){

                                managerVaultPage.transactions[

                                    row.manager_transaction_id

                                ] = row;

                            }

                        );

                       

                        callback({

                            draw: response.draw,

                            recordsTotal: response.recordsTotal,

                            recordsFiltered: response.recordsFiltered,

                            data: response.data

                        });

                    });

                },

                columns:[

                    {
                        data:"manager_transaction_id"
                    },

                    {
                        data:"created_at"
                    },

                    {
                        data:"reference_no"
                    },

                    {
                        data:"cashier_name"
                    },

                    {
                        data:"transaction_type",
                        render:function(data){
                            return managerVaultPage.funx.transactionBadge(data);
                        }
                    },

                    {
                        data:"amount",
                        className:"text-end",
                        render:function(data){
                            return managerVaultPage.funx.money(data);
                        }
                    },

                    {
                        data:"balance_before",
                        className:"text-end",
                        render:function(data){
                            return managerVaultPage.funx.money(data);
                        }
                    },

                    {
                        data:"balance_after",
                        className:"text-end",
                        render:function(data){
                            return managerVaultPage.funx.money(data);
                        }
                    },

                    {
                        data:"created_by_name"
                    },

                    {
                        data:null,
                        orderable:false,
                        searchable:false,
                        render:function(data,type,row){
                            return managerVaultPage.funx.actionButtons(row);
                        }
                    }

                ]

            });

            /*
            |--------------------------------------------------------------------------
            | LOAD SUMMARY
            |--------------------------------------------------------------------------
            */

            managerVaultPage
                .funx
                .loadSummary();

        },

        loadSummary:function(){

            jsAddon.display.ajaxRequest({

                url:managerVaultSummaryApi,

                type:"GET",

                payload:{

                    business_date:
                        $("#filterBusinessDate").val(),

                    cashier_id:
                        $("#filterCashier").val(),

                    transaction_type:
                        $("#filterTransaction").val(),

                    search:
                        $("#txtSearch").val()

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

                let data = response.data;

                $("#managerBalance").html(

                    managerVaultPage.funx.money(

                        data.current_balance || 0

                    )

                );

                $("#totalCashIn").html(

                    managerVaultPage.funx.money(

                        data.cash_in || 0

                    )

                );

                $("#totalCashOut").html(

                    managerVaultPage.funx.money(

                        data.cash_out || 0

                    )

                );

                $("#totalTransfer").html(

                    managerVaultPage.funx.money(

                        data.transfer || 0

                    )

                );

                $("#totalReturn").html(

                    managerVaultPage.funx.money(

                        data.return_to_vault || 0

                    )

                );

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        summary:function(data){

            let currentBalance = 0;

            let totalCashIn = 0;

            let totalCashOut = 0;

            let totalTransfer = 0;

            let totalReturn = 0;

            if(data.length){

                currentBalance =
                    parseFloat(
                        data[0].balance_after || 0
                    );

            }

            $.each(data,function(_,row){

                let amount = parseFloat(
                    row.amount || 0
                );

                switch(

                    String(
                        row.transaction_type
                    ).toUpperCase()

                ){

                    case "CASH_IN":

                        totalCashIn += amount;

                    break;

                    case "CASH_OUT":

                        totalCashOut += amount;

                    break;

                    case "TRANSFER":

                        totalTransfer += amount;


                    break;

                    case "RETURN_FROM_CASHIER":

                        totalReturn += amount;

                        // also cash entering manager vault
                        totalCashIn += amount;

                    break;

                }

            });

            $("#managerBalance").html(

                managerVaultPage.funx.money(
                    currentBalance
                )

            );

            $("#totalCashIn").html(

                managerVaultPage.funx.money(
                    totalCashIn
                )

            );

            $("#totalCashOut").html(

                managerVaultPage.funx.money(
                    totalCashOut
                )

            );

            $("#totalTransfer").html(

                managerVaultPage.funx.money(
                    totalTransfer
                )

            );

        },

        showCashIn:function(){

            $("#cashInReference").val("");

            $("#cashInAmount").val("");

            $("#cashInRemarks").val("");

            new bootstrap.Modal(

                document.getElementById(

                    "cashInModal"

                )

            ).show();

        },

        saveCashIn:function(){

            let payload = {

                transaction_type:"CASH_IN",

                amount:

                    $("#cashInAmount").val(),

                remarks:

                    $("#cashInRemarks").val(),


            };

            if(payload.amount==""){

                Swal.fire(

                    "Warning",

                    "Amount is required.",

                    "warning"

                );

                return;

            }

            Swal.fire({

                title:"Cash In?",

                text:"Confirm Cash In.",

                icon:"question",

                showCancelButton:true,

                confirmButtonText:"Save"

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

                        title:"Cash In Successful",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVaultPage.funx
                        .loadTransactions();

                });

            });

        },

      

        /*
        |--------------------------------------------------------------------------
        | FORMAT MONEY
        |--------------------------------------------------------------------------
        */

        money:function(value){

            return "₱"+

            parseFloat(

                value || 0

            ).toLocaleString(

                undefined,

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            );

        },
                /*
        |--------------------------------------------------------------------------
        | STATUS BADGE
        |--------------------------------------------------------------------------
        */

        getStatusBadge:function(status){

            let badge = "secondary";

            switch(

                String(status)
                .toUpperCase()

            ){

                case "PENDING":

                    badge = "warning";

                break;

                case "APPROVED":

                    badge = "success";

                break;

                case "REJECTED":

                    badge = "danger";

                break;

                case "CANCEL_REQUESTED":

                    badge = "info";

                break;

                case "CANCELLED":

                    badge = "secondary";

                break;

            }

            return `

                <span class="badge bg-${badge}">

                    ${status}

                </span>

            `;

        },

        /*
        |--------------------------------------------------------------------------
        | ACTION BUTTONS
        |--------------------------------------------------------------------------
        */

        actionButtons:function(row){
            
            let userdata = JSON.parse(

                localStorage.getItem("userdata") || "{}"

            );

            let html = `

                <button
                    type="button"
                    class="btn btn-primary btnView"
                    data-id="${row.manager_transaction_id}"
                    title="View">

                    <i class="bi bi-eye"></i>

                </button>

            `;

            if(

                Number(userdata.userid) ===

                Number(row.created_by)

            ){

                html += `

                    <button
                        type="button"
                        class="btn btn-danger btnDelete"
                        data-id="${row.manager_transaction_id}"
                        title="Delete">

                        <i class="bi bi-trash"></i>

                    </button>

                `;

            }

            return html;

        },

        /*
        |--------------------------------------------------------------------------
        | RENDER TABLE
        |--------------------------------------------------------------------------
        */

        renderTable:function(data){

            if(managerVaultPage.table){

                managerVaultPage.table.destroy();

            }

            let html='';

            $.each(

                data,

                function(_,row){

                    html+=`

                    <tr>

                        <td>

                            ${row.manager_transaction_id}

                        </td>

                        <td>

                            ${row.created_at}

                        </td>

                        <td>

                            ${row.reference_no}

                        </td>

                        <td>

                            ${row.cashier_name || "-"}

                        </td>

                        <td>

                            ${managerVaultPage.funx.transactionBadge(

                                row.transaction_type

                            )}

                        </td>

                        <td class="text-end">

                            ${managerVaultPage.funx.money(

                                row.amount

                            )}

                        </td>

                        <td class="text-end">

                            ${managerVaultPage.funx.money(

                                row.balance_before

                            )}

                        </td>

                        <td class="text-end">

                            ${managerVaultPage.funx.money(

                                row.balance_after

                            )}

                        </td>

                        <td>

                            ${managerVaultPage.funx.actionButtons(

                                row

                            )}

                        </td>

                    </tr>

                    `;

                }

            );

            $("#tblManagerVault tbody")

                .html(html);

            managerVaultPage.table =

                $("#tblManagerVault")

                .DataTable({

                    destroy:true,

                    responsive:true,

                    pageLength:10,

                    ordering:true,

                    searching:true,

                    autoWidth:false,

                    order:[[0,"desc"]]

                });

        },

        /*
        |--------------------------------------------------------------------------
        | TRANSACTION BADGE
        |--------------------------------------------------------------------------
        */

        transactionBadge:function(type){

            switch(

                String(type)
                .toUpperCase()

            ){

                case "CASH_IN":

                    return `

                        <span class="badge bg-success">

                            <i class="bi bi-arrow-down-circle-fill"></i>

                            Cash In

                        </span>

                    `;

                case "RETURN_FROM_CASHIER":

                case "RETURN_TO_VAULT":

                    return `

                        <span class="badge bg-primary">

                            <i class="bi bi-safe-fill"></i>

                            Return to Vault

                        </span>

                    `;

                case "CASH_OUT":

                    return `

                        <span class="badge bg-danger">

                            <i class="bi bi-arrow-up-circle-fill"></i>

                            Cash Out

                        </span>

                    `;

                case "TRANSFER_TO_CASHIER":

                case "TRANSFER":

                    return `

                        <span class="badge bg-warning text-dark">

                            <i class="bi bi-arrow-left-right"></i>

                            Transfer

                        </span>

                    `;

                default:

                    return `

                        <span class="badge bg-secondary">

                            ${type || "-"}

                        </span>

                    `;

            }

        },

        /*
        |--------------------------------------------------------------------------
        | REFRESH
        |--------------------------------------------------------------------------
        */

        refresh:function(){

            managerVaultPage.funx
                .loadTransactions();

        },

        /*
        |--------------------------------------------------------------------------
        | FILTER
        |--------------------------------------------------------------------------
        */

        filter:function(){

            managerVaultPage.funx
                .loadTransactions();

        },
        
        /*
        |--------------------------------------------------------------------------
        | VIEW TRANSACTION
        |--------------------------------------------------------------------------
        */
        viewTransaction:function(id){

            jsAddon.display.ajaxRequest({

                url: managerVaultTransactionDetailsApi,

                type: "GET",

                payload:{

                    manager_transaction_id:id

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

                /*
                |--------------------------------------------------------------------------
                | RESPONSE
                |--------------------------------------------------------------------------
                */

                let row =

                    response.data.transaction;

                let denominations =

                    response.data.denominations ?? [];

                /*
                |--------------------------------------------------------------------------
                | APPROVAL
                |--------------------------------------------------------------------------
                */
                let isReturn =

                        String(row.transaction_type)
                            .toUpperCase() == "RETURN TO VAULT";
                        
                let canApprove =

                    String(
                        row.transaction_type
                    ).toUpperCase() == "RETURN TO VAULT"

                    &&

                    String(
                        row.status
                    ).toUpperCase() == "PENDING";

                /*
                |--------------------------------------------------------------------------
                | DENOMINATION HTML
                |--------------------------------------------------------------------------
                */

                let denominationHtml = "";

                /*
                |--------------------------------------------------------------------------
                | BUILD DENOMINATION TABLE
                |--------------------------------------------------------------------------
                */

                if(denominations.length > 0){

                    denominationHtml = `

                        <div class="mt-3">

                            <h6 class="fw-bold text-primary">

                                Denomination Breakdown

                            </h6>

                            <table class="table table-bordered table-striped table-sm">

                                <thead class="table-dark">

                                    <tr>

                                        <th width="180">

                                            Denomination

                                        </th>

                                        <th class="text-center" width="120">

                                            Quantity

                                        </th>

                                        <th class="text-end">

                                            Total

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                    `;

                    $.each(

                        denominations,

                        function(_,denom){

                            denominationHtml += `

                                <tr>

                                    <td>

                                        ${managerVaultPage.funx.money(
                                            denom.denomination
                                        )}

                                    </td>

                                    <td class="text-center">

                                        ${parseInt(
                                            denom.quantity ?? 0
                                        ).toLocaleString()}

                                    </td>

                                    <td class="text-end">

                                        ${managerVaultPage.funx.money(
                                            denom.total
                                        )}

                                    </td>

                                </tr>

                            `;

                        }

                    );

                    denominationHtml += `

                                </tbody>

                            </table>

                        </div>

                    `;

                }

                else{

                    denominationHtml = `

                        <div class="alert alert-secondary mt-3">

                            <i class="bi bi-info-circle"></i>

                            No denomination details found.

                        </div>

                    `;

                }

                /*
                |--------------------------------------------------------------------------
                | SWEET ALERT HTML
                |--------------------------------------------------------------------------
                */

                let cashDetails = `

                    <div class="card mb-3">

                        <div class="card-header bg-success text-white">

                            <strong>

                                Cash Details

                            </strong>

                        </div>

                        <div class="card-body p-2">

                            <table class="table table-sm mb-0">

                                <tr>

                                    <th width="180">

                                        Amount

                                    </th>

                                    <td class="text-end">

                                        ${managerVaultPage.funx.money(row.amount)}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Balance Before

                                    </th>

                                    <td class="text-end">

                                        ${managerVaultPage.funx.money(row.balance_before)}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Balance After

                                    </th>

                                    <td class="text-end">

                                        ${managerVaultPage.funx.money(row.balance_after)}

                                    </td>

                                </tr>

                                ${

                                    isReturn

                                    ?

                                    `

                                    <tr>

                                        <th>

                                            Expected Cash

                                        </th>

                                        <td class="text-end">

                                            ${managerVaultPage.funx.money(row.expected_cash)}

                                        </td>

                                    </tr>

                                    <tr>

                                        <th>

                                            Actual Cash

                                        </th>

                                        <td class="text-end">

                                            ${managerVaultPage.funx.money(row.actual_cash)}

                                        </td>

                                    </tr>

                                    <tr>

                                        <th>

                                            Returned Amount

                                        </th>

                                        <td class="text-end">

                                            ${managerVaultPage.funx.money(row.returned_amount)}

                                        </td>

                                    </tr>

                                    <tr>

                                        <th>

                                            Variance

                                        </th>

                                        <td class="text-end">

                                            ${managerVaultPage.funx.money(row.variance)}

                                        </td>

                                    </tr>

                                    `

                                    :

                                    ""

                                }

                            </table>

                        </div>

                    </div>

                `;

                let tranasctionInfo = `
                <div class="card mb-3">

                    <div class="card-header bg-primary text-white">

                        <strong>

                            Transaction Information

                        </strong>

                    </div>

                    <div class="card-body p-2">

                        <table class="table table-sm table-borderless mb-0">

                            <tr>

                                <th width="180">

                                    Reference #

                                </th>

                                <td>

                                    ${row.reference_no ?? "-"}

                                </td>

                            </tr>

                            <tr>

                                <th>

                                    Transaction

                                </th>

                                <td>

                                    ${managerVaultPage.funx.transactionBadge(
                                        row.transaction_type
                                    )}

                                </td>

                            </tr>

                            <tr>

                                <th>

                                    Business Date

                                </th>

                                <td>

                                    ${row.created_at ?? "-"}

                                </td>

                            </tr>

                            ${

                                isReturn

                                ?

                                `

                                <tr>

                                    <th>

                                        Cashier

                                    </th>

                                    <td>

                                        ${row.cashier_name ?? "-"}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Status

                                    </th>

                                    <td>

                                        ${managerVaultPage.funx.getStatusBadge(
                                            row.status
                                        )}

                                    </td>

                                </tr>

                                `

                                :

                                ""

                            }

                        </table>

                    </div>

                </div>
                `

                let approveInfo = `
                    <div class="card mb-3">

                        <div class="card-header bg-warning">

                            <strong>

                                Approval Information

                            </strong>

                        </div>

                        <div class="card-body p-2">

                            <table class="table table-sm table-borderless mb-0">

                                <tr>

                                    <th width="180">

                                        Created By

                                    </th>

                                    <td>

                                        ${row.created_by_name ?? "-"}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Created At

                                    </th>

                                    <td>

                                        ${row.created_at ?? "-"}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Approved By

                                    </th>

                                    <td>

                                        ${row.approved_by_name ?? "-"}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Approved At

                                    </th>

                                    <td>

                                        ${row.approved_at ?? "-"}

                                    </td>

                                </tr>

                                <tr>

                                    <th>

                                        Closed At

                                    </th>

                                    <td>

                                        ${row.closed_at ?? "-"}

                                    </td>

                                </tr>

                            </table>

                        </div>

                    </div>
                `;

                let dailyCloseRemarks = `<strong>

                    Daily Close Remarks

                </strong>

                <div class="border rounded p-2">

                    ${row.daily_close_remarks ?? "-"}

                </div>`;

                let html = `<div class="container-fluid text-start">

                    <!-- ===================================================== -->
                    <!-- TRANSACTION INFORMATION -->
                    <!-- ===================================================== -->

                    ${tranasctionInfo}

                    <!-- ===================================================== -->
                    <!-- CASH DETAILS -->
                    <!-- ===================================================== -->

                    ${cashDetails}

                    <!-- ===================================================== -->
                    <!-- APPROVAL INFORMATION -->
                    <!-- ===================================================== -->

                    ${ isReturn ? approveInfo : ""}

                    <!-- ===================================================== -->
                    <!-- REMARKS -->
                    <!-- ===================================================== -->

                    <div class="card mb-3">

                        <div class="card-header bg-secondary text-white">

                            <strong>

                                Remarks

                            </strong>

                        </div>

                        <div class="card-body">

                            <strong>

                                Transaction Remarks

                            </strong>

                            <div class="border rounded p-2 mb-3">

                                ${row.remarks ?? "-"}

                            </div>

                            ${isReturn ? dailyCloseRemarks : ""}

                        </div>

                    </div>

                    <!-- ===================================================== -->
                    <!-- DENOMINATION -->
                    <!-- ===================================================== -->

                    ${denominationHtml}

                </div>

                `;
                /*
                |--------------------------------------------------------------------------
                | SHOW SWEET ALERT
                |--------------------------------------------------------------------------
                */

                Swal.fire({

                    title:

                        '<b>Manager Vault Transaction Details</b>',

                    html:

                        html,

                    width:

                        "950px",

                    showConfirmButton:

                        true,

                    confirmButtonText:
                        'Close',

                    confirmButtonColor:

                        "#198754",


                    focusConfirm:

                        false

                }).then(function(result){

                    

                });

            });

        },
        

        showCashOut:function(){

            $("#cashOutAmount").val("");

            $("#cashOutRemarks").val("");

            new bootstrap.Modal(

                document.getElementById(

                    "cashOutModal"

                )

            ).show();

        },

        saveCashOut:function(){

            let payload = {

                transaction_type:"CASH_OUT",

                amount:

                    $("#cashOutAmount").val(),

                remarks:

                    $("#cashOutRemarks").val(),

            };

            if(

                payload.amount == ""

            ){

                Swal.fire(

                    "Warning",

                    "Amount is required.",

                    "warning"

                );

                return;

            }

            Swal.fire({

                title:"Cash Out?",

                text:"Are you sure you want to proceed?",

                icon:"question",

                showCancelButton:true,

                confirmButtonText:"Save"

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:managerVaultApi,

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
                        )
                        .hide();

                    Swal.fire({

                        icon:"success",

                        title:"Cash Out Successful",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVaultPage
                        .table
                        .ajax
                        .reload();

                    managerVaultPage
                        .funx
                        .loadSummary();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | CLEAR MODAL
        |--------------------------------------------------------------------------
        */

        clearModal:function(){

            $("#viewReferenceNo").val("");

            $("#viewBusinessDate").val("");

            $("#viewCashier").val("");

            $("#viewTransactionType").val("");

            $("#viewAmount").val("");

            $("#viewStatus").val("");

            $("#expectedCash").html("");

            $("#returnedCash").html("");

            $("#variance").html("");

            $("#tblDenomination tbody")

                .html("");

            $("#tblBreakdown tbody")

                .html("");

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD DENOMINATION
        |--------------------------------------------------------------------------
        */

        loadDenomination:function(
            dailyCloseId
        ){

            jsAddon.display.ajaxRequest({

                url:

                    managerVaultDenominationApi +

                    "/" +

                    dailyCloseId,

                type:"GET",

                dataType:"json"

            }).then(function(response){

                if(response.isError){

                    $("#tblDenomination tbody")

                    .html(

                        '<tr><td colspan="3" class="text-center">No denomination found.</td></tr>'

                    );

                    return;

                }

                let html = '';

                let total = 0;

                $.each(

                    response.data,

                    function(_,row){

                        let amount =

                            parseFloat(
                                row.denomination
                            )

                            *

                            parseFloat(
                                row.quantity
                            );

                        total += amount;

                        html += `

                            <tr>

                                <td>

                                    ${managerVaultPage.funx.money(

                                        row.denomination

                                    )}

                                </td>

                                <td class="text-center">

                                    ${row.quantity}

                                </td>

                                <td class="text-end">

                                    ${managerVaultPage.funx.money(

                                        amount

                                    )}

                                </td>

                            </tr>

                        `;

                    }

                );

                html += `

                    <tr class="table-success">

                        <th colspan="2" class="text-end">

                            TOTAL

                        </th>

                        <th class="text-end">

                            ${managerVaultPage.funx.money(total)}

                        </th>

                    </tr>

                `;

                $("#tblDenomination tbody")

                    .html(html);

            });

        },
                /*
        |--------------------------------------------------------------------------
        | SHOW APPROVE
        |--------------------------------------------------------------------------
        */

        showApprove:function(
            dailyCloseId
        ){

            let row =

                managerVaultPage
                .transactions
                .find(

                    x =>

                    x.cashier_daily_close_id ==

                    dailyCloseId

                );

            if(!row){

                Swal.fire(

                    "Error",

                    "Daily Close not found.",

                    "error"

                );

                return;

            }

            $("#approveDailyCloseId")

                .val(
                    row.cashier_daily_close_id
                );

            $("#approveCashier")

                .val(
                    row.cashier_name
                );

            $("#approveBusinessDate")

                .val(
                    row.business_date
                );

            $("#approveReturnedAmount")

                .val(
                    row.returned_amount
                );

            $("#approveRemarks")

                .val("");

            new bootstrap.Modal(

                document.getElementById(

                    "approveModal"

                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | APPROVE DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        approveDailyClose:function(){

            let payload = {

                cashier_daily_close_id:

                    $("#approveDailyCloseId")
                    .val(),

                remarks:

                    $("#approveRemarks")
                    .val()

            };

            Swal.fire({

                title:

                    "Approve Daily Close?",

                text:

                    "The returned cash will be added to the Manager Vault.",

                icon:

                    "question",

                showCancelButton:true,

                confirmButtonColor:"#198754",

                confirmButtonText:

                    "Approve"

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:

                        approveDailyCloseApi,

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

                            "approveModal"

                        )

                    ).hide();

                    Swal.fire({

                        icon:"success",

                        title:"Approved",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVaultPage
                    .funx
                    .loadTransactions();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW REJECT
        |--------------------------------------------------------------------------
        */

        showReject:function(
            dailyCloseId
        ){

            let row =

                managerVaultPage
                .transactions
                .find(

                    x =>

                    x.cashier_daily_close_id ==

                    dailyCloseId

                );

            if(!row){

                Swal.fire(

                    "Error",

                    "Daily Close not found.",

                    "error"

                );

                return;

            }

            $("#rejectDailyCloseId")

                .val(

                    row.cashier_daily_close_id

                );

            $("#rejectReason")

                .val("");

            new bootstrap.Modal(

                document.getElementById(

                    "rejectModal"

                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | REJECT DAILY CLOSE
        |--------------------------------------------------------------------------
        */

        rejectDailyClose:function(){

            let remarks =

                $("#rejectReason")

                .val()

                .trim();

            if(remarks==""){

                Swal.fire(

                    "Warning",

                    "Please provide a reason.",

                    "warning"

                );

                return;

            }

            let payload = {

                cashier_daily_close_id:

                    $("#rejectDailyCloseId")

                    .val(),

                remarks:

                    remarks

            };

            Swal.fire({

                title:

                    "Reject Daily Close?",

                icon:

                    "warning",

                showCancelButton:true,

                confirmButtonColor:"#dc3545",

                confirmButtonText:

                    "Reject"

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:

                        rejectDailyCloseApi,

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

                            "rejectModal"

                        )

                    ).hide();

                    Swal.fire({

                        icon:"success",

                        title:"Rejected",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVaultPage
                    .funx
                    .loadTransactions();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW CANCEL REQUEST
        |--------------------------------------------------------------------------
        */

        showCancel:function(
            dailyCloseId
        ){

            $("#cancelDailyCloseId")

                .val(
                    dailyCloseId
                );

            $("#cancelReason")

                .val("");

            new bootstrap.Modal(

                document.getElementById(

                    "cancelModal"

                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | APPROVE CANCEL REQUEST
        |--------------------------------------------------------------------------
        */

        approveCancel:function(){

            let payload={

                cashier_daily_close_id:

                    $("#cancelDailyCloseId")
                    .val(),

                remarks:

                    $("#cancelReason")
                    .val()

            };

            Swal.fire({

                title:

                    "Approve cancellation?",

                text:

                    "This will reverse the Manager Vault and Cashier Vault balances.",

                icon:

                    "warning",

                showCancelButton:true,

                confirmButtonColor:"#198754",

                confirmButtonText:

                    "Approve"

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:

                        approveCancelApi,

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

                            "cancelModal"

                        )

                    ).hide();

                    Swal.fire({

                        icon:"success",

                        title:"Cancelled",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVaultPage.funx
                        .loadTransactions();

                });

            });

        },
        showTransfer:function(){

            $("#transferCashier").val("");

            $("#transferAmount").val("");

            $("#transferRemarks").val("");

            new bootstrap.Modal(

                document.getElementById(

                    "transferModal"

                )

            ).show();

        },
        saveTransfer:function(){

            let payload={

                cashier_id:

                    $("#transferCashier").val(),

                amount:

                    $("#transferAmount").val(),

                remarks:

                    $("#transferRemarks").val(),

            };

            if(payload.cashier_id==""){

                Swal.fire(

                    "Warning",

                    "Select a cashier.",

                    "warning"

                );

                return;

            }

            if(payload.amount==""){

                Swal.fire(

                    "Warning",

                    "Amount is required.",

                    "warning"

                );

                return;

            }

            Swal.fire({

                title:"Transfer Cash?",

                text:"Transfer fund to cashier?",

                icon:"question",

                showCancelButton:true

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:managerTransanferToCashierApi,

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

                                "transferModal"

                            )

                        )

                        .hide();

                    Swal.fire({

                        icon:"success",

                        title:"Transfer Successful",

                        timer:1500,

                        showConfirmButton:false

                    });

                    managerVaultPage.table.ajax.reload();

                    managerVaultPage.funx.loadSummary();

                });

            });

        },
        applyFilters:function(){

            if(

                managerVaultPage.table

            ){

                managerVaultPage.table.ajax.reload();

            }

            managerVaultPage.funx.loadSummary();

        },
     
    }

};

$(function(){

    managerVaultPage.init();

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */

    $(document)

    .on(

        "click",

        ".btnView",

        function(){
            managerVaultPage.funx.viewTransaction(

                $(this).data("id")

            );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | APPROVE
    |--------------------------------------------------------------------------
    */

    $(document)

    .off(
        "click",
        ".btn-approve"
    )

    .on(

        "click",

        ".btn-approve",

        function(){

            managerVaultPage
            .funx
            .showApprove(

                $(this)
                .data("id")

            );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | REJECT
    |--------------------------------------------------------------------------
    */

    $(document)

    .off(
        "click",
        ".btn-reject"
    )

    .on(

        "click",

        ".btn-reject",

        function(){

            managerVaultPage
            .funx
            .showReject(

                $(this)
                .data("id")

            );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | CANCEL
    |--------------------------------------------------------------------------
    */

    $(document)

    .off(
        "click",
        ".btn-cancel"
    )

    .on(

        "click",

        ".btn-cancel",

        function(){

            managerVaultPage
            .funx
            .showCancel(

                $(this)
                .data("id")

            );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | APPROVE SAVE
    |--------------------------------------------------------------------------
    */

    $("#btnApproveClose")

    .off("click")

    .on(

        "click",

        function(){

            managerVaultPage
            .funx
            .approveDailyClose();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | REJECT SAVE
    |--------------------------------------------------------------------------
    */

    $("#btnRejectClose")

    .off("click")

    .on(

        "click",

        function(){

            managerVaultPage
            .funx
            .rejectDailyClose();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | APPROVE CANCEL
    |--------------------------------------------------------------------------
    */

    $("#btnApproveCancel")

    .off("click")

    .on(

        "click",

        function(){

            managerVaultPage
            .funx
            .approveCancel();

        }

    );

   
   

   

   

    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */

    $("#btnRefresh")

    .off("click")

    .on(

        "click",

        function(){

            $("#txtSearch")
                .val("");

            $("#filterCashier")
                .val("");

            $("#filterStatus")
                .val("");

            managerVaultPage
            .funx
            .refresh();

        }

    );

    $("#btnCashIn")

        .off("click")

        .on(

            "click",

            function(){

                managerVaultPage
                .funx
                .showCashIn();

            }

        );

        $("#btnSaveCashIn")

        .off("click")

        .on(

            "click",

            function(){

                managerVaultPage
                .funx
                .saveCashIn();

            }

        );

        $("#btnCashOut")

            .off("click")

            .on(

                "click",

                function(){

                    managerVaultPage
                        .funx
                        .showCashOut();

                }

            );

            $("#btnSaveCashOut")

            .off("click")

            .on(

                "click",

                function(){

                    managerVaultPage
                        .funx
                        .saveCashOut();

                }

            );

            $("#btnTransfer")

                .off("click")

                .on(

                    "click",

                    function(){

                        managerVaultPage.funx.showTransfer();

                    }

                );

                $("#btnSaveTransfer")

                .off("click")

                .on(

                    "click",

                    function(){

                        managerVaultPage.funx.saveTransfer();

                    }

                );

                   $("#filterBusinessDate")

    .off("change")

    .on(

        "change",

        function(){

            managerVaultPage
                .funx
                .applyFilters();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | CASHIER
    |--------------------------------------------------------------------------
    */

    $("#filterCashier")

    .off("change")

    .on(

        "change",

        function(){

            managerVaultPage
                .funx
                .applyFilters();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | TRANSACTION
    |--------------------------------------------------------------------------
    */

    $("#filterTransaction")

    .off("change")

    .on(

        "change",

        function(){

            managerVaultPage
                .funx
                .applyFilters();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | SEARCH BUTTON
    |--------------------------------------------------------------------------
    */

    $("#btnSearch")

    .off("click")

    .on(

        "click",

        function(){

            managerVaultPage
                .funx
                .applyFilters();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | ENTER KEY
    |--------------------------------------------------------------------------
    */

    $("#txtSearch")

    .off("keypress")

    .on(

        "keypress",

        function(e){

            if(

                e.which == 13

            ){

                managerVaultPage
                    .funx
                    .applyFilters();

            }

        }

    );

    $(document)

        .off("click",".btnDelete")

        .on("click",".btnDelete",function(){

            let transactionId =

                $(this).data("id");

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

                confirmButtonText:"Delete",

                confirmButtonColor:"#dc3545",

                cancelButtonText:"Cancel"

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:managerVaultCashInApi,

                    type:"DELETE",

                    payload:JSON.stringify({

                        manager_transaction_id:transactionId
                    }),

                    dataType:"json"

                })

                .then(function(response){

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

                    managerVaultPage.funx.reloadTable();
                    managerVaultPage.funx.loadSummary();

                });

            });

        });

});