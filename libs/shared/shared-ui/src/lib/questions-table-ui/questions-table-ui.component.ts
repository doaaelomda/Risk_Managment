/* eslint-disable @nx/enforce-module-boundaries */
// eslint-disable-next-line @nx/enforce-module-boundaries
import { QuestionsService } from './../../../../../features/questionnaire/src/lib/services/questions.service';
import { Component, Input, input, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '@gfw/primeng';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from '../../services/shared.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { InputSearchComponent } from '../input-search/input-search.component';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';

@Component({
  selector: 'lib-questions-table-ui',
  imports: [
    CommonModule,
    PrimengModule,
    TranslateModule,
    PaginationComponent,
    EmptyStateComponent,
    InputSearchComponent,
  ],
  templateUrl: './questions-table-ui.component.html',
  styleUrl: './questions-table-ui.component.scss',
})
export class QuestionsTableUiComponent {
  constructor(private _translationS: TranslationsService) {}
  is_ar: boolean = false;

  ngOnInit() {
    this._translationS.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_ar = true;
      } else {
        this.is_ar = false;
      }
    });
  }
  dataList = input<any[]>([]);
  loadingState = input.required<boolean>();
  table_name = input.required<string>();
  badge_name = input.required<string>();
  total_items_input = input.required<number>();
  inComingQuestions = input<any[]>([]); // parent selection

  // Outputs
  paginationEvent = output<any>();
  selected_questions = output<any[]>(); // emit current selection
  searched = output<any>();

  // Local state
  data: any[] = [];
  questions: any[] = []; // table selection
  badge_title: string = '';
  table_title: string = '';
  loading: boolean = false;
  total_items = 0;

  ngOnChanges(changes: SimpleChanges) {
    // Sync data list
    if (changes['dataList']?.currentValue) {
      this.data = changes['dataList'].currentValue;
    }

    // Only set initial selection once or when parent explicitly changes it
    if (changes['inComingQuestions']?.currentValue) {
      this.questions = changes['inComingQuestions'].currentValue;
      console.log(this.questions, 'this.questions after changes');
    }

    // Sync meta info
    if (changes['badge_name']) {
      this.badge_title = changes['badge_name'].currentValue;
    }
    if (changes['table_name']) {
      this.table_title = changes['table_name'].currentValue;
    }
    if (changes['total_items_input']) {
      this.total_items = changes['total_items_input'].currentValue;
    }
    if (changes['loadingState']) {
      this.loading = changes['loadingState'].currentValue;
    }
  }

  handleChangePage(event: any) {
    this.paginationEvent.emit(event);
  }

  handleSelection(event: any) {
    // Emit entire updated selection
    this.selected_questions.emit(this.questions);
  }

  handleSearch(event: any) {
    this.searched.emit(event);
  }
}
