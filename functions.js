console.log('test script')


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
</tr>`;
}




fetch("data.json")
    .then(r => r.json())
    .then(data => {
        insertObj(data);
    });