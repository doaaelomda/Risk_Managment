import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachmentsInvestComponent } from './attachments-invest.component';

describe('AttachmentsInvestComponent', () => {
  let component: AttachmentsInvestComponent;
  let fixture: ComponentFixture<AttachmentsInvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentsInvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentsInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
