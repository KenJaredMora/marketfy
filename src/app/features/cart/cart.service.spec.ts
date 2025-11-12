import { CartService } from './cart.service';

describe('CartService', () => {
  let svc: CartService;

  beforeEach(() => {
    localStorage.clear();
    svc = new CartService();
  });

  it('adds, updates and clears items', () => {
    const p = { id: 1, name: 'Test', price: 10 } as any;

    let lastTotal = -1;
    const sub = svc.total$.subscribe(v => (lastTotal = v));

    svc.add(p, 2);           // 20
    expect(lastTotal).toBe(20);

    svc.updateQty(1, 3);     // 30
    expect(lastTotal).toBe(30);

    svc.clear();             // 0
    expect(lastTotal).toBe(0);

    sub.unsubscribe();
  });
});
