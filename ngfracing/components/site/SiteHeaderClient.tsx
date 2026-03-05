"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type SiteHeaderClientProps = {
  settings: {
    phoneWhatsapp: string;
  };
};

const navItems = [
  { href: "/", label: "Início" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/estoque", label: "Estoque" },
  { href: "/pecas", label: "Peças" },
  { href: "/#contato", label: "Contato" }
];

export function SiteHeaderClient({ settings }: SiteHeaderClientProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawerTransition = useMemo(
    () =>
      reduceMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            stiffness: 320,
            damping: 34,
            mass: 0.8
          },
    [reduceMotion]
  );

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" aria-label="Voltar para a página inicial da NGF Racing" className="site-logo-wrap">
          <Image src="/branding/logoNGFRACING.png" alt="NGF Racing" width={180} height={58} priority />
        </Link>

        <nav aria-label="Navegação principal" className="desktop-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </Link>
          ))}
          <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
            Falar com a NGF
          </a>
        </nav>

        <button
          type="button"
          className={`menu-button ${open ? "is-open" : ""}`}
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mobile-nav-root"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          >
            <motion.button
              type="button"
              className="mobile-nav-backdrop"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.nav
              id="mobile-nav"
              aria-label="Navegação principal"
              className="mobile-nav-panel"
              initial={reduceMotion ? false : { x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%", opacity: 0 }}
              transition={drawerTransition}
            >
              <div className="mobile-nav-list">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={reduceMotion ? { duration: 0 } : { delay: 0.03 * index, duration: 0.24 }}
                  >
                    <Link href={item.href} className="mobile-nav-link" onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary mobile-nav-cta" onClick={() => setOpen(false)}>
                Chamar no WhatsApp
              </a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
