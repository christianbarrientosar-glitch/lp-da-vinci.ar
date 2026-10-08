# Datos para las siete ?rbitas

Actualmente son m?tricas simuladas locales, sin conexi?n con workers reales.
Cada ?rbita corresponde a un ID estable, worker-1 a worker-7, en orden.

Formato preparado para reemplazar la simulaci?n:

```json
{"nodes":[{"id":"worker-1","status":"running","load":0.42,"queue":18,"latencyMs":120,"throughput":24,"errorRate":0.002}]}
```

El JSON completo debe incluir siete nodos con IDs ?nicos. `load` y `errorRate`
son fracciones entre 0 y 1; `queue` es trabajo pendiente; `latencyMs` son
milisegundos; `throughput` es trabajo completado por segundo. Estados:
`running`, `idle`, `offline`. El esquema se adaptar? al JSON real del usuario.

`DAVINCI_WORKERS.setNodes(json)` valida el lote completo antes de aplicarlo y
reemplaza la simulaci?n. `snapshot(t)` devuelve los valores actuales.

Carga: escala y luminosidad. Cola: amplitud de elipses y deriva.
Latencia: desplazamiento vertical. Throughput: ritmo y pulso orbital.
Errores: un anillo interior tenue. Offline aten?a y detiene el movimiento;
idle detiene los pulsos. Reduced motion deja una representaci?n est?tica.
Ninguna m?trica introduce textos visibles en la escena.

El arco oscuro tiene la misma amplitud de observaci?n que el normal.
El haz oscuro recorre los mismos ?ngulos en el mismo sentido que el gesto y apunta al opuesto (+PI).
Cruzar cualquiera de los l?mites del arco oscuro recupera Leonardo,
sin exigir una vuelta completa. El scroll blanco permanece independiente.
