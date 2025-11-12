import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import type { Product } from '../products/products.service';

export interface CartItem { product: Product; qty: number; }
const KEY='marketfy_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private subject = new BehaviorSubject<CartItem[]>(this.read());
  items$ = this.subject.asObservable();
  cartCount$ = this.items$.pipe(map(items => items.reduce((a,i)=>a+i.qty,0)));
  total$ = this.items$.pipe(map(items => items.reduce((a,i)=>a+i.product.price*i.qty,0)));

  add(p: Product, qty=1){ const xs=[...this.subject.value]; const i=xs.findIndex(x=>x.product.id===p.id);
    i>=0 ? xs[i]={...xs[i],qty:xs[i].qty+qty} : xs.push({product:p,qty});
    this.commit(xs);
  }
  updateQty(id:number, qty:number){ this.commit(this.subject.value.map(x=>x.product.id===id?{...x,qty}:x)); }
  remove(id:number){ this.commit(this.subject.value.filter(x=>x.product.id!==id)); }
  clear(){ this.commit([]); }
  private commit(xs:CartItem[]){ this.subject.next(xs); localStorage.setItem(KEY, JSON.stringify(xs)); }
  private read():CartItem[]{ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch{ return []; } }
}
