import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Phone, CalendarCheck, Wrench } from "lucide-react";
import { stoList } from "../data/mock";
import { StarRating } from "../components/StarRating";
import { useCart } from "../context/CartContext";

export function StoPage() {
  const { id } = useParams();
  const sto = stoList.find((s) => s.id === id) ?? stoList[0];
  const { addItem } = useCart();

  return (
    <div>
      <section className="bg-navy-950 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-start gap-6">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-accent-500">
            <Wrench size={36} />
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold">{sto.name}</h1>
              <StarRating rating={sto.rating} />
            </div>
            <p className="mt-2 text-white/60 max-w-2xl">{sto.description}</p>
          </div>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-semibold hover:bg-accent-600 transition-colors shrink-0"
          >
            <CalendarCheck size={16} /> Записаться
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/5 bg-white p-5 flex items-start gap-3">
          <MapPin size={18} className="text-accent-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-navy-900">Адрес</p>
            <p className="text-sm text-navy-900/60 mt-0.5">{sto.address}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 flex items-start gap-3">
          <Clock size={18} className="text-accent-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-navy-900">График работы</p>
            <p className="text-sm text-navy-900/60 mt-0.5">{sto.hours}</p>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20">
        <h2 className="text-xl font-bold text-navy-900">Услуги и цены</h2>
        <div className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
          {sto.services.map((service) => (
            <div key={service.name} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium text-navy-900">{service.name}</p>
                <p className="text-sm text-navy-900/50">от ${service.price}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() =>
                    addItem({ id: `${sto.id}-${service.name}`, type: "service", name: service.name, price: service.price, stoName: sto.name })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
                >
                  <CalendarCheck size={14} /> Записаться
                </button>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-navy-900/60 hover:bg-navy-950/5 transition-colors"
                  aria-label="Позвонить"
                >
                  <Phone size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 pb-14">
        <h2 className="text-xl font-bold text-navy-900">Отзывы</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sto.reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy-900 text-sm">{review.author}</p>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-navy-900/60">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl bg-navy-950 px-6 py-5 text-white">
          <p className="font-semibold">Готовы записаться на обслуживание?</p>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold hover:bg-accent-600 transition-colors shrink-0"
          >
            Перейти в корзину
          </Link>
        </div>
      </section>
    </div>
  );
}
