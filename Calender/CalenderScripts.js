const urlParams = new URLSearchParams(window.location.search);
const className = urlParams.get('class');
const user = urlParams.get('user');
const doneAlert = document.getElementById("message");
const present = new Date();
let currentDate = new Date();
let studentNames = [];
console.log(className);

function generateTableHeaders(date) 
{
    studentNames = [];
    const headerRow = document.getElementById('header-row');
    const dataRow = document.getElementById('data-row');
    const tableBody = document.getElementById('table-body');
    const monthNameDiv = document.getElementById('month-name');
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //Clear the table 
    headerRow.innerHTML = '';
    dataRow.innerHTML = '';
    tableBody.innerHTML = '';
    doneAlert.innerHTML = '';

    monthNameDiv.textContent = `${className} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const th = document.createElement('th');
    th.textContent = "Students";
    headerRow.appendChild(th);    
    for (let day = 1; day <= daysInMonth; day++) 
    {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    }

    fetch('http://localhost:3000/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        data.forEach(item => 
        {
            if(item.name === className)
            {
                const students = item.students;
                students.forEach(student => 
                {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    const link = document.createElement('a');
                    link.href = `../Report/sReport.html?studentName=${encodeURIComponent(student.name)}&user=${encodeURIComponent(user)}`;
                    link.textContent = student.name;
                    tableBody.appendChild(row);
                    cell.append(link);
                    row.appendChild(cell);
                    for(let day = 1; day <= daysInMonth; day++)
                        {
                            const cell = document.createElement('td');
                            cell.id = student.name + day;
                            cell.addEventListener('click', markAttendance);
                            row.appendChild(cell);
                        }
                    const attendance = student.attendance
                    let attendanceCount = 0;
                    let classDays = 0;
                    attendance.forEach(entry => 
                    {
                        if(currentDate.getMonth() === new Date(entry.date).getMonth())
                        {
                            const day = new Date(entry.date).getDate();
                            const block = document.getElementById(student.name + day);
                            block.textContent = entry.status;
                            block.classList.add(entry.status);
                            if(entry.status === "present") {
                                attendanceCount++;
                            }
                            classDays++;
                        }
                        
                    })
                    if(attendanceCount/classDays < 0.75 && currentDate < present) {
                       cell.classList.add("less"); 
                    }
                    console.log("Student name var :", student.name);
                    studentNames.push(student.name);
                })
            }
        });
        console.log("Student Names:", studentNames);
    })
    .catch(error => console.error('Error fetching data:', error));
}

async function updateAttendance()
{
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    for(let i = 0; i < studentNames.length; i++)
    {
        await fetch('http://localhost:3000/empty', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({className: className, studentName: studentNames[i], month: currentDate.getMonth()}) // Convert the data object to JSON string
        })
        .then(response => {
            if (response.ok) {
                console.log("Data successfully Deleted.");
            } 
            else {
            console.error("Failed to delete data:", response.statusText);
            }
        })
        .catch(error => console.error("Error:", error));
        for(let day = 1; day < daysInMonth; day++)
        {
            const update = document.getElementById(studentNames[i] + day);
            if(update.className)
            {
                const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');

                const data = {
                    className: className,
                    studentName: studentNames[i],
                    attendance: {
                        date: `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`,
                        status: update.className
                    }
                }
                console.log("Data being sent:", data);
                await fetch('http://localhost:3000/update', {
                    method: "POST", // Use "POST" if you're adding new data, "PUT" to overwrite
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data) // Convert the data object to JSON string
                })
                .then(response => {
                    if (response.ok) {
                        console.log("Data successfully sent to the server.");
                    } 
                    else {
                    console.error("Failed to send data:", response.statusText);
                    }
                })
                .catch(error => console.error("Error:", error));
            }       
        }
    } 
    doneAlert.textContent = 'Attendance Updated';
}


function changeMonth(offset) 
{
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateTableHeaders(currentDate);
}
function markAttendance(event)
{
    const cell = event.target;
    if(cell.classList.contains('present'))
    {
        cell.classList.add('absent');
        cell.classList.remove('present');
        cell.textContent = 'absent';
    }
    else if(cell.classList.contains('absent'))
    {
        cell.classList.add('ill');
        cell.classList.remove('absent');
        cell.textContent = 'ill';
    }
    else if(cell.classList.contains('ill'))
    {
        cell.classList.remove('ill');
        cell.textContent = '';
    }
    else
    {
        cell.classList.add('present');
        cell.textContent = 'present';
    }
}

function markRed(name)
{
    
}

document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
document.getElementById('updateButton').addEventListener('click', () => updateAttendance());
generateTableHeaders(currentDate);