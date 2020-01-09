import styled from 'styled-components';
import style from '../../assets/global-style';

export const HeaderContainer = styled.div`
  position: fixed;
  padding-top: 0;
  height: 50px;
  width: 100%;
  z-index: 100;
  display: inline-grid;
  grid-template-columns: 60px auto 100px;
  /* line-height: 50px; */
  align-items: center;
  color: ${style["font-color-light"]};
`
export const HeaderLeftView = styled.div`
  text-align:center;
  .iconfont{
    font-size: 22px;
  }
`
interface HeaderRightViewProps {
  subtitle?: boolean | string
}
export const HeaderRightView = styled.div<HeaderRightViewProps>`
  overflow: hidden;
  /* >h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  } */
  display:grid;
  grid-template-rows: 2fr auto;
  align-items: center;
  grid-row-gap: ${props => props.subtitle ? '5px' : '0'};
  /* height: 50px; */
  .title,.subtitle{
    ${style.noWrap()}
  }
  .title{
    font-size: ${style["font-size-ll"]};
    font-weight: 500;
  }
  .subtitle{
    font-size: ${style["font-size-s"]};
    font-weight: 500;
    color:#ccc;
  }
  .iconfont{
    transform: rotate(0deg);
    font-size: 10px;
    padding-left: 2px;
  }
`
// const marquee = keyframes`
//   0%   { transform: translate(0, 0); }
//   100% { transform: translate(-100%, 0); }
// `
interface marqueeProps {
  isMarquee?: boolean
}
export const Marquee = styled.div<marqueeProps>`
  display: inline-block;
  padding-right:${props => props.isMarquee ? `10%` : '0'};
  width: 100%;
  animation: ${props => props.isMarquee ? `marquee 15s linear infinite` : 'none'};
  color: ${style["font-color-light"]};
  @keyframes marquee{
    0%   { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
  }
  /* >h1 {
    font-size: ${style["font-size-ll"]};
    font-weight: 700;
    ${style.noWrap()}
  } */
`