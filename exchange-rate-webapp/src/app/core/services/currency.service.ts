import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Currency } from "@ibk/core/interfaces";
import { environment } from "@ibk/env/environment";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${ environment.urlApi }/currencies`);
  }

  findByCode(code: string): Observable<Currency> {
    return this.http.get<Currency>(`${ environment.urlApi }/currencies/${ code }`);
  }
}
