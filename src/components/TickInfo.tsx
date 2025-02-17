import React from 'react';
import styled from 'styled-components';
import { OneTick, StockInfo } from '../types/tick';
import { useAtom } from 'jotai';
import { SelectTickAtom } from '../store/atoms';

const InfoContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 15%;
  background-color: #fff;
  overflow-y: auto;
  z-index: 1;
  box-sizing: border-box;
  min-width: 100px;

  & > div {
    font-size: 12px;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 5px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
`;

const LotsSpan = styled.span`
  text-align: right;
`;

const DashedLine = styled.div`
  border-bottom: 1px dashed #ccc;
  margin: 5px 0;
`;

const TotalLots = styled.div`
    text-align: center;
    font-size: 12px;
    margin: 5px 0;
`;

const TickTime = styled.div`
    text-align: center;
    font-size: 12px;
    margin-bottom: 5px;
`;


interface TickInfoProps {
  stockInfo?: StockInfo | null;
}

const TickInfo: React.FC<TickInfoProps> = ({ stockInfo }) => {
  const [hoveredOneTick] = useAtom(SelectTickAtom);

  const renderBidAskInfo = () => {
    if (!hoveredOneTick) return null;

    const asks = hoveredOneTick.tick.AskPvs.slice();
    const askLots = hoveredOneTick.tick.AskLots;
    const bids = hoveredOneTick.tick.BidPvs;
    const bidLots = hoveredOneTick.tick.BidLots;
    const totalLots = hoveredOneTick.tick.Lots;
    const tickTime = hoveredOneTick.tick.TickTime;

    const askItems = asks.map((ask, index) => (
      <InfoItem key={`ask-${index}`}>
        <span>Ask{index + 1}: {ask?.toFixed(3)}</span>
        <LotsSpan>{askLots[index]}</LotsSpan>
      </InfoItem>
    ));


    const bidItems = bids.map((bid, index) => (
      <InfoItem key={`bid-${index}`}>
        <span>Bid{index + 1}: {bid?.toFixed(3)}</span>
        <LotsSpan>{bidLots[index]}</LotsSpan>
      </InfoItem>
    ));

    const formattedTime = tickTime ? tickTime.split(' ')[1]?.substring(0,8) : ""

    return (
      <div>
        <TickTime>{formattedTime}</TickTime>
        {askItems.reverse()}
        <DashedLine />
          <TotalLots>Lots:{totalLots}</TotalLots>
        <DashedLine />
        {bidItems}
      </div>
    );
  };

  return (
    <InfoContainer>
      {renderBidAskInfo()}
    </InfoContainer>
  );
};

export default TickInfo;