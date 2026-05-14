"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filters = [
  {
    name: "All Cabins",
    value: "all",
  },
  {
    name: "1 - 2 Guests",
    value: "small",
  },
  {
    name: "3 - 7 Guests",
    value: "medium",
  },
  {
    name: "8 - 12 Guests",
    value: "large",
  },
];

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") || "all";

  const handleClick = (filter) => {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="border border-primary-800 flex">
      {filters.map((filter) => (
        <button
          className={`px-5 py-2 hover:bg-primary-700 cursor-pointer ${
            filter.value === activeFilter
              ? "bg-primary-700 text-primary-50"
              : ""
          }`}
          key={filter.value}
          onClick={() => handleClick(filter.value)}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
}

export default Filter;
