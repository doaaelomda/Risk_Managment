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
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { SharedService } from '../../services/shared.service';
import { ButtonModule } from 'primeng/button';
import { InputSearchComponent } from '../input-search/input-search.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteConfirmPopupComponent } from '../delete-confirm-popup/delete-confirm-popup.component';
import { UiDropdownComponent } from '../ui-dropdown/ui-dropdown.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { PaginationNativeComponent } from '../pagiantion-native/pagination-native.component';
import { EmptyStateFilesComponent } from '../empty-state-files/empty-state-files.component';

@Component({
  selector: 'lib-new-attach-list',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputSearchComponent,
    SkeletonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    UiDropdownComponent,
    PaginationNativeComponent,
    EmptyStateFilesComponent,
  ],
  templateUrl: './new-attach-list.component.html',
  styleUrls: ['./new-attach-list.component.scss'],
})
export class NewAttachListComponent implements OnChanges {
  constructor(private _sharedService: SharedService) {}

  loadingSatate = input<boolean>(false);
  showSearch = input<boolean>(true);
  showIconDelete = input<boolean>(true);
  showIconEdit = input<boolean>(true);
  showIconShow = input<boolean>(true);
  showIconDownLoad = input<boolean>(true);
  dataClassicBadge = input<boolean>(false);
  paginationChanged = output<PaginationInterface>();
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
  attachmentControl: FormControl = new FormControl(null);
  attachmentsArray: any[] = [
    { id: 1, label: 'All Attachment' },
    { id: 2, label: 'Items Files' },
  ];
  filesTemp: any;
  action_emiter = output<{ action: string; file: any }>();
  actionDeleteVisible: boolean = false;
  selectedFile!: any;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  handleSearch(event: any) {
    this.filesTemp =
      this.files()?.filter((file: any) =>
        file?.fileTitle
          ?.toLocaleLowerCase()
          ?.includes(event?.toLocaleLowerCase())
      ) || [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.filesTemp = changes['files']?.currentValue;
    if (this.filesTemp) {
      this.updatePagination();
    }
  }

  getIcon(type: string) {
    return (
      this.iconMap[type?.replace('.', '').toLowerCase()] ||
      'images/iconFile.png'
    );
  }
  emitAction(action: string, file: any) {
    this.action_emiter.emit({ action, file });
  }
  handleClosedDelete() {
    this.actionDeleteVisible = false;
    this.current_selected_attachment = null;
  }

  openDelete(file: any) {
    this.selectedFile = file;
    this.actionDeleteVisible = true;
  }

  confirmDelete() {
    this.emitAction('Delete', this.current_selected_attachment);
    this.handleClosedDelete();
  }

  current_selected_attachment: any;
  showDelete(file: any, event: PointerEvent) {
    this.current_selected_attachment = file;
    event.stopPropagation();
    this.openDelete(file);
  }

  updatePagination() {
    const totalItems = this.filesTemp.length;
    const perPage = 8;

    const totalPages = Math.ceil(totalItems / perPage) || 1;

    this.pageginationObj = {
      perPage,
      currentPage: 1,
      totalItems,
      totalPages,
    };
  }

  get paginatedFiles() {
    if (!this.pageginationObj) return [];

    const start =
      (this.pageginationObj.currentPage - 1) * this.pageginationObj.perPage;

    const end = start + this.pageginationObj.perPage;

    return this.filesTemp.slice(start, end);
  }

  onPaginationChanged(updatedPagination: PaginationInterface) {
    this.pageginationObj = { ...updatedPagination };
    this.paginationChanged.emit(this.pageginationObj);
  }

  getFiles(event: any) {
    if (event?.value == 1) {
      const req = {
        pageNumber: event?.currentPage || 1,
        pageSize: event?.perPage || 10,
      };

      this._sharedService.getSearchFiles(req).subscribe((res: any) => {
        console.log('Search Files', res);
        this.filesTemp = res?.data?.items.map((file: any) => {
          return {
            ...file,
            selected: false,
          };
        });
        this._sharedService.paginationSubject.next({
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        });
      });
    }
  }
   truncate(name: string): string {
    return this._sharedService.truncateWords(name, 3);
  }
}
