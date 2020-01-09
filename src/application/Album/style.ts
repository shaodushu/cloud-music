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
  bottom: ${props => props.play > 0 ? "60px" : 0};
  z-index: 1000;
  background: ${style["background-color"]};
  /* transform-origin CSS属性让你更改一个元素变形的原点 */
  /* transform-origin: bottom center; */
  
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

interface TopDescProps {
  readonly background: string
}
export const TopDesc = styled.div<TopDescProps>`
  background-size: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 275px;
  position: relative;
  padding: 5px 20px 50px;
  .background {
    z-index: -1;
    filter: blur(40px) contrast(50%) brightness(.9);
    transform: scale(2);
    background: url(${props => props.background}) no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    /* &::after{
      content: " ";
      background-color: rgba(0,0,0,.25);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    } */
    /* .filter {
      position: absolute;
      z-index: 10;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.2);
    } */
  }
  .img_wrapper {
    width: 120px;
    height: 120px;
    position: relative;         
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
    }
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]};
      .play {
        vertical-align: top;
      }
    }
    img {
      width: 120px;
      height: 120px;
      border-radius:3px;
    }
  }
  .desc_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 120px;
    padding: 0 10px;
    .title {
      max-height: 70px;
      color: ${style["font-color-light"]};
      font-weight: 700;
      line-height: 1.5;
      font-size: ${style["font-size-l"]};
    }
    .person {
      display: flex;
      .avatar {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 20px;
        font-size: ${style["font-size-m"]};
        color: ${style["font-color-desc-v2"]};
      }
    }
  }
`;

export const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px 20px 30px;
  margin: -100px 0 0 0;
  >div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-s"]};
    color: ${style["font-color-light"]};
    z-index:1000;
    font-weight: 500;
    .iconfont {
      font-size: 20px;
    }
  }
`;