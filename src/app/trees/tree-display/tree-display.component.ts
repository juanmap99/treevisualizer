import { Component, HostListener, OnInit } from '@angular/core';
import { Dimensions } from '../model/Dimensions';
import { TreeNode } from '../model/TreeNode';
import { ContainerSizeService } from '../services/container-size-service';
import { TreeControllerService } from '../services/tree-controller.service';

@Component({
  selector: 'app-tree-display',
  templateUrl: './tree-display.component.html',
  styleUrls: ['./tree-display.component.scss']
})
export class TreeDisplayComponent implements OnInit {
  treeArrayRepr : TreeNode[];

  containerHeight : number = 0;
  containerWidth : number = 0;
  dotSize : number = 0;
  elWidth : number = 0;
  fontSize : number = 0;

  nodesPosition : Map<number,number>;
  treeSize : number;

  execBodyDimension : Dimensions = {width:0, height:0};
  lineSize : number = 0;

  constructor(private treeContrServ : TreeControllerService,
              private boxSizeServ: ContainerSizeService) { 
                this.treeArrayRepr = [];
                this.treeSize = 0;
                this.treeArrayRepr = this.treeContrServ.levelWiseTreeArray;
                this.nodesPosition = new Map<number,number>();
                this.treeContrServ.treeArrayObs.subscribe(newArray => {
                  this.treeArrayRepr = newArray;
                  this.treeSize = newArray.length;
                  this.updateSizeDependantVar();
                });
                this.boxSizeServ.execBodyDimObs.subscribe(dim =>{
                  this.execBodyDimension = dim;
                  this.updateSizeDependantVar();
                })
  }

  ngOnInit(): void {
    this.updateSizeDependantVar();
  }


   /**
   * Devuelve la altura en la que se encuentra un nodo.
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns Entero que representa la altura en el arbol en la que se encuentre el nodo
   */
  getDepth(iNodo : number){
    return Math.floor(Math.log2(iNodo+1));
  }

  /**
  * Retorna el tamaño optimo que deben poseer los nodos tomando en cuenta la altura del arbol
  * y la cantidad de nodos que el mismo tendra en el peor de los casos en su altura maxima.
  * 
  * @returns Entero que representa el tamaño optimo(siendo el mismo el mas grande posible) que deben tener los nodos
  */
  calculateDotSize() : number{
    //console.log("El tamaño del arbol es " + (this.treeContrServ.arbol.size-1))
    let depth = this.getDepth(this.treeSize-1);
    let longestRow = Math.pow(2,depth);
    let lengthWise = this.containerWidth > 920 ? this.containerWidth : 920;//1270 widht - 350 config bar
    let heightWise = this.containerHeight > 800 ? this.containerHeight : 800;
    let possibleHeightWise = (heightWise - (45*(depth+2))) /(depth+1) ;//45px de margen vertical
    let possibleWidthWise = (lengthWise - (15*(longestRow+1))) / longestRow;//45p de margen horizontal
    let optimo = Math.min(possibleHeightWise,possibleWidthWise);
    optimo = optimo > 350 ? 350 : optimo;//Limitamos tamaño maximo
    optimo = optimo < 35 ? 35 : optimo;//Limitamos tamaño minimo
    return optimo;//Retornamos el optimo
  }

  /**
   * Calcula el indice del nodo padre al nodo enviado por parametro.
   * 
   * @param iNode Entero que representa el indice de un nodo en un arbol binario
   * @returns Entero que representa el indice del nodo padre
   */
   getParent(iNode : number) : number{
    //Los indices impares son nodos izquierdos, los pares son nodos derechos
    let par : boolean = (iNode % 2) == 0;
    let parent = 0;
    if(par){
      parent = (iNode -2) / 2;
    }
    else{
      parent = (iNode -1) / 2;
    }
    return parent;
  }

  /**
   * Dado un nodo en un arbol binario calcula la posicion de su hijo izquierdo y derecho.
   * 
   * @param iNode Entero que representa el indice de un nodo en un arbol binario
   * @returns Lista de dos elementos que contiene al hijo izquierdo en la posicion 0 y 
   *          al hijo derecho en la posicion 1
   */
  getLeftRightChild(iNode : number) : number[]{
    let hijoIzquierdo = (iNode*2)+1;
    let hijoDerecho = (iNode*2)+2;
    return [hijoIzquierdo,hijoDerecho];
  }

  /**
   * Devuelve un entero que representa el index que tendra el primer elemento en esa altura,
   * el cual esta dado por: Cantidad de nodos capas previas -1(porque contamos desde el 0)
   * 
   * @param depth : Indice que representa una altura en un arbol
   * @returns Devuelve un entero que representa el index que tendra el primer elemento en esa altura,
   * el cual esta dado por: Cantidad de nodos capas previas -1(porque contamos desde el 0)
   */
   firstElemDepthIndex(depth: number) : number{
    if(depth == 0){
      return 0;
    }
    let cantNodesBefore = 1; //En la capa 0 hay un nodo
    for(let i=1; i<depth;i++){
      cantNodesBefore += Math.pow(2,i);
    }
    return cantNodesBefore;
  }

  /**
   * Calcula la right-distance y la coloca sobre el diccionario de todos los nodos pertenecientes
   * a la altura dada por el entero recibido por parametro.
   * 
   * @param depth Entero que representa la profundidad en un arbol 
   */
  fillNodePositionDepthX(depth : number){
    /** 
    if(depth == 0){//El nodo root se coloca siempre en el medio para garantizar simetria.
      this.nodesPosition.set(0,(this.containerWidth/ 2) -(this.dotSize/2))
    }
    */
    if(this.treeSize == 1){
      this.nodesPosition.set(0,(this.containerWidth/2) - (this.dotSize/2));
    }
    else if(depth == this.getDepth(this.treeSize-1)){
      //Ultima fila recibe trato diferente ya que seguimos una estrategia bottom-up
      let nodes = Math.pow(2,depth);
      let spacing = (this.containerWidth-(this.dotSize*nodes))/ (nodes+1);
      let firstIndex = this.firstElemDepthIndex(depth);
      for(let i = firstIndex; i<firstIndex+nodes; i++){
        if(i == firstIndex){
          this.nodesPosition.set(i,this.containerWidth-spacing - this.dotSize + (this.dotSize/5));
        }
        else{
          let leftNeighbourNode = this.nodesPosition.get(i-1);
          if(leftNeighbourNode){//Siempre va a existir
            this.nodesPosition.set(i,leftNeighbourNode-spacing - this.dotSize);
          }
        }   
      }
    }
    else{//La posicion de las alturas intermedias dependen de la posicion de sus hijos
      let nodes = Math.pow(2,depth);
      let firstIndex = this.firstElemDepthIndex(depth);
      for(let i = firstIndex; i<firstIndex+nodes; i++){
        let childs = this.getLeftRightChild(i);
        let leftChildPos = this.nodesPosition.get(childs[0]);
        let rightChildPos = this.nodesPosition.get(childs[1]);

        if(leftChildPos && rightChildPos){//Siempre van a existir
          let center = (leftChildPos + (this.dotSize/2)) + ((rightChildPos - leftChildPos - this.dotSize) / 2);
          this.nodesPosition.set(i,center);
        }
      }
    }
  }

  /**
   * Rellena el diccionario nodesPosition en donde se encontrara la right-distance que tendran que
   * tener en la posicion absoluta para con el contenedor.
   */
  fillNodesPositionDic(){
    let depth = this.getDepth(this.treeSize-1);
    for(let i=depth; i>-1; i--){
      this.fillNodePositionDepthX(i);
    }
  }

   /**
    * Realiza un update de las variables que impactan en el tamaño de ciertos elementos en la vista.
    */
  updateSizeDependantVar(){
    this.containerHeight = this.execBodyDimension.height * 0.95
    this.containerWidth = this.execBodyDimension.width-30-30
    //this.containerHeight = (this.scHeight - 84 - 260) * 0.95; //84px de la nav, 260px de las var aux
    this.containerHeight = this.containerHeight < 500 ? 500 : this.containerHeight;
    //this.containerWidth = this.scWidth > 1240 ? (this.scWidth-350-30-30): 830;//300px configuracion  30 de margen de ambos lados
    this.dotSize = this.calculateDotSize();
    this.fontSize = this.dotSize/3;
    this.fontSize = this.fontSize < 8 ? 8 : this.fontSize;
    this.fillNodesPositionDic();
    this.lineSize = this.getLineSize(this.containerWidth);
  }

  getLineSize(width : number) : number{
    if(width < 1100){
      return 1;
    }
    if(width < 2600){
      return 2;
    }
    if(width < 2900){
      return 3;
    }
    return 4;
  }


  /**
   * Entero que representa la distancia top absoluta que debe tomar el nodo para
   * con su contenedor padre para estar ubicado en la altura en la que se encuentra en el arbol
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns Entero que representa la distancia top absoluta que debe tomar el nodo para
   * con su contenedor padre para estar ubicado en la altura en la que se encuentra en el arbol
   */
  getTopDistance(iNodo : number){
    let depth = this.getDepth(iNodo);
    return (depth*this.dotSize) + (45*depth) + 45;
    /**
     * Tamaño del dot*depth: Cantidad que hay arriba
     * 45*depth: Gap entre niveles.
     * 45 : Gap de la capa 0 contra el top.
     */
  }

  /**
   * Entero que representa la distancia right absoluta que debe tomar el nodo para
   * con su contenedor padre para estar ubicado en la posicion en la que se encuentra en la altura
   * en la que se encuentra ubicado en el arbol.
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns Entero que representa la distancia right absoluta que debe tomar el nodo para
   * con su contenedor padre para estar ubicado en la posicion en la que se encuentra en la altura
   * en la que se encuentra ubicado en el arbol.
   */
  getRightDistance(iNodo : number) : number{
    let rightDistance = this.nodesPosition.get(iNodo);
    if(rightDistance){//Siempre va a existir
      return rightDistance;
    }
    else{//Nunca va a entrar aca
      return 0;
    }
  }

  /**
   * Devuelve True en caso que el nodo no pertenesca a la ultima profundidad del arbol, False
   * en caso contrario.
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns False si el nodo se encuentra en la profundidad ultima del arbol, True en caso contrario
   */
  notLastDepth(iNodo: number) : boolean{
    let nodeDepth = this.getDepth(iNodo);
    let treeDepth = this.getDepth(this.treeSize-1);
    return nodeDepth != treeDepth;
  }

  /**
   * Calcula la distacia absoluta entre un nodo padre con su hijo izquierdo en el eje X 
   * ajustando con el tamaño del circulo.
   * 
   * @param iNodoOr Entero que representa el nodo desde el cual parte la linea
   * @param iNodoDes Entero que representa el nodo al que llega la linea
   * @returns Distancia absoluta en el eje X entre un nodo padre y hijo izquierdo
   */
   calcDistancaAbsXLeft(iNodoOr:number, iNodoDes:number) : number{
    let xOrig = this.nodesPosition.get(iNodoOr);
    let xDest = this.nodesPosition.get(iNodoDes);
    if(xOrig && xDest){//Siempre van a existir.
      return Math.abs(xOrig - xDest + (this.dotSize/2));
    }
    return 0;//No va a llegar aca
  }

  /**
   * Calcula la distacia absoluta entre un nodo padre con su hijo derecho en el eje X 
   * ajustando con el tamaño del circulo.
   * 
   * @param iNodoOr Entero que representa el nodo desde el cual parte la linea
   * @param iNodoDes Entero que representa el nodo al que llega la linea
   * @returns Distancia absoluta en el eje X entre un nodo padre y hijo derecho
   */
   calcDistancaAbsXRight(iNodoOr:number, iNodoDes:number) : number{
    let xOrig = this.nodesPosition.get(iNodoOr);
    let xDest = this.nodesPosition.get(iNodoDes);
    if(xOrig && xDest){//Siempre van a existir.
      return Math.abs(xOrig - xDest - (this.dotSize/2));
    }
    return 0;//No va a llegar aca
  }

  /**
   * Entero que representa la distancia top absoluta que debe tomar la linea de coneccion del nodo para
   * con su contenedor padre para que conecte al nodo en cuestion
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns Entero que representa la distancia top absoluta que debe tomar la linea de coneccion del nodo para
   * con su contenedor padre para que conecte al nodo en cuestion
   */
  topDistanceLinea(iNodo: number){
    let depth = this.getDepth(iNodo);
    return (depth*this.dotSize) + (45*depth) + 45 + (this.dotSize/2);
  }

  /**
   * rightDistanceLeftStraightLine. Calcula la distancia right absoluta de la linea que va
   * en 180 grados desde el padre al hijo izquierdo.
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   */
  rightDistanceLSL(iNodo:number) : number{
    let distRight = this.nodesPosition.get(iNodo);
    if(distRight){
      return distRight + this.dotSize;
    }
    return 0//Nunca llega aca
  }

  /**
   * leftDistanceLeftStraightLine. Calcula la distancia left absoluta de la linea que va
   * en 180 grados desde el hijo derecho hacia el padre.
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   */
  rightDistanceRSL(iNodo:number) : number{
    let distRight = this.nodesPosition.get(iNodo);
    if(distRight){
      return distRight - this.calcDistancaAbsXRight(iNodo,(iNodo*2)+2);
    }
    return 0//Nunca llega aca
  }

  /**
   * rightDistanceLeftDownLine. Calcula la distancia right absoluta de la linea que baja
   * en 90 grados desde el padre al hijo izquierdo.
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   */
  rightDistanceLDL(iNodo:number) : number{
    return this.rightDistanceLSL(iNodo) + this.calcDistancaAbsXLeft(iNodo,(iNodo*2)+1);
  }

  /**
   * rightDistanceRightDownLine. Calcula la distancia right absoluta de la linea que baja
   * en 90 grados desde el padre al hijo derecho.
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   */
  rightDistanceRDL(iNodo:number) : number{
    return this.rightDistanceRSL(iNodo);
  }

  /**
   * Metodo que determina si un nodo posee un hijo izquierdo establecido en el arbol o no.
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns True si el nodo posee un hijo izquierdo, False en caso contrario
   */
  hasLeftChild(iNodo : number) : boolean{
    let isLeaf : boolean = this.treeSize <= ((iNodo*2) + 1);
    if(isLeaf){
      return false;
    }
    return this.nodeIsValid((iNodo*2) + 1);
  }

  /**
   * Metodo que determina si un nodo posee un hijo derecho establecido en el arbol o no.
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns True si el nodo posee un hijo derecho, False en caso contrario
   */
  hasRightChild(iNodo : number) : boolean{
    let isLeaf : boolean = this.treeSize <= ((iNodo*2) + 2);
    if(isLeaf){
      return false;
    }
    return this.nodeIsValid((iNodo*2) + 2);
  }

  /**
   * Metodo que determina si un nodo es valido o no, tomando como criterio si su valor es
   * -1 o no.(Solo aceptamos valores positivos en el display)
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns True si el nodo es valido, False en caso contrario
   */
  nodeIsValid(iNodo : number) : boolean{
    return this.treeArrayRepr[iNodo].valor != -999;
  }

  /**
   * Establece el color de la linea para con el hijo izquierdo de acuerdo al color
   * que posea
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns String que representa el color de la linea
   */
  colorLinLeftChild(iNodo : number){
    let leftChild = (iNodo*2) + 1;
    if(this.treeArrayRepr[leftChild].pointed == false){
      if(this.treeArrayRepr[leftChild].color == "#F39530"){
        return "#f39530";
      }
      else{
        return "#0D0A07";
      }
    }
    else{
      return "#f39530";
    }
  }

  /**
   * Establece el color de la linea para con el hijo derecho de acuerdo al color
   * que posea
   * 
   * @param iNodo Entero que representa el indice de un nodo en un arbol binario
   * @returns String que representa el color de la linea
   */
   colorLinRightChild(iNodo : number){
    let rightChild = (iNodo*2) + 2;
    if(this.treeArrayRepr[rightChild].pointed == false){
      if(this.treeArrayRepr[rightChild].color == "#F39530"){
        return "#f39530";
      }
      else{
        return "#0D0A07";
      }
    }
    else{
      return "#f39530";
    }
  }

  /**
   * Metodo que evalua si el árbol actual es un Treap o no.
   * 
   * @returns True si el arbol actual es un Treap, False en caso contrario
   */
  isTreap(){
    return this.treeContrServ.arbolType == "Treap";
  }
  
}
