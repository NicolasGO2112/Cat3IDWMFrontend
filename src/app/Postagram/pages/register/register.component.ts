import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterDto } from '../../interfaces/ResponseApi_auth';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule ],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]]
    });
  }

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/\d/.test(value)) {
      return { passwordInvalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.errorMessage = "";
      const { email, password } = this.registerForm.value;
       const formValue = this.registerForm.value as RegisterDto;
          const registerData: RegisterDto = {
            mail: formValue.mail.trim().toLowerCase(),
            password: formValue.password,
          };
      this.authService.register(registerData).subscribe({
        next: (response) => {
          if (response) {
            if (response.token) {
              setTimeout(() => {
                this.successMessage = `Te has registrado correctamente con el correo: ${response.email}.`;
                this.launchConfetti();
                setTimeout(() => {
                  this.router.navigate(['/loggin']);
                }, 2000); // Redirigir después de 2 segundos
              }, 1000);
            }
          } else {
            console.log('Error on register', response);
            this.errorMessage = "Ha ocurrido un error, el correo ya se encuentra asociado a una cuenta";
            this.registerForm.get('password')?.setValue('');

          }
        },
        error: (error) => {
          let e = this.authService.errors;
          console.log('Error', e);
          this.errorMessage = "Ha ocurrido un error, el correo ya se encuentra asociado a una cuenta";
          this.registerForm.get('password')?.setValue('');

        },
      }); 

    }
 else {
      this.errorMessage = 'Por favor, ingresa un correo y una contraseña válidos.';
    }
  }
  launchConfetti(): void {
      let audio = new Audio(); // Ruta al archivo de sonido
      audio.src = 'Voicy_Confetti_Sound_effect.mp3';
      audio.load;
      audio.play().catch(error => console.error('Error al reproducir el sonido:', error));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
  
      const duration = 2 * 1000; // Duración de 2 segundos
      const end = Date.now() + duration;
  
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
        } else {
          confetti({
            particleCount: 50,
            startVelocity: 30,
            spread: 60,
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2,
            },
          });
        }
      }, 250); // Intervalo entre explosiones
    }
}
