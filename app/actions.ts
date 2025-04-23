"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Itineraries, Itinerary } from "@/lib/types";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const addItineraryAction = async (formData: FormData) => {
  const supabase = await createClient();

  const date = formData.get("date")?.toString();
  const ISODate = new Date(date!).toISOString();
  const [year, month, day] = ISODate.split("T")[0].split("-");
  const parseDate = `${day}/${month}/${year.slice(-2)}`;

  const description = formData.get("description")?.toString();
  const link = formData.get("link")?.toString();

  try {
    await supabase.from("itineraries").insert({
      date: parseDate,
      description,
      link,
    });
  } catch (error) {
    return error;
  }
};

export const getItinerariesAction = async () => {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("itineraries")
      .select()
      .order("date", { ascending: true });

    const dbItineraries = data as Itinerary[];

    let itineraries: Itineraries[] = [];

    dbItineraries?.forEach((i) => {
      const existDate = itineraries.find(
        (itinerary) => itinerary.date === i.date
      );
      if (existDate) {
        const index = itineraries.findIndex(
          (itinerary) => itinerary.date === existDate.date
        );
        itineraries[index].itineraries.push(i);
      } else {
        itineraries.push({
          date: i.date,
          itineraries: [{ ...i }],
        });
      }
    });

    return itineraries;
  } catch (error) {
    return error;
  }
};

export const deleteItineraryAction = async (id: number) => {
  const supabase = await createClient();

  try {
    await supabase.from("itineraries").delete().eq("id", id);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const editItineraryAction = async (formData: FormData, id: number) => {
  const supabase = await createClient();

  const date = formData.get("date")?.toString();
  const ISODate = new Date(date!).toISOString();
  const [year, month, day] = ISODate.split("T")[0].split("-");
  const parseDate = `${day}/${month}/${year.slice(-2)}`;

  const description = formData.get("description")?.toString();
  const link = formData.get("link")?.toString();

  try {
    await supabase
      .from("itineraries")
      .update({
        date: parseDate,
        description,
        link,
      })
      .eq("id", id);
  } catch (error) {
    return error;
  }
};

export const getExpensesAction = async () => {
  const supabase = await createClient();

  try {
    const { data } = await supabase.from("expenses").select();

    return data;
  } catch (error) {
    return error;
  }
};

export const addExpenseAction = async (formData: FormData) => {
  const supabase = await createClient();

  const detail = formData.get("detail")?.toString();
  const amount = formData.get("amount")?.toString();

  try {
    await supabase.from("expenses").insert({
      detail,
      amount,
    });
  } catch (error) {
    return error;
  }
};

export const editExpensesAction = async (formData: FormData, id: number) => {
  const supabase = await createClient();

  const detail = formData.get("detail")?.toString();
  const amount = formData.get("amount")?.toString();

  try {
    await supabase
      .from("expenses")
      .update({
        detail,
        amount,
      })
      .eq("id", id);
  } catch (error) {
    return error;
  }
};

export const deleteExpenseAction = async (id: number) => {
  const supabase = await createClient();

  try {
    await supabase.from("expenses").delete().eq("id", id);
  } catch (error) {
    return error;
  }
};

export const getPersonsAction = async () => {
  const supabase = await createClient();

  try {
    const { data } = await supabase.from("persons").select();

    return data;
  } catch (error) {
    return error;
  }
};

export const addPersonAction = async (formData: FormData) => {
  const supabase = await createClient();

  const name = formData.get("name")?.toString();
  const amount = formData.get("amount")?.toString();

  try {
    await supabase.from("persons").insert({
      name,
      amount,
    });
  } catch (error) {
    return error;
  }
};

export const editPersonsAction = async (formData: FormData, id: number) => {
  const supabase = await createClient();

  const name = formData.get("name")?.toString();
  const amount = formData.get("amount")?.toString();

  try {
    await supabase
      .from("persons")
      .update({
        name,
        amount,
      })
      .eq("id", id);
  } catch (error) {
    return error;
  }
};

export const deletePersonAction = async (id: number) => {
  const supabase = await createClient();

  try {
    await supabase.from("persons").delete().eq("id", id);
  } catch (error) {
    return error;
  }
};
