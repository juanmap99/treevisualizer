export class TreeNode{
    valor: number;
    altura? : number;
    prioridad : number; //Solo usado en treaps
    color : string;

    pointed : boolean;//Creadas unicamente para facilitar la visualización en el red black tree
                        // cumple la misma función que el color.
    pointedColor : string;

    lChild? : TreeNode;
    rChild? : TreeNode;
    parent? : TreeNode;//Hay algunos arboles que lo usan

    constructor(valor:number, 
                lChild? : TreeNode, 
                rChild? : TreeNode,
                parent? : TreeNode,
                color : string = "#04c2f6"){
        this.valor = valor;
        this.lChild = lChild;
        this.rChild = rChild;
        this.parent = parent;
        this.color = color;
        this.pointed = false;
        this.prioridad = 0;
        this.pointedColor = "#F39530";
    }

    /**
     * Setter de prioridad.
     * @param value Valor que representa la prioridad del nodo
     */
    setPrioridad(value : number){
        this.prioridad = value;
    }

    /**
     * Getter del color
     * @returns Color del nodo.
     */
    getColor(){
        return this.color;
    }

    /**
     * Setter del color
     * @param color String que representa un color.
     */
    setColor(color : string){
        this.color = color;
    }

    /**
     * Devuelve el color del nodo a su estado por default
     */
    setDefaultColor(){
        this.color = "#04c2f6";
        this.pointed = false;
    }

    /**
     * Getter del LChild
     * @returns Left child del nodo.
     */
    getLChild(){
        return this.lChild;
    }


    /**
     * Setter del left child
     * @param lChild TreeNode que representa el nuevo left child del nodo actual.
     */
    setLChild(lChild? : TreeNode){
        this.lChild = lChild;
    }


    /**
     * Getter del padre
     * @returns Padre de un nodo
     */
     getParent(){
        return this.parent;
    }


    /**
     * Setter del padre de un nodo
     * @param parent TreeNode que representa el nuevo padre de un nodo
     */
    setParent(parent? : TreeNode){
        this.parent = parent;
    }

    /**
     * Getter del RChild
     * @returns Right child del nodo.
     */
     getRChild(){
        return this.rChild;
    }

    /**
     * Setter del right child
     * @param rChild TreeNode que representa el nuevo right child del nodo actual.
     */
    setRChild(rChild? : TreeNode){
        this.rChild = rChild;
    }

    /**
     * Getter de valor
     * @returns Valor de la variable de clase valor.
     */
    getValor() : number{
        return this.valor;
    }

    /**
     * Setter de valor
     * @param valor Valor a asignar sobre la variable de clase valor
     */
    setValor(valor : number){
        this.valor = valor;
    }

    /**
     * Setter de altura
     * @param altura Valor a asignar sobre la variable de clase altura
     */
    setAltura(altura : number){
        this.altura = altura;
    }

    /**
     * Getter de altura
     * @returns Valor de la variable de clase altura.
     */
    getAltura() : number{
        if(this.altura){
            return this.altura;
        }
        else{
            return 0
        }
    }

    /**
     * Cambia el valor de la variable pointed a true.
     */
    pointNode(){
        this.pointed = true;
    }

     /**
     * Cambia el valor de la variable pointed a false.
     */
    unpointNode(){
        this.pointed = false;
    }

    /**
     * Setea el color del pointed color
     * @param color String que representa un color
     */
    setPointedColor(color : string){
        this.pointedColor = color;
    }
}