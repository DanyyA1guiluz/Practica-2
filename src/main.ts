import "./estilos.css";
import {
  CONFIG,
  avanzarTurno,
  calcularCarga,
  cortar,
  crearEstadoInicial,
  restablecer,
  type Sector,
} from "./logica";

const contenedorApp = document.querySelector<HTMLDivElement>("#app");

if (!contenedorApp) {
  throw new Error('No se encontró el contenedor principal "#app".');
}

const app: HTMLDivElement = contenedorApp;
const estado = crearEstadoInicial();
const sectores: { id: Sector; nombre: string; carga: number; numero: string }[] = [
  { id: "hospital", nombre: "Hospital", carga: CONFIG.cargaHospital, numero: "01" },
  { id: "agua", nombre: "Agua", carga: CONFIG.cargaAgua, numero: "02" },
  { id: "escuelas", nombre: "Escuelas", carga: CONFIG.cargaEscuelas, numero: "03" },
  { id: "casas", nombre: "Casas", carga: CONFIG.cargaCasas, numero: "04" },
];

let mensajeAccion = "";

function obtenerEstadoRed(carga: number): {
  etiqueta: string;
  clase: string;
  descripcion: string;
} {
  if (estado.estadoPartida === "colapsada") {
    return {
      etiqueta: "Colapsada",
      clase: "estado--rojo",
      descripcion: "La red eléctrica ha colapsado.",
    };
  }

  if (estado.estadoPartida === "ganada") {
    return {
      etiqueta: "Estable",
      clase: "estado--verde",
      descripcion: "Turno completado. La red se mantuvo estable.",
    };
  }

  if (carga > CONFIG.cargaMaximaEstable) {
    return {
      etiqueta: "Sobrecarga",
      clase: "estado--rojo",
      descripcion: "La carga supera el límite estable de la red.",
    };
  }

  if (!estado.sectoresEncendidos.hospital) {
    return {
      etiqueta: "Alerta",
      clase: "estado--amarillo",
      descripcion: "El Hospital está sin suministro eléctrico.",
    };
  }

  return {
    etiqueta: "Estable",
    clase: "estado--verde",
    descripcion: "La red eléctrica está dentro de su capacidad.",
  };
}

function renderizar(): void {
  const carga = calcularCarga(estado);
  const sectoresSinLuz = sectores.filter(
    (sector) => !estado.sectoresEncendidos[sector.id],
  ).length;
  const estadoRed = obtenerEstadoRed(carga);
  const partidaTerminada = estado.estadoPartida !== "enCurso";
  const focoActual = document.activeElement;
  const controlEnfocado =
    focoActual instanceof HTMLElement && app.contains(focoActual)
      ? focoActual.dataset.control
      : undefined;

  app.innerHTML = `
    <div class="pagina">
      <header class="encabezado">
        <div class="marca" aria-label="APAGÓN · Control de Emergencia">
          <span class="marca__icono" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M18.5 3 8 17h7l-1.5 12L24 14h-7l1.5-11Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
            </svg>
          </span>
          <span>APAGÓN <span class="marca__separador">·</span> CONTROL DE EMERGENCIA</span>
        </div>
        <p class="encabezado__nota">CENTRO DE OPERACIONES <span aria-hidden="true">/</span> RED NACIONAL</p>
      </header>

      <main>
        <section class="introduccion" aria-labelledby="titulo-principal">
          <p class="sobretitulo"><span class="punto punto--amarillo" aria-hidden="true"></span> OPERACIÓN EN CURSO</p>
          <h1 id="titulo-principal">La red está al límite.</h1>
          <p class="introduccion__texto">Gestioná el suministro para mantener la red estable.</p>
        </section>

        <section class="estadisticas" aria-label="Estado de la red">
          <article class="tarjeta-estadistica">
            <p class="etiqueta">TURNO</p>
            <p class="valor-estadistica">${estado.turno}<span class="valor-estadistica__total">/${CONFIG.turnosParaGanar}</span></p>
            <p class="detalle-estadistica">Ciclo operativo</p>
          </article>
          <article class="tarjeta-estadistica">
            <p class="etiqueta">CAPACIDAD DE RED</p>
            <p class="valor-estadistica ${carga > CONFIG.cargaMaximaEstable ? "texto--rojo" : ""}">${carga}<span class="valor-estadistica__total">%</span></p>
            <p class="detalle-estadistica">Límite estable: ${CONFIG.cargaMaximaEstable}%</p>
          </article>
          <article class="tarjeta-estadistica">
            <p class="etiqueta">SECTORES SIN LUZ</p>
            <p class="valor-estadistica">${sectoresSinLuz}<span class="valor-estadistica__total">/4</span></p>
            <p class="detalle-estadistica">${estado.accionesRestantes} acciones restantes</p>
          </article>
          <article class="tarjeta-estadistica tarjeta-estadistica--red">
            <p class="etiqueta">ESTADO DE LA RED</p>
            <p class="valor-estadistica">
              <span class="indicador ${estadoRed.clase}" aria-hidden="true"></span>
              <span class="valor-estadistica__estado ${estadoRed.clase}">${estadoRed.etiqueta}</span>
            </p>
            <p class="detalle-estadistica" role="status" aria-live="polite">${estadoRed.descripcion}</p>
          </article>
        </section>

        <section class="panel-control" aria-labelledby="titulo-sectores">
          <div class="panel-control__encabezado">
            <div>
              <p class="etiqueta">GESTIÓN DE SUMINISTRO</p>
              <h2 id="titulo-sectores">Sectores de la red</h2>
            </div>
            <p class="ayuda-teclado"><kbd>1</kbd>–<kbd>4</kbd> sectores <span aria-hidden="true">·</span> <kbd>Espacio</kbd> avanzar</p>
          </div>

          <div class="sectores">
            ${sectores
              .map((sector) => {
                const encendido = estado.sectoresEncendidos[sector.id];
                const etiquetaEnergia = encendido ? "Con suministro" : "Sin suministro";
                const accion = encendido ? "Cortar suministro" : "Restablecer suministro";
                const claseEnergia = encendido ? "energia--encendida" : "energia--apagada";

                return `
                  <article class="tarjeta-sector ${!encendido ? "tarjeta-sector--apagada" : ""}">
                    <div class="tarjeta-sector__principal">
                      <span class="numero-sector">${sector.numero}</span>
                      <div class="tarjeta-sector__nombre">
                        <h3>${sector.nombre}</h3>
                        <p class="estado-sector ${claseEnergia}">
                          <span class="punto" aria-hidden="true"></span>
                          ${etiquetaEnergia}
                        </p>
                      </div>
                      <p class="carga-sector">${sector.carga}%<span> de carga</span></p>
                    </div>
                    <button
                      class="boton boton--sector ${!encendido ? "boton--restablecer" : ""}"
                      type="button"
                      data-control="sector-${sector.id}"
                      data-sector="${sector.id}"
                      aria-pressed="${encendido}"
                      aria-label="${accion}: ${sector.nombre}"
                    >${accion}</button>
                  </article>
                `;
              })
              .join("")}
          </div>

          <div class="barra-acciones">
            <p class="mensaje-accion" aria-live="polite">${mensajeAccion}</p>
            <button
              class="boton boton--avanzar"
              type="button"
              data-control="avanzar"
              data-accion="avanzar"
              ${partidaTerminada ? "disabled" : ""}
            >
              <span>${partidaTerminada ? "Turno completado" : "Avanzar Turno"}</span>
              <span class="boton--avanzar__atajo" aria-hidden="true">ESPACIO</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

        ${
          partidaTerminada
            ? `<section class="resultado ${estado.estadoPartida === "ganada" ? "resultado--ganado" : "resultado--perdido"}" role="alert">
                <p class="etiqueta">${estado.estadoPartida === "ganada" ? "OPERACIÓN COMPLETADA" : "FALLO DE LA RED"}</p>
                <p>${estado.estadoPartida === "ganada" ? "La red se mantuvo estable durante los 8 turnos." : "La red eléctrica colapsó. La operación ha terminado."}</p>
              </section>`
            : ""
        }
      </main>

      <footer class="pie">
        <span>SISTEMA DE CONTROL ELÉCTRICO</span>
        <span>PROTOCOLO DE EMERGENCIA ACTIVO</span>
      </footer>
    </div>
  `;

  if (controlEnfocado) {
    app
      .querySelector<HTMLButtonElement>(`[data-control="${controlEnfocado}"]`)
      ?.focus({ preventScroll: true });
  }
}

function ejecutarAccion(accion: () => boolean): void {
  mensajeAccion = accion() ? "" : "Acción no disponible en este momento.";
  renderizar();
}

function cambiarSector(sector: Sector): void {
  ejecutarAccion(() =>
    estado.sectoresEncendidos[sector]
      ? cortar(estado, sector)
      : restablecer(estado, sector),
  );
}

app.addEventListener("click", (evento: MouseEvent) => {
  const objetivo = evento.target;
  if (!(objetivo instanceof Element)) return;

  const boton = objetivo.closest<HTMLButtonElement>("button[data-control]");
  if (!boton) return;

  if (boton.dataset.accion === "avanzar") {
    ejecutarAccion(() => avanzarTurno(estado));
    return;
  }

  const sector = sectores.find((opcion) => opcion.id === boton.dataset.sector);
  if (sector) cambiarSector(sector.id);
});

document.addEventListener("keydown", (evento: KeyboardEvent) => {
  if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.repeat) return;

  const objetivo = evento.target;
  if (
    objetivo instanceof HTMLElement &&
    (objetivo.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(objetivo.tagName))
  ) {
    return;
  }

  const sector = sectores[Number(evento.key) - 1];
  if (/^[1-4]$/.test(evento.key) && sector) {
    evento.preventDefault();
    cambiarSector(sector.id);
    return;
  }

  if (evento.code === "Space") {
    evento.preventDefault();
    ejecutarAccion(() => avanzarTurno(estado));
  }
});

renderizar();
