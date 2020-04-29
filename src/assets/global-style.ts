// 扩大可点击区域
const extendClick = () => {
  return `
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: -10px; bottom: -10px; left: -10px; right: -10px;
      };
    `
}
/**
 * 文字溢出部分用... 代替
 * @param line 
 */
const noWrap = (line: number = 1) => {
  if (line === 1) {
    return `
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `
  } else {
    return `
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${line};
    `
  }
}

/**
 * 淡入
 */
const fadeIn = `
  opacity: 1;
  animation: fadeIn 500ms linear;
  @keyframes fadeIn{
    0% { opacity: 0 }
    100% { opacity: 1 }
  }
`

export default {
  'theme-color': 'rgb(33, 33, 33)',
  'theme-color-shadow': 'rgba(217, 67, 52, .5)',
  'font-color-light': '#f1f1f1',
  'font-color-desc': '#fff',
  'font-color-desc-v2': '#bba8a8',// 略淡
  'font-size-ss': '10px',
  'font-size-s': '12px',
  'font-size-m': '14px',
  'font-size-l': '16px',
  'font-size-ll': '18px',
  "border-color": '#e4e4e4',
  'background-color': 'rgb(21,21,21)',
  'background-color-shadow': 'rgba(0, 0, 0, 0.3)',
  'highlight-background-color': '#fff',
  extendClick,
  noWrap,
  fadeIn
}