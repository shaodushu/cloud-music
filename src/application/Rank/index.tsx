import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { filterIndex } from '../../api/utils';
import { List, ListItem, SongList, Container, ListWrapper } from './style'
import Scroll from '../../baseUI/scroll'
import { renderRoutes } from 'react-router-config';
import { EnterLoading } from './../Singers/style';
import Loading from '../../baseUI/loading';
import { useHistory } from 'react-router';

function Rank(props: any) {
    const rankList = useSelector((state: any) => state.getIn(['rank', 'rankList']))
    const loading = useSelector((state: any) => state.getIn(['rank', 'loading']))
    const songsCount = useSelector((state: any) => state.getIn(['player', 'playList']).size)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actionTypes.getRankList());
    }, [dispatch]);

    let rankListJS = rankList ? rankList.toJS() : [];

    let globalStartIndex = filterIndex(rankListJS);
    let officialList = rankListJS.slice(0, globalStartIndex);
    let globalList = rankListJS.slice(globalStartIndex);

    const history = useHistory()

    const enterDetail = (detail: { id: any; }) => {
        history.push(`/rank/${detail.id}`)
    }

    // 这是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
    const renderRankList = (list: any[], global?: boolean) => {
        return (
            <List globalRank={global}>
                {
                    list.map((item) => {
                        return (
                            <ListItem key={item.id} tracks={item.tracks} onClick={() => enterDetail(item)}>
                                <div className="img_wrapper">
                                    <img src={item.coverImgUrl} alt="" />
                                    <div className="decorate"></div>
                                    <span className="update_frequecy">{item.updateFrequency}</span>
                                </div>
                                {global ? <div className="desc">{item.name}</div> : null}

                                {renderSongList(item.tracks)}
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    const renderSongList = (list: any[]) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
                    })
                }
            </SongList>
        ) : null;
    }

    // 榜单数据未加载出来之前都给隐藏
    let displayStyle = loading ? { "display": "none" } : { "display": "" };

    return (
        <Container play={songsCount}>
            <Scroll>
                <div>
                    <ListWrapper>
                        <h1 className="offical" style={displayStyle}> 官方榜 </h1>
                        {renderRankList(officialList)}
                        <h1 className="global" style={displayStyle}> 全球榜 </h1>
                        {renderRankList(globalList, true)}
                        {loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
                    </ListWrapper>
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Container>
    );
}

export default React.memo(Rank);