import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { CurrencyService } from "@ibk/core/services";
import { Currency, CurrencySelect } from "@ibk/core/interfaces";
import { StringHelper } from "@ibk/core/helpers";
import { NgClass } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { filter, map, of, Subject, switchMap, takeUntil } from "rxjs";

@Component({
  selector: 'ibk-currency-select-dlg',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './currency-select-dlg.component.html',
  styles: ``
})
export class CurrencySelectDlgComponent implements OnInit, OnDestroy {

  currencies: Currency[] = [];
  filteredCurrencies: Currency[] = [];
  searchTerm: FormControl = new FormControl<string>('');
  private destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(DIALOG_DATA) public data: CurrencySelect,
              private dialogRef: DialogRef<Currency>,
              private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.getCurrencies();
    this.searchCurrencies();
  }

  getCurrencies(): void {
    this.currencyService.findAll()
      .pipe(
        filter(currencies => currencies.length > 0),
        map(currencies => currencies.filter(currency => currency.code !== this.data.excludeCurrency?.code))
      )
      .subscribe(res => {
        this.currencies = res;
        this.filteredCurrencies = [...this.currencies];
      });
  }

  searchCurrencies(): void {
    this.searchTerm.valueChanges
      .pipe(
        switchMap((search: string) => {
          const term = StringHelper.normalizeText(search.toLowerCase().trim());
          if (term === '') {
            return of([...this.currencies]);
          } else {
            return of(this.currencies.filter(currency =>
              currency.code.toLowerCase().includes(term) ||
              StringHelper.normalizeText(currency.name.toLowerCase()).includes(term) ||
              StringHelper.normalizeText(currency.country.toLowerCase()).includes(term)
            ));
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(res => this.filteredCurrencies = res);
  }

  isActiveCurrency(currency: Currency): boolean | undefined {
    return this.data && this.data.currentCurrency && this.data.currentCurrency.code === currency.code;
  }

  selectCurrency(currency: Currency): void {
    this.dialogRef.close(currency);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
