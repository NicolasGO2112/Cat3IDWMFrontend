import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router); // Usamos `inject` para obtener el router
  const auth = localStorage.getItem('auth'); // Obtener el JWT del localStorage
  const authToken = JSON.parse(auth || '{}').token; 
  
  let modifiedRequest = req;
  // Si hay un token, incluirlo en la cabecera de la solicitud
  if (authToken) {
    const modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}` // Incluir el token en las cabeceras
      }
    });

    // Enviar la solicitud clonada con el token incluido
    return next(modifiedRequest).pipe(
      tap((event) => {
        console.log('Event:', event);
  
        if (event instanceof HttpResponse) {
          //Si existe un token, lo guardo en el local storage
          const newToken = event.body.data.token;
          console.log('Nuevo token:', newToken);
          if (newToken) {
            localStorage.setItem('token', newToken);
            if (event.body.data.user) {
              localStorage.setItem('user', JSON.stringify(event.body.data.user));
            }
          }
        }
      })
    );
  }

  // Si no hay token, continuar con la solicitud sin incluir el JWT
  return next(req);
};
