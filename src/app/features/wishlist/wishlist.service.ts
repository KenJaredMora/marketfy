import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Product } from '../products/products.service';

const KEY='marketfy_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private subject = new BehaviorSubject<Product[]>(this.read());
  items$ = this.subject.asObservable();

  toggle(p:Product){ const xs=[...this.subject.value]; const i=xs.findIndex(x=>x.id===p.id);
    i>=0 ? xs.splice(i,1) : xs.push(p); this.commit(xs); }
  remove(id:number){ this.commit(this.subject.value.filter(x=>x.id!==id)); }
  clear(){ this.commit([]); }
  private commit(xs:Product[]){ this.subject.next(xs); localStorage.setItem(KEY, JSON.stringify(xs)); }
  private read():Product[]{ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch{ return []; } }
}
