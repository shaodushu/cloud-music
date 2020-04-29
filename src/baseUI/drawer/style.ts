import styled from "styled-components";
import style from "../../assets/global-style";

export const DrawerWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: ${style["background-color-shadow"]};
  &.drawer-fade-enter {
    opacity: 0;
  }
  &.drawer-fade-enter-active {
    opacity: 1;
    transition: all 0.3s;
  }
  &.drawer-fade-exit {
    opacity: 1;
  }
  &.drawer-fade-exit-active {
    opacity: 0;
    transition: all 0.3s;
  }
  .drawer_wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 10px 10px 0 0;
    background-color: ${style["highlight-background-color"]};
    transform: translate3d(0, 0, 0);
  }
`;
