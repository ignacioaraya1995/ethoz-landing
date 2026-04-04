<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
  <title>Privacy Policy — Ethoz</title>
  <meta name="description" content="Política de privacidad de Ethoz. Información sobre el tratamiento de datos personales." />
  <meta property="og:url" content="https://ethoz.cl/privacy" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Privacy Policy — Ethoz" />
  <meta property="og:description" content="Política de privacidad de Ethoz. Información sobre el tratamiento de datos personales." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Privacy Policy — Ethoz" />
  <meta name="twitter:description" content="Política de privacidad de Ethoz. Información sobre el tratamiento de datos personales." />
  <link rel="canonical" href="https://ethoz.cl/privacy" />
</svelte:head>

<NavBar />

<main class="mx-auto max-w-3xl px-4 pt-16 py-16 sm:px-6 lg:px-8">

  <h1 class="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>

  <p class="mt-4 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
    This privacy policy is a draft placeholder. The full policy will be published before launch.
  </p>

  <div class="prose prose-sm mt-8 text-foreground/80">
    <p>
      Ethoz is committed to protecting your personal data in accordance with the General Data
      Protection Regulation (GDPR) and applicable Spanish data protection law.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Data we collect</h2>
    <p>
      We collect only the information necessary to provide our service, including school
      administrator contact details and usage data for product improvement.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">How we use your data</h2>
    <p>
      Your data is used solely to operate and improve Ethoz. We do not sell or share your
      personal data with third parties for marketing purposes.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Your rights</h2>
    <p>
      You have the right to access, correct, or delete your personal data at any time. To
      exercise your rights, contact us at privacy@ethoz.io.
    </p>

    <h2 class="mt-8 text-lg font-semibold text-foreground">Contact</h2>
    <p>
      For privacy-related enquiries, email <a href="mailto:privacy@ethoz.io" class="underline">privacy@ethoz.io</a>.
    </p>
  </div>
  <Footer />
</main>
