import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TiktokLiveStats } from '@/components/tiktok-live-stats';
import NotFound from '@/pages/not-found';
import BongoKikoPage from '@/pages/bongo-kiko';
import { ArrowDown, ArrowRight, ArrowUpRight, Bell, BookOpen, Compass, Menu, MoveUpRight, Waves, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [excerptOpen, setExcerptOpen] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const context = gsap.context(() => {
      revealItems.forEach((item) => {
        gsap.fromTo(item, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
          onStart: () => item.classList.add('is-visible'),
        });
      });

      gsap.to('.hero-art', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-scene', start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.causeway-caption', {
        y: -24,
        ease: 'none',
        scrollTrigger: { trigger: '.causeway-scene', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      });
    });

    return () => context.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="grain overflow-hidden bg-[#e9e2d2] text-[#1c302f]">
      <header className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 text-[#f6f0df] md:px-12 md:py-7">
        <a href="#top" aria-label="Ancient Reborn World home" className="group flex items-center gap-3" data-testid="link-home">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#f6f0df]/45 bg-[#1c302f]/25 backdrop-blur-sm transition-transform group-hover:rotate-[-12deg]">
            <Compass size={22} strokeWidth={1.5} />
          </span>
          <span className="leading-[.92]">
            <span className="display block text-[18px] font-bold tracking-[-.06em]">ANCIENT</span>
            <span className="mono mt-1 block text-[8px] tracking-[.2em]">REBORN WORLD</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex lg:gap-9" aria-label="Main navigation">
          <a className="nav-link" href="#world" data-testid="link-world">The world</a>
          <a className="nav-link" href="#aya" data-testid="link-aya">Aya & Tavi</a>
          <a className="nav-link" href="#first-resonance" data-testid="link-resonance">First resonance</a>
          <a className="nav-link" href="#community" data-testid="link-community">Community</a>
          <Link className="nav-link" href="/bongo-kiko" data-testid="link-bongo-kiko">Bongo & Kiko</Link>
        </nav>
        <a href="#first-resonance" className="hidden items-center gap-2 rounded-full border border-[#f6f0df]/60 px-5 py-3 text-[10px] font-extrabold tracking-[.12em] transition-all hover:-translate-y-0.5 hover:bg-[#f6f0df] hover:text-[#1c302f] md:flex" data-testid="link-enter-world">
          ENTER THE STORY <ArrowUpRight size={14} />
        </a>
        <button className="grid h-11 w-11 place-items-center rounded-full border border-white/45 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} data-testid="button-mobile-menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {menuOpen && <nav className="absolute inset-x-4 top-[78px] z-40 rounded-2xl border border-[#d7ccbc] bg-[#f0e8d8] p-5 shadow-xl md:hidden" aria-label="Mobile navigation">
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#world">The world</a>
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#aya">Aya & Tavi</a>
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#first-resonance">First resonance</a>
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#community">Community</a>
        <Link onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="/bongo-kiko" data-testid="link-mobile-bongo-kiko">Bongo & Kiko</Link>
        <a onClick={closeMenu} className="mt-4 inline-flex rounded-full bg-[#c94c32] px-5 py-3 text-xs font-bold text-[#fff6e6]" href="#first-resonance">Enter the story</a>
      </nav>}

      <section id="top" className="hero-scene relative isolate min-h-[730px] overflow-hidden bg-[#183b3b] text-[#fff8e8] md:min-h-[860px]">
        <div className="hero-art absolute inset-[-5%]">
          <img src="/images/namaris-at-dawn.jpg" alt="Aya and Tavi stand on a stone causeway as Namaris rises from the turquoise sea at dawn." className="h-full w-full object-cover object-[42%_center] md:object-center" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,38,39,.72)_0%,rgba(12,38,39,.34)_48%,rgba(12,38,39,.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,31,32,.56),transparent_32%)]" />
        <div className="relative mx-auto flex min-h-[730px] max-w-[1500px] items-center px-5 pb-20 pt-32 md:min-h-[860px] md:px-12 md:pt-36">
          <div className="max-w-[800px]">
            <p className="hero-kicker mono mb-7 flex items-center gap-3 text-[9px] text-[#f2d572] md:text-[10px]"><span className="h-px w-9 bg-[#f2d572]" /> A STORY WORLD BY THE FIRST LIGHT</p>
            <h1 className="hero-title display max-w-[800px] text-[clamp(4.4rem,11.5vw,10.6rem)] font-semibold leading-[.74] tracking-[-.085em]">
              The sea<br />kept the<br /><em className="font-medium text-[#f2d572]">whole city.</em>
            </h1>
            <div className="mt-9 grid max-w-[650px] gap-7 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-[390px] text-[15px] leading-7 text-[#fff8e8]/85 md:text-[17px] md:leading-8">At dawn, Namaris rises from the Veyruun Expanse. One cartographer follows the places still missing. One small bell answers from below.</p>
              <a href="#world" className="inline-flex w-fit items-center gap-3 border-b border-[#f2d572]/70 pb-2 text-[10px] font-extrabold tracking-[.14em] text-[#f2d572] transition-colors hover:border-[#fff8e8] hover:text-[#fff8e8]" data-testid="link-begin">
                FOLLOW THE RESONANCE <ArrowDown size={15} />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-5 right-5 flex items-end justify-between md:bottom-10 md:left-12 md:right-12">
          <span className="mono max-w-[160px] text-[8px] leading-5 text-white/70 md:max-w-none">VEYRUUN EXPANSE · FIRST LIGHT</span>
          <span className="mono hidden text-[8px] text-white/70 md:block">THE MAP IS NOT THE TERRITORY</span>
          <span aria-hidden="true" className="display text-[12px] italic text-white/70">01 / 05</span>
        </div>
      </section>

      <div className="marquee overflow-hidden border-y border-[#1c302f]/30 bg-[#e7c65e] py-3.5 text-[#1c302f]" aria-label="The Long Quiet. Namaris returns. The First Resonance.">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => <div key={copy} className="flex items-center gap-8">
            {['THE LONG QUIET', 'NAMARIS RETURNS', 'THE FIRST RESONANCE', 'A COMPASS TO NOWHERE', 'SOMEWHERE BELOW'].map((item) => <span key={item} className="flex items-center gap-8"><span className="display text-[27px] font-semibold italic md:text-[34px]">{item}</span><span className="text-[#b94c34]"><Bell size={15} strokeWidth={1.5} /></span></span>)}
          </div>)}
        </div>
      </div>

      <section id="world" className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-24 md:grid-cols-[.78fr_1.22fr] md:gap-20 md:px-12 md:py-36">
        <div className="relative md:sticky md:top-16 md:self-start">
          <p className="mono mb-6 text-[9px] text-[#b94c34]">01 / THE WORLD THAT WENT QUIET</p>
          <h2 className="display max-w-[540px] text-[clamp(3.6rem,7.8vw,7rem)] font-semibold leading-[.82]">The world<br />did not end.<br /><em className="font-medium text-[#b94c34]">It went quiet.</em></h2>
          <p className="mt-8 max-w-[405px] text-[14px] leading-7 text-[#53605a] md:text-[15px]">The Long Quiet swallowed the first kingdoms. Namaris sank beneath the Veyruun Expanse, and the old paths disappeared with it. Now, at the edge of morning, stone breaks the water again.</p>
          <a href="#causeway" className="mt-8 inline-flex items-center gap-3 border-b border-[#1c302f]/55 pb-2 text-[10px] font-extrabold tracking-[.14em] transition-colors hover:border-[#b94c34] hover:text-[#b94c34]" data-testid="link-see-namaris">LOOK TOWARD NAMARIS <ArrowRight size={14} /></a>
          <span className="absolute -left-1 top-[500px] hidden -rotate-90 origin-top-left mono text-[8px] tracking-[.22em] text-[#968b74] lg:block">FIELD ACCOUNT · 01</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article data-reveal className="map-lines flex min-h-[275px] flex-col justify-between overflow-hidden rounded-[1.4rem] bg-[#214e4b] p-7 text-[#f2ead6] sm:mt-14 md:min-h-[340px] md:p-9">
            <span className="mono text-[8px] text-[#dec979]">A SEA WITH A MEMORY</span>
            <div>
              <Waves className="mb-5 text-[#dec979]" size={27} strokeWidth={1.3} />
              <h3 className="display text-[2.7rem] font-medium leading-[.92]">Veyruun<br />Expanse</h3>
              <p className="mt-4 max-w-[270px] text-[13px] leading-6 text-[#f2ead6]/75">Bright water over a vanished kingdom. At dawn, its depths begin to give something back.</p>
            </div>
          </article>
          <article data-reveal className="flex min-h-[275px] flex-col justify-between rounded-[1.4rem] bg-[#d58650] p-7 text-[#2e3028] sm:-mt-4 md:min-h-[340px] md:p-9">
            <span className="mono text-[8px]">A NOTE THROUGH STONE</span>
            <div>
              <Bell className="mb-5" size={27} strokeWidth={1.3} />
              <h3 className="display text-[2.7rem] font-medium leading-[.92]">The First<br />Resonance</h3>
              <p className="mt-4 max-w-[265px] text-[13px] leading-6 text-[#2e3028]/75">A buried bell sounds beneath the waves. Tavi's collar bell answers, and the silence has a direction.</p>
            </div>
          </article>
          <a id="causeway" href="#aya" data-reveal className="causeway-scene group relative col-span-1 min-h-[320px] overflow-hidden rounded-[1.4rem] bg-[#254846] sm:col-span-2 md:min-h-[440px]" aria-label="Meet Aya and Tavi at the causeway leading to Namaris">
            <img src="/images/namaris-at-dawn.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="scene-shade absolute inset-0" />
            <div className="causeway-caption absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4 text-[#fff8e8] md:bottom-10 md:left-10">
              <div><span className="mono text-[8px] text-[#f2d572]">CHART 07—A · THE FIRST RETURN</span><p className="display mt-2 text-[2.7rem] font-medium leading-none md:text-[4rem]">Namaris, at dawn.</p><p className="mt-3 max-w-[350px] text-[12px] leading-5 text-white/75">A causeway emerges. At its far end: the city the sea could not keep.</p></div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/55 transition-all group-hover:rotate-45 group-hover:bg-[#f2d572] group-hover:text-[#1c302f]"><MoveUpRight size={18} /></span>
            </div>
            <span className="absolute right-5 top-5 rounded-full bg-[#efe5cd] px-3 py-2 mono text-[8px] text-[#1c302f]">VEYRUUN · DAWN</span>
          </a>
        </div>
      </section>

      <section className="causeway-scene relative min-h-[590px] overflow-hidden bg-[#193d3e] text-[#fff8e8] md:min-h-[730px]">
        <img src="/images/awakening.jpg" alt="A vast city of towers rises from the sea in the light of a golden dawn." className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,45,45,.74)_0%,rgba(16,45,45,.24)_60%,rgba(16,45,45,.05)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,33,34,.47),transparent_48%)]" />
        <div data-reveal className="causeway-caption relative mx-auto flex min-h-[590px] max-w-[1500px] flex-col justify-end px-5 pb-12 md:min-h-[730px] md:px-12 md:pb-16">
          <p className="mono mb-5 text-[9px] text-[#efd36e]">THE SHORELINE IS MOVING</p>
          <h2 className="display max-w-[900px] text-[clamp(3.5rem,8.7vw,8rem)] font-medium leading-[.84]">Not a memory.<br /><em className="text-[#efd36e]">A return.</em></h2>
          <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[410px] text-[14px] leading-7 text-white/80">No one knows why the city is waking now. Aya has learned not to mistake a map for an answer. The next mark is out beyond the waterline.</p>
            <span className="mono text-[8px] text-white/70">THE FIRST LIGHT FINDS WHAT THE SEA HID</span>
          </div>
        </div>
      </section>

      <section id="aya" className="bg-[#d9d0bd] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-12">
          <div data-reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div><p className="mono mb-5 text-[9px] text-[#b94c34]">02 / THE ONES WHO HEAR IT</p><h2 className="display max-w-[800px] text-[clamp(3.5rem,8vw,7.3rem)] font-semibold leading-[.82]">Two travelers.<br />One city<br /><em className="font-medium text-[#b94c34]">waking.</em></h2></div>
            <p className="max-w-[290px] pb-1 text-[13px] leading-6 text-[#53605a]">She follows a compass toward the not-yet-returned. He hears a buried bell through the hush.</p>
          </div>

          <article data-reveal className="relative grid min-h-[590px] overflow-hidden rounded-[1.5rem] bg-[#294c48] text-[#fff8e8] md:min-h-[680px] md:grid-cols-[.92fr_1.08fr]">
            <div className="relative min-h-[420px] overflow-hidden md:min-h-full">
              <img src="/images/character-aya.jpg" alt="Illustrated scene of Aya holding her compass among the remnants of an ancient city, with Tavi beside her." className="absolute inset-0 h-full w-full object-cover object-[51%_center]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,41,39,.35),transparent_50%)] md:bg-[linear-gradient(90deg,transparent_65%,rgba(27,62,59,.76)_100%)]" />
              <span className="absolute left-5 top-5 rounded-full bg-[#f0e6ce] px-3 py-2 mono text-[8px] text-[#1c302f]">FIELD PORTRAIT · AYA VENN</span>
            </div>
            <div className="story-paper relative flex flex-col justify-between px-7 py-9 md:px-12 md:py-12">
              <div className="absolute right-3 top-5 hidden h-40 w-40 rounded-full border border-[#e0ca8f]/25 md:block" />
              <div className="relative">
                <span className="mono text-[8px] text-[#e8cd72]">CARTOGRAPHER OF THE UNRETURNED</span>
                <h3 className="display mt-4 text-[4.4rem] font-medium leading-[.82] tracking-[-.08em] md:text-[6.7rem]">Aya<br /><em>Venn.</em></h3>
                <p className="mt-7 max-w-[460px] text-[14px] leading-7 text-[#f4eedf]/80">Aya makes maps for places that no longer have a name—or a road home. Her inherited brass compass does not settle on north. It leans toward places that have not returned.</p>
                <p className="mt-4 max-w-[450px] text-[13px] leading-6 text-[#f4eedf]/68">When Namaris breaches the morning sea, the needle does not point at the city alone. It asks her to keep going, beyond the certainty of any chart.</p>
              </div>
              <div className="relative mt-10 flex items-end justify-between gap-5 border-t border-[#f4eedf]/20 pt-5">
                <div className="max-w-[64%] md:max-w-none"><span className="mono text-[8px] text-[#e8cd72]">HER UNFINISHED MAP</span><p className="display mt-2 max-w-[330px] text-[1.35rem] leading-tight md:text-[1.6rem]">“A place can be missing<br />and still call you.”</p></div>
                <img src="/images/aya-cutout.png" alt="Transparent character illustration of Aya Venn with her map, compass, and field gear." className="pointer-events-none absolute -bottom-10 right-[-2rem] h-[250px] w-[190px] object-contain object-bottom drop-shadow-[0_14px_20px_rgba(14,30,29,.35)] md:-bottom-12 md:right-0 md:h-[340px] md:w-[260px]" />
                <span className="relative z-10 mb-1 hidden text-[9px] font-bold tracking-[.1em] text-[#e8cd72] sm:block">01 / THE CARTOGRAPHER</span>
              </div>
            </div>
          </article>

          <article data-reveal className="mt-5 grid min-h-[465px] overflow-hidden rounded-[1.5rem] bg-[#e9e1cf] md:min-h-[540px] md:grid-cols-[1fr_1fr]">
            <div className="story-paper relative order-2 flex flex-col justify-between overflow-hidden p-7 md:order-1 md:p-12">
              <span className="mono text-[8px] text-[#b94c34]">MOON-FOX · KEEPER OF THE ANSWERING NOTE</span>
              <div className="relative z-10 pb-40 md:pb-10">
                <h3 className="display mt-5 text-[4.7rem] font-medium leading-[.82] tracking-[-.08em] text-[#1c302f] md:text-[6.5rem]">Tavi.</h3>
                <p className="mt-6 max-w-[410px] text-[14px] leading-7 text-[#53605a]">Tavi is Aya’s moon-fox companion: quick-eared, bright-eyed, and never far from her side. Beneath his collar hangs a bell. At the sound of another, buried under the sea, it answers.</p>
                <p className="mt-4 max-w-[405px] text-[13px] leading-6 text-[#53605a]">He cannot explain the call. He does not need to. In a world where maps end at the water, Tavi hears a way through.</p>
              </div>
              <div className="relative z-10 flex items-center gap-3 border-t border-[#1c302f]/20 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d58650] text-[#1c302f]"><Bell size={16} /></span>
                <span className="mono text-[8px] text-[#53605a]">TWO BELLS · ONE BELOW THE WAVES</span>
              </div>
              <img src="/images/tavi-cutout.png" alt="Transparent character illustration of Tavi, a moon-fox with a bell collar and a star-marked tail." className="pointer-events-none absolute -bottom-2 right-[-.7rem] h-[190px] w-[205px] object-contain object-bottom drop-shadow-[0_12px_14px_rgba(28,48,47,.18)] md:-bottom-10 md:right-5 md:h-[330px] md:w-[350px]" />
            </div>
            <div className="relative order-1 min-h-[300px] overflow-hidden md:order-2 md:min-h-full">
              <img src="/images/namaris-at-dawn.jpg" alt="Aya and Tavi on the stone causeway, looking toward Namaris as sunlight crosses the water." className="absolute inset-0 h-full w-full object-cover object-[16%_center] md:object-[12%_center]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(13,37,37,.35),transparent_60%)]" />
              <span className="absolute bottom-5 right-5 rounded-full border border-white/60 px-3 py-2 mono text-[8px] text-white">ALWAYS WITH AYA</span>
            </div>
          </article>
        </div>
      </section>

      <section id="first-resonance" className="relative bg-[#1c4341] px-5 py-24 text-[#f5efdf] md:py-32">
        <div className="absolute inset-0 map-lines opacity-[.22]" />
        <div className="relative mx-auto max-w-[1300px]">
          <div data-reveal className="grid gap-10 md:grid-cols-[.94fr_1.06fr] md:gap-20">
            <div>
              <p className="mono mb-5 text-[9px] text-[#e8cd72]">03 / THE FIRST RESONANCE</p>
              <h2 className="display max-w-[600px] text-[clamp(3.8rem,8vw,7.2rem)] font-medium leading-[.82]">A bell<br />beneath<br /><em className="text-[#e8cd72]">the blue.</em></h2>
              <p className="mt-7 max-w-[390px] text-[14px] leading-7 text-[#f5efdf]/75">It rings from somewhere under the returned city. Tavi’s bell gives a clear reply. Aya’s compass turns toward the sound.</p>
            </div>
            <div className="flex flex-col justify-between rounded-[1.4rem] border border-[#f5efdf]/25 bg-[#f5efdf]/[.06] p-6 md:p-9">
              <div className="flex items-start justify-between gap-6">
                <span className="mono text-[8px] text-[#e8cd72]">ARCHIVE FRAGMENT / 01</span>
                <BookOpen size={19} strokeWidth={1.4} className="text-[#e8cd72]" />
              </div>
              <div className="py-8">
                <p className="display max-w-[680px] text-[clamp(1.75rem,4vw,3.6rem)] leading-[1.18]">
                  “At dawn, the sea withdrew from the steps of Namaris. Aya’s compass turned in her palm—not north, but down. Beside her, Tavi’s collar bell gave one clear answer.”
                </p>
                {excerptOpen && <p className="mt-5 max-w-[620px] border-l border-[#e8cd72] pl-5 text-[14px] leading-7 text-[#f5efdf]/75" aria-live="polite">Somewhere below the stones, a buried bell was still ringing. The first path was no longer a line on a chart. It was a sound—and two travelers listening.</p>}
              </div>
              <button onClick={() => setExcerptOpen(!excerptOpen)} className="inline-flex w-fit items-center gap-3 border-b border-[#e8cd72]/60 pb-2 text-[10px] font-extrabold tracking-[.14em] text-[#e8cd72] transition-colors hover:border-[#fff8e8] hover:text-[#fff8e8]" aria-expanded={excerptOpen} data-testid="button-story-excerpt">
                {excerptOpen ? 'CLOSE THE FRAGMENT' : 'READ THE NEXT LINES'} <ArrowRight size={14} className={`transition-transform ${excerptOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div data-reveal className="mt-20 border-t border-[#f5efdf]/25 pt-6 md:mt-28">
            <div className="mb-9 flex items-center justify-between gap-4">
              <span className="mono text-[8px] text-[#e8cd72]">THE SHAPE OF A RETURN</span>
              <span className="mono text-[8px] text-white/45">A FIELD NOTE, NOT AN ENDING</span>
            </div>
            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {[
                { mark: '01', title: 'The Long Quiet', body: 'The first kingdoms disappear. Namaris is lost beneath the Veyruun Expanse.' },
                { mark: '02', title: 'A sound below', body: 'A buried bell calls through the water. Tavi’s collar bell answers.' },
                { mark: '03', title: 'At first light', body: 'Namaris returns at dawn. Aya’s compass finds its next unfinished edge.' },
              ].map((beat) => <article key={beat.mark} className="border-l border-[#e8cd72]/45 pl-5">
                <span className="mono text-[8px] text-[#e8cd72]">{beat.mark}</span>
                <h3 className="display mt-3 text-[2rem] font-medium leading-none">{beat.title}</h3>
                <p className="mt-3 max-w-[290px] text-[12px] leading-6 text-[#f5efdf]/65">{beat.body}</p>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <TiktokLiveStats />

      <section className="relative overflow-hidden bg-[#d58650] px-5 py-24 text-[#263532] md:py-32">
        <div className="absolute -right-24 -top-32 h-[520px] w-[520px] rounded-full border border-[#263532]/15" />
        <div className="absolute -right-4 -top-10 h-[350px] w-[350px] rounded-full border border-[#263532]/15" />
        <div data-reveal className="relative mx-auto grid max-w-[1280px] gap-12 md:grid-cols-[1fr_.8fr] md:items-end">
          <div>
            <p className="mono mb-5 text-[9px]">THE QUESTION AT THE WATERLINE</p>
            <h2 className="display max-w-[720px] text-[clamp(3.8rem,8.3vw,7.5rem)] font-medium leading-[.81]">Why is<br />Namaris<br /><em>waking now?</em></h2>
              <p className="mt-7 max-w-[410px] text-[14px] leading-7 text-[#263532]/75">The city has returned, but not its answers. Aya follows the uncertain needle; Tavi follows the note that reaches him—or seems to.</p>
          </div>
          <div className="rounded-[1.4rem] border border-[#263532]/35 bg-[#f5edda]/30 p-6 md:p-8">
            <span className="mono text-[8px]">A MAP WITH ROOM LEFT</span>
            <p className="display mt-5 text-[2rem] font-medium leading-[1.05] md:text-[2.6rem]">The next mark is waiting beyond the causeway.</p>
            <a href="#top" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1c302f] px-5 py-3.5 text-[10px] font-extrabold tracking-[.12em] text-[#f5efdf] transition-all hover:-translate-y-1 hover:bg-[#345b55]" data-testid="link-return-dawn">
              RETURN TO FIRST LIGHT <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-8 text-[9px] md:flex-row md:items-center md:justify-between md:px-12">
        <a href="#top" className="flex items-center gap-2 font-extrabold tracking-[.12em]" data-testid="link-footer-home"><Compass size={17} className="text-[#b94c34]" /> ANCIENT REBORN WORLD</a>
        <span className="mono text-[#7d796b]">WHEN THE SEA RINGS, THE LOST RETURN.</span>
        <a href="#top" className="inline-flex items-center gap-2 font-bold transition-colors hover:text-[#b94c34]" data-testid="link-back-top">BACK TO THE SURFACE <ArrowUpRight size={13} /></a>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bongo-kiko"><BongoKikoPage page="intro" /></Route>
        <Route path="/bongo-kiko/characters"><BongoKikoPage page="characters" /></Route>
        <Route path="/bongo-kiko/characters/bongo"><BongoKikoPage page="bongo" /></Route>
        <Route path="/bongo-kiko/characters/kiko"><BongoKikoPage page="kiko" /></Route>
        <Route path="/bongo-kiko/adventures"><BongoKikoPage page="adventures" /></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
