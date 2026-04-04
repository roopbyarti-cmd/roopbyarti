'use client';

import Link from "next/link";

const categories = [
  {
    name: "Necklace",
    image: "/categories/Neckpiece.jpg",
    slug: "necklace",
  },
  {
    name: "Earrings",
    image: "/categories/Earrings.png",
    slug: "earrings",
  },
  {
    name: "Rings",
    image: "/categories/Rings.jpg",
    slug: "rings",
  },
  {
    name: "Bracelets",
    image: "/categories/Bracelet.png",
    slug: "bracelet",
  },
  
  {
    name: "Hair Accessories",
    image: "/categories/Hair-access.jpg",
    slug: "hair-accessories",
  },
];

export default function ExploreCategories() {
  return (
    <section className="px-6 md:px-10 py-10">

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
        Explore Categories
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">

        {categories.map((cat) => (
          <Link href={`/category/${cat.slug}`} key={cat.slug}>

            <div className="group cursor-pointer text-center">

              {/* Card */}
              <div className="bg-gray-100 rounded-2xl p-4 hover:shadow-lg transition duration-300">

                <div className="overflow-hidden rounded-xl">
                  <img
                    src={cat.image}
                    className="h-28 w-full object-contain group-hover:scale-110 transition duration-300"
                  />
                </div>

              </div>

              {/* Label */}
              <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-black">
                {cat.name}
              </p>

            </div>

          </Link>
        ))}

      </div>
    </section>
  );
}