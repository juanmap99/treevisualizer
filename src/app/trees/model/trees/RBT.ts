import { AuxVarService } from "src/app/trees/services/aux-var.service";
import { TreeNode } from "../TreeNode";
import { StandardTree } from "./StandardTree";

export class RBT extends StandardTree{

    constructor(size: number, auxService : AuxVarService){
        super(size,"RBT",auxService);

    }

    /**
     * Une el padre al nodo hijo y el nodo hijo al nodo padre.
     * 
     * @param child Nodo que cumplira el rol de hijo
     * @param parent Nodo que cumplira el rol de padre
     * @param side Señala que tipo de hijo el nodo child es.
     */
    linkNodes(child : TreeNode, parent : TreeNode, side: string){
        if(side == "left"){
            parent.setLChild(child);
            child.setParent(parent);
        }
        else if(side == "right"){
            parent.setRChild(child);
            child.setParent(parent);
        }
        else if(side == "root"){
            this.root = child;
            this.root.setParent();
        }
    }

    /**
     * Version Tree builder del agregado del nodo
     * @param curNode TreeNode que representa el nodo actual
     * @param nodeAdd TreeNode que representa el nodo a agregar
     */
     async treeBuilderAddNode(curNode: TreeNode, nodeAdd : TreeNode){
        curNode.pointNode();
        await this.delayByRunSpeed();
        if(curNode.valor > nodeAdd.valor){
            if(curNode.lChild){
                await this.treeBuilderAddNode(curNode.lChild,nodeAdd);
            }
            else{
                this.linkNodes(nodeAdd, curNode,"left");
                nodeAdd.pointNode();
                this.updateChangeObs();
                await this.delayByRunSpeed();
                this.setPointersToDefault();
                await this.fixTree(nodeAdd);
            }
        }
        else if (curNode.valor < nodeAdd.valor){
            if(curNode.rChild){
                await this.treeBuilderAddNode(curNode.rChild,nodeAdd);
            }
            else{
                this.linkNodes(nodeAdd, curNode,"right");
                nodeAdd.pointNode();
                this.updateChangeObs();
                await this.delayByRunSpeed();
                this.setPointersToDefault();
                await this.fixTree(nodeAdd);
            }
        }
    }
    
    /**
     * Analiza si un nodo es el dijo derecho de su padre.
     * 
     * @param child Nodo que juega el rol de hijo
     * @param parent Nodo que juega el rol de padre
     * @returns True si es el hijo derecho, False en caso contrario
     */
    isRigthChild(child: TreeNode, parent: TreeNode): boolean{
        if(parent.rChild){
            return parent.rChild.valor == child.valor;
        }
        return false;
    }

    /**
     * Devuelve el tio de un nodo en caso que exista, o un TreeNode con valor -1 en caso
     * contrario.
     * 
     * @param node Nodo el cual se desea conocer el tio
     * @returns Tio de un nodo en caso que exista, TreeNode(-1) en caso contrario.
     */
    getUncle(node : TreeNode) : TreeNode{
        let padre = node.getParent();
        let abuelo = padre?.getParent();
        if(abuelo){
            if(abuelo.rChild && padre && abuelo.rChild.valor == padre.valor && abuelo.lChild){
                return abuelo.lChild;
            }
            else if(abuelo.lChild && padre && abuelo.lChild.valor == padre.valor && abuelo.rChild){
                return abuelo.rChild;
            }
        }
        return new TreeNode(-999);
    }

    /**
     * Devuelve el abuelo de un nodo en caso que exista, o un TreeNode con valor -1 en caso
     * contrario.
     * 
     * @param node Nodo el cual se desea conocer el abuelo
     * @returns Abuelo de un nodo en caso que exista, TreeNode(-1) en caso contrario.
     */
    getGrandfather(node : TreeNode) : TreeNode{
        let abuelo = node.parent?.parent;
        if(abuelo){
            return abuelo;
        }
        return new TreeNode(-999);
    }

    /**
     * Devuelve el padre de un nodo en caso que exista, o un TreeNode con valor -1 en caso
     * contrario.
     * 
     * El metodo getParent/Uncle/Grandfather fueron diseñados por conveniencia para no tener que
     * hacer chekeos por valores indefinidos o chekeos que pueden ser evitados acerca si el color
     * default del nodo es rojo o negro porque en nuestro modelo eso es diferente. Esto va a hacer
     * que el metodo fixNode sea mucho mas legible y facil de entender.
     * 
     * @param node Nodo el cual se desea conocer el padre
     * @returns Padre de un nodo en caso que exista, TreeNode(-1) en caso contrario.
     */
    getParent(node : TreeNode) : TreeNode{
        let padre = node.parent;
        if(padre){
            return padre;
        }
        return new TreeNode(-999);
    }

    /**
     * Se retorna el hijo izquierdo de existir. En caso que no exista retorna TreeNode(-1).
     * 
     * //Funcion creada para simplificar ifs.
     * 
     * @param node Nodo sobre el cual se quiere conocer el hijo izquierdo
     */
    getLeftChild(node : TreeNode) : TreeNode{
        if(node.lChild){
            return node.lChild;
        }
        return new TreeNode(-999);
    }

    /**
     * Se retorna el hijo derecho de existir. En caso que no exista retorna TreeNode(-1).
     * 
     * //Funcion creada para simplificar ifs.
     * 
     * @param node Nodo sobre el cual se quiere conocer el hijo derecho
     */
     getRightChild(node : TreeNode) : TreeNode{
        if(node.rChild){
            return node.rChild;
        }
        return new TreeNode(-999);
    }

    /**
     * Genera una rotación hacia la derecha
     * @param node Nodo al que rotar a la derecha
     * @param rotCase Establece el caso de rotacion : boomearang: \ , recta /
     *                                                            /        /
     */
    rotateRight(node : TreeNode, rotCase: string){
        let parent = this.getParent(node);
        let abuelo = this.getGrandfather(node);
        
        if(rotCase == "boomerang"){
            let child = this.getLeftChild(node); 
            let previousRightChild = child?.rChild;
            if(parent.valor == -999){//Si no hay abuelo, es decir, el padre es el root
                this.root = child;
                child.setParent();
                this.linkNodes(parent,child,"right");
                if(previousRightChild){
                    this.linkNodes(previousRightChild,node,"left");
                }
                else{
                    node.setLChild(undefined);
                }
                node.setLChild(undefined);
            }
            else{
                this.linkNodes(node,child,"right");
                this.linkNodes(child,parent,"right");
                if(previousRightChild){
                    this.linkNodes(previousRightChild,node,"left");
                }
                else{
                    node.setLChild(undefined);
                }
            }
            
        }
        if(rotCase == "recta"){
            let child = node.getLChild();
            let previousRightChild = child?.rChild;
            if(child && node == this.root){//Si estamos rotando la root
                this.root = child;
                child.setParent();
                this.linkNodes(node,child,"right");
                if(previousRightChild){
                    this.linkNodes(previousRightChild,node,"left");
                }
                else{
                    node.setLChild(undefined);
                }
            }
            else if(child && node != this.root){
                if(this.isRigthChild(node,parent)){
                    this.linkNodes(child,parent,"right");
                }
                else{
                    this.linkNodes(child,parent,"left"); 
                }
                this.linkNodes(node,child,"right");
                if(previousRightChild){
                    this.linkNodes(previousRightChild,node,"left");
                }
                else{
                    node.setLChild(undefined);
                }
            }
        }
    }

    /**
     * Genera una rotación hacia la izquierda
     * @param node Nodo al que rotar a la izquierda
     * @param rotCase Establece el caso de rotacion : boomearang: / , recta \
     *                                                            \          \
     */
    rotateLeft(node : TreeNode, rotCase: string) {
        let parent = this.getParent(node);
        let abuelo = this.getGrandfather(node);
        
        if(rotCase == "boomerang"){
            let child = this.getRightChild(node); 
            let previousLeftChild = child?.lChild;
            if(parent.valor == -999){//Si no hay abuelo, es decir, el padre es el root
                this.root = child;
                child.setParent();
                this.linkNodes(parent,child,"left");
                if(previousLeftChild){
                    this.linkNodes(previousLeftChild,node,"right");
                }
                else{
                    node.setRChild(undefined)
                }
            }
            else{
                this.linkNodes(node,child,"left");
                this.linkNodes(child,parent,"left");
                if(previousLeftChild){
                    this.linkNodes(previousLeftChild,node,"right");
                }
                else{
                    node.setRChild(undefined)
                }
            }
            
        }
        if(rotCase == "recta"){
            let child = node.getRChild();
            let previousLeftChild = child?.lChild;
            if(child && node == this.root){//Si estamos rotando la root
                this.root = child;
                child.setParent(undefined);
                this.linkNodes(node,child,"left");
                if(previousLeftChild){
                    this.linkNodes(previousLeftChild,node,"right");
                }
                else{
                    node.setRChild(undefined);
                }
            }
            else if(child && node != this.root){
                if(this.isRigthChild(node,parent)){
                    this.linkNodes(child,parent,"right");
                }
                else{
                    this.linkNodes(child,parent,"left"); 
                }
                this.linkNodes(node,child,"left");
                if(previousLeftChild){
                    this.linkNodes(previousLeftChild,node,"right");
                }
                else{
                    node.setRChild(undefined);
                }
            }
        }
    }

    /**
     * Analiza el caso en el que el arbol se encuentra tras haber agregado el nodo enviado
     * por parametro y actua en consecuencia para garantizar el balanceo.
     * 
     * @param nodeAdd Ultimo nodo agregado
     */
    async fixTree(nodeAdded : TreeNode){
        await this.delayByRunSpeed();
        let parent = this.getParent(nodeAdded);
        let uncle = this.getUncle(nodeAdded);
        let abuelo = this.getGrandfather(nodeAdded);
        let curNode = nodeAdded;
        while(parent.color == this.redColor && curNode != this.root){
            await this.delayByRunSpeed();
            await this.delayByRunSpeed();
            //Caso cambio de colores debido a nPadreRojo,nTioRojo, nAbueloNegro
            if(uncle.color == this.redColor){
                uncle.setColor(this.blackColor);
                parent.setColor(this.blackColor);
                abuelo.setColor(this.redColor);
                curNode = abuelo;
                await this.delayByRunSpeed();
                await this.delayByRunSpeed();
                await this.delayByRunSpeed();
            }
            //Caso rotacion es necesaria, line de 3.
            else{
                //nAbuelo->nPadreRightChild->curNodeLeftChild = RightRotation + LeftRotation
                if(!this.isRigthChild(curNode,parent) && this.isRigthChild(parent,abuelo)){
                    this.rotateRight(parent,"boomerang");
                    this.updateChangeObs();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    this.rotateLeft(abuelo,"recta");
                    this.updateChangeObs();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    curNode.setColor(this.blackColor);
                    abuelo.setColor(this.redColor);
                    parent.setColor(this.redColor);
                    //Cur nodo quedo como padre, entonces:
                    curNode = this.getParent(curNode);
                }
                //nAbuelo->nPadreLeftChild->curNodeRightChild = LeftRotation + RightRotation
                else if(this.isRigthChild(curNode,parent) && !this.isRigthChild(parent,abuelo)){
                    this.rotateLeft(parent,"boomerang");
                    this.updateChangeObs();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    this.rotateRight(abuelo,"recta");
                    this.updateChangeObs();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    curNode.setColor(this.blackColor);
                    abuelo.setColor(this.redColor);
                    parent.setColor(this.redColor);
                    //Cur nodo quedo como padre, entonces:
                    curNode = this.getParent(curNode);
                }
                //nAbuelo->nPadreRightChild->curNodeRightChild = LeftRotation
                else if(this.isRigthChild(curNode,parent) && this.isRigthChild(parent,abuelo)){
                    this.rotateLeft(abuelo,"recta");
                    this.updateChangeObs();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    parent.setColor(this.blackColor);
                    abuelo.setColor(this.redColor);
                    curNode.setColor(this.redColor);
                    //Parent quedo como padre, entonces
                    curNode = this.getParent(parent);
                }
                //nAbuelo->nPadreLeftChild->curNodeLeftChild = RightRotation
                else if(!this.isRigthChild(curNode,parent) && !this.isRigthChild(parent,abuelo)){
                    this.rotateRight(abuelo,"recta");
                    this.updateChangeObs();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    await this.delayByRunSpeed();
                    parent.setColor(this.blackColor);
                    abuelo.setColor(this.redColor);
                    curNode.setColor(this.redColor);
                    //Parent quedo como padre, entonces
                    curNode = this.getParent(parent);
                }
            }
            parent = this.getParent(curNode);
            uncle = this.getUncle(curNode);
            abuelo = this.getGrandfather(curNode);
        }
        this.root.setColor(this.blackColor);
    }

    async treeBuilderAdd(valor : number) : Promise<any>{
        let delay = this.delay;
        this.delay = 0;
        let newNode = new TreeNode(valor);
        newNode.setColor(this.redColor);
        if(this.root.valor == -999){
            newNode.setColor(this.blackColor);
            this.root = newNode;
        }
        else{
            let curNode = this.root;
            await this.treeBuilderAddNode(curNode,newNode);
        }
        this.size = this.calculateSize();
        this.updateChangeObs();
        this.delay = delay;
    }

    async add(valor: number) : Promise<string> {
        let newNode = new TreeNode(valor);
        newNode.setColor(this.redColor);
        if(this.root.valor == -999){
            newNode.setColor(this.blackColor);
            this.root = newNode;
        }
        else{
            let curNode = this.root;
            await this.treeBuilderAddNode(curNode,newNode);
            this.setPointersToDefault();
        }
        this.size = this.calculateSize();
        this.updateChangeObs();
        return "Done";
    }


    /**
     * Transforma el hijo representado por 'nodeDel' del padre 'parent' en null.
     * 
     * @param nodeDel Nodo transformar en null
     * @param parent Padre del nodo a eliminar
     */
    turnIntoNIL(nodeDel : TreeNode, parent : TreeNode){
        if(parent.valor != -999){
            if(parent.lChild && parent.lChild.valor == nodeDel.valor){
                parent.setLChild(undefined);
            }
            else if(parent.rChild && parent.rChild.valor == nodeDel.valor){
                parent.setRChild(undefined);
            }
        }
        else{
            this.root = new TreeNode(-999);
        }
    }

    /**
     * True si nodo no posee hijos, false en caso contrario.
     * 
     * @param node Nodo sobre el cual verificar si no es un padre
     */
    hasNotChilds(node : TreeNode) : boolean{
        if(!node.lChild && !node.rChild){
            return true;
        }
        return false;
    }

    /**
     * True si los hijos del nodo son negros, false en caso contrario.
     * 
     * @param node Nodo sobre el cual verificar si posee hijos negros
     */
    blackChilds(node : TreeNode) : boolean{
        if(this.hasNotChilds(node)){
            return true;
        }
        else if(node.rChild && node.lChild){
              if(node.rChild.color == this.blackColor && node.lChild.color == this.blackColor){
                  return true;
              }
        }
        else if(node.rChild && !node.lChild && node.rChild.color == this.blackColor){
            return true;
        }
        else if(!node.rChild && node.lChild && node.lChild.color == this.blackColor){
            return true;
        }
        return false;
    }

    /**
     * Analiza si el fix sobre el nodeFix a realizar caso uno. Entendiendo por el mismo
     * a:
     * Nodo arreglar es la root y es doble negro.
     * 
     * @param nodeFix Nodo arreglar
     * @param addedColor Representa el color extra que subio de existir.
     */
    esCasoUno(nodeFix : TreeNode, addedColor : string) : boolean{
        if(!nodeFix.parent && addedColor == "black"){
            return true;
        }
        return false;
    }

    /**
     * Analiza si el fix sobre el nodeFix a realizar caso dos. Entendiendo por el mismo
     * a:
     * Padre existe. Hermano es negro. Hijo de hermanos son negros.
     * 
     * @param nodeFix Nodo arreglar
     * @param addedColor Representa el color extra que subio de existir.
     */
     esCasoDos(nodeFix : TreeNode, addedColor : string) : boolean{
        if(nodeFix.parent){
            if(this.isRigthChild(nodeFix,nodeFix.parent)){
                if(nodeFix.parent.lChild && nodeFix.parent.lChild.color==this.blackColor){
                    if(this.blackChilds(nodeFix.parent.lChild)){
                        return true;
                    }
                }
            }
            else{
                if(nodeFix.parent.rChild && nodeFix.parent.rChild.color==this.blackColor){
                    if(this.blackChilds(nodeFix.parent.rChild)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Analiza si el fix sobre el nodeFix a realizar caso tres. Entendiendo por el mismo
     * a:
     * Padre existe. Hermano es rojo
     * 
     * @param nodeFix Nodo arreglar
     * @param addedColor Representa el color extra que subio de existir.
     */
    esCasoTres(nodeFix : TreeNode, addedColor : string) : boolean{
        if(nodeFix.parent){
            if(this.isRigthChild(nodeFix,nodeFix.parent)){
                if(nodeFix.parent.lChild && nodeFix.parent.lChild.color==this.redColor){
                    return true;
                }
            }
            else{
                if(nodeFix.parent.rChild && nodeFix.parent.rChild.color==this.redColor){
                    return true;
                }
            }
        }
        return false;
    }

     /**
     * Analiza si el fix sobre el nodeFix a realizar caso cuatro. Entendiendo por el mismo
     * a:
     * Padre existe. Hermano es negro. Hijo mas cercano del hermano es rojo y el mas lejano es negro.
     * 
     * @param nodeFix Nodo arreglar
     * @param addedColor Representa el color extra que subio de existir.
     */
    esCasoCuatro(nodeFix : TreeNode, addedColor : string) : boolean{
        if(nodeFix.parent){
            if(this.isRigthChild(nodeFix,nodeFix.parent)){
                if(nodeFix.parent.lChild && nodeFix.parent.lChild.color==this.blackColor){
                    if(nodeFix.parent.lChild.rChild && nodeFix.parent.lChild.rChild.color==this.redColor){
                        if(!nodeFix.parent.lChild.lChild || (nodeFix.parent.lChild.lChild && nodeFix.parent.lChild.lChild.color ==  this.blackColor)){
                            return true;
                        }
                    }
                }
            }
            else{
                if(nodeFix.parent.rChild && nodeFix.parent.rChild.color==this.blackColor){
                    if(nodeFix.parent.rChild.lChild && nodeFix.parent.rChild.lChild.color==this.redColor){
                        if(!nodeFix.parent.rChild.rChild || (nodeFix.parent.rChild.rChild && nodeFix.parent.rChild.rChild.color ==  this.blackColor)){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Analiza si el fix sobre el nodeFix a realizar caso cuatro. Entendiendo por el mismo
     * a:
     * Padre existe. Hermano es negro. Hijo mas lejano del hermano es rojo.
     * 
     * @param nodeFix Nodo arreglar
     * @param addedColor Representa el color extra que subio de existir.
     */
    esCasoCinco(nodeFix : TreeNode, addedColor : string) : boolean{
        if(nodeFix.parent){
            if(this.isRigthChild(nodeFix,nodeFix.parent)){
                if(nodeFix.parent.lChild && nodeFix.parent.lChild.color==this.blackColor){
                    if(nodeFix.parent.lChild.lChild && nodeFix.parent.lChild.lChild.color==this.redColor){
                        return true;
                    }
                }
            }
            else{
                if(nodeFix.parent.rChild && nodeFix.parent.rChild.color==this.blackColor){
                    if(nodeFix.parent.rChild.rChild && nodeFix.parent.rChild.rChild.color==this.redColor){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Restaura el orden RBT que se perdio al haber eliminado un nodo.
     * 
     * @param nodeFix Nodo que arreglar
     * @param addedColor Representa el color extra que subio de existir.
     */
    async fixDeletionTree(nodeFix : TreeNode, addedColor: string){
        if(nodeFix.color == this.redColor){
            nodeFix.setColor(this.blackColor);
            await this.delayByRunSpeedXTimes(3);
        }
        else if(this.esCasoUno(nodeFix,addedColor)){}//No hay que hacer nada

        else if(this.esCasoDos(nodeFix,addedColor)){
            if(nodeFix.parent && this.isRigthChild(nodeFix,nodeFix.parent)){
                nodeFix.parent.lChild?.setColor(this.redColor);
                await this.delayByRunSpeedXTimes(3);
                await this.fixDeletionTree(nodeFix.parent,"no-delete");
            }
            else if(nodeFix.parent && !this.isRigthChild(nodeFix,nodeFix.parent)){
                nodeFix.parent.rChild?.setColor(this.redColor);
                await this.delayByRunSpeedXTimes(3);
                await this.fixDeletionTree(nodeFix.parent,"no-delete");
            }
        }

        else if(this.esCasoTres(nodeFix,addedColor)){
            if(nodeFix.parent && this.isRigthChild(nodeFix,nodeFix.parent)){
                nodeFix.parent.lChild?.setColor(this.blackColor);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.setColor(this.redColor);
                await this.delayByRunSpeedXTimes(3);
                this.rotateRight(nodeFix.parent,"recta");
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(3);
                await this.fixDeletionTree(nodeFix,"no-delete");
            }
            else if(nodeFix.parent && !this.isRigthChild(nodeFix,nodeFix.parent)){
                nodeFix.parent.rChild?.setColor(this.blackColor);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.setColor(this.redColor);
                await this.delayByRunSpeedXTimes(3);
                this.rotateLeft(nodeFix.parent,"recta");
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(3);
                await this.fixDeletionTree(nodeFix,"no-delete");
            } 
        }

        else if(this.esCasoCuatro(nodeFix,addedColor)){
            if(nodeFix.parent && nodeFix.parent.lChild && this.isRigthChild(nodeFix,nodeFix.parent)){
                nodeFix.parent.lChild.setColor(this.redColor);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.lChild.rChild?.setColor(this.blackColor);
                await this.delayByRunSpeedXTimes(3);
                this.rotateLeft(nodeFix.parent.lChild,"recta");
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(3);
                await this.fixDeletionTree(nodeFix,"no-delete");
            }
            else if(nodeFix.parent && nodeFix.parent.rChild && !this.isRigthChild(nodeFix,nodeFix.parent)){
                nodeFix.parent.rChild.setColor(this.redColor);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.rChild.lChild?.setColor(this.blackColor);
                await this.delayByRunSpeedXTimes(3);
                this.rotateRight(nodeFix.parent.rChild,"recta");
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(3);
                await this.fixDeletionTree(nodeFix,"no-delete");
            }
        }

        else if(this.esCasoCinco(nodeFix,addedColor)){
            if(nodeFix.parent && nodeFix.parent.lChild && this.isRigthChild(nodeFix,nodeFix.parent)){
                let tempColor = nodeFix.parent.color;
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.setColor(nodeFix.parent.lChild.color);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.lChild.setColor(tempColor);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.lChild.lChild?.setColor(this.blackColor);
                await this.delayByRunSpeedXTimes(3);
                this.rotateRight(nodeFix.parent,"recta");
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(3);
            }
            else if(nodeFix.parent && nodeFix.parent.rChild && !this.isRigthChild(nodeFix,nodeFix.parent)){
                let tempColor = nodeFix.parent.color;
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.setColor(nodeFix.parent.rChild.color);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.rChild.setColor(tempColor);
                await this.delayByRunSpeedXTimes(3);
                nodeFix.parent.rChild.rChild?.setColor(this.blackColor);
                await this.delayByRunSpeedXTimes(3);
                this.rotateLeft(nodeFix.parent,"recta");
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(3);
            }
        }
        this.root.setColor(this.blackColor);
        await this.delayByRunSpeed();
    }

     /**
     * Elimina el nodo y realiza las conecciones necesarias para que se mantenga el RBT.
     * 
     * @param nodDel Nodo a eliminar
     * @param parent Padre del nodo a eliminar
     */
      async caseDeletion(nodDel : TreeNode, parent : TreeNode){
        if(!nodDel.lChild && !nodDel.rChild && (nodDel.color == this.redColor || parent.valor == -999)){
            this.turnIntoNIL(nodDel,parent);
        }
        else if(!nodDel.lChild && !nodDel.rChild && nodDel.color == this.blackColor){
            nodDel.setValor(-999);
            this.updateChangeObs();
            await this.fixDeletionTree(nodDel,"black");
            this.turnIntoNIL(nodDel,parent);
        }
        else if(nodDel.lChild && !nodDel.rChild){
            nodDel.valor = nodDel.lChild.valor;
            this.updateChangeObs();
            await this.delayByRunSpeed();
            await this.deleteNode(nodDel.lChild,nodDel.lChild.valor,nodDel);
        }
        else if(nodDel.rChild && !nodDel.lChild){
            nodDel.valor = nodDel.rChild.valor;
            this.updateChangeObs();
            await this.delayByRunSpeed();
            await this.deleteNode(nodDel.rChild,nodDel.rChild.valor,nodDel);
        }
        else if(nodDel.lChild && nodDel.rChild){
            let minRight = new TreeNode(-999);
            await this.findSmallest(nodDel.rChild,minRight);
            //await this.delayByRunSpeed()
            nodDel.valor = minRight.valor;
            this.updateChangeObs();
            await this.delayByRunSpeed();
            await this.deleteNode(nodDel.rChild,minRight.valor,nodDel);//Lo eliminamos de la derecha
        }
    }

     /**
     * Elimina el nodo con el valor 'value' si lo encuentra en el arbol.
     * 
     * @param curNode Nodo actual.
     * @param value Valor a eliminar.
     * @param side Establece por que hijo debe ser remplazado de ser el valor a eliminar.
     * @param parent Apunta al nodo padre.
     */
      async deleteNode(curNode : TreeNode, value : number, parent : TreeNode){
        curNode.pointNode();
        await this.delayByRunSpeed();
        if(curNode.valor == value){ 
            await this.delayByRunSpeed();
            this.setPointersToDefault();
            await this.caseDeletion(curNode,parent);            
            this.updateChangeObs();
            await this.delayByRunSpeed();
        }
        else if(curNode.valor < value && curNode.rChild){
            await this.deleteNode(curNode.rChild, value, curNode);
        }
        else if(curNode.valor > value && curNode.lChild){
            await this.deleteNode(curNode.lChild, value, curNode);
        }
    }
    
    async delete(valor: number): Promise<string> {
        if(this.root.valor != -999){
            await this.deleteNode(this.root,valor, new TreeNode(-999));
            this.setPointersToDefault();
            this.size = this.calculateSize();
            await this.delayByRunSpeed();
            this.updateChangeObs();
        }
        return "Operacion terminada con exito.";
    }

    /**
     * Busca por el valor indicado en el arbol y de encontrarlo lo asigna sobre la
     * variable resultado.
     * 
     * @param curNode Nodo actual
     * @param value Valor a buscar
     * @param resultado Variable que contendra la instancia del nodo de encontrarlo
     */
     async searchFor(curNode : TreeNode, value : number, resultado : TreeNode){
        curNode.pointNode();
        await this.delayByRunSpeed();
        if(curNode.valor == value){
            let tempColor = curNode.getColor();
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();  
            curNode.setColor(tempColor);
            resultado = curNode;        
        }
        else if(curNode.valor < value && curNode.rChild){
            await this.searchFor(curNode.rChild, value,resultado);
        }
        else if(curNode.valor > value && curNode.lChild){
            await this.searchFor(curNode.lChild, value, resultado);
        }
    }

    async search(valor: number): Promise<TreeNode> {
        let found = new TreeNode(-999);
        if(this.root.valor != -999){
            await this.searchFor(this.root,valor, found);
            this.setPointersToDefault();
            await this.delayByRunSpeed();
        }
        return found;
    }

    /**
     * Busca el nodo con el valor minimo en el arbol y lo coloca sobre la variable min.
     * 
     * @param curNode Nodo actual
     * @param min Nodo que representa al valor minimo
     */
     async findSmallest(curNode : TreeNode, min : TreeNode){
        curNode.pointNode();
        await this.delayByRunSpeed();
        if(!curNode.lChild){
            let tempColor = curNode.getColor();
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();  
            curNode.setColor(tempColor);
            min.setValor(curNode.valor);
            min.setColor(curNode.color);
            this.setPointersToDefault();
        }
        else{
            await this.findSmallest(curNode.lChild,min);
        }
    }

    async findMin(): Promise<TreeNode> {
        let min = new TreeNode(-999);
        if(this.root.valor != -999){
            await this.findSmallest(this.root,min);
            this.setPointersToDefault();
            await this.delayByRunSpeed();
        }
        return min;
    }


    /**
     * Busca el nodo con el valor maximo en el arbol y lo coloca sobre la variable max.
     * 
     * @param curNode Nodo actual
     * @param max Nodo que representa al valor maximo
     */
     async findBiggest(curNode: TreeNode, max : TreeNode){
        curNode.pointNode();
        await this.delayByRunSpeed();
        if(!curNode.rChild){
            let tempColor = curNode.getColor();
            curNode.setColor("#48c088")
            await this.delayByRunSpeed();  
            curNode.setColor(tempColor);
            max.setValor(curNode.valor);
        }
        else{
            await this.findBiggest(curNode.rChild,max);
        }
    }
    async findMax(): Promise<TreeNode> {
        let max = new TreeNode(-999);
        if(this.root.valor != -999){
            await this.findBiggest(this.root,max);
            this.setPointersToDefault();
            await this.delayByRunSpeed();
        }
        return max;
    }

}