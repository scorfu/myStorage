console.log('test script')

const API = {
    CREATE: {
        URL:"http://localhost:3000/myStorage/create",
        METHOD: "POST"
    },
    READ: {
        URL:"http://localhost:3000/myStorage", //for connecting to .json update all CRUD to -json: eg. myStorage-json/create; myStorage-json; myStorage-json/update, etc
        METHOD: "GET"
    },
    UPDATE: {
        URL:"http://localhost:3000/myStorage/update",
        METHOD: "PUT"
    },
    DELETE: {
        URL:"http://localhost:3000/myStorage/delete",
        METHOD: "DELETE"
    },
}

let editId;

function insertObj(object){
    const tbody = document.querySelector('#list tbody');
    tbody.innerHTML = getObjsHtml(object);
}

function getObjsHtml(object){
    return object.map(getObjHtml).join("");
}

function getObjHtml(object){
    return  `<tr>
    <td>${object.nameObj}</td>
    <td>${object.category}</td>
    <td>${object.depositArea}</td>
    <td>${object.depositDate}</td>
    <td>
        <a href="#" class="delete-row" data-id="${object.id}">&#128465;</a>
        <a href="#" class="edit-row" data-id="${object.id}">&#9998</a>
    <td>
</tr>`;
}

function loadList() {
    fetch(API.READ.URL)
    .then(r => r.json())
    .then(data => {
        allObjs = data;
        insertObj(data);
    });
}

let allObjs = [];

function searchObjs(text) {
    text = text.toLowerCase();
    console.warn(allObjs);
    return allObjs.filter(obj => {
        return obj.nameObj.toLowerCase().indexOf(text) > -1 ||
            obj.category.toLowerCase().indexOf(text) > -1;
    });
}

function saveObj () {
    const nameObj = document.querySelector("#staticBackdrop input[name=nameObj]").value;
    const category = document.querySelector("#category option:checked").value;
    const depositArea = document.querySelector("#depositArea option:checked").value;
    const depositDate = document.querySelector("#staticBackdrop input[name=depositDate]").value;

    const object = {
        nameObj,
        category,
        depositArea,
        depositDate
    }
    console.info("saving", nameObj, category, depositArea, depositDate);
    console.log(object)

    fetch(API.CREATE.URL, {
        method: API.CREATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.CREATE.METHOD === "GET" ? null : JSON.stringify(object)
    })
        .then(res => res.json())
        .then(r => {
            console.warn(r);
            if (r.success) {
                loadList();
            }
        });
};

// start EDIT
function updateObj () {
    const nameObj = document.querySelector("#staticBackdrop input[name=nameObj]").value;
    const category = document.querySelector("#category option:checked").value;
    const depositArea = document.querySelector("#depositArea option:checked").value;
    const depositDate = document.querySelector("#staticBackdrop input[name=depositDate]").value;

    const object = {
        id: editId,
        nameObj,
        category,
        depositArea,
        depositDate
    }
    console.info("updating", nameObj, category, depositArea, depositDate);
    console.log(object)

    fetch(API.UPDATE.URL, {
        method: API.UPDATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.UPDATE.METHOD === "GET" ? null : JSON.stringify(object)
    })
        .then(res => res.json())
        .then(r => {
            console.warn(r);
            if (r.success) {
                loadList();
            }
        });
};
// end EDIT

function deleteObject (id) {
    fetch(API.DELETE.URL, {
        method: API.DELETE.METHOD,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
        .then(r => r.json())
        .then(r => {
            if (r.success) {
                loadList();
            }
        });
}

// start EDIT
function populateObject (id) {
    var object = allObjs.find(object => object.id === id)
    alert("Click on add item and update the item");

    console.log(object)
   
    editId = id;

    const nameObj = document.querySelector("#staticBackdrop input[name=nameObj]");
    const category = document.querySelector("#category option:checked");
    const depositArea = document.querySelector("#depositArea option:checked");
    const depositDate = document.querySelector("#staticBackdrop input[name=depositDate]");

    nameObj.value = object.nameObj;
    category.value = object.category;
    depositArea.value = object.depositArea;
    depositDate.value = object.depositDate;

}
// end EDIT

function addEventListeners() {
    const search = document.getElementById('search');
    search.addEventListener("input", e => {
        const text = e.target.value;
        const filtrate = searchObjs(text);
        console.info(filtrate)
        insertObj(filtrate);
    });

    const saveBtn = document.querySelector("#saveBtn");
    saveBtn.addEventListener("click", () => {
         //edit
    if (editId) {
        updateObj();
    }
    //edit
    else{
        saveObj();
    }
    })

    const table = document.querySelector('#list tbody')
    table.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches("a.delete-row")){
            const id = target.getAttribute("data-id")
            console.log("click", id)
            deleteObject(id);
        } 
         // start EDIT
        else if (target.matches("a.edit-row")) {
            const id = target.getAttribute("data-id");
            populateObject(id);
            // end EDIT  
    }   
    })

    const input = document.getElementById("staticBackdrop");
    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("saveBtn").click();
  }
});
}

addEventListeners();


loadList();

var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new bootstrap.Dropdown(dropdownToggleEl)
})

$('#staticBackdrop').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
});