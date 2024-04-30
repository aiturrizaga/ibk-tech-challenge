import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from "@ibk/core/services";
import { DecimalPipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'ibk-exchange-rate-history-page',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './exchange-rate-history.page.html',
  styles: ``
})
export class ExchangeRateHistoryPage implements OnInit {

  constructor(public exchangeRateService: ExchangeRateService) {
  }

  ngOnInit(): void {
    this.exchangeRateService.getAllHistory().subscribe()
  }

}
