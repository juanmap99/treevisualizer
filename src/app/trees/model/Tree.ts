import { BehaviorSubject } from "rxjs";
import { TreeChange } from "./TreeChange";
import {TreeNode} from "./TreeNode"

export interface Tree{
    root : TreeNode;
    size : number;
    delay: number;
    changeObs : BehaviorSubject<TreeChange>;
    tipoArbol : string;


    /**
     * Agrega el valor recibido por parametro al arbol de no existir en el mismo.
     * 
     * @param node Valor numerico que representa el elemento a agregar
     */
    add(valor : number) : Promise<string>;

    /**
     * Busca el valor recibido por parametro en el arbol y devuelve una instancia valida de TreeNode.
     * 
     * @param node Valor numerico que representa el elemento a buscar
     */
    search(valor : number) : Promise<TreeNode>;

    /**
     * Elimina el nodo que contenga el valor recibido por parametro del arbol de existir en el mismo.
     * 
     * @param valor Valor numerico que representa el elemento a eliminar
     */
    delete(valor : number) : Promise<string>;

    /**
     * Devuelve el nodo que contiene el valor maximo en el arbol.
     */
    findMax() : Promise<TreeNode>;

    /**
     * Devuelve el nodo que contiene el valor minimo en el arbol
     */
    findMin() : Promise<TreeNode>;

    /**
     * Inicializa el arbol con tantos nodos como se lo indico por parametro.
     * 
     * @param size Cantidad de nodos con los que se debe inicializar el arbol
     */
    inicializarArbol(size : number) : void;

    /**
     * Determina el delay entre instrucciones que realizan cambios en la vista.
     * 
     * @param delay Entero que determina el delay a establecer
     */
    setDelay(delay: number) : void;

    /**
     * Actualiza el arbol setea la root del arbol al Nodo enviado por parametro y el
     * nuevo size al delimitado por la variable 'size' enviada por parametro 
     * 
     * @param root TreeNode que representa la nueva root del arbol
     * @param size Entero que representa el nuevo tambio
     */
    updateTree(root : TreeNode, size: number) : void;


    /**
     * True si la adicion de dicho valor genera una quinta capa, false en caso contrario
     * @param valor Valor numero que representa el valor a agregar
     */
    adicionGeneraQuintaCapa(valor : number) : boolean;

}