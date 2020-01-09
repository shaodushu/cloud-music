import React, { Ref } from 'react';
import { HeaderContainer, HeaderLeftView, HeaderRightView, Marquee } from './style'

// 处理函数组件拿不到 ref 的问题，所以用 forwardRef
const Header = React.forwardRef((props: BaseUI.Header, ref: Ref<HTMLDivElement>) => {
  const { title, subtitle, isMarquee } = props;
  const { onBack, onClick } = props
  return (
    <HeaderContainer ref={ref}>
      <HeaderLeftView onClick={onBack}>
        <i className="iconfont" >&#xe655;</i>
      </HeaderLeftView>
      <HeaderRightView subtitle={subtitle} onClick={onClick}>
        <Marquee isMarquee={isMarquee}><h1 className="title">{title}</h1></Marquee>
        {
          subtitle && <h3 className="subtitle">{subtitle}
            <i className="iconfont">&#xe662;</i></h3>
        }
      </HeaderRightView>
    </HeaderContainer>
  )
})

Header.defaultProps = {
  isMarquee: false
};


export default React.memo(Header);