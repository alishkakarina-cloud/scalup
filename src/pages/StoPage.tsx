import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Phone, CalendarCheck, Wrench, ArrowRight } from "lucide-react";
import { stoList } from "../data/mock";
import { StarRating } from "../components/StarRating";
import { useCart } from "../context/CartContext";

export function StoPage() {
  const { id } = useParams();
  const sto = stoList.find((s) => s.id === id) ?? stoList[0];
  const { addItem } = useCart();

  const stats = [
    { value: sto.rating.toFixed(1), label: "рейтинг" },
    { value: sto.reviews.length, label: "отзывов" },
    { value: sto.services.length, label: "услуг" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-surface border-b border-cream/10">
        <div className="vignette" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-full blur-2xl"
                style={{
                  background: "radial-gradient(circle, #E8825A 0%, #C25B3A 50%, rgba(143,63,38,0) 75%)",
                }}
              />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-cream">
                <Wrench size={36} strokeWidth={1.5} />
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">{sto.name}</h1>
                <StarRating rating={sto.rating} />
              </div>
              <p className="mt-2 text-cream/90 max-w-2xl">{sto.description}</p>
            </div>
            <a
              href="#services"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-cream hover:bg-accent-hover transition-colors shrink-0"
            >
              Записаться
              <ArrowRight size={15} strokeWidth={2.5} />
            </a>
          </div>

          <div className="mt-8 flex gap-8 border-t border-cream/10 pt-6">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-accent pl-3">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">{s.value}</p>
                <p className="text-xs text-cream/90 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5 flex items-start gap-3">
          <MapPin size={18} strokeWidth={1.5} className="text-cream shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-cream">Адрес</p>
            <p className="text-sm text-sage-100 mt-0.5">{sto.address}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5 flex items-start gap-3">
          <Clock size={18} strokeWidth={1.5} className="text-cream shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-cream">График работы</p>
            <p className="text-sm text-sage-100 mt-0.5">{sto.hours}</p>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20">
        <h2 className="text-xl font-extrabold tracking-tight text-cream">Услуги и цены</h2>
        <div className="mt-4 divide-y divide-cream/10 rounded-2xl border border-cream/10 bg-surface-alt">
          {sto.services.map((service) => (
            <div key={service.name} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-bold text-cream">{service.name}</p>
                <p className="text-sm text-sage-100">
                  от <span className="text-cream font-extrabold">${service.price}</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() =>
                    addItem({ id: `${sto.id}-${service.name}`, type: "service", name: service.name, price: service.price, stoName: sto.name })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
                >
                  <CalendarCheck size={14} strokeWidth={1.5} /> Записаться
                </button>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/75 hover:bg-cream/5 transition-colors"
                  aria-label="Позвонить"
                >
                  <Phone size={15} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 pb-14">
        <h2 className="text-xl font-extrabold tracking-tight text-cream">Отзывы</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sto.reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-cream/10 bg-surface-alt p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-cream text-sm">{review.author}</p>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-sage-100">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-surface-alt px-6 py-5">
          <p className="font-bold text-cream">Готовы записаться на обслуживание?</p>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors shrink-0"
          >
            Перейти в корзину
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
