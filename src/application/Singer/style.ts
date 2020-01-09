import styled from 'styled-components';
import style from '../../assets/global-style';

interface ContainerProps {
    play: number
}
export const Container = styled.div<ContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => {
        if (props.play) {
            return props.play > 0 ? "60px" : 0
        }
        return 0
    }};
  width: 100%;
  z-index: 100;
  overflow: hidden;
  background: #f2f3f4;
  &.fly-enter, &.fly-appear {
    opacity: 0.01;
    transform: translateY(50%);
  }
  &.fly-enter-active, &.fly-appear-active {
      opacity: 1;
      transform: translateY(0%);
      transition: all 300ms ease-in;
  }
  &.fly-exit {
      opacity: 1;
      transform: translateY(0%);
  }
  &.fly-exit-active {
      opacity: 0.01;
      transform: translateY(50%);
      transition: all 300ms ease-in;
  }
`
interface ImgWrapperProps {
    bgUrl: string
}
export const ImgWrapper = styled.div<ImgWrapperProps>`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  transform-origin: top;
  background: url(${props => props.bgUrl});
  background-size: cover;
  z-index: 50;
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* : blur(20px); */
    background: rgba(7, 17, 27, 0.3);
  }
`
export const CollectButton = styled.div`
  position: fixed;
  left: 0; right: 0;
  margin: auto;
  box-sizing: border-box;
  width: 120px;
  height: 40px;
  margin-top: -75px;
  z-index:50;
  background: ${style["theme-color"]};
  color: ${style["font-color-light"]};
  border-radius: 20px;
  text-align: center;
  font-size: 0;
  line-height: 40px;
  .iconfont{
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    vertical-align: 1px;
  }
  .text {
    display: inline-block;
    font-size:14px;
    letter-spacing: 5px;
  }
`

interface SongListWrapperProps {
    play?: string
}
export const SongListWrapper = styled.div<SongListWrapperProps>`
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  bottom: ${props => props.play ? "60px" : 0};
  right: 0;
  >div{
    position: absolute;
    left: 0;
    width: 100%;
    overflow: visible;
  }
`
export const BgLayer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: white;
  border-radius: 20px;
  z-index: 50;
`