"use client";

import { useOptimistic } from "react";
import { deleteBooking } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

function ReservatinList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) =>
      curBookings.filter((booking) => booking.id !== bookingId),
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    try {
      await deleteBooking(bookingId);
    } catch (error) {
      // إذا حدث خطأ في السيرفر، الـ useOptimistic ذكي جداً!
      // سيعيد الحجز تلقائياً للشاشة (Automatic Rollback) دون تدخل منك.
      alert("عذراً، لم نتمكن من حذف الحجز، يرجى المحاولة لاحقاً.");
    }
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservatinList;
