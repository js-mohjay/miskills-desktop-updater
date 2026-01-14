import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
// import CoverflowSlider from "@/components/coverflowSlider/CoverflowSlider";
import SubCategories from "@/components/SubCategories";
// import {CarouselPlugin} from "@/components/AutoplayCarousel";
// import {adData} from "@/utils/adData";
import PortratiAd2 from "@/assets/ads/portrait-2.webp";
import { ChevronRight } from "lucide-react";

import studentJourney from "@/assets/studentJourney.png"
import { Category } from "@/types/category";
import { useAuth } from "@/store/auth/useAuthStore";



const Courses = () => {

  const {selectedCategory, setSelectedCategory} = useAuth()

  const { data, error, isLoading } = useQuery<Category[], AxiosError>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryService.getCategories();
      return res.data.categories;
    },
  });

  // useEffect(() => {
  //   console.log(data)
  // }, [data]);

  useEffect(() => {
    if (error) {
      const err = error as AxiosError<any>
      toast.error(
        err.response?.data?.message ??
        "Failed to get Categories, please try again later."
      );
    }
  }, [error]);

  if (isLoading) return null;

  return (
    <section className={"w-full min-h-screen overflow-auto p-10 space-y-6!"}>
      <div>
        <h1 className={"text-5xl leading-tight"}>Courses</h1>
        <h3 className={"text-lg pl-1"}>Subscribe & Learn as per your choice</h3>
      </div>
      <div className={""}>
        {!selectedCategory ? (
          <div className={"grid grid-cols-4 gap-3"}>
            <div className={"col-span-3 flex flex-col gap-6"}>
              <div className={"grid grid-cols-2 w-full h-fit gap-3"}>
                {data && Array.isArray(data) && data?.map((c) => (
                  <div
                    className={"relative card-secondary border border-white/30 hover:bg-violet-500! transition-all! duration-300! cursor-pointer"}
                    onClick={() => { setSelectedCategory(c) }}
                  >
                    <div className={"flex flex-col gap-2"}>
                      <h2 className={"text-2xl"}>
                        {c.name}
                      </h2>
                      <h4 className={"text-base font-light!"}>
                        {c.description}
                      </h4>
                    </div>
                    <ChevronRight className={"size-6 absolute top-1/2 -translate-y-1/2 right-0"} />
                  </div>
                ))}
              </div>
              <div className={"p-2"}>
                <img src={studentJourney} alt="" className={"w-full! h-full! rounded-[8px]! border border-white/50"} />
              </div>
            </div>
            <div className={"rounded-[8px]!"}>
              <div className="flex flex-col text-center justify-center items-center rounded-[8px] border border-white/50 w-full! h-[400px]!">
                <h2 className="text-base!">
                  Contact for Advertisement
                </h2>
                <br />
                <span className="text-base!">
                  E-Mail: <a href="mailto:contact@miskills.in">contact@miskills.in</a>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <SubCategories
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        )}

      </div>
    </section>
  )
}

export default Courses
