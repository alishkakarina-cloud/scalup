import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse } from "@/lib/api-auth";

const schema = z.object({
  brand: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(60),
  year: z.string().trim().min(4).max(4),
  engine: z.string().trim().min(1).max(80),
  plate: z.string().trim().min(1).max(20),
  vin: z.string().trim().max(30).optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const vehicles = await prisma.vehicle.findMany({ where: { userId: user.id }, orderBy: { id: "desc" } });
    return NextResponse.json({ vehicles });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await req.json());
    const vehicle = await prisma.vehicle.create({ data: { ...body, userId: user.id } });
    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
