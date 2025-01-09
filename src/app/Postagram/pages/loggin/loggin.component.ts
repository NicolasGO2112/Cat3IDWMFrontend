import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { containsNumberValidator } from '../../validators/containsNumberValidator';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { LogginDto } from '../../interfaces/ResponseApi_auth';

@Component({
  selector: 'app-loggin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule ],
  providers: [AuthService],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css'
})
export class LogginComponent {
  loginForm: FormGroup;
  private readonly authService = inject(AuthService);
  successMessage: string = '';
  errorMessage: string = '';


  constructor(private fb: FormBuilder , private router: Router) {
    this.loginForm = this.fb.group(
      {
        mail: ['', [Validators.required, Validators.email]],
        password: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(6),
              containsNumberValidator(),
            ],
            updateOn: 'blur', // Valida al desenfocar el campo
          },
        ],
      },
      { updateOn: 'change' } // Valida automáticamente cuando cambian ambos campos
    );
  }

  onSubmit() {
    this.errorMessage = "";

    if (this.loginForm.valid) {
      console.log('Formulario enviado:', this.loginForm.value);
    }
    const formValue = this.loginForm.value as LogginDto;
    const loginData: LogginDto = {
      mail: formValue.mail.trim().toLowerCase(),
      password: formValue.password,
    };

    
    this.authService.loggin(loginData).subscribe({
      next: (response) => {
        if (response) {
          if (response.token) {
            localStorage.setItem("auth", JSON.stringify(response));
            this.successMessage = 'Inicio exitoso, cargando posts...';
            setTimeout(() => {
              this.router.navigate(['/viewPosts']);
            }, 3000);

        
            
          }
        } else {
          console.log('Error on login', response);
          this.loginForm.get('password')?.setValue('');
          this.errorMessage = "Credenciales invalidas";



        }
      },
      error: (error) => {
        let e = this.authService.errors;
        console.log('Error', e);
        this.loginForm.get('password')?.setValue('');
        this.errorMessage = "Credenciales invalidas";


      },
    });
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}

