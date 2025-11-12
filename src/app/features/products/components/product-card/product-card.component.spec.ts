import { TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
