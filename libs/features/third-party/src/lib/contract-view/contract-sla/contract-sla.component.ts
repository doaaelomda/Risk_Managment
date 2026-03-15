import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaListComponent } from '../../sla-list/sla-list.component';

@Component({
  selector: 'lib-contract-sla',
  imports: [CommonModule,SlaListComponent],
  templateUrl: './contract-sla.component.html',
  styleUrl: './contract-sla.component.scss',
})
export class ContractSlaComponent {}
