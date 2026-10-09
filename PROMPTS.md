Creá el archivo src/logica.ts con las reglas de MI JUEGO, según la ficha de abajo.

REGLAS TÉCNICAS, obligatorias
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números juntos arriba, cada uno con un comentario que diga su unidad.
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y false si no se pudo hacer.
- Si hace falta azar, usá un generador con semilla y exportalo, para que la misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.

REGLAS DE TRABAJO
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha no decía nada.

FICHA:
NOMBRE DEL PROYECTO: APAGÓN - Control de Emergencia
EN UNA FRASE: Decidí a qué sectores cortar la luz para evitar un colapso eléctrico.
PARA QUIÉN ES: Operador del sistema eléctrico bajo presión.
QUÉ LOGRA: Mantener la red estable sin colapsar.
LOS TRES VERBOS: 1. Cortar, 2. Restablecer, 3. AvanzarTurno.
TERMINA BIEN SI: Aguantás 8 turnos sin colapsar la red.
TERMINA MAL SI: La carga supera el 100% por más de 1 turno o el Hospital se queda sin luz más de 1 turno.
QUÉ SE VE EN PANTALLA: Carga total de la red %, Turno actual/8, Acciones restantes, y 4 sectores (Hospital, Agua, Escuelas, Casas) con su estado de energía.
CONTROLES: Teclas 1, 2, 3, 4 y botones táctiles en pantalla.
COLORES: Verde (red estable / sector encendido), Rojo (sobrecarga / sector apagado), Amarillo (alerta).
CRITERIO DE ACEPTACIÓN: Abro la app, veo carga al 110%, apago Casas para bajar a 80%, avanzo turno, mantengo Hospital encendido 8 turnos y gano.
LO QUE NO VA: Sin animaciones complejas, sin sonidos, sin múltiples niveles.
Escribí pruebas con Vitest para src/logica.ts, en test/logica.test.ts.

Como mínimo cinco, y tienen que cubrir:
1. Que el estado inicial se arme bien.
2. Cada acción del usuario: qué hace cuando es válida y qué devuelve cuando no.
3. Que no se pueda hacer una acción prohibida por las reglas.
4. La condición de «termina bien» y la de «termina mal» de mi ficha.
5. UNA PRUEBA QUE RECORRA UN USO COMPLETO de principio a fin y compruebe que SE PUEDE LLEGAR AL FINAL BUENO.

Los nombres de las pruebas en español y en forma de frase.
No modifiques src/logica.ts. Al terminar corré npm test y pegame el resultado.