const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secreto = process.env.SECRET
app.use(express.json());
const corsOptions = {
  origin: 'http://127.0.0.1:5501',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE))


//------------FUNCTIONS-----------------//

function generateToken(user){
  const token = jwt.sign({data:user}, secreto, {expiresIn:"30s"})

  return token
}

function auth(req, res, next){
  const authHeader = req.headers.authorization

  if(!authHeader){
      return res.status(401).json({
          error: 'Invalid authorization header'
      })
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secreto, (err, decoded)=>{
      
      if(err){
          return res.status(403).json({
              error: 'not authorized'
          })
      }
      req.user = decoded.data;
      next();
  })
}


//------------ENDPOINTS-----------------//

app.post('/login', (req, res) => {
  const {nombre, password} = req.body
  const user = fs.readFileSync("./user.txt", "utf8");
  const usuarios = JSON.parse(user);

  const usuario = usuarios.find(u => u.nombre == nombre && u.password == password)
  if(!usuario) {
      return res.json({error: "Credenciales invalidas"})
  }
  const access_token = generateToken(usuario)
  res.send({access_token})
})


app.post("/encuesta", (req, res) => {
  const { nombre, email, codigoLote, telefono, check } =
    req.body;
  const dataUser = {
    nombre, email, codigoLote, telefono, check
  };
console.log(dataUser.codigoLote)

  const data = fs.readFileSync("./datos.txt", "utf8");
  const codigos = fs.readFileSync("./codigos.txt", "utf8");
  const codigosArray = JSON.parse(codigos);
  const index = codigosArray.indexOf(codigoLote);
  codigosArray.splice(index, 1);
  fs.writeFileSync("./codigos.txt", JSON.stringify(codigosArray));

  let dataArray = [];

  if (data !== "") {
    dataArray = JSON.parse(data);
  }
  dataArray.push(dataUser);

  fs.writeFileSync("./datos.txt", JSON.stringify(dataArray));

  res.json(dataUser);
});

app.get('/datos',auth,  (req, res) => {
  const datos = fs.readFileSync("./datos.txt")
  res.send(datos)

})

app.post("/codigo", (req, res) => {
  const { codigoLote } = req.body;
  
  const codigos = fs.readFileSync("./codigos.txt", "utf8");
  const codigosArray = JSON.parse(codigos);

  if (codigosArray.includes(codigoLote)) {
    res.json(true);
  } else {
    res.json(false);
  }
});


app.listen(3000, () => {
  console.log('Servidor Express iniciado en el puerto 3000');
});
