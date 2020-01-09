import React, { useRef, useState, useEffect } from 'react';
import { ProgressBarWrapper } from './style'
import { prefixStyle } from '../../api/utils';

function ProgressBar(props: { percent: number, percentChange?: (precent: number) => void; }) {
    const { percentChange, percent } = props;
    const progressBar = useRef<HTMLDivElement>(null);
    const progress = useRef<HTMLDivElement>(null);
    const progressBtn = useRef<HTMLDivElement>(null);
    const [touch, setTouch] = useState<CloudMusic.ProgressBarTouch>({
        initiated: false,
        startX: 0,
        left: 0
    });

    const progressBtnWidth = 16;
    const transform = prefixStyle("transform");

    useEffect(() => {
        const progressDom = progress.current
        const progressBarDom = progressBar.current
        const progressBtnDom = progressBtn.current
        if (!progressBarDom || !progressDom || !progressBtnDom || !transform) {
            return
        }
        if (percent >= 0 && percent <= 1 && !touch.initiated) {
            const barWidth = progressBarDom.clientWidth - progressBtnWidth;
            const offsetWidth = percent * barWidth;
            progressDom.style.width = `${offsetWidth}px`;
            progressBtnDom.style[transform as any] = `translate3d(${offsetWidth}px, 0, 0)`;
        }
    }, [percent, touch, transform])

    const _changePercent = () => {
        const progressDom = progress.current
        const progressBarDom = progressBar.current
        if (!progressBarDom || !progressDom) {
            return
        }
        const barWidth = progressBarDom.clientWidth - progressBtnWidth;
        const curPercent = progressDom.clientWidth / barWidth;// 新的进度计算
        if (percentChange) {
            percentChange(curPercent);// 把新的进度传给回调函数并执行
        }
    }

    // 处理进度条的偏移
    const _offset = (offsetWidth: number) => {
        const progressDom = progress.current
        const progressBtnDom = progressBtn.current
        if (!progressDom || !progressBtnDom) {
            return
        }
        progressDom.style.width = `${offsetWidth}px`;
        progressBtnDom.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
    }

    const progressTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const progressDom = progress.current
        if (!progressDom) {
            return
        }
        const startTouch: CloudMusic.ProgressBarTouch = {
            initiated: false,
            startX: 0,
            left: 0
        };
        startTouch.initiated = true;
        startTouch.startX = e.touches[0].pageX;
        startTouch.left = progressDom.clientWidth;
        setTouch(startTouch);
    }

    const progressTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const progressBarDom = progressBar.current
        if (!progressBarDom) {
            return
        }
        if (!touch.initiated) return;
        // 滑动距离   
        const deltaX = e.touches[0].pageX - touch.startX;
        const barWidth = progressBarDom.clientWidth - progressBtnWidth;
        const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
        _offset(offsetWidth);
    }

    const progressTouchEnd = () => {
        const endTouch: CloudMusic.ProgressBarTouch = JSON.parse(JSON.stringify(touch));
        endTouch.initiated = false;
        setTouch(endTouch);
        _changePercent();
    }

    const progressClick = (e: React.MouseEvent) => {
        const progressBarDom = progressBar.current
        if (!progressBarDom) {
            return
        }
        const rect = progressBarDom.getBoundingClientRect();
        const barWidth = progressBarDom.clientWidth - progressBtnWidth;
        const offsetWidth = Math.min(e.pageX - rect.left, barWidth);
        _offset(offsetWidth);
        _changePercent();
    };

    return (
        <ProgressBarWrapper>
            <div className="bar-inner" ref={progressBar} onClick={progressClick}>
                <div className="progress" ref={progress}></div>
                <div className="progress-btn-wrapper" ref={progressBtn}
                    onTouchStart={progressTouchStart}
                    onTouchMove={progressTouchMove}
                    onTouchEnd={progressTouchEnd}
                >
                    <div className="progress-btn"></div>
                </div>
            </div>
        </ProgressBarWrapper>
    )
}

export default React.memo(ProgressBar);