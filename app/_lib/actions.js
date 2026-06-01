"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // Critical Security Vulnerability: User can delete other users' bookings
  // first solution: check if the user is the owner of the booking
  // const bookings = await getBookings(session.user.guestId);
  // const bookingIds = bookings.map((booking) => booking.id);

  // if (!bookingIds.includes(bookingId))
  //   throw new Error("You can only delete your own bookings");

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);
  // second solution: check if the user is the owner of the booking

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const bookingId = formData.get("bookingId");
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  const updatedFields = { numGuests, observations };

  const { error: updateError } = await supabase
    .from("bookings")
    .update(updatedFields)
    .select()
    .single()
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);

  if (updateError) {
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}
