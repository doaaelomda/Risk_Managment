/* eslint-disable @nx/enforce-module-boundaries */

// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationInterface } from './../../../../../../apps/gfw-portal/src/app/core/models/pagination';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  Component,
  EventEmitter,
  Input,
  input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'lib-pagination-native',
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './pagination-native.component.html',
  styleUrl: './pagination-native.component.scss',
})
export class PaginationNativeComponent implements OnChanges {
  @Input() paginationObject!: PaginationInterface;
  @Output() paginationChanged = new EventEmitter<PaginationInterface>();

  pagesSize: number[] = [];
  pagesLinksVisible: number[] = [];
  pointers = { start: 0, end: 3 };
  rowPerPage: number[] = [10, 15, 20, 50, 100];
  rowPerPageValue: number = 10;
  currentPage: number = 1;
  isDisabled: boolean = false;

  paginationStyleTextInput = input<boolean>();
  paginationStyleText: boolean = false;
  Showing: string = localStorage.getItem('user-language') === 'ar' ? 'عرض' : 'Showing';
  Of: string = localStorage.getItem('user-language') === 'ar' ? 'من' : 'of';
  Page: string = localStorage.getItem('user-language') === 'ar' ? 'صفحة' : 'Page';
  RowsPerPage: string = localStorage.getItem('user-language') === 'ar' ? 'عدد الصفوف في الصفحة' : 'Rows per page';
  Direction = localStorage.getItem('user-language') === 'ar';
  firstIcon: string = this.Direction  ? 'fi fi-rr-angle-double-right' : 'fi fi-rr-angle-double-left';
  prevIcon: string = this.Direction ? 'fi fi-rr-angle-small-right' : 'fi fi-rr-angle-small-left';
  nextIcon: string = this.Direction ? 'fi fi-rr-angle-small-left' : 'fi fi-rr-angle-small-right';
  lastIcon: string = this.Direction ? 'fi fi-rr-angle-double-left' : 'fi fi-rr-angle-double-right';

  ngOnChanges(): void {
    this.paginationStyleText = !!this.paginationStyleTextInput;
    if (this.paginationObject) {
      this.rowPerPageValue = this.paginationObject.perPage;
      this.currentPage = this.paginationObject.currentPage;
      this.pagesSize = Array(this.paginationObject.totalPages)
        .fill(null)
        .map((_, i) => i + 1);
      this.pointers = { start: 0, end: 3 };
      this.pagesLinksVisible = this.pagesSize.slice(
        this.pointers.start,
        this.pointers.end
      );
    }
  }

  nextPage() {
    if (this.currentPage >= this.paginationObject.totalPages) return;

    this.currentPage++;
    this.updatePointersIfNeeded();
    this.emitChange();
  }

  prevPage() {
    if (this.currentPage <= 1) return;

    this.currentPage--;
    this.updatePointersIfNeeded();
    this.emitChange();
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.updatePointersIfNeeded();
    this.emitChange();
  }

  changePageSize() {
    this.paginationObject.perPage = this.rowPerPageValue;
    this.currentPage = 1;
    this.pointers = { start: 0, end: 3 };
    this.emitChange();
  }

  goToFirstPage() {
    this.changePage(1);
  }

  goToLastPage() {
    this.changePage(this.paginationObject.totalPages);
  }

  private updatePointersIfNeeded() {
    if (
      this.currentPage >
      this.pagesLinksVisible[this.pagesLinksVisible.length - 1]
    ) {
      this.nextPointer();
    } else if (this.currentPage < this.pagesLinksVisible[0]) {
      this.prevPointer();
    }
  }

  private nextPointer() {
    if (this.currentPage !== this.pagesSize[this.pagesSize.length - 1]) {
      this.pointers.start++;
      this.pointers.end++;
      this.pagesLinksVisible = this.pagesSize.slice(
        this.pointers.start,
        this.pointers.end
      );
    }
  }

  private prevPointer() {
    if (this.currentPage !== this.pagesSize[0]) {
      this.pointers.start--;
      this.pointers.end--;
      this.pagesLinksVisible = this.pagesSize.slice(
        this.pointers.start,
        this.pointers.end
      );
    }
  }

  private emitChange() {
    this.paginationObject.currentPage = this.currentPage;
    this.paginationChanged.emit({ ...this.paginationObject });
  }
}
