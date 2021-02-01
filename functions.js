console.log('test script')

const API = {
    CREATE: {
        URL:"create.json",
        METHOD: "GET"
    },
    READ: {
        URL:"data.json",
        METHOD: "GET"
    },
    UPDATE: {
        URL:"",
        METHOD: "GET"
    },
    DELETE: {
        URL:"delete.json",
        METHOD: "GET"
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
        <a href="${API.DELETE.URL}?id=${object.id}">&#128465</a>
    <td>
</tr>`;
}

function loadList() {
    fetch(API.READ.URL)
    .then(r => r.json())
    .then(data => {
        allObjs = data
        insertObj(data);
    });
}

loadList();

let allObjs = [];

function searchObjs(text) {
    text = text.toLowerCase();
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
        insertObj(filtrate);
    });
}

addEventListeners();

function saveObj () {
    const nameObj = document.querySelector("#list input[name=nameObj]").value;
    const category = document.querySelector("#category option:checked").value;
    const depositArea = document.querySelector("#depositArea option:checked").value;
    const depositDate = document.querySelector("#list input[name=depositDate]").value;
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
console.log("test")