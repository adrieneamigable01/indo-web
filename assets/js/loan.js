let loanPage = {

    table: null,

    loans: [],

    loanProducts: [],

    init: function(){

        loanPage.funx.loadLoanProducts();

        loanPage.funx.loadLoans();

        // $("#btnSearchLoan").click(function(){

        //     loanPage.funx.loadLoans();

        // });

        // $("#btnRefreshLoan").click(function(){

        //     loanPage.funx.loadLoans();

        // });

        // $("#txtSearch").keypress(function(e){

        //     if(e.which == 13){

        //         loanPage.funx.loadLoans();

        //     }

        // });

    },

    funx:{

        /*
        |--------------------------------------------------------------------------
        | LOAD LOAN PRODUCTS
        |--------------------------------------------------------------------------
        */

        loadLoanProducts:function(){

            jsAddon.display.ajaxRequest({

                url:loanproductsApi,

                type:'GET',

                dataType:'json'

            }).then(function(response){

                if(response.isError)
                    return;

                loanPage.loanProducts =
                    response.data;

                let html =
                    '<option value="">All Products</option>';

                $.each(
                    response.data,
                    function(_,row){

                        html += `

                            <option
                                value="${row.product_name}">

                                ${row.product_name}

                            </option>

                        `;

                    }
                );

                $("#filterProduct")
                .html(html);

            });

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD LOANS
        |--------------------------------------------------------------------------
        */

        // loadLoans:function(){

        //     jsAddon.display.ajaxRequest({

        //         url:loanApi,

        //         type:'GET',

        //         payload:{
        //             status:
        //                 $("#filterStatus").val(),
        //         },

        //         dataType:'json'

        //     }).then(function(response){

        //         if(response.isError){

        //             Swal.fire(

        //                 "Error",

        //                 response.message,

        //                 "error"

        //             );

        //             return;

        //         }

        //         loanPage.loans =
        //             response.data;

        //         loanPage.funx.summary(
        //             response.data
        //         );

        //         loanPage.funx.renderTable(
        //             response.data
        //         );

        //     });

        // },

        loadLoans: function () {

            if (loanPage.table) {

                loanPage.table.destroy();

            }

            loanPage.table = $("#loanTable").DataTable({

                processing: true,

                serverSide: true,

                destroy: true,

                responsive: true,

                autoWidth: false,

                scrollX: true,

                searching: false,

                ordering: true,

                pageLength: 10,

                order: [[0, "desc"]],

                ajax: function (data, callback) {

                    jsAddon.display.ajaxRequest({

                        url: loanApi,

                        type: "GET",

                        payload: {

                            draw: data.draw,

                            start: data.start,

                            length: data.length,

                            orderColumn:
                                data.columns[data.order[0].column].data,

                            orderDir:
                                data.order[0].dir,

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

                        loanPage.loans = {};
                        

                        $.each(response.data, function (_, row) {

                            loanPage.loans[row.loan_id] = row;

                        });

                        // Update summary cards using current page data
                        loanPage.funx.summary(response.data);

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
                        data: "loan_id"
                    },

                    {
                        data: "borrower_name"
                    },

                    {
                        data: "product_name"
                    },
                    {
                        data: "loan_amount",
                        render: function (data) {

                            return jsAddon.display.money(data);

                        }
                    },
                    {
                        data: "approved_interest_rate",
                        render: function(data) {

                            if (data === null || data === undefined || data === "") {
                                return "-";
                            }

                            return data;

                        }
                    },
                    {
                        data: "loan_terms"
                    },
                    {
                        data: "status",
                        render: function (data) {

                            return loanPage.funx.statusBadge(data);

                        }
                    },

                    {
                        data: null,
                        orderable: false,
                        searchable: false,
                        render: function (data, type, row) {

                            return loanPage.funx.actionButtons(row);

                        }
                    }

                ]

            });

        },
        statusBadge: function(status) {

            switch ((status || "").toUpperCase()) {

                case "RELEASED":
                    return `
                        <span class="badge bg-success">
                            <i class="bi bi-check-circle-fill"></i>
                            RELEASED
                        </span>
                    `;

                case "PENDING":
                    return `
                        <span class="badge bg-warning text-dark">
                            <i class="bi bi-hourglass-split"></i>
                            PENDING
                        </span>
                    `;

                case "APPROVED":
                    return `
                        <span class="badge bg-primary">
                            <i class="bi bi-patch-check-fill"></i>
                            APPROVED
                        </span>
                    `;

                case "DECLINED":
                    return `
                        <span class="badge bg-danger">
                            <i class="bi bi-x-circle-fill"></i>
                            DECLINED
                        </span>
                    `;

                case "CANCELLED":
                    return `
                        <span class="badge bg-secondary">
                            <i class="bi bi-slash-circle-fill"></i>
                            CANCELLED
                        </span>
                    `;

                case "COMPLETED":
                case "PAID":
                    return `
                        <span class="badge bg-info text-dark">
                            <i class="bi bi-cash-stack"></i>
                            ${status}
                        </span>
                    `;

                default:
                    return `
                        <span class="badge bg-light text-dark border">
                            ${status || "N/A"}
                        </span>
                    `;
            }

        },
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

                case "DISAPPROVED":

                    badge = "danger";

                break;

                case "RELEASED":

                    badge = "primary";

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
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        summary:function(data){

            let pending = 0;

            let approved = 0;

            let released = 0;

            let disapproved = 0;

            $.each(
                data,
                function(_,loan){

                    switch(

                        String(
                            loan.status
                        ).toUpperCase()

                    ){

                        case 'PENDING':

                            pending++;

                        break;

                        case 'APPROVED':

                            approved++;

                        break;

                        case 'RELEASED':

                            released++;

                        break;

                        case 'DISAPPROVED':

                            disapproved++;

                        break;

                    }

                }
            );

            $("#pendingCount")
            .text(pending);

            $("#approvedCount")
            .text(approved);

            $("#releasedCount")
            .text(released);

            $("#disapprovedCount")
            .text(disapproved);

        },

        /*
        |--------------------------------------------------------------------------
        | TABLE
        |--------------------------------------------------------------------------
        */

        renderTable:function(data){

            if(
                loanPage.table
            ){

                loanPage.table.destroy();

            }

            let html = '';

            $.each(
                data,
                function(_,loan){

                    let badge = '';

                    switch(

                        String(
                            loan.status
                        ).toUpperCase()

                    ){

                        case 'PENDING':

                            badge =

                            '<span class="badge bg-warning">PENDING</span>';

                        break;

                        case 'APPROVED':

                            badge =

                            '<span class="badge bg-success">APPROVED</span>';

                        break;

                        case 'DISAPPROVED':

                            badge =

                            '<span class="badge bg-danger">DISAPPROVED</span>';

                        break;

                        case 'RELEASED':

                            badge =

                            '<span class="badge bg-primary">RELEASED</span>';

                        break;

                    }

                    html += `

                        <tr>

                            <td>

                                ${loan.loan_id}

                            </td>

                            <td>

                                ${loan.borrower_name}

                            </td>

                            <td>

                                ${loan.product_name}

                            </td>

                            <td>

                                ₱${parseFloat(
                                    loan.loan_amount || 0
                                ).toLocaleString()}

                            </td>

                            <td>

                                ${loan.approved_interest_rate} %

                            </td>

                            <td>

                                ${loan.loan_terms}

                            </td>

                            <td>

                                ${loan.created_at}

                            </td>

                            <td>

                                ${badge}

                            </td>

                            <td>

                                ${loanPage.funx.actionButtons(
                                    loan
                                )}

                            </td>

                        </tr>

                    `;

                }
            );

            $("#loanTable tbody")
            .html(html);

            loanPage.table =

            $("#loanTable")
            .DataTable({

                destroy:true,

                responsive:true,

                pageLength:10,

                ordering:true,

                searching:true,

                lengthMenu:[
                    10,
                    25,
                    50,
                    100
                ]

            });

        },

        /*
        |--------------------------------------------------------------------------
        | ACTION BUTTONS
        |--------------------------------------------------------------------------
        */

        actionButtons: function (loan) {

            let menu = `
                <li>
                    <a class="dropdown-item btn-view"
                    href="javascript:void(0)"
                    data-id="${loan.loan_id}">
                        <i class="bi bi-eye me-2 text-info"></i>
                        View
                    </a>
                </li>
            `;

            switch (String(loan.status).toUpperCase()) {

                case "PENDING":

                    menu += `
                        <li>
                            <a class="dropdown-item btn-approve"
                            href="javascript:void(0)"
                            data-id="${loan.loan_id}">
                                <i class="bi bi-check-circle me-2 text-success"></i>
                                Approve
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item btn-disapprove"
                            href="javascript:void(0)"
                            data-id="${loan.loan_id}">
                                <i class="bi bi-x-circle me-2 text-danger"></i>
                                Disapprove
                            </a>
                        </li>
                    `;
                    break;

                case "APPROVED":

                    menu += `
                        <li>
                            <a class="dropdown-item btn-release"
                            href="javascript:void(0)"
                            data-id="${loan.loan_id}">
                                <i class="bi bi-cash-stack me-2 text-primary"></i>
                                Release Loan
                            </a>
                        </li>
                    `;
                    break;
            }

            return `
                <div class="dropdown">
                    <button
                        class="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">

                        <i class="bi bi-three-dots"></i>
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">
                        ${menu}
                    </ul>
                </div>
            `;
        },
        /*
        |--------------------------------------------------------------------------
        | VIEW LOAN
        |--------------------------------------------------------------------------
        */
        viewLoan:function(loanId){

            let loan = loanPage.loans[String(loanId)];

            if(
                !loan
            ){

                Swal.fire(

                    "Error",

                    "Loan not found.",

                    "error"

                );

                return;

            }

            let html = `

                <div class="row">

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Borrower

                            </label>

                            <h6>

                                ${loan.borrower_name}

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Loan Product

                            </label>

                            <h6>

                                ${loan.product_name}

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Loan Amount

                            </label>

                            <h6>

                                ₱${parseFloat(
                                    loan.loan_amount || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2
                                    }
                                )}

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Net Proceeds

                            </label>

                            <h6>

                                ₱${parseFloat(
                                    loan.net_proceeds || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2
                                    }
                                )}

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Interest Rate

                            </label>

                            <h6>

                                ${loan.approved_interest_rate} %

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Processing Fee

                            </label>

                            <h6>

                                ${loan.approved_processing_fee} %

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Loan Terms

                            </label>

                            <h6>

                                ${loan.loan_terms}

                                Months

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="loan-info">

                            <label>

                                Status

                            </label>

                            <h6>

                                ${loan.status}

                            </h6>

                        </div>

                    </div>

                    <div class="col-md-12">

                        <div class="loan-info">

                            <label>

                                Purpose

                            </label>

                            <h6>

                                ${loan.loan_purpose}

                            </h6>

                        </div>

                    </div>

                </div>

            `;

            /*
            |--------------------------------------------------------------------------
            | COLLATERAL
            |--------------------------------------------------------------------------
            */

            if(

                loan.collaterals &&

                loan.collaterals.length > 0

            ){

                html += `

                    <hr>

                    <h5>

                        Collateral

                    </h5>

                    <table class="table table-bordered">

                        <thead>

                            <tr>

                                <th>

                                    Primary Card

                                </th>

                                <th>

                                    Number

                                </th>

                                <th>

                                    Secondary Card

                                </th>

                                <th>

                                    Number

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                `;

                $.each(

                    loan.collaterals,

                    function(

                        _,

                        row

                    ){

                        html += `

                            <tr>

                                <td>

                                    ${row.primary_card_name}

                                </td>

                                <td>

                                    ${row.primary_card_number}

                                </td>

                                <td>

                                    ${row.secondary_card_name}

                                </td>

                                <td>

                                    ${row.secondary_card_number}

                                </td>

                            </tr>

                        `;

                    }

                );

                html += `

                        </tbody>

                    </table>

                `;

            }

            $("#loanDetails")

            .html(

                html

            );

            new bootstrap.Modal(

                document.getElementById(

                    "viewLoanModal"

                )

            ).show();

        },
        /*
        |--------------------------------------------------------------------------
        | SHOW APPROVE MODAL
        |--------------------------------------------------------------------------
        */

        showApprove:function(loanId){

            let loan = loanPage.loans[String(loanId)];

            if(!loan){

                Swal.fire(

                    "Error",

                    "Loan not found.",

                    "error"

                );

                return;

            }

            $("#approveLoanId")
            .val(
                loan.loan_id
            );

            $("#approvedAmount")
            .val(
                loan.loan_amount
            );

            $("#approvedInterest")
            .val(
                loan.approved_interest_rate
            );

            $("#approvedProcessingFee")
            .val(
                loan.approved_processing_fee
            );

            $("#approvedTerms")
            .val(
                loan.loan_terms
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
        | APPROVE LOAN
        |--------------------------------------------------------------------------
        */

        approveLoan:function(){

            let payload = {

                loan_id:

                    $("#approveLoanId")
                    .val(),

                loan_amount:

                    $("#approvedAmount")
                    .val(),

                approved_interest_rate:

                    $("#approvedInterest")
                    .val(),

                approved_processing_fee:

                    $("#approvedProcessingFee")
                    .val(),

                loan_terms:

                    $("#approvedTerms")
                    .val(),

                approveRemarks:

                    $("#approveRemarks")
                    .val()

            };

            Swal.fire({

                title:

                    "Approve Loan?",

                text:

                    "This loan will be marked as APPROVED.",

                icon:

                    "question",

                showCancelButton:true,

                confirmButtonText:

                    "Approve",

                confirmButtonColor:

                    "#198754"

            }).then(

                function(result){
                   
                    if(!result.isConfirmed)
                        return;

                    jsAddon.display.ajaxRequest({

                        url:

                            approveLoanApi,

                        type:

                            "POST",

                        payload:

                            payload,

                        dataType:

                            "json"

                    }).then(

                        function(response){

                            if(

                                response.isError

                            ){

                                Swal.fire(

                                    "Error",

                                    response.message,

                                    "error"

                                );

                                return;

                            }

                            bootstrap.Modal.getInstance(

                                document.getElementById(
                                    "approveModal"
                                )

                            ).hide();

                            Swal.fire({

                                icon:

                                    "success",

                                title:

                                    "Loan Approved",

                                timer:1500,

                                showConfirmButton:false

                            });

                            loanPage.funx
                            .loadLoans();

                        }

                    );

                }

            );

        },
        /*
        |--------------------------------------------------------------------------
        | SHOW DISAPPROVE MODAL
        |--------------------------------------------------------------------------
        */

        showDisapprove:function(loanId){

            let loan = loanPage.loans[String(loanId)];

            if(!loan){

                Swal.fire(
                    "Error",
                    "Loan not found.",
                    "error"
                );

                return;
            }

            $("#disapproveLoanId")
                .val(loan.loan_id);

            $("#disapproveReason")
                .val("");

            new bootstrap.Modal(

                document.getElementById(
                    "disapproveModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | DISAPPROVE LOAN
        |--------------------------------------------------------------------------
        */

        disapproveLoan:function(){

            let reason =
                $("#disapproveReason")
                .val()
                .trim();

            if(reason == ""){

                Swal.fire(

                    "Warning",

                    "Please provide a reason.",

                    "warning"

                );

                return;

            }

            let payload = {

                loan_id:
                    $("#disapproveLoanId")
                    .val(),

                disapproveReason:
                    reason

            };

            Swal.fire({

                title:"Disapprove Loan?",

                text:"This action cannot be undone.",

                icon:"warning",

                showCancelButton:true,

                confirmButtonColor:"#dc3545",

                confirmButtonText:"Disapprove"

            }).then(function(result){

                if(!result.isConfirmed)
                    return;

                jsAddon.display.ajaxRequest({

                    url:rejectLoanApi,

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
                            "disapproveModal"
                        )

                    ).hide();

                    Swal.fire({

                        icon:"success",

                        title:"Loan Disapproved",

                        timer:1500,

                        showConfirmButton:false

                    });

                    loanPage.funx.loadLoans();

                });

            });

        },
        /*
        |--------------------------------------------------------------------------
        | SHOW RELEASE MODAL
        |--------------------------------------------------------------------------
        */

        showRelease:function(loanId){

            let loan = loanPage.loans[String(loanId)];

            if(!loan){

                Swal.fire(
                    "Error",
                    "Loan not found.",
                    "error"
                );

                return;

            }

            $("#releaseLoanId")
                .val(
                    loan.loan_id
                );

            let loanAmount =
                parseFloat(
                    loan.loan_amount || 0
                );

            let processingRate =
                parseFloat(
                    loan.approved_processing_fee || 0
                );

            let interestRate =
                parseFloat(
                    loan.approved_interest_rate || 0
                );

            let processingAmount =
                loanAmount *
                (
                    processingRate / 100
                );

            let interestAmount =
                loanAmount *
                (
                    interestRate / 100
                );

            let netProceeds =
                loanAmount -
                processingAmount -
                interestAmount;

            $("#releaseLoanAmount")
                .text(
                    "₱" +
                    loanAmount.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )
                );

            $("#releaseProcessing")
                .text(
                    "₱" +
                    processingAmount.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )
                );

            $("#releaseInterest")
                .text(
                    "₱" +
                    interestAmount.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )
                );

            $("#releaseNet")
                .text(
                    "₱" +
                    netProceeds.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )
                );

            new bootstrap.Modal(

                document.getElementById(
                    "releaseModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | RELEASE LOAN
        |--------------------------------------------------------------------------
        */

        releaseLoan:function(){

            let payload = {
                
                loan_id:
                    $("#releaseLoanId")
                    .val()

            };

            Swal.fire({

                title:
                    "Release Loan?",

                html:
                    `
                    This will:

                    <br><br>

                    ✔ Release the loan

                    <br>

                    ✔ Generate loan schedule

                    <br>

                    ✔ Allow payment collection

                    `,

                icon:
                    "question",

                showCancelButton:true,

                confirmButtonText:
                    "Release",

                confirmButtonColor:
                    "#0d6efd"

            }).then(function(result){

                if(
                    !result.isConfirmed
                ){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:
                        releaseLoanApi,

                    type:
                        "POST",

                    payload:
                        payload,

                    dataType:
                        "json"

                }).then(function(response){

                    if(
                        response.isError
                    ){

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
                            "releaseModal"
                        )

                    ).hide();

                    Swal.fire({

                        icon:
                            "success",

                        title:
                            "Loan Released",

                        text:
                            "Loan schedule generated successfully.",

                        timer:
                            1800,

                        showConfirmButton:
                            false

                    });

                    loanPage.funx
                        .loadLoans();

                });

            });

        },
    },
        
    

    
    

};

$(function(){

    loanPage.init();
    /*
    |--------------------------------------------------------------------------
    | EVENTS
    |--------------------------------------------------------------------------
    */

    /*
        |--------------------------------------------------------------------------
        | VIEW
        |--------------------------------------------------------------------------
        */

    $(document)

    .off("click",".btn-view")

    .on(
        "click",
        ".btn-view",
        function(){

            let loanId =

                $(this)
                .data("id");

            loanPage.funx
            .viewLoan(
                loanId
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | APPROVE
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click",".btn-approve")

    .on(
        "click",
        ".btn-approve",
        function(){

            let loanId =

                $(this)
                .data("id");

            loanPage.funx
            .showApprove(
                loanId
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click",".btn-view")

    .on(
        "click",
        ".btn-view",
        function(){

            let loanId =

                $(this)
                .data("id");

            loanPage.funx
            .viewLoan(
                loanId
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | APPROVE
    |--------------------------------------------------------------------------
    */

    $(document)

    .off("click",".btn-approve")

    .on(
        "click",
        ".btn-approve",
        function(){

            let loanId =

                $(this)
                .data("id");

            loanPage.funx
            .showApprove(
                loanId
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | RELEASE BUTTON
    |--------------------------------------------------------------------------
    */

    $(document)

    .off(
        "click",
        ".btn-release"
    )

    .on(

        "click",

        ".btn-release",

        function(){

            loanPage.funx
                .showRelease(

                    $(this)
                    .data("id")

                );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | RELEASE SAVE
    |--------------------------------------------------------------------------
    */

    $("#btnReleaseLoan")

    .off("click")

    .on(

        "click",

        function(){

            loanPage.funx
                .releaseLoan();

        }

    );
    $("#filterStatus")

    .off("change")

    .on(

        "change",

        function(){

           loanPage.funx.loadLoans();
        }

    );

    /*
    |--------------------------------------------------------------------------
    | APPROVE SAVE
    |--------------------------------------------------------------------------
    */

    $("#btnApproveLoan")

    .off("click")

    .on(

        "click",

        function(){

            loanPage.funx
            .approveLoan();

        }

    );

    /*
    |--------------------------------------------------------------------------
    | DISAPPROVE BUTTON
    |--------------------------------------------------------------------------
    */

    $(document)

    .off(
        "click",
        ".btn-disapprove"
    )

    .on(

        "click",

        ".btn-disapprove",

        function(){

            loanPage.funx
            .showDisapprove(

                $(this).data("id")

            );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | SAVE DISAPPROVE
    |--------------------------------------------------------------------------
    */

    $("#btnDisapproveLoan")

    .off("click")

    .on(

        "click",

        function(){

            loanPage.funx
            .disapproveLoan();

        }

    );

    $("#filterProduct")

        .off("change")

        .on(

            "change",

            function(){

                let value =
                    $(this).val();

                loanPage.table
                    .column(2)
                    .search(value)
                    .draw();

            }

        );

});

