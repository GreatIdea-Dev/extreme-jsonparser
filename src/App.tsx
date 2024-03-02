import { createSignal } from "solid-js";
import LDAP from "./pages/LDAP/LDAP";
import NetworkInstance from "./pages/NetworkInstance/NetworkInstance";
import Home from "./pages/Home/Home";
import FooterLogoLine from "./components/FooterLogoLine/FooterLogoLine";
import Bell from "./assets/Bell/Bell";
import Logo from "./assets/Logo/Logo";

export default function App() {
  const [page, setPage] = createSignal(<Home />);

  return (
    <div class="min-h-screen w-screen flex flex-col justify-between items-center">
      <header class="w-full h-16 border-b border-neutral-300 dark:border-neutral-700 flex justify-center items-center px-8">
        <div class="w-24 h-full flex justify-center items-center ">
          <Logo />
        </div>
        <nav class="w-full h-full flex flex-row justify-between items-center">
          <ul class="flex flex-row justify-center items-center gap-8 flex-1">
            <li class="flex">
              <a
                class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-purple-400 cursor-pointer"
                onClick={() => setPage(<Home />)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-purple-400 cursor-pointer"
                onClick={() => setPage(<NetworkInstance />)}
              >
                Network Instance
              </a>
            </li>
            <li>
              <a
                class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-purple-400 cursor-pointer"
                onClick={() => setPage(<LDAP />)}
              >
                LDAP
              </a>
            </li>
          </ul>
        </nav>
        <div class="w-24 h-full flex justify-end items-center">
          <Bell />
        </div>
      </header>
      <main class="flex-1 w-full h-auto p-4 flex flex-col justify-start items-center">
        {page()}
      </main>
      <FooterLogoLine />
      <footer class="mx-auto flex-col gap-3.5 px-4 max-w-7xl py-9 flex">
        <ul class="footerNav">
          <li>
            <a onClick={() => setPage(<Home />)}>Home</a>
          </li>
          <li>
            <a onClick={() => setPage(<NetworkInstance />)}>Network Instance</a>
          </li>
          <li>
            <a onClick={() => setPage(<LDAP />)}>LDAP</a>
          </li>
        </ul>
        <a href="mailto:john@jjlarson.com" class="copy">
          &copy; 2024 Great Idea Development | All Rights Reserved
        </a>
      </footer>
    </div>
  );
}
