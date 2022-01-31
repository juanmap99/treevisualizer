import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tree } from '../model/Tree';
import { TreeControllerService } from './tree-controller.service';

@Injectable({
  providedIn: 'root'
})
export class TreeRunningControllerService {
  arbol : Tree;
  running : boolean = false;
  runObs : BehaviorSubject<boolean>;
  

  constructor(private treeContrServ : TreeControllerService) { 
    this.runObs = new BehaviorSubject<boolean>(this.running);
    this.arbol = this.treeContrServ.arbol;
    this.treeContrServ.treeObs.subscribe(newTree => this.arbol = newTree);
  }

  /**
   * Setea running con el valor enviado por parametro y actualiza el observable.
   * 
   * @param status Variable booleana que representa si el programa esta corriendo o no
   */
  setRunStatus(status: boolean){
    this.running = status;
    this.updateRunningObs();
  }


  /**
   * Corre el metodo indicado por parametro sobre la instancia de arbol definida.
   * 
   * @param metodo String que representa el metodo a ejecutar.
   * @param value Valor que representa el valor sobre el cual se realizara el agregado/busqueda o eliminación.
   */
  async runMethod(metodo : string, value : number = 0){
    this.running = true;
    this.updateRunningObs();
    switch(metodo){
      case("Add"):
        await this.arbol.add(value);
        break; 
      case("Search"):
        await this.arbol.search(value);
        break;
      case("Delete"):
        await this.arbol.delete(value);
        break;
      case("FindMin"):
        let min = await this.arbol.findMin();
        break;
      case("FindMax"):
        let max = await this.arbol.findMax();
        break; 
    }
    this.running = false;
    this.updateRunningObs();
  }

  /**
   * Actualiza el observable de la variable que determina si el programa se encuentra en ejecución
   * o no.
   */
  updateRunningObs(){
    this.runObs.next(this.running);
  }

  /**
   * Setea el delay del programe en base a la velocidad recibida por parametro
   * 
   * @param velocidad Entero con valores posibles del 1 al 5 que determina el delay del programa
   */
  setRunDelay(velocidad: number){
    let speedToDelayDic = [500,250,100,60,30];
    let delay = speedToDelayDic[velocidad -1];
    this.arbol.setDelay(delay);
  }

}
