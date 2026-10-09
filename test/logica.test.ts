import { describe, expect, it } from "vitest";
import {
  CONFIG,
  avanzarTurno,
  calcularCarga,
  cortar,
  crearEstadoInicial,
  restablecer,
} from "../src/logica";

describe("Reglas de la red eléctrica", () => {
  it("El estado inicial activa todos los sectores y comienza con la carga indicada", () => {
    const estado = crearEstadoInicial();

    expect(estado).toEqual({
      turno: 1,
      accionesRestantes: CONFIG.accionesPorTurno,
      sectoresEncendidos: {
        hospital: true,
        agua: true,
        escuelas: true,
        casas: true,
      },
      turnosConSobrecarga: 0,
      turnosSinLuzEnHospital: 0,
      estadoPartida: "enCurso",
    });
    expect(calcularCarga(estado)).toBe(110);
  });

  it("Cortar apaga un sector y consume una acción cuando es válido", () => {
    const estado = crearEstadoInicial();

    expect(cortar(estado, "casas")).toBe(true);
    expect(estado.sectoresEncendidos.casas).toBe(false);
    expect(estado.accionesRestantes).toBe(CONFIG.accionesPorTurno - 1);
    expect(calcularCarga(estado)).toBe(80);
  });

  it("Cortar devuelve falso si el sector ya está apagado o no quedan acciones", () => {
    const estado = crearEstadoInicial();
    expect(cortar(estado, "casas")).toBe(true);

    expect(cortar(estado, "casas")).toBe(false);
    expect(cortar(estado, "agua")).toBe(true);
    expect(cortar(estado, "escuelas")).toBe(false);
  });

  it("Restablecer enciende un sector y consume una acción cuando es válido", () => {
    const estado = crearEstadoInicial();
    expect(cortar(estado, "casas")).toBe(true);

    expect(restablecer(estado, "casas")).toBe(true);
    expect(estado.sectoresEncendidos.casas).toBe(true);
    expect(estado.accionesRestantes).toBe(0);
    expect(calcularCarga(estado)).toBe(110);
  });

  it("Restablecer devuelve falso si el sector ya está encendido o no quedan acciones", () => {
    const estado = crearEstadoInicial();

    expect(restablecer(estado, "casas")).toBe(false);
    expect(cortar(estado, "casas")).toBe(true);
    expect(cortar(estado, "agua")).toBe(true);
    expect(restablecer(estado, "casas")).toBe(false);
  });

  it("Avanzar turno reinicia las acciones y termina mal tras dos turnos seguidos sobrecargados", () => {
    const estado = crearEstadoInicial();

    expect(avanzarTurno(estado)).toBe(true);
    expect(estado.turno).toBe(2);
    expect(estado.accionesRestantes).toBe(CONFIG.accionesPorTurno);
    expect(estado.estadoPartida).toBe("enCurso");
    expect(avanzarTurno(estado)).toBe(true);
    expect(estado.estadoPartida).toBe("colapsada");
    expect(avanzarTurno(estado)).toBe(false);
  });

  it("Termina mal si el Hospital permanece apagado durante dos turnos", () => {
    const estado = crearEstadoInicial();
    expect(cortar(estado, "hospital")).toBe(true);

    expect(avanzarTurno(estado)).toBe(true);
    expect(estado.estadoPartida).toBe("enCurso");
    expect(avanzarTurno(estado)).toBe(true);
    expect(estado.estadoPartida).toBe("colapsada");
  });

  it("Termina bien al completar el octavo turno con la red estable y el Hospital encendido", () => {
    const estado = crearEstadoInicial();
    expect(cortar(estado, "casas")).toBe(true);

    for (let turno = 1; turno <= CONFIG.turnosParaGanar; turno += 1) {
      expect(avanzarTurno(estado)).toBe(true);
    }

    expect(estado.turno).toBe(CONFIG.turnosParaGanar);
    expect(estado.estadoPartida).toBe("ganada");
    expect(estado.sectoresEncendidos.hospital).toBe(true);
    expect(calcularCarga(estado)).toBe(80);
    expect(avanzarTurno(estado)).toBe(false);
  });
});
