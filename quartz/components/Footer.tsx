import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-5728334128915716"
             data-ad-slot="5173108348"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <div style="margin-top: 1rem;">
          <a href="https://www.buymeacoffee.com/clawdbot520" target="_blank">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 145px !important;" />
          </a>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
