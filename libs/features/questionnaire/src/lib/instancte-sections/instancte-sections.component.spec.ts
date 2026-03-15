import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstancteSectionsComponent } from './instancte-sections.component';

describe('InstancteSectionsComponent', () => {
  let component: InstancteSectionsComponent;
  let fixture: ComponentFixture<InstancteSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstancteSectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstancteSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
