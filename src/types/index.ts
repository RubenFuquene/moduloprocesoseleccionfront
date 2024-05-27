export interface CargoType {
  idTipoCargo: string;
  descTipoCargo: string;
}

export interface Empleado {
  condEmpleado: string;
  nomEmpleado: string;
  apelEmpleado: string;
  correo: string;
  fechaNac: string; // Assuming the format is 'YYYY-MM-DD'
  fechaIngre: string; // Assuming the format is 'YYYY-MM-DD'
  tiposCargos?: CargoType[];
}

export interface Cargo {
  conseCargo: number;
  empleado?: Empleado;
  tipoCargo: CargoType;
  fechaInicioCargo: string; // Assuming the format is 'YYYY-MM-DD'
  fechaFinCargo?: string; // Optional, assuming the format is 'YYYY-MM-DD'
  descCargo: string;
}

export interface Requerimiento {
  consecrequerimiento: number;
  empleado: Empleado;
  empleadoSeleccionado?: Empleado | null;
  fechaRequerimiento: Date;
  salarioMax: number;
  salarioMin?: number;
  desFuncion: string;
  descCarreras: string;
  nVacantes: number;
  procesos: ProcesoRequerimiento[];
}

export interface Perfil {
  idPerfil: string;
  idDisciplina?: string;
  descPerfil: string;
}

export interface Disciplina {
  idDisciplina: string;
  descDisciplina: string;
  perfiles: Perfil[];
}

export interface Fase {
  idFase: string,
  desFase: string
}

export interface ProcesoRequerimientoId {
  consecRequerimiento: number;
  idPerfil: string;
  idFase: string;
  consProceso: number;
}

export interface ProcesoRequerimiento {
  id?: ProcesoRequerimientoId;
  consecRequerimiento: number;
  perfil: Perfil;
  fase: Fase;
  consProceso: number;
  condEmpleado: string;
  fechaInicio?: Date;
  fechaFin: Date | null;
  convocatoria: string;
  invitacion: string;
}
