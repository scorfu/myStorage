console.log('test script')

const API = {
    CREATE: {
        URL:"http://localhost:3000/data-json/create.json",
        METHOD: "POST"
    },
    READ: {
        URL:"http://localhost:3000/data.json",
        METHOD: "GET"
    },
    UPDATE: {
        URL:"http://localhost:3000/data-json/update.json",
        METHOD: "PUT"
    },
    DELETE: {
        URL:"http://localhost:3000/data-json/delete.json",
        METHOD: "DELETE"
    },
}

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
        <a href="${API.DELETE.URL}?id=${object.id}">&#128465;</a>
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

function addEventListeners() {
    const search = document.getElementById('search');
    search.addEventListener("input", e => {
        const text = e.target.value;
        const filtrate = searchObjs(text);
        console.info(filtrate)
        insertObj(filtrate);
    });
}

addEventListeners();


function saveObj () {
    const nameObj = document.querySelector("#staticBackdrop input[name=nameObj]").value;
    const category = document.querySelector("#category option:checked").value;
    const depositArea = document.querySelector("#depositArea option:checked").value;
    const depositDate = document.querySelector("#staticBackdrop input[name=depositDate]").value;

    const obj = {
        nameObj,
        category,
        depositArea,
        depositDate
    }
    console.info("saving", nameObj, category, depositArea, depositDate);
    console.log(obj)

    fetch(API.CREATE.URL, {
        method: API.CREATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.CREATE.METHOD === "GET" ? null : JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(r => {
            console.warn(r);
            if (r.success) {
                loadList();
            }
        });
};

const saveBtn = document.querySelector("#saveBtn");
saveBtn.addEventListener("click", () => {
    saveObj();
    
})

loadList();

var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new bootstrap.Dropdown(dropdownToggleEl)
})

