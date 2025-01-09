import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/ResponseApi_post';
import { PostService } from '../../services/post.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-view-posts',
  imports: [NavbarComponent, CommonModule, HttpClientModule ],
  providers : [PostService],
  templateUrl: './view-posts.component.html',
  styleUrl: './view-posts.component.css'
})
export class ViewPostsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postServices: PostService = inject(PostService);
  private tokenCheckInterval: any; // Intervalo para verificar el token

  constructor() {
    this.handleTokenValidation();
    this.getAllPosts();
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

  async getAllPosts() {
    this.posts = await this.postServices.getAllPosts()
      .catch((error) => {
        console.log(error);
        return [];
      }) || [];
    console.log(this.posts);
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