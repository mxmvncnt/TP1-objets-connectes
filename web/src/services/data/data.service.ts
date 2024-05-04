import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getData(path: String): Observable<any> {
    return this.http.get<any>(this.apiUrl + path);
  }

  postData(path: String, data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + path, data);
  }

  deleteData(path: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + path)
  }
}
