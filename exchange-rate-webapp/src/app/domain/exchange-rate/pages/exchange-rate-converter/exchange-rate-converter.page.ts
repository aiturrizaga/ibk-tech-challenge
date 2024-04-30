import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from "@angular/cdk/dialog";
import { Currency, ExchangeRateResponse } from "@ibk/core/interfaces";
import { CurrencyService, ExchangeRateService } from "@ibk/core/services";
import { UpperCasePipe } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { forkJoin, Subject, takeUntil } from "rxjs";
import { OnlyNumberDirective, SelectOnFocusDirective } from "@ibk/core/directives";
import { CurrencyCardComponent } from "@ibk/domain/exchange-rate/components";

@Component({
  selector: 'ibk-exchange-rate-converter-page',
  standalone: true,
  imports: [DialogModule, UpperCasePipe, ReactiveFormsModule, OnlyNumberDirective, SelectOnFocusDirective, CurrencyCardComponent],
  templateUrl: './exchange-rate-converter.page.html'
})
export class ExchangeRateConverterPage implements OnInit, OnDestroy {

  baseCurrency!: Currency;
  targetCurrency!: Currency;
  baseExchangeRate!: ExchangeRateResponse;
  targetExchangeRate!: ExchangeRateResponse;
  baseAmount: FormControl = new FormControl(1);
  targetAmount: FormControl = new FormControl(1);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private exchangeRateService: ExchangeRateService,
              private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.loadInitialCurrencies(['PEN', 'USD']);
  }

  loadInitialCurrencies(codes: string[]): void {
    forkJoin(codes.map(code => this.currencyService.findByCode(code)))
      .pipe(takeUntil(this.destroy$))
      .subscribe(([base, target]) => {
          [this.baseCurrency, this.targetCurrency] = [base, target];
          this.loadConversions();
        }
      );
  }

  loadConversions(): void {
    if (!this.baseCurrency || !this.targetCurrency) return;
    this.setConversionRate(this.baseCurrency, this.targetCurrency);
  }

  handleBaseCurrencyChange(currency: Currency): void {
    this.baseCurrency = currency;
    if (this.targetCurrency) this.setConversionRate(currency, this.targetCurrency);
  }

  handleTargetCurrencyChange(currency: Currency): void {
    this.targetCurrency = currency;
    if (this.baseCurrency) this.setConversionRate(this.baseCurrency, currency);
  }

  handleBaseAmountChange(amount: number): void {
    const convertedAmount: number = amount * this.baseExchangeRate.conversionRate;
    this.targetAmount.setValue(parseFloat(convertedAmount.toFixed(3)), { emitEvent: false });

    if (this.baseCurrency && this.targetCurrency) {
      this.saveRateConversion(this.baseCurrency.code, this.targetCurrency.code, amount);
    }
  }

  handleTargetAmountChange(amount: number): void {
    const convertedAmount: number = amount * this.targetExchangeRate.conversionRate;
    this.baseAmount.setValue(parseFloat(convertedAmount.toFixed(3)), { emitEvent: false });

    if (this.baseCurrency && this.targetCurrency) {
      this.saveRateConversion(this.targetCurrency.code, this.baseCurrency.code, amount);
    }
  }

  saveRateConversion(fromCurrency: string, toCurrency: string, amount: number): void {
    this.exchangeRateService.saveRateConversion({
      fromCurrency,
      toCurrency,
      amount
    }).subscribe()
  }

  setConversionRate(baseCurrency: Currency, targetCurrency: Currency): void {
    this.baseAmount.reset(1, { emitEvent: false });
    this.targetAmount.reset(1, { emitEvent: false });

    forkJoin([
      this.exchangeRateService.getConversion({
        fromCurrency: baseCurrency.code,
        toCurrency: targetCurrency.code,
        amount: this.baseAmount.value
      }),
      this.exchangeRateService.getConversion({
        fromCurrency: targetCurrency.code,
        toCurrency: baseCurrency.code,
        amount: this.targetAmount.value
      })
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([resBase, resTarget]) => {
        this.updateExchangeRates(resBase, resTarget);
      });
  }

  updateExchangeRates(resBase: ExchangeRateResponse, resTarget: ExchangeRateResponse): void {
    [this.baseExchangeRate, this.targetExchangeRate] = [resBase, resTarget];
  }

  swapCurrencies(): void {
    if (this.baseCurrency && this.targetCurrency) {
      [this.baseCurrency, this.targetCurrency] = [this.targetCurrency, this.baseCurrency];
      [this.baseExchangeRate, this.targetExchangeRate] = [this.targetExchangeRate, this.baseExchangeRate];
      [this.baseAmount, this.targetAmount] = [this.targetAmount, this.baseAmount];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
