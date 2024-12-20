const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error');

// Handle the login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://crm-backend-9wqe.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful!');
                sessionStorage.setItem('token', data.token); // Store token
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            } else {
                errorMessage.textContent = data.error || 'Login failed!';
            }
        } catch (error) {
            errorMessage.textContent = 'Error connecting to the server!';
        }
    });
}

// Handle fetching clients on the dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('You are not logged in!');
        window.location.href = 'index.html'; // Redirect to login if no token
    } else {
        fetch('https://crm-backend-9wqe.onrender.com/clientes', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('Response status:', response.status); // Log status
                return response.json();
            })
            .then((data) => {
                const clientsDiv = document.getElementById('clients');
                if (data.length > 0) {
                    clientsDiv.innerHTML = data
                        .map(
                            (client) =>
                                `<div class="client-item">
                                    <span class="client-name">${client.nombre}</span>
                                    <span class="client-email">${client.email}</span>
                                </div>`
                        )
                        .join('');
                } else {
                    clientsDiv.innerHTML = '<p class="no-clients">No clients found.</p>';
                }
            })
            .catch((err) => {
                console.error('Error fetching clients:', err); // Log any errors
                alert('Error fetching client data!');
            });
    }
}
