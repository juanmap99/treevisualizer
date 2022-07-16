import { BehaviorSubject } from "rxjs";
import { AuxVarService } from "src/app/trees/services/aux-var.service";
import { Tree } from "../Tree";
import { TreeChange } from "../TreeChange";
import { TreeNode } from "../TreeNode";

export class StandardTree implements Tree{
    root: TreeNode;
    size: number;
    delay: number;
    redColor  : string = "#f0594e";
    blackColor : string ="#1a1919";
    changeObs : BehaviorSubject<TreeChange>;
    auxVarServ : AuxVarService;
    tipoArbol : string;
    balancedTreeList = [
        [500],
        [500,250],
        [500,250,725],
        [500,252,698,171],
        [500,252,698,171,293],
        [500,252,698,171,293,612],
        [500,252,698,171,293,612,716],
        [500,252,698,171,293,612,716,80],
        [500,252,698,171,293,612,716,80,193],
        [500,252,698,171,293,612,716,80,193,274],
        [500,252,698,171,293,612,716,80,193,274,377],
        [500,252,698,171,293,612,716,80,193,274,377,533],
        [500,252,698,171,293,612,716,80,193,274,377,533,647],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553,619],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553,619,670],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553,619,670,700],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553,619,670,700,709],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553,619,670,700,709,743],
        [500,252,698,171,293,612,716,80,193,274,377,533,647,703,781,48,107,183,221,260,283,319,
        473,510,553,619,670,700,709,743,830]
    ];//Lista de arboles ya balanceados para evitar tiempo de procesamiento. Se hara un proceso
    //de mapeado donde se agregara o restara un valor random a todos los elementos para darle
    //la ilucion al usuario que siempre crea uno diferente

    constructor(size: number, tipoArbol : string, auxService : AuxVarService){
        this.size = size;
        this.delay = 150;
        this.root = new TreeNode(-999);
        this.changeObs = new BehaviorSubject({root: this.root,size: this.size});
        this.auxVarServ = auxService;
        this.tipoArbol = tipoArbol;
        //this.inicializarArbol(size)
    }

    async add(valor: number) : Promise<string>{throw new Error("Method not implemented.")}
    async delete(valor: number): Promise<string> {throw new Error("Method not implemented.")}

    /**
     * Busca por el valor indicado en el arbol y de encontrarlo lo asigna sobre la
     * variable resultado.
     * 
     * @param curNode Nodo actual
     * @param value Valor a buscar
     * @param resultado Variable que contendra la instancia del nodo de encontrarlo
     */
     async searchFor(curNode : TreeNode, value : number, resultado : TreeNode){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(curNode.valor == value){
            //this.setColorsToDefault();
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();  
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
            this.setColorsToDefault();
            await this.delayByRunSpeed();
        }
        return found;
    }

    /**
     * Busca el nodo con el valor maximo en el arbol y lo coloca sobre la variable max.
     * 
     * @param curNode Nodo actual
     * @param max Nodo que representa al valor maximo
     */
     async findBiggest(curNode: TreeNode, max : TreeNode){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(!curNode.rChild){
            //this.setColorsToDefault();
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();  
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
            this.setColorsToDefault();
            await this.delayByRunSpeed();
        }
        return max;
    }

    /**
     * Busca el nodo con el valor minimo en el arbol y lo coloca sobre la variable min.
     * 
     * @param curNode Nodo actual
     * @param min Nodo que representa al valor minimo
     */
    async findSmallest(curNode : TreeNode, min : TreeNode){
        curNode.setColor("#F39530");
        await this.delayByRunSpeed();
        if(!curNode.lChild){
            //this.setColorsToDefault();
            curNode.setColor("#48c088");
            await this.delayByRunSpeed();  
            min.setValor(curNode.valor);
        }
        else{
            await this.findSmallest(curNode.lChild,min);
        }
    }

    async findMin(): Promise<TreeNode> {
        let min = new TreeNode(-999);
        if(this.root.valor != -999){
            await this.findSmallest(this.root,min);
            this.setColorsToDefault();
            await this.delayByRunSpeed();
        }
        return min;
    }


    /**
     * Para mantener los nodos en un tamaño aceptable que pueda ser visualizado en cualquier dispositivo
     * se puso un limite en la capa numero 5, permitiendo un total de 31 nodos en el arbol. Este metodo
     * se utilizara para calcular si la adicion del elemento ingresado por el usuario genera una nueva capa o no.
     * En caso que la respuesta sea false, se prosigue con la adicion, en caso que la respuesta sea True
     * se le informa al usuario del limite establecido y se le solicita que ingrese un elemento con un valor
     * diferente.
     */
    adicionGeneraQuintaCapa(valAgregar : number) : boolean {
        let depthIfAdd = (curNode : TreeNode, valAdd : number, curDepth : number) : number =>{
            let depthIfAdded : number = 0;
            if(curNode.valor > valAdd){
                if(curNode.lChild){
                    depthIfAdded = depthIfAdd(curNode.lChild,valAdd,curDepth+1);
                }
                else{
                    return curDepth+1;
                }
            }
            else if (curNode.valor < valAdd){
                if(curNode.rChild){
                    depthIfAdded = depthIfAdd(curNode.rChild,valAdd,curDepth+1);
                }
                else{
                    return curDepth+1;
                }
            }
            return depthIfAdded;
        }

        return depthIfAdd(this.root,valAgregar,0) == 5;  
    }

    /**
     * Por temas de visualizacion el add va a ser asincronico, sin emargo cuando el usuario mueve
     * el slider de tamaño del arbol se crea un array en donde se precisa hacer uso del metodo add
     * para construir el arbol con tantos nodos como lo precisa el usuario. En ese caso el objetivo
     * no es visualizar el metodo add sino construir el arbol, por lo que se hara lo mismo que se hace
     * con el metodo Add pero con un delay de 0 y sin ningun tipo de visualizacion que se vea
     * reflejada en el display.
     * 
     * @param node Valor numerico que representa el elemento a agregar
     */
    treeBuilderAdd(valor : number) : void{throw new Error("Method not implemented.")}

    updateTree(root: TreeNode, size : number): void {
        this.root = root;
        this.size = size;
    }

    /**
     * Actualiza el observable de la root del arbol.
     * 
     */
    updateChangeObs(){
        this.changeObs.next({root: this.root,size: this.size});
    }

    /**
     * Setter del delay
     * @param delay Numero que representa el delay en milisegundos
     */
     setDelay(delay: number): void {
        this.delay = delay;
    }

    /**
     * Calcula la cantidad de nodos existentes en el arbol.
     * 
     * @returns Entero que representa la cantidad de nodos en el arbol
     */
    calculateSize() : number{
        if(this.root.valor == -999){
            return 0;
        }
        let queue : TreeNode[] = [this.root];
        let size = 0;
        while(queue.length != 0){
            let elem = queue.shift();
            size += 1;
            let curNode : TreeNode = (elem != undefined) ? elem : new TreeNode(0);
            if(curNode.lChild){
                queue.push(curNode.lChild);
            }
            if(curNode.rChild){
                queue.push(curNode.rChild);
            }
        }
        return size;
    }

    /**
     * Setea el color de todos los nodos en el arbol en su color por default
     */
    setColorsToDefault(){
        let queue : TreeNode[] = [this.root];
        let size = 0;
        while(queue.length != 0){
            let elem = queue.shift();
            size += 1;
            let curNode : TreeNode = (elem != undefined) ? elem : new TreeNode(0);
            curNode.setDefaultColor();
            if(curNode.lChild){
                queue.push(curNode.lChild);
            }
            if(curNode.rChild){
                queue.push(curNode.rChild);
            }
        }
    }

    /**
     * Setea los pointers a default.
     */
    setPointersToDefault(){
        let queue : TreeNode[] = [this.root];
        let size = 0;
        while(queue.length != 0){
            let elem = queue.shift();
            size += 1;
            let curNode : TreeNode = (elem != undefined) ? elem : new TreeNode(0);
            curNode.unpointNode();
            if(curNode.lChild){
                queue.push(curNode.lChild);
            }
            if(curNode.rChild){
                queue.push(curNode.rChild);
            }
        }
    }

    /**
     * Setea el color de los nodos descendientes del nodo enviado por paramatro a su valor
     * por default
     */
    setColorsToDefaultStartingFrom(node : TreeNode){
        let queue : TreeNode[] = [node];
        let size = 0;
        while(queue.length != 0){
            let elem = queue.shift();
            size += 1;
            let curNode : TreeNode = (elem != undefined) ? elem : new TreeNode(0);
            curNode.setDefaultColor();
            if(curNode.lChild){
                queue.push(curNode.lChild);
            }
            if(curNode.rChild){
                queue.push(curNode.rChild);
            }
        }
    }

    /**
     * Genera un delay en milisegundos de una longitud de tiempo igual a la marcada por la variable
     * de clase'delay'
     * 
     * @returns Promesa que sera resuelta una vez que pase el tiempo delimitado por la variable
     * de clase 'delay.
    */
     delayByRunSpeed(){
        return new Promise(resolve => {
            setTimeout(function() {
            resolve("Delay completado");
            }, this.delay);
        });
    }

    /**
     * Realiza un delay de delay*nTimes
     * @param nTimes Numero que representa la cantidad de veces por la que se prolongara el delay establecido
     */
    delayByRunSpeedXTimes(nTimes : number){
        return new Promise(resolve => {
            setTimeout(function() {
            resolve("Delay completado");
            }, this.delay*nTimes);
        });
    }

    /**
   * Devuelve un numero random entre el rango (min,max)
   * 
   * @param min Entero que representa el valor minimo
   * @param max Entero que representa el valor maximo
   * @returns Valor random x entre min<=x<=max
   */
    randomIntFromInterval(min: number, max: number) { 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Inicializa el arbol con tantos nodos como se indico por parametro y seleccionando
     * los nodos de manera considerada para garantizar que el mismo se encuentre completo
     * 
     * @param size Entero que representa la cantidad de nodos que tendra el arbol
     */
    async inicializarArbol(size: number): Promise<any> {
        let noise = this.randomIntFromInterval(-47,47);
        let array = this.balancedTreeList[size-1];
        for(let i=0; i<array.length; i++){
            //console.log("Se va a agregar " + (array[i]+noise))
            await this.treeBuilderAdd(array[i]+noise);
        }
        this.updateChangeObs();
    }


}