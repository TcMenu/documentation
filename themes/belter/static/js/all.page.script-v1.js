
var header = null;
var navBarStartY;
var currentlyActiveMenu = null;
//var urlBase = "http://localhost:8080"; // TESTING
var urlBase = "https://www.thecoderscorner.com"; // PROD

document.getElementsByTagName("body")[0].addEventListener("load", initialisePage(), false);

function initialisePage() {

    checkForCookies();

    header = $(".topMenuArea");
    navBarStartY = header.position().top;
    window.onscroll = onScrollAction;

    $('#all-contact').click(function(event){
        showMailWindow();
        preventFormUse(false);

        $('#contactFormInner').submit(function(event) {
            sendEmail();
            event.preventDefault();
            event.stopPropagation();
        });

        event.stopPropagation();
        event.preventDefault();
    });


    $('.navbar-toggler').click(renderMobileMenu);

    $('.nav-item a.dropdown-toggle').click(function (event) {

        $('#mainMenu').addClass('loadingData');
        sendEmail();
        event.stopPropagation();
        event.preventDefault();

        var previousSelId = $(this).attr('id');

        $.get({
            url: '/categories',
            data: "",
            success: function (xml) {
                $('#mainMenu').html(xml).removeClass('loadingData');

                displayMenu($('#' + previousSelId));

                $('.nav-item a.dropdown-toggle').click(function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    displayMenu($(this));
                });
            }
        })
    });
}

function displayMenu(item) {
    var newlyActiveMenu = item.parentsUntil("ul.navbar-nav").last();

    if( ! newlyActiveMenu.is(currentlyActiveMenu)) {
        $('ul.navbar-nav > li > ul').hide();
        currentlyActiveMenu = newlyActiveMenu;
    }

    var menu = $(item).next('ul');
    adjustPosition(menu);
    menu.toggle();
}

function adjustPosition(ul) {
    var parent = ul.parent();
    var subPosition = parent.position();
    var subHeight = parent.height();
    ul.css({'left': subPosition.left, 'top': subPosition.top + subHeight});
}

// deal with cookie consent here.

function checkForCookies() {
    var ipCheckUrl = "https://freegeoip.net/json/?callback=?";
    if (document.cookie.indexOf("cookieok") < 0) {

        // now check if the user is in the EU, and if so pop up the cookie check
        $.getJSON(ipCheckUrl, function (ipData) {
            if (ipData.time_zone.indexOf("Europe") < 0) {
                $('#cookieConsent').hide();
                document.cookie = "cookieok=true; max-age=" + 60 * 60 * 24 * 700; // about 2 years
            }
        });

        // if the cookie form OK button is pressed, hide the form and record the button press.
        $('#cookieAccept').click(function () {
            setCookie("cookieok", "true");
            $('#cookieConsent').fadeOut();
        });
        $('#cookieConsent').fadeIn();

    }
}

// deal with menu rendering on mobile

function renderMobileMenu() {
    $('#mainMenu').toggleClass("collapse");
}

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';path=/;expires=' + expires.toUTCString();
}

function onScrollAction() {
    if($(".navbar-toggler").is(':hidden')) {
        // desktop keep nav in view.
        if (window.pageYOffset > navBarStartY) {
            var w = header.width();
            header.addClass("sticky");
            header.css("width", w);
        } else {
            header.removeClass("sticky");
        }
    }
}

function closeMailWindow() {
    $('#inlineContactForm').hide();
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
}

function showMailWindow() {
    $('#inlineContactForm').show().center();
}

function preventFormUse(shouldBeEnabled) {
    if(!shouldBeEnabled)
    {
        $(".emailError").remove();
        $('#contactFormStatus').hide();

    }
    $("#contactFormInner input").prop('disabled', shouldBeEnabled);}

function sendEmail() {

    $(".emailError").remove();
    let userName = $('#userName').val();
    let email = $('#emailAddr').val();
    let subject = $('#emailSubject').val();

    let error = false;

    if(userName.length < 1)
    {
        $('#userName').after("<div class='emailError'>User name must be entered</div>");
        error = true;
    }
    if(subject.length < 1)
    {
        $('#emailSubject').after("<div class='emailError'>Subject must be entered</div>");
        error = true;
    }
    if (email.length < 1) {
        $('#emailAddr').after('<div class="emailError">Email must be entered</div>');
        error = true;
    } else {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            $('#emailAddr').after('<div class="emailError">Invalid email address</div>');
            error = true;
        }
    }

    if(error) return;

    let serializedData = $('#contactFormInner').serialize();

    preventFormUse(true);

    $.ajax({
        type: "POST",
        url: urlBase + "/tcc/app/sendMessage",
        dataType: "json",
        data: serializedData,
        success: function (result) {
            if(result.mailSent) {
                preventFormUse(true);
                $('#contactFormStatus').show().text("Thank you for your mail.");
                $('#contactFormStatus').css("background-color", "green");
            }
            else {
                preventFormUse(false);
                $('#contactFormStatus').show().text(result.message);
                $('#contactFormStatus').css("background-color", "red");
            }
        },
        error: function (err) {
            preventFormUse(false);
            $('#contactFormStatus').show().text("Could not send mail");
            $('#contactFormStatus').css("background-color", "red");
        }
    });
}