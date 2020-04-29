import styled from 'styled-components';
import style from '../../assets/global-style';

interface ContentProps {
  play: number
}
export const Content = styled.div<ContentProps>`
  position: fixed;
  top: 94px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
  background:${style["background-color"]};
`