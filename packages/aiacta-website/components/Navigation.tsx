import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

export function Navigation() {
  const [hasScrolled, setScrolled] = React.useState(false);
  React.useLayoutEffect(() => {
    window.addEventListener('scroll', () =>
      setScrolled(window.pageYOffset > 0),
    );
  }, []);

  const { pathname } = useRouter();

  console.log(pathname);

  return (
    <nav
      id="header"
      className={`w-full z-30 top-0 bg-white py-1 ${
        hasScrolled ? 'lg:my-6 lg:py-0' : 'lg:py-6 lg:my-0'
      } transition-all sticky ${hasScrolled ? 'shadow-md' : ''}`}
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 lg:py-6">
        <div className="pl-4 flex items-center">
          <Link href="/">
            <a className="no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
              Aiacta
            </a>
          </Link>
        </div>

        <div className="block lg:hidden pr-4">
          <button
            id="nav-toggle"
            className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-800 hover:border-green-500 appearance-none focus:outline-none"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        <div
          className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 text-black p-4 lg:p-0 z-20"
          id="nav-content"
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              <Link href="/">
                <a
                  className={`inline-block py-2 px-4 text-black no-underline ${
                    pathname === '/'
                      ? 'font-bold'
                      : 'hover:text-gray-800 hover:text-underline'
                  }`}
                >
                  Homepage
                </a>
              </Link>
            </li>
            <li className="mr-3">
              <Link href="/how-to-setup">
                <a
                  className={`inline-block py-2 px-4 text-black no-underline ${
                    pathname === '/how-to-setup'
                      ? 'font-bold'
                      : 'hover:text-gray-800 hover:text-underline'
                  }`}
                >
                  How to setup
                </a>
              </Link>
            </li>
            <li className="mr-3">
              <Link href="/features">
                <a
                  className={`inline-block py-2 px-4 text-black no-underline ${
                    pathname === '/features'
                      ? 'font-bold'
                      : 'hover:text-gray-800 hover:text-underline'
                  }`}
                >
                  Features
                </a>
              </Link>
            </li>
          </ul>
          <Link href="https://play.aiacta.com">
            <a>
              <button
                id="navAction"
                className="bg-gradient-to-r from-red-200 to-yellow-400 mx-auto lg:mx-0 text-gray-800 font-extrabold rounded mt-4 lg:mt-0 py-4 px-8 shadow opacity-75"
              >
                Play now
              </button>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
