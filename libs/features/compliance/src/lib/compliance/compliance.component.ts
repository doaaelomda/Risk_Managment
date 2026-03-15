import { Component } from '@angular/core';
import { MenuModule } from "primeng/menu";

@Component({
  selector: 'lib-compliance',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.css',
})
export class ComplianceComponent {}
