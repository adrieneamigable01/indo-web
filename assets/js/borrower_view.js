const borrowerId =
    new URLSearchParams(
        window.location.search
    ).get('id');

let cacheKey = "borrower_list";
let isFetching = false;
var borrowerList = [];
borrowerView = {

    loans:[],
    salary:[],
    loanProducts:[],
    settlements:[],
    payments :[],
    allPayments :[],
    bonusCollections :[],

    init:()=>{

        $("#btnEditBorrower").attr(
            "href",
            "borrower_form.php?id=" +
            borrowerId
        );

        let cached = localStorage.getItem(cacheKey);

        if (cached) {

            try {
                borrowerList = JSON.parse(
                    LZString.decompressFromUTF16(cached)
                );

                borrowerView.funx.fillBorrowerDropdown(borrowerList);
                borrowerView.funx.fetchProducts();
                borrowerView.funx.fillYears();

            } catch (e) {
                console.log("Cache corrupted");
                localStorage.removeItem(cacheKey);
            }
        }


        borrowerView.funx.getBorrower();

        borrowerView.funx.getLoans();
        borrowerView.funx.getPaymentReport();
        borrowerView.funx.fetchBorrower();

        
    },

    funx:{
        fetchBorrower:() => {
      
            if (isFetching == true) return;
            isFetching = true;
            $.ajax({
                url: 'https://bplcapi.doitcebutech.com/borrower/all?is_active=1',
                type: 'GET',
                dataType: 'json',
                success: function (response) {

                    let newData = response.all;
                    
                    borrowerList = newData;

                    let compressed = LZString.compressToUTF16(
                        JSON.stringify(newData)
                    );

                    let oldCache = localStorage.getItem(cacheKey);

                    // only update if changed
                    if (oldCache !== compressed) {
                        localStorage.setItem(cacheKey, compressed);

                        borrowerView.funx.fillBorrowerDropdown(newData);
                    }

                },
                complete: function () {
                    isFetching = false;
                },
                error: function () {
                    console.log("API failed");
                }
            });
        },
        fetchProducts:() => {
             jsAddon.display.ajaxRequest({
                type:'GET',
                url: `${loanproductsApi}`,
                dataType:'json'
            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:response.message

                    });

                    return;

                }

                borrowerView.loanProducts = response.data;

            });
           
        },
        fillBorrowerDropdown:(data) => {

            let $select = $("#bplc_borrower");

            $select.empty();

            $select.append(`
                <option value="">SELECT A BORROWER</option>
            `);

            $.each(data, function (k, v) {

                let fullName = `${v.firstname || ''} ${v.lastname || ''}`;

                $select.append(`
                    <option
                        value="${v.borrower_id}"
                        data-lastname="${v.lastname}"
                        data-firstname="${v.firstname}"
                        data-middlename="${v.middlename}"
                        data-mobile="${v.mobile}"
                        data-email="${v.email}"
                        data-present_address="${v.present_address}"
                        data-birthdate="${v.birthdate}"
                        data-income="${v.income}"
                        data-gender="${v.gender}"
                        data-position_type="${v.position_type}">
                        ${fullName}
                    </option>
                `);
            });
            $("#bplc_borrower").select2({
                width: 'resolve',
                dropdownParent: $('#borrowerModal'),
                placeholder: "Search borrower...",
                allowClear: true
            });
        },
        fillLoanProductDropdown: () => {

            let $select = $("#loan_product_id");

            if ($select.hasClass("select2-hidden-accessible")) {
                $select.select2('destroy');
            }

            $select.empty();

            $select.append(`
                <option value="">SELECT A PRODUCT</option>
            `);

            $.each(borrowerView.loanProducts, function (k, v) {

                $select.append(`
                    <option
                        value="${v.loan_product_id}"
                        data-description="${v.description || ''}"
                        data-interest_rate="${v.interest_rate || 0}"
                        data-processing_fee_percent="${v.processing_fee_percent || 0}"
                        data-penalty_rate="${v.penalty_rate || 0}"
                        data-max_term="${v.max_term || 0}"
                        data-min_amount="${v.min_amount || 0}"
                        data-max_amount="${v.max_amount || 0}">
                        ${v.product_name}
                    </option>
                `);
            });

            setTimeout(function () {

                $select.select2({
                    width: '100%',
                    dropdownParent: $('#loanModal'),
                    placeholder: "Search Loan Products...",
                    allowClear: true
                });

                // Product selected
                $select.off('change.loanProduct').on('change.loanProduct', function () {

                    let selected = $(this).find(':selected');

                    let interestRate = parseFloat(selected.data('interest_rate')) || 0;
                    let processingFeePercent = parseFloat(selected.data('processing_fee_percent')) || 0;
                    let maxTerm = parseInt(selected.data('max_term')) || 0;
                    let minAmount = parseFloat(selected.data('min_amount')) || 0;
                    let maxAmount = parseFloat(selected.data('max_amount')) || 0;

                    // Populate fields
                    $("#approved_interest_rate").val(interestRate);
                    $("#loan_terms").val(maxTerm);

                    // Set loan amount restrictions
                    $("#loan_amount")
                        .attr('min', minAmount)
                        .attr('max', maxAmount)
                        .attr('placeholder', `Min: ${minAmount} | Max: ${maxAmount}`);

                    // Store processing fee %
                    $("#approved_processing_fee")
                        .data('processing_fee_percent', processingFeePercent);

                    // Trigger calculation if amount already entered
                    $("#loan_amount").trigger('keyup');
                });

            }, 100);
        },
        getBorrower:()=>{

            jsAddon.display.ajaxRequest({
                type:'GET',
                url: `${borrowerApi}?borrower_id=${borrowerId}`,
                dataType:'json'
            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:response.message

                    });

                    return;

                }

                borrowerView.funx.renderBorrower(
                    response.data[0]
                );

            });

        },
        getLoans:()=>{

            jsAddon.display.ajaxRequest({

                type:'GET',
                url: `${loanApi}?borrower_id=${borrowerId}&status=released`,
                dataType:'json'

            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:response.message

                    });

                    return;

                }

                borrowerView.loans =
                    response.data;
                borrowerView.salary =
                    response.salary;
                borrowerView.allPayments =
                    response.payments;

                borrowerView.funx.renderLoans(
                    response.data
                );

                borrowerView.funx.summary(
                    response.data
                );

            });

        },
        
        getPaymentReport:()=>{

            let year =
                $("#schedule_year").val();

            return jsAddon.display.ajaxRequest({

                type:'GET',

                url:get_payment_report,

                payload:{
                    borrower_id:borrowerId,
                    year:year
                },

                dataType:'json'

            })
            .then((response)=>{

                borrowerView.salary =
                    response.salary || [];

                borrowerView.settlements =
                    response.settlements || [];

                borrowerView.payments =
                response.payments || [];
                borrowerView.bonusCollections =
                response.bonusCollection || [];
                return response;

            });

        },
        renderBorrower:(row)=>{
            $("#borrowerName").text(
                row.last_name +
                ", " +
                row.first_name +
                " " +
                row.middle_name
            );

            $("#borrowerId").text(
                row.borrower_id
            );

            $("#borrowerMobile").text(
                row.mobile_no
            );

            $("#borrowerEmail").text(
                row.email_address
            );

            $("#borrowerAddress").text(
                row.home_address
            );

            $("#borrowerCivilStatus").text(
                row.civil_status
            );

            $("#borrowerGender").text(
                row.gender
            );

            $("#borrowerDob").text(
                row.date_of_birth
            );

            $("#borrowerStatus")
            .removeClass()
            .addClass(
                row.isActive == 1
                ?
                "badge bg-success"
                :
                "badge bg-danger"
            )
            .text(
                row.isActive == 1
                ?
                "ACTIVE"
                :
                "INACTIVE"
            );

        },

        summary:(data)=>{

            if(data.length == 0)
                return;

            let loan =
                data[0];

            $("#loanAmount").text(
                "₱" +
                parseFloat(
                    loan.loan_amount
                ).toLocaleString()
            );

            $("#totalBalance").text(
                "₱" +
                parseFloat(
                    loan.total_balance
                ).toLocaleString()
            );

            $("#interestBalance").text(
                "₱" +
                parseFloat(
                    loan.interest_balance
                ).toLocaleString()
            );

            $("#paymentPercentage").text(
                loan.payment_percentage +
                "%"
            );

            $("#nextDueDate").text(
                loan.next_due_date
            );

            $("#nextDueAmount").text(
                "₱" +
                parseFloat(
                    loan.next_due_amount
                ).toLocaleString()
            );

            $("#activeLoans").text(
                data.length
            );

        },

        renderLoans:(data)=>{

            let html = '';

            $.each(data,function(i,row){

                html += `

                <tr>

                    <td>

                        LN-${row.loan_id}

                    </td>

                    <td>

                        ₱${parseFloat(
                            row.loan_amount
                        ).toLocaleString()}

                    </td>

                    <td>

                        ${row.loan_purpose}

                    </td>

                    <td>

                        ${row.loan_terms}
                        Months

                    </td>

                    <td>

                        ${row.approved_interest_rate}%

                    </td>

                    <td>

                        <span class="badge bg-success">

                            ${row.status}

                        </span>

                    </td>

                    <td>

                        ₱${parseFloat(
                            row.total_balance
                        ).toLocaleString()}

                    </td>

                    <td>

                        ${row.next_due_date}

                    </td>

                    <td>

                        <div class="btn-group">

                            <button
                                class="btn btn-primary btn-sm"

                                onclick="borrowerView.funx.loadSchedules(${row.loan_id})">

                                Schedules

                            </button>

                            <button
                                class="btn btn-success btn-sm"

                                onclick="borrowerView.funx.loadPayments(${row.loan_id})">

                                Payments

                            </button>
                            <button
                                class="btn btn-info btn-sm"

                                onclick="borrowerView.funx.contract(${row.loan_id})">

                                Contract

                            </button>

                        </div>

                    </td>

                </tr>

                `;

            });

            $("#loanBody").html(html);

            borrowerView.funx.datatable();

        },

        datatable:()=>{

            if($.fn.DataTable.isDataTable(
                '#loanTable'
            )){

                $('#loanTable')
                .DataTable()
                .destroy();

            }

            $('#loanTable').DataTable({

                responsive:true,

                pageLength:10

            });

        },

        loadSchedules:(loanId)=>{

            let loan =
                borrowerView.loans.find(
                    x =>
                    x.loan_id == loanId
                );

            let html = '';

            $.each(
                loan.schedules,
                function(i,row){

                    let badge =
                        'secondary';

                    if(
                        row.status ==
                        'PAID'
                    ){
                        badge =
                            'success';
                    }

                    if(
                        row.status ==
                        'PARTIAL'
                    ){
                        badge =
                            'warning';
                    }

                    if(
                        row.status ==
                        'UNPAID'
                    ){
                        badge =
                            'danger';
                    }

                    html += `

                    <tr>

                        <td>

                            ${row.due_date}

                        </td>

                        <td>

                            ₱${parseFloat(
                                row.principal_due || 0
                            ).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits:2
                                }
                            )}

                            <br>

                            <small class="text-success">

                                Paid:
                                ₱${parseFloat(
                                    row.principal_paid || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2
                                    }
                                )}

                            </small>

                        </td>

                        <td>

                            ₱${parseFloat(
                                row.interest_due || 0
                            ).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits:2
                                }
                            )}

                            <br>

                            <small class="text-success">

                                Paid:
                                ₱${parseFloat(
                                    row.interest_paid || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2
                                    }
                                )}

                            </small>

                        </td>

                        <td>

                            ₱${parseFloat(
                                row.penalty_due || 0
                            ).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits:2
                                }
                            )}

                            <br>

                            <small class="text-success">

                                Paid:
                                ₱${parseFloat(
                                    row.penalty_paid || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2
                                    }
                                )}

                            </small>

                        </td>

                        <td>

                            <strong>

                                ₱${parseFloat(
                                    row.balance || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2
                                    }
                                )}

                            </strong>

                        </td>

                        <td>

                            <span
                                class="badge bg-${badge}">

                                ${row.status}

                            </span>

                        </td>

                        <td>

                            ${
                                row.status != 'PAID'
                                ?
                                `
                                <button
                                    class="btn btn-success btn-sm"

                                    onclick="borrowerView.funx.collectPayment(
                                        ${loanId},
                                        ${row.schedule_id}
                                    )">

                                    <i class="bi bi-cash"></i>

                                    Collect

                                </button>
                                `
                                :
                                `
                                <span class="badge bg-success">

                                    Paid

                                </span>
                                `
                            }

                        </td>

                    </tr>

                    `;

                }
            );

            $("#scheduleBody")
                .html(html);

            new bootstrap.Tab(
                document.querySelector(
                    '[data-bs-target="#scheduleTab"]'
                )
            ).show();

        },

        loadPayments:(loanId)=>{

            let payments =
                borrowerView.allPayments.filter(
                    x =>
                        x.loan_id == loanId
                );

            let html = '';

            $.each(
                payments,
                function(i,row){

                    html += `

                    <tr>

                        <td>
                            ${row.or_number || '-'}
                        </td>

                        <td>
                            ${row.payment_date}
                        </td>

                        <td>
                            ₱${parseFloat(
                                row.principal_amount || 0
                            ).toLocaleString()}
                        </td>

                        <td>
                            ₱${parseFloat(
                                row.interest_amount || 0
                            ).toLocaleString()}
                        </td>

                        <td>
                            ₱${parseFloat(
                                row.penalty_amount || 0
                            ).toLocaleString()}
                        </td>

                        <td>
                            ₱${parseFloat(
                                row.total_amount || 0
                            ).toLocaleString()}
                        </td>

                        <td>
                            ${row.remarks || '-'}
                        </td>

                    </tr>

                    `;

                }
            );

            if(html === ''){

                html = `
                    <tr>
                        <td colspan="7" class="text-center">
                            No payments found
                        </td>
                    </tr>
                `;
            }

            $("#paymentBody")
                .html(html);

            new bootstrap.Tab(
                document.querySelector(
                    '[data-bs-target="#paymentTab"]'
                )
            ).show();

        },

        contract:(loanId)=>{

            window.open(`${borrowerLoanContractApi}?id=${loanId}`,'_blank')

        },

        collectPayment:(loanId,scheduleId)=>{

            let loan =
                borrowerView.loans.find(
                    x =>
                    x.loan_id == loanId
                );

            let schedule =
                loan.schedules.find(
                    x =>
                    x.schedule_id == scheduleId
                );

            let dueAmount =

                parseFloat(
                    schedule.principal_due
                )

                +

                parseFloat(
                    schedule.interest_due
                )

                +

                parseFloat(
                    schedule.penalty_due
                )

                -

                parseFloat(
                    schedule.principal_paid
                )

                -

                parseFloat(
                    schedule.interest_paid
                )

                -

                parseFloat(
                    schedule.penalty_paid
                );

            Swal.fire({

                title:'Collect Payment',

                width:700,

                html:`

                    <div class="text-start">

                        <div class="alert alert-info">

                            Due Date:
                            ${schedule.due_date}

                            <br>

                            Balance:
                            ₱${dueAmount.toLocaleString()}

                        </div>

                        <label>

                            Payment Date

                        </label>

                        <input
                            type="date"
                            id="payment_date"
                            class="form-control mb-3"
                            value="${new Date().toISOString().split('T')[0]}">

                        <label>

                            Amount

                        </label>

                        <input
                            type="number"
                            id="amount"
                            class="form-control mb-3"
                            value="${dueAmount}">

                        <label>

                            OR Number

                        </label>

                        <input
                            type="text"
                            id="or_number"
                            class="form-control mb-3">

                        <label>

                            Remarks

                        </label>

                        <textarea
                            id="remarks"
                            class="form-control">

                        </textarea>

                    </div>

                `,

                showCancelButton:true,

                confirmButtonText:'Save Payment',

                preConfirm:()=>{

                    return {

                        loan_id:
                            loanId,

                        schedule_id:
                            scheduleId,

                        payment_date:
                            $('#payment_date').val(),

                        amount:
                            $('#amount').val(),

                        or_number:
                            $('#or_number').val(),

                        remarks:
                            $('#remarks').val()

                    };

                }

            })
            .then((result)=>{

                if(result.isConfirmed){

                    borrowerView.funx.savePayment(
                        result.value
                    );

                }

            });

        },

        savePayment:(payload)=>{

            jsAddon.display.ajaxRequest({
                type:'POST',
                url: paymentApi,
                dataType:'json',
                payload: payload
            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Payment Failed',

                        text:response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Payment Saved',

                    text:response.message

                });

                borrowerView.funx.getLoans();

            })
            .catch((xhr)=>{

                let message =
                    'Unable to save payment.';

                if(xhr.status == 404){

                    message =
                        'Payment API not found.';

                }else if(xhr.status == 500){

                    message =
                        'Internal Server Error.';

                }

                Swal.fire({

                    icon:'error',

                    title:'System Error',

                    text:message

                });

            });

        },

        addloan:(payload)=>{

            jsAddon.display.ajaxRequest({
                type:'POST',
                url: loanApi,
                dataType:'json',
                payload: payload
            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Loan Failed',

                        text:response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Loan Saved',

                    text:response.message

                });

                borrowerView.funx.getLoans();

            })
            .catch((xhr)=>{

                let message =
                    'Unable to save loan.';

                if(xhr.status == 404){

                    message =
                        'Loan API not found.';

                }else if(xhr.status == 500){

                    message =
                        'Internal Server Error.';

                }

                Swal.fire({

                    icon:'error',

                    title:'System Error',

                    text:message

                });

            });

        },

        addYearlySettlement:(payload)=>{
            
            jsAddon.display.ajaxRequest({
                type:'POST',
                url: addYearlySettlementApi,
                dataType:'json',
                payload: payload
            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Loan Failed',

                        text:response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Loan Saved',

                    text:response.message

                });

                borrowerView.funx.getLoans();

            })
            .catch((xhr)=>{

                let message =
                    'Unable to save loan.';

                if(xhr.status == 404){

                    message =
                        'Loan API not found.';

                }else if(xhr.status == 500){

                    message =
                        'Internal Server Error.';

                }

                Swal.fire({

                    icon:'error',

                    title:'System Error',

                    text:message

                });

            });

        },

        buildBorrowerOptions:()=>{

            let options =
                `<option value="">
                    SELECT CO-MAKER
                </option>`;

            $.each(
                borrowerList,
                function(k,v){

                    let fullName =
                        `${v.lastname || ''},
                        ${v.firstname || ''}
                        ${v.middlename || ''}`;

                    options += `

                    <option

                        value="${v.borrower_id}"

                        data-name="${fullName}"

                        data-phone="${v.mobile || ''}"

                        data-address="${v.present_address || ''}">

                        ${fullName}

                    </option>

                    `;

                }
            );

            return options;

        },

        fillYears:() => {

            let currentYear = new Date().getFullYear();

            let html = '';

            for (let year = currentYear - 5; year <= currentYear + 15; year++) {

                html += `
                    <option
                        value="${year}"
                        ${year == currentYear ? 'selected' : ''}>
                        ${year}
                    </option>
                `;
            }

            $("#schedule_year").html(html);
        },

        generateSchedule:()=> {

            let selectedYear =
                parseInt($("#schedule_year").val());

            let months = {};

            // Build all 12 months

            for (let m = 1; m <= 12; m++) {

                let date = new Date(
                    selectedYear,
                    m - 1,
                    1
                );

                let monthKey =
                    selectedYear +
                    "-" +
                    String(m).padStart(2, "0");

                months[monthKey] = {

                    month:
                        date.toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                year: "numeric"
                            }
                        ),

                    loans: [],

                    total: 0

                };

            }
              
            // Populate schedules

            $.each(
                borrowerView.loans,
                function (_, loan) {

                    // Only include salary deducted loans

                    if (
                        Number(
                            loan.is_salary_deducted
                        ) !== 1
                    ) {
                        return;
                    }

                    $.each(
                        loan.schedules,
                        function (_, schedule) {

                            // Skip paid schedules

                            // if (
                            //     String(
                            //         schedule.status
                            //     ).toUpperCase() === 'PAID'
                            // ) {
                            //     return;
                            // }

                            /*
                            |--------------------------------------------------------------------------
                            | PRODUCT 1
                            | FIXED ₱4,000 MONTHLY DEDUCTION
                            |--------------------------------------------------------------------------
                            */

                            if (
                                parseInt(
                                    loan.loan_product_id
                                ) === 1
                            ) {

                                let dueDate =
                                    new Date(
                                        schedule.due_date
                                    );

                                let targetYear =
                                    dueDate.getFullYear();

                                if (
                                    targetYear !==
                                    selectedYear
                                ) {
                                    return;
                                }

                                let monthlyDeduction =
                                parseFloat(
                                    loan.monthly_interest_deduction || 4000
                                );


                                let firstSchedule =
                                    loan.schedules[0];

                                let lastSchedule =
                                    loan.schedules[
                                        loan.schedules.length - 1
                                    ];

                                let startDate =
                                    new Date(
                                        firstSchedule.due_date
                                    );

                                let endDate =
                                    new Date(
                                        lastSchedule.due_date
                                    );

                                let startMonth =
                                    startDate.getMonth() + 1;

                                let endMonth =
                                    endDate.getMonth() + 1;

                                let monthStart = 1;
                                let monthEnd = 12;

                                if(
                                    startDate.getFullYear() ===
                                    targetYear
                                ){
                                    monthStart =
                                        startMonth;
                                }

                                if(
                                    endDate.getFullYear() ===
                                    targetYear
                                ){
                                    monthEnd =
                                        endMonth;
                                }

                                for (
                                    let month = monthStart;
                                    month <= monthEnd;
                                    month++
                                ) {

                                    let monthKey =

                                        targetYear +

                                        "-" +

                                        String(month)
                                        .padStart(2, "0");

                                    if (
                                        !months[monthKey]
                                    ) {
                                        continue;
                                    }

                                    months[monthKey]
                                    .loans
                                    .push({

                                        loan_id:
                                            loan.loan_id,

                                        loan_product_id:
                                            loan.loan_product_id,

                                        product_name:
                                            loan.product_name ||
                                            "Loan",

                                        amount:
                                            monthlyDeduction,

                                        status:
                                            schedule.status

                                    });

                                    months[monthKey]
                                    .total +=
                                        monthlyDeduction;

                                }

                                return;
                            }

                            /*
                            |--------------------------------------------------------------------------
                            | ALL OTHER PRODUCTS
                            |--------------------------------------------------------------------------
                            */

                            let dueDate =
                                new Date(
                                    schedule.due_date
                                );

                            let dueYear =
                                dueDate.getFullYear();

                            if (
                                dueYear !==
                                selectedYear
                            ) {
                                return;
                            }

                            let monthKey =

                                dueYear +

                                "-" +

                                String(
                                    dueDate.getMonth() + 1
                                ).padStart(2, "0");

                            let amount =

                                parseFloat(
                                    schedule.principal_due || 0
                                )

                                +

                                parseFloat(
                                    schedule.interest_due || 0
                                )

                                +

                                parseFloat(
                                    schedule.penalty_due || 0
                                );

                            months[monthKey]
                            .loans
                            .push({

                                loan_id:
                                    loan.loan_id,

                                loan_product_id:
                                    loan.loan_product_id,

                                product_name:
                                    loan.product_name ||
                                    "Loan",

                                amount:
                                    amount,

                                status:
                                    schedule.status

                            });

                            months[monthKey]
                            .total += amount;

                        });

                }
            );

            let html = '';

            $.each(
                months,
                function (
                    monthKey,
                    monthData
                ) {

                    let salary = 0;

                    let salaryRecord =
                        borrowerView.salary.find(
                            function (s) {

                                let salaryDate =
                                    new Date(
                                        s.salary_month
                                    );

                                let salaryMonthKey =

                                    salaryDate.getFullYear()

                                    +

                                    "-"

                                    +

                                    String(
                                        salaryDate.getMonth() + 1
                                    ).padStart(2, "0");

                                return (
                                    salaryMonthKey ===
                                    monthKey
                                );

                            }
                        );

                    if (salaryRecord) {

                        salary =
                            parseFloat(
                                salaryRecord.gross_salary
                            ) || 0;

                    }

                    
                    let payments =
                    borrowerView.payments.filter(
                        function(p){

                            let paymentMonth = p.payment_month;

                            return (
                                paymentMonth ===
                                monthKey
                            );

                        }
                    );

                let net =
                    salary -
                    monthData.total;


                    

                    let statusHtml = '';
                    let actionHtml = '';
                    let settlementDetails = [];

                    if (salary <= 0) {

                        statusHtml = `
                            <span class="badge bg-secondary">
                                NO SALARY
                            </span>
                        `;

                    }
                    else if (net > 0) {

                        statusHtml = `
                            <span class="badge bg-success">
                                SUKLI
                            </span>
                        `;

                        let totalMonthPaid = 0;

                        $.each(
                            payments,
                            function(_,p){

                                totalMonthPaid +=
                                    parseFloat(
                                        p.total_amount || 0
                                    );

                            }
                        );

                        if(
                            totalMonthPaid >=
                            monthData.total
                        ){

                            actionHtml = `

                                <div class="alert alert-success text-center mt-3 mb-0">

                                    <i class="bi bi-check-circle-fill"></i>

                                    PAYMENT COMPLETED

                                </div>

                            `;

                        }
                        else{

                            actionHtml = `

                                <button
                                    class="btn btn-success btn-sm btn-pay mt-3 w-100"

                                    data-month="${monthKey}"

                                    data-loans='${JSON.stringify(
                                        monthData.loans
                                    )}'>
                                    <i class="bi bi-cash"></i>

                                    PAY

                                </button>

                            `;

                        }

                    }
                    else if (net < 0) {

                        let settlement =
                            borrowerView.settlements.find(
                                x =>
                                    x.settlement_month === monthKey
                            );

                        if(settlement){

                            let badgeClass = 'bg-warning';

                            if(
                                settlement.status === 'SETTLED'
                            ){
                                badgeClass = 'bg-success';
                            }

                            if(
                                settlement.status === 'WAIVED'
                            ){
                                badgeClass = 'bg-secondary';
                            }

                            statusHtml = `
                                <span class="badge ${badgeClass}">
                                    ${settlement.status}
                                </span>
                            `;

                            actionHtml = `

                                <div class="card border-success bg-light mt-3">

                                    <div class="card-body p-2">

                                        <div class="text-center">

                                            <i class="bi bi-check-circle-fill text-success"></i>

                                            <strong>

                                                SETTLEMENT RECORDED

                                            </strong>

                                        </div>

                                        <hr class="my-2">

                                        <div class="d-flex justify-content-between">

                                            <span>

                                                Deficit Amount

                                            </span>

                                            <strong>

                                                ₱${parseFloat(
                                                    settlement.deficit_amount || 0
                                                ).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2,
                                                        maximumFractionDigits:2
                                                    }
                                                )}

                                            </strong>

                                        </div>

                                        <div class="d-flex justify-content-between">

                                            <span>

                                                Status

                                            </span>

                                            <strong>

                                                ${settlement.status}

                                            </strong>
                                        </div>

                                         <div class="mt-3">

                                                <button
                                                    class="btn btn-outline-primary btn-sm w-100 btn-view-settlement"

                                                    data-details='${JSON.stringify(
                                                        settlement.details || []
                                                    )}'
                                                    '>

                                                    <i class="bi bi-eye"></i>

                                                    View Details

                                                </button>

                                            </div>

                                    </div>

                                </div>

                            `;

                        }else{

                            /*
                            |--------------------------------------------------------------------------
                            | BUILD SETTLEMENT BREAKDOWN
                            |--------------------------------------------------------------------------
                            */

                            let settlementDetails = [];

                            let remainingSalary =
                                salary;

                            $.each(
                                monthData.loans,
                                function(_,loan){

                                    let loanAmount =
                                        parseFloat(
                                            loan.amount || 0
                                        );

                                    /*
                                    |--------------------------------------------------------------------------
                                    | SALARY CAN COVER FULL LOAN
                                    |--------------------------------------------------------------------------
                                    */

                                    if(
                                        remainingSalary >=
                                        loanAmount
                                    ){

                                        settlementDetails.push({

                                        loan_id:
                                            loan.loan_id,

                                        loan_product_id:
                                            loan.loan_product_id,

                                        product_name:
                                            loan.product_name,

                                        due_amount:
                                            loanAmount,

                                        paid_amount:
                                            loanAmount,

                                        unpaid_amount:
                                            0,

                                        amount:
                                            0

                                    });

                                    remainingSalary -=
                                        loanAmount;

                                    return;
                                    }

                                    /*
                                    |--------------------------------------------------------------------------
                                    | PARTIAL PAYMENT
                                    |--------------------------------------------------------------------------
                                    */

                                    let paidAmount =
                                        Math.min(
                                            remainingSalary,
                                            loanAmount
                                        );

                                    let unpaidAmount =
                                        loanAmount -
                                        paidAmount;

                                    

                                    settlementDetails.push({

                                        loan_id:
                                            loan.loan_id,

                                        loan_product_id:
                                            loan.loan_product_id,

                                        product_name:
                                            loan.product_name,

                                        due_amount:
                                            loanAmount,

                                        paid_amount:
                                            paidAmount,

                                        unpaid_amount:
                                            unpaidAmount,

                                        amount:
                                            unpaidAmount

                                    });

                                    

                                    remainingSalary =
                                        Math.max(
                                            remainingSalary -
                                            loanAmount,
                                            0
                                        );

                                }
                            );

                            statusHtml = `
                                <span class="badge bg-danger">
                                    DEFICIT
                                </span>
                            `;

                            actionHtml = `

                                <div class="mt-2">

                                    <small class="text-muted">

                                        Settlement Breakdown

                                    </small>

                            `;

                            $.each(
                                settlementDetails,
                                function(_,detail){

                                    actionHtml += `

                                        <div class="d-flex justify-content-between small">

                                            <span>

                                                ${detail.product_name}

                                            </span>

                                            <div class="small">

                                            Due:
                                            ₱${parseFloat(
                                                detail.due_amount
                                            ).toLocaleString()}

                                            <br>

                                            Paid:
                                            ₱${parseFloat(
                                                detail.paid_amount
                                            ).toLocaleString()}

                                            <br>

                                            Unpaid:
                                            ₱${parseFloat(
                                                detail.unpaid_amount
                                            ).toLocaleString()}

                                        </div>

                                        </div>

                                    `;

                                }
                            );

                            actionHtml += `

                                </div>

                                <button
                                    class="btn btn-warning btn-sm btn-settle mt-3 w-100"

                                    data-month="${monthKey}"

                                    data-amount="${Math.abs(net)}"

                                    data-details='${JSON.stringify(
                                        settlementDetails
                                    )}'>

                                    <i class="bi bi-wallet2"></i>

                                    SETTLE DEFICIT

                                </button>

                            `;

                        }

                    }
                    else {
                        
                        statusHtml = `
                            <span class="badge bg-primary">
                                BALANCED
                            </span>
                        `;

                         let totalMonthPaid = 0;

                        $.each(
                            payments,
                            function(_,p){

                                totalMonthPaid +=
                                    parseFloat(
                                        p.total_amount || 0
                                    );

                            }
                        );

                        if(
                            totalMonthPaid >=
                            monthData.total
                        ){

                            actionHtml = `

                                <div class="alert alert-success text-center mt-3 mb-0">

                                    <i class="bi bi-check-circle-fill"></i>

                                    PAYMENT COMPLETED

                                </div>

                            `;

                        }
                        else{

                            actionHtml = `

                                <button
                                    class="btn btn-success btn-sm btn-pay mt-3 w-100"

                                    data-month="${monthKey}"

                                    data-loans='${JSON.stringify(
                                        monthData.loans
                                    )}'>
                                    <i class="bi bi-cash"></i>

                                    PAY

                                </button>

                            `;

                        }

                    }

                    html += `

                        <div class="col-lg-4 col-md-6 mb-4">

                            <div class="card h-100 shadow-sm">

                                <div class="card-header text-center">

                                    <strong>

                                        ${monthData.month}

                                    </strong>

                                </div>

                                <div class="card-body">

                    `;

                    if (
                        monthData.loans.length > 0
                    ) {

                       $.each(
                        monthData.loans,
                        function (_, loan) {

                            let loanPayments =
                                payments.filter(
                                    p =>
                                        parseInt(
                                            p.loan_id
                                        ) ===
                                        parseInt(
                                            loan.loan_id
                                        )
                                );

                            let totalPaid = 0;

                            $.each(
                                loanPayments,
                                function(_,p){

                                    totalPaid +=
                                        parseFloat(
                                            p.total_amount || 0
                                        );

                                }
                            );

                            let statusBadge = '';

                            if(
                                totalPaid >=
                                parseFloat(
                                    loan.amount || 0
                                )
                            ){

                                statusBadge = `
                                    <span class="badge bg-success ms-1">
                                        PAID
                                    </span>
                                `;

                            }
                            else if(
                                totalPaid > 0
                            ){

                                statusBadge = `
                                    <span class="badge bg-warning text-dark ms-1">
                                        LACKING
                                    </span>
                                `;

                            }

                            html += `

                                <div class="d-flex justify-content-between mb-1">

                                    <span>

                                        ${loan.product_name}

                                        ${statusBadge}

                                    </span>

                                    <span>

                                        ₱${parseFloat(
                                            loan.amount || 0
                                        ).toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}

                                    </span>

                                </div>

                            `;

                        }
                    );

                    }
                    else {

                        html += `

                            <div class="text-muted text-center">

                                No Deductions

                            </div>

                        `;

                    }

                        if(
                            payments.length > 0
                        ){

                            html += `

                                <hr>

                                <h6 class="text-success">

                                    <i class="bi bi-cash-stack"></i>

                                    Payments

                                </h6>

                            `;

                            $.each(
                                payments,
                                function(_,payment){

                                    html += `

                                        <div class="d-flex justify-content-between">

                                            <span>

                                                ${payment.product_name}

                                                <small class="text-muted">

                                                    (${payment.payment_type})

                                                </small>

                                            </span>

                                            <strong
                                                class="text-success">

                                                ₱${parseFloat(
                                                    payment.total_amount || 0
                                                ).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2,
                                                        maximumFractionDigits:2
                                                    }
                                                )}

                                            </strong>

                                        </div>

                                    `;

                                }
                            );

                        }

                    html += `

                        <hr>

                        <div class="d-flex justify-content-between">

                            <strong>

                                Total Deduction

                            </strong>

                            <strong>

                                ₱${monthData.total.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </strong>

                        </div>

                        <div class="d-flex justify-content-between">

                            <strong>

                                Salary

                            </strong>

                            <strong>

                                ₱${salary.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </strong>

                        </div>

                        <hr>

                        <div class="d-flex justify-content-between align-items-center">

                            <strong>

                                ${statusHtml}

                            </strong>

                            <strong class="${
                                salary <= 0
                                    ? 'text-secondary'
                                    : net >= 0
                                        ? 'text-success'
                                        : 'text-danger'
                            }">

                                ₱${Math.abs(net).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </strong>

                        </div>

                        ${actionHtml}

                    </div>

                </div>

            </div>

                    `;

                });
            
            let totalBonusSettlement = 0;
            let bonusHtml = '';
            let yearlyDeficit = 0;
            let yearlyUnsettledDeficit = 0;    
            $.each(
                months,
                function(k,m){

                    let salary2 = 0;

                    let salaryRecord2 =
                        borrowerView.salary.find(
                            function(s){

                                let salaryDate =
                                    new Date(
                                        s.salary_month
                                    );

                                let salaryMonthKey =

                                    salaryDate.getFullYear()

                                    +

                                    "-"

                                    +

                                    String(
                                        salaryDate.getMonth()+1
                                    ).padStart(2,'0');

                                return salaryMonthKey === k;

                            }
                        );

                    if(salaryRecord2){

                        salary2 =
                            parseFloat(
                                salaryRecord2.gross_salary
                            ) || 0;

                    }

                    let monthlyNet =
                        salary2 -
                        m.total;

                    let settlement =
                        borrowerView.settlements.find(
                            x =>
                                x.settlement_month === k
                        );

                    if(
                        monthlyNet < 0
                    ){

                        let isSettled =
                            settlement &&
                            (
                                settlement.status === 'SETTLED'
                                ||
                                settlement.balance <= 0
                            );

                        if(
                            !isSettled
                        ){

                            yearlyDeficit +=
                                Math.abs(
                                    monthlyNet
                                );
                            

                        }

                    }

                }
            );


            let settlementHtml = '';
            console.log(
                'Yearly Deficit',
                yearlyDeficit
            );

            console.log(
                borrowerView.settlements
            );
            

            bonusHtml = `

                <div class="card mb-4 border-primary">

                    <div class="card-header">

                        <strong>

                            Bonus / Incentive Collections

                        </strong>

                    </div>

                    <div class="card-body">

            `;

            
            if(
                borrowerView.bonusCollections &&
                borrowerView.bonusCollections.length > 0
            ){

                $.each(
                    borrowerView.bonusCollections,
                    function(_,bonus){

                        let statusBadge = '';
                        let actionButton = '';

                        if(
                            bonus.status === 'NO_CREDIT'
                        ){

                            if(
                                bonus.settlement_id
                            ){
                                if(
                                    bonus.settlement_status !== 'SETTLED'
                                ){

                                    totalBonusSettlement +=
                                        parseFloat(
                                            bonus.expected_amount || 0
                                        );

                                }

                                yearlyDeficit +=
                                    totalBonusSettlement;

                                statusBadge = `

                                    <span class="badge bg-info">

                                        ADDED TO SETTLEMENT

                                    </span>

                                `;

                                actionButton = `

                                    <button
                                        class="btn btn-primary btn-sm btn-view-settlement"

                                        data-settlement-id="${bonus.settlement_id}">

                                        <i class="bi bi-eye"></i>

                                        VIEW SETTLEMENT

                                    </button>

                                `;

                            }
                            else{

                                statusBadge = `

                                    <span class="badge bg-secondary">

                                        NO BENEFIT CREDITED

                                    </span>

                                `;

                                actionButton = `

                                    <button
                                        class="btn btn-warning btn-sm btn-settle-bonus"

                                        data-loan-id="${bonus.loan_id}"

                                        data-bonus-deduction-id="${bonus.bonus_deduction_id}"

                                        data-type="${bonus.deduction_type}"

                                        data-amount="${bonus.expected_amount}">

                                        <i class="bi bi-wallet2"></i>

                                        ADD TO SETTLEMENT

                                    </button>

                                `;

                            }

                        }
                        else if(
                            bonus.status ===
                            'CREDITED'
                        ){

                            statusBadge = `

                                <span class="badge bg-warning text-dark">

                                    CREDITED

                                </span>

                            `;

                            actionButton = `

                                <button
                                    class="btn btn-success btn-sm btn-pay-bonus"

                                    data-collection-id="${bonus.bonus_collection_id}"

                                    data-type="${bonus.deduction_type}"

                                    data-deduction-amount="${bonus.expected_amount}"

                                    data-credited-amount="${bonus.credited_amount}">

                                    PAY NOW

                                </button>

                            `;

                        }
                        else if(
                            bonus.status ===
                            'PAID'
                        ){

                            statusBadge = `

                                <span class="badge bg-success">

                                    PAID

                                </span>

                            `;

                            actionButton = `

                                <button
                                    class="btn btn-info btn-sm btn-view-bonus"

                                    data-payment-id="${bonus.payment_id}"

                                    data-collection-id="${bonus.bonus_collection_id}">

                                    VIEW DETAILS

                                </button>

                            `;

                        }

                        bonusHtml += `

                            <div class="row border-bottom py-2 align-items-center">

                                <div class="col-md-3">

                                    <strong>

                                        ${bonus.deduction_type}

                                    </strong>

                                </div>

                                <div class="col-md-3">

                                    ₱${parseFloat(
                                        bonus.expected_amount || 0
                                    ).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits:2,
                                            maximumFractionDigits:2
                                        }
                                    )}

                                </div>

                                <div class="col-md-3">

                                    ${statusBadge}

                                </div>

                                <div class="col-md-3 text-end">

                                    ${actionButton}

                                </div>

                            </div>

                        `;

                    }
                );

            }
            else{

                bonusHtml += `

                    <div class="text-muted">

                        No bonus deductions configured.

                    </div>

                `;

                

            }

            if(yearlyDeficit > 0){

                settlementHtml = `

                    <div class="col-12">

                        <div class="card border-warning shadow-lg">

                            <div class="card-body">

                                <div class="row align-items-center">

                                    <div class="col-md-8">

                                        <h4 class="text-warning">

                                            <i class="bi bi-wallet2"></i>

                                            Yearly Deficit Summary

                                        </h4>

                                        <h2>

                                            ₱${yearlyDeficit.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits:2,
                                                    maximumFractionDigits:2
                                                }
                                            )}

                                        </h2>

                                    </div>

                                    <div class="col-md-4 text-end">

                                        <button

                                            class="btn btn-warning btn-lg btn-settle-yearly"

                                            data-amount="${yearlyDeficit}"

                                            data-year="${selectedYear}">

                                            <i class="bi bi-cash-stack"></i>

                                            SETTLE DEFICIT

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                `;
            }


            bonusHtml += `

                    </div>

                </div>

            `;

            $("#scheduleContainer")
            .html(
                html +
                bonusHtml +
                settlementHtml
            );

        },

        renderSchedule :(schedule) => {

            let html = '';

            $.each(schedule, function (monthKey, monthData) {

                html += `
                    <div class="col-md-4 mb-4">

                        <div class="card h-100">

                            <div class="card-body">

                                <h5 class="text-center mb-4">
                                    ${monthData.month}
                                </h5>
                `;

                $.each(
                monthData.loans,
                function (_, loan) {

                    let loanPayments =
                        payments.filter(
                            p =>
                                parseInt(
                                    p.loan_id
                                ) ===
                                parseInt(
                                    loan.loan_id
                                )
                        );

                    let totalPaid = 0;

                    $.each(
                        loanPayments,
                        function(_,payment){

                            totalPaid +=
                                parseFloat(
                                    payment.total_amount || 0
                                );

                        }
                    );

                    html += `

                        <div class="d-flex justify-content-between mb-1">

                            <span>

                                ${loan.product_name}

                            </span>

                            <span>

                                ₱${parseFloat(
                                    loan.amount || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2,
                                        maximumFractionDigits:2
                                    }
                                )}

                            </span>

                        </div>

                    `;

                }
            );

                html += `
                            </div>

                        </div>

                    </div>
                `;
            });

            $("#scheduleContainer").html(html);
        },

        openSettlementLoan:(deficitAmount,month)=>{

            $("#settlement_amount")
                .val(deficitAmount);

            $("#settlementAmountLabel")
                .html(
                    "₱" +
                    parseFloat(deficitAmount)
                    .toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits:2
                        }
                    )
                );

            $("#settlement_remarks")
                .val(
                    "Settlement for deficit " +
                    month
                );

            let html = '';

            $.each(
                borrowerView.loanProducts,
                function(k,v){

                    if(
                        parseInt(
                            v.loan_product_id
                        ) !== 2
                    ){
                        return;
                    }

                    html += `

                        <div class="col-lg-4 mb-4">

                            <div

                                class="card settlement-product-card h-100 border-0 shadow-sm"

                                data-loan-product-id="${v.loan_product_id}"

                                data-interest-rate="${v.interest_rate}"

                                data-penalty-rate="${v.penalty_rate}"

                                data-max-term="${v.max_term}"

                                data-min-amount="${v.min_amount}"

                                data-max-amount="${v.max_amount}">

                                <div class="card-body">

                                    <div class="d-flex justify-content-between">

                                        <h5>

                                            ${v.product_name}

                                        </h5>

                                        <span
                                            class="badge bg-primary">

                                            ${v.interest_rate}%

                                        </span>

                                    </div>

                                    <p class="text-muted small">

                                        ${v.description || ''}

                                    </p>

                                    <hr>

                                    <div class="row text-center">

                                        <div class="col-6">

                                            <small>

                                                Min Amount

                                            </small>

                                            <h6>

                                                ₱${parseFloat(
                                                    v.min_amount || 0
                                                ).toLocaleString()}

                                            </h6>

                                        </div>

                                        <div class="col-6">

                                            <small>

                                                Max Amount

                                            </small>

                                            <h6>

                                                ₱${parseFloat(
                                                    v.max_amount || 0
                                                ).toLocaleString()}

                                            </h6>

                                        </div>

                                    </div>

                                    <hr>

                                    <div>

                                        <i class="bi bi-clock"></i>

                                        Max Term:
                                        ${v.max_term} Months

                                    </div>

                                    <div>

                                        <i class="bi bi-percent"></i>

                                        Penalty:
                                        ${v.penalty_rate}%

                                    </div>

                                </div>

                            </div>

                        </div>

                    `;

                }
            );

            $("#settlementProductCards")
                .html(html);

            $("#settlementLoanModal")
                .modal('show');

        },

        addSettlement:(month,amount,details)=>{

            let payload = {

                borrower_id:borrowerId,

                settlement_month:
                    month,

                deficit_amount:
                    amount,

                remarks:
                    'MONTHLY DEFICIT',

                details:details

            };

            console.log(payload);

            jsAddon.display.ajaxRequest({

                type:'POST',

                url:settlementApi,

                payload:payload,

                dataType:
                    'json'

            })
            .then( async (response)=>{

                if(
                    response.isError
                ){

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:
                            response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Success',

                    text:
                        response.message

                });
                await borrowerView.funx.getPaymentReport();
                borrowerView.funx.generateSchedule();

            });

        },
        addBonusSettlement:(payload)=>{

            jsAddon.display.ajaxRequest({

                url:
                    addBonusSettlementApi,

                type:
                    'POST',

                payload:
                    payload,

                dataType:
                    'json'

            }).then((response)=>{

                if(
                    response.isError
                ){

                    Swal.fire(

                        'Error',

                        response.message,

                        'error'

                    );

                    return;

                }

                Swal.fire({

                    icon:
                        'success',

                    title:
                        'Success',

                    text:
                        response.message,

                    timer:
                        2000,

                    showConfirmButton:
                        false

                }).then(()=>{

                    /*
                    |--------------------------------------------------------------------------
                    | RELOAD BORROWER REPORT
                    |--------------------------------------------------------------------------
                    */

                    borrowerView.funx.loadBorrower(
                        borrowerId
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | REGENERATE YEARLY SCHEDULE
                    |--------------------------------------------------------------------------
                    */

                    borrowerView.funx.generateSchedule();

                });

            });

        },
        addSalaryPayment:(payload)=>{
            

            console.log(payload);

            jsAddon.display.ajaxRequest({

                type:'POST',

                url:paymentReportPayApi,

                payload:payload,

                dataType:
                    'json'

            })
            .then( async (response)=>{

                if(
                    response.isError
                ){

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:
                            response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Success',

                    text:
                        response.message

                });
                await borrowerView.funx.getPaymentReport();
                borrowerView.funx.generateSchedule();

            });

        },

        getBonusCollections:()=>{

            $.ajax({

                url:getBonusCollectionsApi +
                    borrowerView.borrowerId,

                type:'GET',

                dataType:'json',

                success:function(response){

                    borrowerView.bonusCollections =
                        response.data || [];

                }

            });

        },

        payBonusCollection:(collectionId)=>{

            jsAddon.display.ajaxRequest({
                url:payBonusCollectionApi,
                type:'POST',
                payload:{
                    collection_id:
                        collectionId
                },
                dataType:'json',
            })
            .then(async (response)=>{

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Payment Failed',

                        text:response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Payment Saved',

                    text:response.message

                });

                await borrowerView.funx.getPaymentReport();
                borrowerView.funx.generateSchedule();
            })
            .catch((xhr)=>{

                let message =
                    'Unable to save payment.';

                if(xhr.status == 404){

                    message =
                        'Payment API not found.';

                }else if(xhr.status == 500){

                    message =
                        'Internal Server Error.';

                }

                Swal.fire({

                    icon:'error',

                    title:'System Error',

                    text:message

                });

            });

        },

        viewBonusDetails:(collectionId)=>{

            jsAddon.display.ajaxRequest({

                url:getBonusPaymentDetailsApi,

                type:'GET',

                payload:{
                    collection_id:
                        collectionId
                },

                dataType:'json',

            }).then((response)=>{

                if(
                    response.isError
                ){

                    Swal.fire(
                        'Error',
                        response.message,
                        'error'
                    );

                    return;
                }

                let totalApplied = 0;

                $.each(
                    response.data,
                    function(_,row){

                        totalApplied +=
                            parseFloat(
                                row.total_amount || 0
                            );

                    }
                );

                let creditedAmount =
                    parseFloat(
                        response.credited_amount || 0
                    );

                let deductionAmount =
                    parseFloat(
                        response.deduction_amount || totalApplied
                    );

                let sukli =
                    Math.max(
                        0,
                        creditedAmount -
                        deductionAmount
                    );

                let html = `

                    <div class="card mb-3 border-primary">

                        <div class="card-body">

                            <div class="d-flex justify-content-between mb-2">

                                <strong>

                                    Credited Benefit

                                </strong>

                                <strong>

                                    ₱${creditedAmount.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits:2,
                                            maximumFractionDigits:2
                                        }
                                    )}

                                </strong>

                            </div>

                            <div class="d-flex justify-content-between mb-2">

                                <strong>

                                    ${response.collection_type || 'Bonus'} Payment

                                </strong>

                                <strong class="text-success">

                                    ₱${deductionAmount.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits:2,
                                            maximumFractionDigits:2
                                        }
                                    )}

                                </strong>

                            </div>

                            <div class="d-flex justify-content-between">

                                <strong>

                                    Sukli

                                </strong>

                                <strong class="text-primary">

                                    ₱${sukli.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits:2,
                                            maximumFractionDigits:2
                                        }
                                    )}

                                </strong>

                            </div>

                        </div>

                    </div>

                `;

                $.each(
                    response.data,
                    function(_,row){

                        html += `

                            <div class="card mb-2">

                                <div class="card-body">

                                    <div class="d-flex justify-content-between">

                                        <strong>

                                            ${row.product_name}

                                        </strong>

                                        <span>

                                            ${row.payment_date}

                                        </span>

                                    </div>

                                    <hr>

                                    <div class="row">

                                        <div class="col-md-4">

                                            Interest

                                            <br>

                                            <strong>

                                                ₱${parseFloat(
                                                    row.interest_amount || 0
                                                ).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2
                                                    }
                                                )}

                                            </strong>

                                        </div>

                                        <div class="col-md-4">

                                            Principal

                                            <br>

                                            <strong>

                                                ₱${parseFloat(
                                                    row.principal_amount || 0
                                                ).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2
                                                    }
                                                )}

                                            </strong>

                                        </div>

                                        <div class="col-md-4">

                                            Total

                                            <br>

                                            <strong class="text-success">

                                                ₱${parseFloat(
                                                    row.total_amount || 0
                                                ).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2
                                                    }
                                                )}

                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        `;

                    }
                );

                html += `

                    <hr>

                    <div class="text-end">

                        <h5>

                            Total Applied:

                            ₱${totalApplied.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits:2,
                                    maximumFractionDigits:2
                                }
                            )}

                        </h5>

                    </div>

                `;

                Swal.fire({

                    title:
                        'Bonus Payment Details',

                    html:
                        html,

                    width:
                        900,

                    confirmButtonText:
                        'Close'

                });

            });

        },

        viewSettlement:(settlementId)=>{

            jsAddon.display.ajaxRequest({

                url:
                    getSettlementDetailsApi,

                type:
                    'GET',

                payload:{

                    settlement_id:
                        settlementId

                },

                dataType:
                    'json'

            }).then((response)=>{

                if(
                    response.isError
                ){

                    Swal.fire(

                        'Error',

                        response.message,

                        'error'

                    );

                    return;

                }

                let html = '';

                let totalAmount = 0;

                $.each(
                    response.data,
                    function(_,row){

                        totalAmount +=
                            parseFloat(
                                row.amount || 0
                            );

                        html += `

                            <div class="card mb-2">

                                <div class="card-body">

                                    <div class="d-flex justify-content-between">

                                        <strong>

                                            ${row.deduction_type}

                                        </strong>

                                        <span>

                                            ${row.settlement_month}

                                        </span>

                                    </div>

                                    <hr>

                                    <div class="row">

                                        <div class="col-md-6">

                                            Amount

                                            <br>

                                            <strong>

                                                ₱${parseFloat(
                                                    row.amount || 0
                                                ).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2
                                                    }
                                                )}

                                            </strong>

                                        </div>

                                        <div class="col-md-6">

                                            Status

                                            <br>

                                            <span class="badge bg-info">

                                                ${row.status}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        `;

                    }
                );

                html += `

                    <hr>

                    <div class="text-end">

                        <h5>

                            Total Settlement :

                            ₱${totalAmount.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits:2
                                }
                            )}

                        </h5>

                    </div>

                `;

                Swal.fire({

                    title:
                        'Settlement Details',

                    html:
                        html,

                    width:
                        800,

                    confirmButtonText:
                        'Close'

                });

            });

        },
    },

};

$(document).ready(function(){

    borrowerView.init();

    let today = new Date();

    $("#schedule_until").val(
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, '0')
    );

    $("#btnCreateSettlementLoan").click(function(){

        let loanProductId =
            $("#selected_loan_product_id")
            .val();

        if(!loanProductId){

            Swal.fire({
                icon:'warning',
                title:'Select Loan Product'
            });

            return;
        }

        let settlementIds =
        borrowerView.settlements
        .filter(
            x =>
                x.status === 'UNPAID'
        )
        .map(
            x =>
                x.settlement_id
        );

        let payload = {

            borrower_id:borrowerId,

            settlement_ids:
                settlementIds,

            loan_product_id:
                loanProductId,

            loan_amount:
                $("#settlement_total_amount").val(),

            loan_purpose:
                "DEFICIT SETTLEMENT",

            loan_terms:
                $("#settlement_term").val(),

            approved_interest_rate:
                $("#settlement_interest").val(),

            approved_processing_fee:
                0,

            primary_card_name:
                "DEFICIT SETTLEMENT",

            primary_card_number:
                "",

            secondary_card_name:
                "",

            secondary_card_number:
                "",

            interest_amount:
                $("#settlement_interest_amount").val(),

            processingfee_amount:
                $("#settlement_penalty_amount").val(),

            net_proceeds:
                $("#settlement_amount").val(),

            comakers: []

        };

        console.log(payload);

        Swal.fire({

            title:'Create Settlement Loan?',

            text:'This will create a new settlement loan request.',

            icon:'question',

            showCancelButton:true,

            confirmButtonText:'Submit'

        }).then((result)=>{

            if(result.isConfirmed){

                borrowerView.funx.addYearlySettlement(
                    payload
                );

            }

        });

    });

    $(document).on(
        'click',
        '.btn-view-settlement',
        function(){

            let details =
                $(this).data(
                    'details'
                ) || [];

            console.log(
            'Settlement Details:',
            details
        );

            let html = '';

            $.each(
                details,
                function(_,detail){

                    let status = '';

                    if(
                        parseFloat(
                            detail.unpaid_amount
                        ) <= 0
                    ){

                        status =
                            '<span class="badge bg-success">PAID</span>';

                    }
                    else if(
                        parseFloat(
                            detail.paid_amount
                        ) > 0
                    ){

                        status =
                            '<span class="badge bg-warning text-dark">PARTIAL</span>';

                    }
                    else{

                        status =
                            '<span class="badge bg-danger">UNPAID</span>';

                    }

                    html += `

                        <div class="card mb-3">

                            <div class="card-body">

                                <div class="d-flex justify-content-between">

                                    <strong>

                                        ${detail.product_name}

                                    </strong>

                                    ${status}

                                </div>

                                <hr>

                                <div class="d-flex justify-content-between">

                                    <span>

                                        Due

                                    </span>

                                    <strong>

                                        ₱${parseFloat(
                                            detail.due_amount || 0
                                        ).toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}

                                    </strong>

                                </div>

                                <div class="d-flex justify-content-between">

                                    <span>

                                        Paid

                                    </span>

                                    <strong class="text-success">

                                        ₱${parseFloat(
                                            detail.paid_amount || 0
                                        ).toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}

                                    </strong>

                                </div>

                                <div class="d-flex justify-content-between">

                                    <span>

                                        Lacking

                                    </span>

                                    <strong class="text-danger">

                                        ₱${parseFloat(
                                            detail.unpaid_amount || 0
                                        ).toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}

                                    </strong>

                                </div>

                            </div>

                        </div>

                    `;

                }
            );

            Swal.fire({

                title:
                    'Settlement Details',

                html:
                    html,

                width:
                    700,

                confirmButtonText:
                    'Close'

            });

        }
    );
    
    $(document).on(
        'click',
        '.btn-settle-yearly',
        function(){

            let amount =
                parseFloat(
                    $(this).data('amount')
                );

            let month =
                $(this).data('month');

            borrowerView.funx.openSettlementLoan(
                amount,
                month
            );

        }
    );

    $(document).on(
        'click',
        '.btn-settle',
        function(){

            let month =
                $(this).data('month');

            let amount =
                parseFloat(
                    $(this).data('amount')
                );

            let details =
                $(this).data('details') || [];

            let breakdownHtml = '';

            $.each(
                details,
                function(_,detail){

                    breakdownHtml += `

                        <div class="d-flex justify-content-between">

                            <span>

                                ${detail.product_name}

                            </span>

                            <strong>

                                ₱${parseFloat(
                                    detail.amount
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2,
                                        maximumFractionDigits:2
                                    }
                                )}

                            </strong>

                        </div>

                    `;

                }
            );

            Swal.fire({

                title:'Settle Deficit?',

                html:`

                    <div class="text-start">

                        <strong>Month:</strong>

                        ${month}

                        <br>

                        <strong>Deficit:</strong>

                        ₱${amount.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:2
                            }
                        )}

                        <hr>

                        <strong>
                            Settlement Breakdown
                        </strong>

                        ${breakdownHtml}

                    </div>

                `,

                icon:'warning',

                showCancelButton:true,

                confirmButtonText:
                    'Save Settlement'

            }).then((result)=>{

                if(result.isConfirmed){

                    borrowerView.funx
                    .addSettlement(
                        month,
                        amount,
                        details
                    );

                }

            });

        }
    );

    $(document).on(
        'click',
        '.btn-pay',
        function(){

            let month =
                $(this).data(
                    'month'
                );

            let loans =
                $(this).data(
                    'loans'
                ) || [];

            let totalAmount = 0;

            let html = `
                <div class="text-start">
            `;

            $.each(
                loans,
                function(_,loan){

                    totalAmount +=
                        parseFloat(
                            loan.amount || 0
                        );

                    html += `

                        <div class="d-flex justify-content-between">

                            <span>

                                ${loan.product_name}

                            </span>

                            <strong>

                                ₱${parseFloat(
                                    loan.amount || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits:2,
                                        maximumFractionDigits:2
                                    }
                                )}

                            </strong>

                        </div>

                    `;

                }
            );

            html += `

                <hr>

                <div class="d-flex justify-content-between">

                    <strong>

                        Total Payment

                    </strong>

                    <strong class="text-success">

                        ₱${totalAmount.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:2,
                                maximumFractionDigits:2
                            }
                        )}

                    </strong>

                </div>

            </div>
            `;

            Swal.fire({

                title:
                    'Confirm Payment',

                html:
                    html,

                icon:
                    'question',

                showCancelButton:
                    true,

                confirmButtonText:
                    'Yes, Pay',

                cancelButtonText:
                    'Cancel',

                confirmButtonColor:
                    '#198754'

            }).then(
                (result)=>{

                    if(
                        result.isConfirmed
                    ){

                        borrowerView.funx
                        .addSalaryPayment({

                            borrower_id:
                                borrowerId,

                            payment_month:
                                month,

                            details:
                                loans

                        });

                    }

                }
            );

        }
    );

    

    $(document).on(
        'click',
        '.settlement-product-card',
        function(){

            $(".settlement-product-card")
                .removeClass(
                    'selected-card'
                );

            $(this)
                .addClass(
                    'selected-card'
                );

            $("#selected_loan_product_id")
                .val(
                    $(this)
                    .data(
                        'loan-product-id'
                    )
                );

            $("#settlement_term")
                .val(
                    $(this)
                    .data(
                        'max-term'
                    )
                );

            computeSettlementAmounts();

        }
    );

    $(document).on(
        'keyup change',
        '#settlement_amount, #settlement_term, #settlement_interest, #settlement_penalty',
        function(){
            computeSettlementAmounts();

        }
    );
    

    $("#btnGenerateSchedule").click(async function () {
        await borrowerView.funx.getPaymentReport();
        borrowerView.funx.generateSchedule();
    });

    $("#btnSaveLoan").click(function(){

        let comakers = [];
        let bonusDeductions = [];

        $(".co-maker-item").each(function(){

            comakers.push({

                name:
                    $(this)
                    .find(".cm_name")
                    .val(),

                phone:
                    $(this)
                    .find(".cm_phone")
                    .val(),

                address:
                    $(this)
                    .find(".cm_address")
                    .val()

            });

        });


        $("#bonusDeductionBody tr").each(function(){

            bonusDeductions.push({

                deduction_type:

                    $(this)
                    .find('.deduction_type')
                    .val(),

                amount:

                    parseFloat(

                        $(this)
                        .find('.deduction_amount')
                        .val()

                    ) || 0

            });

        });

        let payload = {
            borrower_id:
                borrowerId,
            loan_product_id:
                $("#loan_product_id").val(),
            loan_amount:
                $("#loan_amount").val(),
            loan_purpose:
                $("#loan_purpose").val(),
            loan_terms:
                $("#loan_terms").val(),
            approved_interest_rate:
                $("#approved_interest_rate").val(),
            approved_processing_fee:
                $("#approved_processing_fee").val(),
            primary_card_name:
                $("#primary_card_name").val(),
            primary_card_number:
                $("#primary_card_number").val(),
            secondary_card_name:
                $("#secondary_card_name").val(),
            secondary_card_number:
                $("#secondary_card_number").val(),
            interest_amount:
                $("#interest_amount").val(),
            processingfee_amount:
                $("#processingfee_amount").val(),
            net_proceeds:
                $("#net_proceeds").val(),
            monthly_interest_deduction:
                $("#monthly_interest_deduction").val(),
            comakers:
                comakers,
            bonus_deductions:
                bonusDeductions,
            
            

        };

        console.log(payload);
        borrowerView.funx.addloan(payload)
    });

    $("#addCoMaker").on("click", function () {
        let html = `
        <div class="co-maker-item border rounded p-3 mt-2 bg-light">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <strong>
                    <i class="bi bi-people"></i>
                    Co-Maker
                </strong>

                <div>

                    <label class="form-check-label me-3">

                        <input
                            type="checkbox"
                            class="form-check-input toggleBorrowerSelect">

                        Use Borrower List

                    </label>

                    <button
                        type="button"
                        class="btn btn-danger btn-sm removeCoMaker">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </div>

            <div class="row">

                <div class="col-md-4 mb-3 borrower-select-wrapper d-none">

                    <label class="form-label">

                        Select Borrower

                    </label>

                    <select
                        class="form-select coMakerSelect">

                        ${borrowerView.funx.buildBorrowerOptions()}

                    </select>

                </div>

                <div class="col-md-4 mb-3">

                    <label class="form-label">

                        Name

                    </label>

                    <input
                        type="text"
                        class="form-control cm_name">

                </div>

                <div class="col-md-4 mb-3">

                    <label class="form-label">

                        Phone

                    </label>

                    <input
                        type="text"
                        class="form-control cm_phone">

                </div>

                <div class="col-md-4 mb-3">

                    <label class="form-label">

                        Address

                    </label>

                    <input
                        type="text"
                        class="form-control cm_address">

                </div>

            </div>

        </div>
        `;

        let $html = $(html);

        $("#coMakerContainer")
            .append($html);

        $html.find(".coMakerSelect").select2({

            width:'100%',

            placeholder:'Select Co-Maker',

            dropdownParent:$('#loanModal')

        });

    });

    $(document).on(
        'change',
        '.toggleBorrowerSelect',
        function(){

            let container =
                $(this)
                .closest('.co-maker-item');

            container
                .find('.borrower-select-wrapper')
                .toggleClass(
                    'd-none',
                    !$(this).is(':checked')
                );

        }
    );

    $(document).on(
        'change',
        '.coMakerSelect',
        function(){

            let selected =
                $(this)
                .find(':selected');

            let container =
                $(this)
                .closest('.co-maker-item');

            container
                .find('.cm_name')
                .val(
                    selected.data('name')
                );

            container
                .find('.cm_phone')
                .val(
                    selected.data('phone')
                );

            container
                .find('.cm_address')
                .val(
                    selected.data('address')
                );

        }
    );

    $(document).on(
        'click',
        '.removeCoMaker',
        function(){

            $(this)
                .closest('.co-maker-item')
                .remove();

        }
    );

    $('#loanModal').on('shown.bs.modal', function () {
        borrowerView.funx.fillLoanProductDropdown();
    });

    $(document).on('shown.bs.tab', '[data-bs-toggle="pill"]', function (e) {
   
        let target = $(this).attr('data-bs-target');

        console.log(target);

        if (target == '#paymentReportTab') {
            borrowerView.funx.generateSchedule();

        }

    });

    $(document).off('keyup.loanAmount change.loanAmount', '#loan_amount');

    $(document).on(
        'keyup.loanAmount change.loanAmount change.loanProduct',
        '#loan_amount,#loan_terms,#approved_interest_rate,#approved_processing_fee',
        function () {

            let amount = parseFloat($("#loan_amount").val()) || 0;

            let term = parseFloat($("#loan_terms").val()) || 0;

            let interestRate =
                parseFloat($("#approved_interest_rate").val()) || 0;

            let processingFeePercent =
                parseFloat($("#approved_processing_fee").val()) || 0;

            // Processing Fee Amount
            let processingFeeAmount =
                (amount * processingFeePercent) / 100;

            // Interest Amount
            let interestAmount =
                ((amount * interestRate) / 100) * term;

            // Net Proceeds
            let netProceeds = amount;

            if (processingFeePercent > 0) {

                netProceeds = amount - processingFeeAmount;

            } else {

                netProceeds = amount - interestAmount;

            }

            $("#interest_amount").val(
                interestAmount.toFixed(2)
            );

            $("#processingfee_amount").val(
                processingFeeAmount.toFixed(2)
            );

            $("#net_proceeds").val(
                netProceeds.toFixed(2)
            );
        },
    );

    $(document).on(
        'click',
        '.btn-remove-deduction',
        function(){

            $(this)
                .closest('tr')
                .remove();

        }
    );

    $(document).on(
        'click',
        '.btn-view-bonus',
        function(){

            let collectionId =
                $(this).data(
                    'collection-id'
                );

            borrowerView.funx
                .viewBonusDetails(
                    collectionId
                );

        }
    );

    $(document).on(
    'click',
    '.btn-pay-bonus',
        function(){

            let collectionId =
                $(this).data(
                    'collection-id'
                );

            let deductionAmount =
                parseFloat(
                    $(this).data(
                        'deduction-amount'
                    ) || 0
                );

            let creditedAmount =
                parseFloat(
                    $(this).data(
                        'credited-amount'
                    ) || 0
                );

            let type =
                $(this).data(
                    'type'
                );

            let sukli =
                Math.max(
                    0,
                    creditedAmount -
                    deductionAmount
                );

            Swal.fire({

                title:
                    'Confirm Bonus Payment',

                html:`

                    <strong>

                        ${type}

                    </strong>

                    <br><br>

                    Required Deduction:

                    <strong>

                        ₱${deductionAmount.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:2
                            }
                        )}

                    </strong>

                    <br><br>

                    Credited Benefit:

                    <strong>

                        ₱${creditedAmount.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:2
                            }
                        )}

                    </strong>

                    <br><br>

                    Sukli:

                    <strong class="text-primary">

                        ₱${sukli.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:2
                            }
                        )}

                    </strong>

                `,

                icon:'question',

                showCancelButton:true,

                confirmButtonText:
                    'PAY NOW',

                cancelButtonText:
                    'CANCEL'

            }).then(
                function(result){

                    if(
                        result.isConfirmed
                    ){

                        borrowerView.funx
                            .payBonusCollection(
                                collectionId
                            );

                    }

                }
            );

        }
    );

    $(document).on(
    'click',
    '.btn-settle-bonus',
        function(){

            let loanId =
                $(this).data(
                    'loan-id'
                );

            let deductionId =
                $(this).data(
                    'bonus-deduction-id'
                );

            let amount =
                parseFloat(
                    $(this).data(
                        'amount'
                    )
                );

            let type =
                $(this).data(
                    'type'
                );

            Swal.fire({

                title:
                    'Add to Settlement?',

                html:`

                    <strong>

                        ${type}

                    </strong>

                    <br><br>

                    Amount

                    <h3>

                        ₱${amount.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits:2
                            }
                        )}

                    </h3>

                    This amount will be added to the borrower's settlement.

                `,

                icon:'question',

                showCancelButton:true,

                confirmButtonText:
                    'ADD TO SETTLEMENT'

            }).then(
                function(result){

                    if(
                        result.isConfirmed
                    ){

                      borrowerView.funx
                        .addBonusSettlement({

                            borrower_id:
                                borrowerId,

                            loan_id:
                                loanId,

                            bonus_deduction_id:
                                deductionId,

                            deduction_type:
                                type,

                            amount:
                                amount

                        });

                    }

                }

            );

        }
    );

    $(document).on(
    'click',
    '.btn-view-settlement',
    function(){

            let settlementId =
                $(this).data(
                    'settlement-id'
                );

            borrowerView.funx
                .viewSettlement(
                    settlementId
                );

        }
    );

    $("#btnAddBonusDeduction").click(function(){

        $("#bonusDeductionBody").append(`

            <tr>

                <td>

                    <select
                        class="form-control deduction_type">

                        <option value="MIDYEAR">
                            Midyear Bonus
                        </option>

                        <option value="YEAR_END">
                            Year End Bonus
                        </option>

                        <option value="PBB">
                            PBB
                        </option>

                        <option value="CLOTHING">
                            Clothing Allowance
                        </option>

                        <option value="CHALK">
                            Chalk Allowance
                        </option>

                        <option value="PEI">
                            PEI
                        </option>

                    </select>

                </td>

                <td>

                    <input
                        type="number"
                        class="form-control deduction_amount"
                        value="0">

                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn-danger btn-remove-deduction">

                        Remove

                    </button>

                </td>

            </tr>

        `);

    });

    function computeSettlementAmounts(){

        let amount = parseFloat(
            $("#settlement_amount").val()
        ) || 0;

        let selectedCard =
            $(".settlement-product-card.selected-card");

        if(
            selectedCard.length == 0
        ){
            return;
        }

        let interestRate =
        parseFloat(
            $("#settlement_interest").val()
        ) || 0;

        let penaltyRate =
        parseFloat(
            $("#settlement_penalty").val()
        ) || 0;

        let interestAmount =
            amount *
            (interestRate / 100);

        let penaltyAmount =
            amount *
            (penaltyRate / 100);

        let totalLoanAmount =
            amount +
            interestAmount +
            penaltyAmount;

        let netRelease =
            amount;

        $("#settlement_interest_amount")
            .val(
                interestAmount.toFixed(2)
            );

        $("#settlement_penalty_amount")
            .val(
                penaltyAmount.toFixed(2)
            );

        $("#settlement_total_amount")
            .val(
                totalLoanAmount.toFixed(2)
            );

        $("#summarySettlement")
            .html(
                "₱" +
                amount.toLocaleString()
            );

        $("#summaryNet")
            .html(
                "₱" +
                netRelease.toLocaleString()
            );

        $("#summaryTotal")
            .html(
                "₱" +
                totalLoanAmount.toLocaleString()
            );

    }

});

