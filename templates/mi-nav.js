import {
  cargaRoles
} from "../js/seguridad.js";
import {
  getAuth
} from "../bibliotecas/coneccion.js";
import {
  muestraError
} from "../bibliotecas/funciones.js";

class MiNav extends HTMLElement {
  connectedCallback() {
      var menusss=location.pathname.split('/');
      var long=menusss.length - 1;
      var activo="";
      var compa=menusss[long];
        if(compa=="index.html")
            activo='class="active"';
        this.innerHTML = /* html */
            '<ul class="main-menu"><li '+activo+'><a href="index.html"> Bancos </a></li></ul>';
        this.ul = this.querySelector("ul");
        getAuth().onAuthStateChanged(usuario => this.cambiaUsuario(usuario,compa),muestraError);
  }

  /**
   * @param {import(
      "../lib/tiposFire.js").User}
      usu */
    async cambiaUsuario(usu,compa) {
        var pag_mov="";
        switch (compa){
            case "movimientos.html":
                pag_mov='class="active"';
            break;
        }
        if (usu && usu.email) 
        {
            let html = "";

            html += /* html */
                '<li '+pag_mov+'><a href="movimientos.html"> Moviminetos </a></li>'
            
            this.ul.innerHTML += html;
        }
    }
}

customElements.define("mi-nav", MiNav);
