import { AuxVarService } from "src/app/trees/services/aux-var.service";
import { TreeNode } from "../TreeNode";
import { StandardTree } from "./StandardTree";

export class BST extends StandardTree{
    
    constructor(size: number, auxService : AuxVarService){
        super(size,"BST",auxService);
    }

    /**
     * Version Tree builder del agregado del nodo
     * @param curNode TreeNode que representa el nodo actual
     * @param nodeAdd TreeNode que representa el nodo a agregar
     */
    treeBuilderAddNode(curNode: TreeNode, nodeAdd : TreeNode){
        if(curNode.valor > nodeAdd.valor){
            if(curNode.lChild){
                this.treeBuilderAddNode(curNode.lChild,nodeAdd);
            }
            else{
                curNode.setLChild(nodeAdd);
            }
        }
        else if (curNode.valor < nodeAdd.valor){
            if(curNode.rChild){
                this.treeBuilderAddNode(curNode.rChild,nodeAdd);
            }
            else{
                curNode.setRChild(nodeAdd);
            }
        }
    }

    treeBuilderAdd(valor : number) : void{
        let newNode = new TreeNode(valor);
        if(this.root.valor == -999){
            this.root = newNode;
        }
        else{
            let curNode = this.root;
            this.treeBuilderAddNode(curNode,newNode); 
        }
        this.size += 1;
        this.updateChangeObs();
    }

    /**
     * Agrega el nodo a agregar dentro del arbol de no existir en el mismo
     * @param curNode TreeNode que representa el nodo actual
     * @param nodeAdd TreeNode que representa el nodo a agregar
     */
    async addNode(curNode: TreeNode, nodeAdd : TreeNode){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(curNode.valor > nodeAdd.valor){
            if(curNode.lChild){
                await this.addNode(curNode.lChild,nodeAdd);
            }
            else{
                nodeAdd.setColor("#F39530");
                curNode.setLChild(nodeAdd);
                this.updateChangeObs();
            }
        }
        else if (curNode.valor < nodeAdd.valor){
            if(curNode.rChild){
                await this.addNode(curNode.rChild,nodeAdd);
            }
            else{
                nodeAdd.setColor("#F39530");
                curNode.setRChild(nodeAdd);
                this.updateChangeObs();
            }
        }
    }

    async add(valor: number) : Promise<string> {
        let newNode = new TreeNode(valor);
        if(this.root.valor == -999){
            this.root = newNode;
            this.size = 1;
            this.updateChangeObs();
            await this.delayByRunSpeed();
            this.setColorsToDefault();
            return "Added successfully";
        }
        else{
            //let curNode = this.root
            await this.addNode(this.root,newNode); 
            this.size = this.calculateSize();
            this.updateChangeObs();
            await this.delayByRunSpeed();
            this.setColorsToDefault();
            await this.delayByRunSpeed();
            return "Added successfully";
        }
    }


    /**
     * Linkea el padre con el nodo indicado sobre el lado indicado
     * @param nodoLink Nodo a linkear
     * @param parent Nodo padre con el cual linkea el nodo enviado
     * @param child String que representa el lado sobre el cual hay que hacer el linking
     */
    async linkNodes(left : TreeNode | undefined, right : TreeNode | undefined,
             parent : TreeNode, child: string){
        
        if(!left && !right){ // Caso nodo a eliminar es un nodo hoja
            if(child == "right"){
                parent.setRChild();
            }
            else if(child == "left"){
                parent.setLChild();
            }
            else if(child == "root"){
                this.root = new TreeNode(-999);
            }
        }
        else if(left && !right){//Caso nodo eliminar posee solamente hijo izquierdo
            if(child == "right"){
                parent.setRChild(left);
            }
            else if(child == "left"){
                parent.setLChild(left);
            }
            else if(child == "root"){
                this.root = left;
            }
        }
        else if(!left && right){//Caso nodo eliminar posee solamente hijo derecho
            if(child == "right"){
                parent.setRChild(right);
            }
            else if(child == "left"){
                parent.setLChild(right);
            }
            else if(child == "root"){
                this.root = right;
            }
        }

        else if(left && right){//Caso nodo a eliminar posee hijo izquierdo y hijo derecho
            let minRight = new TreeNode(-999);
            await this.findSmallest(right,minRight);
            this.setColorsToDefaultStartingFrom(right);
            await this.delayByRunSpeed();
            minRight.setLChild(left);//Lo linkeamos a la parte izquierda
            minRight.setRChild(right);//Lo linkeamos a la parte derecha
            if(child == "right"){
                parent.setRChild(minRight);
            }
            else if(child == "left"){
                parent.setLChild(minRight);
            }
            else if(child == "root"){
                this.root = minRight;
            }
            this.updateChangeObs();
            await this.deleteNode(right,minRight.valor,minRight);//Lo eliminamos de la derecha
            this.setColorsToDefaultStartingFrom(right);
        }
    }

    /**
     * Elimina el nodo y realiza las conecciones necesarias para que se mantenga el BST.
     * 
     * @param nodDel Nodo a eliminar
     * @param parent Padre del nodo a eliminar
     */
    async doDeletion(nodDel : TreeNode, parent : TreeNode){
        if(parent.valor == -999){//Si hay que eliminar la root
            await this.linkNodes(nodDel.lChild,nodDel.rChild ,parent, "root");
        }
        else if(parent.lChild && parent.lChild.valor == nodDel.valor){
            await this.linkNodes(nodDel.lChild,nodDel.rChild ,parent, "left");
        }
        else if(parent.rChild && parent.rChild.valor == nodDel.valor){
            await this.linkNodes(nodDel.lChild,nodDel.rChild, parent, "right");
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