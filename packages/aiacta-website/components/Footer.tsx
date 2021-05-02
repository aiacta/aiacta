import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white ">
      <div className="container mx-auto mt-8 px-8">
        <div className="w-full flex flex-col md:flex-row py-6">
          <div className="flex-1 mb-6">
            <Link href="/">
              <a className="text-orange-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
                Aiacta
              </a>
            </Link>
          </div>

          <div className="flex-1">
            <p className="uppercase font-extrabold text-gray-500 md:mb-6">
              Links
            </p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/faq">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    FAQ
                  </a>
                </Link>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/help">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Help
                  </a>
                </Link>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/support">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Support
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="uppercase font-extrabold text-gray-500 md:mb-6">
              Legal
            </p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/tos">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Terms
                  </a>
                </Link>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/privacy">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Privacy
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="uppercase font-extrabold text-gray-500 md:mb-6">
              Social
            </p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="https://www.reddit.com">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Reddit
                  </a>
                </Link>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="https://www.twitter.com">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Twitter
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="uppercase font-extrabold text-gray-500 md:mb-6">
              Aiacta
            </p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/about">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    About Us
                  </a>
                </Link>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link href="/contact">
                  <a className="font-light no-underline hover:underline text-gray-800 hover:text-orange-500">
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
