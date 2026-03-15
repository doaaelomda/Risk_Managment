import { CardModule } from 'primeng/card';
import {
  Component,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedService } from '../../services/shared.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-single-attachment',
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TranslateModule,
  ],
  templateUrl: './single-attachemnt.component.html',
  styleUrl: './single-attachemnt.component.scss',
})
export class SingleAttachmentComponent implements OnChanges {
  constructor(
    private _sharedServices: SharedService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute
  ) {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.idEdit = params.get('id');
    });
  }

  idEdit: any;
  handleSearch(event: any) {
    this.filesTemp =
      this.files()?.filter((file: any) =>
        file?.fileTitle
          ?.toLocaleLowerCase()
          ?.includes(event?.toLocaleLowerCase())
      ) || [];
  }

  loadingState = input<boolean>(false);

  filesTemp: any[] = [];
  maxFiles: number = 1;
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['files'] && this.files.length > 0) {
      this.filesTemp = [this.files];
    }
  }
  files = input<any[]>();

  add_emiter = output<boolean>();

  iconMap: any = {
    pdf: 'images/Gradient - Full Width Label.svg',
    docx: 'images/wordfile.png',
    doc: 'images/wordfile.png',
    link: 'images/link-03.svg',
    xlsx: 'images/excelfile.png',
    xls: 'images/excelfile.png',
    png: 'images/png_images.png',
    jpeg: 'images/png_images.png',
    svg: 'images/svgFile.png',
    gif: 'images/gif.png',
    jpg: 'images/jpg.png',
  };
  getIcon(type: string) {
    return (
      this.iconMap[type?.replace('.', '').toLowerCase()] ||
      'images/iconFile.png'
    );
  }

  action_emiter = output<{ action: string; file: any }>();

  emitAction(action: string, file: any) {
    this.action_emiter.emit({ action, file });
  }
}
