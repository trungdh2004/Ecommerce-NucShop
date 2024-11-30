import { optimizeCloudinaryUrl } from "@/common/localFunction";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Image {
  url: string;
  _id?: string;
}

interface AlbumProps {
  images?: Image[];
  isLoading: boolean;
}

const Album: React.FC<AlbumProps> = ({ images = [], isLoading }) => {
  const [activeThumb, setActiveThumb] = React.useState<SwiperType | null>(null);
  const swiperRef = React.useRef<SwiperType | null>(null);

  React.useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <section className="album-detail-product">
      <div className="max-w-5xl lg:mx-auto">
        <div className="relative bg-white border-8 border-white">
          {isLoading ? (
            <Skeleton className="min-w-full min-h-full md:h-[450px]" />
          ) : (
            <Swiper
              modules={[Navigation, Thumbs]}
              loop={true}
              slidesPerView={1}
              navigation={{
                enabled: true,
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              thumbs={{
                swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="thumbShow"
            >
              {images.map((p) => (
                <SwiperSlide key={p._id}>
                  <img
                    src={optimizeCloudinaryUrl(p.url, 500, 500)}
                    alt=""
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2 mt-5">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-[82px] w-[82px]" />
              ))}
            </div>
          ) : (
            <Swiper
              onSwiper={setActiveThumb}
              loop={false}
              spaceBetween={10}
              slidesPerView="auto"
              modules={[Thumbs]}
              className="mt-5 thumbBtn"
            >
              {images.map((item) => (
                <SwiperSlide
                  key={item?._id}
                  className="!w-[82px] !h-[82px] opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-100 [&.swiper-slide-thumb-active]:border [&.swiper-slide-thumb-active]:border-blue-500 [&.swiper-slide-thumb-active]:opacity-100"
                >
                  <div className="w-full h-full border">
                    <img
                      src={optimizeCloudinaryUrl(item.url, 120, 120)}
                      alt="product thumbnail"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Custom Navigation Buttons */}
          <div
            className="absolute z-10 flex items-center justify-center transform -translate-y-1/2 cursor-pointer rounded-full bg-gray-200/35 hover:bg-gray-100 size-14 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] top-1/2 lg:left-2 left-2 custom-prev"
          >
            <GrFormPrevious size={28} color="#000" />
          </div>

          <div
            className="absolute z-10 flex items-center justify-center transform -translate-y-1/2 cursor-pointer rounded-full bg-gray-200/35 hover:bg-gray-100 size-14 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] top-1/2 lg:right-2 right-2 custom-next"
          >
            <MdOutlineNavigateNext size={28} color="#000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Album;
