const employeeViewPage = {

    employee: {},

    tables: {

        salaryHistory: null,

        timelogs: null,

        payroll: null,

        documents: null,

        logs: null

    },

    funx: {

        /*
        |--------------------------------------------------------------------------
        | Initialize Page
        |--------------------------------------------------------------------------
        */

        initialize: function () {

            employeeViewPage.funx.loadEmployee();

            employeeViewPage.funx.initializeEvents();

            employeeViewPage.funx.loadSchedule();

            employeeViewPage.funx.loadScheduleDates();

            employeeViewPage.funx.loadSalary();

            employeeViewPage.funx.initializeGovernmentTable();

            employeeViewPage.funx.loadGovernment();

        },

        /*
        |--------------------------------------------------------------------------
        | Load Employee
        |--------------------------------------------------------------------------
        */

        loadEmployee: function () {

            jsAddon.display.ajaxRequest({

                url: employeeApi,

                type: "GET",

                payload: {

                    employee_id: employeeId

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

                if (!response.data.length) {

                    Swal.fire({

                        icon: "warning",

                        title: "Employee not found"

                    }).then(function () {

                        window.location = employeePageUrl;

                    });

                    return;

                }

                employeeViewPage.employee =
                    response.data[0];

                employeeViewPage.funx.populateHeader();

                employeeViewPage.funx.populateProfile();

                employeeViewPage.funx.populateSummary();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | Header
        |--------------------------------------------------------------------------
        */

        populateHeader: function () {

            let employee =
                employeeViewPage.employee;

            let fullname = [

                employee.lastname,

                ", ",

                employee.firstname,

                employee.middlename
                    ? " " +
                    employee.middlename
                    .charAt(0)
                    .toUpperCase() +
                    "."
                    : "",

                employee.suffix
                    ? ", " +
                    employee.suffix
                    : ""

            ].join("");

            $("#employeeName").text(

                fullname.toUpperCase()

            );

            $("#employeeNo").text(

                employee.employee_no

            );

            $("#employeeStatus")

                .removeClass()

                .addClass(

                    employee.is_active == 1

                        ? "badge bg-success fs-6"

                        : "badge bg-danger fs-6"

                )

                .text(

                    employee.is_active == 1

                        ? "ACTIVE"

                        : "INACTIVE"

                );

            $("#employeePhoto").attr(

                "src",

                employee.photo ??

                "../assets/images/default-user.png"

            );

        },

        /*
        |--------------------------------------------------------------------------
        | Summary
        |--------------------------------------------------------------------------
        */

        populateSummary: function () {

            let employee =
                employeeViewPage.employee;

            $("#summaryDepartment").text(

                employee.department ??

                "-"

            );

            $("#summaryPosition").text(

                employee.position ??

                "-"

            );

            $("#summaryDateHired").text(

                employee.date_hired ??

                "-"

            );

            $("#summarySalary").text(

                "₱ " +

                jsAddon.display.money(

                    employee.basic_salary ?? 0

                )

            );

        },

        /*
        |--------------------------------------------------------------------------
        | Profile
        |--------------------------------------------------------------------------
        */

        populateProfile: function () {

            let employee =
                employeeViewPage.employee;

            $("#viewEmployeeNo").val(

                employee.employee_no

            );

            $("#viewEmploymentStatus").val(

                employee.employment_status

            );

            $("#viewFirstname").val(

                employee.firstname

            );

            $("#viewMiddlename").val(

                employee.middlename

            );

            $("#viewLastname").val(

                employee.lastname

            );

            $("#viewSuffix").val(

                employee.suffix

            );

            $("#viewGender").val(

                employee.gender

            );

            $("#viewBirthDate").val(

                employee.birth_date

            );

            $("#viewMobileNumber").val(

                employee.mobile_number

            );

            $("#viewEmail").val(

                employee.email

            );

            $("#viewAddress").val(

                employee.address

            );

            $("#viewDepartment").val(

                employee.department

            );

            $("#viewPosition").val(

                employee.position

            );

            $("#viewDateHired").val(

                employee.date_hired

            );

            $("#viewPayrollType").val(

                employee.payroll_type

            );

        },

        /*
        |--------------------------------------------------------------------------
        | Events
        |--------------------------------------------------------------------------
        */

        initializeEvents: function () {

            $("#btnEditEmployee").on(

                "click",

                function () {

                    window.location =

                        employeePageUrl +

                        "?edit=" +

                        employeeId;

                }

            );

        },
                /*
        |--------------------------------------------------------------------------
        | Salary Summary
        |--------------------------------------------------------------------------
        */

        populateSalary: function () {

            let employee =
                employeeViewPage.employee;

            $("#currentBasicSalary").text(

                "₱ " +

                jsAddon.display.money(

                    employee.basic_salary ?? 0

                )

            );

            $("#currentDailyRate").text(

                "₱ " +

                jsAddon.display.money(

                    employee.daily_rate ?? 0

                )

            );

            $("#currentHourlyRate").text(

                "₱ " +

                jsAddon.display.money(

                    employee.hourly_rate ?? 0

                )

            );

        },

        /*
        |--------------------------------------------------------------------------
        | Salary History
        |--------------------------------------------------------------------------
        */

        loadSalaryHistory: function () {

            if (

                employeeViewPage.tables.salaryHistory

            ) {

                employeeViewPage.tables
                    .salaryHistory
                    .destroy();

            }

            employeeViewPage.tables.salaryHistory =

                $("#tblSalaryHistory")

                .DataTable({

                    processing: true,

                    destroy: true,

                    responsive: true,

                    searching: false,

                    ordering: true,

                    pageLength: 10,

                    ajax: function (

                        data,

                        callback

                    ) {

                        jsAddon.display.ajaxRequest({

                            url:

                                employeeSalaryHistoryApi,

                            type: "GET",

                            payload: {

                                employee_id:

                                    employeeId

                            },

                            dataType: "json"

                        })

                        .then(function (

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

                            callback({

                                data:

                                    response.data

                            });

                        });

                    },

                    columns: [

                        {

                            data: null,

                            render: function (

                                data,

                                type,

                                row,

                                meta

                            ) {

                                return (

                                    meta.row + 1

                                );

                            }

                        },

                        {

                            data:

                                "effective_date"

                        },

                        {

                            data:

                                "basic_salary",

                            render:

                                function (

                                    data

                                ) {

                                    return (

                                        "₱ " +

                                        jsAddon.display.money(

                                            data

                                        )

                                    );

                                }

                        },

                        {

                            data:

                                "daily_rate",

                            render:

                                function (

                                    data

                                ) {

                                    return (

                                        "₱ " +

                                        jsAddon.display.money(

                                            data

                                        )

                                    );

                                }

                        },

                        {

                            data:

                                "hourly_rate",

                            render:

                                function (

                                    data

                                ) {

                                    return (

                                        "₱ " +

                                        jsAddon.display.money(

                                            data

                                        )

                                    );

                                }

                        },

                        {

                            data:

                                "reason"

                        },

                        {

                            data:

                                "created_by_name"

                        },

                        {

                            data: null,

                            orderable: false,

                            searchable: false,

                            render: function (

                                data

                            ) {

                                return `

                                    <button
                                        class="btn btn-sm btn-outline-primary">

                                        <i class="bi bi-eye"></i>

                                    </button>

                                `;

                            }

                        }

                    ]

                });

        },

        /*
        |--------------------------------------------------------------------------
        | Reload Salary History
        |--------------------------------------------------------------------------
        */

        reloadSalaryHistory: function () {

            if (

                employeeViewPage.tables
                    .salaryHistory

            ) {

                employeeViewPage.tables
                    .salaryHistory
                    .ajax
                    .reload(

                        null,

                        false

                    );

            }

        },
                /*
        |--------------------------------------------------------------------------
        | Time Logs Summary
        |--------------------------------------------------------------------------
        */

        populateTimelogSummary: function (summary) {

            summary = summary ?? {};

            $("#totalPresent").text(
                summary.present ?? 0
            );

            $("#totalLate").text(
                summary.late ?? 0
            );

            $("#totalUndertime").text(
                summary.undertime ?? 0
            );

            $("#totalOvertime").text(
                summary.overtime ?? 0
            );

        },

        /*
        |--------------------------------------------------------------------------
        | Load Employee Time Logs
        |--------------------------------------------------------------------------
        */

        loadTimelogs: function () {

            if (
                employeeViewPage.tables.timelogs
            ) {

                employeeViewPage.tables
                    .timelogs
                    .destroy();

            }

            employeeViewPage.tables.timelogs =

                $("#tblEmployeeTimelogs")

                .DataTable({

                    processing: true,

                    serverSide: true,

                    destroy: true,

                    responsive: true,

                    autoWidth: false,

                    searching: false,

                    ordering: true,

                    pageLength: 15,

                    order: [[1, "desc"]],

                    ajax: function (

                        data,

                        callback

                    ) {

                        jsAddon.display.ajaxRequest({

                            url:
                                employeeTimelogApi,

                            type: "GET",

                            payload: {

                                employee_id:
                                    employeeId,

                                draw:
                                    data.draw,

                                start:
                                    data.start,

                                length:
                                    data.length,

                                year:
                                    $("#filterTimelogYear").val(),

                                month:
                                    $("#filterTimelogMonth").val()

                            },

                            dataType: "json"

                        })

                        .then(function (

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

                            employeeViewPage
                                .funx
                                .populateTimelogSummary(

                                    response.summary

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

                    columns: [

                        {

                            data: null,

                            render: function (

                                data,

                                type,

                                row,

                                meta

                            ) {

                                return meta.row +

                                    meta.settings

                                    ._iDisplayStart +

                                    1;

                            }

                        },

                        {

                            data:
                                "attendance_date"

                        },

                        {

                            data:
                                "day_name"

                        },

                        {

                            data:
                                "time_in"

                        },

                        {

                            data:
                                "break_out"

                        },

                        {

                            data:
                                "break_in"

                        },

                        {

                            data:
                                "time_out"

                        },

                        {

                            data:
                                "late_minutes",

                            render:
                                function (

                                    data

                                ) {

                                    return (

                                        data ??

                                        0

                                    ) + " min";

                                }

                        },

                        {

                            data:
                                "undertime_minutes",

                            render:
                                function (

                                    data

                                ) {

                                    return (

                                        data ??

                                        0

                                    ) + " min";

                                }

                        },

                        {

                            data:
                                "overtime_minutes",

                            render:
                                function (

                                    data

                                ) {

                                    return (

                                        data ??

                                        0

                                    ) + " min";

                                }

                        },

                        {

                            data:
                                "attendance_status",

                            render:
                                function (

                                    data

                                ) {

                                    switch (data) {

                                        case "PRESENT":

                                            return '<span class="badge bg-success">Present</span>';

                                        case "LATE":

                                            return '<span class="badge bg-warning">Late</span>';

                                        case "ABSENT":

                                            return '<span class="badge bg-danger">Absent</span>';

                                        case "LEAVE":

                                            return '<span class="badge bg-primary">Leave</span>';

                                        default:

                                            return '<span class="badge bg-secondary">-</span>';

                                    }

                                }

                        }

                    ]

                });

        },

        /*
        |--------------------------------------------------------------------------
        | Reload Time Logs
        |--------------------------------------------------------------------------
        */

        reloadTimelogs: function () {

            if (

                employeeViewPage.tables
                    .timelogs

            ) {

                employeeViewPage.tables
                    .timelogs
                    .ajax
                    .reload(

                        null,

                        false

                    );

            }

        },
                /*
        |--------------------------------------------------------------------------
        | Payroll Summary
        |--------------------------------------------------------------------------
        */

        populatePayrollSummary: function (summary) {

            summary = summary ?? {};

            $("#grossSalary").text(

                "₱ " +

                jsAddon.display.money(

                    summary.gross_salary ?? 0

                )

            );

            $("#totalDeductions").text(

                "₱ " +

                jsAddon.display.money(

                    summary.total_deductions ?? 0

                )

            );

            $("#netSalary").text(

                "₱ " +

                jsAddon.display.money(

                    summary.net_salary ?? 0

                )

            );

        },

        /*
        |--------------------------------------------------------------------------
        | Payroll History
        |--------------------------------------------------------------------------
        */

        loadPayroll: function () {

            if (

                employeeViewPage.tables.payroll

            ) {

                employeeViewPage.tables
                    .payroll
                    .destroy();

            }

            employeeViewPage.tables.payroll =

                $("#tblPayrollHistory")

                .DataTable({

                    processing: true,

                    serverSide: true,

                    destroy: true,

                    responsive: true,

                    autoWidth: false,

                    searching: false,

                    ordering: true,

                    pageLength: 10,

                    order: [[1, "desc"]],

                    ajax: function (

                        data,

                        callback

                    ) {

                        jsAddon.display.ajaxRequest({

                            url:
                                employeePayrollApi,

                            type: "GET",

                            payload: {

                                employee_id:
                                    employeeId,

                                draw:
                                    data.draw,

                                start:
                                    data.start,

                                length:
                                    data.length,

                                year:
                                    $("#filterPayrollYear").val(),

                                month:
                                    $("#filterPayrollMonth").val()

                            },

                            dataType: "json"

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

                            employeeViewPage.funx
                                .populatePayrollSummary(

                                    response.summary

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

                    columns: [

                        {

                            data: null,

                            render: function (

                                data,

                                type,

                                row,

                                meta

                            ) {

                                return meta.row +

                                    meta.settings
                                    ._iDisplayStart +

                                    1;

                            }

                        },

                        {

                            data:
                                "payroll_no"

                        },

                        {

                            data:
                                "payroll_period"

                        },

                        {

                            data:
                                "gross_pay",

                            render:
                                function (

                                    data

                                ) {

                                    return "₱ " +

                                        jsAddon.display.money(

                                            data

                                        );

                                }

                        },

                        {

                            data:
                                "total_deduction",

                            render:
                                function (

                                    data

                                ) {

                                    return "₱ " +

                                        jsAddon.display.money(

                                            data

                                        );

                                }

                        },

                        {

                            data:
                                "net_pay",

                            render:
                                function (

                                    data

                                ) {

                                    return `

                                        <strong class="text-success">

                                            ₱ ${jsAddon.display.money(data)}

                                        </strong>

                                    `;

                                }

                        },

                        {

                            data:
                                "status",

                            render:
                                function (

                                    data

                                ) {

                                    switch(data){

                                        case "PAID":

                                            return `
                                                <span class="badge bg-success">
                                                    Paid
                                                </span>
                                            `;

                                        case "PENDING":

                                            return `
                                                <span class="badge bg-warning">
                                                    Pending
                                                </span>
                                            `;

                                        case "PROCESSING":

                                            return `
                                                <span class="badge bg-primary">
                                                    Processing
                                                </span>
                                            `;

                                        default:

                                            return `
                                                <span class="badge bg-secondary">
                                                    ${data}
                                                </span>
                                            `;

                                    }

                                }

                        },

                        {

                            data: null,

                            orderable: false,

                            searchable: false,

                            render: function (

                                data,

                                type,

                                row

                            ) {

                                return `

                                    <div class="dropdown">

                                        <button

                                            class="btn btn-light btn-sm"

                                            data-bs-toggle="dropdown">

                                            <i class="bi bi-three-dots"></i>

                                        </button>

                                        <ul class="dropdown-menu dropdown-menu-end">

                                            <li>

                                                <a
                                                    class="dropdown-item"
                                                    href="javascript:void(0)"
                                                    onclick="employeeViewPage.funx.viewPayslip('${row.payroll_id}')">

                                                    <i class="bi bi-eye text-primary me-2"></i>

                                                    View Payslip

                                                </a>

                                            </li>

                                            <li>

                                                <a
                                                    class="dropdown-item"
                                                    href="javascript:void(0)"
                                                    onclick="employeeViewPage.funx.printPayslip('${row.payroll_id}')">

                                                    <i class="bi bi-printer text-success me-2"></i>

                                                    Print

                                                </a>

                                            </li>

                                        </ul>

                                    </div>

                                `;

                            }

                        }

                    ]

                });

        },

        /*
        |--------------------------------------------------------------------------
        | Reload Payroll
        |--------------------------------------------------------------------------
        */

        reloadPayroll: function () {

            if (

                employeeViewPage.tables.payroll

            ) {

                employeeViewPage.tables
                    .payroll
                    .ajax
                    .reload(

                        null,

                        false

                    );

            }

        },
                /*
        |--------------------------------------------------------------------------
        | Employee Documents
        |--------------------------------------------------------------------------
        */

        loadDocuments: function () {

            if (

                employeeViewPage.tables.documents

            ) {

                employeeViewPage.tables
                    .documents
                    .destroy();

            }

            employeeViewPage.tables.documents =

                $("#tblEmployeeDocuments")

                .DataTable({

                    processing: true,

                    serverSide: true,

                    destroy: true,

                    responsive: true,

                    autoWidth: false,

                    searching: false,

                    ordering: true,

                    pageLength: 10,

                    order: [[4, "desc"]],

                    ajax: function (

                        data,

                        callback

                    ) {

                        jsAddon.display.ajaxRequest({

                            url:

                                employeeDocumentsApi,

                            type: "GET",

                            payload: {

                                employee_id:

                                    employeeId,

                                draw:

                                    data.draw,

                                start:

                                    data.start,

                                length:

                                    data.length

                            },

                            dataType: "json"

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

                    columns: [

                        {

                            data: null,

                            render: function (

                                data,

                                type,

                                row,

                                meta

                            ) {

                                return meta.row +

                                    meta.settings._iDisplayStart +

                                    1;

                            }

                        },

                        {

                            data:

                                "document_name"

                        },

                        {

                            data:

                                "category"

                        },

                        {

                            data:

                                "uploaded_by"

                        },

                        {

                            data:

                                "uploaded_at"

                        },

                        {

                            data: null,

                            orderable: false,

                            searchable: false,

                            render: function (

                                data,

                                type,

                                row

                            ) {

                                return `

                                    <div class="dropdown">

                                        <button

                                            class="btn btn-light btn-sm"

                                            data-bs-toggle="dropdown">

                                            <i class="bi bi-three-dots"></i>

                                        </button>

                                        <ul class="dropdown-menu dropdown-menu-end">

                                            <li>

                                                <a

                                                    class="dropdown-item"

                                                    href="javascript:void(0)"

                                                    onclick="employeeViewPage.funx.viewDocument('${row.document_id}')">

                                                    <i class="bi bi-eye text-primary me-2"></i>

                                                    View

                                                </a>

                                            </li>

                                            <li>

                                                <a

                                                    class="dropdown-item"

                                                    href="javascript:void(0)"

                                                    onclick="employeeViewPage.funx.downloadDocument('${row.document_id}')">

                                                    <i class="bi bi-download text-success me-2"></i>

                                                    Download

                                                </a>

                                            </li>

                                        </ul>

                                    </div>

                                `;

                            }

                        }

                    ]

                });

        },

        /*
        |--------------------------------------------------------------------------
        | Activity Logs
        |--------------------------------------------------------------------------
        */

        loadActivityLogs: function () {

            if (

                employeeViewPage.tables.logs

            ) {

                employeeViewPage.tables
                    .logs
                    .destroy();

            }

            employeeViewPage.tables.logs =

                $("#tblEmployeeLogs")

                .DataTable({

                    processing: true,

                    serverSide: true,

                    destroy: true,

                    responsive: true,

                    autoWidth: false,

                    searching: false,

                    ordering: true,

                    pageLength: 10,

                    order: [[1, "desc"]],

                    ajax: function (

                        data,

                        callback

                    ) {

                        jsAddon.display.ajaxRequest({

                            url:

                                employeeActivityLogsApi,

                            type: "GET",

                            payload: {

                                employee_id:

                                    employeeId,

                                draw:

                                    data.draw,

                                start:

                                    data.start,

                                length:

                                    data.length

                            },

                            dataType: "json"

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

                    columns: [

                        {

                            data: null,

                            render: function (

                                data,

                                type,

                                row,

                                meta

                            ) {

                                return meta.row +

                                    meta.settings._iDisplayStart +

                                    1;

                            }

                        },

                        {

                            data:

                                "created_at"

                        },

                        {

                            data:

                                "activity"

                        },

                        {

                            data:

                                "description"

                        },

                        {

                            data:

                                "created_by"

                        }

                    ]

                });

        },

        /*
        |--------------------------------------------------------------------------
        | Reload Documents
        |--------------------------------------------------------------------------
        */

        reloadDocuments: function () {

            if (

                employeeViewPage.tables.documents

            ) {

                employeeViewPage.tables.documents

                    .ajax

                    .reload(

                        null,

                        false

                    );

            }

        },

        /*
        |--------------------------------------------------------------------------
        | Reload Activity Logs
        |--------------------------------------------------------------------------
        */

        reloadActivityLogs: function () {

            if (

                employeeViewPage.tables.logs

            ) {

                employeeViewPage.tables.logs

                    .ajax

                    .reload(

                        null,

                        false

                    );

            }

        },

        /*
        |--------------------------------------------------------------------------
        | Document Actions
        |--------------------------------------------------------------------------
        */

        viewDocument: function (

            documentId

        ) {

            window.open(

                employeeDocumentViewApi +

                "?document_id=" +

                documentId,

                "_blank"

            );

        },

        downloadDocument: function (

            documentId

        ) {

            window.location =

                employeeDocumentDownloadApi +

                "?document_id=" +

                documentId;

        },
                /*
        |--------------------------------------------------------------------------
        | Button Events
        |--------------------------------------------------------------------------
        */

        initializeEvents: function () {

            /*
            |--------------------------------------------------------------
            | Edit Employee
            |--------------------------------------------------------------
            */

            $("#btnEditEmployee").on(

                "click",

                function () {

                    window.location =

                        employeePageUrl +

                        "?edit=" +

                        employeeId;

                }

            );

            /*
            |--------------------------------------------------------------
            | Change Salary
            |--------------------------------------------------------------
            */

            $("#btnChangeSalary,#btnUpdateSalary").on(

                "click",

                function () {

                    employeeViewPage.funx.changeSalary();

                }

            );

            /*
            |--------------------------------------------------------------
            | Generate Payroll
            |--------------------------------------------------------------
            */

            $("#btnGeneratePayroll,#btnGeneratePayrollHistory").on(

                "click",

                function () {

                    employeeViewPage.funx.generatePayroll();

                }

            );

            /*
            |--------------------------------------------------------------
            | Deactivate Employee
            |--------------------------------------------------------------
            */

            $("#btnDeactivateEmployee").on(

                "click",

                function () {

                    employeeViewPage.funx.deactivateEmployee();

                }

            );

            /*
            |--------------------------------------------------------------
            | Filters
            |--------------------------------------------------------------
            */

            $("#btnFilterTimelog").on(

                "click",

                function () {

                    employeeViewPage.funx.reloadTimelogs();

                }

            );

            $("#btnFilterPayroll").on(

                "click",

                function () {

                    employeeViewPage.funx.reloadPayroll();

                }

            );

            $("#btnSaveSchedule").click(function () {

                employeeViewPage.funx.saveSchedule();

            });

            $("#scheduleEffectiveDate").on("change", function () {

                employeeViewPage.funx.loadSchedule();

            });

            $(document).on("click", "#btnAddSalaryHistory", function () {

                employeeViewPage.funx.openSalaryModal();

            });

            $(document).on(

                "click",

                "#btnAddGovernment",

                function () {

                    employeeViewPage.funx.openGovernmentModal();

                }

            );

            $(document).on(

                "click",

                ".btn-edit-government",

                function () {

                    let id = $(this).data("id");

                    let government = employeeViewPage.governmentHistory.find(function (x) {

                        return x.employee_government_id == id;

                    });

                    employeeViewPage.funx.openGovernmentModal(

                        government

                    );

                }

            );

            $(document).on(

                "click",

                ".btn-edit-government",

                function () {

                    let id = $(this).data("id");

                    let government = employeeViewPage.governmentHistory.find(function (x) {

                        return x.employee_government_id == id;

                    });

                    employeeViewPage.funx.openGovernmentModal(

                        government

                    );

                }

            );

        },

        /*
        |--------------------------------------------------------------------------
        | Change Salary
        |--------------------------------------------------------------------------
        */

        changeSalary: function () {

            Swal.fire({

                icon: "info",

                title: "Coming Soon",

                text: "Salary Management module will be available here."

            });

        },

        /*
        |--------------------------------------------------------------------------
        | Generate Payroll
        |--------------------------------------------------------------------------
        */

        generatePayroll: function () {

            Swal.fire({

                icon: "info",

                title: "Coming Soon",

                text: "Payroll generation will be available here."

            });

        },

        /*
        |--------------------------------------------------------------------------
        | Deactivate Employee
        |--------------------------------------------------------------------------
        */

        deactivateEmployee: function () {

            Swal.fire({

                icon: "warning",

                title: "Deactivate Employee?",

                text: "This employee will no longer be active.",

                showCancelButton: true,

                confirmButtonText: "Deactivate",

                confirmButtonColor: "#dc3545"

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: employeeDeactivateApi,

                    type: "PUT",

                    payload: {

                        employee_id: employeeId

                    },

                    dataType: "json"

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

                        icon: "success",

                        title: "Success",

                        text: response.message,

                        timer: 1500,

                        showConfirmButton: false

                    }).then(function(){

                        window.location =

                            employeePageUrl;

                    });

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | Payslip
        |--------------------------------------------------------------------------
        */

        viewPayslip: function (

            payrollId

        ) {

            window.open(

                payrollViewApi +

                "?payroll_id=" +

                payrollId,

                "_blank"

            );

        },

        printPayslip: function (

            payrollId

        ) {

            window.open(

                payrollPrintApi +

                "?payroll_id=" +

                payrollId,

                "_blank"

            );

        },
                /*
        |--------------------------------------------------------------------------
        | Format Currency
        |--------------------------------------------------------------------------
        */

        money: function (amount) {

            return "₱ " +

                jsAddon.display.money(

                    amount ?? 0

                );

        },

        /*
        |--------------------------------------------------------------------------
        | Format Date
        |--------------------------------------------------------------------------
        */

        formatDate: function (date) {

            if (

                !date ||

                date == "0000-00-00"

            ) {

                return "-";

            }

            return moment(date)

                .format(

                    "MMM DD, YYYY"

                );

        },

        /*
        |--------------------------------------------------------------------------
        | Format Date Time
        |--------------------------------------------------------------------------
        */

        formatDateTime: function (datetime) {

            if (

                !datetime

            ) {

                return "-";

            }

            return moment(datetime)

                .format(

                    "MMM DD, YYYY hh:mm A"

                );

        },

        /*
        |--------------------------------------------------------------------------
        | Employment Status Badge
        |--------------------------------------------------------------------------
        */

        employmentBadge: function (status) {

            switch (status) {

                case "REGULAR":

                    return `

                        <span class="badge bg-success">

                            Regular

                        </span>

                    `;

                case "PROBATIONARY":

                    return `

                        <span class="badge bg-warning">

                            Probationary

                        </span>

                    `;

                case "CONTRACTUAL":

                    return `

                        <span class="badge bg-info">

                            Contractual

                        </span>

                    `;

                case "PART-TIME":

                    return `

                        <span class="badge bg-primary">

                            Part-Time

                        </span>

                    `;

                default:

                    return `

                        <span class="badge bg-secondary">

                            ${status ?? "-"}

                        </span>

                    `;

            }

        },

        /*
        |--------------------------------------------------------------------------
        | Active Badge
        |--------------------------------------------------------------------------
        */

        activeBadge: function (status) {

            return status == 1

                ? `

                    <span class="badge bg-success">

                        Active

                    </span>

                `

                : `

                    <span class="badge bg-danger">

                        Inactive

                    </span>

                `;

        },

        /*
        |--------------------------------------------------------------------------
        | Reload All Tables
        |--------------------------------------------------------------------------
        */

        reloadAll: function () {

            employeeViewPage.funx.reloadSalaryHistory();

            employeeViewPage.funx.reloadTimelogs();

            employeeViewPage.funx.reloadPayroll();

            employeeViewPage.funx.reloadDocuments();

            employeeViewPage.funx.reloadActivityLogs();

        },

        /*
        |--------------------------------------------------------------------------
        | Refresh Employee
        |--------------------------------------------------------------------------
        */

        refresh: function () {

            employeeViewPage.funx.loadEmployee();

            employeeViewPage.funx.reloadAll();

        },

        saveSchedule: function () {

            let days = [];

            $("#scheduleDaysBody tr").each(function () {

                let day = $(this)
                    .find(".schedule-working")
                    .data("day");

                days.push({

                    day_of_week: day,

                    is_working_day:
                        $(this)
                        .find(".schedule-working")
                        .is(":checked") ? 1 : 0,

                    time_in:
                        $(this)
                        .find(".schedule-timein")
                        .val(),

                    time_out:
                        $(this)
                        .find(".schedule-timeout")
                        .val()

                });

            });

            Swal.fire({

                icon: "question",

                title: "Save Schedule",

                html: `

                    <div class="text-start">
                        <small class="text-muted">

                            If the employee already has a schedule,
                            a new schedule version will be created.

                        </small>

                    </div>

                `,

                showCancelButton: true,

                confirmButtonText: "Save Schedule",

            }).then(function (result) {

                if (!result.isConfirmed) {

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: employeeScheduleSaveApi,

                    type: "POST",

                    payload: {

                        employee_id: employeeId,

                        effective_date: $("#scheduleEffectiveDate").val(),

                        grace_period:
                            $("#scheduleGracePeriod").val(),

                        break_start:
                            $("#scheduleBreakStart").val(),

                        break_end:
                            $("#scheduleBreakEnd").val(),

                        remarks: "",

                        days:
                            JSON.stringify(days)

                    },

                    dataType: "json"

                }).then(function (response) {

                    Swal.fire({

                    icon: response.isError
                        ? "error"
                        : "success",

                    title: response.isError
                        ? "Error"
                        : "Schedule Update",

                    html: response.html
                        ? response.html
                        : `<div>${response.message}</div>`,

                    width: 800,

                    confirmButtonText: "OK"

                }).then(() => {

                    if (!response.isError) {

                        employeeViewPage.funx.loadSchedule();

                    }

                });

                });

            });

        },
        scheduleForm: function () {

            const days = [

                "MONDAY",

                "TUESDAY",

                "WEDNESDAY",

                "THURSDAY",

                "FRIDAY",

                "SATURDAY",

                "SUNDAY"

            ];

            let rows = "";

            $.each(days, function (_, day) {

                rows += `

                    <tr>

                        <td>

                            <strong>${day}</strong>

                        </td>

                        <td class="text-center">

                            <input
                                type="checkbox"
                                class="form-check-input schedule-working"
                                data-day="${day}"
                                ${day == "SATURDAY" || day == "SUNDAY" ? "" : "checked"}>

                        </td>

                        <td>

                            <input
                                type="time"
                                class="form-control schedule-timein"
                                data-day="${day}"
                                value="08:00">

                        </td>

                        <td>

                            <input
                                type="time"
                                class="form-control schedule-timeout"
                                data-day="${day}"
                                value="17:00">

                        </td>

                    </tr>

                `;

            });

            Swal.fire({

                title: "Employee Work Schedule",

                width: "950px",

                showCancelButton: true,

                confirmButtonText: "Save Schedule",

                html: `

                    <div class="container-fluid">

                        <div class="row mb-3 text-start">

                            <div class="col-md-3">

                                <label>

                                    Effective Date

                                </label>

                                <input
                                    id="swal_effective_date"
                                    type="date"
                                    class="form-control"
                                    value="${moment().format("YYYY-MM-DD")}">

                            </div>

                            <div class="col-md-3">

                                <label>

                                    Grace Period (Minutes)

                                </label>

                                <input
                                    id="swal_grace_period"
                                    type="number"
                                    class="form-control"
                                    value="15">

                            </div>

                            <div class="col-md-3">

                                <label>

                                    Break Start

                                </label>

                                <input
                                    id="swal_break_start"
                                    type="time"
                                    class="form-control"
                                    value="12:00">

                            </div>

                            <div class="col-md-3">

                                <label>

                                    Break End

                                </label>

                                <input
                                    id="swal_break_end"
                                    type="time"
                                    class="form-control"
                                    value="13:00">

                            </div>

                        </div>

                        <div class="table-responsive">

                            <table class="table table-bordered">

                                <thead class="table-dark">

                                    <tr>

                                        <th width="180">

                                            Day

                                        </th>

                                        <th width="100">

                                            Work

                                        </th>

                                        <th>

                                            Time In

                                        </th>

                                        <th>

                                            Time Out

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    ${rows}

                                </tbody>

                            </table>

                        </div>

                    </div>

                `,

                preConfirm: function () {

                    let schedule = [];

                    $(".schedule-working").each(function () {

                        let day = $(this).data("day");

                        schedule.push({

                            day_of_week: day,

                            is_working_day: $(this).is(":checked") ? 1 : 0,

                            time_in: $(`.schedule-timein[data-day="${day}"]`).val(),

                            time_out: $(`.schedule-timeout[data-day="${day}"]`).val()

                        });

                    });

                    return {

                        employee_id: employeeId,

                        effective_date: $("#swal_effective_date").val(),

                        grace_period: $("#swal_grace_period").val(),

                        break_start: $("#swal_break_start").val(),

                        break_end: $("#swal_break_end").val(),

                        remarks: "",

                        days: JSON.stringify(schedule)

                    };

                }

            }).then(function (result) {

                if (!result.isConfirmed) {

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: employeeScheduleAddApi,

                    type: "POST",

                    payload: result.value,

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

                    });

                });

            });

        },
        
        renderEmptySchedule: function () {

            const days = [

                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY"

            ];

            let html = "";

            $.each(days, function (_, day) {

                html += `

                <tr>

                    <td>

                        <strong>${day}</strong>

                    </td>

                    <td class="text-center">

                        <input

                            type="checkbox"

                            class="form-check-input schedule-working"

                            data-day="${day}"

                            ${day == "SATURDAY" || day == "SUNDAY"
                                ? ""
                                : "checked"}

                        >

                    </td>

                    <td>

                        <input

                            type="time"

                            class="form-control schedule-timein"

                            data-day="${day}"

                        >

                    </td>

                    <td>

                        <input

                            type="time"

                            class="form-control schedule-timeout"

                            data-day="${day}"

                        >

                    </td>

                </tr>

                `;

            });

            $("#scheduleDaysBody").html(html);

        },

        loadSchedule: function () {
            let effectiveDate = $("#scheduleEffectiveDate").val();
            let payload = {
                employee_id: employeeId
            }
            if(effectiveDate != "" && effectiveDate != null){
                payload.effective_date = effectiveDate
            }
            jsAddon.display.ajaxRequest({

                url: employeeCurrentScheduleApi,

                type: "GET",

                payload: payload,

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

                // No schedule yet
                if (!response.schedule) {

                     $("#scheduleInfo").addClass("d-none");

                    employeeViewPage.funx.renderEmptySchedule();

                    return;

                }

                /*
                |--------------------------------------------------------------------------
                | Schedule Information
                |--------------------------------------------------------------------------
                */

                $("#scheduleInfo")
                    .removeClass("d-none");

                let effectiveDate = moment(response.schedule.effective_date);

                let startDate = effectiveDate.format("MMMM DD, YYYY");

                let endDate = effectiveDate.clone().add(6, "days").format("MMMM DD, YYYY");

                let status = "";

                const today = moment().startOf("day");

                if (
                    today.isBetween(
                        effectiveDate.clone().startOf("day"),
                        effectiveDate.clone().add(6, "days").endOf("day"),
                        null,
                        "[]"
                    )
                ) {

                    status = `<span class="badge bg-success ms-2">Current Schedule</span>`;

                }
                else if (
                    today.isBefore(
                        effectiveDate,
                        "day"
                    )
                ) {

                    status = `<span class="badge bg-primary ms-2">Future Schedule</span>`;

                }
                else {

                    status = `<span class="badge bg-secondary ms-2">Previous Schedule</span>`;

                }

                $("#scheduleInfoDate").html(

                    `${startDate} <small class="text-muted">(Until ${endDate})</small> ${status}`

                );


                // Populate schedule information
                $("#scheduleEffectiveDate").val(
                    response.schedule.effective_date
                );

                $("#scheduleGracePeriod").val(
                    response.schedule.grace_period
                );

                $("#scheduleBreakStart").val(
                    response.schedule.break_start
                );

                $("#scheduleBreakEnd").val(
                    response.schedule.break_end
                );

                let html = "";

                $.each(response.days, function (_, row) {

                    html += `

                        <tr>

                            <td>

                                <strong>${row.day_of_week}</strong>

                            </td>

                            <td class="text-center">

                                <input
                                    type="checkbox"
                                    class="form-check-input schedule-working"
                                    data-day="${row.day_of_week}"
                                    ${row.is_working_day == 1 ? "checked" : ""}>

                            </td>

                            <td>

                                <input
                                    type="time"
                                    class="form-control schedule-timein"
                                    data-day="${row.day_of_week}"
                                    value="${row.time_in ?? ""}">

                            </td>

                            <td>

                                <input
                                    type="time"
                                    class="form-control schedule-timeout"
                                    data-day="${row.day_of_week}"
                                    value="${row.time_out ?? ""}">

                            </td>

                        </tr>

                    `;

                });

                $("#scheduleDaysBody").html(html);

            });

        },

        loadScheduleDates: function () {

            jsAddon.display.ajaxRequest({

                url: employeeScheduleDatesApi,

                type: "GET",

                payload: {

                    employee_id: employeeId

                },

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    return;

                }

                let html = "";

                $.each(response.data, function (_, row) {

                    
                    html += `

                        <option
                            value="${row.effective_date}">

                            ${moment(row.effective_date)
                                .format("MMM DD, YYYY")}

                            ${row.status == "Current"
                            ? "(Current)"
                            : row.status == "Future"
                                ? "(Future)"
                                : "(Previous)"}

                        </option>

                    `;

                });

                $("#scheduleEffectiveDate")
                    .html(html);

            });

        },

        loadSalary: function () {

            let effectiveDate = $("#salaryEffectiveDate").val();

            let payload = {

                employee_id: employeeId

            };

            if (effectiveDate != "" && effectiveDate != null) {

                payload.effective_date = effectiveDate;

            }

            jsAddon.display.ajaxRequest({

                url: employeeSalaryApi,

                type: "GET",

                payload: payload,

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

                if (!response.salary) {

                    employeeViewPage.funx.renderEmptySalary();

                    return;

                }

                $("#salaryNotice").html("");

                /*
                |--------------------------------------------------------------------------
                | Populate Edit Form (Selected Salary)
                |--------------------------------------------------------------------------
                */

                $("#salaryEffectiveDate").val(
                    response.salary.effective_date
                );

                $("#salaryType").val(
                    response.salary.salary_type
                );

                $("#salaryBasic").val(
                    response.salary.basic_salary
                );

                $("#salaryAllowance").val(
                    response.salary.allowance
                );

                $("#salaryTransportation").val(
                    response.salary.transportation_allowance
                );

                $("#salaryMeal").val(
                    response.salary.meal_allowance
                );

                $("#salaryCommunication").val(
                    response.salary.communication_allowance
                );

                $("#salaryOther").val(
                    response.salary.other_allowance
                );

                $("#salaryRemarks").val(
                    response.salary.remarks
                );

                /*
                |--------------------------------------------------------------------------
                | Current Salary Cards
                |--------------------------------------------------------------------------
                */

                let current = response.current_salary
                    ? response.current_salary
                    : response.salary;

                let basic = parseFloat(
                    current.basic_salary || 0
                );

                let daily = 0;

                let hourly = 0;

                switch (current.salary_type) {

                    case "MONTHLY":

                        daily = basic / 22;

                        hourly = daily / 8;

                    break;

                    case "DAILY":

                        daily = basic;

                        hourly = daily / 8;

                    break;

                    case "HOURLY":

                        hourly = basic;

                        daily = hourly * 8;

                    break;

                }

                $("#currentSalaryType").text(
                    current.salary_type
                );

                $("#currentBasicSalary").text(

                    "₱" +

                    basic.toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentDailyRate").text(

                    "₱" +

                    daily.toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );
                
                $("#summarySalary").text(

                    "₱" +

                    basic.toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentHourlyRate").text(

                    "₱" +

                    hourly.toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#salaryEffectiveDateDisplay").text(

                    moment(current.effective_date)

                    .format("MMMM DD, YYYY")

                );

                $("#currentAllowance").text(

                    "₱" +

                    parseFloat(current.allowance || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentTransportationAllowance").text(

                    "₱" +

                    parseFloat(current.transportation_allowance || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentMealAllowance").text(

                    "₱" +

                    parseFloat(current.meal_allowance || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentCommunicationAllowance").text(

                    "₱" +

                    parseFloat(current.communication_allowance || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentOtherAllowance").text(

                    "₱" +

                    parseFloat(current.other_allowance || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#currentSalaryRemarks").text(

                    current.remarks || "-"

                );

                /*
                |--------------------------------------------------------------------------
                | Salary History
                |--------------------------------------------------------------------------
                */

                /*
                |--------------------------------------------------------------------------
                | Salary History DataTable
                |--------------------------------------------------------------------------
                */

                if ($.fn.DataTable.isDataTable("#tblSalaryHistory")) {

                    $("#tblSalaryHistory")
                        .DataTable()
                        .clear()
                        .destroy();

                }

                $("#tblSalaryHistory").DataTable({

                    destroy: true,

                    responsive: true,

                    searching: true,

                    paging: true,

                    pageLength: 10,

                    ordering: true,

                    info: true,

                    autoWidth: false,

                    order: [[1, "desc"]],

                    data: response.history,

                    columns: [

                        {
                            data: null,
                            render: function (data, type, row, meta) {

                                return meta.row + 1;

                            }
                        },

                        {
                            data: "effective_date",
                            render: function (data) {

                                return moment(data).format("MMM DD, YYYY");

                            }
                        },

                        {
                            data: "basic_salary",
                            className: "text-end",
                            render: function (data) {

                                return "₱" + parseFloat(data).toLocaleString(undefined, {

                                    minimumFractionDigits: 2,

                                    maximumFractionDigits: 2

                                });

                            }
                        },

                        {
                            data: null,
                            className: "text-end",
                            render: function (row) {

                                let basic = parseFloat(row.basic_salary || 0);

                                let daily = 0;

                                switch (row.salary_type) {

                                    case "MONTHLY":

                                        daily = basic / 22;

                                    break;

                                    case "DAILY":

                                        daily = basic;

                                    break;

                                    case "HOURLY":

                                        daily = basic * 8;

                                    break;

                                }

                                return "₱" + daily.toLocaleString(undefined, {

                                    minimumFractionDigits: 2,

                                    maximumFractionDigits: 2

                                });

                            }
                        },

                        {
                            data: null,
                            className: "text-end",
                            render: function (row) {

                                let basic = parseFloat(row.basic_salary || 0);

                                let daily = 0;

                                let hourly = 0;

                                switch (row.salary_type) {

                                    case "MONTHLY":

                                        daily = basic / 22;

                                        hourly = daily / 8;

                                    break;

                                    case "DAILY":

                                        daily = basic;

                                        hourly = daily / 8;

                                    break;

                                    case "HOURLY":

                                        hourly = basic;

                                    break;

                                }

                                return "₱" + hourly.toLocaleString(undefined, {

                                    minimumFractionDigits: 2,

                                    maximumFractionDigits: 2

                                });

                            }
                        },

                        {
                            data: "remarks",
                            defaultContent: "-"
                        },

                        {
                            data: "created_by_name",
                            defaultContent: "-"
                        },

                        {
                            data: null,
                            className: "text-center",
                            orderable: false,
                            searchable: false,
                            render: function (row) {

                                return `

                                    -

                                `;

                            }
                        }

                    ]

                });

            });

        },

        renderEmptySalary: function () {

            $("#salaryType").val("MONTHLY");

            $("#salaryBasic").val("");

            $("#salaryAllowance").val("0.00");

            $("#salaryTransportation").val("0.00");

            $("#salaryMeal").val("0.00");

            $("#salaryCommunication").val("0.00");

            $("#salaryOther").val("0.00");

            $("#salaryRemarks").val("");

            if ($("#salaryEffectiveDate").val() == "") {

                $("#salaryEffectiveDate").val(

                    moment().format("YYYY-MM-DD")

                );

            }

            /*
            |--------------------------------------------------------------------------
            | Clear Summary
            |--------------------------------------------------------------------------
            */

            $("#currentSalaryType").text("-");

            $("#currentBasicSalary").text("₱0.00");

            $("#currentDailyRate").text("₱0.00");

            $("#currentHourlyRate").text("₱0.00");

            $("#salaryEffectiveDateDisplay").text("-");

            $("#currentAllowance").text("₱0.00");

            $("#currentTransportationAllowance").text("₱0.00");

            $("#currentMealAllowance").text("₱0.00");

            $("#currentCommunicationAllowance").text("₱0.00");

            $("#currentOtherAllowance").text("₱0.00");

            $("#currentSalaryRemarks").text("-");

            /*
            |--------------------------------------------------------------------------
            | Notice
            |--------------------------------------------------------------------------
            */

            $("#salaryNotice").html(`

                <div class="alert alert-info mb-0">

                    <i class="bi bi-info-circle-fill me-2"></i>

                    <strong>No salary has been configured for this employee.</strong>

                    <br>

                    Click <strong>Update Salary</strong> or <strong>Add Salary</strong>
                    to create the employee's salary information.

                </div>

            `);

        },
        openSalaryModal: function () {

            Swal.fire({

                title: "Employee Salary",

                width: 700,

                html: `

                    <div class="row g-3 text-start">

                        <div class="col-md-6">

                            <label class="form-label">

                                Effective Date

                            </label>

                            <input
                                id="swalSalaryEffectiveDate"
                                type="date"
                                class="form-control"
                                value="${moment().format("YYYY-MM-DD")}">

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Salary Type

                            </label>

                            <select
                                id="swalSalaryType"
                                class="form-select">

                                <option value="MONTHLY">

                                    Monthly

                                </option>

                                <option value="DAILY">

                                    Daily

                                </option>

                                <option value="HOURLY">

                                    Hourly

                                </option>

                            </select>

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Basic Salary

                            </label>

                            <input
                                id="swalBasicSalary"
                                type="number"
                                class="form-control">

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Allowance

                            </label>

                            <input
                                id="swalAllowance"
                                type="number"
                                class="form-control"
                                value="0">

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Transportation

                            </label>

                            <input
                                id="swalTransportation"
                                type="number"
                                class="form-control"
                                value="0">

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Meal

                            </label>

                            <input
                                id="swalMeal"
                                type="number"
                                class="form-control"
                                value="0">

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Communication

                            </label>

                            <input
                                id="swalCommunication"
                                type="number"
                                class="form-control"
                                value="0">

                        </div>

                        <div class="col-md-6">

                            <label class="form-label">

                                Other Allowance

                            </label>

                            <input
                                id="swalOther"
                                type="number"
                                class="form-control"
                                value="0">

                        </div>

                        <div class="col-12">

                            <label class="form-label">

                                Remarks

                            </label>

                            <textarea
                                id="swalSalaryRemarks"
                                class="form-control"
                                rows="2"></textarea>

                        </div>

                    </div>

                `,

                showCancelButton: true,

                confirmButtonText: "Save Salary",

                preConfirm: () => {

                    return {

                        employee_id: employeeId,

                        effective_date: $("#swalSalaryEffectiveDate").val(),

                        salary_type: $("#swalSalaryType").val(),

                        basic_salary: $("#swalBasicSalary").val(),

                        allowance: $("#swalAllowance").val(),

                        transportation_allowance: $("#swalTransportation").val(),

                        meal_allowance: $("#swalMeal").val(),

                        communication_allowance: $("#swalCommunication").val(),

                        other_allowance: $("#swalOther").val(),

                        remarks: $("#swalSalaryRemarks").val()

                    };

                }

            }).then(function(result){

                if(!result.isConfirmed){

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: employeeSalarySaveApi,

                    type: "POST",

                    payload: result.value,

                    dataType: "json"

                }).then(function(response){

                    Swal.fire({

                        icon: response.isError
                            ? "error"
                            : "success",

                        title: response.isError
                            ? "Error"
                            : "Success",

                        text: response.message

                    });

                    if(!response.isError){

                        employeeViewPage.funx.loadCurrentSalary();

                        employeeViewPage.funx.loadSalary();

                        employeeViewPage.funx.loadSalaryDates();

                        employeeViewPage.funx.loadSalaryHistory();

                    }

                });

            });

        },

        initializeGovernmentTable: function () {

            employeeViewPage.governmentTable = $("#tblGovernmentHistory").DataTable({

                destroy: true,

                responsive: true,

                processing: false,

                serverSide: false,

                searching: true,

                paging: true,

                ordering: true,

                pageLength: 10,

                order: [[1, "desc"]],

                columns: [

                    {
                        data: null,
                        render: function (data, type, row, meta) {

                            return meta.row + 1;

                        }
                    },

                    {
                        data: "effective_date",
                        render: function (data) {

                            return moment(data).format("MMM DD, YYYY");

                        }
                    },

                    {
                        data: "sss_number"
                    },

                    {
                        data: "sss_employee",
                        className: "text-end",
                        render: $.fn.dataTable.render.number(",", ".", 2, "₱")
                    },

                    {
                        data: "sss_employer",
                        className: "text-end",
                        render: $.fn.dataTable.render.number(",", ".", 2, "₱")
                    },

                    {
                        data: "philhealth_number"
                    },

                    {
                        data: "philhealth_employee",
                        className: "text-end",
                        render: $.fn.dataTable.render.number(",", ".", 2, "₱")
                    },

                    {
                        data: "philhealth_employer",
                        className: "text-end",
                        render: $.fn.dataTable.render.number(",", ".", 2, "₱")
                    },

                    {
                        data: "pagibig_number"
                    },

                    {
                        data: "pagibig_employee",
                        className: "text-end",
                        render: $.fn.dataTable.render.number(",", ".", 2, "₱")
                    },

                    {
                        data: "pagibig_employer",
                        className: "text-end",
                        render: $.fn.dataTable.render.number(",", ".", 2, "₱")
                    },

                    {
                        data: null,

                        orderable: false,

                        searchable: false,

                        className: "text-center",

                        render: function (row) {

                            return `

                                <div class="btn-group btn-group-sm">

                                    <button
                                        class="btn btn-primary btn-edit-government"
                                        data-id="${row.employee_government_id}"
                                        data-effective-date="${row.effective_date}">

                                        <i class="bi bi-pencil"></i>

                                    </button>

                                    <button
                                        class="btn btn-danger btn-delete-government"
                                        data-id="${row.employee_government_id}">

                                        <i class="bi bi-trash"></i>

                                    </button>

                                </div>

                            `;

                        }

                    }

                ]

            });

        },

        loadGovernment: function () {

            let effectiveDate = $("#governmentEffectiveDate").val();

            let payload = {

                employee_id: employeeId

            };

            if (effectiveDate != "") {

                payload.effective_date = effectiveDate;

            }

            jsAddon.display.ajaxRequest({

                url: employeeGovernmentApi,

                type: "GET",

                payload: payload,

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

                if (!response.government) {

                    employeeViewPage.funx.renderEmptyGovernment();

                    return;

                }

                /*
                |--------------------------------------------------------------------------
                | Current Government
                |--------------------------------------------------------------------------
                */

                let current = response.current_government
                    ? response.current_government
                    : response.government;

                $("#summarySSSNumber").text(current.sss_number || "-");

                $("#summarySSSEmployee").text(

                    "₱" + Number(current.sss_employee || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#summarySSSEmployer").text(

                    "₱" + Number(current.sss_employer || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#summaryPhilhealthNumber").text(

                    current.philhealth_number || "-"

                );

                $("#summaryPhilhealthEmployee").text(

                    "₱" + Number(current.philhealth_employee || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#summaryPhilhealthEmployer").text(

                    "₱" + Number(current.philhealth_employer || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#summaryPagibigNumber").text(

                    current.pagibig_number || "-"

                );

                $("#summaryPagibigEmployee").text(

                    "₱" + Number(current.pagibig_employee || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#summaryPagibigEmployer").text(

                    "₱" + Number(current.pagibig_employer || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                $("#summaryWithholdingTax").text(

                    "₱" + Number(current.withholding_tax || 0)

                    .toLocaleString(undefined, {

                        minimumFractionDigits: 2,

                        maximumFractionDigits: 2

                    })

                );

                /*
                |--------------------------------------------------------------------------
                | History
                |--------------------------------------------------------------------------
                */

                employeeViewPage.governmentHistory = response.history;

                employeeViewPage.governmentTable.clear();

                employeeViewPage.governmentTable.rows.add(

                    response.history

                );

                employeeViewPage.governmentTable.draw(false);

            });

        },

        renderEmptyGovernment: function () {

            $("#summarySSSNumber").text("-");

            $("#summarySSSEmployee").text("₱0.00");

            $("#summarySSSEmployer").text("₱0.00");

            $("#summaryPhilhealthNumber").text("-");

            $("#summaryPhilhealthEmployee").text("₱0.00");

            $("#summaryPhilhealthEmployer").text("₱0.00");

            $("#summaryPagibigNumber").text("-");

            $("#summaryPagibigEmployee").text("₱0.00");

            $("#summaryPagibigEmployer").text("₱0.00");

            $("#summaryWithholdingTax").text("₱0.00");

            employeeViewPage.governmentTable.clear().draw();

        },

        openGovernmentModal: function (government = null) {

            government = government || {

                effective_date: moment().format("YYYY-MM-DD"),

                sss_number: "",

                sss_employee: 0,

                sss_employer: 0,

                philhealth_number: "",

                philhealth_employee: 0,

                philhealth_employer: 0,

                pagibig_number: "",

                pagibig_employee: 0,

                pagibig_employer: 0,

                withholding_tax: 0

            };

            Swal.fire({

                title: government.employee_government_id
                    ? "Edit Government Contribution"
                    : "Add Government Contribution",

                width: 900,

                showCancelButton: true,

                confirmButtonText: "Save",

                html: `

                <div class="container-fluid">

                    <div class="row">

                        <div class="col-md-4 mb-3">

                            <label class="form-label">

                                Effective Date

                            </label>

                            <input
                                id="govEffectiveDate"
                                type="date"
                                class="form-control"
                                value="${government.effective_date}">

                        </div>

                    </div>

                    <hr>

                    <div class="row">

                        <div class="col-md-4">

                            <label>SSS Number</label>

                            <input
                                id="govSSSNumber"
                                class="form-control"
                                value="${government.sss_number}">

                        </div>

                        <div class="col-md-4">

                            <label>Employee Share</label>

                            <input
                                id="govSSSEmployee"
                                type="number"
                                class="form-control"
                                value="${government.sss_employee}">

                        </div>

                        <div class="col-md-4">

                            <label>Employer Share</label>

                            <input
                                id="govSSSEmployer"
                                type="number"
                                class="form-control"
                                value="${government.sss_employer}">

                        </div>

                    </div>

                    <br>

                    <div class="row">

                        <div class="col-md-4">

                            <label>PhilHealth Number</label>

                            <input
                                id="govPhilhealthNumber"
                                class="form-control"
                                value="${government.philhealth_number}">

                        </div>

                        <div class="col-md-4">

                            <label>Employee Share</label>

                            <input
                                id="govPhilhealthEmployee"
                                type="number"
                                class="form-control"
                                value="${government.philhealth_employee}">

                        </div>

                        <div class="col-md-4">

                            <label>Employer Share</label>

                            <input
                                id="govPhilhealthEmployer"
                                type="number"
                                class="form-control"
                                value="${government.philhealth_employer}">

                        </div>

                    </div>

                    <br>

                    <div class="row">

                        <div class="col-md-4">

                            <label>Pag-IBIG Number</label>

                            <input
                                id="govPagibigNumber"
                                class="form-control"
                                value="${government.pagibig_number}">

                        </div>

                        <div class="col-md-4">

                            <label>Employee Share</label>

                            <input
                                id="govPagibigEmployee"
                                type="number"
                                class="form-control"
                                value="${government.pagibig_employee}">

                        </div>

                        <div class="col-md-4">

                            <label>Employer Share</label>

                            <input
                                id="govPagibigEmployer"
                                type="number"
                                class="form-control"
                                value="${government.pagibig_employer}">

                        </div>

                    </div>

                    <br>

                    <div class="row">

                        <div class="col-md-4">

                            <label>

                                Withholding Tax

                            </label>

                            <input
                                id="govWithholdingTax"
                                type="number"
                                class="form-control"
                                value="${government.withholding_tax}">

                        </div>

                    </div>

                </div>

                `,

                preConfirm: function () {

                    return {

                        employee_id: employeeId,

                        effective_date: $("#govEffectiveDate").val(),

                        sss_number: $("#govSSSNumber").val(),

                        sss_employee: $("#govSSSEmployee").val(),

                        sss_employer: $("#govSSSEmployer").val(),

                        philhealth_number: $("#govPhilhealthNumber").val(),

                        philhealth_employee: $("#govPhilhealthEmployee").val(),

                        philhealth_employer: $("#govPhilhealthEmployer").val(),

                        pagibig_number: $("#govPagibigNumber").val(),

                        pagibig_employee: $("#govPagibigEmployee").val(),

                        pagibig_employer: $("#govPagibigEmployer").val(),

                        withholding_tax: $("#govWithholdingTax").val()

                    };

                }

            }).then(function (result) {

                if (!result.isConfirmed) {

                    return;

                }

                jsAddon.display.ajaxRequest({

                    url: employeeGovernmentSaveApi,

                    type: "POST",

                    payload: result.value,

                    dataType: "json"

                }).then(function (response) {

                    Swal.fire({

                        icon: response.isError
                            ? "error"
                            : "success",

                        title: response.isError
                            ? "Error"
                            : "Success",

                        text: response.message

                    });

                    if (!response.isError) {

                        employeeViewPage.funx.loadGovernment();

                    }

                });

            });

        },
    }

};

/*
|--------------------------------------------------------------------------
| Document Ready
|--------------------------------------------------------------------------
*/

$(function(){

    employeeViewPage.funx.initialize();


});