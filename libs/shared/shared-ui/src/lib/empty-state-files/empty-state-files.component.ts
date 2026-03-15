import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-empty-state-files',
  imports: [CommonModule,TranslateModule

  ],
  templateUrl: './empty-state-files.component.html',
  styleUrl: './empty-state-files.component.scss',
})
export class EmptyStateFilesComponent {}
