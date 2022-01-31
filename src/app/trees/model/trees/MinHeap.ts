import { AuxVarService } from "src/app/trees/services/aux-var.service";
import { TreeNode } from "../TreeNode";
import { StandardTree } from "./StandardTree";

export class MinHeap extends StandardTree{
    
    constructor(size: number, auxService : AuxVarService){
        super(size,"MinHeap",auxService);
    }

    /**
     * Swapea el valor de los dos nodos
     * 
     * @param nodeA Nodo A
     * @param nodeB Nodo B
     */
     swapValues(nodeA : TreeNode, nodeB : TreeNode){
        let valorHijo = nodeA.valor;
        nodeA.setValor(nodeB.valor);
        nodeB.setValor(valorHijo)
    }

    /**
   * Calcula el indice del nodo padre al nodo enviado por parametro.
   * 
   * @param iNode Entero que representa el indice de un nodo en un arbol binario
   * @returns Entero que representa el indice del nodo padre
   */
   getParentIndex(iNode : number) : number{
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
     * Dado un indice, calcula el camino de indices a seguir para llegar a el.
     * 
     * @param element Entero que representa el indice a agregar
     */
    getIndexPath(indice : number) : number[]{
        let indexPath = [indice-1];
        let curInd = indice-1;
        while(curInd != 0){
            curInd = this.getParentIndex(curInd);
            indexPath.push(curInd);
        }
        indexPath.pop();
        return indexPath;
    }


    /**
     * Devuelve el padre de un nodo en caso que exista, o un TreeNode con valor -1 en caso
     * contrario.
     * 
     * El metodo getParent/Uncle/Grandfather fueron diseñados por conveniencia para no tener que
     * hacer chekeos por valores indefinidos o chekeos que pueden ser evitados acerca si el color
     * default del nodo es rojos o negro porque en nuestro modelo eso es diferente. Esto va a hacer
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

    async treeBuilderAdd(valor : number) : Promise<any>{
        let delay = this.delay;
        this.delay = 0;
        let newNode = new TreeNode(valor);
        newNode.setAltura(0)
        if(this.root.valor == -999){
            this.root = newNode;
        }
        else{
            let indexPath : number[]= this.getIndexPath(this.size+1);
            await this.addNode(this.root,newNode, indexPath); 
        }
        this.size = this.calculateSize();
        this.updateChangeObs();
        this.delay = delay;
    }

    async bubbleUp(node : TreeNode){
        let smallestValue = node.valor;
        let smallestSide = "root";
        node.setColor("#48c088");
        await this.delayByRunSpeed();
        if(node.rChild && smallestValue > node.rChild?.valor){
            smallestValue = node.rChild?.valor;
            smallestSide = "right";
        }
        if(node.lChild && smallestValue > node.lChild?.valor){
            smallestValue = node.lChild?.valor;
            smallestSide = "left";
        }
        if(node.valor != smallestValue){
            if(smallestSide == "right" && node.rChild){
                this.swapValues(node.rChild,node);
            }
            else if(smallestSide == "left" && node.lChild){
                this.swapValues(node.lChild,node);
            }
            this.updateChangeObs();
            await this.delayByRunSpeed();
            node.setDefaultColor();
            await this.bubbleUp(this.getParent(node));
        }
        node.setDefaultColor();
    }

    async bubbleDown(node : TreeNode){
        let smallestValue = node.valor;
        let smallestSide = "root";
        node.setColor("#48c088");
        await this.delayByRunSpeed();
        if(node.rChild && smallestValue > node.rChild?.valor){
            smallestValue = node.rChild?.valor;
            smallestSide = "right";
        }
        if(node.lChild && smallestValue > node.lChild?.valor){
            smallestValue = node.lChild?.valor;
            smallestSide = "left";
        }
        if(node.valor != smallestValue){
            if(smallestSide == "right" && node.rChild){
                this.swapValues(node.rChild,node);
            }
            else if(smallestSide == "left" && node.lChild){
                this.swapValues(node.lChild,node);
            }
            this.updateChangeObs();
            await this.delayByRunSpeed();
            node.setDefaultColor();
            if(smallestSide == "right" && node.rChild){
                await this.bubbleDown(node.rChild);
            }
            else if(smallestSide == "left" && node.lChild){
                await this.bubbleDown(node.lChild);
            }
        }
        node.setDefaultColor();
    }

    /**
     * 
     * @param curNode Nodo actual
     * @param nodeAdd Nodo agregar
     */
    async addNode(curNode: TreeNode, nodeAdd: TreeNode, indexPath : number[]){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        let curIndex = indexPath.pop();
        if(curIndex && indexPath.length > 0 && curIndex % 2 == 0 && curNode.rChild){
            await this.addNode(curNode.rChild, nodeAdd, indexPath);
        }
        else if(curIndex && indexPath.length > 0 && curIndex % 2 != 0 && curNode.lChild){
            await this.addNode(curNode.lChild, nodeAdd, indexPath);
        }

        else if(curIndex && indexPath.length == 0 && curIndex % 2 == 0){
            curNode.setRChild(nodeAdd);
            nodeAdd.setParent(curNode);
            this.updateChangeObs();
            await this.delayByRunSpeed();
            this.setColorsToDefault();
            await this.bubbleUp(curNode); 
        }
        else if(curIndex && indexPath.length == 0 && curIndex % 2 != 0){
            curNode.setLChild(nodeAdd);
            nodeAdd.setParent(curNode);
            this.updateChangeObs();
            await this.delayByRunSpeed();
            this.setColorsToDefault();
            await this.bubbleUp(curNode);
        }
    }



    async add(valor: number) : Promise<string> {
        let newNode = new TreeNode(valor);
        newNode.setAltura(0);
        newNode.setColor("#F39530");
        if(this.root.valor == -999){
            this.root = newNode;
            this.root.setDefaultColor();
        }
        else{
            let indexPath : number[]= this.getIndexPath(this.size+1);
            await this.addNode(this.root,newNode, indexPath);
        }
        this.size += 1;
        this.updateChangeObs();
        return "Done";
        
    }

    async pop(curNode : TreeNode, indexPath : number[]){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        let curIndex = indexPath.pop();
        if(curIndex && indexPath.length > 0 && curIndex % 2 == 0 && curNode.rChild){
            await this.pop(curNode.rChild, indexPath);
        }
        else if(curIndex && indexPath.length > 0 && curIndex % 2 != 0 && curNode.lChild){
            await this.pop(curNode.lChild, indexPath);
        }

        else if(curIndex && indexPath.length == 0 && curIndex % 2 == 0 && curNode.rChild){
            curNode.rChild.setColor("#48c088");
            await this.delayByRunSpeed();
            this.root.setColor("#48c088");
            await this.delayByRunSpeed();
            this.swapValues(curNode.rChild,this.root);
            this.updateChangeObs();
            await this.delayByRunSpeed();
            curNode.setRChild();
            this.updateChangeObs();
            await this.delayByRunSpeed();
            this.setColorsToDefault();
            await this.bubbleDown(this.root); 
        }
        else if(curIndex && indexPath.length == 0 && curIndex % 2 != 0 && curNode.lChild){
            curNode.lChild.setColor("#48c088");
            await this.delayByRunSpeed();
            this.root.setColor("#48c088");
            await this.delayByRunSpeed();
            this.swapValues(curNode.lChild,this.root);
            this.updateChangeObs();
            await this.delayByRunSpeed();
            curNode.setLChild();
            this.updateChangeObs();
            await this.delayByRunSpeed();
            this.setColorsToDefault();
            await this.bubbleDown(this.root); 
        }
    }
    /**
     * Hace un pop del elemento en la ruta y realiza un reheap del ultimo nodo.
     * 
     * @param valor No se usa. Queda presente por temas de polimorfismo. 
     */
    async delete(valor: number): Promise<string> {
        if(this.root.rChild || this.root.lChild ){
            let indexPath : number[]= this.getIndexPath(this.size);
            await this.pop(this.root,indexPath);
            this.setColorsToDefault();
            this.size = this.size - 1;
            await this.delayByRunSpeed();
            this.updateChangeObs();
        }
        else{
            this.root.setColor("#48c088");
            await this.delayByRunSpeed();
            this.root = new TreeNode(-999);
            this.size = 0;
            this.updateChangeObs();
        }
        return "Operacion terminada con exito.";
    }
    async findMin(): Promise<TreeNode> {
        if(this.root.valor != -999){
            this.root.setColor("#48c088");
            await this.delayByRunSpeed();
            this.root.setDefaultColor();
        }
        return this.root;
    }
    async findMax(): Promise<TreeNode> {
        let queue : TreeNode[] = [this.root];
        if(this.root.valor == -999){
            queue.pop();
        }
        else{
            this.auxVarServ.setAuxVariable("Queue",queue);
            this.auxVarServ.setAuxVariable("Current max",[this.root]);
        }
        let curMax = this.root.valor;
        let nodoMax : TreeNode = this.root;
        await this.delayByRunSpeed();
        while(queue.length != 0){
            let elem = queue.shift();
            this.auxVarServ.setAuxVariable("Queue",queue);
            await this.delayByRunSpeed();
            let curNode : TreeNode = (elem != undefined) ? elem : new TreeNode(0);
            if(curNode.valor >= curMax){
                curMax = curNode.valor;
                nodoMax = curNode;
                this.auxVarServ.setAuxVariable("Current max",[nodoMax]);
                await this.delayByRunSpeed();
            }
            if(curNode.lChild){
                queue.push(curNode.lChild);
                this.auxVarServ.setAuxVariable("Queue",queue);
                await this.delayByRunSpeed();
            }
            if(curNode.rChild){
                queue.push(curNode.rChild);
                this.auxVarServ.setAuxVariable("Queue",queue);
                await this.delayByRunSpeed();  
            }
        }
        this.auxVarServ.setAuxVariable("Queue",[]);
        await this.delayByRunSpeed();
        this.auxVarServ.deleteAuxVar("Queue");
        this.auxVarServ.deleteAuxVar("Current max");
        nodoMax.setColor("#48c088");
        await this.delayByRunSpeedXTimes(3);
        nodoMax.setDefaultColor();
        return nodoMax;
    }

    async search(valor: number): Promise<TreeNode> {
        let queue : TreeNode[] = [this.root];
        if(this.root.valor == -999){
            queue.pop();
        }
        this.auxVarServ.setAuxVariable("Queue",queue);
        let nodoResultado = new TreeNode(-999);
        await this.delayByRunSpeed();
        while(queue.length != 0){
            let elem = queue.shift();
            this.auxVarServ.setAuxVariable("Queue",queue);
            await this.delayByRunSpeed();
            let curNode : TreeNode = (elem != undefined) ? elem : new TreeNode(0);
            if(curNode.valor == valor){
                queue = [];
                this.auxVarServ.setAuxVariable("Queue",[]);
                await this.delayByRunSpeed();
                nodoResultado = curNode;
            }
            else{
                if(curNode.lChild && curNode.lChild.valor <= valor){
                    queue.push(curNode.lChild);
                    this.auxVarServ.setAuxVariable("Queue",queue);
                    await this.delayByRunSpeed();
                }
                if(curNode.rChild && curNode.rChild.valor <= valor){
                    queue.push(curNode.rChild);
                    this.auxVarServ.setAuxVariable("Queue",queue);
                    await this.delayByRunSpeed();
                }
            }
        }
        this.auxVarServ.deleteAuxVar("Queue");
        nodoResultado.setColor("#48c088");
        await this.delayByRunSpeedXTimes(3);
        nodoResultado.setDefaultColor();
        return nodoResultado;
    }

}