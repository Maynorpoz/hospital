import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080';

  pestanaActiva: string = 'pacientes';

  // Listas de datos existentes
  pacientes: any[] = [];
  medicos: any[] = [];
  citas: any[] = [];
  expedientes: any[] = [];
  medicamentos: any[] = [];
  recetas: any[] = [];
  resultadosLab: any[] = [];
  facturas: any[] = [];

  // Nuevas Listas de datos (Nuevos Módulos)
  jornadas: any[] = [];
  imagenesMedicas: any[] = [];
  bitacora: any[] = [];
  kpis: any = {
    ingresos_totales: 0,
    total_citas: 0,
    recetas_vigentes: 0,
    examenes_criticos: 0
  };

  // Modal de Confirmación de Borrado
  modalBorradoAbierto: boolean = false;
  tipoEliminacion: string | null = null;
  idAEliminar: number | null = null;
  nombreAEliminar: string = '';

  // Modal de Notificación con Botón OK
  mensajeNotificacion: string = '';
  tituloNotificacion: string = '';
  mostrarNotif: boolean = false;

  // Modelos Existentes
  nuevoPaciente = { nombre_completo: '', dpi_documento: '', fecha_nacimiento: '', telefono: '', correo: '', id_responsable: null };
  nuevoMedico = { nombre_completo: '', colegiado_numero: '', especialidad: '', firma_digital_hash: 'HASH_MEDICO_SECURE' };
  nuevaCita = { fecha_hora: '', id_paciente: null, id_medico: null, estado: 'Programada' };
  nuevoExpediente = { id_paciente: null, id_medico: null };
  nuevoMedicamento = { nombre_comercial: '', stock_disponible: 0, precio_unitario: 0.0 };
  nuevaReceta = { id_expediente: null, id_medico: null, fecha_vencimiento: '', estado: 'Vigente', id_medicamento: null };
  nuevoResultadoLab = { id_expediente: null, id_laboratorio: 1, tipo_examen: '', pdf_url: 'http://localhost:8080/reporte.pdf', es_critico: 0 };
  nuevaFactura = { id_paciente: null, monto_total: 0.0, estado: 'Pendiente' };

  // Nuevos Modelos (Nuevos Módulos)
  nuevaJornada = { id_medico: null, dia_semana: 'LUNES', hora_inicio: '08:00', hora_fin: '16:00' };
  nuevaImagenMedica = { id_expediente: null, modalidad: 'RX', dicom_url: 'http://localhost:8080/estudio.dcm', observaciones: '' };

  ngOnInit() {
    this.cargarTodo();
  }

  // Muestra el mensaje y NO se cierra hasta dar clic en Aceptar
  mostrarNotificacion(titulo: string, texto: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = texto;
    this.mostrarNotif = true;
  }

  cerrarNotificacion() {
    this.mostrarNotif = false;
  }

  cargarTodo() {
    this.cargarPacientes();
    this.cargarMedicos();
    this.cargarCitas();
    this.cargarExpedientes();
    this.cargarMedicamentos();
    this.cargarRecetas();
    this.cargarResultadosLab();
    this.cargarFacturas();
    // Carga de nuevos módulos
    this.cargarJornadas();
    this.cargarImagenesMedicas();
    this.cargarKPIs();
    this.cargarBitacora();
  }

  // GETS Existentes
  cargarPacientes() { this.http.get<any[]>(`${this.api}/pacientes`).subscribe(res => this.pacientes = res); }
  cargarMedicos() { this.http.get<any[]>(`${this.api}/medicos`).subscribe(res => this.medicos = res); }
  cargarCitas() { this.http.get<any[]>(`${this.api}/citas`).subscribe(res => this.citas = res); }
  cargarExpedientes() { this.http.get<any[]>(`${this.api}/expedientes`).subscribe(res => this.expedientes = res); }
  cargarMedicamentos() { this.http.get<any[]>(`${this.api}/medicamentos`).subscribe(res => this.medicamentos = res); }
  cargarRecetas() { this.http.get<any[]>(`${this.api}/recetas`).subscribe(res => this.recetas = res); }
  cargarResultadosLab() { this.http.get<any[]>(`${this.api}/resultados-laboratorio`).subscribe(res => this.resultadosLab = res); }
  cargarFacturas() { this.http.get<any[]>(`${this.api}/facturas`).subscribe(res => this.facturas = res); }

  // NUEVOS GETS
  cargarJornadas() { this.http.get<any[]>(`${this.api}/jornadas-medicas`).subscribe(res => this.jornadas = res); }
  cargarImagenesMedicas() { this.http.get<any[]>(`${this.api}/imagenes-medicas`).subscribe(res => this.imagenesMedicas = res); }
  cargarKPIs() { this.http.get<any>(`${this.api}/reportes/kpis`).subscribe(res => this.kpis = res); }
  cargarBitacora() { this.http.get<any[]>(`${this.api}/bitacora`).subscribe(res => this.bitacora = res); }

  // POSTS Existentes
  guardarPaciente() {
    this.http.post(`${this.api}/pacientes`, this.nuevoPaciente).subscribe({
      next: () => {
        this.cargarPacientes();
        this.mostrarNotificacion('¡Éxito!', 'El paciente ha sido registrado correctamente.');
        this.nuevoPaciente = { nombre_completo: '', dpi_documento: '', fecha_nacimiento: '', telefono: '', correo: '', id_responsable: null };
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo registrar el paciente.')
    });
  }

  guardarMedico() {
    this.http.post(`${this.api}/medicos`, this.nuevoMedico).subscribe({
      next: () => {
        this.cargarMedicos();
        this.mostrarNotificacion('¡Éxito!', 'El médico ha sido registrado correctamente.');
        this.nuevoMedico = { nombre_completo: '', colegiado_numero: '', especialidad: '', firma_digital_hash: 'HASH_MEDICO_SECURE' };
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo registrar el médico.')
    });
  }

  agendarCita() {
    this.http.post(`${this.api}/citas`, this.nuevaCita).subscribe({
      next: () => {
        this.cargarCitas();
        this.cargarKPIs();
        this.mostrarNotificacion('¡Éxito!', 'La cita médica ha sido agendada correctamente.');
      },
      error: (err) => this.mostrarNotificacion('Aviso', err.error?.detail || 'No se pudo agendar la cita.')
    });
  }

  crearExpediente() {
    this.http.post(`${this.api}/expedientes`, this.nuevoExpediente).subscribe({
      next: () => {
        this.cargarExpedientes();
        this.mostrarNotificacion('¡Éxito!', 'El expediente clínico fue aperturado con éxito.');
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo crear el expediente.')
    });
  }

  guardarMedicamento() {
    this.http.post(`${this.api}/medicamentos`, this.nuevoMedicamento).subscribe({
      next: () => {
        this.cargarMedicamentos();
        this.mostrarNotificacion('¡Éxito!', 'Medicamento agregado al inventario.');
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo ingresar el medicamento.')
    });
  }

  emitirReceta() {
    this.http.post(`${this.api}/recetas`, this.nuevaReceta).subscribe({
      next: () => {
        this.cargarRecetas();
        this.cargarMedicamentos(); // Actualiza inventario descontado
        this.cargarKPIs();
        this.mostrarNotificacion('¡Éxito!', 'La receta médica ha sido emitida.');
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo emitir la receta.')
    });
  }

  guardarResultadoLab() {
    this.http.post(`${this.api}/resultados-laboratorio`, this.nuevoResultadoLab).subscribe({
      next: (res: any) => {
        this.cargarResultadosLab();
        this.cargarKPIs();
        this.mostrarNotificacion('¡Éxito!', res.mensaje || 'Resultado de laboratorio registrado.');
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo guardar el resultado.')
    });
  }

  generarFactura() {
    this.http.post(`${this.api}/facturas`, this.nuevaFactura).subscribe({
      next: () => {
        this.cargarFacturas();
        this.cargarKPIs();
        this.mostrarNotificacion('¡Éxito!', 'La factura ha sido emitida con éxito.');
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo generar la factura.')
    });
  }

  // NUEVOS POSTS
  asignarJornada() {
    this.http.post(`${this.api}/jornadas-medicas`, this.nuevaJornada).subscribe({
      next: () => {
        this.cargarJornadas();
        this.mostrarNotificacion('¡Éxito!', 'La jornada médica fue configurada correctamente.');
        this.nuevaJornada = { id_medico: null, dia_semana: 'LUNES', hora_inicio: '08:00', hora_fin: '16:00' };
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo asignar la jornada médica.')
    });
  }

  guardarImagenMedica() {
    this.http.post(`${this.api}/imagenes-medicas`, this.nuevaImagenMedica).subscribe({
      next: () => {
        this.cargarImagenesMedicas();
        this.mostrarNotificacion('¡Éxito!', 'El estudio de radiología/DICOM se adjuntó al expediente.');
        this.nuevaImagenMedica = { id_expediente: null, modalidad: 'RX', dicom_url: 'http://localhost:8080/estudio.dcm', observaciones: '' };
      },
      error: () => this.mostrarNotificacion('Error', 'No se pudo adjuntar el estudio radiológico.')
    });
  }

  // ELIMINACIÓN
  abrirModalBorrado(tipo: string, id: number, nombre: string) {
    this.tipoEliminacion = tipo;
    this.idAEliminar = id;
    this.nombreAEliminar = nombre;
    this.modalBorradoAbierto = true;
  }

  cerrarModalBorrado() {
    this.modalBorradoAbierto = false;
    this.tipoEliminacion = null;
    this.idAEliminar = null;
    this.nombreAEliminar = '';
  }

  confirmarEliminacion() {
    if (!this.idAEliminar || !this.tipoEliminacion) return;

    let endpoint = '';
    let recargarFn = () => { };

    switch (this.tipoEliminacion) {
      case 'medico': endpoint = `/medicos/${this.idAEliminar}`; recargarFn = () => this.cargarMedicos(); break;
      case 'paciente': endpoint = `/pacientes/${this.idAEliminar}`; recargarFn = () => this.cargarPacientes(); break;
      case 'cita': endpoint = `/citas/${this.idAEliminar}`; recargarFn = () => this.cargarCitas(); break;
      case 'expediente': endpoint = `/expedientes/${this.idAEliminar}`; recargarFn = () => this.cargarExpedientes(); break;
      case 'medicamento': endpoint = `/medicamentos/${this.idAEliminar}`; recargarFn = () => this.cargarMedicamentos(); break;
      case 'laboratorio': endpoint = `/resultados-laboratorio/${this.idAEliminar}`; recargarFn = () => this.cargarResultadosLab(); break;
      case 'factura': endpoint = `/facturas/${this.idAEliminar}`; recargarFn = () => this.cargarFacturas(); break;
    }

    this.http.delete(`${this.api}${endpoint}`).subscribe({
      next: () => {
        recargarFn();
        this.cargarKPIs();
        this.cerrarModalBorrado();
        this.mostrarNotificacion('Eliminado', 'El registro ha sido eliminado correctamente.');
      },
      error: (err) => {
        this.cerrarModalBorrado();
        this.mostrarNotificacion('No se pudo eliminar', err.error?.detail || 'El registro no se pudo eliminar.');
      }
    });
  }
}