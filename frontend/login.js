

async function postData(){
    const nombre = document.getElementById("nombre").value;
    const password = document.getElementById("password").value;
  
    await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, password })
    })
    .then(res => res.json())
    .then(data => {
      const token = data.access_token;
      document.cookie = `AccessToken=${token};path=/`;
    })
    .catch(err => console.error(err));
    
    window.location.href = 'http://127.0.0.1:5501/frontend/datos.html';
  }
  
  
  async function getData() {
    await fetch('http://localhost:3000/', {
      headers: {
        'Authorization': `Bearer ${getCookie('AccessToken')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista');
      const li = document.createElement('li');
      data.map((data=> li.innerHTML = data.nombre))
      lista.appendChild(li);
      
    })
    .catch(err => console.error(err));
  }
  
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }