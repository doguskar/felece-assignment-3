$(document).ready(()=>{
    getUsers()
    getTodos()
})
/* GET USERS */
function getUsers() {
    $.ajax({
        type: "GET",
        url: "/admin/Users",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        success: function (users) {
            console.log(users)
            var body = ''
            for(user of users){
                body += getUserBody(user)
            }
            $('#userTable tbody').html(body)

            $('.user-remove').click((e)=>{
                deleteUserEvent(e)
            })
            $('.user-edit').click((e)=>{
                editUserEvent(e)
            })
        }
    })
}
function getUserBody(user) {
var body = `<tr>
                <th scope="row">${user.id}</th>
                <td class="user-username">${user.username}</td>
                <td class="user-password">${user.password}</td>
                <td class="user-role">${user.role}</td>
                <td><a href="javascript:;" class="user-edit clr-success" data-user-id="${user.id}">Düzenle</a></td>
                <td><a href="javascript:;" class="user-remove clr-danger" data-user-id="${user.id}"  data-user-username="${user.username}">Sil</a></td>
            </tr>`
    return body;
}
/* GET USERS END*/
function getTodos() {
    if(qs["startDate"])
        $('#startDate').val(qs["startDate"])
    if(qs["endDate"])
        $('#endDate').val(qs["endDate"])
    $.ajax({
        type: "GET",
        url: "/admin/TodoItems" + `?startDate=${qs["startDate"]}&endDate=${qs["endDate"]}`,
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        success: function (todos) {
            console.log(todos)
            var body = ''
            for(todo of todos){
                body += `<tr data-owner-user-id="${todo.user_id}">
                    <th scope="row">${todo.id}</th>`
                if(todo.status == 'TODO')
                    body += `<td class="clr-purple">${todo.status}</td>`
                if(todo.status == 'DELAYED')
                    body += `<td class="clr-orange">${todo.status}</td>`
                if(todo.status == 'DONE')
                    body += `<td class="clr-primary">${todo.status}</td>`
                body += `<td>${todo.description}</td>
                    <td>${getDateStr(todo.fdate)}</td>
                    <td>${getDateStr(todo.createdDate)}</td>
                    <td>${todo.user_id}</td>
                </tr>`
            }
            $('#todosTable tbody').html(body)
        }
    })
}
/* Add User */
function addUserPopup() {
    var formBody = `
    <div class="container">
        <div class="form-group">
            <div id="register-warn"></div>
            <label>Kullanıcı Adı</label>
            <input type="text" id="usernameInput" class="form-control"/>
            <label>Parola</label>
            <input type="password" id="passwordInput" class="form-control"/>
            <label>Role</label>
            <select id="roleSelect" class="form-control">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>
        </div>
    </div>`
    dkPopupElAddUser = dkPopup({
        title: 'Kullanıcı Ekle',
        type: 'confirm',
        confirmClick: function () {
            submitAddUserForm()
        },
        content: formBody,
        closeLabel: 'KAPAT',
        confirmLabel: 'ONAYLA'
    })
}
function submitAddUserForm() {
    showLoading($(".dk-popup"))
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    $.ajax({
        type: "POST",
        url: "/admin/Users",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            username: $('#usernameInput').val(),
            password: $('#passwordInput').val(),
            role: $('#roleSelect').val()
        }),
        success: function (response) {
            console.log(response)
            if (response.signUpResponse.result){
                var user = response.user;
                if(user){
                    $('#userTable tbody').append(getUserBody(user))
                    $(`.user-edit[data-user-id = ${user.id}]`).click((e)=>{editUserEvent(e)})
                    $(`.user-remove[data-user-id = ${user.id}]`).click((e)=>{deleteUserEvent(e)})
                    insertUserWarn("Kullanıcı başarıyla eklendi.", "success")
                    setTimeout(dkPopupElAddUser.closeDkPop, 2000)
                }else{
                    insertUserWarn("Beklenmedik bir hata oluştu!", "danger")
                }
            }
            else if(response.signUpResponse.usernameUsed){
                insertUserWarn("Kullanıcı adı daha önce kullanılmış!", "danger")
            }
            else if(response.signUpResponse.notUsernameValid){
                insertUserWarn("Kullanıcı adı uygun değil!", "danger")
            }
            else if(response.signUpResponse.notPasswordValid){
                insertUserWarn("Parola uygun değil!", "danger")
            }else{
                insertUserWarn("Beklenmedik bir hata oluştu!", "danger")
            }

            removeLoading()
            confirmBtn.removeAttr('disabled').removeClass('disabled')
        }
    })
}
function insertUserWarn(str, type) {
    var body =`<div class="alert alert-${type}" role="alert">${str}</div>`
    $('#register-warn').html(body)
}
/* Add User END*/
/* DELETE USER */
function deleteUserEvent(e) {
    var userId = $(e.target).attr("data-user-id")
    var username = $(e.target).attr("data-user-username")
    dkPopupElDeleteUser = dkPopup({
        model: 'simple-confirm',
        title: 'Kullanıcı Ekle',
        type: 'confirm',
        confirmClick: function () {
            deleteUser(userId)
        },
        content: `<strong>@${username}</strong> kullanıcı adlı kullanıcıyı silmek istiyor musunuz? Kullanıcının todo'larıda silinecektir.`,
        closeLabel: 'KAPAT',
        confirmLabel: 'ONAYLA'
    })
}
function deleteUser(userId) {
    showLoading($(".dk-popup"))
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    $.ajax({
        type: "DELETE",
        url: "/admin/Users/"+userId,
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        success: function () {
            $(`[data-user-id = "${userId}"]`).parent().parent().remove()
            $(`[data-owner-user-id = "${userId}"]`).remove()
            removeLoading()
            confirmBtn.removeAttr('disabled').removeClass('disabled')
            dkPopupElDeleteUser.closeDkPop()
        }
    })
}
/* DELETE USER END */
/* EDIT USER*/
function editUserEvent(e) {
    var userId = $(e.target).attr("data-user-id")
    $.ajax({
        type: "GET",
        url: "/admin/Users/"+userId,
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        success: function (user) {
            var formBody =`
            <div class="container">
                <div class="form-group">
                    <div id="updateUserWarn"></div>
                    <input type="hidden" id="editUserId" value="${user.id}">
                    <label>Kullanıcı Adı</label>
                    <input type="text" class="form-control" id="editUsername" value="${user.username}"/>
                    <label>Parola</label>
                    <input type="text" class="form-control" id="editPassword" placeholder="Güncellemek istiyorsanız doldurun"/>
                    <label>Rol</label>
                    <select id="editRole" class="form-control">`
                if(user.role == 'USER')
                    formBody += `<option value="USER" selected>USER</option>`
                else
                    formBody += `<option value="USER">USER</option>`
                if(user.role == 'ADMIN')
                    formBody += `<option value="ADMIN" selected>ADMIN</option>`
                else
                    formBody += `<option value="ADMIN">ADMIN</option>`
            formBody +=`</select>
                </div>
            <div>
            `
            dkPopupElEditUser = dkPopup({
                title: 'Kullanıcı Düzenle',
                type: 'confirm',
                confirmClick: function () {
                    editUser(e)
                },
                content: formBody,
                closeLabel: 'KAPAT',
                confirmLabel: 'ONAYLA'
            })
        }
    })
}
function editUser(e) {
    var userId = $('#editUserId').val()
    var username = $('#editUsername').val()
    var password = $('#editPassword').val()
    var role = $('#editRole').val()

    showLoading($(".dk-popup"))
    var confirmBtn = $(".dk-popup a.pop-btn.primary")
    confirmBtn.attr('disabled', 'disabled').addClass('disabled')
    $.ajax({
        type: "PUT",
        url: "/admin/Users",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            id: userId,
            username: username,
            password: password,
            role: role
        }),
        success: function (response) {
            console.log(response)
            if (response.result){
                var user = response.user
                var thEl = $(e.target).parent().parent()
                thEl.find('.user-username').html(user.username)
                thEl.find('.user-password').html(user.password)
                thEl.find('.user-role').html(user.role)
                updateUserWarn("Kullanıcı başarıyla güncellendi.", "success")
                setTimeout(dkPopupElEditUser.closeDkPop, 2000)
            }
            else if(response.usernameUsed){
                updateUserWarn("Kullanıcı adı daha önce kullanılmış!", "danger")
            }
            else if(response.notUserIdValid){
                updateUserWarn("Kullanıcı bulunamadı!", "danger")
            }else{
                updateUserWarn("Beklenmedik bir hata oluştu!", "danger")
            }
            removeLoading()
            confirmBtn.removeAttr('disabled').removeClass('disabled')
        }
    })
}
function updateUserWarn(str, type) {
    var body =`<div class="alert alert-${type}" role="alert">${str}</div>`
    $('#updateUserWarn').html(body)
}
/* EDIT USER END*/