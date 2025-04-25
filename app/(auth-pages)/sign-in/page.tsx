import { initAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams
  const isError = "error" in searchParams

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <form className="flex flex-col h-[200px] w-[300px]">
        <h1 className="text-2xl font-medium text-center">Iniciar</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          {
            isError ?
              <>
                <Label className="text-center leading-6" htmlFor="email">El ID no existe, ¿desea crear un nuevo Itinerario?</Label>
                <div className="flex justify-around mt-2">
                  <Link href={'/sign-up'}>
                    <Button className="border border-black">
                      Si
                    </Button>
                  </Link>
                  <Link href={'/sign-in'} replace>
                    <Button className="bg-black hover:bg-black border border-white text-white">
                      No
                    </Button>
                  </Link>
                </div>
              </> :
              <>
                <Label htmlFor="email">Ingrese el ID de itinerario</Label>
                <Input name="id" placeholder="ID" required />
                <SubmitButton pendingText="..." formAction={initAction}>
                  Ingresar
                </SubmitButton>
                <Link href={'/sign-up'}>
                  <Button className="w-full bg-slate-800 text-white hover:bg-slate-600">
                    Crear
                  </Button>
                </Link>
              </>
          }
        </div>
      </form>

    </div>
  );
}
