import styled from 'styled-components';

interface ContentProps {
  play: number
}
export const Content = styled.div<ContentProps>`
  position: fixed;
  top: 94px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
`