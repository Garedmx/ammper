import {
  getAuth,
  getFirestore
} from "../../bibliotecas/coneccion.js";
import {
  getString,
  muestraError
} from "../../bibliotecas/funciones.js";
import {
  eliminaStorage,
  urlStorage,
  subeStorage
} from "../../bibliotecas/storage.js";
import {
  muestraSucursales
} from "../navegacion.js";
import {
  tieneRol
} from "../seguridad.js";

const daoSucursal =  getFirestore().collection("Sucursal");
const params = new URL(location.href).searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["SuperAdmin"])) 
  {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc = await daoSucursal.doc(id).get();
    if (doc.exists) 
    {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      forma.foto_file.src = await urlStorage(id);
      forma.nombre.value = data.nombre || "";
      forma.direccion.value = data.direccion || "";
      forma.addEventListener("submit", guarda);
      forma.eliminar.addEventListener("click", elimina);
    } 
    else 
    {
      throw new Error(
        "Dato no Encontrado.");
    }
  } catch (e) {
    muestraError(e);
    muestraSucursales();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const foto = formData.get("foto");
    const nombre = getString(formData, "nombre").trim();  
    const direccion = getString(formData, "direccion").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      nombre,
      direccion
    };
    await daoSucursal.doc(id).set(modelo);
    await subeStorage(id, foto);
    
    muestraSucursales();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
        if (confirm("Desa eliminar?")) 
        {
          await daoSucursal.doc(id).delete();
          await eliminaStorage(id);
          muestraSucursales();
        }
    } catch (e) {
        muestraError(e);
    }
}

