import React, { useRef, useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { Top, Tab, TabItem } from './style';
import { NavLink, useHistory } from 'react-router-dom';// 利用 NavLink 组件进行路由跳转
import Player from '../Player';
import Drawer, { DrawerProps } from '../../baseUI/drawer'
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from '../../store/app/actionCreators';
import { Skin } from '../../assets/global-style'
import { useSize } from '../../api/custom-hook'

function Home(props: { route: any; }) {
    const { route } = props
    const history = useHistory()
    const drawerRef = useRef<DrawerProps>(null);
    const theme = useSelector((state: any) => state.getIn(['app', 'theme']))

    function showDrawer() {
        drawerRef.current!.show();
    }

    const themeJS = theme.toJS()
    const dispatch = useDispatch()

    const handleToggleTheme = (color: string) => {
        if (color === 'black') {
            dispatch(actionTypes.changeTheme(Skin.a))
        } else {
            dispatch(actionTypes.changeTheme(Skin.b))
        }

    }

    const [size] = useSize()
    const [isPC, setIsPC] = useState(false)

    useEffect(() => {
        setIsPC(!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))
    }, [size])

    if (isPC) {
        return <div style={{ textAlign: "center", height: "100%", lineHeight: "100vh" }}>The PC did not fit</div>
    }

    return (
        <>
            <Top>
                <span className="iconfont menu" onClick={showDrawer}>&#xe65c;</span>
                <span className="title">WebApp</span>
                <span className="iconfont search" onClick={() => history.push('/search')}>&#xe62b;</span>
            </Top>
            <Tab>
                <NavLink to="/recommend" activeClassName="selected"><TabItem><span > 推荐 </span></TabItem></NavLink>
                <NavLink to="/singers" activeClassName="selected"><TabItem><span > 歌手 </span></TabItem></NavLink>
                <NavLink to="/rank" activeClassName="selected"><TabItem><span > 排行榜 </span></TabItem></NavLink>
            </Tab>
            <Player></Player>
            <Drawer ref={drawerRef}>
                <h1>当前主题:{themeJS.themeColor}</h1>
                <button onClick={() => handleToggleTheme('black')}>黑</button>
                <button onClick={() => handleToggleTheme('white')}>白</button>
            </Drawer>
            {renderRoutes(route.routes)}
        </>
    )
}

export default React.memo(Home);