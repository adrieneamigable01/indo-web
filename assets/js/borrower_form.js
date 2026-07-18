var borrower_id = null;
borrowerForm = {
    init:()=>{

        borrowerForm.funx.restore();

        borrowerForm.funx.events();

        borrower_id =
        new URLSearchParams(
            window.location.search
        ).get('id');
    
        if(borrower_id){

            borrowerForm.funx.getById(
                borrower_id
            );

        }

    },

    funx:{
        add:(payload)=>{
            jsAddon.display.ajaxRequest({
                type:'POST',
                url: borrowerApi,
                dataType:'json',
                payload: payload,
                beforeSend:function(){

                    $("#btnSaveBorrower")
                    .prop("disabled",true)
                    .html(`
                        <span class="spinner-border spinner-border-sm"></span>
                        Saving Borrower...
                    `);

                }

            })
            .then((response)=>{

                console.log(response);

                if(response.isError){

                    Swal.fire({

                        icon:'error',

                        title:'Save Failed',

                        text:response.message

                    });

                    return;

                }

                Swal.fire({

                    icon:'success',

                    title:'Borrower Saved',

                    text:response.message

                }).then(()=>{

                   window.location =
                        `${baseurl}view/borrower?id=${borrower_id}`;

                });

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
            .finally(()=>{

                $("#btnSaveBorrower")
                .prop("disabled",false)
                .html(`
                    <i class="bi bi-check-circle"></i>
                    Save Borrower
                `);

            });

        },
        update:(payload)=>{

            jsAddon.display.ajaxRequest({
                type:'PUT',
                url:
                    borrowerApi,
                dataType:'json',
                payload:JSON.stringify(payload)
            })
            .then((response)=>{
                if(response.isError){
                    Swal.fire({

                        icon:'error',

                        title:'Update Failed',

                        text:response.message

                    });
                    return;
                }
                Swal.fire({

                    icon:'success',

                    title:'Borrower Updated',

                    text:response.message

                }).then(()=>{

                     window.location =
                        `${baseurl}view/borrower?id=${borrower_id}`;

                });
            });

        },
        getById:(id)=>{
            jsAddon.display.ajaxRequest({
                type:'GET',
                url: `${borrowerApi}?borrower_id=${id}`,
                dataType:'json'
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
               
                borrowerForm.funx.populate(
                    response.data
                );

            });

        },
        populate:(data)=>{
            data = data[0];
            $('#last_name')
                .val(data.last_name);

            $('#first_name')
                .val(data.first_name);

            $('#middle_name')
                .val(data.middle_name);

            $('#date_of_birth')
                .val(data.date_of_birth);

            $('#civil_status')
                .val(data.civil_status);

            $('#gender')
                .val(data.gender);

            $('#mobile_no')
                .val(data.mobile_no);

            $('#email_address')
                .val(data.email_address);

            $('#home_address')
                .val(data.home_address);

            $('#tin_no')
                .val(data.tin_no);

            $('#id_presented')
                .val(data.id_presented);

            $('#id_no')
                .val(data.id_no);

            $('#company_school')
                .val(data.company_school);

            $('#employer_name')
                .val(data.employer_name);

            $('#company_address')
                .val(data.company_address);

            $('#employment_date')
                .val(data.employment_date);

            $('#position_name')
                .val(data.position_name);

            $('#basic_salary')
                .val(data.basic_salary);

            $('#annual_income')
                .val(data.annual_income);

            $('#spouse_last_name')
                .val(data.spouse_last_name);

            $('#spouse_first_name')
                .val(data.spouse_first_name);

            $('#spouse_middle_name')
                .val(data.spouse_middle_name);

            $('#spouse_date_of_birth')
                .val(data.spouse_date_of_birth);

            $('#spouse_mobile_no')
                .val(data.spouse_mobile_no);

            $('#spouse_employer_name')
                .val(data.spouse_employer_name);

            $('#spouse_position_name')
                .val(data.spouse_position_name);

            $('#monthly_income')
                .val(data.monthly_income);

            $('#spouse_home_address')
                .val(data.spouse_home_address);
                
            $('#primary_card_name')
                .val(data.primary_card_name);
            $('#primary_card_number')
                .val(data.primary_card_number);
            $('#primary_card_expiry')
                .val(data.primary_card_expiry);
            $('#primary_card_expiry')
                .val(data.primary_card_expiry);
            $('#secondary_card_name')
                .val(data.secondary_card_name);
            $('#secondary_card_number')
                .val(data.secondary_card_number);
            $('#secondary_card_expiry')
                .val(data.secondary_card_expiry);

        },
        autoSave: () => {

            const payload = {

                last_name: $('#last_name').val(),
                first_name: $('#first_name').val(),
                middle_name: $('#middle_name').val(),
                date_of_birth: $('#date_of_birth').val(),
                civil_status: $('#civil_status').val(),
                gender: $('#gender').val(),
                mobile_no: $('#mobile_no').val(),
                email_address: $('#email_address').val(),
                home_address: $('#home_address').val(),

                tin_no: $('#tin_no').val(),
                id_presented: $('#id_presented').val(),
                id_no: $('#id_no').val(),

                company_school: $('#company_school').val(),
                employer_name: $('#employer_name').val(),
                company_address: $('#company_address').val(),
                employment_date: $('#employment_date').val(),
                position_name: $('#position_name').val(),
                basic_salary: $('#basic_salary').val(),
                annual_income: $('#annual_income').val(),

                spouse_last_name: $('#spouse_last_name').val(),
                spouse_first_name: $('#spouse_first_name').val(),
                spouse_middle_name: $('#spouse_middle_name').val(),
                spouse_date_of_birth: $('#spouse_date_of_birth').val(),
                spouse_mobile_no: $('#spouse_mobile_no').val(),
                spouse_employer_name: $('#spouse_employer_name').val(),
                spouse_position_name: $('#spouse_position_name').val(),
                monthly_income: $('#monthly_income').val(),
                spouse_home_address: $('#spouse_home_address').val(),
                
                primary_card_name: $('#primary_card_name').val(),
                primary_card_number: $('#primary_card_number').val(),
                primary_card_expiry: $('#primary_card_expiry').val(),
                secondary_card_name: $('#secondary_card_name').val(),
                secondary_card_number: $('#secondary_card_number').val(),
                secondary_card_expiry: $('#secondary_card_expiry').val()

            };

            localStorage.setItem(
                'borrowerFormDraft',
                JSON.stringify(payload)
            );

        },
        restore :() => {

            const draft =
                localStorage.getItem(
                    'borrowerFormDraft'
                );

            if(!draft) return;

            const data = JSON.parse(draft);

            Object.keys(data).forEach(key => {

                $('#' + key).val(data[key]);

            });

        },
        events:()=>{

            $('#borrowerForm')
            .on(
                'keyup change',
                'input, select, textarea',
                function(){
                    borrowerForm.funx.autoSave();

                }
            );

            $("#btnSaveBorrower")
            .click(function(){

                borrowerForm.funx.save();

            });

        },
    }

};

$(document).ready(function(){
    borrowerForm.init();
    let currentStep = 0;

    const steps =
        document.querySelectorAll('.form-step');

    const indicators =
        document.querySelectorAll('.step-item');

    function showStep(index){

        steps.forEach((step,i)=>{

            step.classList.remove('active');

            if(i === index){
                step.classList.add('active');
            }

        });

        indicators.forEach((item,i)=>{

            if(i <= index){
                item.classList.add('active');
            }else{
                item.classList.remove('active');
            }

        });

        if(index === 0){

            $('#btnPrev').hide();

        }else{

            $('#btnPrev').show();

        }

        if(index === steps.length - 1){

            $('#btnNext')
                .removeClass('btn-primary')
                .addClass('btn-success')
                .html(
                    '<i class="bi bi-check-circle"></i> Save Borrower'
                );

        }else{

            $('#btnNext')
                .removeClass('btn-success')
                .addClass('btn-primary')
                .html('Next');

        }

    }

    showStep(0);

    /* NEXT */

    $('#btnNext').click(function(){

        if(currentStep < steps.length - 1){

            currentStep++;

            showStep(currentStep);

            return;

        }

        saveBorrower();

    });

    /* PREVIOUS */

    $('#btnPrev').click(function(){

        if(currentStep > 0){

            currentStep--;

            showStep(currentStep);

        }

    });

    /* SAVE */

    function saveBorrower(){

        const payload = {

            last_name: $('#last_name').val(),
            first_name: $('#first_name').val(),
            middle_name: $('#middle_name').val(),

            date_of_birth: $('#date_of_birth').val(),
            civil_status: $('#civil_status').val(),
            gender: $('#gender').val(),

            mobile_no: $('#mobile_no').val(),
            email_address: $('#email_address').val(),
            home_address: $('#home_address').val(),

            tin_no: $('#tin_no').val(),
            id_presented: $('#id_presented').val(),
            id_no: $('#id_no').val(),

            company_school: $('#company_school').val(),
            employer_name: $('#employer_name').val(),
            company_address: $('#company_address').val(),
            employment_date: $('#employment_date').val(),
            position_name: $('#position_name').val(),
            basic_salary: $('#basic_salary').val(),
            annual_income: $('#annual_income').val(),

            spouse_last_name: $('#spouse_last_name').val(),
            spouse_first_name: $('#spouse_first_name').val(),
            spouse_middle_name: $('#spouse_middle_name').val(),
            spouse_date_of_birth: $('#spouse_date_of_birth').val(),
            spouse_mobile_no: $('#spouse_mobile_no').val(),
            spouse_employer_name: $('#spouse_employer_name').val(),
            spouse_position_name: $('#spouse_position_name').val(),
            monthly_income: $('#monthly_income').val(),
            spouse_home_address: $('#spouse_home_address').val()

        };

        // Only include collateral fields if they exist (Edit page)
        if ($('#primary_card_name').length) {

            payload.primary_card_name = $('#primary_card_name').val();
            payload.primary_card_number = $('#primary_card_number').val();
            payload.primary_card_expiry = $('#primary_card_expiry').val();

            payload.secondary_card_name = $('#secondary_card_name').val();
            payload.secondary_card_number = $('#secondary_card_number').val();
            payload.secondary_card_expiry = $('#secondary_card_expiry').val();

        }

        if (borrower_id) {

            payload.borrower_id = borrower_id;
            borrowerForm.funx.update(payload);

        } else {

            borrowerForm.funx.add(payload);

        }

    }

});