/**
 * Layout padrão: ondas + logo opcional + cartão centralizado.
 */
import WaveBackground from './WaveBackground'
import Logo from './Logo'
import Card from './Card'

export default function PageLayout({
  children,
  showLogo = true,
  wide = false,
  logoSize = 'md',
}) {
  return (
    <WaveBackground>
      <div className="page-layout-inner">
        {showLogo && <Logo size={logoSize} />}
        <Card wide={wide}>{children}</Card>
      </div>
    </WaveBackground>
  )
}
