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
const daoLaboratorio = getFirestore().collection("Laboratorio");
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
  daoLaboratorio.orderBy("nombre").onSnapshot(htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
    let html = "";
    if (snap.size > 0) 
    {
        let laboratorios = [];
        snap.forEach(doc => laboratorios.push(htmlFila(doc)));
        const htmlFilas =await Promise.all(laboratorios);
        html += htmlFilas.join("");
    } 
    else 
    {
        html += '<tr><th scope="row">-</th><td>SIN DATOS</td><td>-</td><td>-</td></tr>';
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
  const direccion = cod(data.direccion);
  const parametros = new URLSearchParams();
  parametros.append("id", doc.id);
  const accion='<a class="btn btn-info" href="laboratorio.html?'+parametros+'">Actualziar</a>';
  
  return ('<tr><th scope="row"><img src="'+foto+'"alt="Falta el Avatar" style="height: 50px; width: auto"></th><td>'+nombre+'</td><td>'+direccion+'</td><td>'+accion+'</td></tr>');
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}

