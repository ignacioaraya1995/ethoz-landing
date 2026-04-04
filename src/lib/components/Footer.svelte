<script lang="ts">
  import { t } from '$lib/i18n/index.svelte';

  let { mode = 'page' }: { mode?: 'landing' | 'page' } = $props();
</script>

<footer class="border-t border-border bg-secondary py-8">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid gap-8 sm:grid-cols-2">

      <!-- Brand column -->
      <div>
        <a href="/" class="text-xl font-bold tracking-tight text-foreground">Ethoz</a>
        <p class="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {t('footer.tagline')}
        </p>
      </div>

      <!-- Links: Producto + Legal side by side -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Producto -->
        <div>
          <h4 class="text-sm font-semibold text-foreground">Producto</h4>
          <ul class="mt-3 flex flex-col gap-2">
            <li>
              <a href="/#features" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.features')}
              </a>
            </li>
            <li>
              <a href="/pricing" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.pricing')}
              </a>
            </li>
            <li>
              <a href="/compliance" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.compliance')}
              </a>
            </li>
            <li>
              <a href="/demo" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.cta')}
              </a>
            </li>
            <li>
              <a href="/blog" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-sm font-semibold text-foreground">{t('footer.legal')}</h4>
          <ul class="mt-3 flex flex-col gap-2">
            <li>
              <a href="/privacy" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.privacy')}
              </a>
            </li>
            <li>
              <a href="/terms" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.terms')}
              </a>
            </li>
            <li>
              <a href="/about" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.about')}
              </a>
            </li>
            <li>
              <a href="/contact" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t('footer.contact')}
              </a>
            </li>
            <li>
              <a href="/suggestions" class="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Sugerencias
              </a>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
      <p class="text-xs text-muted-foreground/60">{t('footer.rights')}</p>
      <p class="text-xs text-muted-foreground/60">{t('footer.tagline')}</p>
    </div>
  </div>
</footer>
