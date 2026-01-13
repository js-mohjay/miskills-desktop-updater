"use client";

import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./coverflow.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CoverflowItem {
  id: string | number;
  content: ReactNode;
}

interface CoverflowSliderProps {
  title?: string;
  items: CoverflowItem[];
}

export default function CoverflowSlider({
  title,
  items,
}: CoverflowSliderProps) {
  return (
    <div className="container">
      {title && <h1 className="heading mb-4!">{title}</h1>}

      <Swiper
        // effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView={3}
        // coverflowEffect={{
        //   rotate: 0,
        //   stretch: 0,
        //   depth: 100,
        //   modifier: 2.5,
        // }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".button-next",
          prevEl: ".button-prev",
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full h-fit! flex! flex-col! justify-between"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className={"px-2"}>
            <div className="coverflow-slide">
              {item.content}
            </div>
          </SwiperSlide>
        ))}

        {/* CONTROLS */}
        <div className="w-full! flex! justify-center! gap-8 pt-4 pb-2">
          <button className="button-prev swiper-nav-btn cursor-pointer z-[999]">
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="swiper-pagination static! w-fit! flex! gap-4! justify-center! items-center!" />

          <button className="button-next swiper-nav-btn z-[999]">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>


      </Swiper>
    </div>
  );
}
