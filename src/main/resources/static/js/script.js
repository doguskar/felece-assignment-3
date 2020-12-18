$(".todo-input-container input").focus((e)=>{
    $(e.target).parent().addClass('active')
})
$(".todo-input-container input").blur((e)=>{
    $(e.target).parent().removeClass('active')
})
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

$(document).ready(()=>{
    fetchTodoItems()
    $("#todoInput").keypress((e)=>{
        if(e.which == 13){
            addTodoItem()
        }
    })
    $('#addTodo').click(()=>{
        addTodoItem()
    })

    $('#todoDate').val(new Date().toDateInputValue())
})
/* GET TODOS */
function fetchTodoItems() {
    if(qs["startDate"])
        $('#startDate').val(qs["startDate"])
    if(qs["endDate"])
        $('#endDate').val(qs["endDate"])
    $.ajax({
        type: "GET",
        url: "/TodoItems" +`?startDate=${qs["startDate"]}&endDate=${qs["endDate"]}`,
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        success: function (todos) {
            printTodos(todos)
        }
    })
}
function printTodos(todos) {
    for(todo of todos){
        if (todo.status == 'TODO')
            $('#todoContainer').append(getTodoBody(todo))
        else if (todo.status == 'DELAYED')
            $('#delayedContainer').append(getTodoBody(todo))
        else if (todo.status == 'DONE')
            $('#doneContainer').append(getTodoBody(todo))
    }
    changeClickEvent()
    delayedClickEvent()
    todoClickEvent()
    editClickEvent()
}
/* GET TODOS END*/

function refreshEvents() {
    $('.todo-item input').off('change', changeClickEvent())
    $('.todo-item-delayed').off('click', delayedClickEvent())
    $('.todo-item-todo').off('click', todoClickEvent())
    $('.todo-item-edit').off('click', editClickEvent())
    todoClickEvent()
    delayedClickEvent()
    changeClickEvent()
    editClickEvent()
}
/* TODO EDIT / DELETE */
function editClickEvent(){
    $('.todo-item-edit').click((e)=>{
        var todoItemEl = $(e.target).parent()
        var todoId = todoItemEl.find('input').first().attr('data-todo-id')
        console.log(todoId)
        $.ajax({
            type: "GET",
            url: "/TodoItems/"+todoId,
            headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
            contentType: "application/json",
            success: function (todo) {
                var dateSp = getDateStr(todo.date).split(' ')
                var date = dateSp[0]
                var time = dateSp[1]
                var formBody = `<div class="container">
                            <form id="editForm" method="post">
                            <div class="form-group">
                                <input type="hidden" id="todoIdEdit" class="form-control" value="${todo.id}">
                                <button class="todo-item-remove btn btn-danger float-right" data-todo-id="${todo.id}" type="button">SİL</button>
                                <br/><br/>
                                <label for="todoDescriptionEdit">Description</label>
                                <input type="text" id="todoDescriptionEdit" class="form-control" value="${todo.description}">
                                <label for="todoDateEdit">Date</label>
                                <input type="date" id="todoDateEdit" class="form-control" value="${date}">
                                <label for="todoTimeEdit">Time</label>
                                <input type="time" id="todoTimeEdit" class="form-control" value="${time}">
                                <label for="todoTimeEdit">Status</label>
                                <select id="todoStatusEdit" class="form-control" >`
                    if(todo.status == 'TODO')
                        formBody += `<option value="TODO" selected>TODO</option>`
                    else
                        formBody += `<option value="TODO">TODO</option>`
                    if(todo.status == 'DELAYED')
                        formBody += `<option value="DELAYED" selected>DELAYED</option>`
                    else
                        formBody += `<option value="DELAYED">DELAYED</option>`
                    if(todo.status == 'DONE')
                        formBody += `<option value="DONE" selected>DONE</option>`
                    else
                        formBody += `<option value="DONE">DONE</option>`
                formBody +=    `</select>
                            </div>
                            </form>
                        </div>`
                dkPopupEditEl = dkPopup({
                    title: 'DÜZENLE',
                    type: 'confirm',
                    confirmClick: function () {
                        submitEditForm()
                    },
                    content: formBody,
                    closeLabel: 'KAPAT',
                    confirmLabel: 'KAYDET'
                })
                removeBtnEvent()
            }
        })
    })
}
function removeBtnEvent(){
    $('.todo-item-remove').click((e)=>{
        var todoId = $(e.target).attr('data-todo-id')
        $.ajax({
            type: "DELETE",
            url: "/TodoItems/"+todoId,
            headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
            contentType: "application/json",
            success: function (i) {
                $(`input[data-todo-id = "${todoId}"]`).parent().parent().remove()
                dkPopupEditEl.closeDkPop()
            }
        })
    })
}
function submitEditForm() {
    $.ajax({
        type: "PUT",
        url: "/TodoItems",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            id: $('#todoIdEdit').val(),
            description: $('#todoDescriptionEdit').val(),
            date: $('#todoDateEdit').val(),
            time: $('#todoTimeEdit').val(),
            status: $('#todoStatusEdit').val(),
        }),
        success: function (todo) {
            $(`[data-todo-id=${$('#todoIdEdit').val()}]`).parent().parent().remove()
            if (todo.status == 'TODO')
                $('#todoContainer').prepend(getTodoBody(todo))
            else if (todo.status == 'DELAYED')
                $('#delayedContainer').prepend(getTodoBody(todo))
            else if (todo.status == 'DONE')
                $('#doneContainer').prepend(getTodoBody(todo))
            refreshEvents()
            dkPopupEditEl.closeDkPop()
        },
        error: function () {
        }
    })
}
/* TODO EDIT / DELETE END */

function getTodoBody(todo) {
    var body = ''
    if(todo.status == 'DONE')
        body += `<div class="todo-item done">`
    else
        body += `<div class="todo-item">`
    body +=         `<label>`
    if(todo.status == 'DONE')
        body +=         `<input type="checkbox" data-status="${todo.status}" data-todo-id="${todo.id}" checked>`
    else
        body +=         `<input type="checkbox" data-status="${todo.status}" data-todo-id="${todo.id}">`
	body +=             `<span>${todo.description}</span>
                         <span> | </span>
                         <span class="todo-date">${getDateStr(todo.date)}</span>
                    </label>`

    if(todo.status == 'TODO')
        body +=     `<button class="todo-item-delayed">ERTELE</button>
                     <button class="todo-item-edit">DÜZENLE</button>`
    else if(todo.status == 'DELAYED')
        body +=     `<button class="todo-item-todo">YAPILACAK</button>
                     <button class="todo-item-edit">DÜZENLE</button>`

    body +=     `</div>`
    return body;
}
function addTodoItem(){
    if (!$('#todoInput').val())
        return
    $.ajax({
        type: "POST",
        url: "/TodoItems",
        headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
        contentType: "application/json",
        data: JSON.stringify({
            description: $('#todoInput').val(),
            date: $('#todoDate').val(),
            time: $('#todoTime').val()
        }),
        success: function (todo) {
            $('#todoContainer').prepend(getTodoBody(todo))
            $('#todoInput').val("")
            refreshEvents()
        },
        error: function () {
        }
    })
}
function changeClickEvent(){
    $('.todo-item input').change((e)=>{
        var status = $(e.target).attr("data-status")
        if(status == 'TODO' || status == 'DELAYED')
            status = 'DONE'
        else
            status = 'TODO'
        var todoId = $(e.target).attr("data-todo-id")
        $.ajax({
            type: "PUT",
            url: "/TodoItems",
            headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
            contentType: "application/json",
            data: JSON.stringify({
                status: status,
                id: todoId
            }),
            success: function (todo) {
                if (todo.status == 'TODO')
                    $('#todoContainer').prepend(getTodoBody(todo))
                else if(todo.status == 'DONE')
                    $('#doneContainer').prepend(getTodoBody(todo))

                $(e.target).parent().parent().remove()
                refreshEvents()
            }
        })
    })
}
function delayedClickEvent(){
    $('.todo-item-delayed').click((e)=>{
        var todoId = $(e.target).parent().find('input').first().attr('data-todo-id')
        $.ajax({
            type: "PUT",
            url: "/TodoItems",
            headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
            contentType: "application/json",
            data: JSON.stringify({
                status: 'DELAYED',
                id: todoId
            }),
            success: function (todo) {
                $('#delayedContainer').prepend(getTodoBody(todo))
                $(e.target).parent().remove()
                refreshEvents()
            }
        })
    })
}
function todoClickEvent(){
    $('.todo-item-todo').click((e)=>{
        var todoId = $(e.target).parent().find('input').first().attr('data-todo-id')
        $.ajax({
            type: "PUT",
            url: "/TodoItems",
            headers: {"X-CSRF-TOKEN": $("input[name='_csrf']").val()},
            contentType: "application/json",
            data: JSON.stringify({
                status: 'TODO',
                id: todoId
            }),
            success: function (todo) {
                $('#todoContainer').prepend(getTodoBody(todo))
                $(e.target).parent().remove()
                refreshEvents()
            }
        })
    })
}

/*FILTER*/
$('#filterBtn').click(()=>{
    var startDate = $('#startDate').val()
    var endDate = $('#endDate').val()
    window.history.replaceState(null, null, window.location.pathname);
    location.href = location.href + `?startDate=${startDate}&endDate=${endDate}`
})
/*FILTER END*/

/* EXTRAS */

function getDateStr(millisecond){
    var date = new Date(millisecond)
    var dateStr =
        date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2)
    return dateStr
}

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));
/* EXTRAS END*/