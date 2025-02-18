# TickLine

### Background

Recently, while researching funds, I noticed that existing stock trading apps only provide minute-level data. To observe the changes in market sentiment during large rallies or drops, a more granular structure is needed.

This project visualizes each tick (Level 1 data received every 3 seconds) as a graphical representation.

This is a demo project, using React + ECharts. It displays tick-level price changes.

...
Recently my interest has shifted to US stock options. This project will be on hold for now; I'll update it when I have more time.

### The following two images compare 1-minute level data with tick data:

<img src="pic/DayKline.jpg" alt="Demo1" width="600">

<img src="pic/TickLine.png" alt="Demo2" width="800">

Many details can be seen through the Tick chart.

As shown in the intraday market example, there is a rapid increase at 13:48:15.

At the highest point, only the Ask1 price is high, with Bid1 only at 17 lots. This means that in real trading, a maximum of `17 lots` could be sold at the peak.

# Project Execution

pnpm dev

pnpm run build

pnpm preview --host