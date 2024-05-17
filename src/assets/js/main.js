$(window).on('load', function () {
    $('.ct_loader').fadeOut('slow', function () {
        $(this).remove();
    });
});

$(document).ready(function(){
    

    $(".ct_toggle_bar").click(function(){
        $(".c_main_div").addClass("ct_active")
    })
    $(".ct_close_btn").click(function(){
        $(".c_main_div").removeClass("ct_active")
    })
    $(".ct_customize_btn12").click(function(){
        $(".ct_bottom_customize").toggleClass('active')
    });

    $(".ct_share_main > i").click(function(){
$(".ct_animated_socials").toggleClass('active')
    });
    new DataTable('#example');
  
   
    $(window).load(function() {
        $('.ct_loader').remove();
        });
        

    $('.js-tilt').tilt({
        axis: y
    })
})

$(document).ready(function(){
    $('.ct_notification i').click(function(){
        $('.ct_notification_drop').toggleClass('show')
    })
})

$('.ct_custom_dropdown a').click(function(){
    $('.ct_custom_dropdown-menu').toggleClass('active')
})

jQuery(document).ready(function() {

    $(".chat-list a").click(function() {
        $(".chatbox").addClass('showbox');
        return false;
    });

    $(".chat-icon").click(function() {
        $(".chatbox").removeClass('showbox');
    });


});