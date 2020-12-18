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
            deleteUserEvent()
            editUserEvent()
        }
    })
}
function getUserBody(user) {
var body = `<tr>
                <th scope="row">${user.id}</th>
                <td>${user.username}</td>
                <td class="user-password">${user.password}</td>
                <td class="user-role">${user.role}</td>
                <td><a href="javascript:;" class="user-edit clr-success" data-user-id="${user.id}"">Düzenle</a></td>
                <td><a href="javascript:;" class="user-remove clr-danger" data-user-id="${user.id}"  data-user-username="${user.username}">Kaldır</a></td>
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
            <label>Username</label>
            <input type="text" id="usernameInput" class="form-control"/>
            <label>Password</label>
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
    $.ajax({
        type: "POST",
        url: "/members/signup",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            username: $('#usernameInput').val(),
            password: $('#passwordInput').val(),
            role: $('#roleSelect').val()
        }),
        success: function (user) {
            if(user){
                $('#userTable tbody').append(getUserBody(user))
                dkPopupElAddUser.closeDkPop()
            }else{
                alert("User cannot be inserted! Username could has been used.")
            }
        }
    })
}
/* Add User END*/
/* DELETE USER */
function deleteUserEvent() {
    $('.user-remove').click((e)=>{
        var userId = $(e.target).attr("data-user-id")
        var username = $(e.target).attr("data-user-username")
        dkPopupElDeleteUser = dkPopup({
            model: 'simple-confirm',
            title: 'Kullanıcı Ekle',
            type: 'confirm',
            confirmClick: function () {
                deleteUser(userId)
            },
            content: `@${username} kullanıcı adlı kullanıcıyı silmek istiyor musunuz?`,
            closeLabel: 'KAPAT',
            confirmLabel: 'ONAYLA'
        })
    })
}
function deleteUser(userId) {
    $.ajax({
        type: "DELETE",
        url: "/admin/Users/"+userId,
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        success: function () {
            $(`[data-user-id = "${userId}"]`).parent().parent().remove()
            $(`[data-owner-user-id = "${userId}"]`).remove()
            dkPopupElDeleteUser.closeDkPop()
        }
    })
}
/* DELETE USER END */
/* EDIT USER*/
function editUserEvent() {
    $('.user-edit').click((e)=>{
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
                        <input type="hidden" id="editUserId" value="${user.id}">
                        <label>Username
                            <input type="text" class="form-control disabled" disabled value="${user.username}"/>
                        </label>
                        <label>Password
                            <input type="text" class="form-control" id="editPassword"/>
                        </label>
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
    })
}
function editUser(e) {
    var userId = $('#editUserId').val()
    var password = $('#editPassword').val()
    var role = $('#editRole').val()

    $.ajax({
        type: "PUT",
        url: "/admin/Users",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            id: userId,
            password: password,
            role: role
        }),
        success: function (user) {
            var thEl = $(e.target).parent().parent()
            thEl.find('.user-password').html(user.password)
            thEl.find('.user-role').html(user.role)
            dkPopupElEditUser.closeDkPop()
        }
    })
}
/* EDIT USER END*/