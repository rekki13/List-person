var users = [
    {
        id: 1,
        name: "Bob Bob",
        position: "Web developer",
        email: "indigo@gmail.com",
        phone: "+38012312312"
    },
    {
        id: 2,
        name: "Harry Harry",
        position: "Web developer",
        email: "indigo@gmail.com",
        phone: "+1231231232"
    }
];

$.each(users, function(i, user) {
    appendToUsrTable(user);
});

$("form").submit(function(e) {
    e.preventDefault();
});

$("form#addUser").submit(function() {
    var user = {};
    var nameInput = $('input[name="name"]').val().trim();
    var positionInput = $('input[name="position"]').val().trim();
    var emailInput = $('input[name="email"]').val().trim();
    var phoneInput = $('input[name="phone"]').val().trim();

    if (nameInput && positionInput && emailInput && phoneInput) {
        $(this).serializeArray().map(function(data) {
            user[data.name] = data.value;
        });
        var lastUser = users[Object.keys(users).sort().pop()];
        user.id = lastUser.id + 1;

        addUser(user);
    } else {
        alert("Заполните все поля.");
    }
});

function addUser(user) {
    users.push(user);
    appendToUsrTable(user);

    $(document).ready(function(){
        $('input').val('');
    });
}

function editUser(id) {
    users.forEach(function(user, i) {
        if (user.id == id) {
            $(".modal-body").empty().append(`
                <form id="updateUser" action="">
                    <label for="name">Фамилия Имя</label>
                    <input class="form-control" type="text" name="name" value="${user.name}" pattern="[A-Za-zА-Яа-яЁё].*[ ].*[A-Za-zА-Яа-яЁё]" required>
                    <label for="position">Должность</label>
                    <input class="form-control" type="text" name="position" value="${user.position}" pattern="[A-Za-zА-Яа-яЁё]{5,}" required/>
                    <label for="email">Email</label>
                    <input class="form-control" type="text" name="email" value="${user.email}" required/>
                    <label for="phone">Телефон</label>
                    <input class="form-control" type="text" name="phone" value="${user.phone}" onkeyup="this.value = this.value.replace(/[^\d]/g,'');" required pattern="[0-9]{12}" maxlength="12"/>
            `);
            $(".modal-footer").empty().append(`
                    <button type="button" type="submit" class="btn btn-primary" onClick="updateUser(${id})">Сохранить</button>
                    <button type="button" class="btn btn-default text-white" data-dismiss="modal">Отменить</button>
                </form>
            `);
        }
    });
}

function deleteUser(id) {
    var action = confirm("Вы уверены что хотите удалить пользователя?");
    var msg = "Пользователь удален";
    users.forEach(function(user, i) {
        if (user.id == id && action != false) {
            users.splice(i, 1);
            $("#userTable #user-" + user.id).remove();
            flashMessage(msg);
        }
    });
}

function updateUser(id) {
    var msg = "Пользователь изменен!";
    var user = {};
    user.id = id;
    users.forEach(function(user, i) {
        if (user.id == id) {
            $("#updateUser").children("input").each(function() {
                var value = $(this).val();
                var attr = $(this).attr("name");
                if (attr == "name") {
                    user.name = value;
                } else if (attr == "position") {
                    user.position = value;
                } else if (attr == "email") {
                    user.email = value;
                }else if (attr == "phone") {
                    user.phone = value;
                }
            });
            users.splice(i, 1);
            users.splice(user.id - 1, 0, user);
            $("#userTable #user-" + user.id).children(".userData").each(function() {
                var attr = $(this).attr("name");
                if (attr == "name") {
                    $(this).text(user.name);
                } else if (attr == "position") {
                    $(this).text(user.position);
                }  else if (attr == "email") {
                    $(this).text(user.email);
                } else if (attr == "phone") {
                    $(this).text(user.phone);
                }

            });
            $(".modal").modal("toggle");
            flashMessage(msg);
        }
    });
}

function flashMessage(msg) {
    $(".flashMsg").remove();
    $(".row").prepend(`
        <div class="col-sm-12">
        <div class="flashMsg alert alert-success alert-dismissible fade in" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span></button>
        <strong>${msg}</strong>
        </div></div>
    `);
}

function appendToUsrTable(user) {
    $("#userTable > tbody:last-child").append(`
        <tr id="user-${user.id}">
            <td class="userData" name="name">${user.name}</td>
            '<td class="userData" name="position">${user.position}</td>
            '<td id="tdEmail" class="userData" name="email">${user.email}</td>
            '<td id="tdPhone" class="userData" name="phone">${user.phone}</td>
            '<td align="center">
                <button class="btn btn-success form-control" onClick="editUser(${user.id})" data-toggle="modal" data-target="#myModal")">Изменить</button>
            </td>
            <td align="center">
                <button class="btn btn-danger form-control " onClick="deleteUser(${user.id})">Удалить</button>
            </td>
        </tr>
    `);
}
