import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Landing: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  if (fileData.slug !== "index" && fileData.slug !== "about") {
    return null
  }

  const isAboutPage = fileData.slug === "about"

  return (
    <div class={classNames(displayClass, "cyber-marine-landing")}>
      {/* Minimalist Background Layers */}
      <div class="dot-pattern"></div>
      <div class="aura-glow"></div>
      <div class="glow-point p1"></div>
      <div class="glow-point p2"></div>

      <header class={isAboutPage ? "about-portal" : "hero-section"}>
        <nav class="glass-nav">
          <div class="nav-container">
            <div class="brand">
              <span class="brand-icon">🦞</span>
              <span class="brand-name">OPENCLAW</span>
            </div>
            <div class="nav-links">
              <a href="/" data-text="首頁">首頁</a>
              <a href="#mission" data-text="專案">專案</a>
              <a href="/tags/OpenClaw" data-text="部落格">部落格</a>
              <a href="https://clawdbot520.gitbook.io/e-book/" data-text="著作" target="_blank">著作</a>
              <button id="darkmode-toggle" class="darkmode theme-toggle" aria-label="Toggle Theme">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              </button>
            </div>
          </div>
        </nav>

        {isAboutPage ? (
          <div class="contact-portal">
            <div class="portal-header">
              <span class="portal-badge">CONTACT CENTER</span>
              <h1 class="portal-title">聯絡<span>資訊</span></h1>
            </div>
            <div class="contact-strip standalone">
              <div class="contact-label">STRATEGIC PARTNERSHIP?</div>
              <div class="contact-details">
                <a href="mailto:clawdbot520@gmail.com" class="c-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>clawdbot520@gmail.com</span>
                </a>
                <a href="tel:0921764272" class="c-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>0921-764-272</span>
                </a>
              </div>
              <div class="contact-socials">
                <a href="https://www.facebook.com/acandy.chang/" aria-label="Facebook" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://github.com/clawdbot520" aria-label="GitHub" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://www.youtube.com/@ClawdBot-e5v" aria-label="YouTube" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                <a href="https://clawdbot520.gitbook.io/e-book/" aria-label="GitBook" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </a>
                <a href="https://x.com/acandy0301" aria-label="X" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div class="hero-content">
            <div class="intro-reveal">
              <span class="shimmer-text">PROTOCOL V1.0.0 ACTIVE</span>
            </div>
            <h1 class="modern-title">
              打造你專屬的<br/>
              <span class="gradient-text">數位AI代理人</span>
            </h1>
            <p class="hero-lead">
              跨越單向對話的局限，建構具備自主執行力的數位分身。我們將複雜技術轉化為專業級自動化動力，助您實現真正的技術自由。
            </p>
          </div>
        )}

        {!isAboutPage && (
          <div class="scroll-indicator">
            <div class="mouse"></div>
            <span>SCROLL TO DIVE</span>
          </div>
        )}
      </header>

      {!isAboutPage && (
        <main id="vault" class="content-grid">
          <section class="grid-intro">
            <h2 class="depth-title">系統化培育學<span>METHODOLOGY</span></h2>
            <p>從底層邏輯到高階自動化的數位代理人進化之路</p>
          </section>

          <div class="asymmetric-layout">
            {/* O1 - Large Feature */}
            <a href="./O1---OpenClaw從０開始" class="card-large">
              <div class="card-visual" style="background-image: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop');"></div>
              <div class="card-info">
                <span class="label">MODULE 01</span>
                <h3>新時代的指揮官思維</h3>
                <p>掌握數位代理人的核心邏輯，開啟您的自動化指揮生涯。</p>
              </div>
            </a>

            {/* Small Cards */}
            <div class="cards-stack">
              <a href="./O2---為什麼是OpenClaw--怎麼建立的環境" class="card-small">
                <div class="card-num">02</div>
                <div class="card-body">
                  <h4>基礎設施建置</h4>
                  <p>部署高效率且具備擴充性的執行環境。</p>
                </div>
              </a>
              <a href="./O3---怎麼幫你的OpenClaw建立專業化的角色和技能" class="card-small">
                <div class="card-num">03</div>
                <div class="card-body">
                  <h4>核心協議定義</h4>
                  <p>賦予代理人精準的專業職能與執行準則。</p>
                </div>
              </a>
              <a href="./O4--Openclaw-如何從錯誤中自我學習，越用越聰明" class="card-small">
                <div class="card-num">04</div>
                <div class="card-body">
                  <h4>自我進化模型</h4>
                  <p>建立持續優化的閉環系統，讓系統隨時間增值。</p>
                </div>
              </a>
            </div>
          </div>

          {/* O5 - Break the grid */}
          <section class="break-section">
            <a href="./O5---一個OpenClaw不夠用，角色切來切去失憶，怎麼解決？" class="wide-banner">
              <div class="banner-text">
                <span class="badge-neon">ADVANCED PROTOCOL</span>
                <h3>多 Agent 協作：構建高效能數位軍團</h3>
                <p>超越單點應用，實現多代理人之間的戰術分工與專業連動。</p>
              </div>
              <div class="banner-visual">🏗️</div>
            </a>
          </section>

          <section id="mission" class="project-suite">
            <h2 class="depth-title">實戰案例集<span>SOLUTIONS</span></h2>
            <div class="project-matrix">
              {[
                { id: "P.01", title: "自動化架站", type: "DEPLOY", slug: "P1---利用OpenCLaw架設網頁-入門---從0到1到自動化發布" },
                { id: "P.02", title: "網域與基建", type: "INFRA", slug: "P2---利用OpenClaw架設網頁-進階----用自己的網域建立變現的基礎設施" },
                { id: "P.03", title: "後台監控面板", type: "MONITOR", slug: "P3---想知道OpenClaw在背著你八卦什麼--Agent-Monitor-Board-告訴你" },
                { id: "P.04", title: "知識庫深度整合", type: "DATABASE", slug: "P4---覺得OpenClaw亂回答或是在幻想--NotebookLM-自建資料庫，給你放心的答案．" },
                { id: "P.05", title: "Podcast 語音流水線", type: "AUDIO", slug: "P5---沒時間刷Podcast--用一句話讓OpenClaw-幫你生成筆記" },
                { id: "P.06", title: "Claude Code 遙控器", type: "REMOTE", slug: "P6---Claude-Code沒有買Max-plan又想remote-control--讓OpenClaw幫你" }
              ].map((p, i) => (
                <a href={`./${p.slug}`} class="matrix-item" style={`animation-delay: ${i * 0.1}s`}>
                  <div class="m-head">
                    <span class="m-id">{p.id}</span>
                    <span class="m-type">{p.type}</span>
                  </div>
                  <h4>{p.title}</h4>
                  <div class="m-line"></div>
                </a>
              ))}
            </div>
          </section>
          <section id="contact" class="contact-suite">
            <div class="contact-strip">
              <div class="contact-label">STRATEGIC PARTNERSHIP?</div>
              <div class="contact-details">
                <a href="mailto:clawdbot520@gmail.com" class="c-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>clawdbot520@gmail.com</span>
                </a>
                <a href="tel:0921764272" class="c-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>0921-764-272</span>
                </a>
              </div>
              <div class="contact-socials">
                <a href="https://www.facebook.com/acandy.chang/" aria-label="Facebook" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://github.com/clawdbot520" aria-label="GitHub" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://www.youtube.com/@ClawdBot-e5v" aria-label="YouTube" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                <a href="https://clawdbot520.gitbook.io/e-book/" aria-label="GitBook" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </a>
                <a href="https://x.com/acandy0301" aria-label="X" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                </a>
                <a href="/about" class="contact-cta">GET IN TOUCH →</a>
              </div>
            </div>
          </section>
        </main>
      )}

      <footer class="cyber-footer">
        <div class="footer-wrap">
          <div class="footer-brand">ALPHA ACCESS V2.0</div>
          <div class="footer-info">© 2026 ALAN CHANG. ALL ORDERS CONFIRMED.</div>
        </div>
      </footer>
    </div>
  )
}

Landing.css = `
:root {
  --accent-main: #6366f1;
  --accent-soft: #818cf8;
  --bg-main: #fcfcfc;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --border-color: rgba(0, 0, 0, 0.06);
  --font-display: 'Plus Jakarta Sans', "Noto Sans TC", sans-serif;
  --font-body: 'Inter', "Noto Sans TC", sans-serif;
}

[saved-theme='dark'] {
  --bg-main: #0a0a0a;
  --text-main: #f9fafb;
  --text-muted: #9ca3af;
  --glass-bg: rgba(17, 24, 39, 0.7);
  --border-color: rgba(255, 255, 255, 0.08);
}

.cyber-marine-landing {
  background-color: var(--bg-main);
  color: var(--text-main);
  transition: all 0.5s ease;
  font-family: var(--font-body);
  position: relative;
  min-height: 100vh;
}

/* Minimalist Effects */
.dot-pattern {
  position: fixed; inset: 0; z-index: -2;
  background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
  background-size: 24px 24px;
}

.aura-glow {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 100vw; height: 100vh;
  background: radial-gradient(circle at center, var(--accent-soft) 0%, transparent 60%);
  opacity: 0.1; z-index: -1; pointer-events: none;
}

.glow-point {
  position: fixed; border-radius: 50%; filter: blur(100px); z-index: -1; opacity: 0.15;
}
.p1 { background: var(--accent-main); top: -10%; right: 10%; width: 40vw; height: 40vw; }
.p2 { background: var(--accent-soft); bottom: -10%; left: 10%; width: 50vw; height: 50vw; }

/* Navigation */
.glass-nav {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.4);
  [saved-theme='dark'] & { background: rgba(0, 0, 0, 0.4); }
}

.nav-container {
  max-width: 1400px; margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex; justify-content: space-between; align-items: center;
}

.brand { display: flex; align-items: center; gap: 0.8rem; }
.brand-icon { font-size: 1.5rem; }
.brand-name { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; letter-spacing: 0.2em; }

.nav-links { display: flex; gap: 3rem; align-items: center; }
.nav-links a { 
  text-decoration: none; color: var(--text-main); font-size: 0.8rem; letter-spacing: 0.1em;
  font-weight: 700; text-transform: uppercase; opacity: 0.6; transition: 0.3s;
  position: relative;
}
.nav-links a:hover { opacity: 1; color: var(--cyber-blue); }

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.theme-toggle:hover { opacity: 1; }

.theme-toggle .sun { display: none; }
.theme-toggle .moon { display: block; }

[saved-theme='dark'] .theme-toggle .sun { display: block; }
[saved-theme='dark'] .theme-toggle .moon { display: none; }

.btn-glow {
  padding: 0.5rem 1.5rem; border: 1px solid var(--cyber-blue);
  color: var(--cyber-blue) !important; border-radius: 4px;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
}

/* Hero */
.hero-section {
  height: 80vh; display: flex; flex-direction: column;
  justify-content: center; align-items: center; text-align: center;
  position: relative; padding: 0 1rem;
}

.modern-title {
  font-family: var(--font-display); font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800; color: var(--text-main); margin: 0; line-height: 1.1;
  letter-spacing: -0.02em;
  animation: float-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-main), var(--accent-soft));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes float-up {
  from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.hero-lead {
  font-size: 1.25rem; max-width: 650px;
  color: var(--text-muted); margin: 2rem 0 3rem;
  line-height: 1.6; font-weight: 400;
  animation: float-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.text-reveal-step1 { animation: blur-in 1s cubic-bezier(0, 0, 0.2, 1) both; }
.text-reveal-step2 { animation: blur-in 1s cubic-bezier(0, 0, 0.2, 1) 0.2s both; }
.text-reveal-step3 { 
  animation: blur-in 1.2s cubic-bezier(0, 0, 0.2, 1) 0.4s both, shimmer 3s infinite linear;
  background: linear-gradient(90deg, var(--neon-orange), #fff, var(--neon-orange));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

@keyframes blur-in {
  from { opacity: 0; filter: blur(20px); transform: scale(0.9); }
  to { opacity: 1; filter: blur(0); transform: scale(1); }
}

.hero-cta-group { display: flex; gap: 2rem; }

.btn-cyber {
  position: relative; padding: 1.2rem 3.5rem;
  text-decoration: none !important; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  transition: 0.3s; overflow: hidden;
}

.btn-cyber.primary { background: var(--text-main); color: var(--deep-ocean) !important; }
.btn-cyber.secondary { border: 1px solid var(--border-color); color: var(--text-main) !important; }

.btn-cyber:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

/* Grid Content */
.content-grid {
  max-width: 1300px; margin: 0 auto; padding: 5rem 2rem;
}

.depth-title {
  font-family: var(--font-display); font-size: 3rem; margin-bottom: 1rem;
}
.depth-title span {
  display: block; font-size: 0.8rem; color: var(--cyber-blue);
  letter-spacing: 0.5em; opacity: 0.5; margin-top: 0.5rem;
}

.asymmetric-layout {
  display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; margin-top: 4rem;
}

.card-large {
  position: relative; border-radius: 12px; overflow: hidden;
  height: 600px; text-decoration: none !important;
}
.card-visual {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-size: cover; background-position: center; transition: 0.5s;
}
.card-large:hover .card-visual { transform: scale(1.05); }

.card-large::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(0deg, rgba(5, 10, 21, 0.9) 0%, transparent 60%);
}

.card-info {
  position: absolute; bottom: 0; left: 0; padding: 3.5rem; z-index: 10;
}
.label { font-size: 0.7rem; font-weight: 800; color: var(--neon-orange); letter-spacing: 0.2em; }
.card-info h3 { font-size: 2.5rem; margin: 0.8rem 0; color: #fff; }

.cards-stack { display: flex; flex-direction: column; gap: 1.5rem; }

.card-small {
  background: var(--glass-bg); padding: 2.5rem; border: 1px solid var(--border-color);
  border-radius: 8px; text-decoration: none !important; display: flex; gap: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative; overflow: hidden;
}
.card-small:hover { 
  background: var(--light); 
  border-color: var(--cyber-blue); 
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  [saved-theme='dark'] & { background: rgba(255, 255, 255, 0.05); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }
}

.card-num { font-family: var(--font-display); font-size: 1.2rem; color: var(--cyber-blue); opacity: 0.5; }
.card-body h4 { margin: 0 0 0.5rem; color: var(--text-main); font-size: 1.3rem; }
.card-body p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }

/* Break Section */
.break-section { margin-top: 6rem; }
.wide-banner {
  background: linear-gradient(90deg, #1e3a8a, #0f172a);
  padding: 4rem; border-radius: 12px; display: flex; justify-content: space-between;
  align-items: center; text-decoration: none !important;
}
.badge-neon { color: var(--neon-orange); border: 1px solid var(--neon-orange); padding: 0.2rem 0.6rem; font-size: 0.7rem; font-weight: 800; }
.wide-banner h3 { font-size: 2rem; color: #fff; margin: 1.5rem 0 0.8rem; }
.banner-visual { font-size: 6rem; opacity: 0.2; }

/* Project Matrix */
.project-matrix {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem;
}
.matrix-item {
  background: var(--glass-bg); border: 1px solid var(--border-color);
  padding: 2.5rem; text-decoration: none !important; transition: all 0.3s ease;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.matrix-item:hover { 
  transform: translateY(-8px);
  border-color: var(--accent-soft);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  background: #fff;
}

[saved-theme='dark'] .matrix-item:hover { background: #111; }

.m-head { display: flex; justify-content: space-between; margin-bottom: 2rem; }
.m-id { font-family: var(--font-display); font-size: 0.7rem; color: var(--neon-orange); }
.m-type { font-size: 0.6rem; letter-spacing: 0.2em; opacity: 0.5; font-weight: 800; }
.matrix-item h4 { margin: 0; font-size: 1.1rem; color: var(--text-main); line-height: 1.4; }
.matrix-item:hover * { color: #fff !important; opacity: 1 !important; }

/* Contact Suite */
.contact-suite {
  margin-top: 10rem;
}

.contact-strip {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 3rem 4rem;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.contact-label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--cyber-blue);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.c-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--text-main);
  text-decoration: none !important;
  font-weight: 600;
  font-size: 1.1rem;
  transition: 0.3s;
}

.c-item:hover {
  color: var(--cyber-blue);
  transform: translateX(5px);
}

.contact-socials {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

/* About Portal */
.about-portal {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  background: var(--deep-ocean);
}

.contact-portal {
  max-width: 900px;
  width: 100%;
  text-align: center;
  z-index: 10;
}

.portal-header {
  margin-bottom: 4rem;
}

.portal-badge {
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--cyber-blue);
  letter-spacing: 0.5em;
  display: block;
  margin-bottom: 1rem;
}

.portal-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  text-transform: uppercase;
  margin: 0;
  color: var(--text-main);
}

.portal-title span {
  color: var(--neon-orange);
}

.contact-strip.standalone {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  flex-direction: column;
  gap: 3rem;
  padding: 5rem;
  text-align: center;
}

.contact-strip.standalone .contact-socials {
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-strip.standalone .contact-details {
  align-items: center;
}

.contact-socials a {
  color: var(--text-main);
  opacity: 0.6;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.contact-socials a:hover {
  opacity: 1;
  transform: translateY(-3px);
}

.contact-cta {
  background: var(--cyber-blue);
  color: #fff !important;
  padding: 0.8rem 1.8rem;
  border-radius: 100px;
  text-decoration: none !important;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  margin-left: 1rem;
}

.cyber-footer { padding: 4rem 2rem; border-top: 1px solid var(--border-color); margin-top: 6rem; }
.footer-wrap { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; opacity: 0.4; font-size: 0.7rem; font-family: var(--font-display); }

@media (max-width: 1000px) {
  .asymmetric-layout { grid-template-columns: 1fr; }
  .project-matrix { grid-template-columns: 1fr; }
  .card-large { height: 400px; }
  .wide-banner { padding: 2rem; flex-direction: column; text-align: center; }
}

/* Force-Hide Sidebars on Index and List Pages (Tags/Folders) */
[data-slug="index"] .left,
[data-slug="index"] .right,
[data-slug="index"] .article-title,
[data-slug="index"] .content-meta,
[data-slug="index"] tag-list,
[data-slug="index"] article,
[data-slug="index"] .page-footer > hr,
[data-slug="about"] .left,
[data-slug="about"] .right,
[data-slug="about"] .article-title,
[data-slug="about"] .content-meta,
[data-slug="about"] tag-list,
[data-slug="about"] article,
[data-slug="about"] .page-footer > hr,
.template-list .left,
.template-list .right {
  display: none !important;
}

[data-slug="index"] .center,
[data-slug="about"] .center,
.template-list .center {
  grid-column: 1 / -1 !important;
  width: 100% !important;
  max-width: 100% !important;
}

[data-slug="index"] .page-header,
[data-slug="about"] .page-header,
.template-list .page-header {
  margin-bottom: 0;
}
`

export default (() => Landing) satisfies QuartzComponentConstructor
