
borrower = {

    init:()=>{

        borrower.funx.get();
        borrower.funx.loadSummary();

    },

    funx:{

        get:()=>{

            $("#borrowerBody").html(`
                <tr>
                    <td colspan="7" class="text-center">
                        Loading borrowers...
                    </td>
                </tr>
            `);

            jsAddon.display.ajaxRequest({

                type:'GET',
                url:borrowerApi,
                dataType:'json'

            })
            .then((response)=>{

                console.log(response);

                if(response.isError){

                    Swal.fire({
                        icon:'error',
                        title:'Error',
                        text:response.message
                    });

                    return;
                }

                borrower.funx.render(
                    response.data
                );

            })
            .catch((xhr)=>{

                let message =
                    "Unable to load borrowers.";

                if(xhr.status == 0){

                    message =
                        "Unable to connect to the server.";

                }else if(xhr.status == 404){

                    message =
                        "Borrowers API not found.";

                }else if(xhr.status == 500){

                    message =
                        "Internal Server Error.";

                }else if(xhr.responseJSON &&
                        xhr.responseJSON.message){

                    message =
                        xhr.responseJSON.message;

                }

                Swal.fire({
                    icon:'error',
                    title:'System Error',
                    text:message
                });

                console.error(
                    "Borrower Error",
                    xhr
                );

                $("#borrowerBody").html(`
                    <tr>
                        <td colspan="7"
                            class="text-center text-danger">

                            Failed to load borrowers

                        </td>
                    </tr>
                `);

            });

        },
        loadSummary:function(){

            jsAddon.display.ajaxRequest({

                url: borrowerSummaryApi,

                type: "GET",

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

                let data = response.data;

                $("#totalBorrowers").html(

                    data.total_borrowers || 0

                );

                $("#activeBorrowers").html(

                    data.active_borrowers || 0

                );

                $("#delinquentBorrowers").html(

                    data.delinquent || 0

                );

                $("#blacklistedBorrowers").html(

                    data.blacklisted || 0

                );

            });

        },
        edit:(id)=>{

            window.location =
                "borrower_form.php?id=" + id;

        },
        render:(data)=>{

            let html = '';
            $.each(data,function(index,row){

                let fullname =
                    row.last_name + ', ' +
                    row.first_name + ' ' +
                    row.middle_name;

                let status =
                    row.isActive == 1
                    ?
                    `<span class="badge bg-success">
                        Active
                    </span>`
                    :
                    `<span class="badge bg-danger">
                        Inactive
                    </span>`;

                html += `

                    <tr>

                        <td>
                            ${row.borrower_id}
                        </td>

                        <td>

                            <strong>
                                ${fullname}
                            </strong>

                            <br>

                            <small class="text-muted">
                                ${row.home_address}
                            </small>

                        </td>

                        <td>
                            ${row.mobile_no}
                        </td>

                        <td>
                            ${row.email_address}
                        </td>

                        <td>
                            ${row.civil_status}
                        </td>

                        <td>
                            ${status}
                        </td>

                        <td>

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
                                            onclick="borrower.funx.view(${row.borrower_id})">

                                            <i class="bi bi-eye"></i>

                                            View

                                        </a>

                                    </li>

                                    <li>

                                        <a
                                            class="dropdown-item"
                                            onclick="borrower.funx.edit(${row.borrower_id})">

                                            <i class="bi bi-pencil"></i>

                                            Edit

                                        </a>

                                    </li>

                                    <li>

                                        <a
                                            class="dropdown-item text-danger"
                                            onclick="borrower.funx.void(${row.borrower_id})">

                                            <i class="bi bi-trash"></i>

                                            Void

                                        </a>

                                    </li>

                                </ul>

                            </div>

                        </td>

                    </tr>

                `;

            });
           
            if($.fn.DataTable.isDataTable('#borrowerTable')){
                $('#borrowerTable tbody').empty()
                $('#borrowerTable')
                    .DataTable()
                    .destroy();

            }
            $("#borrowerBody").html(html);

            borrower.funx.datatable();

        },

        datatable:()=>{

            
            $('#borrowerTable').DataTable({

                responsive:true,

                pageLength:10,

                order:[
                    [0,'desc']
                ],

                columnDefs:[
                    {
                        targets:6,
                        orderable:false,
                        searchable:false
                    }
                ],

                layout:{
                    // topStart:{
                    //     buttons:[
                    //         {
                    //             extend:'excel',
                    //             className:'btn btn-success'
                    //         },
                    //         {
                    //             extend:'print',
                    //             className:'btn btn-dark'
                    //         }
                    //     ]
                    // }
                }

            });

        },

        view:(id)=>{

            window.location =
                "view/borrower?id=" + id;

        },

        edit:(id)=>{

            window.location =
                "add/borrower?id=" + id;

        },

        void:(id)=>{

            Swal.fire({

                icon:'warning',

                title:'Void Borrower?',

                text:'This action cannot be undone.',

                showCancelButton:true,

                confirmButtonText:'Yes, Void'

            }).then((result)=>{
                if(result.isConfirmed){
                    var payload = {
                        borrower_id:id
                    }
                    jsAddon.display.ajaxRequest({
                        type:'DELETE',
                        url: `${borrowerApi}`,
                        dataType:'json',
                        payload:JSON.stringify(payload)
                    })
                    .catch((xhr)=>{

                        let message =
                            "Unable to save borrower.";

                        if(xhr.status == 0){

                            message =
                                "Unable to connect to the server.";

                        }else if(xhr.status == 404){

                            message =
                                "Borrower API not found.";

                        }else if(xhr.status == 500){

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

                        console.error(
                            "Borrower Save Error",
                            xhr
                        );

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

                            title:'Borrower Voided',

                            text:response.message

                        }).then(()=>{

                            borrower.funx.get();

                        });
                     

                    });

                }

            });

        }

    }

};

$(document).ready(function(){

    borrower.init();

});