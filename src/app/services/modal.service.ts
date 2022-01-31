import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModalSize } from '../trees/model/ModalSize';
import { CodeModalComponent } from '../code-modal/code-modal.component';
import { BSTModalComponent } from '../trees/bst-modal/bst-modal.component';
import { AVLModalComponent } from '../trees/avl-modal/avl-modal.component';
import { RBLModalComponent } from '../trees/rbl-modal/rbl-modal.component';
import { MaxHeapModalComponent } from '../trees/max-heap-modal/max-heap-modal.component';
import { MinHeapModalComponent } from '../trees/min-heap-modal/min-heap-modal.component';
import { TreapModalComponent } from '../trees/treap-modal/treap-modal.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalInstance! : ComponentRef<any>//Holds de instance
  modalObserver! : Subject<string>;//We create a subject with random type, because we just want to notify the parent on destroy
  modalSize : ModalSize = {modalWidth:0, modalHeight:0};
  modalSizeObs : BehaviorSubject<ModalSize>;

  /**
   * Constructor del servicio.
   * @param factoryResolver Servicio utilizado para obtener la fabrica de un componente
   */
  constructor(private factoryResolver: ComponentFactoryResolver) {
    this.modalSizeObs = new BehaviorSubject<ModalSize>(this.modalSize);
   }

  /**
  * Abre el modal al cual referencia 'explId' insertandolo sobre 'hostContainer'.
  * 
  * @param hostContainer instancia de ViewContainerRef sobre la cual agregaremos la modal
  * @param explId String que representa la explicacion de que algoritmo se desea mostrar
  * @returns Observable del modal.
  */
  openExplanationModal(hostContainer : ViewContainerRef, explId: string){
    let modalFactory = this.getModalFactory(explId);//Trae la fabrica
    this.modalInstance = hostContainer.createComponent(modalFactory);//Crea el componente dentro del hostContainer
    this.modalInstance.instance.closeModalEvent.subscribe(() => this.closeModal());
    this.modalObserver = new Subject<string>();//Usamos subject porque no precisa instanciarlo con un valor.
    return this.modalObserver.asObservable();
  }

  /**
   * Abre el modal al cual referencia 'codeId' insertandolo sobre 'hostContainer'
   * 
   * @param hostContainer instancia de ViewContainerRef sobre la cual agregaremos la modal
   * @param codeId String que representa el codigo de que algoritmo se desea mostrar
   * @returns Observable del modal.
   */
  openCodeModal(hostContainer :ViewContainerRef, codeId: string){
    let modalFactory = this.factoryResolver.resolveComponentFactory(CodeModalComponent);//Brings factory
    this.modalInstance = hostContainer.createComponent(modalFactory);
    this.modalInstance.instance.codeId = codeId;
    this.modalInstance.instance.codeLinesArray = this.modalInstance.instance.loadCodeFromFile();
    this.modalInstance.instance.closeModalEvent.subscribe(() => this.closeModal());
    this.modalObserver = new Subject<string>();//Subject doesn't need value on creating
    return this.modalObserver.asObservable();
  }

  /**
   * Retorna la fabrica del componente identificado por 'elemId'.
   * 
   * @param elemId String que representa la explicacion de que algoritmo se desea mostrar
   * @returns ComponentFactory del componente identificado por 'elemId'.
   */
  getModalFactory(elemId: string): ComponentFactory<any>{
    switch(elemId){
      case("BST"):
        return this.factoryResolver.resolveComponentFactory(BSTModalComponent);
      case("AVLTree"):
        return this.factoryResolver.resolveComponentFactory(AVLModalComponent);
      case("RBT"):
        return this.factoryResolver.resolveComponentFactory(RBLModalComponent);
      case("MaxHeap"):
        return this.factoryResolver.resolveComponentFactory(MaxHeapModalComponent);
      case("MinHeap"):
        return this.factoryResolver.resolveComponentFactory(MinHeapModalComponent);
      case("Treap"):
        return this.factoryResolver.resolveComponentFactory(TreapModalComponent);
      default: // El default es el BST.
      return this.factoryResolver.resolveComponentFactory(BSTModalComponent);
    }
  }

  /**
   * Cierra la modal.
   */
  closeModal(){
    this.modalObserver.next("Closing.");
    this.modalObserver.complete();
    this.modalInstance.destroy();
  }

  /**
   * Calcula el ancho y alto en px que tendra la modal en base al tamaño de la pantalla
   * y actualizar el observable.
   * 
   * @param screenWidth Valor que representa el ancho de la pantalla en px
   * @param screenHeight Valor que representa el alto de la pantalla
   */
  calculateModalSize(screenWidth:number, screenHeight:number){
    let width = 1270 > screenWidth ? 1270 : screenWidth;
    let height = 800 > screenHeight ? 800 : screenHeight;
    this.modalSize.modalWidth = width*0.40;
    this.modalSize.modalHeight = height*0.70;
    this.modalSizeObs.next(this.modalSize);
  }
}
