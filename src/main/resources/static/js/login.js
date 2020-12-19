/* Sign Up */
function signUpPopup() {
    var formBody = `
    <div class="container">
        <div class="form-group">
            <div id="register-warn"></div>
            <label>Kullanıcı Adı</label>
            <input type="text" id="usernameInput" class="form-control" required minlength="3" maxlength="100"/>
            <label>Parola</label>
            <input type="password" id="passwordInput" class="form-control" required minlength="6" maxlength="255"/>
        </div>
    </div>`
    dkPopupElSignUp = dkPopup({
        title: 'Kayıt Ol',
        type: 'confirm',
        confirmClick: function () {
            submitSignUpForm()
        },
        content: formBody,
        closeLabel: 'KAPAT',
        confirmLabel: 'ONAYLA'
    })
}
function submitSignUpForm() {
    showLoading($(".dk-popup"))
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    $.ajax({
        type: "POST",
        url: "/members/signup",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            username: $('#usernameInput').val(),
            password: $('#passwordInput').val()
        }),
        success: function (response) {
            if (response.result){
                signUpWarn("Başarıyla kayıt oldunuz.", "success")
                setTimeout(dkPopupElSignUp.closeDkPop, 2000)
            }
            else if(response.usernameUsed){
                signUpWarn("Kullanıcı adı daha önce kullanılmış!", "danger")
            }
            else if(response.notUsernameValid){
                signUpWarn("Kullanıcı adı uygun değil!", "danger")
            }
            else if(response.notPasswordValid){
                signUpWarn("Parola uygun değil!", "danger")
            }else{
                signUpWarn("Beklenmedik bir hata oluştu!", "danger")
            }
            removeLoading()
            confirmBtn.removeAttr('disabled').removeClass('disabled')
        }
    })
}
function signUpWarn(str, type) {
    var body =`<div class="alert alert-${type}" role="alert">${str}</div>`
    $('#register-warn').html(body)
}
/* Sign Up END*/

function showLoading(e) {
    body = `<div class="cover-content" id="loadingScreen"><div class="out-of-middle"><div class="middle"><div style="text-align:center"><div class="lds-ripple"><div></div><div></div></div></div></div></div></div>`
    e.append(body)
}
function removeLoading() {
    $('#loadingScreen').remove()
}