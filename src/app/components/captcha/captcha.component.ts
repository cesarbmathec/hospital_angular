import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [MatButtonModule, RecaptchaModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.css',
})
export class CaptchaComponent {
  // Inyectamos el servicio
  constructor(private recaptchaService: ReCaptchaV3Service) {}

  public executeRecaptcha(): void {
    this.recaptchaService.execute('').subscribe((token: any) => {
      console.log(token);
    });
  }

  public executeRecaptchaVisible(token: any) {
    console.log(token);
  }
}
