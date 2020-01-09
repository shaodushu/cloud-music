/**
 * 找到当前的歌曲索引
 * @param song 
 * @param list 
 */
export const findIndex = (song: { id: number; }, list: any[]) => {
    return list.findIndex(item => {
        return song.id === item.id;
    });
};

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * 随机算法
 * @param arr 
 */
export function shuffle(arr: any[]) {
    let new_arr: any[] = [];
    arr.forEach(item => {
        new_arr.push(item);
    });
    for (let i = 0; i < new_arr.length; i++) {
        let j = getRandomInt(0, i);
        let t = new_arr[i];
        new_arr[i] = new_arr[j];
        new_arr[j] = t;
    }
    return new_arr;
}

/**
 * 转换歌曲播放时间
 * @param interval 
 */
export const formatPlayTime = (interval: number) => {
    interval = interval | 0;// |0 表示向下取整
    const minute = (interval / 60) | 0;
    // padStart() 方法用另一个字符串填充当前字符串(重复，如果需要的话)，以便产生的字符串达到给定的长度。填充从当前字符串的开始(左侧)应用的。
    const second = (interval % 60).toString().padStart(2, "0");
    return `${minute}:${second}`;
};

/**
 * 拼接出歌曲的 url 链接
 * @param id 
 */
export const getSongUrl = (id: number) => {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};

// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement("div").style;

let vendor = (() => {
    // 首先通过 transition 属性判断是何种浏览器
    let transformNames = {
        webkit: "webkitTransform",
        Moz: "MozTransform",
        O: "OTransfrom",
        ms: "msTransform",
        standard: "Transform"
    };

    for (const key in Object.keys(transformNames)) {
        if (elementStyle[Object.values(transformNames)[key] as any] !== undefined) {
            return Object.keys(transformNames)[key];
        }
    }
    return false;
})();

/**
 * 浏览器厂商会有不同的前缀
 * @param style 
 */
export function prefixStyle(style: string) {
    if (vendor === false) {
        return false;
    }
    if (vendor === "standard") {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

/**
 * count单位转化
 * @param count 
 */
export const getCount = (count: number) => {
    if (count < 0) return;
    if (count < 10000) {
        return count;
    } else if (Math.floor(count / 10000) < 10000) {
        return Math.floor(count / 1000) / 10 + "万";
    } else {
        return Math.floor(count / 10000000) / 10 + "亿";
    }
}

/**
 * 判断一个对象是否为空
 * @param obj 
 */
export const isEmptyObject = (obj: {}) => !obj || Object.keys(obj).length === 0;

/**
 * 
 * @param list 
 */
export const getName = (list: any[]) => {
    let str = "";
    list.map((item, index) => {
        str += index === 0 ? item.name : "/" + item.name;
        return item;
    });
    return str;
};

/**
 * 防抖函数
 * @param {Function} func 
 * @param {String} delay 
 */
export const debounce = (func?: Function, delay?: number) => {
    let timer: number;
    return function (...args: any) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            //@ts-ignore
            func.apply(this, args);
            clearTimeout(timer);
        }, delay);
    }
}

// 处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = (rankList: string | any[]) => {
    for (let i = 0; i < rankList.length - 1; i++) {
        if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
            return i + 1;
        }
    }
};