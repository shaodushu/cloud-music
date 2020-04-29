import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll'
import { Content } from './style';
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';
import { renderRoutes } from 'react-router-config';
import { ThemeProvider } from "styled-components";
// import Loading from '../../baseUI/loading-v2/index';

function Recommend(props: any) {
    // 不要在这里将数据 toJS
    // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
    const bannerList = useSelector((state: any) => state.getIn(['recommend', 'bannerList']))
    const recommendList = useSelector((state: any) => state.getIn(['recommend', 'recommendList']))
    const enterLoading = useSelector((state: any) => state.getIn(['recommend', 'enterLoading']))
    const songsCount = useSelector((state: any) => state.getIn(['player', 'playList']).size)
    const dispatch = useDispatch()
    useEffect(() => {
        // 如果页面有数据，则不发请求
        //immutable 数据结构中长度属性 size
        if (!bannerList.size) {
            dispatch(actionTypes.getBannerList())
        }
        if (!recommendList.size) {
            dispatch(actionTypes.getRecommendList());
        }

    }, [bannerList.size, dispatch, recommendList.size]);

    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];

    const theme = useSelector((state: any) => state.getIn(['app', 'theme']))
    const themeJS = theme.toJS()

    return (
        <ThemeProvider theme={themeJS}>
            <Content play={songsCount}>
                {/* 现在我们做到了视口内的图片显示真实资源，视口外则显示占位图片，那么当我们滑动的时候，如何让下面相应的图片显示呢？ */}
                {/* forceCheck */}
                {/* It is available to manually trigger checking for elements in viewport. Helpful when LazyLoad components enter the viewport without resize or scroll events, e.g. when the components' container was hidden then become visible. */}
                {/* 可以手动检查 viewport 中的元素触发器。 当 LazyLoad 组件进入视图而没有调整大小或滚动事件时会很有帮助，例如当组件的容器被隐藏时就会变得可见 */}
                <Scroll onScroll={forceCheck}>
                    <div>
                        <Slider bannerList={bannerListJS}></Slider>
                        <RecommendList list={recommendListJS}></RecommendList>
                    </div>
                </Scroll>
                {enterLoading ? <Loading></Loading> : null}
                {renderRoutes(props.route.routes)}
            </Content>
        </ThemeProvider>

    )
}

//// 将 ui 组件包装成容器组件
export default React.memo(Recommend);