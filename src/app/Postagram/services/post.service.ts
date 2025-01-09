import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CreatedPost, CreatePosResponse, GetAllPost, Post } from '../interfaces/ResponseApi_post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl: string = "http://localhost:5022/api/Post";

  private http = inject(HttpClient);

  public errors: string[] = []; 

  async getAllPosts(): Promise<Post[]> {
    try{
        const authString = localStorage.getItem('auth');

        if (authString == null) {
            return Promise.reject("No hay token");
        }
        // Convertir el string JSON a un objeto
        const auth = JSON.parse(authString);

        // Obtener el token
        const token = auth.token;
        console.log("token: ",token);
        const response = await firstValueFrom(this.http.get<GetAllPost>(`${this.baseUrl}/GetAll`,{
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            },}));
        return Promise.resolve(response.post);
    }catch(error){
        console.log("Error en getProductsUsers",error)
        let e = error as HttpErrorResponse;
        this.errors.push(e.message);
        return Promise.reject(error);
    }
  }

  async createPost(post: FormData): Promise<string> {
    try {
      const authString = localStorage.getItem('auth');
  
      if (authString == null) {
        return Promise.reject("No hay token");
      }
  
      // Convertir el string JSON a un objeto
      const auth = JSON.parse(authString);
  
      // Obtener el token
      const token = auth.token;
      console.log("token: ", token);
      post.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

      const response = await firstValueFrom(this.http.post<CreatePosResponse>(`${this.baseUrl}/NewPost`, post, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          // Nota: No es necesario establecer el Content-Type, ya que FormData se encarga de esto automáticamente
        },
      }));
  
      return Promise.resolve(response.message);
  
    } catch (error) {
      console.log("Error en createPost", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
  



}
