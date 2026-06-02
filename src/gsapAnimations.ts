type GSAPTarget = string | Element | Element[] | NodeListOf<Element> | Record<string, number>;
type GSAPVars = Record<string, unknown>;

interface GSAPAnimation {
  kill: () => void;
}

interface GSAPCore {
  from: (target: GSAPTarget, vars: GSAPVars) => GSAPAnimation;
  to: (target: GSAPTarget, vars: GSAPVars) => GSAPAnimation;
  set: (target: GSAPTarget, vars: GSAPVars) => void;
  registerPlugin: (...plugins: unknown[]) => void;
  utils: {
    toArray: <T extends Element = Element>(target: string) => T[];
  };
}

interface ScrollTriggerPlugin {
  refresh?: () => void;
}

declare global {
  interface Window {
    gsap?: GSAPCore;
    ScrollTrigger?: ScrollTriggerPlugin;
  }
}

const formatCounterValue = (value: number, suffix: string) => {
  if (suffix.includes('K')) return Math.round(value).toString();
  return Math.round(value).toLocaleString('en-IN');
};

const setCountersToFinalValues = () => {
  document.querySelectorAll<HTMLElement>('.stat-counter').forEach((counter) => {
    const target = Number(counter.dataset.counterTarget ?? 0);
    const suffix = counter.dataset.counterSuffix ?? '';
    counter.textContent = `${formatCounterValue(target, suffix)}${suffix}`;
  });
};

export const initGsapAnimations = () => {
  const gsap = window.gsap;
  const scrollTrigger = window.ScrollTrigger;
  const animations: GSAPAnimation[] = [];
  const timers: number[] = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!gsap || prefersReducedMotion) {
    setCountersToFinalValues();
    return () => undefined;
  }

  if (scrollTrigger) {
    gsap.registerPlugin(scrollTrigger);
  }

  animations.push(
    gsap.from('.navbar', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    gsap.from('.hero-heading-word', {
      y: 40,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      delay: 0.12,
      ease: 'power3.out',
    }),
    gsap.from('.hero-subheadline', {
      y: 28,
      opacity: 0,
      duration: 0.65,
      delay: 0.3,
      ease: 'power3.out',
    }),
    gsap.from('.hero-cta', {
      scale: 0.85,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      delay: 0.45,
      ease: 'bounce.out',
    }),
    gsap.from('.hero-showcase', {
      x: 90,
      opacity: 0,
      duration: 0.95,
      delay: 0.28,
      ease: 'power3.out',
    }),
    gsap.from('.hero-showcase-card', {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      delay: 0.7,
      ease: 'power3.out',
    }),
  );

  if (scrollTrigger) {
    gsap.utils.toArray<HTMLElement>('main section h2:not(.no-scroll-reveal)').forEach((heading) => {
      animations.push(
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: 'top 82%',
            once: true,
          },
          y: 24,
          duration: 0.55,
          ease: 'power3.out',
        }),
      );
    });

    let productCardsAnimated = false;

    const animateProductCards = () => {
      const cards = gsap.utils.toArray<HTMLElement>('.gallery-product-card');
      if (cards.length === 0 || productCardsAnimated) return;

      productCardsAnimated = true;

      animations.push(
        gsap.from(cards, {
          scrollTrigger: {
            trigger: '.product-gallery-grid',
            start: 'top 78%',
            once: true,
          },
          y: 22,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
        }),
      );

      scrollTrigger.refresh?.();
    };

    animateProductCards();
    timers.push(window.setTimeout(animateProductCards, 900));

    gsap.utils.toArray<HTMLElement>('.stat-counter').forEach((counter) => {
      const target = Number(counter.dataset.counterTarget ?? 0);
      const suffix = counter.dataset.counterSuffix ?? '';
      const state = { value: 0 };

      counter.textContent = '0';

      animations.push(
        gsap.to(state, {
          scrollTrigger: {
            trigger: counter.closest('.stats-counter-section') ?? counter,
            start: 'top 78%',
            once: true,
          },
          value: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            counter.textContent = `${formatCounterValue(state.value, suffix)}${suffix}`;
          },
          onComplete: () => {
            counter.textContent = `${formatCounterValue(target, suffix)}${suffix}`;
          },
        }),
      );
    });

    timers.push(window.setTimeout(() => scrollTrigger.refresh?.(), 1000));
  }

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    animations.forEach((animation) => animation.kill());
    gsap.set(
      [
        '.navbar',
        '.hero-heading-word',
        '.hero-subheadline',
        '.hero-cta',
        '.hero-showcase',
        '.hero-showcase-card',
        'main section h2:not(.no-scroll-reveal)',
        '.gallery-product-card',
      ].join(', '),
      { clearProps: 'opacity,transform' },
    );
  };
};
