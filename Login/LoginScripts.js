async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const user = await response.json();
        console.log("User ID Login = ", user);
        if (response.ok) {
            message.textContent = 'Login successful';
            message.style.color = 'green';
            if(user.user === 'admin') {
                setTimeout(() => {window.location.href = `../Admin/admin.html`},2000);    
            }
            else {
                setTimeout(() => {window.location.href = `../Home/home.html?user=${encodeURIComponent(user.user)}`},2000);
            }
        } else {
            message.textContent = 'Invalid username or password';
            message.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        message.textContent = 'Server error';
        message.style.color = 'red';
    }
}
