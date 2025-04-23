import Home from "@/components/home/home";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const cookieStore = await cookies();
  const itineraryId = cookieStore.get("id");

  if (!itineraryId) redirect('/sign-in')

  return <Home />;
}
