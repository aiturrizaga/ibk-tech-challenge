import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgOptimizedImage, UpperCasePipe } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Dialog } from "@angular/cdk/dialog";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { OnlyNumberDirective, SelectOnFocusDirective } from "@ibk/core/directives";
import { Currency, CurrencySelect, ExchangeRateResponse } from "@ibk/core/interfaces";
import { CurrencySelectDlgComponent } from "@ibk/domain/exchange-rate/components";

@Component({
  selector: 'ibk-currency-card',
  standalone: true,
  imports: [ReactiveFormsModule, OnlyNumberDirective, SelectOnFocusDirective, UpperCasePipe, NgOptimizedImage],
  templateUrl: './currency-card.component.html',
  styles: `
    :host {
      @apply max-w-sm rounded-2xl border border-gray-200 -m-8 md:m-0 overflow-hidden flex-grow flex flex-col;
    }
  `
})
export class CurrencyCardComponent implements OnInit, OnDestroy {

  @Input({ required: true }) currency!: Currency | undefined;
  @Input({ required: true }) excludedCurrency!: Currency | undefined;
  @Input({ required: true }) exchangeRate!: ExchangeRateResponse;
  @Input() amount: FormControl = new FormControl<number>(1);
  @Input() dlgCurrencyTitle!: string;
  @Output() currencySelected: EventEmitter<Currency> = new EventEmitter();
  @Output() amountChanged: EventEmitter<number> = new EventEmitter();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dialog: Dialog) {
  }

  ngOnInit(): void {
    this.onAmountChange();
  }

  selectCurrency(): void {
    const dialogRef = this.dialog.open<Currency>(CurrencySelectDlgComponent, {
      data: {
        dialogTitle: this.dlgCurrencyTitle,
        currentCurrency: this.currency,
        excludeCurrency: this.excludedCurrency
      } as CurrencySelect
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.currency = res;
        this.currencySelected.emit(res);
      }
    });
  }

  onAmountChange(): void {
    this.amount.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe((value: number) => {
      this.amountChanged.emit(value);
    });
  }

  get fullRateText(): string {
    if (this.exchangeRate && this.exchangeRate.conversionRate) {
      let conversionRate = parseFloat(this.exchangeRate.conversionRate.toFixed(3))
      return `1 ${ this.exchangeRate.fromCurrency } = ${ this.exchangeRate.toCurrency } ${ conversionRate }`;
    }
    return ''
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
