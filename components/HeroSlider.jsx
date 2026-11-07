"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "./Providers";

export default function HeroSlider({ banners }) {
  const { t, n } = useI18n();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % banners.length), 5500);
    return () => clearInterval(t);
  }, [banners.length]);
  return (
    <div className="hero-slider">
      {banners.map((b, idx) => (
        <Link key={b.id} href={b.link || "/shop"} className={`hs-slide ${idx === i ? "on" : ""}`} aria-hidden={idx !== i}>
          {b.image && <img src={b.image} alt={b.title} />}
          <div className="hs-cap">
            <h2>{b.title}</h2>
            {b.subtitle && <p>{b.subtitle}</p>}
            {b.button_text && <span className="btn btn-gold btn-sm">{b.button_text}</span>}
          </div>
        </Link>
      ))}
      {banners.length > 1 && (
        <div className="hs-dots">
          {banners.map((b, idx) => <button key={b.id} className={idx === i ? "on" : ""} onClick={() => setI(idx)} aria-label={t(`স্লাইড ${n(idx + 1)}`, `Slide ${idx + 1}`)} />)}
        </div>
      )}
    </div>
  );
}
