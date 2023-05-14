import './globals.css'
import SupabaseProvider from './supabase-provider'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'flode',
  description: 'the to-do list app for builders',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* {children} */}
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  )
}
