import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { SERVICE_CATEGORIES } from "@/lib/categories";

const categorySlugs = SERVICE_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

const schema = z.object({
  category: z.enum(categorySlugs),
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).optional(),
  price: z.number().positive().max(1_000_000),
  photoUrl: z.string().url().max(500).optional(),
});

/** Список своих услуг — только для исполнителя, владеющего ими. */
export async function GET() {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    const services = await prisma.service.findMany({
      where: { providerId: user.provider!.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    if (!user.provider) throw new ApiError(400, "Профиль исполнителя не найден");

    const body = schema.parse(await req.json());

    const service = await prisma.service.create({
      data: {
        providerId: user.provider.id,
        category: body.category,
        name: body.name,
        description: body.description,
        price: body.price,
        photoUrl: body.photoUrl,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
