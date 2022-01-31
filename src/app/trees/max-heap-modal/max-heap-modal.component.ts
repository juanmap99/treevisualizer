import {  Component, EventEmitter, Output } from '@angular/core';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ModalSize } from '../model/ModalSize';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-max-heap-modal',
  templateUrl: './max-heap-modal.component.html',
  styleUrls: ['./max-heap-modal.component.scss']
})
export class MaxHeapModalComponent{

  @Output() closeModalEvent = new EventEmitter();
  modalWidth : number = 0;
  modalHeight : number = 0;
  curModalTab : number = 0;
  closeButton = faTimes;

  constructor(private modalServ: ModalService) { 
    modalServ.modalSizeObs.subscribe((newSize)=> this.setNewSize(newSize));
  }

  /**
   * Define el ancho y largo del model size
   * @param newSize Nuevo tamaño del model size
   */
   setNewSize(newSize: ModalSize){
    this.modalWidth = newSize.modalWidth;
    this.modalHeight = newSize.modalHeight;
  }

  /**
   * Emite un evento que es atrapado por el ModalService que se encarga de cerrra la modal.
   */
  closeModal(){
    this.closeModalEvent.emit();
  }

  /**
   * Funcion que aumenta el tamaño de la variable local 'curModalTab' en pos de que
   * se pase a la siguiente pagina de la explicacion
   */
  goNextPage(){
    this.curModalTab += 1;
  }

  /**
   * Funcion que decrementa el tamaño de la variable local 'curModalTab' en pos de que
   * se vuelva a la pagina previa de la explicacion
   */
  goPreviousPage(){
    this.curModalTab -= 1;
  }

}
