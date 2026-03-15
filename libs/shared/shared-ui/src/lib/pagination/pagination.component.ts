/* eslint-disable @nx/enforce-module-boundaries */

// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationInterface } from './../../../../../../apps/gfw-portal/src/app/core/models/pagination';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component, EventEmitter, input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';

@Component({
  selector: 'lib-pagination',
  imports: [CommonModule , DropdownModule , FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
   @Output() paginationChanged = new EventEmitter<PaginationInterface>()
  constructor(private _SharedService: SharedService,private _TranslateService:TranslationsService) {

  }
  pagesSize: any[] = []
  pagesLinksVisible:any[] = []
  pointers = {start:0 , end:3}
  rowPerPage:number[]=[10,15,20,50,100]
  rowPerPageValue: number = 10
  currentPage: number = 1
  paginationObject!: PaginationInterface | any;
  isDisabled: boolean = false

  paginationStyleTextInput = input<boolean>()


  paginationStyleText: boolean = false
  Showing: string = localStorage.getItem('user-language') === 'ar' ? 'عرض' : 'Showing';
  Of: string = localStorage.getItem('user-language') === 'ar' ? 'من' : 'of';
  Page: string = localStorage.getItem('user-language') === 'ar' ? 'صفحة' : 'Page';
  RowsPerPage: string = localStorage.getItem('user-language') === 'ar' ? 'عدد الصفوف في الصفحة' : 'Rows per page';
  Direction: string = localStorage.getItem('user-language') === 'ar' ? 'rtl' : 'ltr';
  firstIcon: string = this.Direction === 'ar' ? 'fi fi-rr-angle-double-right' : 'fi fi-rr-angle-double-left';
  prevIcon: string = this.Direction === 'ar' ? 'fi fi-rr-angle-small-right' : 'fi fi-rr-angle-small-left';
  nextIcon: string = this.Direction === 'ar' ? 'fi fi-rr-angle-small-left' : 'fi fi-rr-angle-small-right';
  lastIcon: string = this.Direction === 'ar' ? 'fi fi-rr-angle-double-left' : 'fi fi-rr-angle-double-right';



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationStyleTextInput'].currentValue) {
        this.paginationStyleText = true
    } else {
      this.paginationStyleText = false
    }
  }


  ngOnInit(): void {
  this._SharedService.paginationSubject.subscribe(res => {
    if (res) {
      if (res?.totalPages !== this.pagesSize.length) {
        this.pointers = { start: 0, end: 3 };
      }

      this.pagesSize = Array(res?.totalPages).fill(null).map((_, i) => i + 1);
      this.pagesLinksVisible = this.pagesSize.slice(this.pointers.start, this.pointers.end);

      this.rowPerPageValue = res?.perPage;
      this.currentPage = res?.currentPage;
      this.paginationObject = res;
    }
    this.isDisabled = false;
  });
  this._TranslateService.selected_lan_sub.subscribe((lang: string) => {
    this.Direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.Showing = lang === 'ar' ? 'عرض' : 'Showing';
    this.Of = lang === 'ar' ? 'من' : 'of';
    this.Page = lang === 'ar' ? 'صفحة' : 'Page';
    this.RowsPerPage = lang === 'ar' ? 'عدد الصفوف في الصفحة' : 'Rows per page';
    this.firstIcon = lang === 'ar' ? 'fi fi-rr-angle-double-right' : 'fi fi-rr-angle-double-left';
    this.prevIcon = lang === 'ar' ? 'fi fi-rr-angle-small-right' : 'fi fi-rr-angle-small-left';
    this.nextIcon = lang === 'ar' ? 'fi fi-rr-angle-small-left' : 'fi fi-rr-angle-small-right';
    this.lastIcon = lang === 'ar' ? 'fi fi-rr-angle-double-left' : 'fi fi-rr-angle-double-right';
  });
}

  nextPage() {
    this.isDisabled = true
    if (this.paginationObject) {
      if (this.paginationObject.currentPage >= this.paginationObject.totalPages) {
        //Do Nothing
      }
      else {
        this.paginationObject.currentPage += 1
        if (this.paginationObject.currentPage > this.pagesLinksVisible[this.pagesLinksVisible.length-2] && this.paginationObject.currentPage == this.pagesLinksVisible[this.pagesLinksVisible.length -1]) {
          this.nextPinter()

        }

        this.paginationChanged.emit(this.paginationObject)
      }

    }
  }
  prevPage() {
        this.isDisabled = true
    if (this.paginationObject) {

      if (this.paginationObject.currentPage <= 1 ) {
        //Do Nothing
      }
      else {
        this.paginationObject.currentPage -= 1
        if (this.paginationObject.currentPage < this.pagesLinksVisible[this.pagesLinksVisible.length - 2] && this.paginationObject.currentPage == this.pagesLinksVisible[0]) {
          this.prevPointer()
        }
        this.paginationChanged.emit(this.paginationObject)

      }

    }

  }
  changePage(pageNumber:number) {
    if (this.paginationObject) {
      this.isDisabled = true
      this.paginationObject.currentPage = pageNumber
      this.paginationChanged.emit(this.paginationObject)
      if (this.paginationObject.currentPage == this.pagesLinksVisible[this.pagesLinksVisible.length - 1]) {
        this.nextPinter()
      }
      if (this.paginationObject.currentPage == this.pagesLinksVisible [0]) {
        this.prevPointer()
      }

         if (pageNumber == this.pagesSize[this.pagesSize.length - 1] && this.pagesSize.length > 3) {
            this.pagesLinksVisible = this.pagesSize.slice(this.pagesSize.length - 3)
            this.pointers.start = this.pagesSize.length - 3
            this.pointers.end =this.pagesSize.length

        }
    }
  }
  changePageSize() {
    if (this.paginationObject) {
      this.isDisabled = true
      this.paginationObject.perPage = this.rowPerPageValue
      this.paginationObject.currentPage = 1
      this.pointers.start = 0
      this.pointers.end = 3
      this.paginationChanged.emit(this.paginationObject)
    }
  }



  nextPinter() {
       if (this.paginationObject.currentPage != this.pagesSize[this.pagesSize.length - 1]) {
               this.pointers.start++;
              this.pointers.end++;
          }
  }


  prevPointer() {
    if (this.paginationObject.currentPage != this.pagesSize[0]) {
            this.pointers.start--;
            this.pointers.end--;
      }
  }

goToFirstPage() {
  this.changePage(1);
}

goToLastPage() {
  this.changePage(this.pagesSize.length);
}


}
