# 1. APAGÓN - Control de Emergencia

Frase de la ficha: "Decidí a qué sectores cortar la luz para evitar un colapso eléctrico."

## 2. Qué hace y cómo se usa
Gestiona la red eléctrica para cortar y restablecer suministro según la carga y el riesgo de colapso.
Usá 1, 2, 3 y 4 para activar o apagar sectores, y Avanzar Turno para simular cada ciclo.
La meta es mantener el Hospital encendido y sobrevivir 8 turnos sin que la red colapse.

## 3. Enlace para abrirlo
Abre la app en el navegador en: http://localhost:5173

## 4. Cómo correrlo en otra máquina
```bash
git clone <URL-del-repositorio>
cd practica-2
npm install
npm run dev -- --host 0.0.0.0
```
Luego abrí la URL que muestre Vite en tu navegador (por defecto, http://localhost:5173).

## 5. Qué dirigí yo y qué error encontré probando

Dirigí al agente indicando las reglas de los 4 sectores. Un error que encontré al probar fue equilibrar la carga del Hospital y las Casas sin sobrepasar el 100% de la capacidad de la red

## 6. Declaración de autoría
Usé GitHub Copilot dentro de VS Code como herramienta de apoyo para generar y refinar el código.
El código del proyecto fue generado por un agente de IA bajo mi dirección, y yo supervisé la lógica, la estructura y la validación del juego.
Puedo explicar la lógica del juego, la gestión de turnos, la lógica de carga y los criterios de victoria/derrota, y también la parte visual y de interacción de la interfaz.
