import { AuthProvider } from '@/hooks/auth-hook'
import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ReduxProvider } from '@/hooks/app-store/store-hook'

const poppins = Poppins({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'AnoniChat',
  description: 'Anonimous web-chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
