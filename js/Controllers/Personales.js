import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  cod,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  urlStorage
} from "../../bibliotecas/storage.js";
import {
  tieneRol
} from "../seguridad.js";

/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");
const daoDoctor = getFirestore().collection("Doctor");
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["SuperAdmin"])) 
  {
    consulta();
  }
}

function consulta() {
  daoDoctor.orderBy("paterno").onSnapshot(htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
    let html = "";
    if (snap.size > 0) 
    {
        let doctores = [];
        snap.forEach(doc => doctores.push(htmlFila(doc)));
        const htmlFilas =await Promise.all(doctores);
        html += htmlFilas.join("");
    } 
    else 
    {
        html += '<tr><th scope="row">-</th><td>SIN DATOS</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
  }
  lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
  /**
   * @type {import("./tipos.js").
                  Alumno} */
  const data = doc.data();
  const foto = cod(await urlStorage(doc.id));
  const nombre = cod(data.nombre);
  const paterno = cod(data.paterno);
  const materno = cod(data.materno);
  const cedula = cod(data.cedula);
  var date=data.fecha_nacimiento.toDate();
  var ano=date.getFullYear();
  var mes=date.getMonth()+1;
  var dia=date.getDate();
  if(mes<10)
        mes='0'+mes;
  if(dia<10)
        dia='0'+dia;
  var salida_date=dia+'-'+mes+'-'+ano;
  const edad = salida_date;      
  const sucursal = cod(data.sucursal);
  const parametros = new URLSearchParams();
  parametros.append("id", doc.id);
  const accion='<a class="btn btn-info" href="personal.html?'+parametros+'">Actualziar</a>';
  
  return ('<tr><th scope="row"><img src="'+foto+'"alt="Falta el Avatar" style="height: 50px; width: auto"></th><td>'+nombre+'</td><td>'+paterno+'</td><td>'+materno+'</td><td>'+cedula+'</td><td>'+edad+'</td><td>'+sucursal+'</td><td>'+accion+'</td></tr>');
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

