
// Auto Move
var userId,email,
otpFunction = {
    init:()=> {
        var userData = localStorage.getItem('userdata');

        if(userData != null){
            userData = JSON.parse(userData);
            userId = userData.userid;
            $("#email-data").text(userData.email)
        }
    },
    funx:{
        verify:(data)=>{
            $.ajax({
                url: validateOTPApi,
                type:"POST",
                data:data,
                dataType:"json",
                beforeSend:function(){

                    $(".verify-btn")
                        .prop("disabled",true)
                        .html(
                            '<span class="spinner-border spinner-border-sm"></span> Signing In...'
                        );

                },

                success:function(response){
                    console.log(response);
                    if(!response.isError){
                        localStorage.setItem('userdata',JSON.stringify(response.data))
                        localStorage.setItem('token',btoa(response.data.access_token))
                        window.location = "dashboard.php";
                    }else{

                        Swal.fire({
                            icon:'error',
                            title:'OTP Verification Failed',
                            text:response.message
                        });

                    }

                },

                complete:function(){

                    $(".verify-btn")
                        .prop("disabled",false)
                        .html(
                            '<i class="bi bi-box-arrow-in-right"></i> Login'
                        );

                },

                error:function(xhr, status, error){

                    let message = "An unexpected error occurred.";

                    if(xhr.status == 0){

                        message = "Unable to connect to the server.";

                    }else if(xhr.status == 404){

                        message = "Login service not found (404).";

                    }else if(xhr.status == 500){

                        message = "Internal server error (500).";

                    }else if(xhr.responseJSON &&
                            xhr.responseJSON.message){

                        message = xhr.responseJSON.message;

                    }else if(xhr.responseText){

                        message = xhr.responseText;

                    }

                    Swal.fire({
                        icon:"error",
                        title:"System Error",
                        text:message
                    });

                    console.error("AJAX Error:", {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: xhr.responseText
                    });

                },

                
                
                

            });
        }
    }

}

otpFunction.init();


$('.otp').on('input', function(){

    this.value = this.value.replace(/[^0-9]/g,'');

    if($(this).val().length == 1){
        $(this).next('.otp').focus();
    }

});

// Backspace

$('.otp').on('keydown', function(e){

    if(
        e.key === 'Backspace' &&
        $(this).val() === ''
    ){
        $(this).prev('.otp').focus();
    }

});

// Submit

$('#otp-form').submit(function(e){

    e.preventDefault();

    let otp = '';

    $('.otp').each(function(){
        otp += $(this).val();
    });

    if(otp.length != 6){

        Swal.fire({
            icon:'warning',
            title:'Incomplete OTP',
            text:'Please enter the complete OTP.'
        });

        return;
    }

    // Swal.fire({
    //     icon:'success',
    //     title:'Verification Successful',
    //     text:'Access granted.'
    // });

    otpFunction.funx.verify({
        otp:otp,
        userid:userId

    })

});

// Countdown

let countdown = 60;

let interval = setInterval(function(){

    countdown--;

    $('#timer').text(countdown);

    if(countdown <= 0){

        clearInterval(interval);

        $('#resendOtp')
            .removeClass('disabled')
            .text('Resend OTP');

    }

},1000);






