import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  getString,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  subeStorage
} from "../../bibliotecas/storage.js";
import {
  muestraPersonales
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";


const daoDoctor = getFirestore().collection("Doctor");
const daoSucursal = getFirestore().collection("Sucursal");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["SuperAdmin"])) 
  {
    forma.addEventListener("submit", guarda);
    selectSucursal(forma.sucursal, "");
  }
}

export function selectSucursal(select,valor){
    valor = valor || "";
    daoSucursal.orderBy("nombre").onSnapshot(snap => {
        let html = "";
        snap.forEach(doc => html += htmlSucursal(doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectSucursal(select, valor);
      }
    );
}
function htmlSucursal(doc, valor) {
  const selected = doc.id === valor ? "selected" : "";
  /**
   * @type {import("./tipos.js").
                  Pasatiempo} */
  const data = doc.data();
  return ('<option value="'+data.nombre+'"'+selected+'>'+data.nombre+'</option>');
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const foto = formData.get("foto");
    const nombre = getString(formData, "nombre").trim();  
    const paterno = getString(formData, "paterno").trim();  
    const materno = getString(formData, "materno").trim();  
    const email = getString(formData, "email").trim(); 
    const cedula = getString(formData, "cedula").trim(); 
    const fecha = getString(formData, "fecha_nacimiento").trim(); 
    const fecha_nacimiento = new Date(getString(formData, "fecha_nacimiento").trim());
    fecha_nacimiento.setDate(fecha_nacimiento.getDate()+ 1);
    const sucursal = getString(formData, "sucursal").trim(); 
    const Rol = ["Doctor"];
    const modelo_user = {
      Rol
    };
    const daoUsuario = getFirestore().collection("Usuario").doc(email);
    await daoUsuario.set(modelo_user);
        
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      nombre,
      paterno,
      materno,
      cedula,
      fecha_nacimiento,
      sucursal,
      email
    };
    var guardado= await daoDoctor.add(modelo);
    await subeStorage(guardado.id, foto);
    
    muestraPersonales();
  } catch (e) {
    muestraError(e);
  }
}



