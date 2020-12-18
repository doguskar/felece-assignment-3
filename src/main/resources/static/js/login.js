/* Sign Up */
function signUpPopup() {
    var formBody = `
    <div class="container">
        <div class="form-group">
            <label>Username</label>
            <input type="text" id="usernameInput" class="form-control"/>
            <label>Password</label>
            <input type="password" id="passwordInput" class="form-control"/>
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
    $.ajax({
        type: "POST",
        url: "/members/signup",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            username: $('#usernameInput').val(),
            password: $('#passwordInput').val()
        }),
        success: function (user) {
            if (user){
                alert("Successfully registered!")
                dkPopupElSignUp.closeDkPop()
            }else{
                alert("Username could has been used.")
            }
        }
    })
}
/* Sign Up END*/