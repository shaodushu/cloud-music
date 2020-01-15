import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container, ShortcutWrapper, HotKey, List, ListItem, SongItem } from './style';
import { useHistory } from 'react-router';
import SearchBox from './../../baseUI/search-box/index';
import { useSelector, useDispatch } from 'react-redux';
import Scroll from '../../baseUI/scroll'
import * as actionTypes from './store/actionCreators';
import Loading from './../../baseUI/loading/index';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { getName } from '../../api/utils';
import { getSongDetail } from '../Player/store/actionCreators';
import MusicalNote, { MusicNoteHandles } from '../../baseUI/music-note';

function Search() {
    // 控制动画
    const [show, setShow] = useState(false);
    const history = useHistory()
    const dispatch = useDispatch()
    const musicNoteRef = useRef<MusicNoteHandles>(null);

    // 组件内部
    const [query, setQuery] = useState('');
    const hotList = useSelector((state: any) => state.getIn(['search', 'hotList']))
    const enterLoading = useSelector((state: any) => state.getIn(['search', 'enterLoading']))
    const suggestList = useSelector((state: any) => state.getIn(['search', 'suggestList']))
    const songsCount = useSelector((state: any) => state.getIn(['player', 'playList']).size)
    const songsList = useSelector((state: any) => state.getIn(['search', 'songsList']))

    const suggestListJS = suggestList.toJS()
    const songsListJS = songsList ? songsList.toJS() : [];

    useEffect(() => {
        setShow(true);
        if (!hotList.size)
            dispatch(actionTypes.getHotKeyWords());
    }, [dispatch, hotList.size]);
    // 由于是传给子组件的方法，尽量用 useCallback 包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
    const searchBack = useCallback(() => {
        setShow(false);
    }, []);

    const handleQuery = (q: string) => {
        setQuery(q);
        if (!q) return;
        dispatch(actionTypes.changeEnterLoading(true));
        dispatch(actionTypes.getSuggestList(q));
    }

    const renderHotKey = () => {
        let list = hotList ? hotList.toJS() : [];
        return (
            <ul>
                {
                    list.map((item: any) => {
                        return (
                            <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                                <span>{item.first}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    };
    const renderSingers = () => {
        let singers = suggestListJS.artists ? suggestListJS.artists : [];
        if (!singers || !singers.length) return;
        return (
            <List>
                <h1 className="title"> 相关歌手 </h1>
                {
                    singers.map((item: { id: number, accountId: string; picUrl: string | undefined; name: React.ReactNode; }, index: string) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => history.push(`/singers/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" alt="singer" />}>
                                        <img src={item.picUrl} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name"> 歌手: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderAlbum = () => {
        let albums = suggestListJS.mvs ? suggestListJS.mvs : [];
        if (!albums || !albums.length) return;
        return (
            <List>
                <h1 className="title"> 相关歌单 </h1>
                {
                    albums.map((item: { id: number, accountId: string; cover: string | undefined; name: React.ReactNode; }, index: string) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => history.push(`/album/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" alt="music" />}>
                                        <img src={item.cover} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name"> 歌单: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderSongs = () => {
        return (
            <SongItem style={{ paddingLeft: "20px" }}>
                {
                    songsListJS.map((item: { id: string | number | undefined; name: React.ReactNode; artists: any[]; album: { name: React.ReactNode; }; }) => {
                        return (
                            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                                <div className="info">
                                    <span>{item.name}</span>
                                    <span>
                                        {getName(item.artists)} - {item.album.name}
                                    </span>
                                </div>
                            </li>
                        )
                    })
                }
            </SongItem>
        )
    };

    const selectItem = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, id: string | number | undefined) => {
        dispatch(getSongDetail(id))
        const musicNoteDom = musicNoteRef.current
        if (!musicNoteDom) return
        musicNoteDom.startAnimation({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
    }
    return (
        <CSSTransition
            in={show}
            timeout={300}
            appear={true}
            classNames="fly"
            unmountOnExit
            onExited={() => history.goBack()}
        >
            <Container play={songsCount}>
                <div className="search_box_wrapper">
                    <SearchBox back={searchBack} newQuery={query} onQuery={handleQuery}></SearchBox>
                </div>
                <ShortcutWrapper show={!query}>
                    <Scroll>
                        <div>
                            <HotKey>
                                <h1 className="title"> 热门搜索 </h1>
                                {renderHotKey()}
                            </HotKey>
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                <ShortcutWrapper show={query}>
                    <Scroll onScroll={forceCheck}>
                        <div>
                            {renderSingers()}
                            {renderAlbum()}
                            {renderSongs()}
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                {enterLoading ? <Loading></Loading> : null}
                <MusicalNote ref={musicNoteRef}></MusicalNote>
            </Container>

        </CSSTransition>
    )
}

export default React.memo(Search);