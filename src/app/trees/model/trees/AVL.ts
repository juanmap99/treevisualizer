import { ComponentFixtureAutoDetect } from "@angular/core/testing";
import { AuxVarService } from "src/app/trees/services/aux-var.service";
import { TreeControllerService } from "../../services/tree-controller.service";
import { Tree } from "../Tree";
import { TreeNode } from "../TreeNode";
import { StandardTree } from "./StandardTree";

export class AVL extends StandardTree{
    
    constructor(size: number, auxService : AuxVarService){
        super(size,"AVLTree",auxService);
    }

    /**
     * Calcula el factor de balance sobre un nodo, entendiendo por el mismo a la resta entre
     * la altura izquierda menos la derecha.
     * @param node Nodo sobre el cual calcular el factor de balance
     */
    getBalanceFactor(node : TreeNode){
        let alturaHijoIzquierdo = 0;
        let alturaHijoDerecho = 0;
        if(node.lChild){
            alturaHijoIzquierdo = node.lChild.getAltura() + 1;
        }
        if(node.rChild){
            alturaHijoDerecho = node.rChild.getAltura() + 1;
        }
        return alturaHijoIzquierdo - alturaHijoDerecho;
    }

    /**
     * Calcula la altura de un nodo
     * @param node Nodo sobre el cual calcular la altura
     */
    setAlturaNodo(node : TreeNode){
        let alturaHijoIzquierdo = 0;
        let alturaHijoDerecho = 0;
        if(node.lChild){
            alturaHijoIzquierdo = node.lChild.getAltura()+1;
        }
        if(node.rChild){
            alturaHijoDerecho = node.rChild.getAltura()+1;
        }
        node.setAltura(Math.max(alturaHijoIzquierdo,alturaHijoDerecho));
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
        node.setDefaultColor();
    }

    /**
     * Se encarga de balancear el arbol despues de agregar un nuevo nodo.
     * 
     * @param curNode Nodo agregado
     * @param valorAgregado Valor agregado al arbol
     */
    async balanceAfterAdd(curNode : TreeNode, valorAgregado : number){
        let indiceBalance = this.getBalanceFactor(curNode);

        //Implica que tenemos este tipo de caso n
        //                                       \
        //                                        n 
        //                                       /
        //                                      n                       
        if(curNode.rChild && indiceBalance < -1 && curNode.rChild.valor > valorAgregado){
            await this.rotateRight(curNode.rChild);
            if(curNode.rChild.rChild){
                this.setAlturaNodo(curNode.rChild.rChild);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
            await this.rotateLeft(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }
        //Implica que tenemos este tipo de caso n
        //                                       \
        //                                        n 
        //                                         \
        //                                          n  
        else if(curNode.rChild && indiceBalance < -1  && curNode.rChild.valor < valorAgregado){
            await this.rotateLeft(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }
        //Implica que tenemos este tipo de caso  n
        //                                      /
        //                                     n 
        //                                    /
        //                                   n                       
        if(curNode.lChild && indiceBalance > 1 && curNode.lChild.valor > valorAgregado){
            await this.rotateRight(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }
        //Implica que tenemos este tipo de caso  n
        //                                      /
        //                                     n 
        //                                      \
        //                                       n                       
        if(curNode.lChild && indiceBalance > 1 && curNode.lChild.valor < valorAgregado){
            await this.rotateLeft(curNode.lChild);
            if(curNode.lChild.lChild){
                this.setAlturaNodo(curNode.lChild.lChild);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
            await this.rotateRight(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }

    }

    /**
     * Version Tree builder del agregado del nodo
     * @param curNode TreeNode que representa el nodo actual
     * @param nodeAdd TreeNode que representa el nodo a agregar
     */
     async treeBuilderAddNode(curNode: TreeNode, nodeAdd : TreeNode){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(curNode.valor > nodeAdd.valor){
            if(curNode.lChild){
                await this.treeBuilderAddNode(curNode.lChild,nodeAdd);
            }
            else{
                this.linkNodes(nodeAdd, curNode,"left");
                this.updateChangeObs();
                await this.delayByRunSpeed();
                this.setColorsToDefault();
                await this.delayByRunSpeed();
            }
        }
        else if (curNode.valor < nodeAdd.valor){
            if(curNode.rChild){
                await this.treeBuilderAddNode(curNode.rChild,nodeAdd);
            }
            else{
                this.linkNodes(nodeAdd, curNode,"right");
                this.updateChangeObs();
                await this.delayByRunSpeed();
                this.setColorsToDefault();
                await this.delayByRunSpeed();
            }
        }

        this.setAlturaNodo(curNode);
        await this.balanceAfterAdd(curNode, nodeAdd.valor);
        this.updateChangeObs();
        await this.delayByRunSpeed();
        this.setAlturaNodo(curNode);
    }

    async treeBuilderAdd(valor : number) : Promise<any>{
        let delay = this.delay;
        this.delay = 0;
        let newNode = new TreeNode(valor);
        newNode.setAltura(0);
        if(this.root.valor == -999){
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
        newNode.setAltura(0);
        newNode.setColor("#F39530");
        if(this.root.valor == -999){
            this.root = newNode;
            newNode.setDefaultColor();
        }
        else{
            let curNode = this.root;
            await this.treeBuilderAddNode(curNode,newNode); 
            this.setColorsToDefault();
        }
        this.size = this.calculateSize();
        this.updateChangeObs();
        return "Done";
    }


    /**
     * Se encarga de balancear el arbol despues de agregar un nuevo nodo.
     * 
     * @param curNode Nodo agregado
     */
    async balanceAfterDelete(curNode: TreeNode){
        let indiceBalance = this.getBalanceFactor(curNode);


        //Implica que tenemos este tipo de caso n
        //                                       \
        //                                        n 
        //                                       /
        //                                      n                       
        if(curNode.rChild && indiceBalance < -1 && this.getBalanceFactor(curNode.rChild) > 0){
            await this.rotateRight(curNode.rChild);
            if(curNode.rChild.rChild){
                this.setAlturaNodo(curNode.rChild.rChild);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
            await this.rotateLeft(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }
        //Implica que tenemos este tipo de caso n
        //                                       \
        //                                        n 
        //                                         \
        //                                          n                       
        if(curNode.rChild && indiceBalance < -1 && this.getBalanceFactor(curNode.rChild) <= 0){
            await this.rotateLeft(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }

        //Implica que tenemos este tipo de caso  n
        //                                      /
        //                                     n 
        //                                    /
        //                                   n                       
        if(curNode.lChild && indiceBalance > 1 && this.getBalanceFactor(curNode.lChild) >= 0){
            await this.rotateRight(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }

        //Implica que tenemos este tipo de caso  n
        //                                      /
        //                                     n 
        //                                      \
        //                                       n                       
        if(curNode.lChild && indiceBalance > 1 && this.getBalanceFactor(curNode.lChild) < 0){
            await this.rotateLeft(curNode.lChild);
            if(curNode.lChild.lChild){
                this.setAlturaNodo(curNode.lChild.lChild);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
            await this.rotateRight(curNode);
            this.setAlturaNodo(curNode);
            if(curNode.parent){
                this.setAlturaNodo(curNode.parent);
            }
            this.updateChangeObs();
            await this.delayByRunSpeedXTimes(2);
        }
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
     * Elimina el nodo y realiza las conecciones necesarias para que se mantenga el RBT.
     * 
     * @param nodDel Nodo a eliminar
     * @param parent Padre del nodo a eliminar
     */
     async caseDeletion(nodDel : TreeNode, parent : TreeNode){
        if(!nodDel.lChild && !nodDel.rChild && parent.valor == -999){
            this.turnIntoNIL(nodDel,parent);
        }
        else if(!nodDel.lChild && !nodDel.rChild){
            this.turnIntoNIL(nodDel,parent);
            this.updateChangeObs();
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
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(curNode.valor == value){ 
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();
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

        this.setAlturaNodo(curNode);
        await this.balanceAfterDelete(curNode);
        this.updateChangeObs();
        await this.delayByRunSpeed();
        this.setAlturaNodo(curNode);
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