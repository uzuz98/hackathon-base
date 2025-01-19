import '@repo/ui/globals.css'
import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import Layout from '../layouts'
import Provider from '../provider'
import { ToastContainer } from 'react-toastify'
const bricolage_grotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'Create Turborepo',
  description: 'Just do it!!!',
}

export default function RootLayout({ children }: { children: React.ReactElement }): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${bricolage_grotesque.className} antialiased`}>
        <Provider>
          <Layout>{children}</Layout>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  )
}
