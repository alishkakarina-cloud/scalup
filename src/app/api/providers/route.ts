import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiErrorResponse } from "@/lib/api-auth";

/**
 * Публичный каталог исполнителей. Доступен без авторизации — это витрина.
 * "Расстояние" в ТЗ реализовано упрощённо как совпадение города: точная
 * геолокация/геокодинг — отдельная интеграция (см. README, раздел "Известные упрощения").
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const minRating = searchParams.get("minRating");
    const maxPrice = searchParams.get("maxPrice");
    const mobileOnly = searchParams.get("mobileOnly") === "true";
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";

    const providers = await prisma.provider.findMany({
      where: {
        ...(category ? { categories: { has: category } } : {}),
        ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
        ...(minRating ? { ratingAvg: { gte: Number(minRating) } } : {}),
        ...(mobileOnly ? { mobileService: true } : {}),
        ...(verifiedOnly ? { verified: true } : {}),
        services: { some: { active: true, ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {}) } },
      },
      include: {
        services: { where: { active: true }, orderBy: { price: "asc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy: [{ verified: "desc" }, { ratingAvg: "desc" }],
      take: 60,
    });

    return NextResponse.json({
      providers: providers.map((p) => ({
        id: p.id,
        businessName: p.businessName,
        photoUrl: p.photoUrl,
        city: p.city,
        verified: p.verified,
        mobileService: p.mobileService,
        categories: p.categories,
        ratingAvg: p.ratingAvg,
        reviewCount: p._count.reviews,
        priceFrom: p.services[0]?.price ?? null,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
