import {
  Component,
  effect,
  input,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { Section } from '../../models/sections.interface';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-side-sections-list',
  imports: [CommonModule, ProgressBarModule, TranslateModule],
  templateUrl: './side-sections-list.component.html',
  styleUrl: './side-sections-list.component.scss',
})
export class SideSectionsListComponent implements OnInit {
  constructor(
    private _questionnaireS: QuestionnaireService,
    private _router: Router,
    private _authS: AuthService
  ) {
    effect(() => {
      const submittions = this._questionnaireS.submittion();
      if (submittions === 0) return;
      this.moveToNextSection();
    });
  }

  ngOnInit(): void {
    this.getQuestionSections();
  }
  moveToNextSection() {
    const currentSectionIndex = this.question_sections.findIndex(
      (section) => section.id === this.selected_sec.id
    );
    if (!this.question_sections[currentSectionIndex + 1]) {
      setTimeout(() => this._router.navigate(['/thanks']), 1000);
      return;
    }
    this.handleSectionClick(this.question_sections[currentSectionIndex + 1]);
  }
  ngOnDestroy() {
    this._questionnaireS.submittion.set(0);
  }
  selected_sec!: Section;
  Selection_Emitter$ = output<Section>();
  progressInput = input<number>();
  progress: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'changes');

    const progressChange = changes['progressInput'];
    if (progressChange) {
      if (progressChange.currentValue >= 100) {
        this.progress = 100;
        return;
      }
      this.progress = progressChange.currentValue;
    }
  }

  question_sections: Section[] = [];

  dataSub!: Subscription;
  handleSectionClick(section: any) {
    console.log(section, 'section');

    this._authS
      .getAccessData()
      .pipe(
        switchMap((token) => {
          if (!token) {
            this._router.navigate(['/time-out']);
            return of(null);
          }
          return this._questionnaireS
            .getSectionQuestions(token, section.id)
            .pipe(
              catchError((err) => {
                console.error('Error getting section questions', err);
                return of({ data: [] });
              })
            );
        })
      )
      .subscribe((res) => {
        if (!res) return;
        this.selected_sec = { ...section, questions: res.data || [] };
        this.Selection_Emitter$.emit(this.selected_sec);

        console.log(this.selected_sec, 'selected sec');
      });
  }

  getQuestionSections() {
    this._authS
      .getAccessData()
      .pipe(
        switchMap((token) => {
          if (!token) {
            this._router.navigate(['/time-out']);
            return of([]);
          }
          return this._questionnaireS.getInstanceDetails(token).pipe(
            catchError((err) => {
              console.error('Error getting sections', err);
              return of([]);
            })
          );
        })
      )
      .subscribe((res) => {
        this.question_sections = res.data || [];
        if (this.question_sections.length) {
          this.handleSectionClick(this.question_sections[0]);
        }
      });
  }
}
