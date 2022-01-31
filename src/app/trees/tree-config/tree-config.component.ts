import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { TreeRunParams } from '../model/TreeParams';
import { TreeControllerService } from '../services/tree-controller.service';
import { TreeRunningControllerService } from '../services/tree-running-controller.service';
import { SextaCapaErrorComponent } from '../sexta-capa-error/sexta-capa-error.component';

@Component({
  selector: 'app-tree-config',
  templateUrl: './tree-config.component.html',
  styleUrls: ['./tree-config.component.scss']
})
export class TreeConfigComponent implements OnInit {
  codeIcon = faCode;
  lbulbIcon = faLightbulb;
  playButton = faPlay;
  running : boolean = false;
  
  treeSize : number = 1;
  treeSizeChange : boolean = false;
  runSpeed: number = 1;
  metodoElegido : string = "Add";
  elemValue : number = 0;
  disableNode : boolean = false;
  treeType : string = "BST";
  generatedNode : number;
  validChars : Map<string,boolean>;

  //@Output() runEvent = new EventEmitter<RunParams>();
  @Output() explEvent = new EventEmitter<string>();
  @Output() codeEvent = new EventEmitter<string>();
  @Output() trResizeEvent = new EventEmitter<number>();
  @Output() runParamsEvent = new EventEmitter<TreeRunParams>();
  
  constructor(private runServ : TreeRunningControllerService,
              private treContr: TreeControllerService,
              private dialog : MatDialog) { 
                this.treContr.treeObs.subscribe(newTree => this.treeType = newTree.tipoArbol);
                this.runServ.runObs.subscribe(runStatus => this.running = runStatus);
                this.generatedNode = 0;
                this.validChars = this.setUpValidCharsDic();
    }

  ngOnInit(): void {
  }

  /**
   * Instancia un diccionario de caracteres aceptables para la generación del valor del nodo.
   */
  setUpValidCharsDic() : Map<string,boolean>{
    let validChars = new Map<string,boolean>();
    validChars.set("0",true);
    validChars.set("1",true);
    validChars.set("2",true);
    validChars.set("3",true);
    validChars.set("4",true);
    validChars.set("5",true);
    validChars.set("6",true);
    validChars.set("7",true);
    validChars.set("8",true);
    validChars.set("9",true);
    return validChars;
  }

  runProgram(){
    let execute = true;
    let metodoCorrer = this.metodoElegido;

    if(metodoCorrer == "Add"){
      if(this.treContr.generaQuintaCapa(this.generatedNode)){
        this.dialog.open(SextaCapaErrorComponent);
        execute = false;
      }
    }
    if(metodoCorrer == "Pop"){
      metodoCorrer = "Delete";
    }
    let runParams : TreeRunParams = {
      vel : this.runSpeed,
      metodo : metodoCorrer,
      valor : this.generatedNode
    }
    if(execute){
      this.runParamsEvent.emit(runParams);
    }
  }

  /**
   * Evento emitido cuando el usuario realiza un click sobre el boton 'Explicacion'. El mismo
   * sera atrapado por el app.component que abrira el modal con la explicacion requerida.
   */
   emitExplanationEvent(){
    this.explEvent.emit();
  }

  /**
   * Evento emitido cuando el usuario realiza un click sobre el boton 'Codigo'. El mismo
   * sera atrapado por el app.component que abrira el modal con el codigo requerido.
   */
  emitCodeDisplayEvent(){
    this.codeEvent.emit();
  }

  /**
   * Setea el metodo a ejecutar sobre el arbol.
   * 
   * @param elem Elemento que representa el evento de cambio en el select de metodo.
   */
  setMethod(elem: any ){
    this.disableNode  = false;
    this.metodoElegido = elem.target.value;
    if(this.metodoElegido == "FindMax" || this.metodoElegido == "FindMin" || this.metodoElegido == "Pop"){
      this.disableNode  = true;
      this.elemValue = 0;
      this.generatedNode = 0;
    }
  }

  /**
   * Setea la velocidad de ejecución en base a lo elegido por el usuario.
   * 
   * @param elem Elemento que representa el evento de cambio en el select de velocidad.
   */
  setVelocidad(elem : any){
    this.runSpeed = parseInt(elem.target.value);
  }


  setAltura(elem : any){
    //this.treeSizeChange = true;
    this.treeSize =  Math.pow(2,parseInt(elem.target.value)) - 1;
  }

  ajustarAltura(){
    /*if(this.treeSizeChange){
      this.trResizeEvent.emit(this.treeSize);
      this.treeSizeChange = false;
    }*/
    this.trResizeEvent.emit(this.treeSize);
    this.treeSizeChange = false;
  }

  adjustTreeSize(treeSize: MatSliderChange){
    if (treeSize.value){
      this.treeSize = treeSize.value;
    }
    this.trResizeEvent.emit(this.treeSize);
  }

  /**
   * Metodo que retorna true si el tipo de arbol seleccionado es una min heap, false en caso contrario
   * 
   * @returns True si el tipo de arbol seleccionado es una min heap, false en caso contrario
   */
  minHeap() : boolean{
    if(this.treeType == "MinHeap"){
      return true;
    }
    return false;
  }

  /**
   * Metodo que retorna true si el tipo de arbol seleccionado es una max heap, false en caso contrario
   * 
   * @returns True si el tipo de arbol seleccionado es una max heap, false en caso contrario
   */
   maxHeap() : boolean{
    if(this.treeType == "MaxHeap"){
      return true;
    }
    return false;
  }

  /**
   * 
   * @returns True si el árbol elegido es un Treap, False en caso contrario.
   */
  isTreap(): boolean{
    if(this.treeType == "Treap"){
      return true;
    }
    return false;
  }

  /**
   * Metodo que retorna true si el tipo de arbol seleccionado no son heaps, false en caso contrario
   * 
   * @returns True si el tipo de arbol seleccionado no son heaps, false en caso contrario
   */
  notHeaps() : boolean{
    if(this.maxHeap() || this.minHeap()){
      return false;
    }
    return true;
  }

  /**
   * Mapea el string a un numero valido. En caso de no se valido, devuelve 0.
   * 
   * @param data String que representa el contenido del input del nodo a generar
   */
  getNumberRep(data : string) : number{
    if(data.length == 0){
      return 0;
    }
    let neg = false;
    if(data[0] == "-" || data[0] == "+"){
      if(data[0] == "-"){
        neg = true;
      }
      if(data.length > 1){
        data = data.substring(1);
      }
    }
    let number = 0;
    let allNumbers = true;
    for(let i=0; i<data.length; i++){
      let isValid = this.validChars.get(data[i]);
      if(!isValid){
        allNumbers = false;
      }
    }
    if(allNumbers){
      number = parseInt(data);
    }
    if(neg){
      number = 0 - number;
    }
    return number;
  }

  /**
   * Mapea el string enviado a un numero valido que se usara para definir el valor del nodo
   * a generar en la ejecucion del programa.
   * 
   * @param data String que representa el contenido del input del nodo a generar
   */
  nodeValueChanged(data: string){
    this.generatedNode = this.getNumberRep(data);
  }
}
