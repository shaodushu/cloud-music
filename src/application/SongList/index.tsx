import React, { Ref } from 'react';
import { SongList, SongItem } from "./style";
import { getName, getCount } from '../../api/utils';
import * as actionTypes from './../../application/Player/store/actionCreators';
import { useDispatch } from 'react-redux';

const SongsList = React.forwardRef((props: CloudMusic.SongsList, refs: Ref<HTMLDivElement>) => {
    const { collectCount, showCollect, songs, showBackground } = props;
    const { musicAnimation } = props
    const totalCount = songs.length;
    const dispatch = useDispatch()
    const selectItem = (e: React.MouseEvent, index: number) => {
        dispatch(actionTypes.changePlayList(songs))
        dispatch(actionTypes.changeSequecePlayList(songs))
        dispatch(actionTypes.changeCurrentIndex(index))
        musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY)
    }

    let songList = (list: string | any[]) => {
        let res = [];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            res.push(
                <li key={item.id + '' + i} onClick={(e) => selectItem(e, i)}>
                    <span className="index">{i + 1}</span>
                    <div className="info">
                        <span>{item.name}</span>
                        <span>
                            {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
                        </span>
                    </div>
                </li>
            )
        }
        return res;
    };

    const collect = (count?: number) => {
        if (!count) {
            return
        }
        return (
            <div className="add_list">
                <i className="iconfont">&#xe62d;</i>
                <span > 收藏 ({getCount(count)})</span>
            </div>
        )
    };
    return (
        <SongList ref={refs} showBackground={showBackground}>
            <div className="first_line">
                <div className="play_all" onClick={(e) => selectItem(e, 0)}>
                    <i className="iconfont">&#xe6e3;</i>
                    <span > 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
                </div>
                {showCollect ? collect(collectCount) : null}
            </div>
            <SongItem>
                {songList(songs)}
            </SongItem>
        </SongList>
    )
})
export default React.memo(SongsList);