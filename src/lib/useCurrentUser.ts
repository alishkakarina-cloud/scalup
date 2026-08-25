// Лёгкий тип пользователя для клиентских компонентов — без прямого импорта
// Prisma-типов на клиенте.
export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN";
  phone: string | null;
  city: string | null;
  providerId: string | null;
}
