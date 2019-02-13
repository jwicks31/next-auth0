import React from 'react'
import Link from 'next/link'
import { bool } from 'prop-types'

const links = [
  { href: 'https://github.com/jwicks31', label: 'Github: Jwicks31' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Nav = ({ isLoggedIn }) => (
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
      </li>
      {
        isLoggedIn ? 
        <li>
          <Link prefetch href="/user">
            <a>User</a>
          </Link>
        </li> : null
      }
      {
        isLoggedIn ? 
        <li>
          <Link prefetch href="/logout">
            <a>Logout</a>
          </Link>
        </li> : 
        <li>
          <Link prefetch href="/login">
            <a>Login</a>
          </Link>
        </li>
      }
      <ul>
        {links.map(({ key, href, label }) => (
          <li key={key}>
            <Link href={href}>
              <a>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </ul>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>
  </nav>
)

Nav.propTypes = {
  isLoggedIn: bool,
}

export default Nav
