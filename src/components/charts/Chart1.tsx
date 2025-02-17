import { useRef, useEffect, useCallback, useMemo } from 'react';
import * as echarts from 'echarts';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { SelectTickAtom, ShowRangeAtom } from '../store/atoms';
import { OneTick } from '../../types/tick';
import { chart1Option, extractSeriesData } from './echartsOption'; 
import { ChartFn } from './echartFn';

export const Y_AXIS_PADDING = 0.001;


const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
`;


/** 返回一个数组百分位的对应索引 */
function getPercentileRangeIndices(arr: any[], lowerPercentile: number, upperPercentile: number): [number, number] | [] {
    if (!arr || arr.length === 0 || lowerPercentile < 0 || lowerPercentile >= 100 || upperPercentile <= 0 || upperPercentile > 100 || lowerPercentile >= upperPercentile) {
        return []; // 处理无效输入
    }
    const length = arr.length;
    const lowerIndex = Math.ceil((lowerPercentile / 100) * length);
    const upperIndex = Math.floor((upperPercentile / 100) * length);
    if (lowerIndex >= length) {
        return []
    }
    return [lowerIndex, upperIndex];
}

interface Chart1Props {
    ticks: OneTick[];
    inpTime?: string
}

const Chart1: React.FC<Chart1Props> = ({ ticks, inpTime }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const [SelectTick, SetSelectTick] = useAtom(SelectTickAtom);
    const [showRange, setShowRange] = useAtom(ShowRangeAtom);

    const xList = useMemo(() => {
        return ticks.map((item) => item.TickTime)
    }, [ticks]); // X轴的坐标


    // 是用户的操作导致的范围变化 而不是echars自己的
    // 当拖动echars时 他会给你新的范围值，并且图形也已经变化好了，你不再需要重新去改这个范围
    const needChangeRange = useRef<boolean>(false);

    /** 入口:更新目前被选中的Bar Index */
    const EventSetNewIdx = useCallback((nidx: number) => {
        if (nidx < 0 || nidx >= ticks.length) {
            return
        }
        SetSelectTick(prevTick => {
            if (prevTick && nidx === prevTick.idx) {
                return prevTick; // No change
            }
            // console.log(`Use New Index `, nidx); // 这个日志太频繁
            const newHoveredOneTick = { idx: nidx, tick: ticks[nidx] };
            return newHoveredOneTick;
        });
    }, [ticks, SetSelectTick])


    /* enter的输入 导致需要切换时间 */
    useEffect(() => {
        if (!inpTime) return
        const index = xList.indexOf(inpTime);
        if (index<=0) return
        console.log(`enterInput is:`, inpTime,` Got Idx:`,index)
        const offset = 150
        const st = Math.max(0, index - offset)
        const end = Math.min(ticks.length - 1, index + offset)
        needChangeRange.current = true
        setShowRange({ startIndex: st, endIndex: end });
        EventSetNewIdx(index)
    }, [inpTime, setShowRange, ticks.length, EventSetNewIdx, xList]);

    /** 初始化图形 */
    useEffect(() => {
        console.log(`Chart1 Ticks length is `, ticks.length)
        const chartDom = chartRef.current;
        if (!chartDom) return;
        chartInstance.current = echarts.init(chartDom);
        chartInstance.current.setOption(chart1Option(ticks, EventSetNewIdx));
        return () => {
            console.log(`Chart1 dispose!`)
            chartInstance.current?.dispose();
        };
    }, [ticks, EventSetNewIdx,]);

    /** 拖动操作导致图形的范围变化了 */
    useEffect(() => {
        if (!chartInstance.current) return
        const dataZoomFn = (params: any) => {
            // console.log(`dataZoom触发，`, params)
            /* 传入的params会有两种不同的类型 */
            const range = { start: 0, end: 10 };
            if (params.batch) {
                const batchValue = params.batch[0]
                range.start = batchValue.start
                range.end = batchValue.end
            } else {
                range.start = params.start
                range.end = params.end
            }
            console.log(`新的起点和终点是:`, range)
            const idxs = getPercentileRangeIndices(ticks, range.start, range.end)
            if (idxs.length < 2) {
                return
            }
            setShowRange({ startIndex: idxs[0]!, endIndex: idxs[1]! });
        }
        chartInstance.current.on('dataZoom', dataZoomFn);
        return () => { }
    }, [ticks, setShowRange]);



    /** 输入一个步长 让显示的范围整体进行一次移动 */
    const AddDisPlayRange = useCallback((step: number) => {
        if (step === 0) return
        if (!showRange) return
        const { startIndex, endIndex } = showRange;
        let useStep = step
        if (step > 0) {
            /* 假如总长length=100 step=5 
                目前的end是93那可以移动5 
                目前的end是94那可以移动5
                目前的end是95那可以移动4
                目前的end是99那可以移动0 
            */
            const remain = ticks.length - 1 - endIndex
            if (remain < step) {
                useStep = remain
            }
        } else {
            if (startIndex < step) {
                useStep = startIndex
            }
        }
        if (!useStep) return
        needChangeRange.current = true
        setShowRange({ startIndex: startIndex + useStep, endIndex: endIndex + useStep });
    }, [ticks.length, setShowRange, showRange]);

    /* 为选中的bar增加一个位移 */
    const AddOffsetForIndex = useCallback((step: number) => {
        // console.log(`SelectTick is `, SelectTick)
        if (SelectTick) {
            const nIdx = SelectTick.idx + step
            // console.log(`Keyboard New Idx is `, nIdx)
            EventSetNewIdx(nIdx)
        }
        // 改目前的范围
        AddDisPlayRange(step)

    }, [SelectTick, EventSetNewIdx, AddDisPlayRange]);


    /* 值驱动 - 选中的index改变时 */
    useEffect(() => {
        chartInstance.current?.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: SelectTick?.idx,
        });
    }, [SelectTick?.idx]);

    /* 值驱动 - 范围改变时 */
    useEffect(() => {
        if (!showRange || showRange.startIndex >= showRange.endIndex) {
            return
        }

        /* 根据目前的数据范围 计算出合理的Y轴上下限 */
        const calculateYMinMax = (startIndex?: number, endIndex?: number) => {
            const displayData = ticks.slice(startIndex || 0, endIndex || ticks.length - 1);
            if (displayData.length === 0) return { minY: 0, maxY: 2 };

            const bidSeriesData = extractSeriesData(displayData, 'BidPvs');
            const askSeriesData = extractSeriesData(displayData, 'AskPvs');
            const bidValues = bidSeriesData.flatMap(item => item.data);
            const minBidValue = Math.min(...bidValues);
            const askValues = askSeriesData.flatMap(item => item.data);
            const maxAskValue = Math.max(...askValues);
            return {
                minY: minBidValue - Y_AXIS_PADDING,
                maxY: maxAskValue + Y_AXIS_PADDING
            }
        }
        const newMinMax = calculateYMinMax(showRange.startIndex, showRange.endIndex);
        const yAxisOption = {
            min: newMinMax.minY,
            max: newMinMax.maxY,
        }
        chartInstance.current?.setOption({
            yAxis: [{ ...yAxisOption, }]
        })
        // 范围的重置
        if (needChangeRange.current) {
            console.log(`动态调整X范围`, showRange)
            ChartFn.UpdateRange(chartInstance.current, xList, showRange.startIndex, showRange.endIndex)
            needChangeRange.current = false
        }
    }, [ticks, xList, showRange]);



    /* 键盘的Key事件 */
    useEffect(() => {
        /** 键盘事件 */
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!chartInstance.current) return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault() // 只有命中要监听的键，才需要去掉传递
                handleKeyDownArrow(event)
                return
            }
        };

        /** 键盘箭头事件 */
        const handleKeyDownArrow = (event: KeyboardEvent) => {
            let move = 0
            if (event.key === 'ArrowRight') {
                move = 1
            } else if (event.key === 'ArrowLeft') {
                move = -1
            }
            if (move !== 0) {
                AddOffsetForIndex(move)
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [AddOffsetForIndex]);

    return <ChartContainer ref={chartRef} />;
};

export default Chart1;