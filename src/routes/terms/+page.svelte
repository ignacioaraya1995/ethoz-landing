<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
  <title>Terms of Service — Ethoz</title>
  <meta name="description" content="Términos de servicio de Ethoz. Condiciones de uso de la plataforma." />
  <meta property="og:url" content="https://ethoz.cl/terms" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Terms of Service — Ethoz" />
  <meta property="og:description" content="Términos de servicio de Ethoz. Condiciones de uso de la plataforma." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Terms of Service — Ethoz" />
  <meta name="twitter:description" content="Términos de servicio de Ethoz. Condiciones de uso de la plataforma." />
  <link rel="canonical" href="https://ethoz.cl/terms" />
</svelte:head>

<NavBar />

<main class="mx-auto max-w-3xl px-4 pt-16 py-16 sm:px-6 lg:px-8">

  <h1 class="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>

  <p class="mt-4 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
    These terms are a draft placeholder. The final terms will be published before launch.
  </p>

  <div class="prose prose-sm mt-8 text-foreground/80">
    <p>
      By using Ethoz you agree to these terms. Please read them carefully before using the
      platform.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Use of the service</h2>
    <p>
      Ethoz is a compliance and management platform for educational institutions. Access is
      granted to authorised school administrators only. You are responsible for maintaining
      the confidentiality of your credentials.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Intellectual property</h2>
    <p>
      All content, trademarks, and software within Ethoz remain the property of Ethoz and
      may not be reproduced without prior written consent.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Limitation of liability</h2>
    <p>
      Ethoz is provided "as is" during the beta period. We are not liable for any indirect
      or consequential damages arising from the use of the service.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Contact</h2>
    <p>
      For questions about these terms, email <a href="mailto:legal@ethoz.io" class="underline">legal@ethoz.io</a>.
    </p>
  </div>
  <Footer />
</main>
