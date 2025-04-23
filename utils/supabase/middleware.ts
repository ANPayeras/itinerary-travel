// import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const cookieStore = await cookies();
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // const supabase = createServerClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //   {
    //     cookies: {
    //       getAll() {
    //         return request.cookies.getAll();
    //       },
    //       setAll(cookiesToSet) {
    //         cookiesToSet.forEach(({ name, value }) =>
    //           request.cookies.set(name, value)
    //         );
    //         response = NextResponse.next({
    //           request,
    //         });
    //         cookiesToSet.forEach(({ name, value, options }) =>
    //           response.cookies.set(name, value, options)
    //         );
    //       },
    //     },
    //   }
    // );

    // const user = await supabase.auth.getUser();
    const itineraryId = cookieStore.get("id");

    if (request.nextUrl.pathname.startsWith("/protected") && !itineraryId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && itineraryId) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
