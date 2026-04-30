import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { provideData } from '../../data-providers/pizza.data-provider';
import { Pizza } from '../../interfaces/pizza.interface';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Order } from '../../interfaces/order.interface';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'app-main-page',
    imports: [FormsModule],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss',
    providers: [
        {
          provide: 'PIZZAS_DATA',
          useFactory: provideData,
        }
    ]
})
export class MainPageComponent {

    public readonly pizzasColumnsNumber = 4;
    public pizzasStringsNumber = 0;

    public modalDialogVisible = false;
    public orderAdded = false;

    public currentBigPizza: Pizza | null = null;
    public bigPizzaVisible: boolean = false;

    order: Order = {
        name: '',
        address: '',
        phone: '',
        pizzas: [],
    }

    @ViewChild('pizzaBlock', { static: true }) pizzaBlock!: ElementRef;
    @ViewChild('orderForm') orderForm!: NgForm;
    @ViewChild('nameRef') nameRef!: NgModel;
    @ViewChild('phoneRef') phoneRef!: NgModel;

    constructor(
        @Inject('PIZZAS_DATA') public pizzas: Pizza[],
        private orderServise: OrdersService,
    ) {
    }

    ngOnInit(): void {
        this.getPizzasStringNumber();
    }

    ngAfterViewInit(): void {
        this.nameRef.valueChanges?.subscribe((value) => {
            if (value && value.includes('.')) {
                const cleanValue = value.replace(/\./g, '');
                this.nameRef.control.setValue(cleanValue);
            }
        });

        this.phoneRef.valueChanges?.subscribe((value) => {
            if (value && /[^\d]/.test(value)) {
                this.phoneRef.control.setValue(value.replace(/[^\d]/g, ''));
              }
        })
    }

    public getPizzasStringNumber(): void {
        this.pizzasStringsNumber = Math.ceil(this.pizzas.length / 4);
    }

    public scrollToPizzas(): void {
        if (this.pizzaBlock) {
            this.pizzaBlock.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

    public addPizzaToOrder(pizzaName: string): void {
        this.order.pizzas.push(pizzaName);
    }

    public choosePizza(): void {
        this.modalDialogVisible = false;
        this.scrollToPizzas();
    }

    public chooseMorePizza(): void {
        this.modalDialogVisible = false;
        this.orderAdded = false;
        this.order = {
            name: '',
            address: '',
            phone: '',
            pizzas: [],
        }
        this.scrollToPizzas();
    }

    public onSubmit(orderForm: NgForm) {
        if(this.order.pizzas.length === 0) {
            this.modalDialogVisible = true;
        } else {
            this.orderServise.createOrder(this.order).subscribe({
                next: (res) => {
                    console.log(res);
                },
                error: (err) => {
                    console.log(err);
                }
            });
            this.modalDialogVisible = true;
            this.orderAdded = true;
        }
    }

    showBigPizza(pizza: Pizza): void {
        this.bigPizzaVisible = true;
        this.currentBigPizza = pizza;
    }

    hideBigPizza(): void {
        this.bigPizzaVisible = false;
        this.currentBigPizza = null;
    }
}
