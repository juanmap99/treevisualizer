import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("modalContainer", { read: ViewContainerRef })
  modalContainer!: ViewContainerRef;

  title = 'sortvisualizer';
  public scWidth: any;
  public scHeight: any;

  constructor(){
  }

  /**
   * Funcion que corre en el 'init' que llamara a una funcion que actualizar el valor
   * de toda variabla dependiente del tamaño de la pantalla del usuario.
   */
  ngOnInit(): void {
    this.updateSizeDependantVar();
  }


  /**
   * Funcion que llama al a funcion que actualiza toda variable dependiente del tamaño de la pantalla del usuario
   * en el momento que existe un resize.
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.updateSizeDependantVar();
  }

  /**
   * Actualiza todas las variables dependientes del tamaño. Definimos a su vez
   * que el tamaño de width minimo de nuestra pagina sera de 1270 pixeles de largo
   * por 800 pixeles de alto.
   */
  updateSizeDependantVar(){
    this.scWidth = window.innerWidth < 1270 ? 1270 : window.innerWidth;
    this.scHeight = window.innerHeight < 800 ? 800 : window.innerHeight;
  }
  
}
