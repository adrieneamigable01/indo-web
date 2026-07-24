let borrowerSalaryPage = {

    table: null,

    salaries: {},

    editedSalaries : {},
    

    borrowers: [],

    summary: {

        total: 0,

        active: 0,

        inactive: 0,

        gross: 0

    },

    init: function () {

        let today = new Date();

        let month = today.getMonth() + 1;

        let year = today.getFullYear();

        if (month < 10) {

            month = "0" + month;

        }

        $("#salaryMonth").val(`${year}-${month}`);
            
        borrowerSalaryPage.funx.loadBorrowers();

        borrowerSalaryPage.funx.loadSalaries();
        borrowerSalaryPage.funx.loadSummary();

    },

    funx: {

        /*
        |--------------------------------------------------------------------------
        | LOAD BORROWERS
        |--------------------------------------------------------------------------
        */

        loadBorrowers: function () {

            jsAddon.display.ajaxRequest({

                url: borrowerApi,

                type: "GET",

                payload: {

                    length: -1

                },

                dataType: "json"

            }).then(function (response) {

                if (response.isError)
                    return;

                borrowerSalaryPage.borrowers = response.data;

                let html = `

                    <option value="">

                        All Borrowers

                    </option>

                `;

                $.each(

                    response.data,

                    function (_, row) {

                        html += `

                            <option
                                value="${row.borrower_id}">

                                ${row.last_name},
                                ${row.first_name}

                            </option>

                        `;

                    }

                );

                $("#filterBorrower").html(html);

                $("#salaryBorrower").html(html);

            });

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD SALARIES
        |--------------------------------------------------------------------------
        */
        loadSummary: function () {

            jsAddon.display.ajaxRequest({

                url: borrowerSalarySummaryApi,

                type: "GET",

                payload: {

                    salary_month: $("#salaryMonth").val()

                },

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {
                    return;
                }
                borrowerSalaryPage.summary = response.data;

                borrowerSalaryPage.funx.renderSummary();

            });

        },
        loadSalaries: function () {

            if ($.fn.DataTable.isDataTable("#salaryTable")) {
                $("#salaryTable").DataTable().destroy();
            }

            $("#salaryTable tbody").empty();

            borrowerSalaryPage.table = $("#salaryTable").DataTable({

                processing: true,
                serverSide: true,
                destroy: true,

                // Disable temporarily while debugging
                responsive: false,

                autoWidth: false,
                scrollX: true,
                searching: false,
                ordering: true,
                pageLength: 10,
                order: [[1, "asc"]],

                ajax: function (data, callback) {

                    jsAddon.display.ajaxRequest({

                        url: borrowerSalaryApi,

                        type: "GET",

                        payload: {

                            draw: data.draw,

                            start: data.start,

                            length: data.length,

                            orderColumn: data.columns[data.order[0].column].data,

                            orderDir: data.order[0].dir,

                            salary_month: $("#salaryMonth").val(),

                            search: $("#txtSearch").val()

                        },

                        dataType: "json"

                    }).then(function (response) {

                        borrowerSalaryPage.salaries = {};
                        borrowerSalaryPage.summary = {
                            totalBorrowers: 0,

                            withSalary: 0,

                            withoutSalary: 0,

                            totalATM: 0,

                            totalAutoDebit: 0,

                            totalGrossSalary: 0
                        };

                        $.each(response.data || [], function (_, row) {

                            borrowerSalaryPage.salaries[row.salary_id] = row;

                          

                        });

                       
                        
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
                        data: "salary_id",
                        defaultContent: ""
                    },

                    {
                        data: "borrower_name",
                        defaultContent: ""
                    },

                    // Gross Salary
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            const gross =
                                (parseFloat(row.atm_withdrawal_amount) || 0) +
                                (parseFloat(row.auto_debit_amount) || 0);

                            return `
                            <input
                                type="text"
                                class="form-control form-control-sm txtGrossSalary"
                                value="${gross.toFixed(2)}"
                                data-borrower="${row.borrower_id}"
                                data-salary="${row.salary_id ?? ''}"
                                readonly
                                style="
                                    background-color:#e9ecef;
                                    color:#6c757d;
                                    pointer-events:none;
                                    font-weight:600;
                                    text-align:right;
                                ">
                        `;
                        }
                    },

                    // ATM Withdrawal
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            return `
                                <input type="number"
                                    data-borrower="${row.borrower_id}"
                                    data-salary="${row.salary_id ?? ''}"
                                    class="form-control form-control-sm txtATMWithdrawal"
                                    value="${row.atm_withdrawal_amount || 0}">
                            `;

                        }
                    },

                    // Auto Debit
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            return `
                                <input type="number"
                                    data-borrower="${row.borrower_id}"
                                    data-salary="${row.salary_id ?? ''}"
                                    class="form-control form-control-sm txtAutoDebit"
                                    value="${row.auto_debit_amount || 0}">
                            `;

                        }
                    },

                    // Remarks
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            return `
                                <input type="text"
                                    data-borrower="${row.borrower_id}"
                                    data-salary="${row.salary_id ?? ''}"
                                    class="form-control form-control-sm txtRemarks"
                                    value="${row.remarks || ""}">
                            `;

                        }
                    },

                    // Save Button
                    {
                        data: null,
                        orderable: false,
                        searchable: false,
                        defaultContent: "",
                        render: function (data, type, row) {
                            return `-`
                            // return `
                            //     <button class="btn btn-success btn-sm btnSaveSalary"
                            //         data-borrower="${row.borrower_id}"
                            //         data-salary="${row.salary_id || ""}">
                            //         <i class="bi bi-save"></i>
                            //     </button>
                            // `;

                        }
                    }

                ]

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

       renderSummary: function () {

            const s = borrowerSalaryPage.summary;

            $("#totalBorrowers").text(s.totalBorrowers);

            $("#withSalary").text(s.withSalary);

            $("#withoutSalary").text(s.withoutSalary);

            $("#totalATM").text(

                jsAddon.display.money(s.totalATM)

            );

            $("#totalAutoDebit").text(

                jsAddon.display.money(s.totalAutoDebit)

            );

            $("#totalGrossSalary").text(

                jsAddon.display.money(s.totalGrossSalary)

            );

        },

        /*
        |--------------------------------------------------------------------------
        | STATUS BADGE
        |--------------------------------------------------------------------------
        */

        statusBadge: function (

            status

        ) {

            switch (

                String(status).toUpperCase()

            ) {

                case "ACTIVE":

                    return `

                        <span class="badge bg-success">

                            ACTIVE

                        </span>

                    `;

                case "INACTIVE":

                    return `

                        <span class="badge bg-secondary">

                            INACTIVE

                        </span>

                    `;

                default:

                    return `

                        <span class="badge bg-light text-dark">

                            ${status}

                        </span>

                    `;

            }

        },

        /*
        |--------------------------------------------------------------------------
        | ACTION BUTTONS
        |--------------------------------------------------------------------------
        */

        actionButtons: function (

            row

        ) {

            return `

                <div class="dropdown">

                    <button

                        class="btn btn-sm btn-outline-secondary dropdown-toggle"

                        data-bs-toggle="dropdown">

                        <i class="bi bi-three-dots"></i>

                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">

                        <li>

                            <a

                                href="javascript:void(0)"

                                class="dropdown-item btn-view"

                                data-id="${row.salary_id}">

                                <i class="bi bi-eye text-info me-2"></i>

                                View

                            </a>

                        </li>

                        <li>

                            <a

                                href="javascript:void(0)"

                                class="dropdown-item btn-edit"

                                data-id="${row.salary_id}">

                                <i class="bi bi-pencil text-primary me-2"></i>

                                Edit

                            </a>

                        </li>

                        <li>

                            <hr class="dropdown-divider">

                        </li>

                        <li>

                            <a

                                href="javascript:void(0)"

                                class="dropdown-item text-danger btn-delete"

                                data-id="${row.salary_id}">

                                <i class="bi bi-trash me-2"></i>

                                Delete

                            </a>

                        </li>

                    </ul>

                </div>

            `;

        },
                /*
        |--------------------------------------------------------------------------
        | RESET FORM
        |--------------------------------------------------------------------------
        */

        resetForm: function () {

            $("#salaryId").val("");

            $("#salaryBorrower").val("").trigger("change");

            $("#salaryMonth").val("");

            $("#grossSalary").val("");

            $("#salaryRemarks").val("");

            $("#salaryStatus").val("ACTIVE");

        },

        /*
        |--------------------------------------------------------------------------
        | ADD SALARY
        |--------------------------------------------------------------------------
        */

        addSalary: function () {

            borrowerSalaryPage.funx.resetForm();

            $("#salaryModalTitle").html(`

                <i class="bi bi-plus-circle"></i>

                Add Borrower Salary

            `);

            new bootstrap.Modal(

                document.getElementById(
                    "salaryModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | VIEW SALARY
        |--------------------------------------------------------------------------
        */

        viewSalary: function (

            salaryId

        ) {

            let salary =

                borrowerSalaryPage.salaries[
                    String(salaryId)
                ];

            if (!salary) {

                Swal.fire(

                    "Error",

                    "Salary record not found.",

                    "error"

                );

                return;

            }

            let html = `

                <div class="row">

                    <div class="col-md-6 mb-3">

                        <label class="text-muted">

                            Borrower

                        </label>

                        <h6>

                            ${salary.borrower_name}

                        </h6>

                    </div>

                    <div class="col-md-6 mb-3">

                        <label class="text-muted">

                            Salary Month

                        </label>

                        <h6>

                            ${salary.salary_month}

                        </h6>

                    </div>

                    <div class="col-md-6 mb-3">

                        <label class="text-muted">

                            Gross Salary

                        </label>

                        <h6>

                            ${jsAddon.display.money(
                                salary.gross_salary
                            )}

                        </h6>

                    </div>

                    <div class="col-md-6 mb-3">

                        <label class="text-muted">

                            Status

                        </label>

                        <h6>

                            ${borrowerSalaryPage.funx.statusBadge(
                                salary.status
                            )}

                        </h6>

                    </div>

                    <div class="col-md-12">

                        <label class="text-muted">

                            Remarks

                        </label>

                        <p>

                            ${salary.remarks || "-"}

                        </p>

                    </div>

                </div>

            `;

            $("#salaryDetails")

                .html(html);

            new bootstrap.Modal(

                document.getElementById(
                    "viewSalaryModal"
                )

            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | EDIT SALARY
        |--------------------------------------------------------------------------
        */

        editSalary: function (

            salaryId

        ) {

            jsAddon.display.ajaxRequest({

                url:

                    borrowerSalaryDetailsApi +

                    "/" +

                    salaryId,

                type:

                    "GET",

                dataType:

                    "json"

            }).then(function (

                response

            ) {

                if (

                    response.isError

                ) {

                    Swal.fire(

                        "Error",

                        response.message,

                        "error"

                    );

                    return;

                }

                let row =

                    response.data;

                borrowerSalaryPage.funx.resetForm();

                $("#salaryModalTitle").html(`

                    <i class="bi bi-pencil-square"></i>

                    Edit Borrower Salary

                `);

                $("#salaryId")

                    .val(row.salary_id);

                $("#salaryBorrower")

                    .val(row.borrower_id)

                    .trigger("change");

                $("#salaryMonth")

                    .val(row.salary_month);

                $("#grossSalary")

                    .val(row.gross_salary);

                $("#salaryRemarks")

                    .val(row.remarks);

                $("#salaryStatus")

                    .val(row.status);

                new bootstrap.Modal(

                    document.getElementById(
                        "salaryModal"
                    )

                ).show();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE
        |--------------------------------------------------------------------------
        */

        saveSalary: function () {

            let payload = {

                salary_id:

                    $("#salaryId").val(),

                borrower_id:

                    $("#salaryBorrower").val(),

                salary_month:

                    $("#salaryMonth").val(),

                gross_salary:

                    $("#grossSalary").val(),

                remarks:

                    $("#salaryRemarks").val(),

                status:

                    $("#salaryStatus").val()

            };

            if (

                payload.borrower_id == ""

            ) {

                Swal.fire(

                    "Warning",

                    "Please select borrower.",

                    "warning"

                );

                return;

            }

            if (

                payload.salary_month == ""

            ) {

                Swal.fire(

                    "Warning",

                    "Please select salary month.",

                    "warning"

                );

                return;

            }

            if (

                payload.gross_salary == ""

            ) {

                Swal.fire(

                    "Warning",

                    "Please enter gross salary.",

                    "warning"

                );

                return;

            }

            Swal.fire({

                title:

                    payload.salary_id == ""

                    ?

                    "Add Salary?"

                    :

                    "Update Salary?",

                icon:

                    "question",

                showCancelButton:

                    true,

                confirmButtonText:

                    "Save"

            }).then(function (

                result

            ) {

                if (

                    !result.isConfirmed

                )

                    return;

                jsAddon.display.ajaxRequest({

                    url:

                        saveBorrowerSalaryApi,

                    type:

                        "POST",

                    payload:

                        payload,

                    dataType:

                        "json"

                }).then(function (

                    response

                ) {

                    if (

                        response.isError

                    ) {

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
                                "salaryModal"
                            )

                        )

                        .hide();

                    Swal.fire({

                        icon:

                            "success",

                        title:

                            "Success",

                        text:

                            response.message,

                        timer:

                            1500,

                        showConfirmButton:

                            false

                    });

                    borrowerSalaryPage.funx.loadSalaries();

                });

            });

        },
         deleteSalary: function (

            salaryId

        ) {

            let salary =

                borrowerSalaryPage.salaries[
                    String(salaryId)
                ];

            if (!salary) {

                Swal.fire(

                    "Error",

                    "Salary record not found.",

                    "error"

                );

                return;

            }

            Swal.fire({

                title:

                    "Delete Salary?",

                html:

                    `
                    Are you sure you want to delete this salary record?

                    <br><br>

                    <strong>

                        ${salary.borrower_name}

                    </strong>

                    `,

                icon:

                    "warning",

                showCancelButton:

                    true,

                confirmButtonColor:

                    "#dc3545",

                confirmButtonText:

                    "Delete"

            }).then(function (

                result

            ) {

                if (

                    !result.isConfirmed

                ) {

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url:

                        deleteBorrowerSalaryApi +

                        "/" +

                        salaryId,

                    type:

                        "DELETE",

                    dataType:

                        "json"

                }).then(function (

                    response

                ) {

                    if (

                        response.isError

                    ) {

                        Swal.fire(

                            "Error",

                            response.message,

                            "error"

                        );

                        return;

                    }

                    Swal.fire({

                        icon:

                            "success",

                        title:

                            "Deleted",

                        text:

                            response.message,

                        timer:

                            1500,

                        showConfirmButton:

                            false

                    });

                    borrowerSalaryPage.funx.loadSalaries();
                    borrowerSalaryPage.funx.loadSummary();

                });

            });

        }
        
    }

};

/*
|--------------------------------------------------------------------------
| DOCUMENT READY
|--------------------------------------------------------------------------
*/

$(function () {

    borrowerSalaryPage.init();




    $("#salaryMonth").change(function () {

        borrowerSalaryPage.funx.loadSalaries();
        borrowerSalaryPage.funx.loadSummary();

    });

    $("#btnLoadSalary").click(function () {

        borrowerSalaryPage.funx.loadSalaries();
        borrowerSalaryPage.funx.loadSummary();

    });

    /*
    |--------------------------------------------------------------------------
    | ADD
    |--------------------------------------------------------------------------
    */

  

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    $(document).on("click", ".btnSaveSalary", function () {

        let tr = $(this).closest("tr");

        let payload = {

            salary_id: $(this).data("salary"),

            borrower_id: $(this).data("borrower"),

            salary_month: $("#salaryMonth").val(),

            gross_salary: tr.find(".txtSalary").val(),

            remarks: tr.find(".txtRemarks").val(),

            status: tr.find(".txtStatus").val()

        };

        jsAddon.display.ajaxRequest({

            url: saveBorrowerSalaryApi,

            type: "POST",

            payload: payload,

            dataType: "json"

        }).then(function (response) {

            if (response.isError) {

                Swal.fire("Error", response.message, "error");

                return;

            }

            Swal.fire({

                icon: "success",

                title: "Salary saved",

                timer: 1000,

                showConfirmButton: false

            });

            borrowerSalaryPage.funx.loadSalaries();
            borrowerSalaryPage.funx.loadSummary();

        });

    });

    /*
    |--------------------------------------------------------------------------
    | VIEW
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

            function () {

                borrowerSalaryPage.funx

                    .viewSalary(

                        $(this)

                            .data("id")

                    );

            }

        );

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    $(document)

        .off(

            "click",

            ".btn-edit"

        )

        .on(

            "click",

            ".btn-edit",

            function () {

                borrowerSalaryPage.funx

                    .editSalary(

                        $(this)

                            .data("id")

                    );

            }

        );

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    $(document)

        .off(

            "click",

            ".btn-delete"

        )

        .on(

            "click",

            ".btn-delete",

            function () {

                borrowerSalaryPage.funx

                    .deleteSalary(

                        $(this)

                            .data("id")

                    );

            }

        );

    /*
    |--------------------------------------------------------------------------
    | FILTER STATUS
    |--------------------------------------------------------------------------
    */

    $("#filterStatus")

        .off("change")

        .on(

            "change",

            function () {

                borrowerSalaryPage.funx

                    .loadSalaries();
                borrowerSalaryPage.funx.loadSummary();

            }

        );

    /*
    |--------------------------------------------------------------------------
    | FILTER BORROWER
    |--------------------------------------------------------------------------
    */

    $("#filterBorrower")

        .off("change")

        .on(

            "change",

            function () {

                borrowerSalaryPage.funx

                    .loadSalaries();
                    borrowerSalaryPage.funx.loadSummary();

            }

        );

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    $("#txtSearch")

        .off("keypress")

        .on(

            "keypress",

            function (

                e

            ) {

                if (

                    e.which == 13

                ) {

                    borrowerSalaryPage.funx

                        .loadSalaries();
                        borrowerSalaryPage.funx.loadSummary();

                }

            }

        );

    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */

    $("#btnRefreshSalary")

    .off("click")

    .on(

        "click",

        function () {

            $("#txtSearch")

                .val("");

            $("#filterBorrower")

                .val("");

            $("#filterStatus")

                .val("");

            borrowerSalaryPage.funx

                .loadSalaries();
                borrowerSalaryPage.funx.loadSummary();

        }

    );


   $(document).on("input", ".txtATMWithdrawal, .txtAutoDebit, .txtRemarks", function () {

        const row = $(this).closest("tr");

        const salaryId = $(this).data("salary");
        const borrowerId = $(this).data("borrower");

       

        const atm = parseFloat(row.find(".txtATMWithdrawal").val()) || 0;
        const auto = parseFloat(row.find(".txtAutoDebit").val()) || 0;
        const remarks = row.find(".txtRemarks").val();

        borrowerSalaryPage.editedSalaries[salaryId || borrowerId] = {

            salary_id: salaryId,

            borrower_id: borrowerId,

            gross_salary: atm + auto,

            atm_withdrawal_amount: atm,

            auto_debit_amount: auto,

            remarks: remarks

        };

    });

    

    $(document).on("click", "#btnSaveAllSalary", function () {

  

    const salaries = Object.values(borrowerSalaryPage.editedSalaries);

    jsAddon.display.ajaxRequest({

        url: saveBulkSalaryApi,

        type: "POST",

        payload: {

            salary_month: $("#salaryMonth").val(),

            salaries: salaries

        },

        contentType: "application/json",

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

            title: "Success",

            text: response.message,

            timer: 1500,

            showConfirmButton: false

        });

        borrowerSalaryPage.funx.loadSalaries();
        borrowerSalaryPage.funx.loadSummary();

    }).catch(function (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to save salary records.",
            "error"
        );

    });

});

});