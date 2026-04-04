import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'control-acceso-roles-seguridad-escolar',
	title: 'Por qué cada cargo en tu colegio debe ver solo lo que necesita',
	description:
		'El control de acceso basado en roles (RBAC) no es un concepto de TI: es un requisito de la Ley 21.719 y una decisión de gestión que protege a los alumnos, al personal y al establecimiento. Guía práctica para directivos escolares.',
	date: '2026-03-15',
	author: 'Ignacio Araya',
	readTime: '5 min',
	tags: ['Control de Acceso', 'RBAC', 'Seguridad'],
	coverImage: '/images/blog/control-acceso-roles-seguridad-escolar.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Cada cargo en un colegio necesita ver información diferente. El portero solo necesita foto, nombre y alertas de retiro. El director necesita visión completa. Sin control de acceso por roles, cualquier persona con acceso al sistema ve todo — violando el principio de minimización de la Ley 21.719.</p>
</div>
<h2>El problema que nadie nombra pero todos experimentan</h2>
<p>En la mayoría de los colegios chilenos, cuando alguien necesita acceso a la plataforma de gestión escolar, se le crea una cuenta con permisos amplios "para que pueda trabajar sin problemas". El resultado es predecible: auxiliares de servicio que pueden ver diagnósticos psicológicos, profesores que acceden a fichas socioeconómicas de apoderados, administrativos que pueden modificar calificaciones. Nadie lo hace con mala intención. Pero el daño —legal, reputacional, humano— es el mismo.</p>
<p>El <strong>Control de Acceso Basado en Roles</strong> (RBAC, por su sigla en inglés) es la respuesta estructural a este problema. Y bajo la Ley 21.719, ya no es una buena práctica opcional: es un requisito legal derivado del principio de minimización de datos.</p>

<h2>Qué significa RBAC en términos simples</h2>
<p>RBAC es el principio de que cada persona en el sistema accede exclusivamente a la información que necesita para cumplir su función, y nada más. No es una configuración complicada: es una decisión de diseño. En lugar de asignar permisos a cada usuario individualmente —lo que genera inconsistencias y es imposible de auditar—, se definen roles con permisos específicos y cada persona recibe el rol que corresponde a su cargo.</p>
<p>La pregunta que guía el diseño de cada rol es simple: <em>¿qué información necesita esta persona para hacer su trabajo correctamente?</em> Todo lo que no sea necesario para esa respuesta, no debería estar disponible.</p>

<h2>Los 6 roles clave en un establecimiento escolar</h2>
<p>El modelo de roles para un colegio chileno bien implementado distingue al menos seis perfiles con permisos diferenciados:</p>
<table>
  <thead>
    <tr>
      <th>Rol</th>
      <th>Accede a</th>
      <th>No accede a</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Administrador del sistema</strong></td>
      <td>Configuración técnica, audit log, gestión de usuarios</td>
      <td>Contenido de datos personales de alumnos</td>
    </tr>
    <tr>
      <td><strong>Director</strong></td>
      <td>Indicadores agregados, asistencia global, informes de gestión</td>
      <td>Detalle de fichas individuales, datos clínicos</td>
    </tr>
    <tr>
      <td><strong>Inspector General</strong></td>
      <td>Asistencia por curso, registro de atrasos, historial disciplinario</td>
      <td>Calificaciones, datos socioeconómicos, fichas de salud</td>
    </tr>
    <tr>
      <td><strong>Docente</strong></td>
      <td>Libro de clases de sus cursos, calificaciones de sus asignaturas, alertas de emergencia de sus alumnos</td>
      <td>Datos de cursos que no dicta, informes psicológicos, fichas de otros docentes</td>
    </tr>
    <tr>
      <td><strong>Orientador / Psicólogo</strong></td>
      <td>Fichas de derivación, alertas de salud mental, historial de intervenciones</td>
      <td>Calificaciones completas, datos disciplinarios sin relevancia clínica</td>
    </tr>
    <tr>
      <td><strong>Portero / Auxiliar de acceso</strong></td>
      <td>Foto del alumno, nombre completo, alertas críticas de seguridad</td>
      <td>Todo lo demás</td>
    </tr>
  </tbody>
</table>

<figure>
  <img src="/images/blog/inline-rbac-roles-hierarchy.png" alt="Diagrama de jerarquía de roles: cada nivel del establecimiento accede solo a los datos necesarios para su función" />
  <figcaption>Jerarquía de acceso: cada rol ve exclusivamente la información necesaria para su función</figcaption>
</figure>

<h2>El portero: el caso más ilustrativo del principio</h2>
<p>El rol del portero o auxiliar de acceso es el ejemplo más claro de por qué RBAC importa. Esta persona necesita saber tres cosas: que el alumno que está ingresando pertenece al establecimiento, cuál es su cara para verificar la identidad, y si hay alguna alerta crítica activa —por ejemplo, una restricción de salida o una alerta de custodia en disputa judicial.</p>
<p>No necesita saber las calificaciones del alumno. No necesita saber si tiene un diagnóstico de salud mental. No necesita ver el historial disciplinario ni el informe del psicólogo. Si el sistema le muestra esa información, no es porque sea útil para su función: es porque el sistema fue mal configurado.</p>
<p>Un portero con acceso excesivo representa un riesgo concreto. Si ese funcionario comenta inadvertidamente —o deliberadamente— información sobre la situación académica o de salud de un alumno a personas no autorizadas, el colegio es responsable de esa filtración bajo la Ley 21.719. La multa no se atenúa porque el acceso fue accidental.</p>

<h2>Escenarios reales donde la falta de RBAC causó problemas</h2>
<p>Los siguientes escenarios son representativos de situaciones que ocurren en establecimientos sin control de acceso adecuado:</p>
<ul>
  <li>Un auxiliar administrativo con acceso al sistema completo descarga la base de datos de alumnos para compartirla con una empresa de seguros de salud sin autorización. El colegio no tiene forma de saber qué información se extrajo ni cuándo, porque no hay audit log.</li>
  <li>Un docente accede al informe psicológico de un alumno de otro curso, lo comenta en sala de profesores y el apoderado se entera. El colegio no puede demostrar que el acceso fue no autorizado porque el docente tenía permisos sobre toda la plataforma.</li>
  <li>Durante un proceso de custodia judicial, el padre sin custodia llega al colegio y el portero —que tiene acceso al sistema general— le entrega información sobre los horarios de salida del alumno. El juzgado de familia determina que el colegio no implementó los controles adecuados.</li>
</ul>
<p>En los tres casos, el problema raíz es el mismo: personas con acceso a información que no necesitaban para su función.</p>

<h2>Row-Level Security: el siguiente nivel de control</h2>
<p>RBAC por roles es el primer nivel de control. Para colegios con múltiples sedes o que operan como red de establecimientos bajo un mismo sostenedor, el nivel de aislamiento requerido es más granular: <strong>Row-Level Security</strong> (RLS).</p>
<p>RLS es el mecanismo técnico que garantiza que un usuario —aunque tenga el mismo rol que otro en un establecimiento diferente— solo puede ver los registros que le corresponden. Un inspector del Colegio A no puede ver la asistencia del Colegio B, aunque ambos operen en la misma plataforma y el inspector del Colegio B tenga exactamente los mismos permisos de rol.</p>
<p>En el contexto de la Ley 21.719, RLS es lo que hace posible el cumplimiento en arquitecturas <em>multi-tenant</em> —sistemas compartidos entre múltiples establecimientos. Sin RLS, el aislamiento de datos entre sedes es una promesa sin respaldo técnico. Con RLS, es una garantía estructural que puede demostrarse ante la Agencia de Protección de Datos.</p>

<h2>La conexión con la Ley 21.719: minimización de datos</h2>
<p>El principio de minimización de datos del artículo 3° de la Ley 21.719 establece que los datos personales deben ser tratados solo en la medida necesaria para la finalidad que justifica su recolección. RBAC es la implementación técnica de ese principio: cada rol accede solo a los datos que necesita para cumplir la finalidad de su función.</p>
<p>La Agencia de Protección de Datos, en una fiscalización, puede solicitar evidencia de que el establecimiento ha implementado controles de acceso adecuados. Un sistema sin RBAC no puede demostrar ese cumplimiento. Un sistema con RBAC bien configurado puede exportar el mapa completo de permisos por rol, el historial de accesos por usuario y los cambios de configuración realizados: todo el audit log que la Agencia necesita ver.</p>
<p>Para entender cómo este control de acceso se relaciona con el manejo de datos médicos específicamente, lea <a href="/blog/privacidad-por-diseno-art-16-bis">Art. 16 bis: Cómo manejar datos médicos de alumnos sin violar la ley</a>.</p>

<h2>Cómo implementar RBAC en su establecimiento</h2>
<p>El proceso de implementación no requiere expertise técnico del equipo directivo. Requiere tres decisiones de gestión:</p>
<ul>
  <li><strong>Definir los roles:</strong> mapear cada cargo del establecimiento y determinar qué información necesita para cumplir su función. Este ejercicio lo hace el equipo directivo, no el equipo de TI.</li>
  <li><strong>Exigir el soporte técnico:</strong> asegurarse de que la plataforma de gestión escolar que usa el establecimiento soporta RBAC granular y RLS. Si no lo soporta, es un pasivo regulatorio que debe resolverse antes de diciembre de 2026.</li>
  <li><strong>Auditar periódicamente:</strong> revisar cada semestre que los roles asignados corresponden a las funciones actuales. Las personas cambian de cargo, se contratan nuevos funcionarios, se modifican responsabilidades. El mapa de roles debe reflejar la realidad operacional.</li>
</ul>

<h2>Conclusión</h2>
<p>El control de acceso basado en roles no es una configuración técnica que delegar al encargado de sistemas. Es una decisión de gestión con consecuencias legales, reputacionales y humanas concretas. Un colegio que garantiza que cada persona ve solo lo que necesita para hacer su trabajo protege a sus alumnos, protege a su personal de usos inadvertidos de información, y protege al establecimiento de sanciones bajo la Ley 21.719. El costo de implementarlo correctamente desde el principio es una fracción del costo de remediar una brecha de acceso. Para entender el régimen completo de cumplimiento, revise <a href="/blog/ley-21719-que-deben-saber-los-colegios">Ley 21.719: Lo que todo colegio debe saber antes de diciembre 2026</a>.</p>
`
};
