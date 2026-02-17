const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
console.log("User Home = ", user);

fetch('http://localhost:3000/home', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    const classContainer = document.getElementById('classCards');
    classContainer.innerHTML = '';
    
    let row;
    data.forEach((item, index) => {
        if (index % 5 === 0) {
            row = document.createElement('div');
            row.classList.add('class-row');
            classContainer.appendChild(row);
        }
        
        const card = document.createElement('div');
        card.classList.add('class-card');
        
        const icon = document.createElement('img');
        icon.src = 'icons/'+item.icon+'.png' || 'icons/default.png';
        icon.alt = `${item.icon} icon`;
        icon.style.width = '40px';
        icon.style.height = '40px';
        
        const link = document.createElement('a');
        link.href = `../Calender/Calender.html?class=${encodeURIComponent(item.name)}&user=${encodeURIComponent(user)}`;
        link.textContent = item.name;

        const deleteButton = document.createElement('button');
        deleteButton.addEventListener("click", function() {

            if(confirm('Are you sure you want to delete class "'+item.name+'"?')) {
                fetch('http://localhost:3000/delete_class', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(jsonName = {name: item.name})
                })
                .then(response => {
                    if (response.ok) {
                        console.log("Data successfully sent to the server.");
                        window.location.href = `../Home/home.html?user=${encodeURIComponent(user)}`;
                    } 
                    else {
                    console.error("Failed to send data:", response.statusText);
                    }
                })
                .catch(error => console.error("Error:", error));
            }

        });
        deleteButton.textContent = 'X';
        
        card.appendChild(icon);
        card.appendChild(link);
        card.appendChild(deleteButton);
        row.appendChild(card);
    });
})
.catch(error => {
    console.error('Error:', error);
});

function genReport() {
    window.location.href=`../Report/reportPage.html?user=${encodeURIComponent(user)}`;
}
function createClass() {
    window.location.href = `../CLass/class_creation.html?user=${encodeURIComponent(user)}`;
}
function editClasses() {
    window.location.href = `../Class/class_editing.html?user=${encodeURIComponent(user)}`;
}
