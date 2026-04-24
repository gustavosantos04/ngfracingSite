"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProductsCategoryHref, productCategoryFilterOptions } from "@/lib/productCategories";
import { siteCopy } from "@/lib/siteContent";

type SiteHeaderClientProps = {
  settings: {
    phoneWhatsapp: string;
  };
};

const desktopMenuOptionItems = productCategoryFilterOptions.map((option) => ({
  ...option,
  href: getProductsCategoryHref(option.category)
}));

export function SiteHeaderClient({ settings }: SiteHeaderClientProps) {
  const [open, setOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const desktopProductsRef = useRef<HTMLDivElement>(null);
  const desktopCloseTimeoutRef = useRef<number | null>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const closeDesktopProducts = () => {
    if (desktopCloseTimeoutRef.current) {
      window.clearTimeout(desktopCloseTimeoutRef.current);
      desktopCloseTimeoutRef.current = null;
    }

    setDesktopProductsOpen(false);
  };

  const scheduleDesktopProductsClose = () => {
    if (desktopCloseTimeoutRef.current) {
      window.clearTimeout(desktopCloseTimeoutRef.current);
    }

    desktopCloseTimeoutRef.current = window.setTimeout(() => {
      setDesktopProductsOpen(false);
      desktopCloseTimeoutRef.current = null;
    }, 140);
  };

  const openDesktopProducts = () => {
    if (desktopCloseTimeoutRef.current) {
      window.clearTimeout(desktopCloseTimeoutRef.current);
      desktopCloseTimeoutRef.current = null;
    }

    setDesktopProductsOpen(true);
  };

  const closeAllMenus = () => {
    setOpen(false);
    setMobileProductsOpen(false);
    closeDesktopProducts();
  };

  useEffect(() => {
    setOpen(false);
    setMobileProductsOpen(false);
    if (desktopCloseTimeoutRef.current) {
      window.clearTimeout(desktopCloseTimeoutRef.current);
      desktopCloseTimeoutRef.current = null;
    }
    setDesktopProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;

    root.style.overflow = open ? "hidden" : "";
    body.style.overflow = open ? "hidden" : "";

    return () => {
      root.style.overflow = "";
      body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setMobileProductsOpen(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileProductsOpen(false);

        if (desktopCloseTimeoutRef.current) {
          window.clearTimeout(desktopCloseTimeoutRef.current);
          desktopCloseTimeoutRef.current = null;
        }

        setDesktopProductsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!desktopProductsOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!desktopProductsRef.current?.contains(event.target as Node)) {
        if (desktopCloseTimeoutRef.current) {
          window.clearTimeout(desktopCloseTimeoutRef.current);
          desktopCloseTimeoutRef.current = null;
        }

        setDesktopProductsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [desktopProductsOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 901px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false);
        setMobileProductsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (desktopCloseTimeoutRef.current) {
        window.clearTimeout(desktopCloseTimeoutRef.current);
      }
    };
  }, []);

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
    <header className={`site-header ${open ? "is-mobile-open" : ""}`}>
      <div className="container site-header-inner">
        <Link href="/" aria-label="Voltar para a página inicial da NGF Racing" className="site-logo-wrap">
          <Image src="/branding/logoNGFRACING.png" alt="NGF Racing" width={180} height={58} priority />
        </Link>

        <nav aria-label="Navegação principal" className="desktop-nav">
          {siteCopy.header.navItems.map((item) => {
            if (item.href === "/produtos") {
              return (
                <div
                  key={item.href}
                  ref={desktopProductsRef}
                  className={`site-nav-group ${desktopProductsOpen ? "is-open" : ""}`}
                  onMouseEnter={openDesktopProducts}
                  onMouseLeave={scheduleDesktopProductsClose}
                  onFocusCapture={openDesktopProducts}
                  onBlurCapture={(event) => {
                    const nextTarget = event.relatedTarget as Node | null;

                    if (!event.currentTarget.contains(nextTarget)) {
                      scheduleDesktopProductsClose();
                    }
                  }}
                >
                  <button
                    type="button"
                    className="site-nav-trigger"
                    aria-expanded={desktopProductsOpen}
                    aria-haspopup="true"
                    aria-controls="desktop-products-menu"
                    onClick={() => setDesktopProductsOpen((current) => !current)}
                  >
                    <span>{item.label}</span>
                    <span className="site-nav-trigger-icon" aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {desktopProductsOpen ? (
                      <motion.div
                        id="desktop-products-menu"
                        className="site-nav-dropdown"
                        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                        onMouseEnter={openDesktopProducts}
                        onMouseLeave={scheduleDesktopProductsClose}
                      >
                        {desktopMenuOptionItems.map((option) => (
                          <Link
                            key={option.href}
                            href={option.href}
                            className="site-nav-dropdown-link"
                            onClick={closeDesktopProducts}
                          >
                            <span className="site-nav-dropdown-label">{option.label}</span>
                            <span className="site-nav-dropdown-copy">{option.description}</span>
                          </Link>
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href} className="site-nav-link">
                {item.label}
              </Link>
            );
          })}

          <a href={`https://wa.me/${settings.phoneWhatsapp}`} className="button-primary">
            {siteCopy.header.desktopCtaLabel}
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
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="mobile-nav-backdrop"
              onClick={closeAllMenus}
              aria-label="Fechar menu"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.nav
              id="mobile-nav"
              aria-label="Navegação principal"
              className="mobile-nav-panel"
              initial={reduceMotion ? false : { x: "8%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "8%", opacity: 0 }}
              transition={drawerTransition}
            >
              <button type="button" className="mobile-nav-close" onClick={closeAllMenus} aria-label="Fechar menu">
                <span />
                <span />
              </button>

              <div className="mobile-nav-brand">
                <div className="mobile-nav-brand-mark">
                  <Image src="/branding/logoNGFRACING.png" alt="NGF Racing" width={132} height={42} />
                </div>
                <div className="mobile-nav-brand-copy">
                  <span className="mobile-nav-kicker">NGF Racing</span>
                  <strong>Navegação rápida</strong>
                  <p>Seminovos, produtos e contato direto com a equipe.</p>
                </div>
              </div>

              <div className="mobile-nav-list">
                {siteCopy.header.navItems.map((item, index) => {
                  if (item.href === "/produtos") {
                    return (
                      <motion.div
                        key={item.href}
                        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={reduceMotion ? { duration: 0 } : { delay: 0.03 * index, duration: 0.24 }}
                        className={`mobile-nav-accordion ${mobileProductsOpen ? "is-open" : ""}`}
                      >
                        <button
                          type="button"
                          className="mobile-nav-accordion-trigger"
                          onClick={() => setMobileProductsOpen((current) => !current)}
                          aria-expanded={mobileProductsOpen}
                          aria-controls="mobile-products-menu"
                        >
                          <span>{item.label}</span>
                          <span className="mobile-nav-accordion-icon" aria-hidden="true" />
                        </button>

                        <AnimatePresence initial={false}>
                          {mobileProductsOpen ? (
                            <motion.div
                              id="mobile-products-menu"
                              className="mobile-nav-sublist"
                              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
                            >
                              {desktopMenuOptionItems.map((option) => (
                                <Link
                                  key={option.href}
                                  href={option.href}
                                  className="mobile-nav-sublink"
                                  onClick={closeAllMenus}
                                >
                                  {option.label}
                                </Link>
                              ))}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.href}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={reduceMotion ? { duration: 0 } : { delay: 0.03 * index, duration: 0.24 }}
                    >
                      <Link href={item.href} className="mobile-nav-link" onClick={closeAllMenus}>
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <a
                href={`https://wa.me/${settings.phoneWhatsapp}`}
                className="button-primary mobile-nav-cta"
                onClick={closeAllMenus}
              >
                {siteCopy.header.mobileCtaLabel}
              </a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
