"use client";

import confetti from "canvas-confetti";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Phase = 1 | 2;

const WHATSAPP_URL =
  "https://wa.me/593983511866?text=Acepto%20la%20cena%2C%20%C2%BFcu%C3%A1ndo%20vamos%3F";

const CAREER_OPTIONS = [
  "Educación",
  "Educación Inicial",
  "Ingeniería en Software",
  "Psicología Clínica",
  "Administración de Empresas",
  "Derecho",
] as const;

export default function KathInvite() {
  const [phase, setPhase] = useState<Phase>(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [career, setCareer] = useState("");
  const [usability, setUsability] = useState("");
  const [loadTime, setLoadTime] = useState("");
  const [helpDev, setHelpDev] = useState("");

  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(max-width: 640px)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window
    );
  });
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isNoButtonFloating, setIsNoButtonFloating] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      setIsMobileLayout(
        window.matchMedia("(max-width: 640px)").matches ||
          window.matchMedia("(pointer: coarse)").matches ||
          "ontouchstart" in window
      );
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);
    return () => window.removeEventListener("resize", checkLayout);
  }, []);

  const moveNoButton = useCallback(() => {
    const button = noButtonRef.current;
    if (!button) return;

    const width = button.offsetWidth || 200;
    const height = button.offsetHeight || 48;
    const margin = 16;

    const maxX = window.innerWidth - width - margin;
    const maxY = window.innerHeight - height - margin;

    if (maxX <= margin || maxY <= margin) return;

    const yesRect = yesButtonRef.current?.getBoundingClientRect();
    const buffer = 28;

    let x = margin;
    let y = margin;
    let attempts = 0;

    do {
      x = margin + Math.random() * (maxX - margin);
      y = margin + Math.random() * (maxY - margin);
      attempts++;
    } while (
      yesRect &&
      attempts < 15 &&
      x < yesRect.right + buffer &&
      x + width > yesRect.left - buffer &&
      y < yesRect.bottom + buffer &&
      y + height > yesRect.top - buffer
    );

    setIsNoButtonFloating(true);
    setNoButtonPos({ x, y });
  }, []);

  useLayoutEffect(() => {
    if (phase !== 2 || !isMobileLayout) return;
    moveNoButton();
  }, [phase, isMobileLayout, moveNoButton]);

  useEffect(() => {
    if (phase !== 2 || !isMobileLayout) return;

    const handleNearTouch = (clientX: number, clientY: number) => {
      const btn = noButtonRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);

      if (distance < 130) moveNoButton();
    };

    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) handleNearTouch(touch.clientX, touch.clientY);
    };

    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("touchmove", onTouch);
    };
  }, [phase, isMobileLayout, moveNoButton]);

  const handleNoButtonEscape = (e: React.PointerEvent) => {
    e.preventDefault();
    moveNoButton();
  };

  const handleYes = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#22c55e", "#4ade80", "#f472b6", "#fbbf24"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#22c55e", "#4ade80", "#f472b6", "#fbbf24"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.55 },
    });

    setTimeout(() => {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase(2);
  };

  if (phase === 1) {
    return (
      <div className="min-h-dvh overflow-x-hidden bg-gray-100 px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-4 sm:py-8">
        <div className="mx-auto w-full max-w-lg rounded border border-gray-300 bg-white p-4 shadow-sm sm:p-8">
          <header className="mb-4 border-b border-gray-200 pb-3 sm:mb-6 sm:pb-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500 sm:text-xs">
              Universidad Católica · Innovación Académica
            </p>
            <h1 className="mt-1.5 text-base font-normal leading-snug text-gray-800 sm:mt-2 sm:text-xl">
              Evaluación de Usabilidad UI/UX - Test de Usuario
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm">
              Protocolo #UX-2026-041 · Tiempo estimado: 2 min
            </p>
            <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-900 sm:mt-4 sm:px-3 sm:py-2.5 sm:text-sm">
              <span className="font-semibold">Acceso restringido:</span> solo
              estudiantes activos de la Universidad Católica.
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <section className="rounded border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <h2 className="mb-3 text-sm font-semibold text-gray-800">
                Datos del participante
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label
                    htmlFor="full-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. María González"
                    autoComplete="name"
                    className="w-full min-h-11 rounded border border-gray-300 bg-white px-3 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Número telefónico
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 0987654321"
                    autoComplete="tel"
                    className="w-full min-h-11 rounded border border-gray-300 bg-white px-3 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="career"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Carrera universitaria
                  </label>
                  <select
                    id="career"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full min-h-11 rounded border border-gray-300 bg-white px-3 py-2 text-base text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar carrera...</option>
                    {CAREER_OPTIONS.map((careerName) => (
                      <option key={careerName} value={careerName}>
                        {careerName}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                    Carreras habilitadas para esta cohorte de prueba.
                  </p>
                </div>
              </div>
            </section>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-gray-700 sm:mb-3">
                1. ¿Qué tan intuitivo consideras este diseño del 1 al 5?
              </legend>
              <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className="flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded border border-gray-200 px-1 py-2 text-sm text-gray-700 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50 sm:justify-start sm:gap-2 sm:px-3"
                  >
                    <input
                      type="radio"
                      name="usability"
                      value={value}
                      checked={usability === String(value)}
                      onChange={(e) => setUsability(e.target.value)}
                      className="size-4 accent-blue-600"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="load-time"
                className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
              >
                2. ¿El tiempo de carga fue óptimo?
              </label>
              <select
                id="load-time"
                value={loadTime}
                onChange={(e) => setLoadTime(e.target.value)}
                className="w-full min-h-11 rounded border border-gray-300 bg-white px-3 py-2 text-base text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="help-dev"
                className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
              >
                3. ¿Qué tan dispuesta estarías a ayudar al desarrollador de esta
                página en un problema crítico?
              </label>
              <textarea
                id="help-dev"
                rows={3}
                value={helpDev}
                onChange={(e) => setHelpDev(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:rows-4"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-12 rounded bg-blue-600 px-4 py-2.5 text-base font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              Enviar Respuestas
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gray-900 px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <p className="mb-3 font-mono text-xs tracking-widest text-green-500/70 sm:text-sm">
          &gt; system.override() // bypassing social_anxiety.exe
        </p>

        <h1 className="font-mono text-2xl font-bold leading-tight text-green-400 sm:text-4xl md:text-5xl">
          ERROR 404: Excusas Not Found
        </h1>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-100 sm:text-lg">
          <p>
            Oye, la verdad ya no sé qué pretexto usar para hablar contigo
            JAJAJAJA.
          </p>
          <p>
            Ya fuera de bromas: creo que eres muy linda y me gustaría invitarte
            a cenar, o a hacer algo distinto para no quedarme solo con verte
            cuando salimos a beber en grupo. ¿Qué dices, Kathy?
          </p>
        </div>

        <div className="relative mx-auto mt-10 flex w-full max-w-md flex-col items-stretch gap-4 px-2 sm:flex-row sm:items-center sm:justify-center">
          <button
            ref={yesButtonRef}
            type="button"
            onClick={handleYes}
            className="w-full min-h-12 rounded-lg bg-green-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-green-500/25 transition-transform hover:scale-105 hover:bg-green-400 active:scale-95 sm:w-auto sm:min-w-[220px]"
          >
            Sí, me encantaría
          </button>

          <button
            ref={noButtonRef}
            type="button"
            onMouseEnter={!isMobileLayout ? moveNoButton : undefined}
            onPointerDown={handleNoButtonEscape}
            onClick={(e) => e.preventDefault()}
            style={
              isMobileLayout
                ? {
                    position: "fixed",
                    left: noButtonPos?.x ?? -9999,
                    top: noButtonPos?.y ?? 0,
                    zIndex: 50,
                    touchAction: "none",
                    opacity: noButtonPos ? 1 : 0,
                    pointerEvents: noButtonPos ? "auto" : "none",
                  }
                : isNoButtonFloating && noButtonPos
                  ? {
                      position: "fixed",
                      left: noButtonPos.x,
                      top: noButtonPos.y,
                      zIndex: 50,
                      touchAction: "none",
                    }
                  : undefined
            }
            className="min-h-12 w-auto max-w-[85vw] shrink-0 rounded-lg bg-red-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/25 transition-[left,top,opacity,transform] duration-300 ease-out select-none hover:bg-red-500 sm:min-w-[200px]"
          >
            No, estoy ocupada
          </button>
        </div>

        <p className="mt-10 font-mono text-xs text-green-500/50">
          {isMobileLayout
            ? "// hint: el botón rojo huye del dedo ¯\\_(ツ)_/¯"
            : "// hint: el botón rojo no coopera ¯\\_(ツ)_/¯"}
        </p>
      </div>
    </div>
  );
}
