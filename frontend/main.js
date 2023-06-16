function getData() {
  const token = getCookie('AccessToken');

  fetch('http://localhost:3000/datos', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => generarExcel(data))
    .catch(error => console.error(error));
}


function postData() {
const nombre = document.getElementById("nombre").value;
const email = document.getElementById("email").value;
const codigoLote = document.getElementById("codigoLote").value; 
const telefono = document.getElementById("telefono").value;
const check = document.getElementById("flexCheckChecked").checked;

  fetch('http://localhost:3000/encuesta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, email, codigoLote, telefono, check })
  })
  .then(response => response.json())
  .then(data =>  window.location.href = 'http://127.0.0.1:5501/frontend/registrado.html')
  .catch(error => console.error(error));
 

}


function generarExcel(datos) {
  const titulos = [];
  const filas = [];


  datos.forEach((objeto) => {
    const fila = {};

    Object.keys(objeto).forEach((clave) => {
      const valor = objeto[clave];

      if (!titulos.includes(clave)) {
        titulos.push(clave);
      }

      fila[clave] = valor;
    });

    filas.push(fila);
  });

  const workbook = XLSX.utils.book_new();
  // const worksheet = XLSX.utils.json_to_sheet(filas, { header: titulos });

  const worksheet = XLSX.utils.json_to_sheet(filas, {
    header: titulos,
    cellStyles: true,
    headerStyles: { font: { bold: true } }
  });


  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "datos.xlsx");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const inputContainer = document.querySelector('.input-container');
const popover = document.querySelector('.popover');

inputContainer.addEventListener('mouseenter', () => {
  popover.style.display = 'block';
});

inputContainer.addEventListener('mouseleave', () => {
  popover.style.display = 'none';
});


let dataStatus = false;

async function checkData() {
  const codigoLoteInput = document.getElementById("codigoLote");
  const imgCheck = document.querySelector(".imgCheck");
  const imgError = document.querySelector(".imgError");

  codigoLoteInput.addEventListener("input", async function() {
    const codigoLote = this.value;
    try {
      const response = await fetch('http://localhost:3000/codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoLote })
      });
      
      const data = await response.json();

      if (data) {
        imgCheck.classList.remove("imgCheckDis");
        imgError.classList.add("imgErrorDis");
        dataStatus = true;
      } else {
        imgError.classList.remove("imgErrorDis");
        imgCheck.classList.add("imgCheckDis");
        dataStatus = false;
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function checkInputs() {
  const btnEnvio = document.querySelector(".btnEnvio");
  const nombre = document.querySelector("#nombre").value;
  const email = document.querySelector("#email").value;
  const telefono = document.querySelector("#telefono").value;
  const check = document.querySelector("#flexCheckChecked").checked;

  if (nombre !== "" && email !== "" && telefono !== "" && check && dataStatus) {
    btnEnvio.disabled = false;
    btnEnvio.classList.remove("btnEnvioDis");
  } else {
    btnEnvio.disabled = true;
    btnEnvio.classList.add("btnEnvioDis");
  }
}


document.addEventListener("DOMContentLoaded", function() {
  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const checkInput = document.querySelector("#flexCheckChecked");

  nombreInput.addEventListener("input", checkInputs);
  emailInput.addEventListener("input", checkInputs);
  telefonoInput.addEventListener("input", checkInputs);
  checkInput.addEventListener("change", checkInputs);

  checkData();

  checkInputs(); 
});










/*---COOKIES---*/

const botonAceptarCookies = document.getElementById('btn-aceptar-cookies');
const avisoCookies = document.getElementById('aviso-cookies');
const fondoAvisoCookies = document.getElementById('fondo-aviso-cookies');

dataLayer = [];

if(!localStorage.getItem('cookies-aceptadas')){
	avisoCookies.classList.add('activo');
	fondoAvisoCookies.classList.add('activo');
} else {
	dataLayer.push({'event': 'cookies-aceptadas'});
}

botonAceptarCookies.addEventListener('click', () => {
	avisoCookies.classList.remove('activo');
	fondoAvisoCookies.classList.remove('activo');

	localStorage.setItem('cookies-aceptadas', true);

	dataLayer.push({'event': 'cookies-aceptadas'});
});



