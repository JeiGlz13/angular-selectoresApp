import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
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
  frontera: any = [];

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
        }),
        switchMap(region => this._paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(pais => {
          this.miFormulario.get('frontera')?.reset('');
        }),
        switchMap(pais => this._paisesService.getPaisPorCodigo(pais?.cca3))
      )
      .subscribe((paises) => {
        this.frontera = paises
      })
  }

  guardar(){
    console.log(this.miFormulario);
  }
}
