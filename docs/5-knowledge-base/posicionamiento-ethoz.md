# Posicionamiento Estrategico de Ethoz — Ethoz Knowledge Base

La declaracion definitiva de que es Ethoz, que lo hace unico, para quien es y por que importa ahora. Esta es la fuente de verdad para pitch, homepage, deck de inversores y materiales de venta.

---

## Que es Ethoz

Ethoz es la **capa de seguridad operacional y compliance** que los colegios chilenos necesitan para cumplir con la Ley 21.719 de Proteccion de Datos Personales, proteger a sus comunidades y gestionar su convivencia escolar sin depender de planillas Excel, WhatsApp o documentos en papel.

**Lo que Ethoz NO es**:
- No es un reemplazo del ERP escolar o del libro de clases digital.
- No es una plataforma de aprendizaje en linea (LMS).
- No es un sistema de recaudacion de pagos o finanzas.
- No es una app de mensajeria.

**Lo que Ethoz SI es**:
- La capa de privacidad de datos que ningun competidor tiene.
- El sistema de seguridad operacional para retiros, accesos y alertas en tiempo real.
- La plataforma de convivencia escolar que convierte protocolos en flujos digitales auditables.
- La Ficha 360 que unifica la vision del estudiante con acceso diferenciado por rol.
- El puente entre el colegio y el cumplimiento de la Ley 21.719 antes de diciembre de 2026.

---

## La Ficha 360 — Corazon del Producto

La Ficha 360 es la vista unificada del estudiante. En un solo lugar, con los permisos correctos, cada actor del colegio ve exactamente lo que necesita ver — ni mas ni menos.

### Dimensiones de la Ficha 360

| Dimension | Que incluye | Quien accede |
|---|---|---|
| Academica | Notas, asistencia, rendimiento por asignatura | Docentes, directivos, orientadores, apoderados (vista limitada) |
| Conductual | Registro de situaciones, protocolos abiertos, historial | Inspectores, directivos, orientadores |
| Familiar | Composicion familiar, contactos de emergencia, acuerdos con apoderados | Directivos, orientadores (restringido) |
| PIE / NEE | Diagnosticos, FUDEI, PACI, adecuaciones | Solo profesional a cargo + directivo con log |
| Alertas activas | Restricciones de contacto, situaciones criticas vigentes | Porteria, directivos, inspectores |
| Trayectoria | Historial escolar, cambios de establecimiento, eventos clave | Directivos, orientadores |

### Los tres niveles de privacidad

- **Estandar**: Informacion que cualquier funcionario del colegio puede ver en el contexto de su funcion (nombre, curso, asistencia general).
- **Restringido**: Informacion que solo ciertos roles pueden ver (situaciones de convivencia activas, datos familiares sensibles, historial disciplinario).
- **Privado**: Informacion clinica y de salud que solo el profesional a cargo y el sostenedor pueden acceder, con registro de cada acceso (datos PIE, diagnosticos psicologicos, informes medicos). Cumple Art. 16 bis Ley 21.719.

---

## Cumplimiento desde el Diseno

Ethoz fue construido desde cero con Privacy by Design. Esto no es un modulo que se agrego despues; es la arquitectura fundamental del sistema.

### Que significa en terminos tecnicos

- **RLS (Row-Level Security) a nivel de base de datos**: Las reglas de acceso no viven en la logica de la aplicacion (que puede tener bugs); viven en la base de datos misma. Es imposible acceder a un dato no autorizado, incluso si hay un error en el codigo de la app.
- **Encriptacion en reposo y en transito**: Todos los datos estan cifrados cuando se almacenan y cuando se transmiten. Sin excepcion.
- **Audit Logs automaticos e inmutables**: Cada operacion sobre datos personales queda registrada automaticamente. El log no puede ser modificado ni eliminado por ningun usuario del sistema.
- **Consentimientos digitales**: El flujo de solicitud, registro y revocacion de consentimientos parentales esta integrado nativamente. No es un formulario PDF; es un flujo auditado dentro del sistema.
- **Minimizacion de datos**: Solo se recolectan los datos estrictamente necesarios para cada funcion. No hay campos de recoleccion masiva sin proposito definido.

### Por que esto es un diferenciador estructural

Los competidores no pueden simplemente "agregar" cumplimiento de Ley 21.719 a sus sistemas legacy. La ley requiere cumplimiento desde el diseno. Retrofitting una arquitectura de 15 anos para cumplir RLS, audit logs y encriptacion es un proyecto de anos y millones. Ethoz ya lo tiene.

---

## Retiros Seguros con Bloqueo Visual Automatico

### El problema que resuelve
Cada vez que un nino es retirado anticipadamente del colegio, existe un riesgo. El portero debe verificar en tiempo real:
- Si la persona que retira esta autorizada.
- Si el estudiante puede ser retirado por esa persona (pueden existir restricciones judiciales activas).
- Si el retiro esta siendo solicitado por el apoderado habitual o por alguien distinto.
- Si hay alguna alerta activa sobre ese estudiante.

Hoy, verificar todo esto requiere llamar a la directora, buscar en el cuaderno, consultar un Excel o confiar en la memoria. Todo eso falla.

### Como funciona en Ethoz
- El portero tiene acceso a una interfaz simplificada desde cualquier dispositivo.
- Busca al estudiante por nombre o RUT.
- El sistema muestra inmediatamente: autorizados para retiro, restricciones activas y alertas vigentes.
- Si hay una restriccion de contacto documentada (orden judicial, acuerdo de apoderados), el sistema la muestra con bloqueo visual prominente: no requiere que el portero interprete nada, el sistema le dice que hacer.
- El retiro queda registrado con timestamp, nombre de quien retiro y quien autorizo.

---

## Notificaciones Seguras — Cero WhatsApp

### El problema actual
El 90% de los colegios chilenos usa WhatsApp como canal principal de comunicacion entre el colegio y las familias. Esto genera:
- Informacion sensible de estudiantes circulando en chats sin cifrado de extremo a extremo robusto para el contexto educativo.
- Profesores que no pueden desconectarse porque los mensajes llegan a su numero personal.
- Sin auditoria posible de que informacion fue compartida con quien y cuando.
- Incumplimiento directo de la Ley 21.719 al compartir datos personales de menores por canales no autorizados.

### Como funciona en Ethoz
- Notificaciones push a la app de apoderados con metadatos solamente en la notificacion (nunca el contenido sensible en el banner).
- El contenido completo solo se ve dentro de la app, con autenticacion.
- Horarios configurables: el colegio puede definir que las notificaciones solo lleguen en horario escolar.
- El profesor notifica desde la plataforma, no desde su numero personal.
- Cada comunicacion queda registrada en el historial del estudiante.
- Los apoderados responden dentro de la app, no por WhatsApp.

---

## Diferenciadores Unicos vs. el Mercado

### Lo que ningun competidor tiene hoy

1. **Privacy by Design certificable para Ley 21.719**: RLS nativo, audit logs inmutables, consentimientos digitales, encriptacion total. Ethoz es el unico sistema escolar disenado desde cero para cumplir la nueva ley chilena.

2. **Seguridad operacional en tiempo real**: Control de retiros con alertas de restriccion de contacto en la pantalla del portero. Ninguno de los competidores actuales tiene esta funcionalidad.

3. **Ficha 360 con tres niveles de privacidad**: La vision unificada del estudiante con acceso diferenciado por rol y nivel de sensibilidad, incluyendo cumplimiento Art. 16 bis para datos PIE.

4. **API abierta**: Ethoz se integra con los sistemas que el colegio ya usa. No exige reemplazar nada. Es compatible con Lirmi, Syscol, SIGE y cualquier sistema con API. Los competidores son ecosistemas cerrados.

5. **Notificaciones seguras sin WhatsApp**: Canal oficial de comunicacion colegio-familia con registro, sin exponer numeros personales de docentes y sin informacion sensible en canales no cifrados.

6. **Sin hardware**: No requiere inversion en dispositivos especiales. Funciona en el computador de porteria, en el movil del inspector y en la tablet del director.

---

## El Gap que Solo Ethoz Cubre

El mercado escolar chileno tiene dos tipos de soluciones:

- **Sistemas pedagogicos** (Lirmi, WebClass, EduFacil): Gestionan lo que se ensena, como se evalua y como aprende el alumno. Buenos en su dimension pero ciegos a la seguridad y al compliance.

- **Sistemas administrativo-financieros** (Syscol, parte de Colegium, Napsis): Gestionan la matricula, la recaudacion, la nomina. Esenciales pero irrelevantes para convivencia, seguridad y privacidad de datos.

**El gap**: Nadie cubre el espacio entre ambos. Nadie gestiona quien entra y quien sale, que informacion puede ver quien, como se documenta un protocolo de convivencia de forma auditable, como se protegen los datos clinicos de los estudiantes PIE, o como cumple el colegio la Ley 21.719.

Ethoz cubre ese gap. Y lo hace sin reemplazar lo que ya existe — se integra con ello.

---

## Propuesta de Valor por Segmento

### Para el Sostenedor
"Ethoz es el escudo que protege tu patrimonio. La Ley 21.719 tiene multas de hasta 20.000 UTM. Un incidente de convivencia mal gestionado puede generar demandas millonarias. Ethoz te da el compliance y la trazabilidad que te protegen antes de que el problema ocurra."

### Para el Director
"Ethoz es tu cerebro de informacion. Tienes la Ficha 360 de cada estudiante en tiempo real, los protocolos de convivencia bajo control y la certeza de que tu portero sabe exactamente quien puede retirar a cada nino. Sin llamadas de ultimo minuto. Sin Excel. Sin adivinanzas."

### Para el Inspector / Encargado de Convivencia
"Ethoz es tu herramienta diaria. Cada denuncia tiene un flujo, un responsable y un plazo. El historial de cada situacion esta documentado. Cuando llegue la Superintendencia, tienes todo en orden."

### Para los Padres y Apoderados
"Ethoz es la tranquilidad de saber que el colegio de tu hijo es serio con su seguridad. Te llegan notificaciones al instante cuando hay algo importante. Y tus datos, y los de tu hijo, estan protegidos por ley."

---

*Ultima revision: abril 2026*
