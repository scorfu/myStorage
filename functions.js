console.log('test script')


function insertObj(object){
    const tbody = document.querySelector('#list tbody');
    tbody.innerHTML = getObjsHtml(object);
}

function getObjsHtml(object){
    var rHtml = object.map(objects => {
        return getObjHtml(objects)
    });
    return rHtml.join("");
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