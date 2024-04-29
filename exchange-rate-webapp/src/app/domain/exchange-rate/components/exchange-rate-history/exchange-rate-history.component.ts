import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from "@ibk/core/services";
import { DecimalPipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'ibk-exchange-rate-history',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './exchange-rate-history.component.html',
  styles: ``
})
export class ExchangeRateHistoryComponent implements OnInit {

  constructor(public exchangeRateService: ExchangeRateService) {
  }

  ngOnInit(): void {
    this.exchangeRateService.getAllHistory().subscribe()
  }

}
