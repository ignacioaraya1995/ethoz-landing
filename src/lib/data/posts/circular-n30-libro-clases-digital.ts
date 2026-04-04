import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'circular-n30-libro-clases-digital',
	title: 'Circular N°30 y el libro de clases digital: Lo que cambia para tu colegio',
	description:
		'La Circular N°30 de la Superintendencia de Educación formaliza la transición al libro de clases digital. Integridad de datos, trazabilidad, verificación con Clave Única y sincronía con la Ley 21.719: lo que su colegio necesita saber antes de implementar.',
	date: '2026-01-05',
	author: 'Ignacio Araya',
	readTime: '6 min',
	tags: ['Circular N°30', 'Libro de Clases', 'Digitalización'],
	coverImage: '/images/blog/circular-n30-libro-clases-digital.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">La Circular N°30 de la Superintendencia exige que el libro de clases digital garantice integridad, trazabilidad y autenticación vinculada a Clave Única. Digitalizar no es solo escanear — requiere audit log, control de acceso y cumplimiento cruzado con la Ley 21.719.</p>
</div>
<h2>De la carpeta física a la responsabilidad digital</h2>
<p>Durante décadas, el libro de clases fue un objeto físico con una lógica simple: papel, firma y sello. La Circular N°30 de la Superintendencia de Educación cambia esa lógica de forma estructural. No se trata de escanear el libro existente ni de guardar un PDF en una carpeta compartida. La circular establece requisitos técnicos precisos sobre integridad, trazabilidad y autenticación que transforman la forma en que los establecimientos deben gestionar la información pedagógica y de asistencia.</p>
<p>Los colegios que implementen un libro de clases digital sin considerar estos requisitos quedan expuestos a observaciones durante visitas de la Superintendencia y, en caso de controversia legal —reclamo de apoderado, accidente escolar, conflicto disciplinario—, a la incapacidad de demostrar qué ocurrió, cuándo y quién lo registró.</p>

<h2>Qué exige la Circular N°30 en términos concretos</h2>
<p>La circular no prescribe una plataforma específica, pero sí define los estándares que cualquier solución debe cumplir. Los requisitos centrales son cuatro:</p>
<ul>
  <li><strong>Integridad de datos:</strong> el sistema debe garantizar que los registros no puedan ser modificados retroactivamente sin dejar traza. Un registro de asistencia marcado el lunes no puede desaparecer el martes sin que esa eliminación quede documentada.</li>
  <li><strong>Trazabilidad completa:</strong> cada acción sobre el libro —creación de registro, modificación, eliminación, consulta— debe quedar asociada a un usuario identificado, con marca de tiempo exacta. No basta saber que alguien cambió algo: el sistema debe registrar quién, cuándo y desde qué dispositivo.</li>
  <li><strong>Autenticación robusta:</strong> la circular exige mecanismos de verificación de identidad para los usuarios que registran información. La integración con <strong>Clave Única</strong> del Estado de Chile es el estándar de referencia, porque vincula la acción al RUT del docente de forma auditable ante cualquier ente fiscalizador.</li>
  <li><strong>Disponibilidad y respaldo:</strong> los registros deben estar disponibles para consulta por parte de la Superintendencia en el momento que se requiera, con respaldos que garanticen la continuidad ante fallas técnicas.</li>
</ul>

<h2>Por qué la trazabilidad no es un detalle técnico</h2>
<p>En la práctica fiscalizadora, la Superintendencia de Educación no solo verifica que los datos existan: verifica que sean confiables. Un libro de clases con registros de asistencia perfectos pero sin historial de modificaciones genera la pregunta obvia: ¿fueron ingresados en tiempo real o reconstruidos después? Sin trazabilidad, esa pregunta no tiene respuesta verificable.</p>
<p>Los escenarios donde la trazabilidad se vuelve crítica son concretos:</p>
<ul>
  <li>Un accidente en horario escolar: se debe poder demostrar que el alumno estaba presente y que el docente registró asistencia al inicio de la clase.</li>
  <li>Un reclamo por evaluación: el sistema debe mostrar cuándo se ingresó la nota, si fue modificada y por quién.</li>
  <li>Una denuncia por maltrato: los registros de comportamiento y derivaciones deben ser inmutables desde el momento en que se crearon.</li>
</ul>
<p>En todos estos casos, un audit log completo no es un beneficio adicional: es la diferencia entre poder acreditar los hechos o no poder hacerlo.</p>

<h2>La intersección con la Ley 21.719</h2>
<p>El libro de clases digital no opera en un vacío regulatorio. Cada registro que contiene —asistencia, calificaciones, observaciones de conducta— es un dato personal protegido bajo la <a href="/blog/ley-21719-que-deben-saber-los-colegios">Ley 21.719</a>. Esto significa que el sistema que soporta el libro de clases digital debe cumplir simultáneamente con los requisitos de la Circular N°30 <em>y</em> con los estándares de protección de datos de la ley.</p>
<p>Las implicancias prácticas de esta intersección incluyen:</p>
<ul>
  <li><strong>Control de acceso por roles:</strong> un docente debe poder ver su propio libro de clases, no el de sus colegas. Un inspector puede ver asistencia global, pero no informes psicológicos. Sin esta granularidad, el sistema viola el principio de minimización de datos de la Ley 21.719.</li>
  <li><strong>Consentimiento para datos derivados:</strong> si el sistema genera informes analíticos a partir del libro de clases —patrones de asistencia, predicción de deserción—, esos usos derivados requieren base de legitimación explícita.</li>
  <li><strong>Derecho de acceso de apoderados:</strong> bajo el artículo 11 de la Ley 21.719, un apoderado puede solicitar todos los registros del libro de clases que corresponden a su hijo. El sistema debe poder exportar esa información en formato legible dentro de 30 días hábiles.</li>
</ul>

<h2>Verificación de identidad y Clave Única: el estándar de referencia</h2>
<p>La autenticación con Clave Única del Estado no es solo una conveniencia técnica. Es un mecanismo de verificación de identidad que vincula cada acción registrada en el sistema al RUT del funcionario que la ejecutó, de forma que puede ser corroborada por organismos públicos. Para la Superintendencia, esto equivale a una firma digital con valor probatorio.</p>
<p>Los sistemas que usan solo usuario y contraseña internos no ofrecen esta garantía. Si un docente comparte su contraseña —práctica más común de lo que se admite en los colegios—, la trazabilidad colapsa porque ya no es posible determinar quién actuó realmente. La integración con Clave Única elimina este problema estructuralmente, porque la autenticación ocurre fuera del sistema del colegio y no puede ser compartida.</p>

<h2>Lo que un libro de clases digital no es</h2>
<p>Vale la pena ser preciso sobre los errores de implementación más frecuentes que observamos en establecimientos que creen haber digitalizado su libro de clases:</p>
<ul>
  <li>Un formulario de Google Sheets con columnas para asistencia no es un libro de clases digital. No tiene trazabilidad, no tiene control de acceso granular y cualquier usuario con permiso puede modificar retroactivamente cualquier celda sin dejar rastro.</li>
  <li>Un PDF firmado digitalmente y guardado en el servidor del colegio no es un libro de clases digital. Es un documento estático que no permite consulta dinámica ni genera audit log.</li>
  <li>Un sistema de gestión escolar que tiene módulo de asistencia pero no registra quién modificó cada entrada ni cuándo no cumple los requisitos de la Circular N°30.</li>
</ul>

<h2>Qué debe buscar en una solución de libro de clases digital</h2>
<p>Al evaluar plataformas, los criterios técnicos mínimos que su establecimiento debe exigir son los siguientes:</p>
<table>
  <thead>
    <tr>
      <th>Requisito</th>
      <th>Por qué importa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Audit log inmutable por registro</td>
      <td>Trazabilidad exigida por Circular N°30</td>
    </tr>
    <tr>
      <td>Autenticación con Clave Única</td>
      <td>Verificación de identidad con valor probatorio</td>
    </tr>
    <tr>
      <td>Control de acceso por rol y por curso</td>
      <td>Minimización de datos bajo Ley 21.719</td>
    </tr>
    <tr>
      <td>Exportación estructurada de datos por alumno</td>
      <td>Derecho de acceso ARCO+P en 30 días hábiles</td>
    </tr>
    <tr>
      <td>Alertas ante acceso inusual o masivo</td>
      <td>Detección temprana de brechas de seguridad</td>
    </tr>
    <tr>
      <td>Respaldo automático con SLA definido</td>
      <td>Disponibilidad garantizada para fiscalización</td>
    </tr>
  </tbody>
</table>

<h2>Preparar al equipo: el componente que más se subestima</h2>
<p>La tecnología correcta implementada sin capacitación adecuada falla igual que la tecnología incorrecta. Los docentes que registran en el libro de clases digital necesitan entender que sus acciones quedan auditadas, que las modificaciones tardías son visibles y que la autenticación con Clave Única vincula su identidad a cada registro de forma permanente.</p>
<p>Este cambio cultural —del papel que se puede borrar al sistema que recuerda todo— requiere formación específica y protocolos claros. Qué hacer si se cometió un error de registro, cómo solicitar corrección formal, quién tiene autoridad para validar modificaciones: estos procedimientos deben existir antes de activar el sistema.</p>

<h2>Conclusión</h2>
<p>La Circular N°30 formaliza una transición que era inevitable, pero sus exigencias van mucho más allá de cambiar el soporte del papel al digital. Integridad, trazabilidad, autenticación verificable y cumplimiento simultáneo con la Ley 21.719 definen un estándar técnico que solo se puede cumplir con plataformas diseñadas específicamente para el contexto escolar chileno. Los establecimientos que aborden esta transición con la misma rigurosidad con que gestionan otras decisiones de infraestructura estarán en posición de superar cualquier fiscalización y, más importante, de proteger los datos de sus estudiantes con el nivel de cuidado que la ley exige. Para entender las consecuencias de no cumplir, revise <a href="/blog/multas-proteccion-datos-sostenedores">la guía de multas para sostenedores bajo la Ley 21.719</a>.</p>
`
};
