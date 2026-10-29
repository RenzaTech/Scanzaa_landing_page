import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  CircleCheck,
  QrCode,
  Search,
  Smartphone,
  Utensils,
} from 'lucide-react';
import { DEMO_MENU_ITEMS } from '../data/scanzaData';
import LeadCaptureForm from '../components/LeadCaptureForm';
import Footer from '../components/Footer';

const menuPreview = DEMO_MENU_ITEMS.filter((item) =>
  ['1', '3', '4'].includes(String(item.id))
);

const questions = [
  {
    question: 'What does Scanzaa help a restaurant do?',
    answer:
      'Scanzaa gives restaurants a QR-accessible digital menu. Your team manages menu details, and guests browse them on their phone.',
  },
  {
    question: 'Do guests need to install an app?',
    answer:
      'No. Guests scan the restaurant’s QR code and open the menu in their mobile browser.',
  },
  {
    question: 'Can I update menu details?',
    answer:
      'The restaurant-management experience is designed for maintaining menu categories, items, prices, images, and availability.',
  },
];

const PIN_TUNING = Object.freeze({
  momentScrollVh: 62,
  mobileMomentScrollVh: 48,
  journeySlideScrollVh: 58,
});

const HERO_MOMENTS = [
  {
    id: 'scan',
    title: 'Scan the table.',
    subtitle: 'One QR scan opens the restaurant’s menu in a mobile browser.',
    accent: '#FCC133',
    media: { video: 'scan.mp4', mobileVideo: 'scan-mobile.mp4', poster: '/images/scenes/scan-back.jpg', image: '/images/scenes/scan-back.jpg' },
  },
  {
    id: 'browse',
    title: 'Browse with ease.',
    subtitle: 'Guests explore descriptions, photos, prices, and availability.',
    accent: '#E8B849',
    media: { video: 'browse.mp4', mobileVideo: 'browse-mobile.mp4', poster: '/images/scenes/hero-sky.jpg', image: '/images/scenes/hero-sky.jpg' },
  },
  {
    id: 'find',
    title: 'Find what you’re looking for.',
    subtitle: 'Clear categories make the menu easier to explore.',
    accent: '#E1A942',
    media: { video: 'find.mp4', mobileVideo: 'find-mobile.mp4', poster: '/images/pexels-waiter-menu-8870231.jpg', image: '/images/pexels-waiter-menu-8870231.jpg' },
  },
  {
    id: 'manage',
    title: 'Keep menu details in one place.',
    subtitle: 'Your team maintains categories, dishes, prices, photos, and availability.',
    accent: '#D99B42',
    media: { video: 'manage.mp4', mobileVideo: 'manage-mobile.mp4', poster: '/images/scenes/restaurant-management-bg.png', image: '/images/scenes/restaurant-management-bg.png' },
  },
  {
    id: 'reach',
    title: 'Keep the menu within reach.',
    subtitle: 'Place a QR code where guests can scan it at the restaurant.',
    accent: '#F2C45E',
    media: { video: 'reach.mp4', mobileVideo: 'reach-mobile.mp4', poster: '/images/scenes/hero-tables.png', image: '/images/scenes/hero-tables.png' },
  },
  {
    id: 'update',
    title: 'Make updates when details change.',
    subtitle: 'Keep menu items, prices, photos, and availability current.',
    accent: '#FCC133',
    media: { video: 'update.mp4', mobileVideo: 'update-mobile.mp4', poster: '/images/scenes/restaurant-updates-bg.png', image: '/images/scenes/restaurant-updates-bg.png' },
  },
];

function useVideoAssets() {
  const [availableAssets, setAvailableAssets] = useState([]);

  useEffect(() => {
    let active = true;
    fetch('/videos/manifest.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Video asset manifest request failed with status ${response.status}`);
        return response.json();
      })
      .then((assets) => {
        if (!Array.isArray(assets) || assets.some((asset) => typeof asset !== 'string')) {
          throw new Error('Video asset manifest must be an array of filenames');
        }
        if (active) setAvailableAssets(assets);
      })
      .catch((error) => {
        console.error('Unable to load optional hero video artwork:', error);
        if (active) setAvailableAssets([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return availableAssets;
}

function useScrollChoreography(containerRef, videoAssets) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    let mediaQueryContext;
    const context = gsap.context(() => {
      const reducedMotion = gsap.matchMedia();
      mediaQueryContext = reducedMotion;

      reducedMotion.add('(prefers-reduced-motion: no-preference)', () => {
        const videoElements = HERO_MOMENTS.map((moment) => ({
          moment,
          video: root.querySelector(`[data-moment-video="${moment.id}"]`),
        })).filter(({ video }) => video);
        const controllers = new Set();
        const blobUrls = new Set();
        const loadVideo = async ({ moment, video }) => {
          if (!video || video.dataset.loading === 'true' || video.dataset.loaded === 'true') return;
          video.dataset.loading = 'true';
          const controller = new AbortController();
          controllers.add(controller);
          const mediaUrl = video.dataset.videoUrl;

          try {
            const response = await fetch(mediaUrl, { signal: controller.signal });
            if (!response.ok) throw new Error(`Video request failed with status ${response.status}`);
            const blobUrl = URL.createObjectURL(await response.blob());
            blobUrls.add(blobUrl);
            video.src = blobUrl;
            video.dataset.loaded = 'true';
            video.load();
          } catch (error) {
            if (error.name === 'AbortError') return;
            console.error(`Unable to preload the ${moment.id} video; using streaming playback instead.`, error);
            video.src = mediaUrl;
            video.dataset.loaded = 'true';
            video.load();
          } finally {
            controllers.delete(controller);
            delete video.dataset.loading;
          }
        };

        const momentsSection = root.querySelector('[data-pinned-moments]');
        const momentStage = momentsSection?.querySelector('.moment-stage');
        const momentPanels = [...(momentStage?.querySelectorAll('[data-moment-panel]') || [])];
        const progressSegments = [...(momentStage?.querySelectorAll('[data-moment-progress]') || [])];
        const momentCounter = momentStage?.querySelector('.moment-counter__current');
        let currentMoment = -1;

        if (momentsSection && momentStage && momentPanels.length === HERO_MOMENTS.length) {
          gsap.set(momentPanels, { autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' });
          gsap.set(momentPanels[0], { autoAlpha: 1, clipPath: 'inset(0 0 0 0)' });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: momentsSection,
              start: 'top top',
              end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? PIN_TUNING.mobileMomentScrollVh : PIN_TUNING.momentScrollVh) * HERO_MOMENTS.length / 100}`,
              pin: momentStage,
              scrub: 0.25,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const position = Math.min(HERO_MOMENTS.length - 1, self.progress * HERO_MOMENTS.length);
                const index = Math.floor(position);
                const localProgress = self.progress >= 1 ? 1 : position - index;
                const config = HERO_MOMENTS[index];
                momentStage.style.setProperty('--moment-accent', config.accent);
                if (momentCounter) momentCounter.textContent = String(index + 1).padStart(2, '0');

                if (index !== currentMoment) {
                  currentMoment = index;
                  momentPanels.forEach((panel, panelIndex) => {
                    panel.setAttribute('aria-hidden', String(panelIndex !== index));
                  });
                  const nextVideo = videoElements.find(({ moment }) => moment.id === config.id);
                  if (nextVideo) void loadVideo(nextVideo);
                }

                const currentVideo = videoElements.find(({ moment }) => moment.id === config.id)?.video;
                if (currentVideo?.dataset.loaded === 'true' && Number.isFinite(currentVideo.duration)) {
                  const targetTime = Math.min(localProgress * currentVideo.duration, Math.max(0, currentVideo.duration - 0.04));
                  currentVideo.dataset.targetTime = String(targetTime);
                }
              },
            },
          });

          momentPanels.forEach((panel, index) => {
            const copy = panel.querySelector('.moment-copy');
            const image = panel.querySelector('.moment-media-image');
            const titleWords = panel.querySelectorAll('.moment-title-word');

            if (index > 0) {
              timeline.fromTo(
                panel,
                { autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' },
                { autoAlpha: 1, clipPath: 'inset(0 0 0 0)', duration: 0.4, ease: 'none' },
                index
              );
              timeline.to(
                momentPanels[index - 1],
                { autoAlpha: 0, clipPath: 'inset(0 0 0 100%)', duration: 0.4, ease: 'none' },
                index
              );
            }

            if (copy) {
              if (index === 0) {
                gsap.set(copy, { y: 0, autoAlpha: 1 });
              } else {
                timeline.fromTo(copy, { y: 28, autoAlpha: 0 }, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.32,
                  ease: 'expo.out',
                }, index + 0.08);
              }
              if (index < momentPanels.length - 1) {
                timeline.to(copy, { y: -16, autoAlpha: 0, duration: 0.24, ease: 'power3.in' }, index + 0.68);
              }
            }
            if (titleWords.length) {
              if (index === 0) {
                gsap.set(titleWords, { yPercent: 0 });
              } else {
                timeline.fromTo(titleWords, { yPercent: 115 }, {
                  yPercent: 0,
                  stagger: 0.035,
                  duration: 0.38,
                  ease: 'expo.out',
                }, index + 0.12);
              }
            }

            if (image) timeline.fromTo(image, { scale: 1 }, { scale: 1.02, duration: 1, ease: 'none' }, index);
            if (progressSegments[index]) timeline.to(progressSegments[index], { scaleX: 1, duration: 1, ease: 'none' }, index);
          });

          const firstVideo = videoElements.find(({ moment }) => moment.id === HERO_MOMENTS[0].id);
          if (firstVideo) void loadVideo(firstVideo);
        }

        const journey = root.querySelector('[data-pinned-journey]');
        const journeyTrack = journey?.querySelector('.pinned-journey__track');
        const journeySlides = [...(journeyTrack?.querySelectorAll('.pinned-journey__slide') || [])];
        const journeyProgress = journey?.querySelector('.journey-progress__fill');
        const journeyResponsive = gsap.matchMedia();

        journeyResponsive.add('(min-width: 768px)', () => {
          if (journey && journeyTrack && journeySlides.length) {
            const journeyTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: journey,
                start: 'top top',
                end: () => `+=${window.innerHeight * PIN_TUNING.journeySlideScrollVh * journeySlides.length / 100}`,
                pin: journey,
                scrub: 0.35,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (journeyProgress) journeyProgress.style.transform = `scaleX(${self.progress})`;
                },
              },
            });

            journeyTimeline.to(journeyTrack, {
              x: () => -(journeyTrack.scrollWidth - journeyTrack.parentElement.clientWidth),
              ease: 'none',
            });
          }
        });

        root.querySelectorAll('[data-scroll-reveal]:not(.moment-copy)').forEach((element) => {
          if (element.closest('[data-pinned-moments]')) return;
          gsap.fromTo(element, { y: 28, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });

        root.querySelectorAll('.cinematic-scene:not(.moments-hero):not(.pinned-journey) [data-parallax-speed]').forEach((layer) => {
          const speed = Number(layer.dataset.parallaxSpeed) || 0;
          const scene = layer.closest('.cinematic-scene');
          gsap.to(layer, {
            yPercent: -Math.min(16, speed * 24),
            ease: 'none',
            scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        const manifesto = root.querySelector('[data-manifesto]');
        const manifestoWords = manifesto?.querySelectorAll('[data-manifesto-word]');
        if (manifesto && manifestoWords?.length) {
          gsap.fromTo(manifestoWords, { autoAlpha: 0.16, y: 10 }, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: { trigger: manifesto, start: 'top 76%', end: 'bottom 42%', scrub: 0.5 },
          });
        }

        const ticker = () => {
          videoElements.forEach(({ video }) => {
            if (video.dataset.loaded !== 'true' || video.readyState < 2 || video.seeking) return;
            const targetTime = Number(video.dataset.targetTime);
            if (Number.isFinite(targetTime) && Math.abs(video.currentTime - targetTime) > 0.04) {
              video.currentTime += (targetTime - video.currentTime) * 0.35;
            }
          });
        };
        gsap.ticker.add(ticker);

        return () => {
          journeyResponsive.revert();
          gsap.ticker.remove(ticker);
          controllers.forEach((controller) => controller.abort());
          blobUrls.forEach((url) => URL.revokeObjectURL(url));
        };
      });

      reducedMotion.add('(prefers-reduced-motion: reduce)', () => {
        root.querySelectorAll('[data-moment-panel]').forEach((panel) => panel.removeAttribute('aria-hidden'));
      });
    }, root);

    return () => {
      mediaQueryContext?.revert();
      context.revert();
    };
  }, [containerRef, videoAssets]);
}

function SceneAtmosphere({ tone }) {
  return (
    <div aria-hidden="true" className={`scene-atmosphere scene-atmosphere--${tone}`}>
      <div data-parallax-speed="0.12" data-scene-scale-to="1.06" className="parallax-layer scene-sun" />
      <div data-parallax-speed="0.26" className="parallax-layer scene-ridge scene-ridge--far" />
      <div data-parallax-speed="0.42" className="parallax-layer scene-ridge scene-ridge--near" />
      <div className="scene-rays" />
      <div className="scene-fog" />
      <div className="scene-particles" />
    </div>
  );
}

function MomentHero({ onOpenContact, videoAssets }) {
  return (
    <section
      id="hero"
      data-scene="ember"
      data-pinned-moments
      className="cinematic-scene moments-hero relative isolate overflow-hidden text-white"
    >
      <div className="moment-stage">
        <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 z-10" />
        {HERO_MOMENTS.map((moment, index) => {
          const mobile = window.matchMedia('(max-width: 767px)').matches;
          const videoFile = mobile && videoAssets.includes(moment.media.mobileVideo)
            ? moment.media.mobileVideo
            : moment.media.video;
          const videoUrl = videoFile && videoAssets.includes(videoFile)
            ? `/videos/${videoFile}`
            : undefined;

          return (
            <article
              key={moment.id}
              data-moment-panel
              aria-hidden={index !== 0}
              className={`moment-panel moment-panel--${moment.id}`}
            >
              {moment.media.image && (
                <img
                  src={moment.media.image}
                  alt=""
                  aria-hidden="true"
                  className="moment-media-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )}
              {videoUrl && (
                <video
                  data-moment-video={moment.id}
                  data-video-url={videoUrl}
                  className="moment-media-video"
                  poster={moment.media.poster}
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              )}
              <div aria-hidden="true" className="moment-media-grade" />
              <div className="moment-copy">
                <p className="moment-eyebrow">Digital menus, made more welcoming</p>
                {index === 0 ? (
                  <h1 className="moment-title">
                    {moment.title.split(' ').map((word, wordIndex, words) => (
                      <span key={`${word}-${wordIndex}`}>
                        <span className="moment-title-mask">
                          <span className="moment-title-word">{word}</span>
                        </span>
                        {wordIndex < words.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </h1>
                ) : (
                  <h2 className="moment-title">
                    {moment.title.split(' ').map((word, wordIndex, words) => (
                      <span key={`${word}-${wordIndex}`}>
                        <span className="moment-title-mask">
                          <span className="moment-title-word">{word}</span>
                        </span>
                        {wordIndex < words.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </h2>
                )}
                <p className="moment-subtitle">{moment.subtitle}</p>
                <button
                  type="button"
                  data-magnetic
                  onClick={onOpenContact}
                  className="premium-button mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#FCC133] bg-[#FCC133] px-6 text-xs font-bold uppercase tracking-[0.12em] text-[#183b34] transition hover:bg-[#ffd45e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCC133]"
                >
                  <span>Talk to our team</span><ArrowRight size={16} />
                </button>
              </div>
            </article>
          );
        })}
        <div aria-hidden="true" className="scene-particles moment-particles" />
        <div className="moment-progress" aria-label="Hero story progress">
          <div className="moment-progress__segments">
            {HERO_MOMENTS.map((moment) => (
              <span key={moment.id} className="moment-progress__track">
                <span data-moment-progress className="moment-progress__fill" />
              </span>
            ))}
          </div>
          <span className="moment-counter" aria-live="polite">
            <span className="moment-counter__current">01</span> / {String(HERO_MOMENTS.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}

function SampleMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const categories = ['All', 'Starters', 'Mains'];
  const items = menuPreview.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Starters') return item.category === 'Starters';
    return ['Biryani', 'Main Course', 'Chef Specials'].includes(item.category);
  }).filter((item) => (
    `${item.name} ${item.description}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ));

  return (
    <div className="relative mx-auto w-full max-w-[460px] rounded-[2rem] border border-white/70 bg-white p-4 shadow-[0_28px_90px_-42px_rgba(14,43,37,0.45)] sm:p-5">
      <div className="rounded-[1.5rem] bg-[#f8f6f0] p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-[#183b34]/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#898c7e]">
              Sample menu
            </p>
            <p className="mt-1 font-display text-xl text-[#183b34]">
              The lunch table
            </p>
          </div>
          <span className="rounded-full bg-[#dcebe2] px-3 py-1 text-[10px] font-semibold text-[#315b4a]">
            MENU
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="menu-tabs relative flex min-w-0 flex-1 gap-1.5" role="group" aria-label="Sample menu categories">
            <span
              aria-hidden="true"
              className="menu-tab-indicator"
              style={{ '--tab-index': categories.indexOf(activeCategory) }}
            />
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`menu-tab relative z-[1] min-h-11 flex-1 px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === category ? 'text-[#183b34]' : 'text-[#63736b] hover:text-[#183b34]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <label className="relative mt-3 block">
          <Search size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b948d]" />
          <input
            type="search"
            aria-label="Search sample menu"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-h-11 w-full rounded-full border border-[#183b34]/8 bg-white py-2 pl-9 pr-4 text-xs text-[#183b34] outline-none placeholder:text-[#9ba39b] focus:border-[#d59a0b]/50 focus:ring-2 focus:ring-[#FCC133]/30"
            placeholder="Search dishes"
          />
        </label>

        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="menu-item flex items-center gap-3 rounded-2xl bg-white p-2.5"
              style={{ animationDelay: `${index * 45}ms` }}
              onMouseEnter={(event) => {
                if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                setHoveredItem(item);
                setPreviewPosition({
                  x: Math.min(event.clientX + 24, window.innerWidth - 278),
                  y: Math.min(event.clientY + 24, window.innerHeight - 190),
                });
              }}
              onMouseMove={(event) => {
                if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                setPreviewPosition({
                  x: Math.min(event.clientX + 24, window.innerWidth - 278),
                  y: Math.min(event.clientY + 24, window.innerHeight - 190),
                });
              }}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img
                src={item.image}
                alt=""
                className="h-[68px] w-[68px] shrink-0 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-[#183b34]">{item.name}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#7b8279]">
                  {item.description}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#315b4a]">{item.price}</span>
            </article>
          ))}
          {items.length === 0 && (
            <p className="rounded-2xl bg-white px-4 py-6 text-center text-xs text-[#66736a]">
              No sample dishes match that search.
            </p>
          )}
        </div>
      </div>
      <p className="px-2 pt-3 text-center text-[10px] text-[#777c73]">
        Illustrative sample only — not a live restaurant menu
      </p>
      {hoveredItem && (
        <div
          aria-hidden="true"
          className="menu-hover-preview"
          style={{ left: previewPosition.x, top: previewPosition.y }}
        >
          <img src={hoveredItem.image} alt="" width="256" height="144" />
          <span>{hoveredItem.name}</span>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--scene-accent,#FCC133)]">
      {children}
    </p>
  );
}

export default function HomePage({ onOpenContact }) {
  const parallaxRef = useRef(null);
  const availableVideoAssets = useVideoAssets();
  useScrollChoreography(parallaxRef, availableVideoAssets);

  return (
    <>
    <div ref={parallaxRef} className="parallax-page">
    <main>
      <MomentHero onOpenContact={onOpenContact} videoAssets={availableVideoAssets} />

      <section id="product" data-scene="glacial" className="cinematic-scene cinematic-scene--glacial relative isolate scroll-mt-20 overflow-hidden px-5 py-20 text-white sm:px-8 sm:py-28">
        <SceneAtmosphere tone="glacial" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div data-scroll-reveal className="scroll-reveal max-w-3xl">
            <SectionLabel>Made for the menu moment</SectionLabel>
            <h2 className="font-display cinematic-heading max-w-3xl text-4xl leading-tight tracking-[-0.04em] text-[#f6f3eb] sm:text-5xl lg:text-6xl">
              One menu. A better experience on both sides.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/80">
              The details your team maintains become the menu your guests can browse—connected through a simple QR entry point.
            </p>
            <a href="#how-it-works" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#f2c45e] transition hover:text-white">
              See how it works <ArrowRight size={16} />
            </a>
          </div>

          <div className="product-benefit-grid mt-10 grid gap-4 md:grid-cols-3">
            <article data-scroll-reveal className="scroll-reveal product-benefit-card">
              <div className="product-benefit-card__icon">
                <Utensils size={21} />
              </div>
              <h3 className="mt-7 font-display text-2xl text-white">A clearer place to manage</h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Organize menu categories, dish details, prices, photos, and availability from the restaurant side.
              </p>
            </article>
            <article data-scroll-reveal className="scroll-reveal product-benefit-card">
              <div className="product-benefit-card__icon">
                <Smartphone size={21} />
              </div>
              <h3 className="mt-7 font-display text-2xl text-white">An easier way to browse</h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Guests open the menu in their mobile browser to explore descriptions, photos, prices, and availability—no app download needed.
              </p>
            </article>
            <article data-scroll-reveal className="scroll-reveal product-benefit-card">
              <div className="product-benefit-card__icon">
                <QrCode size={21} />
              </div>
              <h3 className="mt-7 font-display text-2xl text-white">A menu that is easy to reach</h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Place a QR code where guests need it. One scan takes them straight to the restaurant’s digital menu.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section data-manifesto data-scene="dusk" className="cinematic-scene manifesto-section relative isolate overflow-hidden px-5 py-28 text-white sm:px-8 sm:py-36">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionLabel>A menu moment, made clearer</SectionLabel>
          <p className="manifesto-copy font-display">
            <span data-manifesto-word>A clear</span>{' '}
            <span data-manifesto-word className="manifesto-key">menu.</span>{' '}
            <span data-manifesto-word>Within reach.</span>{' '}
            <span data-manifesto-word>Easy to browse.</span>{' '}
            <span data-manifesto-word className="manifesto-key">Simple to update.</span>
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        data-scene="ember"
        data-pinned-journey
        className="cinematic-scene cinematic-scene--steps pinned-journey relative isolate scroll-mt-20 overflow-clip text-white"
      >
        <SceneAtmosphere tone="ember" />
        <div className="pinned-journey__sticky relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 sm:px-8">
          <div data-scroll-reveal className="scroll-reveal mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <SectionLabel>A simple path to the table</SectionLabel>
              <h2 className="font-display cinematic-heading max-w-3xl text-4xl leading-tight tracking-[-0.02em] text-[#f6f3eb] sm:text-5xl lg:text-6xl">
                Set up once. Make the menu easy to find.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-[1.7] text-white/65">
              Keep the experience straightforward for your team and your guests—from the first menu edit to the first scan.
            </p>
          </div>
          <div className="pinned-journey__window">
            <div className="pinned-journey__track">
            {[
              { number: '01', title: 'Shape your menu', description: 'Add the categories, dishes, prices, photos, and availability details guests need.', Icon: Utensils },
              { number: '02', title: 'Create your QR code', description: 'Generate a QR code that points directly to your restaurant’s digital menu.', Icon: QrCode },
              { number: '03', title: 'Put it within reach', description: 'Place the code on tables or around your restaurant so guests can scan and browse.', Icon: Smartphone },
            ].map(({ number, title, description, Icon }) => (
              <article key={number} className={`scene-glass-card pinned-journey__slide journey-slide--${number} relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.75rem] border p-7 shadow-[0_20px_60px_-48px_rgba(0,0,0,0.55)] sm:min-h-[330px] sm:p-10`}>
                <div className="journey-slide__content">
                  <div className="flex items-start justify-between">
                    <span className="journey-slide__number font-display">{number}</span>
                    <Icon size={23} strokeWidth={1.4} className="text-[var(--scene-accent)]" />
                  </div>
                  <div className="max-w-xl">
                    <h3 className="font-display text-3xl text-white sm:text-4xl">{title}</h3>
                    <p className="mt-4 max-w-lg text-sm leading-[1.7] text-white/80 sm:text-base">{description}</p>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </div>
          <div className="journey-progress" aria-hidden="true"><span className="journey-progress__fill" /></div>
          <a data-magnetic href="#menu-preview" className="premium-button mt-8 inline-flex min-h-11 w-fit items-center gap-3 self-start rounded-full border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-[var(--scene-accent)]">
            <span>See the guest menu</span><ArrowRight size={15} />
          </a>
        </div>
      </section>

      <section id="menu-preview" data-scene="menu" className="cinematic-scene cinematic-scene--menu relative isolate flex min-h-[90svh] scroll-mt-20 items-center overflow-hidden px-5 py-20 text-white sm:px-8 sm:py-28">
        <SceneAtmosphere tone="menu" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div data-scroll-reveal data-parallax-speed="0.5" className="scroll-reveal parallax-layer order-2 min-w-0 rounded-[2rem] bg-[#fff9ec] p-4 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.65)] sm:p-6 lg:order-1">
            <SampleMenu />
          </div>
          <div data-scroll-reveal className="scroll-reveal order-1 min-w-0 lg:order-2">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#FCC133]">
              The guest view
            </p>
            <h2 className="font-display cinematic-heading text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
              Give every dish room to speak.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-white/75">
              A scan opens a mobile-friendly menu in the guest’s browser. Clear categories, dish descriptions, photos, prices, and availability help guests find what they’re looking for.
            </p>
            <ul className="mt-7 grid gap-3 text-sm text-white/85 sm:grid-cols-2">
              {['Browse by category', 'Search for a dish', 'See prices and details', 'No app installation'].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CircleCheck size={17} className="shrink-0 text-[#FCC133]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-xs leading-5 text-white/55">
              The menu shown here is an illustrative sample—not a live restaurant or Scanzaa account.
            </p>
            <a href="#contact" className="premium-button mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-[#FCC133] bg-[#FCC133] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#183b34] transition hover:bg-[#ffd45e]">
              Ask about your menu <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section id="faq" data-scene="dusk" className="cinematic-scene cinematic-scene--faq relative isolate flex min-h-[78svh] scroll-mt-20 items-center overflow-hidden px-5 py-20 text-white sm:px-8 sm:py-28">
        <SceneAtmosphere tone="dusk" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div data-scroll-reveal className="scroll-reveal">
            <SectionLabel>Good to know</SectionLabel>
            <h2 className="font-display cinematic-heading text-4xl leading-tight tracking-[-0.04em] text-[#f6f3eb] sm:text-5xl">
              A few quick answers.
            </h2>
            <p className="mt-4 max-w-sm leading-7 text-white/65">Still have a question? Our team can help you explore the right setup.</p>
            <button type="button" onClick={onOpenContact} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#FCC133] transition hover:text-white">
              Talk to Scanzaa <ArrowRight size={16} />
            </button>
          </div>
          <div data-scroll-reveal className="scroll-reveal divide-y divide-white/12 border-y border-white/12">
            {questions.map(({ question, answer }) => (
              <details key={question} className="group border-b border-white/10 py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-[#f6f3eb] [&::-webkit-details-marker]:hidden">
                  <span>{question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCC133]/15 text-[#FCC133] transition group-open:rotate-180">
                    <ChevronDown size={17} />
                  </span>
                </summary>
                <div className="faq-answer-grid">
                  <div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">{answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" data-scene="contact" className="cinematic-scene cinematic-scene--contact relative isolate flex min-h-[82svh] scroll-mt-20 items-center overflow-hidden px-5 py-20 text-white sm:px-8 sm:py-28">
        <SceneAtmosphere tone="contact" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-scroll-reveal className="scroll-reveal">
            <SectionLabel>Start a conversation</SectionLabel>
            <h2 className="font-display cinematic-heading text-4xl leading-tight tracking-[-0.04em] text-[#f6f3eb] sm:text-5xl">
              Let’s talk about your restaurant.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-white/68">
              Leave your details and the Scanzaa team can get in touch about setting up a digital menu.
            </p>
            <div className="mt-8 flex items-start gap-3 text-sm leading-6 text-white/65">
              <CircleHelp size={18} className="mt-0.5 shrink-0 text-[#FCC133]" />
              <p>Share your contact details below to request a conversation with our team.</p>
            </div>
          </div>
          <div data-scroll-reveal className="scroll-reveal rounded-[1.75rem] border border-white/10 bg-[#f7f5ef] p-6 text-[#183b34] shadow-[0_24px_70px_-48px_rgba(0,0,0,0.8)] sm:p-9">
            <LeadCaptureForm />
          </div>
        </div>
      </section>
    </main>
    <Footer onOpenContact={onOpenContact} />
    </div>
    </>
  );
}
