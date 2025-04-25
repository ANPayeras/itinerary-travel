import { createAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <form className="flex flex-col h-[200px] w-[300px]">
        <h1 className="text-2xl font-medium">Crear itinerario</h1>
        <p className="text-sm text text-foreground">
          ¿Ya tenes uno?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Ingresá
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Nombre</Label>
          <Input name="name" placeholder="Ej: Dubai - 2025" required />
          <SubmitButton formAction={createAction} pendingText="...">
            Crear
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
