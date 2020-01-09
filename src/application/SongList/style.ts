import styled from 'styled-components';
import style from '../../assets/global-style';

interface SongListProps {
  showBackground?: boolean
}
export const SongList = styled.div<SongListProps>`
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    /* padding:10px; */
    overflow:hidden;
    opacity: 0.98;
    ${props => props.showBackground ? `background: ${style["highlight-background-color"]}` : ""}
    .first_line {
      box-sizing: border-box;
      padding: 8px 0;
      margin:7px 7px 7px 15px;
      position: relative;
      justify-content: space-between;
      /* border-bottom: 1px solid ${style["border-color"]}; */
      .play_all {
        display: inline-block;
        line-height: 24px;
        color: ${style["font-color-desc"]};
        .iconfont {
          font-size: 24px;
          margin-right: 10px;
          vertical-align: top;
        }
        .sum {
          font-size: ${style["font-size-s"]};
          color: ${style["font-color-desc-v2"]};
        }
        >span {
          vertical-align: top;
        }
      }
      .add_list,.isCollected {
        display: flex;
        align-items: center;
        justify-content:center;
        position: absolute;
        right: 0; top :0; bottom: 0;
        line-height: 34px;
        background: ${style["theme-color"]};
        color: ${style["font-color-light"]};
        font-size: 0;
        border-radius: 50px;
        vertical-align: top;
        padding: 0 10px;
        .iconfont {
          vertical-align: top;
          font-size: 10px;
          margin: 0 5px;
        }
        span {
          font-size: 14px;
          line-height: 34px;
        }
      }
      .isCollected {
        display: flex;
        background: ${style["background-color"]};
        color: ${style["font-color-desc"]};
      }
  }
  `
export const SongItem = styled.ul`
    >li {
      display: flex;
      height: 60px;
      align-items: center;  
      .index {
        flex-basis: 55px;
        width: 55px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color:${style["font-color-desc-v2"]}
      }
      .info {
        box-sizing: border-box;
        flex: 1;
        display: flex;
        height: 100%;
        padding: 5px 0;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px solid ${style["border-color"]};
        ${style.noWrap()}
        >span {
          ${style.noWrap()}
        }
        >span:first-child {
          color: ${style["font-color-desc"]};
        }
        >span:last-child {
          font-size: ${style["font-size-s"]};
          color: #bba8a8;
        }
      }
    }
  `