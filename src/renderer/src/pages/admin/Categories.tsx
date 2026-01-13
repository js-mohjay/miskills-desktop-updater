"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  adminCategoryService,
} from "@/services/admin.service"
import {
  CategoryListResponse,
  SubcategoryListResponse,
} from "@/types/admin.category"
import { ChevronDown, ChevronRight } from "lucide-react"

/* -------------------------------------------------------------------------- */

const Categories = () => {
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data, isLoading, isError } =
    useQuery<CategoryListResponse>({
      queryKey: ["admin-categories"],
      queryFn: async () => {
        const res =
          await adminCategoryService.getCategories()
        return res.data
      },
      staleTime: 1000 * 60 * 5,
    })

  if (isLoading) return <PageSkeleton />
  if (isError || !data?.success)
    return <ErrorState />

  return (
    <section className="w-full p-6 space-y-6!">
      {/* ----------------------------- HEADER ----------------------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Categories
        </h1>

        {/* <button className="btn-primary">
          <span>+ Add Category</span>
        </button> */}
      </div>

      {/* ------------------------------ LIST ------------------------------ */}
      <div className="border border-white/10 rounded-[8px] overflow-hidden">
        {data.data.categories.map((cat) => (
          <CategoryRow
            key={cat._id}
            category={cat}
            expanded={expanded === cat._id}
            onToggle={() =>
              setExpanded(
                expanded === cat._id ? null : cat._id
              )
            }
          />
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function CategoryRow({
  category,
  expanded,
  onToggle,
}: {
  category: any
  expanded: boolean
  onToggle: () => void
}) {
  const { data, isLoading } =
    useQuery<SubcategoryListResponse>({
      queryKey: ["admin-subcategories", category._id],
      queryFn: async () => {
        const res =
          await adminCategoryService.getSubcategories(
            category._id
          )
        return res.data
      },
      enabled: expanded,
    })

  return (
    <div className="border-b border-white/5">
      {/* -------------------------- CATEGORY ROW ------------------------- */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-white/60" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/60" />
          )}

          <div>
            <p className="font-medium">
              {category.name}
            </p>
            <p className="text-sm text-white/60">
              {category.description}
            </p>
          </div>
        </div>

        <span className="text-sm text-white/50">
          {category.slug}
        </span>
      </button>

      {/* ------------------------ SUBCATEGORIES -------------------------- */}
      {expanded && (
        <div className="bg-white/3 px-6 py-4">
          {isLoading ? (
            <p className="text-sm text-white/50 py-2">
              Loading subcategories...
            </p>
          ) : data?.data.subcategories.length ? (
            <div className="space-y-2!">
              {data.data.subcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="flex justify-between items-center text-sm border border-white/10 rounded-[8px] px-4 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {sub.name}
                    </p>
                    <p className="text-white/60">
                      {sub.type} • {sub.billingType}
                    </p>
                  </div>

                  <div className="text-right text-white/70">
                    {sub.billingType === "MONTHLY" ? (
                      <p>₹{sub.monthlyPrice}/mo</p>
                    ) : (
                      <p>₹{sub.totalPrice}</p>
                    )}
                    <p className="text-xs">
                      {sub.durationMonths} months
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50 py-2">
              No subcategories found
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function PageSkeleton() {
  return (
    <section className="p-6 space-y-4">
      <div className="h-8 w-48 bg-white/10 rounded-[8px]" />
      <div className="h-64 bg-white/10 rounded-[8px]" />
    </section>
  )
}

function ErrorState() {
  return (
    <section className="p-6">
      <p className="text-red-400">
        Failed to load categories
      </p>
    </section>
  )
}

export default Categories
