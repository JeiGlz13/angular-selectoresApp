import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, switchMap, tap } from 'rxjs';
import { Pais } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this._formBuilder.group({
    region: [
      '',
      [Validators.required],
    ],
    pais: [
      '',
      [Validators.required],
    ],
    frontera: [
      '',
      [Validators.required],
    ]
  });

  // Llenar Selectores
  regiones: string[] = [];
  paises: Pais[] = [];
  frontera: any[] = [];

  //UI
  cargando: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _paisesService: PaisesService,
  ) { }

  ngOnInit(): void {
    this.regiones = this._paisesService.regiones;

    // Al cambiar la region

    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe((region) => {
    //       this._paisesService.getPaisesPorRegion(region)
    //           .subscribe((paises) => {
    //             this.paises = paises;
    //           })

    //     });

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(region => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this._paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this._paisesService.getPaisPorCodigo(codigo)),
        switchMap((pais) => this._paisesService.getPaisesPorCodigos(pais?.[0]?.borders)
      ))
      .subscribe((paises) => {
        if (paises) {
          const newPaises: any[] = [];
          paises.forEach((paisArray: any) => {
            const [pais] = paisArray;
            newPaises.push(pais);
          });

          this.frontera = newPaises;
          //this.frontera = paises[0]?.borders || [];
        }
        this.cargando = false;
      })
  }

  guardar(){
    console.log(this.miFormulario);
    console.log(this.frontera);
  }
}
