import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionsTableUiComponent } from './questions-table-ui.component';

describe('QuestionsTableUiComponent', () => {
  let component: QuestionsTableUiComponent;
  let fixture: ComponentFixture<QuestionsTableUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsTableUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionsTableUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
