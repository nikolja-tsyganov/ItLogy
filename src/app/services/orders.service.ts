import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../interfaces/order.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient){}

    private readonly baseUserUrl: string = 'http://pizza.cheff.ru/orders';

    public createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.baseUserUrl, order);
    }
}
