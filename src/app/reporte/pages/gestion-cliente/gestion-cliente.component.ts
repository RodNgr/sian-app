import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

import { ClienteActualiza, ClienteRegistro } from './entity/cliente';
import { ClienteUnicoService } from './services/cliente-unico.service';

interface ICombo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-gestion-cliente',
  templateUrl: './gestion-cliente.component.html',
  styleUrls: ['./gestion-cliente.component.css']
})
export class GestionClienteComponent implements OnInit {

  public title: string = 'Pagina sin nombre - Gestion Cliente';

  tipoDocumentosList = [
    { id: 1, nombre: 'DNI' }
  ];

  marcasList = [
    { id: 2, nombre: 'Bembos' },
    { id: 3, nombre: 'Don Belisario' },
    { id: 4, nombre: 'Popeyes' },
    { id: 5, nombre: 'Chinawok' },
    { id: 7, nombre: 'Papa Johns' },
    { id: 8, nombre: 'Dunkin Donuts' },
  ];

  canalesList = [
    { id: 0, nombre: 'Salón' },
    { id: 1, nombre: 'Call center' },
    { id: 2, nombre: 'Web' },
    { id: 4, nombre: 'App' },
    { id: 2, nombre: 'Bot' },
  ];

  documentoSeleccionado: ICombo;
  nroDocumento: string;
  marcaSeleccionada: ICombo;
  
  actualizaTratamiento: Partial<ClienteActualiza>;
  registraCliente: ClienteRegistro;

  token: string;

  constructor(
    private spinner: NgxSpinnerService,
    private readonly clienteUnicoService: ClienteUnicoService,
  ) {
    this.actualizaTratamiento = new ClienteActualiza();
    this.registraCliente = new ClienteRegistro();
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.clienteUnicoService.getToken().subscribe((res) => {
      // console.log('res', res);
    });
  }

  actualizarTratamiento() {
    this.spinner.show();
    this.clienteUnicoService.actualizaTratamiento(this.actualizaTratamiento, this.token).subscribe(
      (data) => {
        swal.fire('Actualizar', `Usuario ${this.actualizaTratamiento.documento} actualizado`, 'info');
        this.spinner.hide();
      },
      (err) => {
        swal.fire('Error', 'Error al actualizar cliente', 'error');
        this.spinner.hide();
      }
    );
  }

  registraClienteUnico() {
    console.log('this.registraCliente', this.registraCliente);
    this.spinner.show();
    this.clienteUnicoService.registraCliente(this.registraCliente, this.token).subscribe(
      (data) => {
        swal.fire('Registro', `Usuario ${this.registraCliente.nombre} creado`, 'info');
        this.spinner.hide();
      },
      (err) => {
        swal.fire('Error', 'Error al actualizar cliente', 'error');
        this.spinner.hide();
      }
    );
  }

  buscar() {
    this.spinner.show();
    this.clienteUnicoService.consultaDocumento(
      { documento: this.actualizaTratamiento.documento, tipoDoc: this.actualizaTratamiento.tipoDoc }, 
      this.token
    ).subscribe((data) => {
      this.actualizaTratamiento = { tipoDoc: data.cliente.tipoDoc, documento: data.cliente.documento };
      this.spinner.hide();
    });
  }
}
