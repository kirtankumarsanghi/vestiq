'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const FEATURES = [
  {
    title: 'Portfolio Intelligence',
    description:
      'AI allocation engine balances growth, downside control, and liquidity across equity, debt, gold, and global assets.',
  },
  {
    title: 'Rebalancing Assistant',
    description:
      'Auto-detects drift, quantifies impact, and recommends precise trade amounts instead of generic advice.',
  },
  {
    title: 'Goal Forecasting',
    description:
      'Run live what-if simulations for SIP, horizon, and return assumptions with realistic probability bands.',
  },
  {
    title: 'Actionable Insights',
    description:
      'Readable insights with context on macro events, exposure, and tax-smart portfolio actions.',
  },
];

const STEPS = [
  {
    label: 'Profile Setup',
    detail: 'Capture your goal, horizon, SIP cadence, and risk tolerance in under two minutes.',
  },
  {
    label: 'AI Allocation',
    detail: 'Engine proposes diversified target weights and explains trade-offs in plain language.',
  },
  {
    label: 'Execution + Monitoring',
    detail: 'Track drift, run what-if simulation, and receive high-signal alerts only when needed.',
  },
];

const SOCIAL_PROOF = [
  {
    quote:
      'The interface feels like a private-bank dashboard but simple enough for a weekly 15-minute review.',
    author: 'Product Investor, Mumbai',
  },
  {
    quote: 'Vestiq finally made my SIP and long-term target planning feel connected, not fragmented.',
    author: 'Founder, Bengaluru',
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="landing-wrap">
        <section className="section-nav" aria-label="Landing section navigation">
          <a href="#home" className="btn btn-ghost btn-sm">
            Home
          </a>
          <a href="#features" className="btn btn-ghost btn-sm">
            Features
          </a>
          <a href="#how-it-works" className="btn btn-ghost btn-sm">
            How It Works
          </a>
          <a href="#pricing" className="btn btn-ghost btn-sm">
            Pricing
          </a>
        </section>

        <section className="hero-panel" id="home">
          <div className="hero-layout">
            <div className="hero-content">
              <p className="hero-kicker">Vestiq Wealth Co-Pilot</p>
              <h1>
                A premium investing workspace for
                <span> serious long-term wealth building.</span>
              </h1>
              <p>
                Build a resilient portfolio, track goal probability, and receive AI-powered actions in one focused
                dashboard.
              </p>
              <div className="hero-actions">
                <Link href="/onboarding" className="btn btn-primary btn-lg">
                  Start Your Plan
                </Link>
                <Link href="/dashboard" className="btn btn-ghost btn-lg">
                  Explore Dashboard
                </Link>
              </div>
            </div>

            <aside className="hero-preview" aria-label="Portfolio snapshot preview">
              <header>
                <p className="hero-kicker">Live Snapshot</p>
                <h3>Target Momentum</h3>
              </header>
              <div className="preview-metric">
                <span>Projected Corpus</span>
                <strong>₹1.84 Cr</strong>
              </div>
              <div className="preview-metric">
                <span>Goal Probability</span>
                <strong>81%</strong>
              </div>
              <div className="preview-progress" role="img" aria-label="81 percent progress">
                <div />
              </div>
              <p className="preview-note">Increase SIP by ₹4,000 to move probability near 90% in current model.</p>
            </aside>
          </div>

          <div className="hero-metrics">
            <article>
              <strong>94%</strong>
              <span>Goal tracking accuracy</span>
            </article>
            <article>
              <strong>18 min</strong>
              <span>Average weekly review time</span>
            </article>
            <article>
              <strong>3.1x</strong>
              <span>Median uplift vs idle cash</span>
            </article>
          </div>
        </section>

        <section className="feature-grid" id="features">
          {FEATURES.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className="strategy-panel" id="how-it-works">
          <div className="strategy-head">
            <p className="hero-kicker">How It Works</p>
            <h2>From onboarding to action in a clear three-step flow.</h2>
          </div>
          <div className="strategy-grid">
            {STEPS.map((step, index) => (
              <article key={step.label} className="strategy-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="social-proof">
          {SOCIAL_PROOF.map((item) => (
            <article key={item.author}>
              <p>“{item.quote}”</p>
              <span>{item.author}</span>
            </article>
          ))}
        </section>

        <section className="cta-banner" id="pricing">
          <div>
            <p className="hero-kicker">Production Ready Setup</p>
            <h2>Institutional-grade UX. Retail-friendly clarity.</h2>
            <p>Onboarding, portfolio construction, rebalancing, insights, and notifications are fully integrated.</p>
          </div>
          <Link href="/onboarding" className="btn btn-secondary btn-lg">
            Build My Portfolio
          </Link>
        </section>
      </main>
    </>
  );
}