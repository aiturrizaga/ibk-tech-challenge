import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ExchangeRateHistory, ExchangeRateRequest, ExchangeRateResponse } from "@ibk/core/interfaces";
import { Observable, tap } from "rxjs";
import { environment } from "@ibk/env/environment";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  conversions: ExchangeRateHistory[] = [];

  constructor(private http: HttpClient) {
  }

  saveRateConversion(body: ExchangeRateRequest): Observable<ExchangeRateResponse> {
    return this.http.post<ExchangeRateResponse>(`${ environment.urlApi }/rates`, body)
  }

  getConversion(body: ExchangeRateRequest): Observable<ExchangeRateResponse> {
    return this.http.post<ExchangeRateResponse>(`${ environment.urlApi }/rates/conversions`, body)
  }

  getAllHistory(sort: string = 'timestamp,desc'): Observable<ExchangeRateHistory[]> {
    return this.http.get<ExchangeRateHistory[]>(`${ environment.urlApi }/rates/conversions`, { params: { sort } })
      .pipe(
        tap(res => this.conversions = res)
      );
  }

}
