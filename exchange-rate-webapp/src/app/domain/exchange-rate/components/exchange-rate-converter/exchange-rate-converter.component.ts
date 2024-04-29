import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dialog, DialogModule } from "@angular/cdk/dialog";
import { CurrencySelectDlgComponent } from "@ibk/domain/exchange-rate/components";
import { Currency, CurrencySelect, ExchangeRateResponse } from "@ibk/core/interfaces";
import { CurrencyService, ExchangeRateService } from "@ibk/core/services";
import { UpperCasePipe } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, forkJoin, Subject, takeUntil } from "rxjs";
import { OnlyNumberDirective, SelectOnFocusDirective } from "@ibk/core/directives";

@Component({
  selector: 'ibk-exchange-rate-converter',
  standalone: true,
  imports: [DialogModule, UpperCasePipe, ReactiveFormsModule, OnlyNumberDirective, SelectOnFocusDirective],
  templateUrl: './exchange-rate-converter.component.html'
})
export class ExchangeRateConverterComponent implements OnInit, OnDestroy {

  baseCurrency?: Currency;
  targetCurrency?: Currency;
  baseRate: number = 0;
  targetRate: number = 0;
  baseAmount: FormControl = new FormControl(1);
  targetAmount: FormControl = new FormControl(1);
  baseMessage: string = '';
  targetMessage: string = '';
  private lastUpdated: 'base' | 'target' | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public dialog: Dialog,
              private exchangeRateService: ExchangeRateService,
              private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.loadInitialCurrencies(['PEN', 'USD']);
    this.setupFormControls();
  }

  loadInitialCurrencies(codes: string[]): void {
    forkJoin(codes.map(code => this.currencyService.findByCode(code)))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([base, target]) => {
          [this.baseCurrency, this.targetCurrency] = [base, target];
          this.loadConversions();
        },
        error: err => console.error('Failed to load currencies:', err)
      });
  }

  loadConversions(): void {
    if (!this.baseCurrency || !this.targetCurrency) return;

    forkJoin([
      this.exchangeRateService.getConversion({
        fromCurrency: this.baseCurrency.code,
        toCurrency: this.targetCurrency.code,
        amount: this.baseAmount.value
      }),
      this.exchangeRateService.getConversion({
        fromCurrency: this.targetCurrency.code,
        toCurrency: this.baseCurrency.code,
        amount: this.targetAmount.value
      })
    ]).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([resBase, resTarget]) => {
          this.updateRates(resBase, resTarget);
        },
        error: err => console.error('Failed to load conversion rates:', err)
      });
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
        this.updateRates(resBase, resTarget);
      });
  }

  updateRates(resBase: ExchangeRateResponse, resTarget: ExchangeRateResponse): void {
    this.baseRate = resBase.conversionRate;
    this.baseMessage = this.createRateMessage(resBase);
    this.targetRate = resTarget.conversionRate;
    this.targetMessage = this.createRateMessage(resTarget);
  }

  setupFormControls(): void {
    this.baseAmount.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe((value: number) => {
      this.onAmountChange(value, 'base');
    });

    this.targetAmount.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((value: number) => {
      this.onAmountChange(value, 'target');
    });
  }

  onAmountChange(newAmount: number, type: 'base' | 'target'): void {
    if (this.lastUpdated === type) return;

    this.lastUpdated = type;
    const rate: number = (type === 'base' ? this.baseRate : this.targetRate);
    const formControl: FormControl<number> = (type === 'base' ? this.targetAmount : this.baseAmount);
    const convertedAmount: number = newAmount * rate;
    formControl.setValue(parseFloat(convertedAmount.toFixed(3)), { emitEvent: false });

    if (this.baseCurrency && this.targetCurrency) {
      if (type === 'base') {
        this.exchangeRateService.saveRateConversion({
          fromCurrency: this.baseCurrency.code,
          toCurrency: this.targetCurrency.code,
          amount: newAmount
        }).subscribe()
      } else {
        this.exchangeRateService.saveRateConversion({
          fromCurrency: this.targetCurrency.code,
          toCurrency: this.baseCurrency.code,
          amount: newAmount
        }).subscribe()
      }
    }

    this.lastUpdated = null;
  }

  selectCurrency(type: 'base' | 'target', currentCurrency: Currency, excludeCurrency: Currency): void {
    const currencySelect: CurrencySelect = { type, currentCurrency, excludeCurrency }
    const dialogRef = this.dialog.open<Currency>(CurrencySelectDlgComponent, {
      data: currencySelect
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        if (type === 'base') {
          this.baseCurrency = res;
          this.setConversionRate(this.baseCurrency, excludeCurrency);
        } else {
          this.targetCurrency = res;
          this.setConversionRate(excludeCurrency, this.targetCurrency);
        }
      }
    });
  }

  swapCurrencies(): void {
    if (this.baseCurrency && this.targetCurrency) {
      [this.baseCurrency, this.targetCurrency, this.baseRate, this.targetRate, this.baseMessage, this.targetMessage, this.baseAmount, this.targetAmount] = [this.targetCurrency, this.baseCurrency, this.targetRate, this.baseRate, this.targetMessage, this.baseMessage, this.targetAmount, this.baseAmount];
    }
  }

  createRateMessage(resRate: ExchangeRateResponse): string {
    let conversionRate = parseFloat(resRate.conversionRate.toFixed(3))
    return `1 ${ resRate.fromCurrency } = ${ resRate.toCurrency } ${ conversionRate }`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
