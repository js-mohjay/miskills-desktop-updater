import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { AxiosError } from "axios";
import { toast } from "sonner";
import CoverflowSlider from "@/components/coverflowSlider/CoverflowSlider";
import SubCategories from "@/components/SubCategories";

import { CarouselPlugin } from "@/components/AutoplayCarousel";
import { adData } from "@/utils/adData";

import bgImg from "@/assets/bgBubbles.png"

type Category = {
  _id: string;
  name: string;
  description: string;
  benefits: string[],
  tags: string[];
  slug: string;
};

export default function Plans() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data, error, isLoading } = useQuery<Category[], AxiosError>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryService.getCategories();
      return res.data.categories;
    },
  });

  useEffect(() => {
    if (error) {
      const err = error as AxiosError<any>
      toast.error(
        err.response?.data?.message ??
        "Failed to get Categories, please try again later."
      );
    }
  }, [error]);

  const items = useMemo(() => {
    if (!data) return [];

    return data.map((category) => ({
      id: category._id,
      content: (
        <div className="grainy-card w-full h-[300px] bg-black/10 backdrop-blur-xl border border-gray-300 rounded-2xl flex flex-col justify-between items-center text-center p-6">
          <div className={"flex flex-col gap-4"}>
            <h2 className="text-5xl font-semibold text-white">
              {category.name}
            </h2>

            <p className="mt-1.5 text-xl text-white leading-relaxed">
              {category.description}
            </p>

            {category.benefits?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {category.benefits.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-black text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn-primary mt-6 w-full!"
            onClick={() => setSelectedCategory(category)}
          >
            <span>
              View Plans
            </span>
          </button>

        </div>
      ),
    }));
  }, [data]);

  if (isLoading) return null;

  return (
    <div
      className="h-screen  z-[50] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {!selectedCategory ? (
        <div className={"relative z-10 h-full flex flex-col justify-center items-center gap-4 flex-1"}>
          <CoverflowSlider
            title="Choose Your Subscription"
            items={items}
          />
          <CarouselPlugin data={adData} />
        </div>
      ) : (
        <div className={"w-full h-full overflow-auto flex justify-center"}>
          <SubCategories
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        </div>
      )}
    </div>
  );
}
