const isLetterRegex = new RegExp(`\\w`);

interface Filter {
    (source: string): string;
}

export let filters = new Map<string, Filter>();

// 取第一个字符
filters.set("first", (source: string): string => {
    return source[0];
});

// 获取第一个字母
filters.set("firstLetter", (source: string): string => {
    for (let i = 0; i < source.length; i++) {
        let c = source[i];
        if (isLetterRegex.test(c)) {
            return c;
        }
    }
    return "";
});

// 转换成大写
filters.set("toUpper", (source: string): string => {
    return source.toUpperCase();
});

// 转换成小写
filters.set("toLower", (source: string): string => {
    return source.toLowerCase();
});

// 转换成长度
filters.set("length", (source: string): string => {
    return (source.length) + "";
});

// 对一个原始字符串应用过滤器并返回结果
export function applyFilter(source: string, ...filterNameList: string[]): string {
    let result = source;
    for (let i = 0; i < filterNameList.length; i++) {
        let filter = filters.get(filterNameList[i]);
        if (!filter) { continue; }
        try {
            result = filter(result);
        } catch (e) { continue; }
    }
    return result;
}

