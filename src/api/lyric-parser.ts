/**
 * 解析 [00:01.997] 这一类时间戳的正则表达式
 */
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

/**
 * 暂停
 */
const STATE_PAUSE = 0
/**
 * 播放
 */
const STATE_PLAYING = 1

const tagRegMap = {
    title: 'ti',
    artist: 'ar',
    album: 'al',
    offset: 'offset',
    by: 'by'
}

// function noop() {
// }
/**
 * @todo 传入歌词，按照正则表达式解析
 * @version 1.0.0
 * @param {String} lyc 未格式化的歌词
 * @param {Function} hanlder 回调函数
 * @param {Number} speed 播放速度
 * @description 解析的数据结构为
 * @returns {String} txt 歌词
 * @returns {Number} time 歌词显示时间点
 */
export default class Lyric {
    lrc: string
    tags!: {
        title: string
        artist: string
        album: string
        offset: string
        by: string
    }
    /**
     * 这是解析后的数组，每一项包含对应的歌词和时间
     * @type {Array<{time: number,txt: string}>}
     */
    lines: Array<{
        time: number
        txt: string
    }>
    /**
     * 回调函数
     */
    handler: ({
        txt,
        lineNum
    }: { txt: string, lineNum: number }) => void
    state: number
    /**
     * 当前播放歌词所在的行数
     * @type {number}
     */
    curLineIndex: number
    /**
     * 歌曲播放速度
     * @type {number}
     */
    speed: number
    offset: number
    /**
     * 歌曲开始的时间戳
     * @type {number}
     * @memberof Lyric
     */
    startStamp!: number
    timer!: number

    constructor(lrc: string, hanlder: { ({ lineNum, txt }: { lineNum: number; txt: string }): void; ({ txt, lineNum }: { txt: string; lineNum: number }): void }, speed = 1) {
        this.lrc = lrc
        this.lines = []
        this.handler = hanlder
        this.state = STATE_PAUSE
        this.curLineIndex = 0
        this.speed = speed
        this.offset = 0

        this._init()
    }

    private _init() {
        this._initTag()
        this._initLines()
    }

    private hasKey<O>(obj: O, key: keyof any): key is keyof O {
        return key in obj
    }

    private _initTag() {
        for (let tag in tagRegMap) {
            if (this.hasKey(tagRegMap, tag)) {
                // tagRegMap[tag] // works fine!
                const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
                if (matches) {
                    this.tags[tag] = matches[1] || ''
                }
            }
        }
    }

    /**
     * 解析字符串，生成 lines 数组
     */
    private _initLines() {
        const lines = this.lrc.split('\n')
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            let result: Array<string> | null = timeExp.exec(line)
            if (result) {
                const txt = line.replace(timeExp, '').trim();
                if (txt) {
                    // TODO parseInt  精度
                    if (result[3].length === 3) {
                        result[3] = (parseInt(result[3]) / 10).toString();
                    }
                    this.lines.push({
                        time: parseInt(result[1]) * 60 * 1000 + parseInt(result[2]) * 1000 + (parseInt(result[3]) || 0) * 10,
                        txt
                    })
                }
            }
        }

        this.lines.sort((a, b) => {
            return a.time - b.time
        })

    }

    private _findcurLineIndex(time: number) {
        for (let i = 0; i < this.lines.length; i++) {
            if (time <= this.lines[i].time) {
                return i
            }
        }
        return this.lines.length - 1
    }

    private _callHandler(i: number) {
        if (i < 0) {
            return
        }
        this.handler({
            txt: this.lines[i].txt,
            lineNum: i
        })
    }

    private _playRest(isSeek = false) {
        let line = this.lines[this.curLineIndex]
        let delay;
        if (isSeek) {
            delay = line.time - (+new Date() - this.startStamp);
        } else {
            //拿到上一行的歌词开始时间，算间隔
            let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0;
            delay = line.time - preTime;
        }
        this.timer = setTimeout(() => {
            this._callHandler(this.curLineIndex++)
            if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
                this._playRest()
            }
        }, (delay / this.speed))
    }

    changeSpeed(speed: number) {
        this.speed = speed;
    }

    /**
     * 
     * @param {Number} offset 时间进度（单位 ms）
     * @param {Boolean} isSeek 标志位表示用户是否手动调整进度
     */
    play(offset = 0, isSeek = false) {
        if (!this.lines.length) {
            return
        }
        this.state = STATE_PLAYING

        this.curLineIndex = this._findcurLineIndex(offset)
        //现在正处于第this.curLineIndex-1行
        this._callHandler(this.curLineIndex - 1)
        this.offset = offset
        this.startStamp = +new Date() - offset

        if (this.curLineIndex < this.lines.length) {
            clearTimeout(this.timer)
            this._playRest(isSeek)
        }
    }

    /**
     * 切换播放
     * @param {Number} offset 时间进度（单位 ms） 
     */
    togglePlay(offset: number) {
        if (this.state === STATE_PLAYING) {
            this.stop()
            this.offset = offset
        } else {
            this.state = STATE_PLAYING
            this.play(offset, true)
        }
    }

    /**
     * 播放暂停并重置播放位置偏移量
     */
    stop() {
        this.state = STATE_PAUSE
        this.offset = 0
        clearTimeout(this.timer)
    }

    /**
     * 用户手动调整进度
     * @param offset 
     */
    seek(offset: number) {
        this.play(offset, true)
    }
}