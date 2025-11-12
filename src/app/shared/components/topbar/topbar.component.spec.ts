import { TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TopbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
