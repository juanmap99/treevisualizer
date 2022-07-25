import { Injectable } from '@angular/core';
import { BehaviorSubject, iif } from 'rxjs';
import { AuxVarService } from 'src/app/trees/services/aux-var.service';
import { Tree } from '../model/Tree';
import { TreeChange } from '../model/TreeChange';
import { TreeNode } from '../model/TreeNode';
import { AVL } from '../model/trees/AVL';
import { BST } from '../model/trees/BST';
import { MaxHeap } from '../model/trees/MaxHeap';
import { MinHeap } from '../model/trees/MinHeap';
import { RBT } from '../model/trees/RBT';
import { Treap} from '../model/trees/Treap';


interface ArrayFillQueue{
  node: TreeNode,
  index : number
}

@Injectable({
  providedIn: 'root'
})
export class TreeControllerService {
  arbol : Tree;
  arbolType : string = "BST";
  treeObs : BehaviorSubject<Tree>;
  defaultSize : number = 1;

  levelWiseTreeArray : TreeNode[];
  treeArrayObs : BehaviorSubject<TreeNode[]>;

  constructor(private auxService : AuxVarService) { 
    this.arbol = new BST(this.defaultSize,auxService);
    this.levelWiseTreeArray = this.getArrayRepresentation();
    this.treeObs = new BehaviorSubject(this.arbol);
    this.treeArrayObs = new BehaviorSubject(this.levelWiseTreeArray);

    this.arbol.changeObs.subscribe((newChange : TreeChange) =>{
      this.arbol.updateTree(newChange.root,newChange.size);
      this.updateTreeObs();
      this.updateArrayRepresentation();
    })
  }

  /**
   * Calcula la profundidad de un arbol
   * @returns Entero que representa la profundidad de un arbol
   */
  getTreeDepth() : number{
    let root : TreeNode = this.arbol.root;
    if(root.valor == -999){
      return -1;
    }

    let treeDepth = (curNode : TreeNode, depth : number) : number =>{
      let lDepth = 0;
      let rDepth = 0;
      if(curNode.lChild){
        //console.log("Entro a la izquierda")
        lDepth = treeDepth(curNode.lChild,depth+1);
      }
      if(curNode.rChild){
        //console.log("Entro a la derecha")
        rDepth = treeDepth(curNode.rChild, depth+1);
      }
      return Math.max(lDepth,rDepth,depth);
    }

    return treeDepth(root,0);
  }

  /**
   * Actualiza la representación del arbol en formato array y actualiza su observable.
   */
  updateArrayRepresentation(){
    this.levelWiseTreeArray = this.getArrayRepresentation();
    this.updateTreeArrayObs();
  }

  /**
   * Dado un nodo, retorna la posicion en la que se encuentra el padre.
   * 
   * @param index Indice que representa la posicion de un nodo
   * @returns Entero que representa el indice del padre en un array
   */
  getParentIndex(index : number) : number{
    let par : boolean = (index % 2) == 0;
    let parent = 0;
    if(par){
      parent = (index -2) / 2;
    }
    else{
      parent = (index -1) / 2;
    }
    return parent;
  }

  /**
   * Inicializa un array con una longitud igual a la cantidad maxima de nodos permitidos
   * en la profundidad actual del arbol en donde todos los elementos seran instancias de
   * TreeNode con valor -1.
   */
  inicializeArrayRepresentation() : TreeNode[]{
    if(this.arbolType != "RBT"){
      let depth = this.getTreeDepth();
      let sizeArray = Math.pow(2,(depth+1))-1;
      let arrayRep : TreeNode[] = [];
      for(let i= 0; i < sizeArray; i++){
        arrayRep.push(new TreeNode(-999));
      }
      return arrayRep;
    }
    else{
      let depth = this.getTreeDepth();
      let sizeArray = Math.pow(2,(depth+2))-1;
      let arrayRep : TreeNode[] = [];
      for(let i= 0; i < sizeArray; i++){
        arrayRep.push(new TreeNode(-999));
      }
      return arrayRep;
    }
  }

  /**
   * Recorre el arbol y genera una representacion en formato array del mismo de manera tal
   * que el orden en el array sea relativo a la altura del nodo en el arbol, en donde se colocaran
   * primero los nodos mas a la izquierda cuando se trate de nodos que se encuentren
   * en una misma altura.
   */
  getArrayRepresentation() : TreeNode[]{
    if(this.arbol.size == 0){
      return [];
    }
    if(this.arbolType != "RBT"){
      let queue : ArrayFillQueue[] = [{node: this.arbol.root, index:0}];//Index, Nodo;
      let arrayRepr : TreeNode[] = this.inicializeArrayRepresentation();
      while(queue.length != 0){
        let elem = queue.shift();
        let curNode : TreeNode = (elem != undefined) ? elem.node : new TreeNode(0);//Siempre va a existir
        let index : number = (elem != undefined) ? elem.index : 0;//Siempre va a existir
        arrayRepr[index] = curNode;
        if(curNode.lChild){
          queue.push({node:curNode.lChild,index:(index*2)+1});
        }
        if(curNode.rChild){
          queue.push({node:curNode.rChild,index:(index*2)+2});
        }
      }
      return arrayRepr;
    }
    else{
      let queue : ArrayFillQueue[] = [{node: this.arbol.root, index:0}];//Index, Nodo;
      let arrayRepr : TreeNode[] = this.inicializeArrayRepresentation();
      while(queue.length != 0){
        let elem = queue.shift();
        let curNode : TreeNode = (elem != undefined) ? elem.node : new TreeNode(-1000);//Siempre va a existir
        let index : number = (elem != undefined) ? elem.index : 0;//Siempre va a existir
        arrayRepr[index] = curNode;
        if(curNode.valor != -1000 && curNode.valor !=-999){
          if(curNode.lChild){
            queue.push({node:curNode.lChild,index:(index*2)+1});
          }
          else{
            queue.push({node:new TreeNode(-1000,undefined,undefined,curNode,"#1a1919"),index:(index*2)+1});
          }
        }
        if(curNode.valor != -1000 && curNode.valor !=-999){
          if(curNode.rChild){
            queue.push({node:curNode.rChild,index:(index*2)+2});
          }
          else{
            queue.push({node:new TreeNode(-1000,undefined,undefined,curNode,"#1a1919"),index:(index*2)+2});
          }
        }
      }
      return arrayRepr;
    }
  }

  /**
   * Setea el defaultSize al valor enviado por parametro. Este valor determinara la cantidad
   * de nodos que se colocan por default sobre el arbol en el proceso de inicialización del mismo.
   * 
   * @param defSize Entero que representa el tamaño default de un arbol
   */
  async setDefaultSize(defSize: number){
    this.defaultSize = defSize;
    await this.setArbol(this.arbolType,defSize);
  }

  /**
   * Genera una instancia valida de un arbol de acuerdo al codigo solicitado por parametro.
   * 
   * @param arbolType String que representa el arbol a instanciar
   * @param size Valor numerico que representa la cantidad de nodos con los que se inicializara el arbol.
   */
   async setArbol(arbolType: string, size : number = this.defaultSize){
    this.arbolType = arbolType;
    switch(arbolType){
      case("AVLTree"):
        this.arbol = new AVL(size,this.auxService);
        break;
      case("RBT"):
        this.arbol = new RBT(size,this.auxService);
        break;
      case("MaxHeap"):
        this.arbol = new MaxHeap(size,this.auxService);
        break;
      case("MinHeap"):
        this.arbol = new MinHeap(size,this.auxService);
        break;
      case("Treap"):
        this.arbol = new Treap(size,this.auxService);
        break;
      default:
        this.arbol = new BST(size,this.auxService);
        break;  
    }
    await this.arbol.inicializarArbol(this.arbol.size)
    this.arbol.changeObs.subscribe((newChange : TreeChange) =>{
      this.arbol.updateTree(newChange.root,newChange.size);
      this.updateTreeObs();
      this.updateArrayRepresentation();
    })
    this.levelWiseTreeArray = this.getArrayRepresentation();
    this.updateTreeObs();
    this.updateTreeArrayObs();
  }
  
  /**
   * Actualiza el observable de la variable que determina la representación a nivel array del array.
   */
  updateTreeArrayObs(){
    this.treeArrayObs.next(this.levelWiseTreeArray);
  }

  /**
   * Actualiza el observable de la variable que determina el arbol a ejecutar.
   */
  updateTreeObs(){
    this.treeObs.next(this.arbol);  
  }

  /**
   * 
   * @param valor Entero que representa el valor a agregar
   * @returns True si el agregado de el entero otorgado genera una quinta capa en el arbol, False en caso contrario
   */
  generaQuintaCapa(valor : number) : boolean{
    return this.arbol.adicionGeneraQuintaCapa(valor);
  }
}
