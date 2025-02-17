import { OneTick } from '../../types/tick';
// 辅助函数
const COLORS = {
    Bid1: 'rgb(53, 121, 6)',
    Ask1: 'rgb(255, 0, 0)',
};

const LINE_CONFIG = {
    type: 'line',
    showSymbol: false,
    lineStyle: {
        width: 1
    }
};


export const extractSeriesData = (data: OneTick[], type: 'BidPvs' | 'AskPvs') => {
    const keys = [3, 2, 1];
    const seriesData: { name: string; data: number[]; color: string }[] = [];
    keys.forEach(level => {
        const name = `${type.slice(0, 3)}${level}`;
        const color = COLORS[name as keyof typeof COLORS] || 'rgb(152, 152, 152)';
        const dataArray0 = data.map(item => item[type][level - 1]);
        const dataArray = dataArray0.map(value => value === 0 ? NaN : value);
        seriesData.push({ name, data: dataArray, color });
    });
    return seriesData;
};


const formatTime = (value: string) => {
    const time = value.split(' ')[1];
    return time ? time.substring(0, 8) : '';
}


export const chart1Option = (
    ticks: OneTick[],
    setHoveredOneTick: (idx: number) => void,

) => {
    const xData = ticks.map(item => item.TickTime);
    const bidSeriesData = extractSeriesData(ticks, 'BidPvs');
    const askSeriesData = extractSeriesData(ticks, 'AskPvs');

    const series = [
        ...bidSeriesData.map(item => ({
            ...LINE_CONFIG,
            name: item.name,
            data: item.data,
            lineStyle: { ...LINE_CONFIG.lineStyle, color: item.color },
        })),
        ...askSeriesData.map(item => ({
            ...LINE_CONFIG,
            name: item.name,
            data: item.data,
            lineStyle: { ...LINE_CONFIG.lineStyle, color: item.color },
        })),
    ];

    const tooltipFormatter = () => {
        return undefined;
    };

    const out = {
        tooltip: {
            trigger: 'axis',
            formatter: tooltipFormatter,
            axisPointer: {
                type: 'cross',
                label: {
                    formatter: (params: any) => {
                        // console.log(`axisPointer.label.formatter is `, params)
                        if (params && params.axisDimension === 'y' && params.value !== undefined) {
                            const value = typeof params.value === 'number' ? params.value.toFixed(3) : '';
                            return value;
                        }
                        if (params && params.axisDimension === 'x' && params.value) {
                            const index = xData.indexOf(params.value);
                            setHoveredOneTick(index);
                            const formattedTime = formatTime(params.value)
                            return formattedTime;
                        }
                        return '';
                    },
                },
            },
        },
        grid: {
            top: '3%',
            left: '1%',
            right: '10%',
            bottom: '10%', // 增加 bottom 值，留出空隙
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisTick: {
                show: false,
            },
            axisLabel: {
                showMinLabel: true,
                showMaxLabel: true,
                fontSize: 10,
                formatter: (value: string, index: number) => {
                    if (index === 0 || index === xData.length - 1) {
                        return formatTime(value);
                    }
                    return '';
                },
            },
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                color: 'black',
                formatter: (value: number) => {
                    return value.toFixed(3);
                },
            },
        },
        dataZoom: [
            {
                type: 'slider', // 设置类型为 slider
            },
            {
                type: 'inside',
                zoomOnMouseWheelSensitivity: 5,
            }
        ],
        series,
    };
    return out;
};