import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { SelectTickAtom, ShowRangeAtom } from '@/src/store/atoms';
import { ChartFn } from './echartFn';


const ChartContainer = styled.div`
  width: 100%;
  height: 100px;
`;

interface Chart2Props {
    xData: string[];
    yData: number[];
}

const Chart2: React.FC<Chart2Props> = ({ xData, yData }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const [hoveredOneTick] = useAtom(SelectTickAtom);
    const [displayedRange] = useAtom(ShowRangeAtom)

    useEffect(() => {
        const chartDom = chartRef.current;
        if (!chartDom) return;
        const chart = echarts.init(chartDom);
        chartInstance.current = chart;

        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params: any) {
                    return '';
                },
                axisPointer: {
                    type: 'cross',
                    label: {
                        formatter: (params: any) => {
                            if (params && params.axisDimension === 'y' && params.value !== undefined) {
                                return Math.round(params.value) 
                            }
                            return "1";
                        },
                    },
                },
            },

            xAxis: {
                type: 'category',
                data: xData,
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: true,
                    interval: 0,
                    showMinLabel: true,
                    showMaxLabel: true,
                    fontSize: 10,
                    formatter: (value: string, index: number) => {
                        if (index === 0 || index === xData.length - 1) {
                            const time = value.split(' ')[1];
                            return time ? time.substring(0, 8) : '';
                        }
                        return '';
                    }
                },
                axisPointer: {
                    label: { show: false },  // 关闭 X 轴的 axisPointer label
                },
            },
            yAxis: {
                type: 'value',
                // scale: true,
                axisLabel: {
                    showMaxLabel: false,

                    formatter: (value: number) => {
                        return value
                    },
                },
            },

            grid: {
                top: '0%',
                left: '0%',
                right: '0%',
                bottom: '0%', // 增加 bottom 值，留出空隙
                containLabel: true,
            },
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
            series: [
                {
                    type: 'bar',
                    data: yData,
                    itemStyle: {
                        color: 'rgb(139, 69, 19)'
                    }
                },
            ],
        };

        chart.setOption(option);

        return () => {
            chartInstance.current?.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xData, yData]);

    useEffect(() => {
        if (hoveredOneTick && hoveredOneTick.tick.TickTime && chartInstance.current) {
            const index = xData.indexOf(hoveredOneTick.tick.TickTime);
            if (index !== -1) {
                chartInstance.current.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: index,
                });
            } else {
                chartInstance.current.dispatchAction({
                    type: 'hideTip',
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hoveredOneTick])




    /** 重新选定zoom的范围 */
    useEffect(() => {
        if (displayedRange && displayedRange.startIndex !== undefined && displayedRange.endIndex !== undefined && chartInstance.current) {
            const { startIndex, endIndex } = displayedRange;
            ChartFn.UpdateRange(chartInstance.current, xData, startIndex, endIndex)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayedRange])

    return <ChartContainer ref={chartRef} />;
};

export default Chart2;


