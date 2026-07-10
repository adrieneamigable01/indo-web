dailyClose = {

    init:()=>{

        dailyClose.funx.get();

    },

    funx:{
        
        get:()=>{

            
              if(

                    dailyClose.table

                ){

                    dailyClose.table.destroy();

                }

                dailyClose.table =

                $("#tblDailyClose")

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

                            url:dailyCloseApi,

                            type:"GET",

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

                                status:
                                    $("#filterStatus").val(),

                                business_date:
                                    $("#filterBusinessDate").val()

                            },

                            dataType:"json"

                        }).then(function(response){

                            dailyClose.records = {};

                            $.each(

                                response.data,

                                function(_,row){

                                    dailyClose.records[

                                        row.cashier_daily_close_id

                                    ] = row;

                                }

                            );

                            callback({

                                draw:response.draw,

                                recordsTotal:
                                    response.recordsTotal,

                                recordsFiltered:
                                    response.recordsFiltered,

                                data:response.data

                            });

                        });

                    },

                    columns:[

                        {
                            data:"cashier_daily_close_id"
                        },

                        {
                            data:"cashier_name"
                        },

                        {
                            data:"business_date"
                        },

                        {
                            data:"expected_cash",
                            className:"text-end",
                            render:function(data){

                                return dailyClose.funx.money(data);

                            }
                        },

                        {
                            data:"actual_cash",
                            className:"text-end",
                            render:function(data){

                                return dailyClose.funx.money(data);

                            }
                        },

                        {
                            data:"variance",
                            className:"text-end",
                            render:function(data){

                                return dailyClose.funx.money(data);

                            }
                        },

                        {
                            data:"returned_amount",
                            className:"text-end",
                            render:function(data){

                                return dailyClose.funx.money(data);

                            }
                        },

                        {
                            data:"status",
                            render:function(data){

                                return dailyClose.funx.statusBadge(data);

                            }
                        },

                        {
                            data:null,

                            orderable:false,

                            searchable:false,

                            render:function(data,type,row){

                                return dailyClose.funx.actionButtons(row);

                            }

                        }

                    ]

                });

                dailyClose.funx.loadSummary();


        },
        loadSummary:function(){

            jsAddon.display.ajaxRequest({

                url:dailyCloseSummaryApi,

                type:"GET",

                payload:{

                    cashier_id:
                        $("#filterCashier").val(),

                    business_date:
                        $("#filterBusinessDate").val(),

                    status:
                        $("#filterStatus").val()

                },

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

                let data = response.data;

                $("#lblPending").html(
                    data.pending || 0
                );

                $("#lblApproved").html(
                    data.approved || 0
                );

                $("#lblRejected").html(
                    data.rejected || 0
                );

                $("#lblCancelled").html(
                    data.cancelled || 0
                );

            });

        },
        money:function(amount){

            amount =
                parseFloat(amount) || 0;

            return amount.toLocaleString(

                undefined,

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            );

        },
        statusBadge:function(status){

            switch(status){

                case "APPROVED":

                    return `<span class="badge bg-success">
                                Approved
                            </span>`;

                case "REJECTED":

                    return `<span class="badge bg-danger">
                                Rejected
                            </span>`;

                case "CANCELLED":

                    return `<span class="badge bg-secondary">
                                Cancelled
                            </span>`;

                default:

                    return `<span class="badge bg-warning text-dark">
                                Pending
                            </span>`;

            }

        },
        actionButtons:function(row){

            let html = `

                <button
                    class="btn btn-info btn-sm"
                    onclick="dailyClose.funx.view(${row.cashier_daily_close_id})">

                    <i class="bi bi-eye"></i>

                </button>

            `;

            if(row.status=="PENDING"){

                html += `

                    <button
                        class="btn btn-success btn-sm"
                        onclick="dailyClose.funx.approve(${row.cashier_daily_close_id})">

                        <i class="bi bi-check-lg"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="dailyClose.funx.reject(${row.cashier_daily_close_id})">

                        <i class="bi bi-x-lg"></i>

                    </button>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="dailyClose.funx.cancel(${row.cashier_daily_close_id})">

                        <i class="bi bi-slash-circle"></i>

                    </button>

                `;

            }

            return html;

        },
        approve:(id)=>{

            let userData = JSON.parse(

                localStorage.getItem("userdata") || "{}"

            );


            Swal.fire({

                icon:'question',

                title:'Approve Daily Close?',

                // input:'textarea',

                inputPlaceholder:'Remarks',

                showCancelButton:true,

                confirmButtonText:'Approve'

            })
            .then((result)=>{
                if(result.isConfirmed){

                    let payload={

                        approved_by:userData.userid,

                        cashier_daily_close_id:id

                    };

                    jsAddon.display.ajaxRequest({

                        type:'POST',

                        url:dailyCloseApproveApi,

                        dataType:'json',

                        payload:payload

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

                        Swal.fire({

                            icon:'success',

                            title:'Approved',

                            text:response.message

                        })
                        .then(()=>{

                            dailyClose.funx.get();

                        });

                    })
                    .catch((xhr)=>{

                        Swal.fire({

                            icon:'error',

                            title:'System Error',

                            text:'Unable to approve Daily Close.'

                        });

                    });

                }

            });

        },

        reject:(id)=>{
             let userData = JSON.parse(

                localStorage.getItem("userdata") || "{}"

            );

            Swal.fire({

                icon:'warning',

                title:'Reject Daily Close',

                input:'textarea',

                inputPlaceholder:'Reason',

                inputValidator:(value)=>{

                    if(!value){

                        return "Remarks is required.";

                    }

                },

                showCancelButton:true,

                confirmButtonText:'Reject'

            })
            .then((result)=>{

                if(result.isConfirmed){

                    let payload={

                        rejected_by:userData.userid,
                        remarks:result.value,
                        cashier_daily_close_id:id

                    };

                    jsAddon.display.ajaxRequest({

                        type:'POST',

                        url:dailyClosRejectApi,

                        dataType:'json',

                        payload:payload

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

                        Swal.fire({

                            icon:'success',

                            title:'Rejected',

                            text:response.message

                        })
                        .then(()=>{

                            dailyClose.funx.get();

                        });

                    })
                    .catch((xhr)=>{

                        Swal.fire({

                            icon:'error',

                            title:'System Error',

                            text:'Unable to reject Daily Close.'

                        });

                    });

                }

            });

        },

        cancel:(id)=>{

            Swal.fire({

                icon:'warning',

                title:'Cancel Daily Close',

                input:'textarea',

                inputPlaceholder:'Cancellation Reason',

                inputValidator:(value)=>{

                    if(!value){

                        return "Cancellation reason is required.";

                    }

                },

                showCancelButton:true,

                confirmButtonText:'Cancel Daily Close'

            })
            .then((result)=>{

                if(result.isConfirmed){

                    let payload={

                        cancelled_by:userData.userid,

                        cancel_reason:result.value

                    };

                    jsAddon.display.ajaxRequest({

                        type:'POST',

                        url:dailyCloseApi +
                            "/cancel/" + id,

                        dataType:'json',

                        payload:JSON.stringify(payload)

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

                        Swal.fire({

                            icon:'success',

                            title:'Cancelled',

                            text:response.message

                        })
                        .then(()=>{

                            dailyClose.funx.get();

                        });

                    })
                    .catch((xhr)=>{

                        Swal.fire({

                            icon:'error',

                            title:'System Error',

                            text:'Unable to cancel Daily Close.'

                        });

                    });

                }

            });

        },

        render:(data)=>{

            let html = "";

            let pending = 0;
            let approved = 0;
            let rejected = 0;
            let cancelled = 0;

            $.each(data,function(index,row){

                switch(row.status){

                    case "PENDING":
                        pending++;
                    break;

                    case "APPROVED":
                        approved++;
                    break;

                    case "REJECTED":
                        rejected++;
                    break;

                    case "CANCELLED":
                        cancelled++;
                    break;

                }

                let status = "";

                switch(row.status){

                    case "PENDING":

                        status = `
                            <span class="badge bg-warning">
                                Pending
                            </span>
                        `;

                    break;

                    case "APPROVED":

                        status = `
                            <span class="badge bg-success">
                                Approved
                            </span>
                        `;

                    break;

                    case "REJECTED":

                        status = `
                            <span class="badge bg-danger">
                                Rejected
                            </span>
                        `;

                    break;

                    case "CANCELLED":

                        status = `
                            <span class="badge bg-secondary">
                                Cancelled
                            </span>
                        `;

                    break;

                }

                let actions = `
                    <div class="dropdown">

                        <button
                            class="btn btn-light btn-sm"
                            data-bs-toggle="dropdown">

                            <i class="bi bi-three-dots"></i>

                        </button>

                        <ul class="dropdown-menu">

                            <li>

                                <a
                                    class="dropdown-item"
                                    onclick="dailyClose.funx.view(${row.cashier_daily_close_id})">

                                    <i class="bi bi-eye"></i>

                                    View

                                </a>

                            </li>
                `;

                if(row.status=="PENDING"){

                    actions += `

                        <li>

                            <a
                                class="dropdown-item text-success"
                                onclick="dailyClose.funx.approve(${row.cashier_daily_close_id})">

                                <i class="bi bi-check-circle"></i>

                                Approve

                            </a>

                        </li>

                        <li>

                            <a
                                class="dropdown-item text-danger"
                                onclick="dailyClose.funx.reject(${row.cashier_daily_close_id})">

                                <i class="bi bi-x-circle"></i>

                                Reject

                            </a>

                        </li>

                        <li>

                            <a
                                class="dropdown-item text-warning"
                                onclick="dailyClose.funx.cancel(${row.cashier_daily_close_id})">

                                <i class="bi bi-slash-circle"></i>

                                Cancel

                            </a>

                        </li>

                    `;

                }

                actions += `

                        </ul>

                    </div>

                `;

                html += `

                    <tr>

                        <td>

                            DC-${row.cashier_daily_close_id}

                        </td>

                        <td>

                            <strong>

                                ${row.cashier_name}

                            </strong>

                        </td>

                        <td>

                            ${row.business_date}

                        </td>

                        <td class="text-end">

                            ${parseFloat(row.expected_cash).toLocaleString(undefined,{
                                minimumFractionDigits:2
                            })}

                        </td>

                        <td class="text-end">

                            ${parseFloat(row.actual_cash).toLocaleString(undefined,{
                                minimumFractionDigits:2
                            })}

                        </td>

                        <td class="text-end">

                            ${parseFloat(row.variance).toLocaleString(undefined,{
                                minimumFractionDigits:2
                            })}

                        </td>

                        <td class="text-end">

                            ${parseFloat(row.returned_amount).toLocaleString(undefined,{
                                minimumFractionDigits:2
                            })}

                        </td>

                        <td>

                            ${status}

                        </td>

                        <td>

                            ${actions}

                        </td>

                    </tr>

                `;

            });

            $("#lblPending").text(pending);
            $("#lblApproved").text(approved);
            $("#lblRejected").text(rejected);
            $("#lblCancelled").text(cancelled);

            if($.fn.DataTable.isDataTable('#tblDailyClose')){

                $('#tblDailyClose tbody').empty();

                $('#tblDailyClose').DataTable().destroy();

            }

            $("#dailyCloseBody").html(html);

            $('#tblDailyClose').DataTable({

                responsive:true,

                pageLength:10,

                order:[
                    [0,'desc']
                ],

                columnDefs:[
                    {
                        targets:8,
                        orderable:false,
                        searchable:false
                    }
                ],

                layout:{
                    topStart:{
                        buttons:[
                            {
                                extend:'excel',
                                className:'btn btn-success'
                            },
                            {
                                extend:'print',
                                className:'btn btn-dark'
                            }
                        ]
                    }
                }

            });

        },
        view:(id)=>{

            jsAddon.display.ajaxRequest({

                type:'GET',

                url:dailyCloseApi + "/details/" + id,

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

                let header = response.data.header;

                $("#viewCashier").text(
                    header.cashier_name
                );

                $("#viewBusinessDate").text(
                    header.business_date
                );

                $("#viewExpectedCash").text(
                    parseFloat(header.expected_cash)
                    .toLocaleString(undefined,{
                        minimumFractionDigits:2
                    })
                );

                $("#viewActualCash").text(
                    parseFloat(header.actual_cash)
                    .toLocaleString(undefined,{
                        minimumFractionDigits:2
                    })
                );

                $("#viewVariance").text(
                    parseFloat(header.variance)
                    .toLocaleString(undefined,{
                        minimumFractionDigits:2
                    })
                );

                $("#viewReturnedAmount").text(
                    parseFloat(header.returned_amount)
                    .toLocaleString(undefined,{
                        minimumFractionDigits:2
                    })
                );

                $("#viewStatus").html(

                    `<span class="badge bg-${
                        header.status=="APPROVED"
                        ?"success"
                        :
                        header.status=="REJECTED"
                        ?"danger"
                        :
                        header.status=="CANCELLED"
                        ?"secondary"
                        :
                        "warning"
                    }">

                        ${header.status}

                    </span>`

                );

                $("#viewRemarks").text(
                    header.remarks ?? ""
                );

                /*
                -------------------------
                Denominations
                -------------------------
                */

                let denominationHtml = "";

                $.each(
                    response.data.denominations,
                    function(index,row){

                        denominationHtml += `

                            <tr>

                                <td>

                                    ${parseFloat(row.denomination)
                                        .toLocaleString(undefined,{
                                            minimumFractionDigits:2
                                        })}

                                </td>

                                <td>

                                    ${row.quantity}

                                </td>

                                <td>

                                    ${parseFloat(row.total)
                                        .toLocaleString(undefined,{
                                            minimumFractionDigits:2
                                        })}

                                </td>

                            </tr>

                        `;

                    }
                );

                $("#tblDenominations")
                    .html(denominationHtml);

                /*
                -------------------------
                Logs
                -------------------------
                */

                let logHtml = "";

                $.each(
                    response.data.logs,
                    function(index,row){

                        logHtml += `

                            <tr>

                                <td>

                                    ${row.created_at}

                                </td>

                                <td>

                                    <span class="badge bg-primary">

                                        ${row.action}

                                    </span>

                                </td>

                                <td>

                                    ${row.action_by_name}

                                </td>

                                <td>

                                    ${row.remarks ?? ""}

                                </td>

                            </tr>

                        `;

                    }
                );

                $("#tblLogs")
                    .html(logHtml);

                $("#viewDailyCloseModal")
                    .modal("show");

            })
            .catch((xhr)=>{

                let message =
                    "Unable to load Daily Close.";

                if(xhr.status==0){

                    message =
                        "Unable to connect to server.";

                }else if(xhr.status==404){

                    message =
                        "API not found.";

                }else if(xhr.status==500){

                    message =
                        "Internal Server Error.";

                }else if(
                    xhr.responseJSON &&
                    xhr.responseJSON.message
                ){

                    message =
                        xhr.responseJSON.message;

                }

                Swal.fire({

                    icon:'error',

                    title:'System Error',

                    text:message

                });

            });

        },

    },

};

$(document).ready(function(){

    dailyClose.init();

});