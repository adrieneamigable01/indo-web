const dashboardMain = {

    user: null,

    init: function(){

        dashboardMain.funx.loadUser();

    },

    funx: {

        loadUser: function(){

            let userData = localStorage.getItem("userdata");

            if(!userData){

                window.location = `${baseurl}login`;

                return;

            }

            dashboardMain.user = JSON.parse(userData);

            dashboardMain.funx.renderNavbar();

        },

        renderNavbar:function(){

            const defaultImage = `${baseurl}assets/images/user-image.jpg`;

            const image = dashboardMain.user.user_image
                ? `${url}${dashboardMain.user.user_image}`
                : defaultImage;
        
            const fullName = [
                dashboardMain.user.firstname,
                dashboardMain.user.lastname
            ]
            .filter(Boolean)
            .join(" ");

            $("#navProfileImage, #navProfileImageLarge")
                .attr("src", image)
                .on("error", function(){

                    $(this).attr("src", defaultImage);

                });

            $("#navFullName, #navFullNameLarge").text(fullName);

            $("#navRole, #navRoleLarge").text(
                dashboardMain.user.role
            );

        },

        refreshUser: function(){

            jsAddon.display.ajaxRequest({

                url: userGetProfileApi,

                type: "GET",

                payload:{

                    userid: dashboardMain.user.userid

                },

                dataType:"json"

            }).then(function(response){

                if(response.isError){

                    return;

                }

                dashboardMain.user = response.data;

                localStorage.setItem(

                    "userdata",

                    JSON.stringify(response.data)

                );

                dashboardMain.funx.renderNavbar();

            });

        }

    }

};

$(function(){

    dashboardMain.init();

});