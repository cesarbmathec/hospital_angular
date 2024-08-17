import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
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
  // Entrada de una propiedad (props)
  @Input() formGroup!: FormGroup;
  // Inyectamos el servicio
  constructor(private recaptchaService: ReCaptchaV3Service) {}

  public executeRecaptcha(): void {
    this.recaptchaService.execute('').subscribe((token: any) => {
      //this.formControl.setValue({ recaptchaReactive: token });
      console.log(token);
    });
  }

  public executeRecaptchaVisible(token: any) {
    console.log(token);
    /*
    this.formGroup?.setValue({
      recaptchaReactive: token,
      username: this.formGroup.get('username')?.value,
      password: this.formGroup.get('password')?.value,
    });
    */
    this.formGroup?.patchValue({ recaptchaReactive: token });
  }

  errored(_event: any) {
    console.warn(` Error reCAPTCHA encontrado`);
  }
}
