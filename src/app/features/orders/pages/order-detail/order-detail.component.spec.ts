import { TestBed } from '@angular/core/testing';
import { OrderDetailComponent } from './order-detail.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CommonModule } from '@angular/common';

describe('OrderDetailComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, OrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['orderId', 'TEST-123']]) },
          },
        },
        {
          provide: ApiService,
          useValue: {
            get: () =>
              of({
                orderId: 'TEST-123',
                createdAt: new Date().toISOString(),
                total: 123.45,
                items: [],
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OrderDetailComponent);
    const cmp = fixture.componentInstance;
    fixture.detectChanges();
    expect(cmp).toBeTruthy();
  });
});
