class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
        `<p>
            Copyright 2023 Edgar Francisco Santana Murillo<br>
            Test: AMMPER<br>
        </p>`;
    }
}

customElements.define("mi-footer", MiFooter);
