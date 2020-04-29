import React, { useEffect, useState } from "react";
import { SliderContainer } from "./style";
import "swiper/css/swiper.css";
import Swiper from "swiper";
import LazyLoad from "react-lazyload";

function Slider(props: { bannerList: any }) {
  const [sliderSwiper, setSliderSwiper] = useState<Swiper>();
  const { bannerList } = props;

  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      let sliderSwiper = new Swiper(".slider-container", {
        loop: true,
        autoplay: true,

        // autoplayDisableOnInteraction: false,
        pagination: { el: ".swiper-pagination" }
      });
      setSliderSwiper(sliderSwiper);
    }
  }, [bannerList.length, sliderSwiper]);

  return (
    <SliderContainer>
      <div className="before" />
      <div className="slider-container">
        <div className="swiper-wrapper">
          {bannerList.map(
            (
              slider: { pic: string | undefined; typeTitle: string },
              index: number
            ) => {
              return (
                <div className="swiper-slide" key={slider.pic! + index}>
                  <div className="slider-nav">
                    <LazyLoad throttle={200} height={140}>
                      <img
                        src={slider.pic + "?param=380x140"}
                        width="100%"
                        height="100%"
                        alt={slider.typeTitle}
                      />
                    </LazyLoad>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="swiper-pagination" />
      </div>
    </SliderContainer>
  );
}

export default React.memo(Slider);
