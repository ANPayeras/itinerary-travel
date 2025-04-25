import { createAction, initAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                  <SubmitButton pendingText="..." formAction={async (data) => {
                    "use server"
                    await createAction(data, true)
                  }}>
                    Si
                  </SubmitButton>
                  <SubmitButton className="bg-black text-white hover:bg-black" formAction={async (data) => {
                    "use server"
                    await createAction(data, false)
                  }}>
                    No
                  </SubmitButton>
                </div>
              </> :
              <>
                <Label htmlFor="email">Ingrese el ID de itinerario</Label>
                <Input name="id" placeholder="ID" required />
                <SubmitButton pendingText="..." formAction={initAction}>
                  Iniciar
                </SubmitButton>
              </>
          }
        </div>
      </form>
    </div>
  );
}
