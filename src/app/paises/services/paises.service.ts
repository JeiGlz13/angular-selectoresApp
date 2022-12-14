import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _regiones : string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseUrl: string = 'https://restcountries.com/v3.1';

  get regiones() {
    return [
      ...this._regiones,
    ]
  }

  constructor(
    private _httpService: HttpClient,
  ) { }

  getPaisesPorRegion(region: string): Observable<Pais[]>{
    const url = `${this._baseUrl}/region/${region}?fields=name,cca3`

    return this._httpService.get<Pais[]>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<any>{
    if (!codigo) {
      return of(null);
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this._httpService.get(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<any>{

    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this._httpService.get(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<any>{
    console.log(borders)
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<Pais[]>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
