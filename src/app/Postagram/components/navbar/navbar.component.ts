import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear(); // Limpia los datos de localStorage
    sessionStorage.clear(); // Limpia los datos de sessionStorage (opcional)
    alert('Sesión cerrada exitosamente.'); // Opcional
    this.router.navigate(['/loggin']); // Redirige al usuario a la página de login
  }
}
