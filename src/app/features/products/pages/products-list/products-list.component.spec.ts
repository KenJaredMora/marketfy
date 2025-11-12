import { TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductsListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
