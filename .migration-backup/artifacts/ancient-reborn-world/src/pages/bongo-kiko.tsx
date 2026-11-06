import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Clapperboard, Menu, Play, Sparkles, X } from 'lucide-react';
import './bongo-kiko.css';
import './bongo-kiko-lively.css';

type Page = 'intro' | 'characters' | 'bongo' | 'kiko' | 'adventures';

const routeInfo: Record<Page, { title: string; description: string }> = {
  intro: {
    title: 'Bongo & Kiko — Tiny plans. Big chaos.',
    description: 'Meet Bongo & Kiko, a playful comedy duo making short-form adventures on TikTok and YouTube. Two friends, one phone, absolutely no plan.',
  },
  characters: {
    title: 'Meet the duo — Bongo & Kiko',
    description: 'Get to know Bongo and Kiko: one big idea, one phone, and a friendship that keeps turning small plans into big chaos.',
  },
  bongo: {
    title: 'Bongo — The idea guy | Bongo & Kiko',
    description: 'Meet Bongo: red shirt, spiky hair, and a big-hearted talent for making a simple plan much, much bigger.',
  },
  kiko: {
    title: 'Kiko — The phone guy | Bongo & Kiko',
    description: 'Meet Kiko: blue shirt, phone always nearby, and a knack for documenting every twist in a Bongo-sized plan.',
  },
  adventures: {
    title: 'The adventure board — Bongo & Kiko',
    description: 'Browse original short-form story ideas for Bongo & Kiko, the comedy duo whose everyday plans tend to go sideways.',
  },
};

const pages: { label: string; href: string; page: Page; number: string }[] = [
  { label: 'The show', href: '/bongo-kiko', page: 'intro', number: '01' },
  { label: 'The duo', href: '/bongo-kiko/characters', page: 'characters', number: '02' },
  { label: 'Bongo', href: '/bongo-kiko/characters/bongo', page: 'bongo', number: '03' },
  { label: 'Kiko', href: '/bongo-kiko/characters/kiko', page: 'kiko', number: '04' },
  { label: 'Adventure board', href: '/bongo-kiko/adventures', page: 'adventures', number: '05' },
];

const ideas = [
  { id: 'one-take', no: '01', title: 'The One-Take Wonder', type: 'A VERY SHORT FILM', tease: 'Kiko hits record. Bongo promises one take. The universe hears a challenge.', detail: 'A simple introduction turns into a parade of increasingly unnecessary retakes: new lighting, a director’s chair made from cushions, and one dramatic entrance that happens off camera.' },
  { id: 'snack-map', no: '02', title: 'The Snack Map', type: 'A TINY QUEST', tease: 'A craving. A hand-drawn map. Three turns neither of them understands.', detail: 'Bongo draws a route to the kitchen like it is unexplored territory. Kiko documents the expedition, including the moment they realize they started in the kitchen.' },
  { id: 'phone-stand', no: '03', title: 'The Phone Stand', type: 'AN ENGINEERING FEAT', tease: 'Kiko needs a stable shot. Bongo has several ideas. None are stable.', detail: 'Books, boxes, one suspiciously wobbly tower. The perfect phone stand is always one object away—until the timer starts.' },
  { id: 'quiet-game', no: '04', title: 'The Quiet Game', type: 'A FRIENDSHIP TEST', tease: 'First one to laugh loses. They both lose immediately.', detail: 'They agree to be serious for exactly one minute. Then Bongo tries not to laugh at Kiko trying not to laugh. The timer never stands a chance.' },
];

function platformSearch(platform: 'TikTok' | 'YouTube') {
  return platform === 'TikTok'
    ? 'https://www.tiktok.com/search?q=Bongo%20%26%20Kiko'
    : 'https://www.youtube.com/results?search_query=Bongo+%26+Kiko';
}

function Doodle({ className = '' }: { className?: string }) {
  return <svg className={`bk-doodle ${className}`} viewBox="0 0 120 90" fill="none" aria-hidden="true"><path d="M8 69C26 16 82 3 106 35c21 29-10 50-28 33-13-13 1-30 15-25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="m87 11 14 3-4 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SiteNav({ active }: { active: Page }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const navigate = (href: string) => {
    setOpen(false);
    setLocation(href);
  };
  return (
    <header className="bk-header">
      <Link href="/bongo-kiko" className="bk-brand" aria-label="Bongo and Kiko, show home" data-testid="link-bk-home">
        <span className="bk-brand-mark">B<span>&</span>K</span>
        <span className="bk-brand-copy"><strong>BONGO + KIKO</strong><small>THE VERY SHORT SHOW</small></span>
      </Link>
      <nav className="bk-nav" aria-label="Bongo and Kiko navigation">
        {pages.map(item => <Link key={item.page} href={item.href} className={`bk-nav-link ${active === item.page ? 'is-active' : ''}`} data-testid={`link-nav-${item.page}`}>
          <span>{item.label}</span><small>{item.number}</small>
        </Link>)}
      </nav>
      <a className="bk-header-cta" href={platformSearch('YouTube')} target="_blank" rel="noreferrer" data-testid="link-discover-youtube">
        FIND THE FUN <ArrowUpRight size={15} />
      </a>
      <button className="bk-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} data-testid="button-mobile-menu">
        {open ? <X /> : <Menu />}
      </button>
      {open && <div className="bk-mobile-menu">
        <span className="bk-mobile-label">PICK A PAGE</span>
        {pages.map(item => <button type="button" key={item.page} onClick={() => navigate(item.href)} className={active === item.page ? 'is-active' : ''} data-testid={`button-mobile-${item.page}`}>
          <span>{item.label}</span><span>{item.number}</span>
        </button>)}
        <a href={platformSearch('TikTok')} target="_blank" rel="noreferrer" data-testid="link-mobile-discover">Search on TikTok <ArrowUpRight size={15} /></a>
      </div>}
    </header>
  );
}

function Footer() {
  return <footer className="bk-footer">
    <Link href="/bongo-kiko" className="bk-footer-brand" data-testid="link-footer-home"><span className="bk-brand-mark">B<span>&</span>K</span><span>BONGO + KIKO</span></Link>
    <p>MADE OF BIG PLANS AND VERY SMALL ATTENTION SPANS.</p>
    <div className="bk-footer-links"><a href={platformSearch('TikTok')} target="_blank" rel="noreferrer" data-testid="link-footer-tiktok">TikTok search <ArrowUpRight size={13} /></a><a href={platformSearch('YouTube')} target="_blank" rel="noreferrer" data-testid="link-footer-youtube">YouTube search <ArrowUpRight size={13} /></a></div>
  </footer>;
}

function PageIntro() {
  return <>
    <section className="bk-hero bk-hero-home">
      <div className="bk-hero-copy">
        <p className="bk-eyebrow"><span className="bk-eyebrow-dot" /> TWO FRIENDS. ZERO MASTER PLAN.</p>
        <h1>Big ideas.<br /><em>Small<br /><span>follow-through.</span></em></h1>
        <p className="bk-hero-desc">Bongo brings the plan. Kiko brings the phone. Somehow, the simple stuff gets complicated.</p>
        <div className="bk-hero-actions">
          <Link href="/bongo-kiko/characters" className="bk-button bk-button-dark" data-testid="link-meet-the-duo">MEET THE DUO <ArrowRight size={16} /></Link>
          <Link href="/bongo-kiko/adventures" className="bk-text-link" data-testid="link-adventure-board">SEE THE ADVENTURE BOARD <ArrowDownRight size={17} /></Link>
        </div>
      </div>
      <div className="bk-hero-art" aria-label="Bongo and Kiko illustrations">
        <div className="bk-hero-sticker">A SHORT-FORM COMEDY DUO <Sparkles size={14} /></div>
        <div className="bk-sunburst" />
        <span className="bk-art-note bk-note-top">NO PLAN<br />SURVIVES</span>
        <span className="bk-art-note bk-note-bottom">BONGO / KIKO<br />FIELD TEST 001</span>
        <div className="bk-art-platform" />
        <img className="bk-hero-character bk-hero-bongo" src="/images/bongo-character.png" alt="Bongo, with spiky black hair and a red shirt, gestures as if sharing an idea." />
        <img className="bk-hero-character bk-hero-kiko" src="/images/kiko-character.png" alt="Kiko, round-headed in a blue shirt, waves while holding a phone." />
        <Doodle className="bk-doodle-hero" />
        <span className="bk-art-caption">THE USUAL SUSPECTS <span>→</span></span>
      </div>
      <div className="bk-hero-bottom"><span>SCROLL FOR THE SETUP</span><span>01 — 05</span></div>
    </section>
    <section className="bk-marquee" aria-label="The comedy duo: plans, phones, and plot twists">
      <div>{Array.from({ length: 2 }, (_, copy) => <span key={copy}>THE PLAN WAS SIMPLE <b><Sparkles size={14} /></b> THE PHONE WAS ROLLING <b><Sparkles size={14} /></b> THIS IS GOING GREAT <b><Sparkles size={14} /></b> PROBABLY <b><Sparkles size={14} /></b></span>)}</div>
    </section>
    <section className="bk-intro-grid">
      <div className="bk-section-heading">
        <p className="bk-eyebrow">THE SHOW, IN ONE BREATH</p>
        <h2>Ordinary day.<br /><em>Unordinary</em> detour.</h2>
      </div>
      <div className="bk-intro-copy">
        <p>They set out to do one little thing. Then one little thing becomes a whole operation—with a questionable diagram, a phone recording everything, and a friendship that refuses to call it quits.</p>
        <p>Meet the pair behind the plans, then wander into the adventure board. These are original story ideas made for this fan/show site—not a list of confirmed episodes.</p>
        <Link href="/bongo-kiko/adventures" className="bk-underline-link" data-testid="link-read-story-ideas">BROWSE THE STORY IDEAS <ArrowRight size={15} /></Link>
      </div>
      <div className="bk-stamp" aria-hidden="true"><span>SMALL<br />PLAN</span><i>BIG<br />PLOT</i><b>!</b></div>
    </section>
    <section className="bk-duo-preview">
      <div className="bk-preview-title"><p className="bk-eyebrow">THE CAST (IT'S A TIGHT OPERATION)</p><h2>Meet your<br /><em>co-conspirators.</em></h2></div>
      <Link href="/bongo-kiko/characters/bongo" className="bk-preview-card bk-preview-red" data-testid="card-preview-bongo">
        <span className="bk-card-index">01 / THE IDEA GUY</span><img src="/images/bongo-character.png" alt="Bongo, the spiky-haired character in a red shirt." />
        <span className="bk-preview-name">BONGO <ArrowUpRight size={19} /></span><span className="bk-card-scribble">I'VE GOT<br />A PLAN.</span>
      </Link>
      <Link href="/bongo-kiko/characters/kiko" className="bk-preview-card bk-preview-blue" data-testid="card-preview-kiko">
        <span className="bk-card-index">02 / THE PHONE GUY</span><img src="/images/kiko-character.png" alt="Kiko, the round bald character in a blue shirt, holding a phone." />
        <span className="bk-preview-name">KIKO <ArrowUpRight size={19} /></span><span className="bk-card-scribble">IS IT<br />RECORDING?</span>
      </Link>
      <Link href="/bongo-kiko/characters" className="bk-duo-link" data-testid="link-all-characters">THE WHOLE DOUBLE ACT <ArrowRight size={15} /></Link>
    </section>
    <section className="bk-channel-band">
      <div className="bk-channel-mark"><Play size={23} fill="currentColor" /></div>
      <div><p className="bk-eyebrow">THEY'RE OUT THERE MAKING SHORTS</p><h2>Catch the next<br />little <em>big thing.</em></h2></div>
      <p className="bk-channel-copy">Bongo & Kiko are on TikTok and YouTube. No official channel links were supplied, so these buttons open platform search results.</p>
      <div className="bk-channel-actions"><a href={platformSearch('TikTok')} target="_blank" rel="noreferrer" className="bk-button bk-button-paper" data-testid="link-tiktok-discovery"><span>TIKTOK SEARCH</span><ArrowUpRight size={15} /></a><a href={platformSearch('YouTube')} target="_blank" rel="noreferrer" className="bk-button bk-button-paper" data-testid="link-youtube-discovery"><span>YOUTUBE SEARCH</span><ArrowUpRight size={15} /></a></div>
      <span className="bk-channel-footnote">PLATFORM DISCOVERY · NOT OFFICIAL CHANNEL LINKS</span>
    </section>
  </>;
}

function Characters() {
  return <>
    <section className="bk-page-hero bk-directory-hero">
      <div><p className="bk-eyebrow">THE DOUBLE ACT / CAST DIRECTORY</p><h1>One has a plan.<br /><em>One has proof.</em></h1><p className="bk-page-lede">Two friends. One phone. A surprising number of ways to make a tiny task take all afternoon.</p></div>
      <div className="bk-directory-doodle"><Doodle /><span>THEY MEAN WELL.<br />MOSTLY.</span><b>01–02</b></div>
    </section>
    <section className="bk-directory-body">
      <p className="bk-side-note">CAST NOTES / TAP A FACE TO MEET THE PERSON BEHIND THE PLAN</p>
      <Link href="/bongo-kiko/characters/bongo" className="bk-directory-card bk-dir-bongo" data-testid="card-character-bongo">
        <div className="bk-dir-label"><span>01</span><span>THE IDEA GUY</span></div><div className="bk-dir-image"><span className="bk-dir-callout">AN IDEA<br />IS FORMING</span><img src="/images/bongo-character.png" alt="Bongo, a smiling spiky-haired character in a red shirt." /></div><div className="bk-dir-meta"><div><h2>Bongo<span>.</span></h2><p>Starts the plan. Adds three unnecessary steps.</p></div><span className="bk-round-arrow"><ArrowUpRight size={20} /></span></div>
      </Link>
      <div className="bk-vs">PLUS</div>
      <Link href="/bongo-kiko/characters/kiko" className="bk-directory-card bk-dir-kiko" data-testid="card-character-kiko">
        <div className="bk-dir-label"><span>02</span><span>THE PHONE GUY</span></div><div className="bk-dir-image"><span className="bk-dir-callout">ROLLING<br />ALREADY</span><img src="/images/kiko-character.png" alt="Kiko, a cheerful bald character in a blue shirt holding a phone." /></div><div className="bk-dir-meta"><div><h2>Kiko<span>.</span></h2><p>Captures the plan. Also the plot twist.</p></div><span className="bk-round-arrow"><ArrowUpRight size={20} /></span></div>
      </Link>
      <div className="bk-directory-end"><span>ONE FRIENDSHIP</span><span>∞ QUESTIONABLE METHODS</span><Link href="/bongo-kiko/adventures" data-testid="link-directory-adventures">NEXT UP: THE ADVENTURES <ArrowRight size={15} /></Link></div>
    </section>
  </>;
}

function CharacterProfile({ person }: { person: 'bongo' | 'kiko' }) {
  const isBongo = person === 'bongo';
  const name = isBongo ? 'Bongo' : 'Kiko';
  return <>
    <section className={`bk-profile-hero ${isBongo ? 'bk-profile-red' : 'bk-profile-blue'}`}>
      <div className="bk-profile-copy">
        <Link href="/bongo-kiko/characters" className="bk-back-link" data-testid="link-back-characters"><ArrowLeft size={15} /> BACK TO THE DUO</Link>
        <p className="bk-eyebrow">{isBongo ? '01 / THE IDEA GUY' : '02 / THE PHONE GUY'}</p>
        <h1>{name}<span>.</span></h1>
        <p className="bk-profile-tagline">{isBongo ? '“Quick question: what if we made this a whole thing?”' : '“Okay, but are we filming this?”'}</p>
        <p className="bk-profile-description">{isBongo
          ? 'Bongo is the spark behind the scheme: red shirt, spiky hair, and a heart that is always in the right place—even when the plan is upside down.'
          : 'Kiko is the ever-ready documentarian: blue shirt, phone at the ready, and a cheerful eye for the exact moment a plan becomes a story.'}</p>
        <div className="bk-profile-tags">{(isBongo ? ['BIG IDEAS', 'GOOD INTENTIONS', 'QUESTIONABLE TIMING'] : ['PHONE ALWAYS NEARBY', 'QUICK THINKER', 'RECEIPTS ON CAMERA']).map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="bk-profile-art"><span className="bk-profile-number">{isBongo ? 'B!' : 'K?'}</span><span className="bk-profile-ring" /><img src={isBongo ? '/images/bongo-character.png' : '/images/kiko-character.png'} alt={isBongo ? 'Bongo, with spiky black hair and a red shirt, smiling and gesturing.' : 'Kiko, a round bald character in a blue shirt, smiling with a phone in hand.'} /><span className="bk-profile-caption">{isBongo ? 'IDEA GENERATOR' : 'MEMORY KEEPER'} <ArrowLeft size={16} /></span></div>
    </section>
    <section className="bk-profile-details">
      <div className="bk-detail-label"><span>QUICK REFERENCE</span><span>CHARACTER FILE / 0{isBongo ? '1' : '2'}</span></div>
      <div className="bk-detail-grid">
        <div><span className="bk-detail-no">01</span><h2>The look</h2><p>{isBongo ? 'Spiky black hair, a bright red shirt, and the confident expression of someone who has not yet heard the whole problem.' : 'A round, bald head, bright blue shirt, and a phone close by for all the moments worth remembering.'}</p></div>
        <div><span className="bk-detail-no">02</span><h2>The energy</h2><p>{isBongo ? 'Optimism at full volume. Bongo sees a simple job and imagines the deluxe edition.' : 'Curious, quick, and ready to turn the camera on before anyone asks what the plan is.'}</p></div>
        <div><span className="bk-detail-no">03</span><h2>The duo effect</h2><p>{isBongo ? 'Bongo brings the momentum. Kiko brings the evidence. Together, no detour goes undocumented.' : 'Kiko brings the receipts. Bongo brings the reason there are receipts. The math works out.'}</p></div>
      </div>
      <div className="bk-profile-next">
        <span>{isBongo ? 'THE OTHER HALF OF THIS OPERATION' : 'THE CO-AUTHOR OF THIS SITUATION'}</span>
        <Link href={isBongo ? '/bongo-kiko/characters/kiko' : '/bongo-kiko/characters/bongo'} data-testid={`link-next-${isBongo ? 'kiko' : 'bongo'}`}>MEET {isBongo ? 'KIKO' : 'BONGO'} <ArrowRight size={17} /></Link>
      </div>
    </section>
  </>;
}

function Adventures() {
  const [expanded, setExpanded] = useState<string | null>('one-take');
  return <>
    <section className="bk-page-hero bk-adventure-hero">
      <div><p className="bk-eyebrow">THE IDEA DESK / NOT AN EPISODE GUIDE</p><h1>Plans that<br /><em>didn't stay</em><br />small.</h1><p className="bk-page-lede">Original short-form story prompts for the duo. Little setups, big detours, and a phone that caught the whole thing.</p></div>
      <div className="bk-adventure-hero-art"><span>OPEN<br />IDEAS</span><Clapperboard size={62} strokeWidth={1.2} /><Doodle /></div>
      <div className="bk-adventure-disclaimer">FAN-MADE STORY IDEAS <span>·</span> NOT CONFIRMED RELEASED EPISODES</div>
    </section>
    <section className="bk-adventure-list">
      <div className="bk-adventure-intro"><p className="bk-eyebrow">THE STORY STARTS HERE</p><h2>A tiny premise.<br /><em>A whole situation.</em></h2><p>Tap an idea to open the rest of the setup. The episodes below are original concepts for this site, not confirmed episodes.</p></div>
      <div className="bk-idea-stack">
        {ideas.map(idea => {
          const isOpen = expanded === idea.id;
          return <article className={`bk-idea ${isOpen ? 'is-open' : ''}`} key={idea.id}>
            <button type="button" className="bk-idea-trigger" onClick={() => setExpanded(isOpen ? null : idea.id)} aria-expanded={isOpen} aria-controls={`idea-${idea.id}`} data-testid={`button-idea-${idea.id}`}>
              <span className="bk-idea-number">{idea.no}</span><span className="bk-idea-heading"><small>{idea.type}</small><strong>{idea.title}</strong><span>{idea.tease}</span></span><span className="bk-idea-plus">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="bk-idea-detail" id={`idea-${idea.id}`}><span>THE DETOUR</span><p>{idea.detail}</p><div className="bk-idea-tags"><span>BONGO: MAKES IT BIGGER</span><span>KIKO: GETS IT ON CAMERA</span></div></div>}
          </article>;
        })}
      </div>
    </section>
    <section className="bk-adventure-bottom">
      <div className="bk-bottom-asterisk" aria-hidden="true"><Sparkles size={38} /></div><p className="bk-eyebrow">MORE SHORT-FORM MISCHIEF?</p><h2>Find the duo<br />in the wild.</h2><p className="bk-bottom-copy">Bongo & Kiko are on TikTok and YouTube. Search links only—no official channels were provided.</p>
      <div className="bk-bottom-actions"><a href={platformSearch('TikTok')} target="_blank" rel="noreferrer" className="bk-button bk-button-dark" data-testid="link-adventures-tiktok">SEARCH TIKTOK <ArrowUpRight size={15} /></a><a href={platformSearch('YouTube')} target="_blank" rel="noreferrer" className="bk-button bk-button-dark" data-testid="link-adventures-youtube">SEARCH YOUTUBE <ArrowUpRight size={15} /></a></div>
    </section>
  </>;
}

export default function BongoKikoPage({ page }: { page: Page }) {
  useEffect(() => {
    const info = routeInfo[page];
    document.title = info.title;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }
    description.content = info.description;
    const setMeta = (property: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    setMeta('og:title', info.title);
    setMeta('og:description', info.description);
  }, [page]);

  const content = page === 'intro'
    ? <PageIntro />
    : page === 'characters'
      ? <Characters />
      : page === 'bongo' || page === 'kiko'
        ? <CharacterProfile person={page} />
        : <Adventures />;

  return <main className={`bk-site bk-page-${page}`}>
    <div className="bk-paper-noise" aria-hidden="true" />
    <SiteNav active={page} />
    {content}
    <Footer />
  </main>;
}
