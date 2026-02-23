import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Navigation: QuartzComponent = ({ }: QuartzComponentProps) => {
  return (
    <nav class="nav-header">
      <a href="/">首頁</a>
      <a href="/about">關於我</a>
      <a href="https://clawdbot520.fyi/contact">聯繫我</a>
      <a href="/tags/案例">案例</a>
    </nav>
  )
}

Navigation.css = `
.nav-header {
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  background: var(--light);
  border-bottom: 1px solid var(--gray);
}

.nav-header a {
  color: var(--dark);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-header a:hover {
  color: var(--secondary);
}

@media (prefers-color-scheme: dark) {
  .nav-header {
    background: var(--light);
  }
}
`

export default (() => Navigation) satisfies QuartzComponentConstructor
