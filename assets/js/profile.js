
var profile = {
    user:null,
    cropper:null,
    selectedProfileImage:null,
    init:()=>{

        profile.funx.load();

        profile.funx.events();

    },

    funx:{

        load:()=>{

            let userData = localStorage.getItem("userdata");

            if(!userData){

                Swal.fire({

                    icon:"error",

                    title:"Session Expired",

                    text:"Unable to load user information."

                }).then(()=>{

                    window.location = `${baseurl}login`;

                });

                return;

            }

            userData = JSON.parse(userData);

            jsAddon.display.ajaxRequest({

                url:userGetProfileApi,

                type:"GET",

                payload:{

                    userid:userData.userid

                },

                dataType:"json"

            }).then(function(response){

                if(response.isError){

                    Swal.fire({

                        icon:"error",

                        title:"Error",

                        text:response.message

                    });

                    return;

                }

                // Store the latest user information
                profile.user = response.data;

                // Update localStorage
                localStorage.setItem(
                    "userdata",
                    JSON.stringify(response.data)
                );

                // Populate the page
                profile.funx.populate(response.data);

                // Load activity logs
                profile.funx.loadLogs();

            });

        },

        populate:(data)=>{

            // Profile Image
            const defaultImage = "https://api.dicebear.com/9.x/personas/svg?seed=default";

            $("#profile_image").attr(
                "src",
                data.user_image
                    ? `${url}${data.user_image}`
                    : defaultImage
            );
            profile.user = data;
            // Header
            $("#full_name").text(
                `${data.firstname} ${data.lastname}`
            );

            $("#role").text(data.role);


            // Left Card - Account Information
            $("#account_userid").text(data.userid);

            $("#account_role").text(data.role);

            $("#account_usertype").text(data.usertype);

            $("#account_status")
                .removeClass("bg-success bg-danger")
                .addClass(
                    data.is_active == "1"
                        ? "bg-success"
                        : "bg-danger"
                )
                .text(
                    data.is_active == "1"
                        ? "Active"
                        : "Inactive"
                );

            $("#date_added").text(
                profile.funx.formatDateTime(
                    data.date_added
                )
            );

            // Editable Personal Information
            $("#firstname").val(data.firstname);

            $("#middlename").val(data.middlename);

            $("#lastname").val(data.lastname);

            // Keep YYYY-MM-DD for <input type="date">
            $("#birthdate").val(data.birthdate);

            $("#mobile_number").val(data.mobile_number);

            $("#email").val(data.email);
            $("#email-address").text(data.email);
            $("#mobile-number").text(data.mobile_number);
            $("#last_password_update").val(data.last_password_update);

        },

        update:()=>{

            const payload = {

                userid: profile.user.userid,

                firstname: $("#firstname").val(),

                middlename: $("#middlename").val(),

                lastname: $("#lastname").val(),

                birthdate: $("#birthdate").val(),

                mobile_number: $("#mobile_number").val(),

                email: $("#email").val()

            };

            jsAddon.display.ajaxRequest({

                type: "PUT",

                url: updateUserProfileApi,

                payload: JSON.stringify(payload),

                contentType: "application/json",

                dataType: "json"

            })
            .then((response)=>{

                if(response.isError){

                    Swal.fire({

                        icon: "error",

                        title: "Update Failed",

                        text: response.message

                    });

                    return;

                }

                profile.user = response.data;

                localStorage.setItem(
                    "userdata",
                    JSON.stringify(response.data)
                );

                profile.funx.populate(response.data);

                Swal.fire({

                    icon: "success",

                    title: "Profile Updated",

                    text: response.message

                });

            });

        },

        formatDate:(date)=>{

            if(!date)
                return "";

            return moment(date)
                .format("MMMM DD, YYYY");

        },

        formatDateTime:(date)=>{

            if(!date)
                return "";

            return moment(date)
                .format("MMMM DD, YYYY hh:mm A");

        },

        sendOTP: function () {

            const userData = JSON.parse(localStorage.getItem("userdata"));

            $("#btnSendOTP")
                .prop("disabled", true)
                .html('<span class="spinner-border spinner-border-sm me-1"></span> Sending...');

            jsAddon.display.ajaxRequest({

                url: userSendOTPApi,

                type: "POST",

                payload: {

                    userid: userData.userid,

                    request_type: "change_user_password"

                },

                dataType: "json"

            }).then(function (response) {

                $("#btnSendOTP")
                    .prop("disabled", false)
                    .text("Resend OTP");

                if(response.isError){

                    Swal.showValidationMessage(response.message);

                    return;
                }

                $("#otpMessage")
                    .removeClass("d-none")
                    .html(`
                        <div class="alert alert-success py-2 mb-0">
                            <i class="bi bi-check-circle-fill me-1"></i>
                            OTP has been sent to your registered email.
                        </div>
                    `);

            }).catch(function () {

                 $("#btnSendOTP")
                    .prop("disabled", false)
                    .html("Send OTP");

                $("#otpMessage").html(`
                    <div class="alert alert-danger py-2 mb-0">
                        <i class="bi bi-exclamation-triangle-fill me-1"></i>
                        Unable to process your request. Please try again.
                    </div>
                `);

            });

        },
        changePassword: function (payload) {

            return jsAddon.display.ajaxRequest({

                url: userChangePasswordApi,

                type: "POST",

                payload: payload,

                dataType: "json"

            }).then(function (response) {

                if (response.isError) {

                    Swal.showValidationMessage(response.message);

                    return false;
                }

                return response;

            }).catch(function (xhr) {

                let message = "Unable to change password.";

                if (xhr.responseJSON && xhr.responseJSON.message) {
                    message = xhr.responseJSON.message;
                }

                Swal.showValidationMessage(message);

                return false;

            });

        },
        
        events:()=>{

            $("#btnEditProfile")
            .click(function(){

                Swal.fire({

                    icon:"info",

                    title:"Coming Soon",

                    text:"Profile editing will be available soon."

                });

            });

            $("#btnChangePassword").click(function () {

                Swal.fire({

                    title: "Change Password",

                    width: 550,

                    html: `

                        <div class="text-start">

                            <div class="mb-3">

                                <label class="form-label fw-semibold">
                                    Old Password
                                </label>

                                <input
                                    type="password"
                                    id="swalOldPassword"
                                    class="form-control"
                                    placeholder="Enter your current password">

                            </div>

                            <div class="mb-3">

                                <label class="form-label fw-semibold">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    id="swalNewPassword"
                                    class="form-control"
                                    placeholder="Enter your new password">

                            </div>

                            <div class="mb-3">

                                <label class="form-label fw-semibold">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    id="swalConfirmPassword"
                                    class="form-control"
                                    placeholder="Confirm your new password">

                            </div>

                            <div class="mb-0">

                                <label class="form-label fw-semibold">
                                    One-Time Password (OTP)
                                </label>

                                <div class="input-group">

                                    <input
                                        type="text"
                                        id="swalOTP"
                                        class="form-control"
                                        placeholder="Enter OTP">

                                    <button
                                        class="btn btn-outline-primary"
                                        type="button"
                                        id="btnSendOTP">

                                        Send OTP

                                    </button>

                                </div>

                                <div class="form-text">
                                    An OTP will be sent to your registered email.
                                </div>
                                <div id="otpMessage" class="mt-2 d-none"></div>
                            </div>

                        </div>

                    `,

                    focusConfirm: false,

                    showCancelButton: true,

                    confirmButtonText: "Change Password",

                    cancelButtonText: "Cancel",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading(),
                    didOpen: () => {

                        $("#btnSendOTP").on("click", function () {

                            profile.funx.sendOTP();

                        });

                    },
                   preConfirm: () => {

                        const oldPassword = $("#swalOldPassword").val().trim();
                        const newPassword = $("#swalNewPassword").val().trim();
                        const confirmPassword = $("#swalConfirmPassword").val().trim();
                        const otp = $("#swalOTP").val().trim();

                        // Client-side validation
                        if (!oldPassword) {
                            Swal.showValidationMessage("Old password is required.");
                            return false;
                        }

                        if (!newPassword) {
                            Swal.showValidationMessage("New password is required.");
                            return false;
                        }

                        if (newPassword.length < 8) {
                            Swal.showValidationMessage("New password must be at least 8 characters.");
                            return false;
                        }

                        if (confirmPassword !== newPassword) {
                            Swal.showValidationMessage("Passwords do not match.");
                            return false;
                        }

                        if (!otp) {
                            Swal.showValidationMessage("OTP is required.");
                            return false;
                        }

                        return profile.funx.changePassword({
                            userid: profile.user.userid,
                            old_password: oldPassword,
                            new_password: newPassword,
                            confirm_password: confirmPassword,
                            otp: otp
                        });

                    }


                }).then((result) => {

                    if (result.isConfirmed && result.value) {

                        Swal.fire({

                            icon: "success",

                            title: "Password Changed",

                            text: result.value.message,

                            confirmButtonText: "OK"

                        });

                    }

                });

            });

            $("#btnEditPhoto").on("click", function () {

                Swal.fire({

                    title: "Change Profile Photo",

                    text: "Choose how you'd like to add a photo.",

                    icon: "question",

                    showCancelButton: true,

                    confirmButtonText: "📷 Camera",

                    cancelButtonText: "🖼️ Gallery",

                    reverseButtons: true

                }).then((result) => {

                    if (result.isConfirmed) {

                        $("#cameraInput").trigger("click");

                    } else if (result.dismiss === Swal.DismissReason.cancel) {

                        $("#galleryInput").trigger("click");

                    }

                });

            });

        },
        formatAuditData:function(data, mode){

            if(!data){
                return "-";
            }

            try{

                let obj = JSON.parse(data);

                while(typeof obj === "string"){
                    obj = JSON.parse(obj);
                }

                if(obj == null){
                    return "-";
                }

                let html = "";

                $.each(obj,function(key,value){

                    if(
                        value &&
                        typeof value === "object" &&
                        value.old !== undefined &&
                        value.new !== undefined
                    ){

                        html += `
                            <div>
                                <strong>${key}</strong>: ${value[mode]}
                            </div>
                        `;

                    }else{

                        html += `
                            <div>
                                <strong>${key}</strong>: ${value}
                            </div>
                        `;

                    }

                });

                return html;

            }catch(e){

                console.error(e);

                return "-";

            }

        },
        loadLogs:function(){

            if(profile.table){

                profile.table.destroy();

            }

            profile.table =

            $("#tblActivityLogs")

            .DataTable({

                processing:true,

                serverSide:true,

                destroy:true,

                responsive:true,

                searching:true,

                ordering:true,

                pageLength:10,

                order:[[0,"desc"]],

                ajax:function(data, callback){

                    jsAddon.display.ajaxRequest({

                        url:userGetLogsApi,

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
                                data.search.value,

                            userid:
                                profile.user.userid

                        },

                        dataType:"json"

                    }).then(function(response){

                        profile.logs = {};

                        $.each(response.data,function(_,row){

                            profile.logs[row.audit_log_id] = row;

                        });

                        callback({

                            draw:response.draw,

                            recordsTotal:response.recordsTotal,

                            recordsFiltered:response.recordsFiltered,

                            data:response.data

                        });

                    });

                },

                columns:[

                    {

                        data:"created_at",

                        render:function(data){

                            return profile.funx.formatDateTime(data);

                        }

                    },

                    {

                        data:"action",

                        render:function(data){

                            let badge = "secondary";

                            switch(data){

                                case "LOGIN_SUCCESS":
                                    badge = "success";
                                    break;

                                case "LOGIN_FAILED":
                                    badge = "danger";
                                    break;

                                case "SEND_OTP":
                                    badge = "warning";
                                    break;

                                case "VERIFY_OTP_FAILED":
                                    badge = "danger";
                                    break;

                                case "UPDATE":
                                    badge = "primary";
                                    break;

                                case "IMPORT":
                                    badge = "info";
                                    break;

                                case "CREATE":
                                case "INSERT":
                                    badge = "success";
                                    break;

                                case "DELETE":
                                    badge = "danger";
                                    break;

                            }

                            return `
                                <span class="badge bg-${badge}">
                                    ${data.replaceAll("_"," ")}
                                </span>
                            `;

                        }

                    },

                    {

                        data:"remarks"

                    },

                    {

                        data:"old_data",

                        orderable:false,

                        searchable:false,

                        render:function(data){

                            return profile.funx.formatAuditData(data,"old");

                        }

                    },

                ]

            });

        },
        updateProfileImage:function(){

            if(!profile.selectedProfileImage){

                Swal.fire(
                    "Warning",
                    "Please select and crop an image first.",
                    "warning"
                );

                return;

            }

            let formData = new FormData();

            formData.append(
                "userid",
                profile.user.userid
            );

            formData.append(
                "profile_image",
                profile.selectedProfileImage,
                "profile.jpg"
            );

            jsAddon.display.ajaxUpload({

                url:updateUserProfileImageApi,

                type:"POST",

                payload:formData,

                processData:false,

                contentType:false,

                dataType:"json"

            }).then(function(response){

                if(response.isError){

                    Swal.fire(
                        "Error",
                        response.message,
                        "error"
                    );

                    return;

                }

                Swal.fire(
                    "Success",
                    response.message,
                    "success"
                );

                $("#profile_image").attr(
                    "src",
                    response.image + "?t=" + Date.now()
                );

                profile.user.user_image = response.user_image;

                localStorage.setItem(
                    "userdata",
                    JSON.stringify(profile.user)
                );

                // Clear the selected image after successful upload
                profile.selectedProfileImage = null;

                // Hide the upload button again
                $("#btnUploadPhoto").addClass("d-none");
                profile.funx.load();

            });

        },

    }

};

$(document).ready(function(){

    profile.init();

$("#btnUploadPhoto").click(function (e) {

    e.preventDefault();

    if (!profile.selectedProfileImage) {

        Swal.fire({
            icon: "warning",
            title: "No Image Selected",
            text: "Please select and crop a profile photo first."
        });

        return;
    }

    Swal.fire({

        icon: "question",

        title: "Upload Profile Photo?",

        text: "Are you sure you want to update your profile photo?",

        showCancelButton: true,

        confirmButtonColor: "#198754",

        cancelButtonColor: "#6c757d",

        confirmButtonText: '<i class="bi bi-upload"></i> Yes, Upload',

        cancelButtonText: "Cancel",

        reverseButtons: true

    }).then((result) => {

        if (result.isConfirmed) {

            profile.funx.updateProfileImage();

        }

    });

});

$("#user_image").change(function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        $("#profile_image").attr(
            "src",
            e.target.result
        );

    };

    reader.readAsDataURL(file);

});

$("#btnUpdateProfile").click(function(){
    if(!$("#frmProfile").valid()){
        return;
    }

    Swal.fire({

        icon:"question",

        title:"Update Profile?",

        text:"Are you sure you want to save the changes?",

        showCancelButton:true,

        confirmButtonColor:"#198754",

        cancelButtonColor:"#6c757d",

        confirmButtonText:"Yes, Save",

        cancelButtonText:"Cancel"

    }).then((result)=>{

        if(result.isConfirmed){

            profile.funx.update();

        }

    });

});

$("#frmProfile").validate({

    rules:{

        firstname:{
            required:true
        },

        lastname:{
            required:true
        },

        birthdate:{
            required:true
        },

        mobile_number:{
            required:true,
            minlength:11,
            maxlength:15,
            digits:true
        },

        email:{
            required:true,
            email:true
        }

    },

    messages:{

        firstname:{
            required:"First name is required."
        },

        lastname:{
            required:"Last name is required."
        },

        birthdate:{
            required:"Birthdate is required."
        },

        mobile_number:{
            required:"Mobile number is required.",
            minlength:"Mobile number must be 11 digits.",
            maxlength:"Mobile number must be 11 digits.",
            digits:"Only numbers are allowed."
        },

        email:{
            required:"Email address is required.",
            email:"Please enter a valid email address."
        }

    },

    errorElement:"div",

    errorClass:"invalid-feedback",

    highlight:function(element){

        $(element).addClass("is-invalid");

    },

    unhighlight:function(element){

        $(element).removeClass("is-invalid");

    },

    errorPlacement:function(error, element){

        error.insertAfter(element);

    }

});

$("#cameraInput, #galleryInput").on("change", function () {

    const file = this.files[0];

    if(!file){
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        $("#cropImage").attr("src", e.target.result);

        const modal = new bootstrap.Modal(
            document.getElementById("cropModal")
        );

        modal.show();

    };

    reader.readAsDataURL(file);

});
$("#cropModal").on("shown.bs.modal", function(){

    if(profile.cropper){

        profile.cropper.destroy();

    }

    profile.cropper = new Cropper(

        document.getElementById("cropImage"),

        {

            aspectRatio:1,

            viewMode:1,

            autoCropArea:1,

            movable:true,

            zoomable:true,

            scalable:false,

            rotatable:false,

            responsive:true

        }

    );

});

$("#cropModal").on("hidden.bs.modal", function(){

    if(profile.cropper){

        profile.cropper.destroy();

        profile.cropper = null;

    }

});
$("#btnCropSave").click(function(){

    const canvas = profile.cropper.getCroppedCanvas({

        width:500,

        height:500

    });

    canvas.toBlob(function(blob){

        profile.selectedProfileImage = blob;

        const preview = URL.createObjectURL(blob);

        $("#profile_image").attr("src", preview);
        console.log("Crop completed");
        // Show upload button
        $("#btnUploadPhoto").removeClass("d-none");

        bootstrap.Modal
            .getInstance(document.getElementById("cropModal"))
            .hide();

    }, "image/jpeg", 0.9);

});
});