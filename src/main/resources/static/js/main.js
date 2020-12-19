$('#darkModeCheck').change((e)=>{
    if ($('#darkModeCheck:checked').length > 0 ){
        $('body').addClass('dark-theme')
        setCookie("theme", "dark", 365)
    }else{
        $('body').removeClass('dark-theme')
        setCookie("theme", "light", 365)
    }
})

$(document).ready(()=>{
    if (!checkCookie("theme")){
        setCookie("theme", "dark", 365)
    }
    if(getCookie("theme") == "dark"){
        $('body').addClass('dark-theme')
    }else{
        $('body').removeClass('dark-theme')
        $('#darkModeCheck').removeAttr("checked")
    }
})

/* cookie functions */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    if(getCookie(cname))
        return true
    return false
}
/* cookie functions end */