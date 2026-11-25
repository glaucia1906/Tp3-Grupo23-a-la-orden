# A la Orden · Grupo 23

TP3 «Dos sentencias, dos soluciones» · IFTS 29 · Front End · 2026.

Landing conceptual para A la Orden, startup creada por estudiantes del IFTS 16 que organiza pedidos de pequeños emprendimientos de comida y repostería.

## Asignación

**S03-B · Búsqueda.**

- **R3:** Si la búsqueda por nombre encuentra un único pedido, el sistema muestra su detalle y su estado actual.
- **R4:** Si la búsqueda encuentra varios pedidos del mismo nombre, el sistema solicita elegir uno mediante su identificador único, mostrando la fecha como dato auxiliar, antes de abrir su detalle.

Fuente: consigna docente, página 36 del PDF TP3. Entrega indicada: 26/11/2026.

## Ejecutar localmente

Proyecto con Vite, HTML, CSS y JavaScript sin framework. Usar Node.js 24 LTS y npm.

```sh
npm ci
npm run dev
```

Abrir la dirección local que imprime Vite en la terminal. El servidor actualiza la página al guardar cambios. Para detenerlo, usar Ctrl+C.

También se puede usar **Live Server de VS Code**, abriendo `index.html` con **Open with Live Server**. Las imágenes usan rutas relativas y los flujos resuelven sus ilustraciones desde el módulo JavaScript. No abrir la página como un archivo `file://`: los módulos requieren un servidor HTTP.

Para generar y revisar la versión de producción:

```sh
npm run build
npm run preview
```

El build genera `dist/`. Las fuentes de Google son opcionales: si no hay conexión, se usan fuentes del sistema.

## Alcance y decisiones

La página presenta dos propuestas y sus diagramas; no ejecuta agentes, no integra IA, no conecta APIs ni implementa un backend. Los botones muestran ejemplos escritos, con datos ficticios, y no realizan búsquedas reales.

R3 muestra detalle y estado si existe exactamente un resultado. R4 exige selección humana por identificador único antes del detalle cuando hay varios. La fecha es auxiliar. El caso sin resultados, la validación de selección y el manejo de errores son decisiones agregadas por el grupo y están identificadas como tales en la página. Una consulta fallida no debe interpretarse como cero coincidencias.

## Integrantes y aportes

Perfiles, fotos y enlaces recuperados del proyecto FrontReact del equipo DragonByte. Los aportes específicos de este TP deben registrarse cuando se realicen; los roles profesionales de las tarjetas no representan tareas asignadas para esta entrega.

| Integrante | Aporte concreto |
| --- | --- |
| Sebastián Fernández | incorporacion de assets, armado de perfiles, pruebas de integracion, revisión de las sentencias R3/R4 y de la coherencia entre las condiciones y los diagramas. |
| Glaucia Ferreira | organización del repositorio, estructura inicial, tema claro y oscuro, diagramas de flujo, revisión de la documentación y deploy en vercel. |
| Ignacio Grosman | modularizacion del proyecto, pruebas de navegación, documentación de agentes, desplegables y escenarios de búsqueda para detectar posibles mejoras. |
| Andrea Maslucan Moreno | Paleta de colores, integración de recursos gráficos y animaciones, contexto del cliente , selección inicial de casos, y generacion de ventanas emergentes para los diagramas.|

Las tareas se pueden combinar o rotar según la composición real del grupo.

## Construcción agéntica

- Aplicación utilizada: Codex desktop.
- Modelo utilizado en esta revisión: `gpt-6.1-sol`.
- Iteración: a pedido del grupo se incorporó Vite para desarrollo local y generación de la versión de producción. Se conservaron los contenidos y el diseño, se convirtió la entrada JavaScript a módulo y se actualizaron las instrucciones de ejecución y publicación.


## Revisión antes de entregar

- [x] Incorporar el **logo original** completo y legible: `assets/logo-a-la-orden.webp`, provisto por el grupo como S03.webp.
- [ ] Registrar integrantes, aportes y modelo utilizado; si la aplicación no lo informa, escribir «modelo no informado».
- [x] Mantener las dos sentencias originales y representar sus condiciones. La explicación por todos los integrantes queda para la revisión grupal.
- [x] Verificación técnica de uno, varios y cero resultados; fecha repetida, errores y selección inválida (esta última en pruebas del modelo).
- [x] Verificar controles con clic y los diez desplegables con Enter y barra espaciadora.
- [x] Revisar navegación, foco visible y diagramas en desktop; ampliar revisión a tamaños de tablet y celular.
- [ ] Registrar revisión grupal y evidencia de iteración.
- [ ] Publicar y comprobar repositorio y landing desde una ventana sin sesión.

## Publicación prevista

El compañero que cree el repositorio lo conectará a Vercel. Seleccionar preset **Vite**, comando de build `npm run build` y directorio de salida `dist`. La raíz del proyecto es la carpeta que contiene `package.json`. Subir `package-lock.json` al repositorio; no subir `node_modules/` ni `dist/`. Completar los enlaces luego de publicarlo.

- Repositorio: https://github.com/glaucia1906/Tp3-Grupo23-a-la-orden
- Landing: pendiente.
- Comprobación de enlaces sin sesión: pendiente.

## Archivos

- `index.html`: contenido, diagramas y desplegables nativos.
- `styles.css`: diseño, variantes responsivas y foco accesible.
- `responsive.css`: adaptación de celulares y tablets, controles táctiles y diagramas completos.
- `ENTREGA.md`: guion de explicación, matriz de casos y pasos pendientes de revisión grupal y publicación.
- `main.js`: selección de casos ilustrativos sin acceso a servicios.
- `package.json`: dependencia Vite y comandos de desarrollo, build y vista previa.
- `package-lock.json`: versiones fijadas para instalaciones reproducibles con `npm ci`.
- `.gitignore`: exclusión de dependencias, archivos generados y configuración local.

## Segunda iteración: identidad e interacción

A pedido del grupo se incorporó el logo original S03.webp (sin alterar ni recortar), un favicon SVG simplificado inspirado en su símbolo, modo claro/oscuro y perfiles reales de los cuatro integrantes. Se conservan las identidades diferenciadas: A la Orden es la startup destinataria; DragonByte / Grupo 23 presenta la propuesta.

Los diagramas permiten seleccionar cinco escenarios, avanzar, retroceder, reiniciar y consultar cada nodo. R4 mantiene el detalle inaccesible hasta elegir un identificador válido; las fechas pueden coincidir. Cambiar de escenario o reiniciar borra la selección. Los datos son ficticios y se calculan localmente; no hay automatización real. Los diagramas originales permanecen como alternativa cuando JavaScript no se ejecuta.

El tema se inicia según la preferencia guardada o del sistema y se guarda en localStorage. Si el almacenamiento está bloqueado, el cambio sigue funcionando durante la sesión. Las animaciones de entrada y de pasos respetan prefers-reduced-motion. Los perfiles conservan sus descripciones y GitHub; no se inventaron aportes al TP.

Archivos agregados: enhancements.css (temas, interacción y animación), interactive-flows.js (controles), flow-model.js (reglas de simulación), favicon.svg y assets/ (logo y fotos).

## Verificación de esta iteración

- `npm test`: cuatro pruebas de lógica aprobadas (R3, selección obligatoria de R4, fechas coincidentes y errores).
- `npm run build`: compilación de producción aprobada.
- Navegador: selección PED-1087 y detalle correcto; cambio de escenario elimina la selección; tema claro persiste al recargar; imágenes cargadas; perfil abierto y cerrado con Enter.
- Revisión visual en escritorio (1366 × 900) y panel angosto. Sin desbordamiento horizontal detectado en escritorio.
- La revisión conjunta del grupo y la publicación siguen pendientes.

## Iteración responsive y cierre local

Pedido del grupo: adaptar a tablets y celulares y avanzar con los faltantes de entrega.

Problema detectado: la elipse decorativa desbordaba en anchos pequeños y la disposición de dos columnas reducía la legibilidad del flujo en tablets verticales. Cambio: se redujo la elipse, se usa una columna para las soluciones hasta 900 px, tarjetas de perfil individuales en celular, tipografía adaptable y controles táctiles de al menos 44 px. Los estilos se cargan desde HTML para conservar la presentación aun sin JavaScript.

Se añadió «Ver diagrama completo» a ambos flujos para consultar todas las ramas sin cambiar escenarios. Esto complementa la simulación paso a paso.

Verificación: 320, 375, 430, 768, 820, 1024 y 1366 px sin desborde horizontal; diez desplegables probados con Enter/Espacio; selección por identificador en tablet con fechas coincidentes. Son pruebas en navegador con viewport emulado, no una certificación en dispositivos físicos.

Ver [ENTREGA.md](ENTREGA.md) para el guion y los pendientes que requieren datos reales del grupo. No se atribuyen revisiones a otros integrantes sin su confirmación. No se realizaron commits ni push de esta iteración.

## Corrección de estilos y contraste · 19/11/2026

El grupo detectó texto ilegible en los botones de escenarios al usar el tema oscuro. La sección tiene fondo verde permanente, pero sus botones heredaban variables globales invertidas por el tema. Se fijaron colores propios para estados normal, seleccionado, hover y foco, y se mejoró la legibilidad de controles deshabilitados.

La revisión adicional encontró desborde interno en las etiquetas de nodos a 320–360 px. Se reemplazó esa distribución por una grilla de dos columnas y se ajustaron límites de campos, leyendas y textos largos. Los controles de escenarios conservan un mínimo de 44 px de alto.

Verificación: revisión de las tres hojas de estilos; navegador en ambos temas, con desplegables abiertos; comprobación de anchos desde 320 hasta 1680 px y de límites 380/381, 650/651 y 900/901. Sin desborde horizontal ni recortes de texto en los controles medidos tras la corrección. Inspección visual en celular (360 px) y tablet (820 px). Comprobación de contraste de textos renderizados sobre fondos sólidos en ambos temas, sin fallos detectados en esa comprobación; no equivale a una auditoría integral de accesibilidad ni a pruebas en dispositivos físicos.

## Rediseño visual · 24/11/2026

A pedido del grupo, se simplificó la presentación para conseguir una estética más profesional y elegante, con menos bordes. Se reemplazaron los contornos repetidos por espaciado y superficies suaves, se renovaron la portada y los perfiles, y los recorridos ahora se presentan como una secuencia visual liviana. Se mantiene la identidad verde, el logo original y todo el contenido de las reglas R3/R4.

Se agregaron transiciones breves al cambiar escenarios, pasos y casos, entradas escalonadas y navegación activa. Las animaciones se desactivan con la preferencia de movimiento reducido, incluso si cambia durante la sesión. Se conservaron el foco visible, los controles nativos, las regiones de anuncio y la selección obligatoria por identificador.

Verificación: `npm.cmd test` (4/4) y `npm.cmd run build` aprobados; revisión estática de la cascada responsive y los colores en ambos temas. La inspección visual de esta iteración quedó pendiente porque Computer Use rechazó el acceso a Google Chrome por falta de autorización. No se realizaron commits, push ni publicación.

## Flujos ilustrados y color · 24/11/2026

Los recorridos tienen ahora dos paletas propias, azul y ciruela, con variantes claras y oscuras. La búsqueda directa y la elección guiada se presentan con nombres descriptivos; R3 y R4 quedan como referencias secundarias de la consigna. Cada etapa tiene un icono y un tipo escrito, y el paso actual se destaca con fondo, peso tipográfico y `aria-current`.

Se incorporaron dos ilustraciones originales generadas con ImageGen y optimizadas para la web (768 × 512 px, menos de 100 KB entre ambas). Las escenas muestran una búsqueda de repostería y dos pedidos por distinguir, sin texto ni estados de selección incrustados. El texto que las acompaña cambia según el paso y conserva los casos sin resultados y de error. Ver [recursos y prompts](assets/flujos/README.md).

La barra de avance mantiene pendientes la validación y el detalle mientras R4 espera una selección. Las transiciones de escena, progreso y controles respetan movimiento reducido. Se mantiene la selección humana por identificador y el diagrama completo alternativo.

Verificación: cuatro pruebas de lógica aprobadas, sintaxis JavaScript y build de producción correctos; revisión estática de los contratos HTML/CSS, contraste y adaptación responsive. La inspección visual en navegador continúa pendiente por el permiso de acceso a Chrome. No se realizaron commits, push ni publicación.

## Corrección de imágenes en Live Server · 24/11/2026

La captura del grupo mostraba una foto rota al abrir la página con Live Server. Los archivos de las fotos eran válidos: el problema era que las rutas `/assets/...` suponían el montaje automático de `public/` que hace Vite. Live Server sirve el árbol de archivos directamente y no realiza ese montaje.

Se trasladaron los recursos a `assets/`, con referencias relativas desde HTML y `new URL(..., import.meta.url)` para las ilustraciones de los flujos. El favicon y la entrada JavaScript también usan rutas relativas. La configuración `base: './'` conserva esa compatibilidad en la versión compilada, incluso si se abre `dist/index.html` con Live Server o se publica dentro de una subcarpeta.

Verificación: build y sintaxis correctos. Con un servidor HTTP estático se comprobaron las referencias de la página original y de `dist/index.html`, incluyendo los recursos de los módulos: las siete imágenes devolvieron HTTP 200 con su tipo de imagen correcto en ambos casos. Los retratos originales se conservaron sin cambios.

## Estética 3D y colores vivos

Se extendió el estilo de las ilustraciones a toda la web: azules, coral, lavanda, menta y miel; botones con relieve, paneles iluminados, perfiles elevados y controles de casos que se hunden al seleccionarlos. La portada reutiliza la ilustración original de la torta con piezas decorativas de CSS y tarjetas flotantes del pedido de ejemplo. No se añadieron nuevas imágenes ni librerías.

`depth.css` define la presentación general y `flows.css` adapta los recorridos a la misma estética. `depth-effects.js` agrega una inclinación máxima de cuatro grados a la imagen de portada al mover un puntero preciso, con referencia al contenedor estable. Se desactiva en pantallas táctiles y cuando se prefiere movimiento reducido. Se conservaron las rutas compatibles con Live Server, ambos temas, los contenidos y las reglas de selección.

Verificación: build de producción, cuatro pruebas de lógica y sintaxis JavaScript aprobados; revisión estática de contraste, capas, foco y dimensiones móviles. La revisión visual en Chrome sigue limitada por el permiso de Computer Use.

El logo original de A la Orden se conserva en la sección de identidad y en el encabezado. Se utiliza el archivo original completo, sin regenerarlo, recolorearlo ni recortarlo; los efectos 3D se aplican a la interfaz que lo acompaña.

## Logo transparente y portada con identidad de marca · 25/11/2026

A pedido del grupo se creó `assets/logo-a-la-orden-transparente.png`, una variante con canal alfa real que reemplaza el fondo crema en el encabezado y en la sección de identidad. El archivo original WebP se conserva intacto. El tema oscuro utiliza una iluminación suave alrededor de los trazos para mantenerlos visibles sin una placa rectangular.

El encabezado y la portada usan verde teal, menta, amarillo y coral del logo. La ilustración de portada tiene una variante propia, `assets/pedido-hero-verde.jpg`, con caja y lupa verdes, cinta amarilla y fondo menta. Se mantuvieron la profundidad de los paneles, las sombras, el relieve de los botones y la inclinación interactiva. Las paletas de los recorridos siguen diferenciadas.

Los recursos se editaron con ImageGen; ver [archivos y prompts](assets/VARIANTES-IDENTIDAD.md). Verificación: canal alfa transparente comprobado, original conservado por hash idéntico, build y cuatro pruebas aprobados. Un servidor HTTP estático comprobó todos los recursos de la página original y de `dist`, incluidas las ocho imágenes distintas. La inspección visual del sitio en Chrome sigue pendiente por el permiso de Computer Use.

## Paleta verde en toda la web

Se extendió la identidad del encabezado y la portada a las secciones de marca, contexto, soluciones, casos, equipo y pie. Las superficies usan menta y verde, con amarillo para decisiones y coral para excepciones. Los dos recorridos se distinguen con variantes teal y verde hoja; el tema oscuro utiliza verdes profundos. Se conservan las sombras, los botones con relieve, la inclinación de portada, el logo transparente y las preferencias de movimiento reducido.

Las ilustraciones activas también combinan con esa paleta: la búsqueda directa reutiliza `assets/pedido-hero-verde.jpg` y la elección usa la nueva variante `assets/flujos/elegir-pedido-verde.jpg`. Los originales se conservan; ver [recursos y prompts de edición](assets/VARIANTES-IDENTIDAD.md).

Verificación: cuatro pruebas de lógica, sintaxis JavaScript y build aprobados. Se revisó el contraste estático de los colores principales en ambos temas y se ajustaron los enlaces sobre paneles menta. Un servidor HTTP estático, montado dentro de una subcarpeta, comprobó la página fuente y `dist`: las siete imágenes y el favicon respondieron HTTP 200 en ambos casos. La revisión visual del sitio en Chrome continúa pendiente por el permiso de Computer Use.

## Recorridos verticales y alternativas visibles

Las dos secciones de soluciones ahora se presentan en una sola columna: explicación, ilustración y simulador apilados, con anchos de lectura controlados. Se conservan la paleta verde, el relieve y las animaciones con movimiento reducido.

Cada consulta muestra cuatro alternativas: un pedido, varios pedidos, sin resultados y error. Permanecen pendientes hasta conocer el resultado; entonces se destaca el recorrido activo y los otros pasan a gris con una etiqueta explicativa. El diagrama completo refleja los mismos estados. La validación de R4 se mantiene pendiente hasta llegar a ese paso. Los pedidos no elegidos se muestran en gris, pero se pueden seguir seleccionando con teclado o clic. Reiniciar o retroceder antes de la consulta restaura los estados pendientes.

Verificación: ocho pruebas del modelo aprobadas, incluidas las alternativas de ambas reglas, fechas coincidentes, cambios de escenario y reinicio. Sintaxis JavaScript, contraste estático de estados claros/oscuros y compilación de producción comprobados. La revisión visual en navegador sigue pendiente por el permiso de Computer Use.

## Inicio contextual de las consultas

Ambos recorridos comienzan con el mensaje de Lucía a A la Orden, su nombre y el objetivo de consultar el detalle y estado de su pedido. El botón «Comenzar el recorrido» abre la simulación, manteniendo visible ese contexto. El modelo y el diagrama completo también incluyen recibir la consulta e identificar a la persona antes de consultar el registro.

El selector de escenarios pasó a «Probar otro resultado de la consulta», una opción secundaria del recorrido. Cambiarlo vuelve al paso inicial; reiniciar cierra la simulación, limpia la selección y devuelve el foco al botón de inicio. Se conservan los estados grises y la selección obligatoria por identificador.

Verificación: nueve pruebas aprobadas, incluida la secuencia de inicio en ambos flujos para todos los escenarios; sintaxis JavaScript y build correctos. La revisión visual en navegador continúa pendiente por el permiso de Computer Use.

## Recorridos por etapas en la columna derecha

Las secciones conservan dos columnas en escritorio y se apilan hasta 900 px. Antes de cualquier paso, el simulador muestra una pantalla para elegir uno de los cinco tipos de caso, sin preselección. «Comenzar recorrido» se habilita al elegir y recién entonces abre el contexto de Lucía. Durante el recorrido se muestra una única tarjeta por etapa, con un índice horizontal compacto. Avanzar reemplaza el contenido con una transición horizontal, sin acumularlo hacia abajo. En escritorio se reserva una altura estable para la tarjeta; el contenido extenso y el zoom siguen accesibles mediante desplazamiento interno.

Se retiró la barra que acompañaba el scroll. Hay un solo par de controles «Anterior» y «Siguiente», al pie de la tarjeta. Las alternativas se muestran en la decisión correspondiente, con las descartadas en gris. La selección aparece dentro de su etapa y R4 mantiene pendientes la validación y el detalle hasta elegir un identificador. Cambiar de caso o reiniciar vuelve al contexto y borra la elección.

«Reiniciar», «Probar otro caso» y «Ver diagrama» aparecen al inicio del recorrido, después de comenzar; debajo se indica el caso seleccionado. «Probar otro caso» regresa a la pantalla de elección en la misma columna, borra el pedido elegido y requiere volver a pulsar «Comenzar recorrido». «Reiniciar» vuelve al contexto del caso actual. El diagrama se abre en una ventana de diálogo que no alarga la sección. Al terminar aparece «Ver diagrama completo generado».

El diagrama se genera con los pasos, resultados e identificador del caso actual. Las etapas futuras se muestran pendientes y no revelan resultados por adelantado; las alternativas descartadas quedan grises. R4 no muestra el botón final mientras espera un identificador. El diagrama general de la regla sigue disponible como referencia desplegable.

El cambio de etapa respeta movimiento reducido y anuncia el paso brevemente. Verificación: sintaxis, nueve pruebas del modelo y build aprobados; revisión estática de foco, límites, estados y cascada responsive. La comprobación visual en navegador sigue pendiente por el permiso de Computer Use.

## Red conceptual antes de los recorridos

«Del nombre al pedido» incorpora una introducción al contexto y una red conceptual que conecta la consulta de la persona, la búsqueda por nombre y la cantidad de coincidencias. Desde allí se distinguen la búsqueda directa (R3), la elección guiada (R4) y la alternativa sin resultados. La falla del registro se explica junto a la consulta, con cantidad desconocida, separada de cero coincidencias.

El mapa permite ir a cada recorrido o a los casos de revisión. Explica la elección humana por identificador, el papel auxiliar de la fecha y las decisiones adicionales del grupo. Conserva el carácter conceptual y los datos ficticios de la propuesta. La presentación mantiene la paleta verde y el relieve, se adapta a pantallas pequeñas y reutiliza la animación de entrada con respeto por la preferencia de movimiento reducido.

Verificación: enlaces internos e identificadores revisados, sintaxis JavaScript correcta, nueve pruebas del modelo aprobadas y compilación de producción correcta. Los conectores y la cascada responsive se revisaron en el código; la inspección visual en navegador sigue pendiente por el permiso de Computer Use.
