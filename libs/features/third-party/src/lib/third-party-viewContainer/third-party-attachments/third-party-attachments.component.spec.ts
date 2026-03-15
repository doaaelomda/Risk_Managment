import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThirdPartyAttachmentsComponent } from './third-party-attachments.component';

describe('ThirdPartyAttachmentsComponent', () => {
  let component: ThirdPartyAttachmentsComponent;
  let fixture: ComponentFixture<ThirdPartyAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyAttachmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdPartyAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
