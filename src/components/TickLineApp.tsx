import React, { useState, useEffect } from 'react';
import Chart1 from './charts/Chart1';
import Chart2 from './charts/Chart2';
import TickInfo from './TickInfo';
import useFetchTicks from '../hooks/useFetchTicks';
import styled from 'styled-components';
import { AsuUIs } from 'infa';




const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 90%;
`;


const Chart2Container = styled.div`
  height: 25%;
  width: 90%;
  margin-top: 10px;
    max-width: 100%; /* 添加 max-width 限制 */
    box-sizing: border-box;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
  & > span {
    margin-left: 10px;
  }
`;




const AppTickLine: React.FC = () => {
    const [sid, setSid] = useState('161130');
    const [useDay, setUseDay] = useState('2025-02-07');
    const { ticksData, loading, error } = useFetchTicks(sid, useDay);
    const [chart2Data, setChart2Data] = useState<{ xData: string[], yData: number[] } | null>(null);
    const [IsShowEnterTime, setIsShowEnterTime] = useState<boolean>(false);
    const [customTime, setCustomTime] = useState("");

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                console.log(`handleKeyDown event.key is `, event.key)
                setIsShowEnterTime((prev)=>{return !prev})
                event.preventDefault() // 只有命中要监听的键，才需要去掉传递
                return
            }
        }
        if (ticksData && ticksData.Data) {
            const displayedData = ticksData.Data
            const xData = displayedData.map((item) => item.TickTime);
            const yData = displayedData.map((item) => item.Lots);
            setChart2Data({ xData, yData });
        } else {
            setChart2Data(null);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [ticksData]);


    if (loading) {
        return <div>Loading Data...</div>;
    }

    if (error) {
        return <div>request data failed: {error}</div>;
    }

    const enterIdxTime = (idxTime:string) => {
        if (idxTime.length!=8) {
            console.log(`input value is `, idxTime)
            return
        }
        const useDate = `${useDay} ${idxTime}`
        setCustomTime(useDate)
    }

    return (
        <Container>
            <InputContainer>
                <span>Stock Code:</span>
                <AsuUIs.Input txt={sid} defaultWidth={60} fn={setSid}></AsuUIs.Input>
                <span>Date:</span>
                <AsuUIs.Input txt={useDay} defaultWidth={60} fn={setUseDay}></AsuUIs.Input>
                <span>Stock Info:</span>
                {ticksData && ticksData.SInfo && <span>{ticksData.SInfo.Sid} {ticksData.SInfo.Name} | Tick Count:{ticksData.Data.length}</span>}
                <AsuUIs.Input placeholder='输入跳转时间..' fn={enterIdxTime} isShow={IsShowEnterTime} 
                    reset={true}  autoFocus={true} defaultWidth={20} />

            </InputContainer>
            <MainContent>
                <ChartsContainer>
                    {ticksData && (<> <Chart1 ticks={ticksData.Data} inpTime={customTime} />  </>)}
                    {ticksData && (
                        <Chart2Container>
                            {chart2Data && <Chart2 xData={chart2Data.xData} yData={chart2Data.yData} />}
                        </Chart2Container>
                    )}
                </ChartsContainer>
                <TickInfo stockInfo={ticksData ? ticksData.SInfo : null} />
            </MainContent>
        </Container>
    );
};

export default AppTickLine;