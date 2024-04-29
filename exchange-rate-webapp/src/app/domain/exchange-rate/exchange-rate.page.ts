import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { User } from "@ibk/core/interfaces";
import { AuthService, ExchangeRateService } from "@ibk/core/services";

@Component({
  selector: 'ibk-exchange-rate-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './exchange-rate.page.html',
  styles: ``
})
export class ExchangeRatePage implements OnInit {

  user?: User;

  constructor(private authService: AuthService,
              private exchangeRateService: ExchangeRateService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  get fullname(): string {
    return this.user ? `${this.user.name} ${this.user.lastname}` : '';
  }

  logout(): void {
    this.exchangeRateService.conversions = [];
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

}
