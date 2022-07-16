import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dimensions } from '../model/Dimensions';

@Injectable({
  providedIn: 'root'
})
export class ContainerSizeService {
  configDimension : Dimensions = {width:0, height:0};
  execBodyDimension : Dimensions = {width:0, height:0};
  execBodyDimObs : BehaviorSubject<Dimensions>;

  constructor() { 
    this.execBodyDimObs = new BehaviorSubject<Dimensions>(this.execBodyDimension);
  }

  /**
   * Calcula el ancho y alto en px que tendra la modal en base al tamaño de la pantalla
   * y actualizar el observable.
   * 
   * @param screenWidth Valor que representa el ancho de la pantalla en px
   * @param screenHeight Valor que representa el alto de la pantalla
   */
   calculateContainersSize(containerWidth:number, containerHeight:number){
    let width = 1270 > containerWidth ? 1270 : containerWidth;
    let height = 850 > containerHeight ? 850 : containerHeight;
    this.setConfigDimensions(width,height);
    this.setExecBodyDimensions(width,height);
  }

  setConfigDimensions(containerWidth:number, containerHeight:number){
    this.configDimension.width = containerWidth < 1500 ? 300 : 350;
    this.configDimension.height = containerHeight;
  }


  setExecBodyDimensions(containerWidth:number, containerHeight:number){
    this.execBodyDimension.width = (containerWidth - this.configDimension.width) ;
    this.execBodyDimension.height = containerHeight - 250;
    this.execBodyDimObs.next(this.execBodyDimension);
  }
}