import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmnetOngoingCommentComponent } from './assessmnetOngoingComment.component';

describe('AssessmnetOngoingCommentComponent', () => {
  let component: AssessmnetOngoingCommentComponent;
  let fixture: ComponentFixture<AssessmnetOngoingCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmnetOngoingCommentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmnetOngoingCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
