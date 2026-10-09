let borrowerIncentivePage = {

    table: null,

    incentives: {},

    editedIncentives: {},
    
    borrowers: [],

    incentiveTypes: [],

    summary: {

        totalBorrowers: 0,

        withIncentive: 0,

        withoutIncentive: 0,

        totalAmount: 0,

        totalPaid: 0,

        totalPending: 0

    },

    init: function () {

        let today = new Date();

        let month = today.getMonth() + 1;

        let year = today.getFullYear();

        if (month < 10) {

            month = "0" + month;

        }

        $("#incentiveMonth").val(`${year}-${month}`);
            
        borrowerIncentivePage.funx.loadBorrowers();
        borrowerIncentivePage.funx.loadIncentiveTypes();
        borrowerIncentivePage.funx.loadIncentives();
        
        borrowerIncentivePage.funx.loadSummary();

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

                borrowerIncentivePage.borrowers = response.data;

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

                $("#incentiveBorrower").html(html);

            });

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD INCENTIVE TYPES (FOR DROPDOWN - Modal & Filter only)
        |--------------------------------------------------------------------------
        */
        loadIncentiveTypes: function () {

            jsAddon.display.ajaxRequest({
                url: incentiveTypeDropdownApi,
                type: "GET",
                dataType: "json"
            }).then(function (response) {

                if (response.isError) {
                    console.error("Failed to load incentive types:", response.message);
                    return;
                }

                // Store incentive types for later use
                borrowerIncentivePage.incentiveTypes = response.data || [];

                // ✅ Populate modal dropdown
                let html = `
                    <option value="">
                        Select Incentive Type
                    </option>
                `;

                $.each(response.data || [], function (_, row) {
                    html += `
                        <option value="${row.id}">
                            ${row.name}
                        </option>
                    `;
                });

                $("#incentiveType").html(html);
                
                // ✅ Populate filter dropdown if exists
                if ($("#filterIncentiveType").length) {
                    let filterHtml = `
                        <option value="">
                            All Types
                        </option>
                    `;
                    $.each(response.data || [], function (_, row) {
                        filterHtml += `
                            <option value="${row.id}">
                                ${row.name}
                            </option>
                        `;
                    });
                    $("#filterIncentiveType").html(filterHtml);
                }

            }).catch(function (error) {
                console.error("Error loading incentive types:", error);
            });

        },

        /*
        |--------------------------------------------------------------------------
        | LOAD INCENTIVES
        |--------------------------------------------------------------------------
        */
        loadSummary: function () {

            jsAddon.display.ajaxRequest({

                url: incentiveSummaryApi,

                type: "GET",

                payload: {

                    incentive_month: $("#incentiveMonth").val()

                },

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {
                    return;
                }
                borrowerIncentivePage.summary = response.data;

                borrowerIncentivePage.funx.renderSummary();

            });

        },

        loadIncentives: function () {

            if ($.fn.DataTable.isDataTable("#incentiveTable")) {
                $("#incentiveTable").DataTable().destroy();
            }

            $("#incentiveTable tbody").empty();

            borrowerIncentivePage.table = $("#incentiveTable").DataTable({

                processing: true,
                serverSide: true,
                destroy: true,

                responsive: false,

                autoWidth: false,
                scrollX: true,
                searching: false,
                ordering: true,
                pageLength: 10,
                order: [[1, "asc"]],

                ajax: function (data, callback) {

                    // ✅ Add incentive_type_id filter to payload
                    const filterIncentiveTypeId = $("#filterIncentiveType").val();

                    jsAddon.display.ajaxRequest({

                        url: incentiveApi,

                        type: "GET",

                        payload: {

                            draw: data.draw,

                            start: data.start,

                            length: data.length,

                            orderColumn: data.columns[data.order[0].column].data,

                            orderDir: data.order[0].dir,

                            incentive_month: $("#incentiveMonth").val(),

                            incentive_type_id: filterIncentiveTypeId,  // ✅ Filter by type

                            search: $("#txtSearch").val()

                        },

                        dataType: "json",

                        error: function (xhr, status, error) {
                            console.error("AJAX Error:", {
                                xhr: xhr,
                                status: status,
                                error: error
                            });

                            Swal.fire(
                                "Error",
                                "Unable to load incentives. " + (error || "Please check your connection."),
                                "error"
                            );

                            callback({
                                draw: data.draw,
                                recordsTotal: 0,
                                recordsFiltered: 0,
                                data: []
                            });
                        }

                    }).then(function (response) {

                        if (response.isError) {
                            console.error("API Error:", response.message);
                            Swal.fire("Error", response.message || "Failed to load incentives.", "error");
                            
                            callback({
                                draw: data.draw,
                                recordsTotal: 0,
                                recordsFiltered: 0,
                                data: []
                            });
                            return;
                        }

                        borrowerIncentivePage.incentives = {};

                        $.each(response.data || [], function (_, row) {
                            borrowerIncentivePage.incentives[row.incentive_id] = row;
                        });

                        callback({
                            draw: response.draw || data.draw,
                            recordsTotal: response.recordsTotal || 0,
                            recordsFiltered: response.recordsFiltered || 0,
                            data: response.data || []
                        });

                    }).catch(function (error) {
                        console.error("Promise Error:", error);
                        
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });
                    });

                },

                columns: [

                    {
                        data: "incentive_id",
                        defaultContent: ""
                    },

                    {
                        data: "borrower_name",
                        defaultContent: ""
                    },

                    // ✅ Incentive Type - READ ONLY (display name only, no dropdown)
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            const typeName = row.incentive_type_name || row.incentive_type || '-';

                            return `
                                <span class="text-muted">
                                    ${typeName}
                                </span>
                            `;
                        }
                    },

                    // Incentive Amount Column
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            // ✅ Make sure incentive_id is not undefined
                            const incentiveId = row.incentive_id !== undefined ? row.incentive_id : '';
                            const borrowerId = row.borrower_id !== undefined ? row.borrower_id : '';

                            console.log("Rendering row:", {
                                incentive_id: incentiveId,
                                borrower_id: borrowerId
                            });

                            return `
                                <input
                                    type="number"
                                    step="0.01"
                                    class="form-control form-control-sm txtIncentiveAmount"
                                    value="${row.incentive_amount || 0}"
                                    data-borrower="${borrowerId}"
                                    data-incentive="${incentiveId}"
                                    style="text-align:right; font-weight:600;">
                            `;
                        }
                    },

                    // Status
                    {
                        data: null,
                        orderable: false,
                        defaultContent: "",
                        render: function (data, type, row) {

                            return `
                                <select 
                                    data-borrower="${row.borrower_id}"
                                    data-incentive="${row.incentive_id ?? ''}"
                                    class="form-control form-control-sm txtIncentiveStatus">
                                    <option value="PENDING" ${row.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                                    <option value="PAID" ${row.status === 'PAID' ? 'selected' : ''}>Paid</option>
                                    <option value="CANCELLED" ${row.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
                                </select>
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
                                    data-incentive="${row.incentive_id ?? ''}"
                                    class="form-control form-control-sm txtRemarks"
                                    value="${row.remarks || ""}">
                            `;

                        }
                    },

                    // Action Buttons
                    {
                        data: null,
                        orderable: false,
                        searchable: false,
                        defaultContent: "",
                        render: function (data, type, row) {
                            return `
                                <div class="btn-group btn-group-sm" role="group">
                                    <button type="button" class="btn btn-outline-success btn-save-incentive" 
                                        data-borrower="${row.borrower_id}" 
                                        data-incentive="${row.incentive_id || ''}" 
                                        title="Save">
                                        <i class="bi bi-check-lg"></i>
                                    </button>
                                </div>
                            `;
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

            const s = borrowerIncentivePage.summary;

            $("#totalBorrowers").text(s.totalBorrowers || 0);

            $("#withIncentive").text(s.withIncentive || 0);

            $("#withoutIncentive").text(s.withoutIncentive || 0);

            $("#totalAmount").text(

                jsAddon.display.money(s.totalAmount || 0)

            );

            $("#totalPaid").text(

                jsAddon.display.money(s.totalPaid || 0)

            );

            $("#totalPending").text(

                jsAddon.display.money(s.totalPending || 0)

            );

        },

        /*
        |--------------------------------------------------------------------------
        | STATUS BADGE
        |--------------------------------------------------------------------------
        */

        statusBadge: function (status) {

            switch (String(status).toUpperCase()) {

                case "PAID":

                    return `
                        <span class="badge bg-success">
                            PAID
                        </span>
                    `;

                case "PENDING":

                    return `
                        <span class="badge bg-warning text-dark">
                            PENDING
                        </span>
                    `;

                case "CANCELLED":

                    return `
                        <span class="badge bg-secondary">
                            CANCELLED
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

        actionButtons: function (row) {

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
                                data-id="${row.incentive_id}">
                                <i class="bi bi-eye text-info me-2"></i>
                                View
                            </a>
                        </li>
                        <li>
                            <a
                                href="javascript:void(0)"
                                class="dropdown-item btn-edit"
                                data-id="${row.incentive_id}">
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
                                data-id="${row.incentive_id}">
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

            $("#incentiveId").val("");

            $("#incentiveBorrower").val("").trigger("change");

            $("#incentiveMonth").val("");

            $("#incentiveType").val("");

            $("#incentiveAmount").val("");

            $("#incentiveRemarks").val("");

            $("#incentiveStatus").val("PENDING");

        },

        /*
        |--------------------------------------------------------------------------
        | ADD INCENTIVE
        |--------------------------------------------------------------------------
        */

        addIncentive: function () {

            borrowerIncentivePage.funx.resetForm();

            $("#incentiveModalTitle").html(`
                <i class="bi bi-plus-circle"></i>
                Add Borrower Incentive
            `);

            new bootstrap.Modal(
                document.getElementById("incentiveModal")
            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | VIEW INCENTIVE
        |--------------------------------------------------------------------------
        */

        viewIncentive: function (incentiveId) {

            let incentive = borrowerIncentivePage.incentives[String(incentiveId)];

            if (!incentive) {

                jsAddon.display.ajaxRequest({
                    url: incentiveDetailsApi + "/" + incentiveId,
                    type: "GET",
                    dataType: "json"
                }).then(function (response) {
                    if (response.isError) {
                        Swal.fire("Error", response.message, "error");
                        return;
                    }
                    borrowerIncentivePage.funx.renderViewModal(response.data);
                });

            } else {
                borrowerIncentivePage.funx.renderViewModal(incentive);
            }

        },

        renderViewModal: function (row) {

            let html = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Borrower</label>
                        <h6>${row.borrower_name || '-'}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Incentive Month</label>
                        <h6>${row.incentive_month || '-'}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Incentive Type</label>
                        <h6>${row.incentive_type_name || row.incentive_type || '-'}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Amount</label>
                        <h6>${jsAddon.display.money(row.incentive_amount || 0)}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Status</label>
                        <h6>${borrowerIncentivePage.funx.statusBadge(row.status)}</h6>
                    </div>
                    <div class="col-md-12">
                        <label class="text-muted">Remarks</label>
                        <p>${row.remarks || '-'}</p>
                    </div>
                </div>
            `;

            $("#incentiveDetails").html(html);

            new bootstrap.Modal(
                document.getElementById("viewIncentiveModal")
            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | EDIT INCENTIVE
        |--------------------------------------------------------------------------
        */

        editIncentive: function (incentiveId) {

            jsAddon.display.ajaxRequest({
                url: incentiveDetailsApi + "/" + incentiveId,
                type: "GET",
                dataType: "json"
            }).then(function (response) {

                if (response.isError) {
                    Swal.fire("Error", response.message, "error");
                    return;
                }

                let row = response.data;

                borrowerIncentivePage.funx.resetForm();

                $("#incentiveModalTitle").html(`
                    <i class="bi bi-pencil-square"></i>
                    Edit Borrower Incentive
                `);

                $("#incentiveId").val(row.incentive_id);
                $("#incentiveBorrower").val(row.borrower_id).trigger("change");
                $("#incentiveMonth").val(row.incentive_month ? row.incentive_month.substring(0, 7) : '');
                $("#incentiveType").val(row.incentive_type_id || row.incentive_type);
                $("#incentiveAmount").val(row.incentive_amount);
                $("#incentiveRemarks").val(row.remarks);
                $("#incentiveStatus").val(row.status);

                new bootstrap.Modal(
                    document.getElementById("incentiveModal")
                ).show();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE INCENTIVE
        |--------------------------------------------------------------------------
        */

        saveIncentive: function () {

            let payload = {
                incentive_id: $("#incentiveId").val(),
                borrower_id: $("#incentiveBorrower").val(),
                incentive_month: $("#incentiveMonth").val(),
                incentive_type_id: $("#incentiveType").val(),
                incentive_amount: $("#incentiveAmount").val(),
                remarks: $("#incentiveRemarks").val(),
                status: $("#incentiveStatus").val()
            };

            if (payload.borrower_id == "") {
                Swal.fire("Warning", "Please select borrower.", "warning");
                return;
            }

            if (payload.incentive_month == "") {
                Swal.fire("Warning", "Please select incentive month.", "warning");
                return;
            }

            if (payload.incentive_type_id == "") {
                Swal.fire("Warning", "Please select incentive type.", "warning");
                return;
            }

            if (payload.incentive_amount == "" || parseFloat(payload.incentive_amount) <= 0) {
                Swal.fire("Warning", "Please enter valid incentive amount.", "warning");
                return;
            }

            Swal.fire({
                title: payload.incentive_id == "" ? "Add Incentive?" : "Update Incentive?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Save"
            }).then(function (result) {

                if (!result.isConfirmed) return;

                jsAddon.display.ajaxRequest({
                    url: saveBorrowerIncentiveApi,
                    type: "POST",
                    payload: payload,
                    dataType: "json"
                }).then(function (response) {

                    if (response.isError) {
                        Swal.fire("Error", response.message, "error");
                        return;
                    }

                    bootstrap.Modal.getInstance(document.getElementById("incentiveModal")).hide();

                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    });

                    borrowerIncentivePage.funx.loadIncentives();
                    borrowerIncentivePage.funx.loadSummary();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | DELETE INCENTIVE
        |--------------------------------------------------------------------------
        */

        deleteIncentive: function (incentiveId) {

            let incentive = borrowerIncentivePage.incentives[String(incentiveId)];

            if (!incentive) {
                Swal.fire("Error", "Incentive record not found.", "error");
                return;
            }

            Swal.fire({
                title: "Delete Incentive?",
                html: `
                    Are you sure you want to delete this incentive record?<br><br>
                    <strong>${incentive.borrower_name}</strong>
                `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Delete"
            }).then(function (result) {

                if (!result.isConfirmed) return;

                jsAddon.display.ajaxRequest({
                    url: deleteBorrowerIncentiveApi + "/" + incentiveId,
                    type: "DELETE",
                    dataType: "json"
                }).then(function (response) {

                    if (response.isError) {
                        Swal.fire("Error", response.message, "error");
                        return;
                    }

                    Swal.fire({
                        icon: "success",
                        title: "Deleted",
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    });

                    borrowerIncentivePage.funx.loadIncentives();
                    borrowerIncentivePage.funx.loadSummary();

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

    borrowerIncentivePage.init();

    $("#incentiveMonth").change(function () {
        borrowerIncentivePage.funx.loadIncentives();
        borrowerIncentivePage.funx.loadSummary();
    });

    $("#btnLoadIncentive").click(function () {
        borrowerIncentivePage.funx.loadIncentives();
        borrowerIncentivePage.funx.loadSummary();
    });

    /*
    |--------------------------------------------------------------------------
    | ADD
    |--------------------------------------------------------------------------
    */

    $("#btnAddIncentive").click(function () {
        borrowerIncentivePage.funx.addIncentive();
    });

    /*
    |--------------------------------------------------------------------------
    | SAVE SINGLE INCENTIVE (from table row)
    |--------------------------------------------------------------------------
    */

    $(document).on("click", ".btn-save-incentive", function () {

        let tr = $(this).closest("tr");

        let payload = {
            incentive_id: $(this).data("incentive"),
            borrower_id: $(this).data("borrower"),
            incentive_month: $("#incentiveMonth").val(),
            incentive_amount: tr.find(".txtIncentiveAmount").val(),
            status: tr.find(".txtIncentiveStatus").val(),
            remarks: tr.find(".txtRemarks").val()
        };

        if (!payload.incentive_id && !payload.borrower_id) {
            Swal.fire("Warning", "Invalid record.", "warning");
            return;
        }

        jsAddon.display.ajaxRequest({
            url: saveBorrowerIncentiveApi,
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
                title: "Saved",
                timer: 1000,
                showConfirmButton: false
            });

            borrowerIncentivePage.funx.loadIncentives();
            borrowerIncentivePage.funx.loadSummary();

        });

    });

    /*
    |--------------------------------------------------------------------------
    | SAVE FROM MODAL
    |--------------------------------------------------------------------------
    */

    $("#btnSaveIncentive").click(function () {
        borrowerIncentivePage.funx.saveIncentive();
    });

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */

    $(document)
        .off("click", ".btn-view")
        .on("click", ".btn-view", function () {
            borrowerIncentivePage.funx.viewIncentive($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    $(document)
        .off("click", ".btn-edit")
        .on("click", ".btn-edit", function () {
            borrowerIncentivePage.funx.editIncentive($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    $(document)
        .off("click", ".btn-delete")
        .on("click", ".btn-delete", function () {
            borrowerIncentivePage.funx.deleteIncentive($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | FILTER STATUS
    |--------------------------------------------------------------------------
    */

    $("#filterStatus")
        .off("change")
        .on("change", function () {
            borrowerIncentivePage.funx.loadIncentives();
            borrowerIncentivePage.funx.loadSummary();
        });

    /*
    |--------------------------------------------------------------------------
    | FILTER BORROWER
    |--------------------------------------------------------------------------
    */

    $("#filterBorrower")
        .off("change")
        .on("change", function () {
            borrowerIncentivePage.funx.loadIncentives();
            borrowerIncentivePage.funx.loadSummary();
        });

    /*
    |--------------------------------------------------------------------------
    | FILTER INCENTIVE TYPE (for filtering table only)
    |--------------------------------------------------------------------------
    */

    $("#filterIncentiveType")
        .off("change")
        .on("change", function () {
            borrowerIncentivePage.funx.loadIncentives();
            borrowerIncentivePage.funx.loadSummary();
        });

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    $("#txtSearch")
        .off("keypress")
        .on("keypress", function (e) {
            if (e.which == 13) {
                borrowerIncentivePage.funx.loadIncentives();
                borrowerIncentivePage.funx.loadSummary();
            }
        });

    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */

    $("#btnRefreshIncentive")
        .off("click")
        .on("click", function () {
            $("#txtSearch").val("");
            $("#filterBorrower").val("");
            $("#filterStatus").val("");
            $("#filterIncentiveType").val("");
            borrowerIncentivePage.funx.loadIncentives();
            borrowerIncentivePage.funx.loadSummary();
        });

        /*
        |--------------------------------------------------------------------------
        | TRACK CHANGES FOR BULK SAVE (NO incentive_type_id - it's read-only in table)
        |--------------------------------------------------------------------------
        */

        $(document).on("input change", ".txtIncentiveAmount, .txtIncentiveStatus, .txtRemarks", function () {

            const row = $(this).closest("tr");

            // ✅ USE .attr() FOR DYNAMICALLY CREATED ELEMENTS
            let incentiveId = $(this).attr("data-incentive");
            let incentive_type_id = $("#filterIncentiveType").val();
            let borrowerId = $(this).attr("data-borrower");

            // ✅ Convert empty string to null explicitly
            if (incentiveId === "" || incentiveId === undefined) {
                incentiveId = null;
            }
            if (borrowerId === "" || borrowerId === undefined) {
                borrowerId = null;
            }
            if (incentive_type_id === "" || incentive_type_id === undefined) {
                incentive_type_id = null;
            }

            const amount = parseFloat(row.find(".txtIncentiveAmount").val()) || 0;
            const status = row.find(".txtIncentiveStatus").val();
            const remarks = row.find(".txtRemarks").val();

            console.log("=== TRACKING CHANGE ===");
            console.log("data-incentive attr:", $(this).attr("data-incentive"));
            console.log("data-borrower attr:", $(this).attr("data-borrower"));
            console.log("incentiveId:", incentiveId, typeof incentiveId);
            console.log("borrowerId:", borrowerId, typeof borrowerId);
            console.log("=== END TRACKING ===");

            if (borrowerId) {
                borrowerIncentivePage.editedIncentives[borrowerId] = {
                    incentive_id: incentiveId,        // ✅ ALWAYS include this (even if null)
                    incentive_type_id: incentive_type_id,        // ✅ ALWAYS include this (even if null)
                    borrower_id: parseInt(borrowerId),
                    incentive_amount: amount,
                    status: status,
                    remarks: remarks
                };
            }

            console.log("editedIncentives:", borrowerIncentivePage.editedIncentives);

        });

    /*
    |--------------------------------------------------------------------------
    | BULK SAVE
    |--------------------------------------------------------------------------
    */

    $(document).on("click", "#btnSaveAllIncentive", function () {

        const incentives = Object.values(borrowerIncentivePage.editedIncentives);

        if (incentives.length === 0) {
            Swal.fire("Info", "No changes to save.", "info");
            return;
        }

        // ✅ DON'T DELETE incentive_id - keep it even if null
        // PHP will check: if incentive_id is null/empty, it's a new record
        const payload = {
            incentive_month: $("#incentiveMonth").val(),
            incentives: incentives
        };

        console.log("=== PAYLOAD DEBUG ===");
        console.log("incentive_month:", payload.incentive_month);
        console.log("incentives count:", payload.incentives.length);
        console.log("first incentive:", JSON.stringify(payload.incentives[0], null, 2));
        console.log("=== END DEBUG ===");

        Swal.fire({
            title: "Save All Incentives?",
            text: `You are about to save ${incentives.length} record(s).`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Save"
        }).then(function (result) {

            if (!result.isConfirmed) return;

            Swal.fire({
                title: 'Saving...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            jsAddon.display.ajaxRequest({
                url: saveBulkIncentiveApi,
                type: "POST",
                payload: payload,
                dataType: "json"
            }).then(function (response) {

                if (response.isError) {
                    Swal.fire("Error", response.message, "error");
                    return;
                }

                let successMessage = response.message;
                
                // Add details if available
                if (response.updated !== undefined || response.skipped !== undefined) {
                    successMessage += `<br><br><small class="text-muted">Updated: ${response.updated || 0} | Skipped: ${response.skipped || 0}</small>`;
                }

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    html: successMessage,
                    timer: 3000,
                    showConfirmButton: true
                });

                borrowerIncentivePage.editedIncentives = {};
                borrowerIncentivePage.funx.loadIncentives();
                borrowerIncentivePage.funx.loadSummary();

            })

        });

    });

});