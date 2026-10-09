let incentiveTypePage = {

    table: null,

    incentiveTypes: {},

    init: function () {

        incentiveTypePage.funx.loadIncentiveTypes();
    },

    funx: {

        /*
        |--------------------------------------------------------------------------
        | LOAD INCENTIVE TYPES
        |--------------------------------------------------------------------------
        */
        loadIncentiveTypes: function () {
               
            if ($.fn.DataTable.isDataTable("#incentiveTypeTable")) {
                $("#incentiveTypeTable").DataTable().destroy();
            }

            $("#incentiveTypeTable tbody").empty();

            incentiveTypePage.table = $("#incentiveTypeTable").DataTable({

                processing: true,
                serverSide: true,
                destroy: true,
                responsive: false,
                autoWidth: false,
                scrollX: true,
                searching: true,
                ordering: true,
                pageLength: 25,
                order: [[0, "asc"]],
                
                ajax: function (data, callback) {

                    jsAddon.display.ajaxRequest({

                        url: incentiveTypeApi,

                        type: "GET",

                        payload: {

                            draw: data.draw,
                            start: data.start,
                            length: data.length,
                            orderColumn: data.columns[data.order[0].column].data,
                            orderDir: data.order[0].dir,
                            search: $("#txtIncentiveTypeSearch").val()

                        },

                        dataType: "json"

                    }).then(function (response) {
                            alert("im here")
                        incentiveTypePage.incentiveTypes = {};

                        $.each(response.data || [], function (_, row) {
                            incentiveTypePage.incentiveTypes[row.id] = row;
                        });

                        callback({
                            draw: response.draw,
                            recordsTotal: response.recordsTotal,
                            recordsFiltered: response.recordsFiltered,
                            data: response.data
                        });

                    })
                    .catch(function (error) {
                        alert(error)
                        console.error("AJAX Catch Error:", error);

                        let message =
                            error?.responseJSON?.message ||
                            error?.responseJSON?.error ||
                            error?.statusText ||
                            "Unable to load incentive types.";

                        console.error("Error Message:", message);

                        Swal.fire(
                            "Request Error",
                            message,
                            "error"
                        );

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
                        data: "id",
                        defaultContent: "",
                        width: "5%"
                    },

                    {
                        data: "name",
                        defaultContent: "",
                        width: "30%"
                    },

                    {
                        data: "full_texts",
                        defaultContent: "",
                        width: "25%"
                    },

                    {
                        data: "loan_product_id",
                        defaultContent: "",
                        width: "10%",
                        render: function (data, type, row) {
                            return data ? data : '-';
                        }
                    },

                    {
                        data: "showInSelection",
                        defaultContent: "",
                        width: "10%",
                        render: function (data, type, row) {
                            return incentiveTypePage.funx.showInSelectionBadge(data);
                        }
                    },

                    {
                        data: null,
                        orderable: false,
                        searchable: false,
                        defaultContent: "",
                        width: "20%",
                        render: function (data, type, row) {
                            return incentiveTypePage.funx.actionButtons(row);
                        }
                    }

                ]

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SHOW IN SELECTION BADGE
        |--------------------------------------------------------------------------
        */
        showInSelectionBadge: function (status) {

            if (status == 1 || status === true || status === "1") {
                return `
                    <span class="badge bg-success">
                        YES
                    </span>
                `;
            } else {
                return `
                    <span class="badge bg-secondary">
                        NO
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
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-info btn-view" data-id="${row.id}" title="View">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-edit" data-id="${row.id}" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-outline-success btn-copy" data-id="${row.id}" title="Copy">
                        <i class="bi bi-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-delete" data-id="${row.id}" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;

        },

        /*
        |--------------------------------------------------------------------------
        | RESET FORM
        |--------------------------------------------------------------------------
        */
        resetForm: function () {

            $("#incentiveTypeId").val("");
            $("#incentiveTypeName").val("");
            $("#incentiveTypeFullTexts").val("");
            $("#incentiveTypeLoanProductId").val("");
            $("#incentiveTypeShowInSelection").prop("checked", true);

        },

        /*
        |--------------------------------------------------------------------------
        | ADD INCENTIVE TYPE
        |--------------------------------------------------------------------------
        */
        addIncentiveType: function () {

            incentiveTypePage.funx.resetForm();

            $("#incentiveTypeModalTitle").html(`
                <i class="bi bi-plus-circle"></i>
                Add Incentive Type
            `);

            new bootstrap.Modal(
                document.getElementById("incentiveTypeModal")
            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | VIEW INCENTIVE TYPE
        |--------------------------------------------------------------------------
        */
        viewIncentiveType: function (incentiveTypeId) {

            let incentiveType = incentiveTypePage.incentiveTypes[String(incentiveTypeId)];

            if (!incentiveType) {

                // Try to fetch from API if not in cache
                jsAddon.display.ajaxRequest({
                    url: incentiveTypeDetailsApi + "/" + incentiveTypeId,
                    type: "GET",
                    dataType: "json"
                }).then(function (response) {
                    if (response.isError) {
                        Swal.fire("Error", response.message, "error");
                        return;
                    }
                    incentiveTypePage.funx.renderViewModal(response.data);
                });

            } else {
                incentiveTypePage.funx.renderViewModal(incentiveType);
            }

        },

        renderViewModal: function (row) {

            let html = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">ID</label>
                        <h6>${row.id}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Name</label>
                        <h6>${row.name || "-"}</h6>
                    </div>
                    <div class="col-md-12 mb-3">
                        <label class="text-muted">Full Texts</label>
                        <h6>${row.full_texts || "-"}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Loan Product ID</label>
                        <h6>${row.loan_product_id || "-"}</h6>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="text-muted">Show in Selection</label>
                        <h6>${incentiveTypePage.funx.showInSelectionBadge(row.showInSelection)}</h6>
                    </div>
                </div>
            `;

            $("#incentiveTypeDetails").html(html);

            new bootstrap.Modal(
                document.getElementById("viewIncentiveTypeModal")
            ).show();

        },

        /*
        |--------------------------------------------------------------------------
        | EDIT INCENTIVE TYPE
        |--------------------------------------------------------------------------
        */
        editIncentiveType: function (incentiveTypeId) {

            jsAddon.display.ajaxRequest({
                url: incentiveTypeDetailsApi + "/" + incentiveTypeId,
                type: "GET",
                dataType: "json"
            }).then(function (response) {

                if (response.isError) {
                    Swal.fire("Error", response.message, "error");
                    return;
                }

                let row = response.data;

                incentiveTypePage.funx.resetForm();

                $("#incentiveTypeModalTitle").html(`
                    <i class="bi bi-pencil-square"></i>
                    Edit Incentive Type
                `);

                $("#incentiveTypeId").val(row.id);
                $("#incentiveTypeName").val(row.name);
                $("#incentiveTypeFullTexts").val(row.full_texts);
                $("#incentiveTypeLoanProductId").val(row.loan_product_id);
                $("#incentiveTypeShowInSelection").prop("checked", row.showInSelection == 1 || row.showInSelection === true);

                new bootstrap.Modal(
                    document.getElementById("incentiveTypeModal")
                ).show();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | COPY INCENTIVE TYPE
        |--------------------------------------------------------------------------
        */
        copyIncentiveType: function (incentiveTypeId) {

            jsAddon.display.ajaxRequest({
                url: incentiveTypeDetailsApi + "/" + incentiveTypeId,
                type: "GET",
                dataType: "json"
            }).then(function (response) {

                if (response.isError) {
                    Swal.fire("Error", response.message, "error");
                    return;
                }

                let row = response.data;

                incentiveTypePage.funx.resetForm();

                $("#incentiveTypeModalTitle").html(`
                    <i class="bi bi-copy"></i>
                    Copy Incentive Type
                `);

                // Don't copy the ID, let the system generate a new one
                $("#incentiveTypeId").val("");
                $("#incentiveTypeName").val(row.name + " (Copy)");
                $("#incentiveTypeFullTexts").val(row.full_texts);
                $("#incentiveTypeLoanProductId").val(row.loan_product_id);
                $("#incentiveTypeShowInSelection").prop("checked", row.showInSelection == 1 || row.showInSelection === true);

                new bootstrap.Modal(
                    document.getElementById("incentiveTypeModal")
                ).show();

            });

        },

        /*
        |--------------------------------------------------------------------------
        | SAVE INCENTIVE TYPE
        |--------------------------------------------------------------------------
        */
        saveIncentiveType: function () {

            let payload = {
                id: $("#incentiveTypeId").val(),
                name: $("#incentiveTypeName").val(),
                full_texts: $("#incentiveTypeFullTexts").val(),
                loan_product_id: $("#incentiveTypeLoanProductId").val() || null,
                showInSelection: $("#incentiveTypeShowInSelection").is(":checked") ? 1 : 0
            };

            if (payload.name == "") {
                Swal.fire("Warning", "Please enter incentive type name.", "warning");
                return;
            }

            Swal.fire({
                title: payload.id == "" ? "Add Incentive Type?" : "Update Incentive Type?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Save"
            }).then(function (result) {

                if (!result.isConfirmed) return;

                jsAddon.display.ajaxRequest({
                    url: saveIncentiveTypeApi,
                    type: "POST",
                    payload: payload,
                    dataType: "json"
                }).then(function (response) {

                    if (response.isError) {
                        Swal.fire("Error", response.message, "error");
                        return;
                    }

                    bootstrap.Modal
                        .getInstance(document.getElementById("incentiveTypeModal"))
                        .hide();

                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    });

                    incentiveTypePage.funx.loadIncentiveTypes();

                });

            });

        },

        /*
        |--------------------------------------------------------------------------
        | DELETE INCENTIVE TYPE
        |--------------------------------------------------------------------------
        */
        deleteIncentiveType: function (incentiveTypeId) {

            let incentiveType = incentiveTypePage.incentiveTypes[String(incentiveTypeId)];

            if (!incentiveType) {
                Swal.fire("Error", "Incentive type record not found.", "error");
                return;
            }

            Swal.fire({
                title: "Delete Incentive Type?",
                html: `
                    Are you sure you want to delete this incentive type?<br><br>
                    <strong>${incentiveType.name}</strong>
                `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Delete"
            }).then(function (result) {

                if (!result.isConfirmed) return;

                jsAddon.display.ajaxRequest({
                    url: deleteIncentiveTypeApi + "/" + incentiveTypeId,
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

                    incentiveTypePage.funx.loadIncentiveTypes();

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

    incentiveTypePage.init();

    /*
    |--------------------------------------------------------------------------
    | ADD
    |--------------------------------------------------------------------------
    */
    $("#btnAddIncentiveType").click(function () {
        incentiveTypePage.funx.addIncentiveType();
    });

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */
    $("#btnSaveIncentiveType").click(function () {
        incentiveTypePage.funx.saveIncentiveType();
    });

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */
    $(document)
        .off("click", ".btn-view")
        .on("click", ".btn-view", function () {
            incentiveTypePage.funx.viewIncentiveType($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */
    $(document)
        .off("click", ".btn-edit")
        .on("click", ".btn-edit", function () {
            incentiveTypePage.funx.editIncentiveType($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | COPY
    |--------------------------------------------------------------------------
    */
    $(document)
        .off("click", ".btn-copy")
        .on("click", ".btn-copy", function () {
            incentiveTypePage.funx.copyIncentiveType($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */
    $(document)
        .off("click", ".btn-delete")
        .on("click", ".btn-delete", function () {
            incentiveTypePage.funx.deleteIncentiveType($(this).data("id"));
        });

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */
    $("#txtIncentiveTypeSearch")
        .off("keypress")
        .on("keypress", function (e) {
            if (e.which == 13) {
                incentiveTypePage.funx.loadIncentiveTypes();
            }
        });

    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */
    $("#btnRefreshIncentiveType")
        .off("click")
        .on("click", function () {
            $("#txtIncentiveTypeSearch").val("");
            incentiveTypePage.funx.loadIncentiveTypes();
        });

});