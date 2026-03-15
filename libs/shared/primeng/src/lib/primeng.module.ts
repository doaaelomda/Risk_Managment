import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    PanelMenuModule,
    MenuModule,
    TableModule,
    OverlayPanelModule,
    CheckboxModule,
    DropdownModule,
    ToastModule,
    DialogModule,
    InputSwitchModule
  ],
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    PanelMenuModule,
    MenuModule,
    TableModule,
    OverlayPanelModule,
    CheckboxModule,
    DropdownModule,
    ToastModule,
    DialogModule,
    InputSwitchModule
  ]
})
export class PrimengModule {}
