let users = [];
let activeRow;
let paginationLimit = [1];
let modal = $('#CRUDModal');
let modalTitle = document.getElementById("title")
let modalBody = $('.CRUDForm')
let targetUser = null;



$.ajax({
    type: "GET",
    url: "https://reqres.in/api/users?page=1",
    success: function (response1) {
        $.ajax({
            type: "GET",
            url: "https://reqres.in/api/users?page=2",
            success: function (response2) {
                users = [
                    ...response1.data,
                    ...response2.data,
                ];
                fillPage();
            },
        });
    },
});




function fillPage(page = 1) {
    activeRow = page;
    let cards = "";
    let container = "";
    let counter = 1;

    for (let index = 0; index < users.length; index++) {
        let card = users[index];
        cards += 
        `<div class="col-md-4">
            <div class="card mb-4 box-shadow">
                <img src="${card.avatar}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">ID: ${card.id}</h5>
                    <p class="card-text">Full Name: ${card.first_name} ${card.last_name}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group" id="${card.id}">
                            <a href="#" class="btn btn-primary" type="button" onclick="showCRUD(this)">USER PROFILE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        if (index === counter * 6 - 1 || index === users.length - 1) {
            container +=`<div id="${counter}" class="row ${(() => {
            if (counter !== page) {
              counter++;
              return "d-none";
            } else {
              counter++;
              return "";
            }})()}">` + cards + "</div>";
            cards = "";
        }
    }

    let pgBtn = "";

    for (let index = 1; index <= counter - 1; index++) {
      pgBtn += `<li class="page-item"><a class="page-link" id="${index}" onclick="pgNav(this)">${index}</a></li>`;
    }

    let pagination =
    `<nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item"><a class="page-link" id="prevBtn" onclick="pervBtn(event)">Previous</a></li>` + pgBtn +
            `<li class="page-item"><a class="page-link" id="nextBtn" onclick="nextBtn(event)">Next</a></li>
        </ul>
    </nav>`;
    paginationLimit[1] = counter - 1;

    $(".container").html(container);
    $(".pagination-container").html(pagination);
}
  


  
function nextBtn(e) {
    e.preventDefault();
    if (activeRow === paginationLimit[1]) return fillPage(activeRow);
    fillPage(++activeRow);
}

function pervBtn(e) {
    e.preventDefault();
    if (activeRow === paginationLimit[0]) return fillPage(activeRow);
    fillPage(--activeRow);
}

function pgNav(e) {
    activeRow = +e.id;
    fillPage(+e.id);
}
  
$(".createUserForm").submit(function (e) {
    e.preventDefault();
    let id = +$("#userId").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let userEmail = $("#userEmail").val();
    let image = $("#userImage").val();
  
    // validation
    if (!firstName || !lastName || !userEmail || !image || !id) {
      return alert("please fill inputs to create new user.");
    }
    let user = users.find((el) => el.id === id);
    if (user) return alert("user already exists.");
  
    users.push({
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      avatar: "./images/" + image.split("fakepath\\")[1],
    });
    fillPage();
});

function showCRUD(element) {  
    modal.modal("show");
    modalTitle.textContent = "CRUD Form"
    

    let cardID = element.parentNode.id - ""
    targetUser = users.filter(user => { return user.id === cardID});
    for (let index = 0; index < targetUser.length; index++) {
        modalBody[index].innerHTML = 
        `<span>ID: ${targetUser[index].id}</span>
        <br>
        <span>First Name: ${targetUser[index].first_name}</span>
        <br>
        <span>Last Name: ${targetUser[index].last_name}</span>
        <br>
        <span>First Name: ${targetUser[index].email}</span>
        <hr><br>
        <div id="${targetUser[index].id}">
            <button type="button" class="btn btn-info" onclick="UpdateForm(this)">Update</button>
            <button type="button" class="btn btn-danger" onclick="remove(this)">Remove</button>
        </div>`
    }

}


function UpdateForm(element) {
    modal.modal('show');
    modalTitle.textContent = "Update Form";

    for (let index = 0; index < users.length; index++) {
        let card = users[index]
        modalBody[index].innerHTML = 
        `<div class="input-group">
            <input type="text" name="updateFormInputsID" id="id" aria-label="Recipient's username" aria-described-by="basic-addon2" value="${card.id}" disabled>
            <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">ID</span>
            </div>
        </div>
        <br>
        <div class="input-group">
            <input type="text" class="updateFormInputs" id="name" aria-label="Recipient's username" aria-described-by="basic-addon2" value="${card.first_name}">
            <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">First Name</span>
            </div>
        </div>
        <br>
        <div class="input-group">
            <input type="text" class="updateFormInputs" id="familyName" aria-label="Recipient's username" aria-described-by="basic-addon2" value="${card.last_name}">
            <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">Last Name</span>
            </div>
        </div>
        <br>
        <div class="input-group">
            <input type="text" class="updateFormInputs" id="email" aria-label="Recipient's username" aria-described-by="basic-addon2" value="${card.email}">
            <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">@email.com</span>
            </div>
        </div>
        <hr><br>
        <div id="${card.id}">
            <button type="button" class="btn btn-success" onclick="update(this)">Save</button>
        </div>`  
    }
}


function update(element) {
    let id = +$("#id").val();
    let firstName = $("#name").val();
    let lastName = $("#familyName").val();
    let userEmail = $("#email").val();
    
    if (!firstName || !lastName || !userEmail || !id) return alert("Please fill inputs");
    let cardID = element.parentNode.id - ""
    objIndex = users.findIndex((obj => obj.id == cardID));
    users[objIndex].id = id
    users[objIndex].email = email
    users[objIndex].first_name = firstName
    users[objIndex].last_name = lastName
    
      

    fillPage()
    modal.modal("hide");

}

function remove(element) {  
    let cardID = element.parentNode.id - ""
    users = users.filter((el) => el.id !== cardID);

    fillPage()
    modal.modal("hide");
}