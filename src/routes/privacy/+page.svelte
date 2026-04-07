<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
  <title>Política de Privacidad — Ethoz</title>
  <meta name="description" content="Política de privacidad de Ethoz. Información sobre el tratamiento de datos personales conforme a la Ley 21.719." />
  <meta property="og:url" content="https://ethoz.cl/privacy" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Política de Privacidad — Ethoz" />
  <meta property="og:description" content="Política de privacidad de Ethoz. Información sobre el tratamiento de datos personales conforme a la Ley 21.719." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Política de Privacidad — Ethoz" />
  <meta name="twitter:description" content="Política de privacidad de Ethoz. Información sobre el tratamiento de datos personales conforme a la Ley 21.719." />
  <link rel="canonical" href="https://ethoz.cl/privacy" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Política de Privacidad"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />
  <div class="mx-auto flex-1 max-w-3xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20 sm:px-6 lg:px-8">

    <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Política de Privacidad</h1>
    <p class="mt-2 text-sm text-muted-foreground">Última actualización: abril 2026</p>

    <div class="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">

      <section>
        <h2 class="text-lg font-semibold text-foreground">1. Responsable del tratamiento</h2>
        <p class="mt-2">
          Ethoz SpA, RUT 78.394.522-3, con domicilio en Santiago de Chile, constituida el 6 de abril de 2026, es responsable del tratamiento de los datos personales recopilados a través de la plataforma ethoz.cl y sus servicios asociados.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">2. Datos que recopilamos</h2>
        <p class="mt-2">Recopilamos exclusivamente la información necesaria para prestar nuestro servicio:</p>
        <ul class="mt-3 list-disc space-y-1.5 pl-5">
          <li><strong class="text-foreground">Datos de contacto:</strong> nombre, correo electrónico, teléfono y cargo del usuario administrador.</li>
          <li><strong class="text-foreground">Datos del establecimiento:</strong> nombre, RBD, dirección y matrícula del colegio.</li>
          <li><strong class="text-foreground">Datos de uso:</strong> información técnica sobre cómo se utiliza la plataforma para mejorar el servicio.</li>
        </ul>
        <p class="mt-3">
          Ethoz <strong class="text-foreground">no recopila datos personales de alumnos ni apoderados</strong> a través de este sitio web. Los datos de alumnos son gestionados exclusivamente por el establecimiento educacional dentro de la plataforma, bajo la responsabilidad del colegio como responsable del tratamiento.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">3. Finalidad del tratamiento</h2>
        <p class="mt-2">Sus datos son utilizados para:</p>
        <ul class="mt-3 list-disc space-y-1.5 pl-5">
          <li>Gestionar su cuenta y prestar el servicio contratado.</li>
          <li>Comunicar actualizaciones, novedades y soporte técnico.</li>
          <li>Mejorar la plataforma mediante análisis de uso agregado y anonimizado.</li>
          <li>Cumplir con obligaciones legales y regulatorias.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">4. Base legal</h2>
        <p class="mt-2">
          El tratamiento de sus datos se realiza conforme a la <strong class="text-foreground">Ley 21.719 de Protección de Datos Personales</strong> de Chile, sobre las siguientes bases de legitimación:
        </p>
        <ul class="mt-3 list-disc space-y-1.5 pl-5">
          <li><strong class="text-foreground">Ejecución contractual:</strong> para prestar el servicio acordado.</li>
          <li><strong class="text-foreground">Consentimiento informado:</strong> para comunicaciones comerciales.</li>
          <li><strong class="text-foreground">Interés legítimo:</strong> para mejorar la seguridad y calidad del servicio.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">5. Sus derechos (ARCO+P)</h2>
        <p class="mt-2">
          Conforme a la Ley 21.719, usted tiene derecho a:
        </p>
        <ul class="mt-3 list-disc space-y-1.5 pl-5">
          <li><strong class="text-foreground">Acceso:</strong> conocer qué datos personales tenemos sobre usted.</li>
          <li><strong class="text-foreground">Rectificación:</strong> solicitar la corrección de datos inexactos.</li>
          <li><strong class="text-foreground">Cancelación:</strong> solicitar la eliminación de sus datos.</li>
          <li><strong class="text-foreground">Oposición:</strong> oponerse al tratamiento de sus datos.</li>
          <li><strong class="text-foreground">Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
        </ul>
        <p class="mt-3">
          Para ejercer cualquiera de estos derechos, escriba a <a href="mailto:privacidad@ethoz.cl" class="font-medium text-primary underline underline-offset-2 hover:opacity-80">privacidad@ethoz.cl</a>. Responderemos en un plazo máximo de 15 días hábiles.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">6. Seguridad de los datos</h2>
        <p class="mt-2">
          Implementamos medidas técnicas y organizativas para proteger sus datos, incluyendo cifrado en tránsito y en reposo, control de acceso basado en roles (RBAC), aislamiento de datos por establecimiento (Row-Level Security) y registro de auditoría completo.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">7. Transferencia de datos</h2>
        <p class="mt-2">
          No vendemos, compartimos ni transferimos sus datos personales a terceros con fines comerciales. Los datos pueden ser procesados por proveedores de infraestructura tecnológica que actúan como encargados del tratamiento, sujetos a acuerdos de confidencialidad y protección de datos equivalentes.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">8. Retención de datos</h2>
        <p class="mt-2">
          Conservamos sus datos durante la vigencia de la relación contractual y por el período adicional que exija la legislación aplicable. Una vez finalizada la relación, los datos serán eliminados de forma segura.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">9. Contacto</h2>
        <p class="mt-2">
          Para consultas sobre esta política o el tratamiento de sus datos personales, contacte a nuestro equipo de privacidad en <a href="mailto:privacidad@ethoz.cl" class="font-medium text-primary underline underline-offset-2 hover:opacity-80">privacidad@ethoz.cl</a>.
        </p>
      </section>

    </div>
  </div>
  <Footer />
</main>
