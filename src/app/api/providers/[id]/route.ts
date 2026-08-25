import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiErrorResponse, ApiError } from "@/lib/api-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        services: { where: { active: true }, orderBy: { price: "asc" } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { client: { select: { name: true } } },
        },
      },
    });

    if (!provider) throw new ApiError(404, "Исполнитель не найден");

    return NextResponse.json({
      provider: {
        id: provider.id,
        businessName: provider.businessName,
        description: provider.description,
        photoUrl: provider.photoUrl,
        city: provider.city,
        verified: provider.verified,
        mobileService: provider.mobileService,
        categories: provider.categories,
        ratingAvg: provider.ratingAvg,
        ratingCount: provider.ratingCount,
        services: provider.services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          price: s.price,
          photoUrl: s.photoUrl,
          category: s.category,
        })),
        reviews: provider.reviews.map((r) => ({
          id: r.id,
          author: r.client.name,
          rating: r.rating,
          text: r.text,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
