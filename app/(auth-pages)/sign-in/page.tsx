import { initAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Login(props: { searchParams: Promise<Message> }) {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <form className="flex flex-col h-[200px] w-[300px]">
        <h1 className="text-2xl font-medium text-center">Iniciar</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Ingrese el ID de itinerario</Label>
          <Input name="id" placeholder="ID" required />
          <SubmitButton pendingText="..." formAction={initAction}>
            Iniciar
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
