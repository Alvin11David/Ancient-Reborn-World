import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Compass, Menu, Sparkles, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [excerptOpen, setExcerptOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="grain overflow-hidden bg-[#f3eddf] text-[#261f19]">
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-12 md:py-7">
        <a href="#top" aria-label="Ancient Reborn World home" className="group flex items-center gap-3" data-testid="link-home">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e85332] text-[#f3eddf] transition-transform group-hover:rotate-[-12deg]">
            <Compass size={23} strokeWidth={1.7} />
          </span>
          <span className="leading-[.92]">
            <span className="block font-serif text-[17px] font-bold tracking-[-.06em]">ANCIENT</span>
            <span className="mono block text-[8px] font-medium tracking-[.2em]">REBORN WORLD</span>
          </span>
        </a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          <a className="nav-link" href="#world" data-testid="link-world">The world</a>
          <a className="nav-link" href="#stories" data-testid="link-stories">Stories</a>
          <a className="nav-link" href="#creators" data-testid="link-creators">For creators</a>
        </nav>
        <a href="#dispatch" className="hidden items-center gap-2 rounded-full bg-[#261f19] px-5 py-3 text-[11px] font-bold tracking-wide text-[#f3eddf] transition-all hover:bg-[#e85332] hover:-translate-y-0.5 md:flex" data-testid="link-join-desktop">
          FIND YOUR WAY IN <ArrowUpRight size={14} />
        </a>
        <button className="grid h-11 w-11 place-items-center rounded-full border border-[#bcb2a3] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} data-testid="button-mobile-menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {menuOpen && <nav className="absolute inset-x-4 top-[78px] z-30 rounded-2xl border border-[#d7ccbc] bg-[#f3eddf] p-5 shadow-xl md:hidden" aria-label="Mobile navigation">
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#world">The world</a>
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#stories">Stories</a>
        <a onClick={closeMenu} className="block border-b border-[#d7ccbc] py-3 font-semibold" href="#creators">For creators</a>
        <a onClick={closeMenu} className="mt-4 inline-flex rounded-full bg-[#e85332] px-5 py-3 text-xs font-bold text-white" href="#dispatch">Find your way in</a>
      </nav>}

      <section id="top" className="relative mx-auto max-w-[1440px] px-5 pb-9 md:px-12 md:pb-16">
        <div className="relative min-h-[650px] overflow-hidden rounded-[1.6rem] bg-[#ccb87e] md:min-h-[690px] md:rounded-[2.2rem]">
          <img src="/images/awakening.jpg" alt="A young explorer looks across a vast city rising from the desert sea" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#191913]/65 via-[#191913]/25 to-transparent md:via-[#191913]/10" />
          <div className="relative flex min-h-[650px] max-w-3xl flex-col justify-center px-7 py-16 text-[#fff6e6] md:min-h-[690px] md:px-16 md:py-20">
            <p className="mono mb-6 flex items-center gap-2 text-[10px] text-[#f9d864]"><span className="h-2 w-2 rounded-full bg-[#f9d864]" /> AN ORIGINAL STORY UNIVERSE</p>
            <h1 className="display max-w-[780px] text-[clamp(4.5rem,10vw,9.6rem)] font-bold leading-[.77]">The old<br />world is<br /><em className="font-medium text-[#f4cc57]">waking.</em></h1>
            <p className="mt-8 max-w-[370px] text-base leading-7 text-[#fff6e6]/85 md:text-lg">Forgotten civilizations. Unfinished magic. A new generation with everything to find.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#world" className="inline-flex items-center gap-3 rounded-full bg-[#e85332] px-6 py-4 text-sm font-extrabold text-[#fff8eb] transition-all hover:-translate-y-1 hover:bg-[#f06b48]" data-testid="link-explore-world">STEP INTO THE WORLD <ArrowRight size={17} /></a>
              <span className="mono text-[9px] text-white/70">A MYTHIC ADVENTURE, REIMAGINED</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-7 hidden items-center gap-3 text-white/85 md:flex"><span className="mono text-[9px]">SCROLL TO DISCOVER</span><ArrowDown size={15} /></div>
          <div className="absolute bottom-7 right-7 grid h-12 w-12 place-items-center rounded-full border border-white/40 text-white md:hidden"><ArrowDown size={17} /></div>
          <div className="absolute right-7 top-7 hidden rounded-full border border-white/35 px-4 py-2 text-[10px] text-white md:block"><span className="mono">A WORLD IN THE MAKING</span></div>
        </div>
        <div className="flex items-start justify-between gap-5 pt-5 text-[10px] md:pt-7">
          <span className="mono text-[#8a7e6e]">A NEW MYTHOLOGY FOR THE CURIOUS</span>
          <span className="mono text-right text-[#8a7e6e]">BUILT FROM THE DUST UP · EST. NOW</span>
        </div>
      </section>

      <section className="marquee overflow-hidden border-y border-[#261f19] bg-[#f2cb55] py-4 text-[#261f19]">
        <div className="marquee-track flex w-max items-center gap-7 whitespace-nowrap">
          {[0,1].map((copy) => <div key={copy} className="flex items-center gap-7">
            {['LOST CITIES','BRAVE HEARTS','OLD MAGIC','NEW WORLDS','THE MAP IS NOT THE TERRITORY'].map((item) => <span key={item} className="flex items-center gap-7"><span className="display text-[29px] font-bold italic md:text-[37px]">{item}</span><span className="text-[#e85332]"><Sparkles size={20} /></span></span>)}
          </div>)}
        </div>
      </section>

      <section id="world" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[.83fr_1.17fr] md:px-12 md:py-36">
        <div className="md:sticky md:top-20 md:self-start">
          <p className="mono mb-5 text-[10px] text-[#e85332]">01 / THE WORLD</p>
          <h2 className="display max-w-[550px] text-[clamp(3.7rem,7vw,7rem)] font-bold leading-[.86]">This is not<br />the end of<br /><em className="font-medium text-[#e85332]">the story.</em></h2>
          <p className="mt-7 max-w-[420px] text-[15px] leading-7 text-[#655a4c]">Beneath the familiar ground, the first kingdoms are stirring. Their cities, songs and impossible machines have waited centuries for someone to listen.</p>
          <a href="#stories" className="mt-8 inline-flex items-center gap-3 border-b border-[#261f19] pb-2 text-xs font-extrabold tracking-wide transition-colors hover:text-[#e85332] hover:border-[#e85332]" data-testid="link-discover-stories">FOLLOW THE FOOTPRINTS <ArrowRight size={14} /></a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="flex min-h-[260px] flex-col justify-between rounded-[1.4rem] bg-[#1e493e] p-7 text-[#f6efd9] sm:mt-14 md:min-h-[330px] md:p-9">
            <span className="mono text-[9px] text-[#d4c581]">A LAND THAT REMEMBERS</span>
            <div><span className="mb-4 block h-px w-12 bg-[#d4c581]" /><h3 className="display text-4xl font-semibold leading-none">The Veyruun<br />Expanse</h3><p className="mt-4 max-w-[270px] text-sm leading-6 text-[#f6efd9]/75">Where a salt sea swallowed the old roads, and the horizon never tells the whole truth.</p></div>
          </article>
          <article className="flex min-h-[260px] flex-col justify-between rounded-[1.4rem] bg-[#e7a45e] p-7 text-[#261f19] sm:-mt-4 md:min-h-[330px] md:p-9">
            <span className="mono text-[9px]">A POWER WITH A PULSE</span>
            <div><span className="mb-4 block h-px w-12 bg-[#261f19]" /><h3 className="display text-4xl font-semibold leading-none">The First<br />Resonance</h3><p className="mt-4 max-w-[270px] text-sm leading-6 text-[#261f19]/75">Magic is not a thing to wield. It is a thing that remembers being heard.</p></div>
          </article>
          <div className="relative col-span-1 min-h-[270px] overflow-hidden rounded-[1.4rem] bg-[#d4c9ae] sm:col-span-2 md:min-h-[380px]">
            <img src="/images/awakening.jpg" alt="Ancient towers and floating stone above the turquoise expanse" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b201b]/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-[#fff6e6] md:bottom-9 md:left-9"><span className="mono text-[9px] text-[#f2cb55]">A FRAGMENT FROM THE ATLAS</span><p className="display mt-2 text-3xl font-semibold md:text-5xl">The city beneath the tide</p></div>
            <span className="absolute right-5 top-5 rounded-full bg-[#f3eddf] px-3 py-2 text-[9px] mono">CHART 07—A</span>
          </div>
        </div>
      </section>

      <section id="stories" className="bg-[#e7e0d1] py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div><p className="mono mb-5 text-[10px] text-[#e85332]">02 / THE STORIES</p><h2 className="display max-w-[650px] text-[clamp(3.4rem,7vw,6.7rem)] font-bold leading-[.84]">Every legend<br />starts <em className="font-medium">somewhere.</em></h2></div>
            <p className="max-w-[300px] pb-1 text-sm leading-6 text-[#655a4c]">Meet the people who stumble into a world that has been waiting for them.</p>
          </div>
          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-[1.03fr_.97fr]">
            <article className="group relative min-h-[500px] overflow-hidden rounded-[1.6rem] bg-[#e8bf70] md:min-h-[600px]">
              <img src="/images/character-aya.jpg" alt="Aya, a young relic seeker with a bright scarf and a carved bronze compass" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261f19]/85 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-[#f3eddf] px-4 py-2 mono text-[9px]">MEET YOUR GUIDE</div>
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4 text-[#fff6e6] md:bottom-10 md:left-10">
                <div><span className="mono text-[9px] text-[#f2cb55]">THE WAYFINDER</span><h3 className="display mt-2 text-5xl font-bold md:text-7xl">Aya Venn</h3><p className="mt-3 max-w-[350px] text-sm leading-6 text-white/80">A mapmaker who keeps finding places that do not want to be found.</p></div>
                <a href="#dispatch" aria-label="Get Aya's field notes" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e85332] transition-transform group-hover:rotate-45" data-testid="link-aya-notes"><ArrowUpRight size={20} /></a>
              </div>
            </article>
            <div className="flex flex-col gap-5">
              <button onClick={() => setExcerptOpen(!excerptOpen)} className="group relative flex min-h-[260px] flex-1 items-center justify-center overflow-hidden rounded-[1.6rem] bg-[#304f55] text-left text-[#f3eddf] md:min-h-[350px]" aria-label={excerptOpen ? 'Close the story excerpt' : 'Read the story excerpt'} aria-expanded={excerptOpen} data-testid="button-story-preview">
                <div className="absolute inset-0 opacity-50" style={{backgroundImage:'radial-gradient(ellipse at 68% 32%, #f2cb55 0, transparent 17%), radial-gradient(ellipse at 48% 70%, #e85332 0, transparent 25%), linear-gradient(145deg,#304f55,#172b35 62%,#c05c3e)'}} />
                <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_35%,rgba(243,237,223,.1)_35.2%,transparent_36%)]" />
                <div className="relative z-10 flex max-w-[350px] flex-col items-center gap-4 px-6 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-white/60 bg-white/10 transition-all group-hover:scale-110 group-hover:bg-[#e85332]">{excerptOpen ? <X size={21} /> : <BookOpen size={21} />}</span>
                  <span className="mono text-[10px]">{excerptOpen ? 'CLOSE THE EXCERPT' : 'READ THE OPENING LINES'}</span>
                  {excerptOpen && <span className="display text-xl italic leading-snug md:text-2xl" aria-live="polite">“The dunes fell silent when the old bells rang beneath the sea.”</span>}
                </div>
                <span className="absolute bottom-5 left-6 mono text-[9px] text-white/70">ARCHIVE FRAGMENT / 01</span>
                <span className="absolute right-6 top-5 mono text-[9px] text-white/70">OPEN TO READ</span>
              </button>
              <div className="flex min-h-[170px] items-center justify-between gap-6 rounded-[1.6rem] bg-[#f3eddf] p-7 md:p-9">
                <div><span className="mono text-[9px] text-[#e85332]">A NOTE FROM THE ARCHIVE</span><p className="display mt-3 max-w-[410px] text-3xl font-semibold leading-[1.05] md:text-4xl">“The ruins were not empty.<br />They were listening.”</p></div>
                <Sparkles className="hidden shrink-0 text-[#e85332] md:block" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="creators" className="mx-auto max-w-[1440px] px-5 py-24 md:px-12 md:py-36">
        <div className="grid gap-12 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div className="relative min-h-[370px] overflow-hidden rounded-[1.6rem] bg-[#e85332] p-8 text-[#f9f0db] md:min-h-[480px] md:p-12">
            <div className="absolute -right-16 -top-16 h-[350px] w-[350px] rounded-full border border-[#f9f0db]/30" />
            <div className="absolute -right-3 top-0 h-[260px] w-[260px] rounded-full border border-[#f9f0db]/30" />
            <div className="relative flex h-full min-h-[300px] flex-col justify-between">
              <span className="mono text-[10px]">A WORLD MADE TO BE SHARED</span>
              <div><Compass size={44} strokeWidth={1.2} /><p className="display mt-5 max-w-[450px] text-5xl font-semibold leading-[.94] md:text-7xl">Bring your<br />own wonder.</p></div>
              <span className="mono text-[9px] text-[#f9f0db]/75">A CREATIVE UNIVERSE, OPENING OUTWARD</span>
            </div>
          </div>
          <div>
            <p className="mono mb-5 text-[10px] text-[#e85332]">03 / MAKE IT YOURS</p>
            <h2 className="display max-w-[640px] text-[clamp(3.5rem,7vw,6.4rem)] font-bold leading-[.84]">The best worlds<br />leave room for<br /><em className="font-medium text-[#1e493e]">you.</em></h2>
            <p className="mt-7 max-w-[510px] text-[15px] leading-7 text-[#655a4c]">Ancient Reborn is a living story universe: animated adventures, illustrated chronicles, odd little artifacts and pathways for artists to build alongside us.</p>
            <div className="mt-8 flex flex-col gap-4 border-t border-[#cfc5b5] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div><span className="mono text-[9px] text-[#8a7e6e]">NEXT UP</span><p className="mt-1 font-bold">The Atlas of Unfinished Places</p></div>
              <a href="#dispatch" className="inline-flex w-fit items-center gap-3 rounded-full border border-[#261f19] px-5 py-3 text-xs font-extrabold transition-colors hover:bg-[#261f19] hover:text-[#f3eddf]" data-testid="link-creator-invite">FIND YOUR WAY IN <ArrowRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="dispatch" className="relative overflow-hidden bg-[#1e493e] px-5 py-24 text-[#f3eddf] md:py-32">
        <div className="absolute -right-20 -top-24 h-[420px] w-[420px] rounded-full border border-[#f3eddf]/10" />
        <div className="absolute -right-2 -top-2 h-[280px] w-[280px] rounded-full border border-[#f3eddf]/10" />
        <div className="relative mx-auto grid max-w-[1280px] gap-12 md:grid-cols-[1fr_.8fr] md:items-end">
          <div><p className="mono mb-5 text-[10px] text-[#f2cb55]">THE FIRST DISPATCH</p><h2 className="display max-w-[700px] text-[clamp(3.7rem,8vw,7.4rem)] font-bold leading-[.82]">Find out what<br />wakes <em className="font-medium text-[#f2cb55]">next.</em></h2><p className="mt-7 max-w-[430px] text-sm leading-6 text-[#f3eddf]/75">Notes from beyond the map. New art, small mysteries and first looks from the world we are building.</p></div>
          <div className="rounded-2xl border border-[#f3eddf]/25 bg-[#f3eddf]/10 p-6 md:p-8">
            <p className="mono text-[9px] text-[#f2cb55]">THE ATLAS IS OPEN</p>
            <p className="display mt-4 max-w-[420px] text-3xl font-semibold leading-tight md:text-4xl">Every good journey begins with a question.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#world" className="inline-flex items-center gap-2 rounded-full bg-[#f2cb55] px-5 py-3 text-xs font-extrabold text-[#261f19] transition-colors hover:bg-[#f6d878]" data-testid="link-dispatch-world">EXPLORE THE WORLD <ArrowRight size={15} /></a>
              <a href="#stories" className="inline-flex items-center gap-2 rounded-full border border-[#f3eddf]/40 px-5 py-3 text-xs font-extrabold text-[#f3eddf] transition-colors hover:bg-[#f3eddf]/10" data-testid="link-dispatch-stories">MEET AYA <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-8 text-[10px] md:flex-row md:items-center md:justify-between md:px-12">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-wide" data-testid="link-footer-home"><Compass size={17} className="text-[#e85332]" /> ANCIENT REBORN WORLD</a>
        <span className="mono text-[#8a7e6e]">THE STORIES WE BURY FIND A WAY BACK.</span>
        <a href="#top" className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-[#e85332]" data-testid="link-back-top">BACK TO THE SURFACE <ArrowUpRight size={13} /></a>
      </footer>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
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
