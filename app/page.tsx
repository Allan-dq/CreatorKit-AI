import Link from "next/link";

export const metadata = {
  title: "CreatorKit AI — Agentic Design Studio",
  description: "Turn creator campaign briefs into design-system-compliant prototypes, assets, and evaluation evidence.",
};

export default function Home() {
  return (
    <main className="launch-shell">
      <nav className="launch-nav" aria-label="Primary navigation">
        <Link className="wordmark" href="/" aria-label="CreatorKit AI home">
          <span className="wordmark-glyph" aria-hidden="true">C</span>
          <span>CreatorKit <strong>AI</strong></span>
        </Link>
        <div className="launch-nav-links">
          <Link href="/design-system">System</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/case-study">Case study</Link>
        </div>
        <Link className="launch-nav-action" href="/studio">Open Studio <span aria-hidden="true">↗</span></Link>
      </nav>

      <section className="launch-hero">
        <div className="launch-copy">
          <p className="eyebrow"><span /> AGENTIC DESIGN WORKSPACE</p>
          <h1>From creative brief<br />to <em>system-ready.</em></h1>
          <p className="launch-lede">
            A human-guided studio where specialist agents compose validated interfaces,
            direct original assets, and turn every decision into inspectable evidence.
          </p>
          <div className="launch-actions">
            <Link className="primary-cta" href="/studio">Start a generation <span aria-hidden="true">→</span></Link>
            <Link className="text-cta" href="/case-study">Explore the system <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="launch-proof" aria-label="Key product capabilities">
            <span><b>07</b> specialist agents</span>
            <span><b>14</b> governed components</span>
            <span><b>100%</b> local demo mode</span>
          </div>
        </div>

        <div className="launch-preview" aria-label="CreatorKit Studio preview">
          <div className="preview-chrome">
            <div className="preview-brand"><span className="preview-mark">C</span> CreatorKit</div>
            <div className="preview-step">RUN 04 · COMPOSING</div>
            <div className="preview-avatar">QP</div>
          </div>
          <div className="preview-body">
            <aside className="preview-rail" aria-hidden="true">
              <span className="active">✦</span><span>⌁</span><span>◫</span><span>◎</span>
              <i /><span>?</span>
            </aside>
            <section className="preview-canvas">
              <div className="preview-kicker"><span /> LIVE CANVAS <b>375 × 812</b></div>
              <div className="phone-frame">
                <div className="phone-hero">
                  <span className="phone-pill">LIVE · FRIDAY</span>
                  <div className="orbit one" /><div className="orbit two" />
                  <h2>MAKE<br />SOMETHING<br /><em>LOUD.</em></h2>
                  <p>A live creative sprint with three makers and one hour on the clock.</p>
                  <button type="button">Set reminder <span>→</span></button>
                </div>
              </div>
              <div className="frame-label"><span>LAUNCH FLOW / A</span><b>✓ 14 checks</b></div>
            </section>
            <aside className="preview-trace">
              <div className="trace-title"><span>Agent trace</span><b>LIVE</b></div>
              <div className="trace-item done"><i>✓</i><div><strong>Brief Analyst</strong><small>9 requirements mapped</small></div><time>0.2s</time></div>
              <div className="trace-item done"><i>✓</i><div><strong>System Librarian</strong><small>6 contracts retrieved</small></div><time>0.1s</time></div>
              <div className="trace-item active"><i>✦</i><div><strong>Prototype Composer</strong><small>Building structured spec…</small></div><time>1.4s</time></div>
              <div className="trace-item"><i>4</i><div><strong>Asset Art Director</strong><small>Waiting for plan</small></div></div>
              <div className="trace-note"><b>VALIDATION</b><span>Only approved components can render.</span><code>spec.schema.valid</code></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="launch-marquee" aria-label="Workflow summary">
        <span>BRIEF</span><i>→</i><span>ORCHESTRATE</span><i>→</i><span>COMPOSE</span><i>→</i><span>CRITIQUE</span><i>→</i><span>MEASURE</span>
      </section>
    </main>
  );
}
