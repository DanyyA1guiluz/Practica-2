export type Sector = "hospital" | "agua" | "escuelas" | "casas";

export type EstadoPartida = "enCurso" | "ganada" | "colapsada";

export interface EstadoJuego {
  turno: number;
  accionesRestantes: number;
  sectoresEncendidos: Record<Sector, boolean>;
  turnosConSobrecarga: number;
  turnosSinLuzEnHospital: number;
  estadoPartida: EstadoPartida;
}

export const CONFIG = {
  turnoInicial: 1, // turno
  turnosParaGanar: 8, // turnos
  accionesPorTurno: 2, // acciones
  accionesMinimasParaAccion: 0, // acciones
  contadorInicial: 0, // turnos consecutivos
  incrementoContador: 1, // turno
  cargaInicial: 0, // porcentaje de carga
  cargaHospital: 40, // porcentaje de carga
  cargaAgua: 25, // porcentaje de carga
  cargaEscuelas: 15, // porcentaje de carga
  cargaCasas: 30, // porcentaje de carga
  cargaMaximaEstable: 100, // porcentaje de carga
  turnosToleradosFueraDeLimite: 1, // turnos consecutivos
} as const;

export function crearEstadoInicial(): EstadoJuego {
  return {
    turno: CONFIG.turnoInicial,
    accionesRestantes: CONFIG.accionesPorTurno,
    sectoresEncendidos: {
      hospital: true,
      agua: true,
      escuelas: true,
      casas: true,
    },
    turnosConSobrecarga: CONFIG.contadorInicial,
    turnosSinLuzEnHospital: CONFIG.contadorInicial,
    estadoPartida: "enCurso",
  };
}

export function calcularCarga(estado: EstadoJuego): number {
  let carga = CONFIG.cargaInicial;

  if (estado.sectoresEncendidos.hospital) carga += CONFIG.cargaHospital;
  if (estado.sectoresEncendidos.agua) carga += CONFIG.cargaAgua;
  if (estado.sectoresEncendidos.escuelas) carga += CONFIG.cargaEscuelas;
  if (estado.sectoresEncendidos.casas) carga += CONFIG.cargaCasas;

  return carga;
}

export function cortar(estado: EstadoJuego, sector: Sector): boolean {
  if (
    estado.estadoPartida !== "enCurso" ||
    estado.accionesRestantes <= CONFIG.accionesMinimasParaAccion ||
    !estado.sectoresEncendidos[sector]
  ) {
    return false;
  }

  estado.sectoresEncendidos[sector] = false;
  estado.accionesRestantes -= CONFIG.incrementoContador;
  return true;
}

export function restablecer(estado: EstadoJuego, sector: Sector): boolean {
  if (
    estado.estadoPartida !== "enCurso" ||
    estado.accionesRestantes <= CONFIG.accionesMinimasParaAccion ||
    estado.sectoresEncendidos[sector]
  ) {
    return false;
  }

  estado.sectoresEncendidos[sector] = true;
  estado.accionesRestantes -= CONFIG.incrementoContador;
  return true;
}

export function avanzarTurno(estado: EstadoJuego): boolean {
  if (estado.estadoPartida !== "enCurso") {
    return false;
  }

  estado.turnosConSobrecarga =
    calcularCarga(estado) > CONFIG.cargaMaximaEstable
      ? estado.turnosConSobrecarga + CONFIG.incrementoContador
      : CONFIG.contadorInicial;
  estado.turnosSinLuzEnHospital = estado.sectoresEncendidos.hospital
    ? CONFIG.contadorInicial
    : estado.turnosSinLuzEnHospital + CONFIG.incrementoContador;

  if (
    estado.turnosConSobrecarga > CONFIG.turnosToleradosFueraDeLimite ||
    estado.turnosSinLuzEnHospital > CONFIG.turnosToleradosFueraDeLimite
  ) {
    estado.estadoPartida = "colapsada";
    return true;
  }

  if (estado.turno >= CONFIG.turnosParaGanar) {
    estado.estadoPartida = "ganada";
    return true;
  }

  estado.turno += CONFIG.incrementoContador;
  estado.accionesRestantes = CONFIG.accionesPorTurno;
  return true;
}
