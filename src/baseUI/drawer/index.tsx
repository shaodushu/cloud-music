import { forwardRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { DrawerWrapper } from './style';

const Draw=forwardRef(props,ref)=>{
  const [visible,setVisible]=useState(false)
  return (
    <CSSTransition>
    <DrawerWrapper
                ref={playListRef}
                style={visible === true ? { display: "block" } : { display: "none" }}
                onClick={() => handleTogglePlayList(false)}
            >
                <div className="drawer_wrapper"
                    ref={listWrapperRef}
                    onClick={e => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                ></div>
                </DrawerWrapper>
  </CSSTransition>
  )
}