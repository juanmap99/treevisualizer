import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { faEllipsisH, faHome } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from 'src/app/services/modal.service';
import { AuxiliarVariable, DisplayStatus } from 'src/app/trees/model/AuxiliarVariable';
import { AuxVarService } from 'src/app/trees/services/aux-var.service';
import { TreeRunParams } from '../model/TreeParams';
import { TreeControllerService } from '../services/tree-controller.service';
import { TreeRunningControllerService } from '../services/tree-running-controller.service';

@Component({
  selector: 'app-tree-section',
  templateUrl: './tree-section.component.html',
  styleUrls: ['./tree-section.component.scss']
})
export class TreeSectionComponent implements OnInit {
  @ViewChild("modalContainer", { read: ViewContainerRef })
  modalContainer!: ViewContainerRef;
  
  scWidth: any;
  scHeight: any;
  modalWidth : number = 0;
  modalHeight : number = 0;
  openModal : boolean = false;
  arbolElegido : string = "BST";
  home = faHome;
  threeDots  = faEllipsisH;
  auxVariableExist : boolean = false;
  auxVarList : AuxiliarVariable[] = [];
  running : boolean;
  
  constructor(private runServ: TreeRunningControllerService,
              private modalServ: ModalService,
              private treeContr : TreeControllerService,
              private auxServ : AuxVarService) { 
                this.running = false;
                this.scWidth = 0;
                this.scHeight = 0;
                this.runServ.runObs.subscribe(newState => this.running=newState);
                this.auxServ.auxVarListObs.subscribe(newAuxVarList => {
                  this.auxVarList = newAuxVarList;
                  this.auxVariableExist = this.auxVarList.length > 0;
                  this.updateDisplayStatus();
                })
  }

  ngOnInit(): void {
    this.updateSizeDependantVar();
    this.treeContr.setArbol(this.arbolElegido);
  }

  /**
   * Asigna el string que representa el arbol elegido por el usuario a la variable de clase arbolElegido.
   * @param arbolCode String que representa el arbol elegido por el usuario
   */
  setCurrentTree(arbolCode : string){
    if(arbolCode != this.arbolElegido){
      this.treeContr.setDefaultSize(1);
      this.arbolElegido = arbolCode;
      this.treeContr.setArbol(arbolCode);
    }
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
     this.modalServ.calculateModalSize(this.scWidth,this.scHeight);
     this.modalWidth = this.modalServ.modalSize.modalWidth;
     this.modalHeight = this.modalServ.modalSize.modalHeight;
   }

  /**
   * Utiliza el servicio que maneja las modals para que haga un display de la explicación
   * del algoritmo actualmente elegido
   */
   displayExplanationModal(){
    this.openModal = true;
    this.modalServ.openExplanationModal(this.modalContainer, this.arbolElegido)
                 .subscribe(() =>{
                   this.openModal = false;
                 })
  }

   /**
   * Utiliza el servicio que maneja las modals para que haga un display del codigo
   * del algoritmo actualmente elegido
   */
  displayCodeModal(){
    this.openModal = true;
    this.modalServ.openCodeModal(this.modalContainer, this.arbolElegido)
                 .subscribe(() =>{
                   this.openModal = false;
                 })
  }

  /**
   * Devuelve la altura en pixeles del cuerpo de la pagina exceptuando la toolbar
   * que se encuentra por encima de ello.
   * @returns Altura de la seccion en donde se encontrara el cuerpo de la pagina. 
   */
   getBodyHeight(){
    let height = this.scHeight - 84;//84px de la nav bar
    return height < 850 ? 850 : height;
  }

  /**
   * 
   * @returns Entero que representa el margen que debe tener el modal para con el top y el bottom
   */
  getModalMarginTopBottom(){
    let height = 800 > this.scHeight ? 800 : this.scHeight-85;
    return (height - this.modalHeight)/2;
  }


  /**
   Utiliza el servicio que maneja las modals para indicarle que cierre la misma
   */
   closeModal(){
    this.modalServ.closeModal();
  }

  /**
   * Evento que cambia la cantidad de nodos por default a colocar en el arbol que es ejecutado
   * cuando el usuario mueve el slide referente al tamaño del arbol en el apartado de configuracion
   * 
   * @param newSize Entero que representa la cantidad de nodos dentro de un arbol
   */
  async resizeTree(newSize: number){
    this.runServ.setRunStatus(true);
    await this.treeContr.setDefaultSize(newSize);
    this.runServ.setRunStatus(false);
  }

  /**
   * Ejecuta el programa en base a las instrucciones dadas por el usuario en el apartado
   * de configuración.
   * 
   * @param params Parametros de ejecucion establecidos por el usuario
   */
  async execute(params: TreeRunParams){
    this.runServ.setRunDelay(params.vel);
    await this.runServ.runMethod(params.metodo,params.valor);
    this.runServ.setRunStatus(false);
  }

  /**
   * De acuerdo a la naturaleza del valor, define la manera que lo mostraremos por pantalla.
   * 
   * @param val Valor de la variable auxiliar
   * @returns Valor que una posicion de la variable auxiliar mostrara por pantalla
   */
   defineAuxText(val : any){
    if(val && val.iLeft != undefined && val.iRight != undefined){
      return "["+ val.iLeft + ","+ val.iRight + "]";
    }
    else if(val && val.length >= 1){
      return "["+ val + "]";
    }
    return val;
  }

  /**
   * Define el background color una posicion teniendo en cuenta el indice actual(definido por
   * el ngFor en el html) y el iStart sobre el cual esta recorriendo el ngFor en la vista.
   * 
   * @param colorList Lista de colores que define que color debera poseer cada indice
   * @param iStart iStart del display status(explicado en la seccion correspondiente)
   * @param curIndex Indice del ngFor en el html
   * @returns Background color del indice establecido de la variable auxiliar. En caso de no
   * tenerlo se retorna 'transparent'
   */
   getAuxVarBC(colorList : string[], iStart: number, curIndex: number){
    if(colorList[iStart + curIndex] != ""){
        return colorList[iStart + curIndex];
      }
    return "transparent";
  }

  /**
   * Define el ancho que puede ocupar cada indice del array de la variable auxiliar
   * en concordancia con la naturaleza del valor de cada indice
   * @param value Valor del indice
   * @returns Width que tomaran los indices de la variable auxilar.
   */
   defineAuxVarWidth(value : any){
    if(value == undefined){
      return "10000";//Para que el display sea 0
    }
    else if(value.iLeft != undefined && value.iRight != undefined){
      return "90";
    }
    else if(value.length == 2){
      return "90";
    }
    return "45";
  }

  /**
   * Realiza un update del display status en donde se realizan diversos calculos teniendo en cuenta
   * la naturaleza de los valores de las diversas variables y la longitud de la seccion en la que se encuentra
   * para calcular no solo la cantidad de elementos que nos podemos permitir mostrar por pantalla sino 
   * a su vez definir en base a eso el displayStatus en pos de que en base a eso realizamos el display
   * de ciertos elementos en la vista del html o no.
   */
   updateDisplayStatus(){
    for(let i=0; i<this.auxVarList.length; i++){
      let auxVar = this.auxVarList[i];
      let lenCanDisplay : number = Math.floor(350 / (+this.defineAuxVarWidth(auxVar.data[0])));
      let inStart = lenCanDisplay >= auxVar.dataSize ? 0 : auxVar.priorityIndex;
      let inEnd = inStart + lenCanDisplay >= auxVar.dataSize ? auxVar.dataSize : inStart + lenCanDisplay;
      let displayStatus : DisplayStatus = {
        leftHiding : (auxVar.priorityIndex > 0) &&  (auxVar.dataSize > lenCanDisplay),
        rightHiding :  (auxVar.priorityIndex + lenCanDisplay) < auxVar.dataSize,
        iStart : inStart,
        iEnd : inEnd
        };
      auxVar.displayStatus = displayStatus;
    }
  }
}
