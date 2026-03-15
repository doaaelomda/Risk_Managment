import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateDashbourdComponent } from './empty-state-dashbourd.component';

describe('EmptyStateDashbourdComponent', () => {
  let component: EmptyStateDashbourdComponent;
  let fixture: ComponentFixture<EmptyStateDashbourdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateDashbourdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateDashbourdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
