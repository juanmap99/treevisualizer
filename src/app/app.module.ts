import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MaterialModule } from './material/material.module';
import { ReferenceBarComponent } from './reference-bar/reference-bar.component';
import { CodeModalComponent } from './code-modal/code-modal.component';
import { ClipboardModule } from 'ngx-clipboard';
import { SnackBarCodeCopiedComponent } from './snack-bar-code-copied/snack-bar-code-copied.component';
import { TreeSectionComponent } from './trees/tree-section/tree-section.component';
import { TreeConfigComponent } from './trees/tree-config/tree-config.component';
import { TreeDisplayComponent } from './trees/tree-display/tree-display.component';
import { BSTModalComponent } from './trees/bst-modal/bst-modal.component';
import { AVLModalComponent } from './trees/avl-modal/avl-modal.component';
import { RBLModalComponent } from './trees/rbl-modal/rbl-modal.component';
import { MaxHeapModalComponent } from './trees/max-heap-modal/max-heap-modal.component';
import { MinHeapModalComponent } from './trees/min-heap-modal/min-heap-modal.component';
import { TreapModalComponent } from './trees/treap-modal/treap-modal.component';
import { SextaCapaErrorComponent } from './trees/sexta-capa-error/sexta-capa-error.component';

@NgModule({
  declarations: [
    AppComponent,
    ReferenceBarComponent,
    CodeModalComponent,
    SnackBarCodeCopiedComponent,
    TreeSectionComponent,
    TreeConfigComponent,
    TreeDisplayComponent,
    BSTModalComponent,
    AVLModalComponent,
    RBLModalComponent,
    MaxHeapModalComponent,
    MinHeapModalComponent,
    TreapModalComponent,
    SextaCapaErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
