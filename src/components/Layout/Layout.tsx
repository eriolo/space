import s from './Layout.module.css'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return <main className={s.container}>{children}</main>
}

export default Layout
