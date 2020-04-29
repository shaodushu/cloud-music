import React, { forwardRef, useState, useImperativeHandle, useCallback, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { DrawerWrapper } from './style';
import { prefixStyle } from "../../api/utils";

interface DrawerTypes {
  children: any
}

export interface DrawerProps {
  show(): void
}

const Drawer = forwardRef<DrawerProps, DrawerTypes>((props, ref) => {
  const [visible, setVisible] = useState(false)// 外部传入
  const [isShow, setIsShow] = useState(false);
  const drawerWrapperRef = useRef<HTMLDivElement>(null);
  const drawertRef = useRef<HTMLDivElement>(null);

  const transform = prefixStyle("transform");
  // 是否允许滑动事件生效
  const [canTouch, setCanTouch] = useState(true);
  //touchStart 后记录 y 值
  const [startX, setStartX] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState(false);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const onEnterCB = useCallback(() => {
    const drawerWrapperDom = drawerWrapperRef.current
    if (!drawerWrapperDom || !transform) return
    // 让列表显示
    setIsShow(true);
    // 最开始是隐藏在下面
    drawerWrapperDom.style[transform as any] = `translate3d(-100%, 0, 0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    const drawerWrapperDom = drawerWrapperRef.current
    if (!drawerWrapperDom || !transform) return
    // 让列表展现
    drawerWrapperDom.style["transition"] = "all 0.3s";
    drawerWrapperDom.style[transform as any] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitingCB = useCallback(() => {
    const drawerWrapperDom = drawerWrapperRef.current
    if (!drawerWrapperDom || !transform) return
    drawerWrapperDom.style["transition"] = "all 0.3s";
    drawerWrapperDom.style[transform as any] = `translate3d(-100%,0,  0)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    const drawerWrapperDom = drawerWrapperRef.current
    if (!drawerWrapperDom) return
    setIsShow(false);
    drawerWrapperDom.style[transform as any] = `translate3d(-100%,0,0)`;
  }, [transform]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const listWrapperDom = drawerWrapperRef.current
    if (!listWrapperDom) return
    if (!canTouch || initialed) return;
    listWrapperDom.style["transition"] = "";
    setStartX(e.nativeEvent.touches[0].pageX);// 记录 x 值
    setInitialed(true);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const listWrapperDom = drawerWrapperRef.current
    if (!listWrapperDom) return
    if (!canTouch || !initialed) return;
    console.log(e.nativeEvent.touches[0].pageX, startX)
    let distance = startX - e.nativeEvent.touches[0].pageX;
    if (distance < 0) return;
    setDistance(distance);// 记录左滑距离
    listWrapperDom.style.transform = `translate3d(-${distance}px,0, 0)`;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const listWrapperDom = drawerWrapperRef.current
    if (!listWrapperDom) return
    setInitialed(false);
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      // dispatch(actionTypes.changeShowPlayList(false));
      setVisible(false);
    } else {
      // 否则反弹回去
      listWrapperDom.style["transition"] = "all 0.3s";
      listWrapperDom.style[transform as any] = `translate3d(0px, 0px, 0px)`;
    }
  };

  useImperativeHandle(ref, () => ({
    show() {
      setVisible(true);
    }
  }));

  const handleTogglePlayList = (data: boolean) => {
    console.log(data)
    setVisible(data);
  }

  return (
    <CSSTransition
      in={visible}
      timeout={300}
      classNames="drawer-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}>
      <DrawerWrapper
        ref={drawertRef}
        style={isShow === true ? { display: "block" } : { display: "none" }}
        onClick={() => handleTogglePlayList(false)}
      >
        <div className="drawer_wrapper"
          ref={drawerWrapperRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {props.children}
        </div>
      </DrawerWrapper>
    </CSSTransition>
  )
})

export default React.memo(Drawer);