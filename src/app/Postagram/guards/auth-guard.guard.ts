import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // Necesitas instalar jwt-decode: npm install jwt-decode

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Usamos `inject` para acceder al router en el guard
  const authString = localStorage.getItem('auth'); // Obtener el JWT del localStorage

  if (authString) {
    // Si hay un token, decodificarlo
    const decodedToken: any = jwtDecode(authString);
    const expirationTime = decodedToken.exp * 1000; // El tiempo de expiración está en segundos, convertir a milisegundos
    const currentTime = Date.now(); // Obtener el tiempo actual

    // Si el token ha expirado
    if (expirationTime < currentTime) {
      localStorage.removeItem('auth'); // Limpiar el localStorage si el token ha expirado
      router.navigate(['/login']); // Redirigir al login
      alert('Sesión expirada'); // Mostrar mensaje de sesión expirada
      return false;
    }

    // Si el token es válido, permitir el acceso a la ruta
    return true;
  }

  // Si no hay un token, redirigir al login y mostrar mensaje
  router.navigate(['/login']); // Redirigir al login
  alert('Debe iniciar sesión'); // Mostrar mensaje de "Debe iniciar sesión"
  return false;
};
