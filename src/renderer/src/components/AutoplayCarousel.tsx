"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type CarouselItemData = {
  id: number
  image: string
  path?: string
}

type CarouselPluginProps = {
  data: CarouselItemData[]
}

export function CarouselPlugin({ data }: CarouselPluginProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  return (
    <div className={"w-full flex justify-center items-center"}>
      <Carousel
        plugins={[plugin.current]}
        className="h-full max-w-3xl xl:max-w-4xl aspect-auto!"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {data.map((item) => {
            const content = (
              <img
                src={item.image}
                alt="Landscape Ad"
                className="h-full w-auto max-h-[350px] rounded-[10px] rounded-[10px] border-2 hover:border-violet-500 transition duration-300 cursor-pointer"
              />
            );

            return (
              <CarouselItem
                key={item.id}
                className="flex justify-center items-center"
                onClick={() => {
                  if (item.path) {
                    window.api?.openExternal(item.path);
                  }
                }}
              >
                {content}
              </CarouselItem>
            );
          })}

        </CarouselContent>

        <CarouselPrevious className={"size-14! -left-14!"} />
        <CarouselNext className={"size-14! -right-16!"} />
      </Carousel>
    </div>
  )
}
