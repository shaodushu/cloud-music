import styled from 'styled-components';
import style from '../../assets/global-style';

// Props 中的 globalRank 和 tracks.length 均代表是否为全球榜
interface ContainerProps {
  play: number
}
export const Container = styled.div<ContainerProps>`
  position: fixed;
  top: 94px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
  .offical,.global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: ${style["font-size-l"]};
    color: ${style["font-color-desc"]};
  }
`;
export const ListWrapper = styled.div`
  max-width: 100%;
  width: 94%;
  margin: auto;
`

interface ListProps {
  globalRank?: boolean
}
export const List = styled.ul<ListProps>`
  margin-top: 10px;
  padding: 0 5px;
  /* TODO 构建Grid组件 */
  display: ${props => props.globalRank ? "grid" : ""};
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  background: ${style["background-color"]};
`
interface ListItemProps {
  tracks: any[]
}
export const ListItem = styled.li<ListItemProps>`
  display: ${props => props.tracks.length ? "flex" : ""};
  padding: 5px 0;
  /* border-bottom: 1px solid ${style["border-color"]}; */
  .img_wrapper {
    width:  ${props => props.tracks.length ? "27vw" : "29vw"};
    height: ${props => props.tracks.length ? "27vw" : "29vw"};
    border-radius: 3px;
    position: relative;
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,100%,0),hsla(0,0%,43%,.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
  .desc {
      overflow: hidden;
      margin: 5px 0 0px;
      text-align: left;
      font-size: ${style["font-size-s"]};
      line-height: 1.4;
      color: ${style["font-color-desc"]};
      ${style.noWrap(2)}
    }
`;
export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 10px;
  >li {
    font-size: ${style["font-size-s"]};
    color: #656565;
  }
`;