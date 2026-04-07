# Marco Legal y Regulatorio — Ethoz Knowledge Base

Guia completa del marco normativo que regula la gestion escolar en Chile. Cada ley incluye que exige, plazos, sanciones, implicancias para colegios y como Ethoz ayuda a cumplir.

---

## 1. Ley 21.719 — Proteccion de Datos Personales

### Que es
La nueva Ley de Proteccion de Datos Personales de Chile, publicada en el Diario Oficial. Reemplaza y moderniza drasticamente la antigua Ley 19.628 de 1999, alineando a Chile con estandares internacionales como el GDPR europeo.

### Que exige
- **Derechos ARCO+P**: Los titulares de datos (estudiantes mayores de edad, apoderados en nombre de menores) tienen derechos de Acceso, Rectificacion, Cancelacion, Oposicion y Portabilidad de sus datos personales.
- **Consentimiento parental explicito**: Para el procesamiento de datos de menores de edad, se requiere consentimiento informado, especifico y documentable de sus tutores legales.
- **Audit Logs**: Las organizaciones deben mantener registros de todas las operaciones realizadas sobre datos personales: quien accedio, cuando, que modifico y desde donde.
- **Notificacion de brechas**: En caso de vulneracion de seguridad que afecte datos personales, la organizacion debe notificar a la autoridad competente en plazos definidos.
- **Medidas tecnicas y organizativas**: Implementacion de controles de seguridad proporcionales al riesgo de los datos tratados.
- **Encargados de datos**: Si el colegio contrata proveedores que procesan datos de estudiantes, debe existir un contrato de encargo de datos que obligue al proveedor a las mismas reglas.
- **Delegado de Proteccion de Datos (DPD)**: Para organizaciones que procesan datos a gran escala o datos especialmente sensibles, se contempla la figura del DPD.

### Articulo 16 bis — Datos sensibles en contexto educativo
Este articulo es especialmente critico para colegios: **prohíbe el procesamiento de datos clinicos, de salud o de diagnostico de estudiantes dentro de plataformas educativas generales** sin resguardos especificos y diferenciados. Esto afecta directamente a los datos de estudiantes PIE (diagnosticos psicologicos, informes medicos, evaluaciones neuropsicologicas).

### Plazos
- **Vigencia plena**: diciembre de 2026. Los colegios tienen hasta esa fecha para adecuarse.
- **Periodo de transicion**: 2025–2026 es el periodo en que se espera que las organizaciones implementen los cambios. Empezar tarde es un riesgo alto.

### Sanciones
- Multas de hasta **20.000 UTM** para infracciones graves (equivalente a aproximadamente CLP $1.340.000.000 al valor UTM de 2025).
- Alternativamente, hasta el **4% de la facturacion anual global** del infractor, lo que sea mayor.
- Sanciones adicionales por reincidencia.
- Posible suspension temporal de operaciones de tratamiento de datos.
- Responsabilidad personal para directivos que hayan autorizado practicas ilegales.

### Implicancias para colegios
- Las planillas Excel con datos de estudiantes no cumplen la norma.
- Los sistemas sin encriptacion de datos en reposo o en transito no cumplen.
- El uso de WhatsApp para comunicar informacion de estudiantes (diagnosticos, situaciones familiares, medidas disciplinarias) es una brecha legal.
- Los colegios que contratan software deben verificar que sus proveedores cumplan la ley.
- Los datos PIE tienen proteccion especial y requieren controles adicionales.

### Como ayuda Ethoz
- **RLS (Row-Level Security)**: Cada dato tiene un nivel de acceso definido (estandar, restringido, privado). Solo quien debe ver un dato lo ve. Esto es tecnico, automatico y auditable.
- **Audit Logs nativos**: Cada accion sobre un dato queda registrada automaticamente: quien, cuando, que operacion.
- **Consentimientos digitales**: Flujo de solicitud y registro de consentimiento parental integrado en la plataforma.
- **Encriptacion end-to-end**: Datos encriptados en reposo y en transito.
- **Cumplimiento Art. 16 bis**: Los datos clinicos de estudiantes PIE tienen nivel de privacidad "privado" por defecto y solo son accesibles por el profesional autorizado y el sostenedor con log de acceso.
- **Contrato de encargo de datos**: Ethoz firma contrato de encargo como proveedor, asumiendo sus obligaciones legales.

---

## 2. Ley 21.663 — Marco de Ciberseguridad

### Que es
La Ley Marco de Ciberseguridad de Chile, que establece los principios, instituciones y obligaciones en materia de seguridad de sistemas informaticos para organizaciones publicas y privadas que operan infraestructura critica o manejan datos sensibles.

### Que exige
- **Medidas tecnicas minimas**: Las organizaciones deben implementar controles de seguridad informatica proporcionales al nivel de riesgo de sus sistemas.
- **Reporte de incidentes**: En caso de incidentes de ciberseguridad (ataques, brechas, accesos no autorizados), existe la obligacion de reportar a la Agencia Nacional de Ciberseguridad (ANCI) en plazos definidos.
- **Gestion de riesgos**: Las organizaciones deben tener una evaluacion de riesgos ciberneticos y un plan de respuesta a incidentes.
- **Continuidad operacional**: Para servicios criticos, se exigen planes de continuidad ante fallas de sistemas.

### Implicancias para colegios
- Los colegios que manejan datos de menores de edad son considerados organizaciones con datos sensibles.
- Un ataque de ransomware a un sistema escolar que comprometa datos de estudiantes genera obligaciones de reporte y posibles sanciones.
- Los sistemas sin autenticacion robusta (2FA, gestion de sesiones) son vulnerabilidades documentables.
- El uso de herramientas sin soporte de seguridad (software desactualizado, Excel compartido por email) constituye incumplimiento.

### Como ayuda Ethoz
- Arquitectura en la nube con proveedores certificados (cumplimiento SOC 2 a traves de Supabase/infraestructura base).
- Autenticacion con 2FA disponible para roles criticos.
- Gestion de sesiones y cierre automatico por inactividad.
- Sin almacenamiento local de datos sensibles en dispositivos de usuarios.
- Actualizaciones de seguridad continuas sin intervencion del colegio.

---

## 3. Circular N°30 — Superintendencia de Educacion

### Que es
La Circular N°30 de la Superintendencia de Educacion regula el uso del Libro de Clases Digital en los establecimientos educacionales chilenos, estableciendo los requisitos tecnicos y legales que deben cumplir las plataformas que lo implementen.

### Que exige
- **Libro de Clases Digital**: Los establecimientos pueden (y en muchos casos deben) usar un libro de clases digital en reemplazo del libro fisico.
- **Interoperabilidad**: Los sistemas deben ser capaces de interoperar con los sistemas del MINEDUC (especialmente SIGE).
- **Firmas digitales**: Los registros del libro digital deben tener mecanismos de firma que garanticen la autoria de cada entrada.
- **Inalterabilidad**: Una vez registrada una entrada (asistencia, nota, observacion conductual), no puede ser modificada sin dejar trazabilidad. No se puede "borrar" el historial.
- **Acceso diferenciado**: Distintos roles (docente, directivo, inspector, apoderado) tienen distintos niveles de acceso a la informacion del libro.
- **Respaldo y disponibilidad**: El sistema debe garantizar disponibilidad y tener politicas de respaldo de informacion.

### Implicancias para colegios
- Los colegios que usan libro fisico asumen riesgos operacionales (perdida, dano, acceso no autorizado).
- Los sistemas digitales que no cumplan los requisitos tecnicos de la Circular N°30 no son validos legalmente.
- La inalterabilidad de registros protege al colegio en disputas legales con apoderados.
- La interoperabilidad con SIGE es requisito para procesos criticos como rendicion de subvenciones.

### Como ayuda Ethoz
- Modulo de Libro de Clases Digital nativo, disenado para cumplir los requisitos de la Circular N°30.
- Registros inmutables con timestamp y firma digital del docente.
- Sincronizacion con SIGE via API.
- Acceso diferenciado por rol con audit log de cada consulta.

---

## 4. Ley de Violencia Escolar (Ley 20.536) y Ley Aula Segura (Ley 21.128)

### Ley 20.536 — Violencia Escolar (2011, actualizada)
**Que exige**: Establece la obligacion de todos los establecimientos educacionales de contar con protocolos de convivencia escolar, un encargado de convivencia, y mecanismos de denuncia y seguimiento de situaciones de violencia o acoso.

**Implicancias**: Cada colegio debe tener un Reglamento Interno de Convivencia Escolar (RICE) actualizado y un protocolo documentado de actuacion ante denuncias. Sin estos documentos, el colegio no cumple la ley y queda expuesto ante la Superintendencia.

**Como ayuda Ethoz**: Registro digital de todas las situaciones de convivencia, con estados de seguimiento, responsables asignados y fechas de cierre. Genera reportes auditables para la Superintendencia.

### Ley 21.128 — Aula Segura (2019)
**Que exige**: Faculta a los directores para expulsar o cancelar la matricula de estudiantes que incurran en conductas graves que afecten la convivencia escolar o pongan en riesgo la seguridad de la comunidad. Establece un procedimiento con plazos y etapas definidas.

**Implicancias**: El proceso de expulsion debe estar documentado paso a paso, con fechas, notificaciones y evidencias. Un proceso mal documentado puede ser revertido legalmente por el apoderado, generando responsabilidad para el directivo.

**Como ayuda Ethoz**: Flujo digital de protocolo disciplinario con estados, notificaciones automaticas a partes involucradas y registro de evidencias adjuntas. Todo el proceso queda trazable y auditable.

---

## 5. Ley TEA (Ley 21.545) y Decretos 83 y 170

### Ley 21.545 — Ley TEA (2023)
**Que es**: Ley que establece medidas de inclusion y no discriminacion para personas con Trastorno del Espectro Autista (TEA) en el sistema educativo y otros ambitos de la vida publica.

**Que exige**: Adecuaciones curriculares y metodologicas para estudiantes TEA, registro de medidas implementadas y capacitacion de equipos docentes.

**Implicancias**: Los colegios deben documentar las medidas adoptadas para cada estudiante TEA. Esta documentacion es parte del expediente del estudiante y puede ser requerida por la Superintendencia o por las familias.

### Decreto 83 (2015)
**Que es**: Decreto que establece criterios y orientaciones de adecuacion curricular para estudiantes con necesidades educativas especiales que participan en el proceso de integracion educativa.

**Que exige**: Documentar las adecuaciones curriculares aplicadas a cada estudiante con NEE, con fundamento en su evaluacion y en el PACI (Plan de Adecuacion Curricular Individual).

### Decreto 170 (2010)
**Que es**: Fija requisitos, plazos y procedimientos para el diagnostico y evaluacion de estudiantes con necesidades educativas especiales que se integran al sistema de subvencion de Educacion Especial.

**Que exige**: Evaluacion diagnostica por profesionales habilitados, elaboracion de FUDEI (Ficha Unica de Derivacion y Evaluacion Integral), plan de trabajo individual y reportes periodicos al MINEDUC para acceder a la subvencion PIE.

**Implicancias**: Si el colegio no puede presentar documentacion completa y actualizada de cada estudiante PIE, pierde el derecho a la subvencion adicional. El monto de esta subvencion puede ser significativo para el presupuesto del establecimiento.

**Como ayuda Ethoz**: Modulo PIE nativo con gestion de FUDEI, PACI y seguimiento de estudiantes con NEE. Datos clinicos bajo nivel de privacidad "privado" (Art. 16 bis Ley 21.719). Acceso restringido al profesional a cargo y al sostenedor con log de cada acceso. Alertas de vencimiento de evaluaciones y renovaciones de diagnostico.

---

## Resumen de urgencia para sostenedores

| Ley/Norma | Vigencia | Riesgo de incumplimiento | Prioridad |
|---|---|---|---|
| Ley 21.719 (Datos) | Diciembre 2026 | Multas hasta 20.000 UTM | CRITICA |
| Circular N°30 (Libro Digital) | Vigente | Invalidez de registros, sanciones | ALTA |
| Ley 21.663 (Ciberseguridad) | Vigente | Sanciones, reputacion | ALTA |
| Ley 20.536 (Convivencia) | Vigente | Sanciones Superintendencia | ALTA |
| Ley 21.128 (Aula Segura) | Vigente | Revocacion de medidas disciplinarias | MEDIA-ALTA |
| Decreto 170 (PIE) | Vigente | Perdida de subvencion PIE | ALTA |
| Ley 21.545 (TEA) | Vigente | Sanciones, demandas | MEDIA |

---

*Ultima revision: abril 2026*
