console.log('test script')

const API = {
    CREATE: {
        URL: "http://localhost:3000/myStorage/create",
        METHOD: "POST"
    },
    READ: {
        URL: "http://localhost:3000/myStorage", //for connecting to .json update all CRUD to -json: eg. myStorage-json/create; myStorage-json; myStorage-json/update, etc
        METHOD: "GET"
    },
    UPDATE: {
        URL: "http://localhost:3000/myStorage/update",
        METHOD: "PUT"
    },
    DELETE: {
        URL: "http://localhost:3000/myStorage/delete",
        METHOD: "DELETE"
    },
}

// for demo purposes...
if (location.host === "scorfu.github.io") {
    API.READ.URL = "data.json";
}

let editId;

function insertObj(list) {
    const tbody = document.querySelector('#list tbody');
    if (list.length) {
        tbody.innerHTML = getObjsHtml(list);
    } else {
        tbody.innerHTML = getNotFoundRow();
    }
}

function getObjsHtml(object) {
    return object.map(getObjHtml).join("");
}

function getObjHtml(object) {
    return `<tr data-id="${object.id}">
    <td>${object.nameObj}</td>
    <td value="${object.category}" class="category">${object.category}</td>
    <td>${object.depositArea}</td>
    <td>${object.depositDate}</td>
    <td>
        <a href="#" class="delete-row" data-id="${object.id}">&#128465;</a>
        <a href="#" class="edit-row" data-id="${object.id}">&#9998</a>
    </td>
</tr>`;
}

function getNotFoundRow() {
    return `<tr><td colspan="5" style="text-align:center"><h4>Not Found!</h4></td></tr>`
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
let searchCategory = "";

function searchObjs(text, category) {
    text = text.toLowerCase();
    console.warn(allObjs);
    return allObjs.filter(obj => {
        return (obj.nameObj.toLowerCase().indexOf(text) > -1 ||
            obj.category.toLowerCase().indexOf(text) > -1) && 
            (category ? obj.category === category : true);
    });
}

function saveObj() {
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
function updateObj() {
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

function deleteObject(id) {
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
function populateObject(id) {
    var object = allObjs.find(object => object.id == id)
    $('#staticBackdrop').modal('show')
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

    var myModal = document.getElementById("staticBackdrop")
    myModal.addEventListener("click", () => { return document.getElementsByClassName('modal fade show') })
}
// end EDIT


function addEventListeners() {
    const search = document.getElementById('search');
    search.addEventListener("input", e => {
        const text = e.target.value;
        const filtrate = searchObjs(text, searchCategory);
        console.info({ filtrate })
        insertObj(text ? filtrate : allObjs);
    });

    const saveBtn = document.querySelector("#saveBtn");
    saveBtn.addEventListener("click", () => {
        //edit
        if (editId) {
            updateObj();
        }
        //edit
        else {
            saveObj();
        }
    })

    const table = document.querySelector('#list tbody')
    table.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches("a.delete-row")) {
            const id = target.getAttribute("data-id")
            console.log("click", id)
            deleteObject(id);
        }
        // start EDIT
        else if (target.matches("a.edit-row")) {
            const id = target.getAttribute("data-id");
            populateObject(id);
            console.log(id)
            // end EDIT  
        }
        else if (target.tagName != 'TR') {
            console.log('click')
            const id = target.getAttribute("data-id");
            showObjDetails(id);
            console.log(id)
        }
    })

    const input = document.getElementById("staticBackdrop");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("saveBtn").click();
        }
    });

    const popupElment = document.querySelector('.dropdown-content');
    const categories = document.querySelectorAll('.category');
    categories.forEach(a => a.addEventListener('click', function () {
        const category = a.getAttribute("value");
        searchCategory = category;
        const filtrate = searchObjs(search.value, category);
        console.info({ filtrate })
        insertObj(filtrate);
        document.querySelector('.dropbtn').innerHTML = `Filter: ${category}`;
        popupElment.classList.remove('show');
    })
    );

    document.getElementById("myDropdown").addEventListener('click', function (event) {
        event.stopPropagation();
    });

    const popupEl = document.querySelector('.dropdown-content');
    const button = document.querySelector('.close');
    button.addEventListener('click', function () {
        popupEl.classList.remove('show');
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


// start of Category Seach button
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

//  the below can be used as another option to remove the dropdown list when clicking on option, you will also need to add an onclick="hide()" in html
// function hide () {
//     document.getElementById("myDropdown").classList.remove("show")
// }
//  the below can be used as another option to remove the dropdown list when clicking on option, you will also need to add an onclick="hide()" in html

window.onclick = function (event) {

    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// end of Category Seach button

function reset() {
    const resetBtn = document.querySelectorAll('#reset');
    resetBtn.forEach(a => a.addEventListener('click', function () {
        const resetButton = a.getAttribute("value" === "x");
        console.log('resetButton')
        document.querySelector('.dropbtn').innerHTML = "Filter"
        loadList()
    })
    )
}
