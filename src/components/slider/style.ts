import styled from 'styled-components';
import style from '../../assets/global-style';

export const SliderContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: auto;
  /* background: white; */
  .before{
    position: absolute;
    top: -300px;
    height: 405px;
    width: 100%;
    background: ${style["theme-color"]};
    z-index: 1;
  }
  .slider-container{
    position: relative;
    width: 92%;
    height: 140px;
    overflow: hidden;
    margin: auto;
    border-radius: 6px;
    .slider-nav{
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
    }
    .swiper-pagination-bullets {
      bottom: 5px;
    }
    .swiper-pagination-bullet{
      background: #fff;
      opacity:.5;
    }
    .swiper-pagination-bullet-active{
      background: ${style["theme-color"]};
    }
  }
`