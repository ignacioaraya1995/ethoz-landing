# Analisis Competitivo — Ethoz Knowledge Base

Mapa completo del ecosistema competitivo en software de gestion escolar en Chile. Cada entrada incluye descripcion, fortalezas, debilidades, pricing conocido y diferenciacion de Ethoz.

---

## Tabla Comparativa Rapida

| Empresa | Foco principal | App movil | API abierta | Seguridad escolar | Compliance Ley 21.719 | Precio aprox. |
|---|---|---|---|---|---|---|
| Lirmi | LMS + libro digital | Limitada | No | No | Parcial | Medio |
| Colegium | ERP integral | 2,4 estrellas | No | No | No documentado | Alto |
| WebClass | LMS + hardware | 2,5 estrellas | No | No | No | Medio-alto |
| Napsis | SIS multimodulo | Regular | No | No | No documentado | Opaco |
| Syscol | Finanzas + recaudacion | Notasnet OK | No | No | No | Opaco |
| Kimche | Big Data desercion | No publica | No | No | No | Opaco |
| U-Planner | Ed. Superior IA | No aplica | No | No | No aplica | Alto |
| Integratepie | PIE / Ed. especial | No | No | No | No | Bajo |
| **Ethoz** | **Seguridad + compliance** | **Nativa** | **Si** | **Si** | **Si (by design)** | **TBD** |

---

## 1. Lirmi

### Que hace
Plataforma de gestion pedagogica que incluye libro de clases digital, herramientas de evaluacion formativa, planificacion curricular y su copiloto de inteligencia artificial llamado SofIA. Es uno de los actores mas reconocidos en el segmento pedagogico del mercado chileno.

### Fortalezas
- Libro de clases digital bien implementado, con buena experiencia de usuario para docentes.
- SofIA: copiloto IA que asiste a profesores en planificacion y retroalimentacion. Bien recibido en el mercado.
- Presencia de marca solida en colegios particulares pagados y particulares subvencionados.
- Integracion con algunos sistemas del MINEDUC (SIGE).
- Interfaz relativamente moderna comparada con competidores legacy.

### Debilidades
- Ecosistema completamente cerrado: no tiene API publica para integraciones con terceros.
- Aplicacion movil limitada en funcionalidad; no cubre casos de uso criticos de operacion escolar diaria.
- Soporte al cliente reducido; tiempos de respuesta lentos reportados por usuarios.
- Sin funcionalidades de seguridad escolar (retiros, control de acceso, alertas de convivencia).
- No cubre gestion de PIE ni necesidades educativas especiales de forma nativa.
- Compliance con Ley 21.719 no documentado publicamente; sin evidencia de Privacy by Design.

### Pricing
Modelo de suscripcion anual por establecimiento. Precio estimado en rango medio del mercado. No publica precios en su sitio web; requiere cotizacion.

### Diferenciacion Ethoz
Ethoz no compite en el espacio pedagogico de Lirmi. Donde Lirmi gestiona el "que se ensena", Ethoz gestiona "quien entra, quien sale y quien sabe que". Son capas complementarias. Sin embargo, Ethoz ofrece lo que Lirmi no puede: seguridad operacional, privacidad certificada y proteccion ante la Ley 21.719. Los colegios que usan Lirmi siguen necesitando Ethoz.

---

## 2. Colegium

### Que hace
ERP escolar integral que agrupa multiples productos bajo una misma marca: SchoolTrack (seguimiento academico), EduFacil (plataforma LMS), SchoolNet (red social educativa) y otros modulos. Ha crecido principalmente mediante la adquisicion de al menos 6 empresas del sector.

### Fortalezas
- Propuesta de "todo en uno" que atrae a sostenedores que quieren un solo proveedor.
- Presencia extendida en Chile con base de clientes establecida.
- Robotito: asistente IA propio, aunque en etapa temprana.
- Cubre muchas funciones administrativas y pedagogicas bajo un mismo contrato.

### Debilidades
- Deuda tecnica severa: la integracion de 6 empresas adquiridas resulto en arquitecturas incompatibles bajo una misma marca. Usuarios reportan incoherencias entre modulos.
- Aplicacion movil con 2,4 estrellas en promedio en tiendas de apps, con quejas recurrentes de crashes, lentitud y funcionalidad incompleta.
- Ecosistema cerrado: no expone API para integraciones externas.
- La complejidad del sistema genera curvas de aprendizaje largas y alta dependencia de soporte externo.
- Sin funcionalidades de seguridad escolar ni control de acceso en tiempo real.
- Compliance con nueva ley de datos no documentado.
- Percepcion de empresa en declive de calidad tras las adquisiciones masivas.

### Pricing
Alto. Modelo por modulos mas implementacion. Los costos totales de implementacion pueden superar ampliamente los costos de licencia anuales.

### Diferenciacion Ethoz
Colegium intenta ser todo para todos y termina siendo mediocre en lo critico. Ethoz es excelente en lo que importa: seguridad, privacidad y compliance. Para colegios que ya usan Colegium y estan frustrados, Ethoz representa la capa que Colegium nunca podra construir por su deuda tecnica.

---

## 3. WebClass

### Que hace
Plataforma que combina LMS (aprendizaje en linea), SIS (sistema de informacion escolar) y hardware propio (BigTablet, una tableta educativa de fabricacion propia). Propone un ecosistema vertical completo: software, hardware y contenido.

### Fortalezas
- Propuesta de hardware + software diferenciada en el mercado.
- Experiencia en el sector con anos de presencia en Chile.
- BigTablet tiene traccion en algunos municipios y colegios publicos con presupuesto de infraestructura.

### Debilidades
- Vendor lock-in extremo: una vez que el colegio compra el hardware, queda atado al software. No hay portabilidad.
- Aplicacion movil con 2,5 estrellas en promedio. Quejas de usabilidad y estabilidad.
- Sin integraciones con sistemas externos. Ecosistema completamente cerrado.
- La propuesta de hardware encarece significativamente la solucion y alarga los ciclos de venta.
- Sin funcionalidades de convivencia escolar, seguridad operacional ni compliance de datos.
- Actualizaciones lentas; arquitectura legacy.

### Pricing
Medio-alto, condicionado a la compra o arriendo del hardware. El TCO (costo total de propiedad) es elevado cuando se incluye soporte y mantenimiento de equipos fisicos.

### Diferenciacion Ethoz
Ethoz es software puro, moderno, con API abierta y sin ataduras de hardware. No pide al colegio que cambie su infraestructura fisica. Funciona sobre los dispositivos que ya tienen. Sin lock-in.

---

## 4. Napsis

### Que hace
Sistema de informacion escolar con 19 modulos que cubre desde matricula hasta preparacion para la prueba SIMCE. Uno de los proveedores con mayor cantidad de funcionalidades declaradas en el mercado chileno.

### Fortalezas
- Amplitud de modulos: cubre casi todos los aspectos de la gestion escolar en un solo sistema.
- Experiencia larga en el mercado chileno con clientes establecidos.
- Modulo especifico de preparacion SIMCE, relevante para colegios con foco en resultados academicos estandarizados.

### Debilidades
- Datos no encriptados en algunas versiones del sistema, lo que representa un riesgo critico bajo la Ley 21.719.
- Precios completamente opacos: no publica tarifas y las cotizaciones son altamente variables.
- El volumen de modulos abruma a colegios pequenos y medianos que no tienen equipo administrativo para operar 19 herramientas.
- Interfaz desactualizada; experiencia de usuario de otra decada.
- Sin funcionalidades de seguridad escolar operacional.
- Soporte reportado como deficiente por usuarios actuales.

### Pricing
Opaco. Requiere cotizacion. Rumores de mercado ubican el precio en rango medio, pero con costos ocultos de implementacion y capacitacion.

### Diferenciacion Ethoz
Ethoz no abruma. Hace pocas cosas pero las hace perfectamente y con privacidad certificada desde el diseno. Para los colegios que estan pagando por 19 modulos de Napsis pero usando 4, Ethoz es la alternativa racionalizada y segura.

---

## 5. Syscol

### Que hace
Sistema de gestion escolar con mas de 30 anos en el mercado chileno. Especialidad historica en recaudacion de pagos, control de cuentas corrientes de apoderados y gestion financiera del establecimiento. Tiene una aplicacion movil para apoderados llamada Notasnet.

### Fortalezas
- Reputacion solida en gestion financiera: los sostenedores confian en su manejo de cobranza y cuentas.
- 30+ anos de presencia generan confianza institucional en ciertos segmentos.
- Notasnet: app de apoderados que cubre comunicaciones basicas y visualizacion de notas. Mas estable que la competencia en este segmento.
- Precio percibido como razonable para su funcionalidad financiera.

### Debilidades
- Sin API publica: no se puede integrar con otros sistemas modernos.
- Solo opera en Chile; sin escalabilidad regional.
- Arquitectura legacy de 30 anos acumula deuda tecnica considerable.
- Sin funcionalidades de seguridad escolar, convivencia ni compliance moderno.
- Enfoque casi exclusivo en finanzas deja brechas grandes en lo pedagogico y operacional.
- Actualizaciones lentas; ritmo de innovacion bajo.

### Pricing
Opaco. Se negocia por proyecto. Generalmente economico en el modulo financiero base.

### Diferenciacion Ethoz
Syscol maneja bien el dinero. Ethoz maneja bien la seguridad y la privacidad. Son mundos distintos. Los colegios que usan Syscol para cobranza pueden sumar Ethoz sin reemplazarlo.

---

## 6. Kimche

### Que hace
Plataforma de analisis de datos educativos con foco en Big Data y alertas de riesgo de desercion escolar. Usa modelos predictivos para identificar estudiantes en peligro de abandonar el sistema antes de que ocurra.

### Fortalezas
- Propuesta diferenciada en analytics educativo: no es un SIS tradicional sino una capa de inteligencia.
- Alertas de desercion basadas en datos concretos, no en intuicion del profesor.
- Posicionamiento de vanguardia en el uso de datos para politica educativa.

### Debilidades
- Precios completamente opacos: no hay informacion publica disponible.
- Sin modulo PIE ni herramientas para necesidades educativas especiales.
- El foco en datos puros se esta diluyendo a medida que intentan expandirse a mas funciones generales.
- No tiene presencia significativa en app movil publica.
- Sin funcionalidades de seguridad operacional ni compliance de privacidad documentado.
- Alta dependencia de datos externos (SIGE, etc.) que no siempre estan disponibles en tiempo real.

### Pricing
Completamente opaco. Solo disponible via contacto comercial.

### Diferenciacion Ethoz
Kimche analiza el pasado para predecir el futuro. Ethoz actua en el presente para proteger el ahora. La alerta temprana de Ethoz no es solo academica sino operacional: quien entra, quien sale, quien esta en riesgo de una situacion de convivencia critica hoy. Ademas, Ethoz cumple con privacidad de datos por diseno, algo que Kimche no documenta.

---

## 7. U-Planner

### Que hace
Plataforma de analisis predictivo con Deep Learning orientada a la educacion superior. Trabaja con universidades para modelar trayectorias academicas, predecir desercion universitaria y optimizar recursos institucionales.

### Fortalezas
- Tecnologia de Deep Learning sofisticada, de las mas avanzadas en EdTech latinoamericano.
- Casos de uso validados en universidades de Chile y la region.
- Equipo con alta capacidad tecnica y de datos.

### Debilidades
- Solo opera en educacion superior (universidades e institutos). No tiene producto K-12.
- Sin funcionalidades de gestion operacional escolar.
- Precio alto, orientado a instituciones con presupuesto universitario.
- No relevante para el mercado de colegios donde opera Ethoz.

### Pricing
Alto. Modelo de consultoria + licencia. Orientado a instituciones grandes.

### Diferenciacion Ethoz
No son competidores directos. U-Planner trabaja con universidades; Ethoz trabaja con colegios. Sin embargo, U-Planner es una referencia de lo que la IA puede hacer en educacion, y valida el enfoque de Ethoz en el segmento K-12.

---

## 8. Integratepie

### Que hace
Software especializado en la gestion del Programa de Integracion Escolar (PIE) y educacion especial. Cubre documentacion de FUDEI (Ficha Unica de Derivacion y Evaluacion Integral) y PACI (Plan de Adecuacion Curricular Individual), los dos documentos centrales de la gestion PIE en Chile.

### Fortalezas
- Nicho muy especifico y bien cubierto: es el unico actor con foco exclusivo en PIE.
- Conocimiento profundo de la normativa educativa especial chilena (Decreto 170, Ley TEA).
- Utilizado por equipos de educacion diferencial y psicologos escolares.

### Debilidades
- Microempresa con alto riesgo de "bus factor": si el desarrollador principal sale, el producto colapsa.
- Sin aplicacion movil. Solo web, y con UX desactualizada.
- Sin integraciones con otros sistemas de gestion escolar.
- No cubre ningun otro aspecto de la vida escolar fuera del PIE.
- Pricing bajo, lo que limita su capacidad de inversion en producto.
- Sin cumplimiento documentado de Ley 21.719; los datos clinicos de estudiantes PIE son especialmente sensibles.

### Pricing
Bajo. Modelo de pago anual por establecimiento. Accesible pero limitado en desarrollo futuro.

### Diferenciacion Ethoz
Ethoz incluye gestion PIE de forma nativa dentro de su Ficha 360, con los niveles de privacidad mas estrictos para los datos sensibles de estudiantes con necesidades educativas especiales. Cumple con el Art. 16 bis de la Ley 21.719 (prohibicion de procesar datos clinicos en contextos educativos sin resguardos especificos). Integratepie no puede ofrecer este nivel de compliance.

---

## Gap que solo Ethoz cubre

Ningun competidor actual ofrece simultaneamente:

1. **Seguridad operacional en tiempo real**: control de retiros, alertas de convivencia, acceso de porteria con bloqueo visual automatico.
2. **Privacy by Design certificable**: RLS por nivel de sensibilidad, audit logs, consentimientos parentales digitales, cumplimiento Art. 16 bis.
3. **API abierta**: integrabilidad con los sistemas que el colegio ya usa (Lirmi, Syscol, SIGE).
4. **Ficha 360 unificada**: vista completa del estudiante —academico, conductual, familiar, medico (con restricciones)— en un solo lugar.
5. **Notificaciones seguras sin WhatsApp**: push notifications con solo metadatos, sin exponer informacion sensible en canales no cifrados.

Ethoz no reemplaza el ERP. Ethoz es la capa de seguridad y compliance que el ERP nunca tuvo.

---

*Ultima revision: abril 2026*
