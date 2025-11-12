import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name:'price', standalone:true })
export class PricePipe implements PipeTransform {
  transform(value:number, currency='USD'){ return new Intl.NumberFormat('en-US',{style:'currency',currency}).format(value??0); }
}
