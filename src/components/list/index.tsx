import React from 'react';
import LazyLoad from "react-lazyload";
import {
    ListWrapper,
    ListItem,
    List
} from './style';
import { getCount } from '../../api/utils';
import { useHistory } from 'react-router-dom';

/**
 * 注意，这里 List 组件作为 Recommend 的子组件，并不能从 props 拿到 history 变量，无法跳转路由。有两种解决方法：
 * 将 Recommend 组件中 props 对象中的 history 属性传给 List 组件
 * 将 List 组件用 withRouter 包裹
 * @param props 
 */
function RecommendList(props: { list: CloudMusic.Recommend[]; }) {
    const { list } = props
    let history = useHistory();
    const enterDetail = (id: number) => {
        // TODO 现在你点击一个歌单，url 地址确实变化了，但页面却没有任何改变，这是什么原因呢？
        // 具体来说就是 renderRoutes 方法。这个方法中传入参数为路由配置数组，我们在组件中调用这个方法后只能渲染一层路由，再深层的路由就无法渲染。所以要在其父组件添加 renderRouters
        history.push(`/recommend/${id}`)
    }
    return (
        <ListWrapper>
            <h1 className="title"> 推荐歌单 </h1>
            <List>
                {
                    list && list.map((item) => {
                        return (
                            <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <div className="decorate"></div>
                                    {/* 加此参数可以减小请求的图片资源大小 */}
                                    <LazyLoad throttle={200} height={300}>
                                        <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                    <div className="play_count">
                                        <i className="iconfont play">&#xe885;</i>
                                        <span className="count">{getCount(item.playCount)}</span>
                                    </div>
                                </div>
                                <div className="desc">{item.name}</div>
                            </ListItem>
                        )
                    })
                }
            </List>
        </ListWrapper>
    );
}

export default React.memo(RecommendList);