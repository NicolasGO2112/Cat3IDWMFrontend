import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from '../../services/post.service';
import { jwtDecode } from 'jwt-decode';
import { CreatedPost } from '../../interfaces/ResponseApi_post';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-create-post',
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule ],
  providers: [PostService],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit, OnDestroy {
  createPostForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  postImage: File | null = null;
  private postServices: PostService = inject(PostService);
  private tokenCheckInterval: any; // Intervalo para verificar el token

  constructor(private fb: FormBuilder, private router: Router) {
    this.createPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      image: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Inicia la verificación periódica del token
    this.tokenCheckInterval = setInterval(() => this.handleTokenValidation(), 60000); // Cada 5 minutos
  }

  ngOnDestroy(): void {
    // Limpia el intervalo al destruir el componente
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  async onSubmit() {
    this.handleTokenValidation();

    if (this.createPostForm.valid) {
      const authString = localStorage.getItem('auth');
      if (authString) {
        const auth = JSON.parse(authString);
        const decodedToken: any = jwtDecode(auth.token);

        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (expirationTime > currentTime) {
          const formValue = this.createPostForm.value as CreatedPost;

          const formData = new FormData();
          formData.append('Title', formValue.title);
          formData.append('publicationDate', new Date().toISOString());
          if (this.postImage) {
            formData.append('Image', this.postImage);
          }
          formData.append('UserId', auth.id);

          const response = await this.postServices.createPost(formData);

          if (response == 'Post created successfully') {
            this.successMessage = 'Post subido correctamente.';
            
            // Lanza confeti al subir el post exitosamente
            this.launchConfetti();

            setTimeout(() => {
              this.router.navigate(['/viewPosts']);
            }, 2000);
          } else {
            this.errorMessage = 'Error al subir el post.';
          }
        } else {
          console.log('El token ha expirado.');
        }
      } else {
        console.log('No hay token.');
      }
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

  clearImage() {
    this.createPostForm.get('image')?.setValue('');
    this.errorMessage = '';
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = ['jpg', 'png'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        this.clearImage();
        this.createPostForm.get('image')?.setErrors({ invalidImageType: true });
      } else if (file.size > 5 * 1024 * 1024) {
        this.clearImage();
        this.createPostForm.get('image')?.setErrors({ invalidImageSize: true });
      } else {
        this.postImage = file;
        this.createPostForm.patchValue({ comprobante: file });
        this.createPostForm.get('comprobante')?.updateValueAndValidity();
        this.createPostForm.get('image')?.markAsTouched();
      }
    }
  }

  handleTokenValidation(): void {
    const auth = localStorage.getItem('auth'); // O de donde almacenes el token
    const authParse = JSON.parse(auth || '{}');
    const token = authParse.token;
    const overlay = document.createElement('div'); // Para bloquear interacciones
    const messageBox = document.createElement('div'); // Para el mensaje

    // Estilo para el overlay
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    // Estilo para el mensaje
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.padding = '20px';
    messageBox.style.borderRadius = '8px';
    messageBox.style.textAlign = 'center';
    messageBox.style.color = '#333';
    messageBox.style.fontSize = '18px';

    if (token) {
      const decodedToken: any = jwtDecode(token);

      // Comprobar la expiración
      const expirationTime = decodedToken.exp * 1000; // 'exp' está en segundos, lo convertimos a milisegundos
      const currentTime = Date.now(); // Tiempo actual en milisegundos

      if (expirationTime > currentTime) {
        console.log('El token es válido.');
        return; // Si el token es válido, no hacemos nada
      } else {
        console.log('El token ha expirado.');
        messageBox.innerText = 'El token de inicio de sesión ha expirado. Volviendo al inicio de sesión';
      }
    } else {
      console.log('No se ha podido encontrar un Token de inicio de sesión.');
      messageBox.innerText = 'No se ha podido encontrar un Token de inicio de sesión. Volviendo al inicio de sesión';
    }

    // Mostrar el mensaje y desactivar interacciones
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    // Redirigir después de unos segundos
    setTimeout(() => {
      localStorage.removeItem('token'); // Limpia el token si es necesario
      window.location.href = '/loggin'; // Cambia '/login' por la URL de tu página de inicio de sesión
    }, 3000); // Espera 3 segundos antes de redirigir
  }


}
