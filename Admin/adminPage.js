const tableBody = document.getElementById("tableBody");

async function generateTable() {
    const response = await fetch('http://localhost:3000/userList'); // Fetch user data
    const data = await response.json();

    for (let i = 1; i < data.length; i++) {
        // Create a new row
        let row = document.createElement('tr');

        // Create and populate the "No." column
        let noCell = document.createElement('td');
        noCell.textContent = i; // Add index number starting from 1
        row.appendChild(noCell);

        // Create and populate the "Teacher Name" column
        let nameCell = document.createElement('td');
        nameCell.textContent = data[i].teacherName; // Assuming data[i].name contains the teacher's name
        row.appendChild(nameCell);

        // Create and populate the "Change" column
        let changeCell = document.createElement('td');
        changeCell.innerHTML = `<button>Edit</button>`; // Add a button for "Change"
        changeCell.addEventListener('click', () => edit(data.userId[i]));
        row.appendChild(changeCell);
        // Append the row to the table body.
        tableBody.appendChild(row);
    }
}

async function edit(userId) {
   
}

generateTable();
