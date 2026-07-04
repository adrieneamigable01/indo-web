
const password =
document.getElementById('password');

login = {
    init:()=> {

    },
    funx:{
        login:(form)=>{
            $.ajax({
                url: loginApi,
                type:"POST",
                data:$(form).serialize(),
                dataType:"json",
                beforeSend:function(){

                    $(".btn-login")
                        .prop("disabled",true)
                        .html(
                            '<span class="spinner-border spinner-border-sm"></span> Signing In...'
                        );

                },

                success:function(response){
                    console.log(response);
                    if(!response.isError){
                        if( response.message.includes("OTP Send to your") ){
                            localStorage.setItem('userdata',JSON.stringify(response.data))
                            window.location = "otp_page.php";
                        }
                    }else{

                        Swal.fire({
                            icon:'error',
                            title:'Login Failed',
                            text:response.message
                        });

                    }

                },

                complete:function(){

                    $(".btn-login")
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


$(document).ready(function(){

    $("#login-form").validate({

        rules:{
            email:{
                required:true,
                minlength:10
            },

            password:{
                required:true,
                minlength:6
            },

            branch:{
                required:true
            }
        },

        messages:{
            email:{
                required:"Please enter your email.",
                minlength:"Email must be at least 10 characters."
            },

            password:{
                required:"Please enter your password.",
                minlength:"Password must be at least 6 characters."
            },

            branch:{
                required:"Please select a branch."
            }
        },

        errorElement:"span",

        errorPlacement:function(error, element){
            error.addClass("error");
            error.insertAfter(element);
        },

        highlight:function(element){
            $(element)
                .addClass("is-invalid")
                .removeClass("is-valid");
        },

        unhighlight:function(element){
            $(element)
                .removeClass("is-invalid")
                .addClass("is-valid");
        },

        submitHandler:function(form){
            login.funx.login(form);
        }

    });

});

const toggle =
document.getElementById('togglePassword');

toggle.addEventListener('click', function(){

    if(password.type === 'password')
    {
        password.type = 'text';

        this.classList.remove('bi-eye');
        this.classList.add('bi-eye-slash');
    }
    else
    {
        password.type = 'password';

        this.classList.remove('bi-eye-slash');
        this.classList.add('bi-eye');
    }

});

function updateClock()
{
    const now = new Date();

    document.getElementById('currentDate')
        .innerHTML =
        now.toLocaleDateString();

    document.getElementById('currentTime')
        .innerHTML =
        now.toLocaleTimeString();
}

setInterval(updateClock,1000);
updateClock();