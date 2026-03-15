import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAttachmentComponent } from './editAttachment.component';

describe('EditAttachmentComponent', () => {
  let component: EditAttachmentComponent;
  let fixture: ComponentFixture<EditAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttachmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
