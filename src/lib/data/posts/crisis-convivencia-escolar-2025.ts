import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'crisis-convivencia-escolar-2025',
	title: '11.091 denuncias en 9 meses: La crisis de convivencia escolar que Chile no puede ignorar',
	description:
		'Entre enero y septiembre de 2025, Chile registró 11.091 denuncias por violencia escolar, un aumento del 25% respecto al año anterior. Detrás del número hay un problema de infraestructura de datos: los colegios reaccionan cuando ya es tarde.',
	date: '2026-01-28',
	author: 'Ignacio Araya',
	readTime: '7 min',
	tags: ['Convivencia Escolar', 'Seguridad', 'Datos 2025'],
	coverImage: '/images/blog/crisis-convivencia-escolar-2025.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Entre enero y septiembre de 2025, Chile registró 11.091 denuncias de convivencia escolar — un alza del 25% nacional. Arica (+68%), Atacama (+57%) y Los Lagos (+37%) lideran el aumento. Los sistemas reactivos basados en papel no detectan patrones a tiempo.</p>
</div>
<h2>Los números que definen el problema</h2>
<p>Entre enero y septiembre de 2025, el sistema escolar chileno registró <strong>11.091 denuncias</strong> por violencia y problemas de convivencia. El aumento interanual es del 25% respecto al mismo período de 2024. No se trata de una tendencia lineal ni de un fenómeno acotado a ciertas comunas: afecta a todas las regiones del país, con intensidad diferente pero dirección común.</p>
<p>El desglose regional revela disparidades que merecen atención específica:</p>
<table>
  <thead>
    <tr>
      <th>Región</th>
      <th>Variación interanual</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Arica y Parinacota</td>
      <td>+68%</td>
    </tr>
    <tr>
      <td>Atacama</td>
      <td>+57%</td>
    </tr>
    <tr>
      <td>Los Lagos</td>
      <td>+37%</td>
    </tr>
    <tr>
      <td>Coquimbo</td>
      <td>+35%</td>
    </tr>
  </tbody>
</table>
<p>Las regiones con mayor crecimiento no son necesariamente las de mayor tamaño. Arica y Atacama —con una fracción de la matrícula de la Región Metropolitana— muestran crecimientos que casi duplican el promedio nacional. Eso sugiere que el problema no se explica solo por densidad, sino por factores institucionales y de capacidad de respuesta.</p>

<h2>Qué cuenta como violencia escolar según el MINEDUC</h2>
<p>El Ministerio de Educación define la violencia escolar como "toda acción u omisión constitutiva de agresión u hostigamiento reiterado, realizada fuera o dentro del establecimiento educacional por estudiantes que, en forma individual o colectiva, atenten en contra de otro estudiante, valiéndose para ello de una situación de superioridad o de indefensión del estudiante afectado" (Ley 20.536, Art. 16 B). Esta definición incluye agresiones físicas, verbales, psicológicas y aquellas mediadas por tecnología.</p>
<p>En 2023, la Superintendencia de Educación registró <strong>4.502 reportes de agresión entre estudiantes</strong>, lo que representó la categoría más numerosa de denuncias formales ese año. La proyección para 2025, considerando la tasa de crecimiento observada, sitúa esta cifra en torno a 6.000 casos.</p>

<h2>El caso INBA y lo que revela sobre los sistemas reactivos</h2>
<p>En octubre de 2024, el Instituto Nacional Barros Arana —uno de los establecimientos públicos de mayor tradición en Chile— fue escenario de una explosión de artefacto artesanal en dependencias del colegio. El incidente no fue un evento aislado sin señales previas: hubo indicios en redes sociales y entre el estudiantado días antes. El problema fue que esos indicios no llegaron a quienes podían actuar.</p>
<p>Este es el patrón central de los sistemas reactivos de convivencia escolar: la información existe, pero está fragmentada. Está en el cuaderno del inspector, en el correo del orientador, en la conversación verbal entre profesores en el pasillo. No está consolidada, no es visible para la dirección en tiempo real y no activa protocolos automáticos cuando los patrones se vuelven preocupantes.</p>
<blockquote>
  <p>"Los colegios no tienen un problema de falta de información sobre sus estudiantes. Tienen un problema de información que no está conectada."</p>
</blockquote>

<h2>Por qué los sistemas reactivos fallan de manera predecible</h2>
<p>La convivencia escolar en la mayoría de los establecimientos chilenos opera con una arquitectura de datos construida para registrar, no para detectar. El flujo típico es:</p>
<ul>
  <li>Ocurre un incidente.</li>
  <li>Se registra en el libro de clases o en un formulario en papel.</li>
  <li>El encargado de convivencia toma nota.</li>
  <li>Se cita al apoderado.</li>
  <li>El registro queda archivado.</li>
</ul>
<p>Este flujo tiene tres fallas estructurales. Primero, el <strong>rezago temporal</strong>: entre el incidente y el registro pueden pasar horas o días. Segundo, la <strong>fragmentación</strong>: cada instancia —sala de clases, inspectoría, orientación, dirección— tiene su propio registro, sin integración. Tercero, la <strong>pérdida anual</strong>: al inicio del año escolar, la mayor parte del historial de convivencia del año anterior queda en cuadernos que nadie consulta sistemáticamente.</p>
<p>El problema del "reinicio de marzo" no es solo operacional. Es un problema de seguridad: un estudiante que acumuló 8 incidentes el año anterior llega en marzo como si fuera nuevo, porque el sistema no tiene memoria institucional efectiva. Los problemas de gestión de datos acumulados tienen raíces en las herramientas utilizadas —un fenómeno que se examina en detalle en <a href="/blog/multas-proteccion-datos-sostenedores">Multas de hasta 20.000 UTM: Guía de cumplimiento para sostenedores</a>.</p>

<figure>
  <img src="/images/blog/inline-reactive-vs-preventive.png" alt="Comparación visual: sistema reactivo con registros dispersos versus sistema preventivo con dashboard de alertas tempranas" />
  <figcaption>Sistema reactivo vs. preventivo: la diferencia está en la infraestructura de información</figcaption>
</figure>

<h2>El costo de reaccionar tarde</h2>
<p>Cuando un incidente de violencia grave ocurre en un establecimiento, las consecuencias se distribuyen en varias dimensiones:</p>
<ul>
  <li><strong>Institucional:</strong> la Superintendencia puede iniciar un proceso de fiscalización que requiere presentar toda la documentación de convivencia del período.</li>
  <li><strong>Legal:</strong> si hay víctimas, el establecimiento puede enfrentar demandas de responsabilidad civil extracontractual. La pregunta central será si el colegio tenía información previa que no actuó.</li>
  <li><strong>Reputacional:</strong> en un mercado educacional donde las familias tienen capacidad de cambiar de establecimiento, un incidente grave en redes sociales puede afectar la matrícula del año siguiente.</li>
  <li><strong>Humano:</strong> el costo directo sobre los estudiantes involucrados —víctimas y agresores— en términos de trayectoria educativa y bienestar.</li>
</ul>

<h2>Qué diferencia a los establecimientos que controlan mejor la convivencia</h2>
<p>El análisis de establecimientos con tasas de incidentes significativamente menores al promedio de su comuna revela tres características consistentes:</p>
<ol>
  <li><strong>Registro sistemático y centralizado:</strong> todos los incidentes —incluidos los menores— se registran en una sola plataforma visible para la dirección, no en cuadernos paralelos.</li>
  <li><strong>Seguimiento de patrones:</strong> no tratan cada incidente como aislado. Revisan frecuencias por estudiante, por sala, por hora del día, por tipo de incidente.</li>
  <li><strong>Protocolos diferenciados por severidad:</strong> no todos los incidentes requieren la misma respuesta. Tienen flujos distintos para conflictos menores, agresiones físicas y situaciones que requieren derivación externa.</li>
</ol>
<p>Ninguna de estas características requiere tecnología sofisticada en abstracto. Requieren sistemas que permitan registrar con consistencia, visualizar patrones y mantener el historial entre años.</p>

<h2>El desafío normativo de los datos de convivencia</h2>
<p>Los registros de convivencia escolar son, en su mayoría, datos sensibles bajo la <strong>Ley 21.719</strong>: involucran comportamiento, salud mental, situación familiar y, en muchos casos, datos de salud. Esto tiene dos implicancias prácticas. Primero, el colegio necesita una base de legitimación clara para tratar estos datos. Segundo, si un apoderado ejerce su derecho de acceso (ARCO+P), el establecimiento debe ser capaz de mostrar exactamente qué datos tiene sobre su hijo, con qué finalidad y quién los ha consultado. Los detalles de estas obligaciones se desarrollan en <a href="/blog/ley-21719-que-deben-saber-los-colegios">Ley 21.719: Lo que todo colegio debe saber antes de diciembre 2026</a>.</p>

<h2>Conclusión</h2>
<p>Los 11.091 casos registrados en 2025 no son el problema en sí: son el síntoma visible de un sistema que trata la convivencia escolar como una función administrativa en lugar de una función de seguridad con datos en tiempo real. La diferencia entre un colegio que contiene los problemas y uno que los gestiona de forma reactiva no está en la calidad de sus profesionales —está en la calidad de su infraestructura de información.</p>
<p>Invertir en sistemas que consoliden, persistan y hagan visible la información de convivencia no es un gasto de modernización. Es una decisión de gestión de riesgo con consecuencias legales, reputacionales y humanas directas.</p>
`
};
