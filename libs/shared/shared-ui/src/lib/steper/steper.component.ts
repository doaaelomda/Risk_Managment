import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-steper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './steper.component.html',
  styleUrls: ['./steper.component.css'],
})
export class SteperComponent implements OnChanges {
  constructor(private _TranslateService: TranslateService) {}

  @Input() currentStepIndex = 0;

  @Input() stepLabels: string[] = [
    'Enter Your Mail',
    'Check your inbox for the reset & Set new Password',
  ];

  @Input() stepslabelspara: string[] = [
    'Provide us your info',
    'Check mail',
  ];

  steps: number[] = [];

  ngOnChanges(): void {
    this.steps = this.stepLabels?.map((_, i) => i) || [];
  }

  getStepClass(index: number): string {
    if (index < this.currentStepIndex) return 'circle complete';
    if (index === this.currentStepIndex) return 'circle active';
    return 'circle inactive';
  }

  getLabelClass(index: number): string {
    if (index === this.currentStepIndex) return 'step-label active';
    if (index < this.currentStepIndex) return 'step-label completed';
    return 'step-label';
  }

  getLabelPar(index: number): string {
    return index === this.currentStepIndex ? 'step-parg active' : 'step-parg';
  }

  getLineClass(index: number): string {
    const isArabic = this._TranslateService.currentLang === 'ar';
    const base = isArabic ? 'line-ar' : 'line';
    if (index < this.currentStepIndex - 1) return `${base} ${base}-complete`;
    if (index === this.currentStepIndex - 1) return `${base} ${base}-active`;
    return `${base} ${base}-inactive`;
  }
}
