import { AuxVarService } from "src/app/trees/services/aux-var.service";
import { TreeNode } from "../TreeNode";
import { StandardTree } from "./StandardTree";

export class Treap extends StandardTree{
    
    constructor(size: number, auxService : AuxVarService){
        super(size,"Treap",auxService);
    }

    /**
     * Dado un nodo,le adjunta una prioridad al mismo que sera elegida de manera random.
     * @param node Instancia de un TreeNode
     */
    attachPriority(node : TreeNode){
        let getRandom = (max : number, min = 1) => {
            return Math.floor((Math.random() * (max - min + 1)) + min);
        }
        node.setPrioridad(getRandom(999));
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
     * Genera una rotación hacia la izquierda
     * @param node Nodo al que rotar a la izquierda
     */
    async rotateLeft(node : TreeNode) {
        node.setColor("#48c088");
        await this.delayByRunSpeedXTimes(2);
        let parent = this.getParent(node);
        let child = node.getRChild();
        let previousLeftChild = child?.lChild;
        if(child && node == this.root){
            this.root = child;
            child.setParent();
            child.setLChild(node);
            node.setParent(child);
            if(previousLeftChild){
                node.setRChild(previousLeftChild);
                previousLeftChild.setParent(node);
            }
            else{
                node.setRChild(undefined);
            }
        }
        else if(child && node != this.root){
            if(this.isRigthChild(node,parent)){
                parent.setRChild(child);
            }
            else{
                parent.setLChild(child);
            }
            child.setParent(parent);
            child.setLChild(node);
            node.setParent(child);
            if(previousLeftChild){
                node.setRChild(previousLeftChild);
                previousLeftChild.setParent(node);
            }
            else{
                node.setRChild(undefined);
            }
        }
        node.setDefaultColor();
    }

    /**
     * Genera una rotación hacia la derecha
     * @param node Nodo al que rotar a la derecha
     */
    async rotateRight(node : TreeNode){
        node.setColor("#48c088");
        await this.delayByRunSpeedXTimes(2);
        let parent = this.getParent(node);
        let child = node.getLChild();
        let previousRightChild = child?.rChild;
        if(child && node == this.root){
            this.root = child;
            child.setParent();
            child.setRChild(node);
            node.setParent(child);
            if(previousRightChild){
                node.setLChild(previousRightChild);
                previousRightChild.setParent(node);
            }
            else{
                node.setLChild(undefined);
            }
        }
        else if(child && node != this.root){
            if(this.isRigthChild(node,parent)){
                parent.setRChild(child);
            }
            else{
                parent.setLChild(child);
            }
            child.setParent(parent);
            node.setParent(child);
            child.setRChild(node);
            if(previousRightChild){
                node.setLChild(previousRightChild);
                previousRightChild.setParent(node);
            }
            else{
                node.setLChild(undefined);
            }
        }
        node.setDefaultColor();
    }


    async addNode(curNode : TreeNode, nodeAdd: TreeNode){
        curNode.setColor("#F39530");
        await this.delayByRunSpeedXTimes(1);
        if(curNode.valor > nodeAdd.valor){
            if(curNode.lChild){
                await this.addNode(curNode.lChild,nodeAdd);
            }
            else{
                nodeAdd.setColor("#F39530");
                curNode.setLChild(nodeAdd);
                nodeAdd.setParent(curNode);
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(2);
            }
            if(curNode.lChild && (curNode.prioridad < curNode.lChild.prioridad)){
                await this.rotateRight(curNode);
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(2);
            }
        }
        else if (curNode.valor < nodeAdd.valor){
            if(curNode.rChild){
                await this.addNode(curNode.rChild,nodeAdd);
            }
            else{
                nodeAdd.setColor("#F39530");
                curNode.setRChild(nodeAdd);
                nodeAdd.setParent(curNode);
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(2);
            }
            if(curNode.rChild && (curNode.prioridad < curNode.rChild.prioridad)){
                await this.rotateLeft(curNode);
                this.updateChangeObs();
                await this.delayByRunSpeedXTimes(2);
            }
         
        }
 
    }

    async treeBuilderAdd(valor : number) : Promise<any>{
        let delay = this.delay;
        this.delay = 0;
        let newNode = new TreeNode(valor);
        this.attachPriority(newNode);
        newNode.setAltura(0);
        if(this.root.valor == -999){
            this.root = newNode;
            this.root.setParent();
        }
        else{
            //console.log("El nodo a agregar es: "+ newNode.valor)
            await this.addNode(this.root,newNode);
            this.setColorsToDefault();
            await this.delayByRunSpeed(); 
        }
        this.size = this.calculateSize();
        this.updateChangeObs();
        this.delay = delay;
    }

    async add(valor: number) : Promise<string> {
        let newNode = new TreeNode(valor);
        newNode.setAltura(0);
        newNode.setColor("#F39530");
        this.attachPriority(newNode);
        if(this.root.valor == -999){
            this.root = newNode;
            this.root.setParent();
            this.setColorsToDefault();
        }
        else{
            await this.addNode(this.root,newNode);
            this.setColorsToDefault();
            await this.delayByRunSpeed();
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

    async priorityFixPD(curNode : TreeNode){
        let biggestPriority = -1;
        let biggestSide = "";
        curNode.setColor("#48c088");
        await this.delayByRunSpeed();
        if(curNode.rChild && biggestPriority < curNode.rChild.prioridad){
            biggestPriority = curNode.rChild.prioridad;
            biggestSide = "right";
        }
        if(curNode.lChild && biggestPriority < curNode.lChild.prioridad){
            biggestPriority = curNode.lChild.prioridad;
            biggestSide = "left";
        }
        if(curNode.prioridad != biggestPriority){
            if(biggestSide == "right"){
                await this.rotateLeft(curNode);
            }
            else if(biggestSide == "left"){
                await this.rotateRight(curNode);
            }
            this.updateChangeObs();
            await this.delayByRunSpeed();
            curNode.setDefaultColor();
            await this.deleteNode(curNode, curNode.valor, this.getParent(curNode));      
        }
        curNode.setDefaultColor();
    }

    async doDeletion(nodDel : TreeNode, parent : TreeNode){
        if(!nodDel.lChild && !nodDel.rChild){
            this.turnIntoNIL(nodDel,parent);
            this.updateChangeObs();
        }
        else if(nodDel.lChild && !nodDel.rChild){
            let parent = this.getParent(nodDel);
            if(parent.valor != -999){
                if(parent.lChild && parent.lChild.valor == nodDel.valor){
                    parent.setLChild(nodDel.lChild);
                    nodDel.lChild.setParent(parent);
                }
                else if(parent.rChild && parent.rChild.valor == nodDel.valor){
                    parent.setRChild(nodDel.lChild);
                    nodDel.lChild.setParent(parent);
                }
            }
            else{
                this.root = nodDel.lChild;
            }
            this.updateChangeObs();
            await this.delayByRunSpeed();
        }
        else if(nodDel.rChild && !nodDel.lChild){
            let parent = this.getParent(nodDel);
            if(parent.valor != -999){
                if(parent.lChild && parent.lChild.valor == nodDel.valor){
                    parent.setLChild(nodDel.rChild);
                    nodDel.rChild.setParent(parent);
                }
                else if(parent.rChild && parent.rChild.valor == nodDel.valor){
                    parent.setRChild(nodDel.rChild);
                    nodDel.rChild.setParent(parent);
                }
            }
            else{
                this.root = nodDel.rChild;
            }
            this.updateChangeObs();
            await this.delayByRunSpeed();
        }
        else if(nodDel.lChild && nodDel.rChild){
            await this.priorityFixPD(nodDel);
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
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(curNode.valor == value){ 
            //this.setColorsToDefault();
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();
            await this.doDeletion(curNode,parent);           
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
            this.setColorsToDefault();
            this.size = this.calculateSize();
            await this.delayByRunSpeed();
            this.updateChangeObs();
        }
        return "Operacion terminada con exito.";
    }

}