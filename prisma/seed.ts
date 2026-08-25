try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local absent — переменные уже заданы окружением (прод/CI)
}

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.POSTGRES_PRISMA_URL;
if (!connectionString) throw new Error("Нет строки подключения к БД для сида");

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

async function upsertUser(email: string, password: string, data: Parameters<typeof prisma.user.create>[0]["data"]) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { ...data, email, passwordHash },
  });
}

async function main() {
  console.log("Сидирование демо-данных SCALUP…");

  // Тестовый администратор — вручную вне публичной регистрации.
  await upsertUser("admin@scalup.kg", "admin12345", {
    email: "admin@scalup.kg",
    passwordHash: "",
    name: "Админ SCALUP",
    role: "ADMIN",
  } as never);

  const client = await upsertUser("client@scalup.kg", "client1234", {
    email: "client@scalup.kg",
    passwordHash: "",
    name: "Азамат Тестовый",
    phone: "+996700111222",
    city: "Бишкек",
    role: "CLIENT",
  } as never);

  const providersData = [
    {
      email: "avtomaster@scalup.kg",
      businessName: "СТО АвтоМастер",
      city: "Бишкек",
      categories: ["sto", "oil", "diagnostics"],
      description: "Комплексное обслуживание легковых автомобилей: диагностика, ходовая часть, замена масла и жидкостей.",
      verified: true,
      services: [
        { category: "oil", name: "Замена масла", price: 28 },
        { category: "diagnostics", name: "Диагностика ходовой", price: 15 },
        { category: "sto", name: "Развал-схождение", price: 22 },
        { category: "sto", name: "Замена тормозных колодок", price: 20 },
      ],
    },
    {
      email: "electro@scalup.kg",
      businessName: "АвтоЭлектрика Плюс",
      city: "Бишкек",
      categories: ["electric", "diagnostics"],
      description: "Диагностика и ремонт электрооборудования любой сложности.",
      verified: true,
      services: [
        { category: "electric", name: "Диагностика электрики", price: 12 },
        { category: "electric", name: "Замена аккумулятора", price: 10 },
      ],
    },
    {
      email: "shina.tokmok@scalup.kg",
      businessName: "ШинМонтаж Токмок",
      city: "Бишкек",
      categories: ["tires"],
      description: "Шиномонтаж и балансировка колёс.",
      verified: false,
      mobileService: true,
      services: [
        { category: "tires", name: "Шиномонтаж (1 колесо)", price: 5 },
        { category: "tires", name: "Балансировка (1 колесо)", price: 3 },
      ],
    },
    {
      email: "detailing.osh@scalup.kg",
      businessName: "Detailing Osh Pro",
      city: "Бишкек",
      categories: ["detailing"],
      description: "Профессиональный детейлинг и химчистка салона.",
      verified: false,
      services: [
        { category: "detailing", name: "Химчистка салона", price: 45 },
        { category: "detailing", name: "Полировка кузова", price: 60 },
      ],
    },
  ];

  for (const p of providersData) {
    const user = await upsertUser(p.email, "provider1234", {
      email: p.email,
      passwordHash: "",
      name: p.businessName,
      city: p.city,
      role: "PROVIDER",
    } as never);

    const provider = await prisma.provider.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: p.businessName,
        description: p.description,
        city: p.city,
        categories: p.categories,
        verified: p.verified,
        mobileService: p.mobileService ?? false,
      },
    });

    for (const s of p.services) {
      const exists = await prisma.service.findFirst({ where: { providerId: provider.id, name: s.name } });
      if (!exists) {
        await prisma.service.create({ data: { providerId: provider.id, category: s.category, name: s.name, price: s.price } });
      }
    }
  }

  const avtomaster = await prisma.provider.findFirst({ where: { businessName: "СТО АвтоМастер" } });
  if (avtomaster) {
    const existingReviews = await prisma.review.count({ where: { providerId: avtomaster.id } });
    if (existingReviews === 0) {
      // Отзывы требуют существующего заказа (unique orderId) — создаём демо-заказ в статусе COMPLETED.
      const service = await prisma.service.findFirst({ where: { providerId: avtomaster.id } });
      if (service) {
        const order = await prisma.order.create({
          data: {
            code: "SEED-DEMO-1",
            clientId: client.id,
            providerId: avtomaster.id,
            serviceId: service.id,
            scheduledDate: "2026-01-01",
            scheduledTime: "10:00",
            address: "г. Бишкек, ул. Ахунбаева 123",
            status: "COMPLETED",
            orderAmount: service.price,
            commissionPercent: 10,
            commissionAmount: 0,
            providerAmount: service.price,
            paymentStatus: "RELEASED",
            payoutStatus: "PAID",
          },
        });
        await prisma.review.create({
          data: { orderId: order.id, clientId: client.id, providerId: avtomaster.id, rating: 5, text: "Быстро и аккуратно, цены честные." },
        });
        await prisma.provider.update({ where: { id: avtomaster.id }, data: { ratingAvg: 5, ratingCount: 1 } });
      }
    }
  }

  console.log("Готово. Тестовые доступы:");
  console.log("  Админ:      admin@scalup.kg / admin12345");
  console.log("  Клиент:     client@scalup.kg / client1234");
  console.log("  Исполнитель: avtomaster@scalup.kg / provider1234 (и другие *@scalup.kg)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
