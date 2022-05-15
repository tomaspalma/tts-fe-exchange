import React from 'react'
import Header from './Header'
import Footer from './Footer'

type Props = {
  children: JSX.Element
  location: string
}

const Layout = ({ children, location }: Props) => {
  return (
    <div className="layout">
      <Header location={location} siteTitle="TTS Revamp" />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
