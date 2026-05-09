import { requireRole } from "@/lib/server-auth";
import NewProductClient from "./NewProductClient";

export default async function NewProductPage() {
  await requireRole(['seller']);
  return <NewProductClient />;
}
