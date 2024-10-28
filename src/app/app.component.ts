import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todolistapp';
  actividad: string = '';
  prioridad: string = 'Importante'; 
  actividades: any[] = []; 
  editIndex: number | null = null; 

  constructor(private localStorageService: LocalStorageService) {
    this.cargarActividades(); 
  }

  registrarActividad() {
    const actividadInput = (document.getElementById('inputText') as HTMLInputElement).value;
    const prioridadInput = (document.querySelector('.form-select') as HTMLSelectElement).value;
    this.prioridad = prioridadInput || 'Importante';

    if (actividadInput) {
      const actividadData = {
        actividad: actividadInput,
        prioridad: this.prioridad,
        estado: 'pendiente'
      };

      
      if (this.editIndex !== null) {
        this.actividades[this.editIndex] = actividadData;
        this.localStorageService.setItem('actividades', JSON.stringify(this.actividades));
        this.editIndex = null; 
      } else {
        
        const actividades = JSON.parse(this.localStorageService.getItem('actividades') || '[]');
        actividades.push(actividadData);
        this.localStorageService.setItem('actividades', JSON.stringify(actividades));
      }

      this.cargarActividades(); 
      this.ordenarActividadesPorPrioridad();
      this.limpiarFormulario();
    } else {
      alert('Ingrese una actividad.');
    }
  }

  ordenarActividadesPorPrioridad() {
    const prioridades = { 'Muy importante': 1, 'Importante': 2, 'Poco importante': 3 };
    
    this.actividades.sort((a, b) => {
      return prioridades[a.prioridad as keyof typeof prioridades] - prioridades[b.prioridad as keyof typeof prioridades];
    });
  
    this.localStorageService.setItem('actividades', JSON.stringify(this.actividades));
  }

  cargarActividades() {
    const actividadesGuardadas = JSON.parse(this.localStorageService.getItem('actividades') || '[]');
    this.actividades = actividadesGuardadas.filter((actividad: { estado: string; }) => actividad.estado === 'pendiente');
  }

  limpiarFormulario() {
    (document.getElementById('inputText') as HTMLInputElement).value = '';
    (document.querySelector('.form-select') as HTMLSelectElement).selectedIndex = 0;
    this.editIndex = null; 
  }

  eliminarActividad(index: number) {
    this.actividades.splice(index, 1);
    this.localStorageService.setItem('actividades', JSON.stringify(this.actividades));
  }

  marcarComoHecho(index: number) {
    const actividadRealizada = this.actividades[index];
    actividadRealizada.estado = 'realizado';

    const actividadesRealizadas = JSON.parse(this.localStorageService.getItem('actividadesRealizadas') || '[]');
    actividadesRealizadas.push(actividadRealizada);
    this.localStorageService.setItem('actividadesRealizadas', JSON.stringify(actividadesRealizadas));

    this.actividades.splice(index, 1);
    this.localStorageService.setItem('actividades', JSON.stringify(this.actividades));
  }

  getActividadesRealizadas() {
    return JSON.parse(this.localStorageService.getItem('actividadesRealizadas') || '[]');
  }

  vaciarActividadesRealizadas() {
    this.localStorageService.setItem('actividadesRealizadas', JSON.stringify([]));
  }

  vaciarPendientes() {
    this.localStorageService.setItem('actividades', JSON.stringify([]));
    this.cargarActividades()
  }

  vaciarTodo() {
    this.localStorageService.setItem('actividadesRealizadas', JSON.stringify([]));
    this.localStorageService.setItem('actividades', JSON.stringify([]));
    this.cargarActividades()
  }

  editarActividad(index: number) {
    const actividad = this.actividades[index];
    (document.getElementById('inputText') as HTMLInputElement).value = actividad.actividad;
    (document.querySelector('.form-select') as HTMLSelectElement).value = actividad.prioridad;
    this.editIndex = index; 
  }
}