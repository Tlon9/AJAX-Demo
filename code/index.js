let btnLoad = document.getElementById('btn-load');
let btnShowmore = document.getElementById('btn-showMore');
let classListElement = document.getElementById('result-list');
let index=0;

async function wait(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
function loading(){
    // 
    fetch(`http://127.0.0.1:8000/students/?index=${index}`)
        .then(response => response.json())
        .then(students => {
            students.forEach(std => {
                addClassToUI(std);
            });
            // 
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            // 
        });
    btnShowmore.classList.remove('hide');   

}
// Fetch students on page load
btnLoad.addEventListener('click', function() {
    index =0;
    classListElement.innerHTML = ''; 
    loading();
});

btnShowmore.addEventListener('click', function() {
    index +=5;
    loading();
})
// Add class to the UI
function addClassToUI(std) {
    const classItem = document.createElement('div');
    classItem.classList.add('result-item');
    classItem.innerHTML = `
        <div class="id">${std.id}</div>
        <div class="name">${std.name}</div>
        <input type="text" class="name hide" value="${std.name}">
        <div class="icon">
            <ion-icon class="delete" name="trash-outline"></ion-icon>
            <ion-icon class="edit" name="create-outline"></ion-icon>
            <ion-icon class="save" name="save-outline"></ion-icon>
        </div>
    `;

    classListElement.appendChild(classItem);
    const deleteBtn = classItem.querySelector('.delete');
    const editBtn = classItem.querySelector('.edit');
    const saveBtn = classItem.querySelector('.save');
    const id = classItem.querySelector('.id').textContent.trim();

    deleteBtn.addEventListener('click', async function() {
        btnLoad.disabled = true;
        btnLoad.style.opacity = "0.5";
        btnLoad.style.pointerEvents = "none";
        btnShowmore.disabled = true;
        btnShowmore.style.opacity = "0.5";
        btnShowmore.style.pointerEvents = "none";
        console.log(`Deleting class with ID: ${id}`);  
        await wait(5000);
        deleteClass(id);  
    });

    editBtn.addEventListener('click', function() {
        btnLoad.disabled = true;
        btnLoad.style.opacity = "0.5";
        btnLoad.style.pointerEvents = "none";
        btnShowmore.disabled = true;
        btnShowmore.style.opacity = "0.5";
        btnShowmore.style.pointerEvents = "none";
        let info = classItem.querySelector('.name');
        let input = classItem.querySelector('input');
        input.value = info.textContent;
        info.classList.toggle('hide');
        input.classList.toggle('hide');
    });

    saveBtn.addEventListener('click', async function() {
        btnLoad.disabled = true;
        btnLoad.style.opacity = "0.5";
        btnLoad.style.pointerEvents = "none";
        btnShowmore.disabled = true;
        btnShowmore.style.opacity = "0.5";
        btnShowmore.style.pointerEvents = "none";
        let updateInfo = classItem.querySelector('input');
        newName = updateInfo.value;
        console.log(`Updating class with ID: ${id} to ${newName}`);
        await wait(5000);
        saveClass(id, newName);
    });
}




// // Delete class
function deleteClass(id) {
    // 
    fetch(`http://127.0.0.1:8000/students/${id}`, { method: 'DELETE' })
        .then(async response => {
            if (response.ok) {
                const data = await response.json();
                if (data.message == "Student deleted successfully"){
                    btnLoad.disabled = false;
                    btnLoad.style.opacity = "1";
                    btnLoad.style.pointerEvents = "auto";
                    btnShowmore.disabled = false;
                    btnShowmore.style.opacity = "1";
                    btnShowmore.style.pointerEvents = "auto";
                    const resultItem = Array.from(document.querySelectorAll('.result-item'))
                        .find(item => item.querySelector('.id').textContent.trim() === String(id));
                    
                    if (resultItem) {
                        resultItem.remove();
                        console.log(`Class with ID ${id} removed successfully.`);
                    }
                } else {
                    throw new Error('Unexpected response message.');
                }
            } else {
                if (response.status === 404) {
                    console.error('Class not found.');
                } else {
                    console.error('Failed to delete the class.');
                }
                throw new Error('Deletion failed.');
            }
                })
                .catch(error => {
                    console.error('Error deleting class:', error);
                    // 
                })
}


function saveClass(id, newName) {
        // 
    fetch(`http://127.0.0.1:8000/students/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName })
    })
    .then(async response => {
        if (response.ok) {
            const data = await response.json();
            if (data.id == id){
                btnLoad.disabled = false;
                btnLoad.style.opacity = "1";
                btnLoad.style.pointerEvents = "auto";
                btnShowmore.disabled = false;
                btnShowmore.style.opacity = "1";
                btnShowmore.style.pointerEvents = "auto";
                const resultItem = Array.from(document.querySelectorAll('.result-item'))
                    .find(item => item.querySelector('.id').textContent.trim() === String(id));
                
                if (resultItem) {
                    resultItem.querySelector('.name').textContent = newName;
                    let info = resultItem.querySelector('.name');
                    let input = resultItem.querySelector('input');
                    input.value = info.textContent;
                    info.classList.toggle('hide');
                    input.classList.toggle('hide');
                }
            } else {
                throw new Error('Unexpected response message.');
            }
        } else {
            if (response.status === 404) {
                console.error('Class not found.');
            } else {
                console.error('Failed to edit the class.');
            }
            throw new Error('Edition failed.');
        }})
    .catch(error => {
        console.error('Error updating class:', error);
        // 
    });
}

