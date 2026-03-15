import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListComponent } from "../../contract-list/contract-list.component";

@Component({
  selector: 'lib-third-party-contract',
  imports: [CommonModule, ContractListComponent],
  templateUrl: './third-party-contract.component.html',
  styleUrl: './third-party-contract.component.scss',
})
export class ThirdPartyContractComponent {


}
