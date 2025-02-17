

export const ChartFn = {
    /** 更新图形显示的范围 */
    UpdateRange: (chars:any, xList:any, stIdx:number, endIdx:number) => {
        chars.setOption({
            dataZoom: [{
                startValue: xList[stIdx],
                endValue: xList[endIdx]
            }]
        })
    }
};

