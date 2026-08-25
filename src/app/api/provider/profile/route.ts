import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { SERVICE_CATEGORIES } from "@/lib/categories";

const categorySlugs = SERVICE_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

const schema = z.object({
  businessName: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  city: z.string().trim().max(80).optional(),
  categories: z.array(z.enum(categorySlugs)).max(10).optional(),
  mobileService: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    if (!user.provider) throw new ApiError(400, "Профиль исполнителя не найден");

    const body = schema.parse(await req.json());
    const provider = await prisma.provider.update({ where: { id: user.provider.id }, data: body });

    return NextResponse.json({ provider });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
