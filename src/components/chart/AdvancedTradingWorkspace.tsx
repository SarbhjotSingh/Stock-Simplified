import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  PenTool,
  Maximize2,
  DollarSign,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Ruler,
  Clock,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Asset,
  Candle,
  Position,
  TradeHistoryItem,
  AccountState,
  OrderSide,
  OrderType,
} from '../../types/market';
import {
  calculatePipDifference,
  calculateRequiredMargin,
  calculatePnL,
  calculateFibonacciLevels,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  FibLevel,
} from '../../utils/tradingMath';

interface AdvancedTradingWorkspaceProps {
  assets: Asset[];
  currentAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  account: AccountState;
  positions: Position[];
  tradeHistory: TradeHistoryItem[];
  onExecuteOrder: (order: {
    symbol: string;
    side: OrderSide;
    orderType: OrderType;
    lotSize: number;
    leverage: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => void;
  onClosePosition: (positionId: string) => void;
  onOpenDeepAnalysis: () => void;
  onUnlockBadge: (badgeId: string) => void;
}

type DrawingTool = 'pointer' | 'trendline' | 'fibonacci' | 'horizontal' | 'ruler';

interface DrawingItem {
  id: string;
  type: DrawingTool;
  points: { x: number; y: number; price: number; time?: number }[];
  color: string;
}

export const AdvancedTradingWorkspace: React.FC<AdvancedTradingWorkspaceProps> = ({
  assets,
  currentAsset,
  onSelectAsset,
  account,
  positions,
  tradeHistory,
  onExecuteOrder,
  onClosePosition,
  onOpenDeepAnalysis,
  onUnlockBadge,
}) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1D'>('15m');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentLivePrice, setCurrentLivePrice] = useState(currentAsset.basePrice);
  const [bottomTab, setBottomTab] = useState<'positions' | 'history' | 'metrics'>('positions');

  // Indicators toggle
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showEMA9, setShowEMA9] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);

  // Drawing Tools
  const [activeTool, setActiveTool] = useState<DrawingTool>('pointer');
  const [drawings, setDrawings] = useState<DrawingItem[]>([]);
  const [drawingInProgress, setDrawingInProgress] = useState<DrawingItem | null>(null);

  // Order Execution Panel State
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [lotSize, setLotSize] = useState<number>(currentAsset.type === 'forex' ? 1.0 : 10);
  const [leverage, setLeverage] = useState<number>(currentAsset.type === 'forex' ? 100 : 5);
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  // Asset search dropdown
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');

  // Canvas Refs
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rsiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Crosshair state
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; price: number; candle?: Candle } | null>(null);

  // Fetch or generate initial candles for selected asset & timeframe
  useEffect(() => {
    let isMounted = true;
    async function loadCandles() {
      try {
        const interval = timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : timeframe === '15m' ? 15 : 60;
        const res = await fetch(`/api/market/candles?symbol=${encodeURIComponent(currentAsset.symbol)}&count=90&interval=${interval}`);
        const data = await res.json();
        if (isMounted && data.candles) {
          setCandles(data.candles);
          setCurrentLivePrice(data.candles[data.candles.length - 1].close);
        }
      } catch {
        // Fallback simulated candles
        const generated: Candle[] = [];
        let price = currentAsset.basePrice;
        const now = Math.floor(Date.now() / 1000);
        for (let i = 0; i < 90; i++) {
          const noise = (Math.random() - 0.49) * (currentAsset.pipSize * 6);
          const close = price + noise;
          generated.push({
            time: now - (90 - i) * 60,
            open: price,
            high: Math.max(price, close) + Math.random() * currentAsset.pipSize * 4,
            low: Math.min(price, close) - Math.random() * currentAsset.pipSize * 4,
            close,
            volume: Math.floor(Math.random() * 2000 + 400),
          });
          price = close;
        }
        if (isMounted) {
          setCandles(generated);
          setCurrentLivePrice(price);
        }
      }
    }

    loadCandles();
    return () => {
      isMounted = false;
    };
  }, [currentAsset.symbol, timeframe]);

  // Live Simulated Price Ticks
  useEffect(() => {
    const timer = setInterval(() => {
      const vol = currentAsset.type === 'forex' ? currentAsset.pipSize * 1.5 : currentAsset.basePrice * 0.0004;
      const tick = (Math.random() - 0.495) * vol;
      const decimals = currentAsset.pipSize === 0.0001 ? 5 : 2;

      setCurrentLivePrice((prev) => {
        const nextPrice = Number((prev + tick).toFixed(decimals));
        // Update the last candle
        setCandles((prevCandles) => {
          if (!prevCandles || prevCandles.length === 0) return prevCandles;
          const lastIndex = prevCandles.length - 1;
          const lastCandle = { ...prevCandles[lastIndex] };
          lastCandle.close = nextPrice;
          lastCandle.high = Math.max(lastCandle.high, nextPrice);
          lastCandle.low = Math.min(lastCandle.low, nextPrice);
          return [...prevCandles.slice(0, lastIndex), lastCandle];
        });
        return nextPrice;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [currentAsset]);

  // Main Candlestick Chart Renderer
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Padding
    const rightPadding = 70;
    const bottomPadding = 30;
    const chartWidth = width - rightPadding;
    const chartHeight = height - bottomPadding;

    // Price Bounds
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    const paddingRatio = (maxPrice - minPrice) * 0.08 || 0.001;
    minPrice -= paddingRatio;
    maxPrice += paddingRatio;
    const priceRange = maxPrice - minPrice;

    const getY = (price: number) => {
      return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };

    const getPriceFromY = (y: number) => {
      return maxPrice - (y / chartHeight) * priceRange;
    };

    // Draw Grid Lines & Right Price Scale
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    const gridLinesCount = 6;
    for (let i = 0; i <= gridLinesCount; i++) {
      const y = (chartHeight / gridLinesCount) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price text on right axis
      const priceAtY = getPriceFromY(y);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceAtY.toFixed(currentAsset.pipSize === 0.0001 ? 5 : 2), chartWidth + 6, y + 3);
    }

    // Candle Dimensions
    const candleWidth = Math.max(4, Math.floor((chartWidth / candles.length) * 0.65));
    const stepX = chartWidth / candles.length;

    // Volume histogram at bottom
    let maxVolume = 1;
    candles.forEach((c) => {
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    candles.forEach((c, i) => {
      const x = i * stepX + stepX / 2;
      const isUp = c.close >= c.open;
      const volHeight = (c.volume / maxVolume) * 45;
      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
      ctx.fillRect(x - candleWidth / 2, chartHeight - volHeight, candleWidth, volHeight);
    });

    // Draw Candlesticks (Wicks + Bodies)
    candles.forEach((c, i) => {
      const x = i * stepX + stepX / 2;
      const isUp = c.close >= c.open;
      const color = isUp ? '#10b981' : '#f43f5e';

      const yOpen = getY(c.open);
      const yClose = getY(c.close);
      const yHigh = getY(c.high);
      const yLow = getY(c.low);

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // Technical Indicators Overlays: SMA 20, SMA 50, EMA 9
    const closes = candles.map((c) => c.close);

    if (showSMA20) {
      const sma20 = calculateSMA(closes, 20);
      ctx.strokeStyle = '#38bdf8'; // Sky blue
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      sma20.forEach((val, i) => {
        if (val !== null) {
          const x = i * stepX + stepX / 2;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    if (showSMA50) {
      const sma50 = calculateSMA(closes, 50);
      ctx.strokeStyle = '#f59e0b'; // Amber
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      sma50.forEach((val, i) => {
        if (val !== null) {
          const x = i * stepX + stepX / 2;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    if (showEMA9) {
      const ema9 = calculateEMA(closes, 9);
      ctx.strokeStyle = '#c084fc'; // Purple
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      let started = false;
      ema9.forEach((val, i) => {
        if (val !== null) {
          const x = i * stepX + stepX / 2;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Current Price Ray on Axis
    const currentPriceY = getY(currentLivePrice);
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, currentPriceY);
    ctx.lineTo(chartWidth, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Badge on current price
    ctx.fillStyle = '#10b981';
    ctx.fillRect(chartWidth + 2, currentPriceY - 9, rightPadding - 4, 18);
    ctx.fillStyle = '#020617';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(currentLivePrice.toFixed(currentAsset.pipSize === 0.0001 ? 5 : 2), chartWidth + 6, currentPriceY + 4);

    // Render User Drawings (Trendlines, Fibonacci, Horizontal Rays)
    const renderDrawing = (d: DrawingItem) => {
      ctx.save();
      if (d.type === 'trendline' && d.points.length >= 2) {
        ctx.strokeStyle = d.color || '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(d.points[0].x, d.points[0].y);
        ctx.lineTo(d.points[1].x, d.points[1].y);
        ctx.stroke();

        // Calculate slope and pip change
        const pips = calculatePipDifference(d.points[0].price, d.points[1].price, currentAsset.pipSize);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${pips > 0 ? '+' : ''}${pips} pips`, (d.points[0].x + d.points[1].x) / 2, (d.points[0].y + d.points[1].y) / 2 - 8);
      } else if (d.type === 'horizontal' && d.points.length >= 1) {
        const y = d.points[0].y;
        ctx.strokeStyle = d.color || '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`RAY ${d.points[0].price.toFixed(5)}`, 10, y - 4);
      } else if (d.type === 'fibonacci' && d.points.length >= 2) {
        const highPrice = Math.max(d.points[0].price, d.points[1].price);
        const lowPrice = Math.min(d.points[0].price, d.points[1].price);
        const fibLevels = calculateFibonacciLevels(lowPrice, highPrice);

        fibLevels.forEach((level) => {
          const levelY = getY(level.price);
          ctx.strokeStyle = level.color;
          ctx.lineWidth = level.ratio === 0.618 ? 2 : 1;
          ctx.setLineDash(level.ratio === 0.618 ? [] : [4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, levelY);
          ctx.lineTo(chartWidth, levelY);
          ctx.stroke();

          // Fibonacci Label
          ctx.fillStyle = level.color;
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`Fib ${level.label} : ${level.price.toFixed(5)}`, 10, levelY - 3);
        });
      } else if (d.type === 'ruler' && d.points.length >= 2) {
        // Measure ruler
        const p1 = d.points[0];
        const p2 = d.points[1];
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y));
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y));

        const pips = calculatePipDifference(p1.price, p2.price, currentAsset.pipSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Δ ${pips} Pips`, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      }
      ctx.restore();
    };

    drawings.forEach(renderDrawing);
    if (drawingInProgress) {
      renderDrawing(drawingInProgress);
    }

    // Crosshair rendering
    if (crosshair) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshair.x, 0);
      ctx.lineTo(crosshair.x, chartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crosshair.y);
      ctx.lineTo(chartWidth, crosshair.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price Tag on right axis
      ctx.fillStyle = '#334155';
      ctx.fillRect(chartWidth + 2, crosshair.y - 9, rightPadding - 4, 18);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px monospace';
      ctx.fillText(crosshair.price.toFixed(currentAsset.pipSize === 0.0001 ? 5 : 2), chartWidth + 6, crosshair.y + 4);
    }
  }, [candles, currentLivePrice, showSMA20, showSMA50, showEMA9, drawings, drawingInProgress, crosshair]);

  // RSI Subplot Canvas Renderer
  useEffect(() => {
    if (!showRSI) return;
    const canvas = rsiCanvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const rightPadding = 70;
    const chartWidth = width - rightPadding;

    // RSI Bounds 0 to 100
    const getY = (val: number) => height - (val / 100) * height;

    // 70 and 30 reference lines
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;

    // 70 line
    ctx.beginPath();
    ctx.moveTo(0, getY(70));
    ctx.lineTo(chartWidth, getY(70));
    ctx.stroke();
    ctx.fillStyle = '#f43f5e';
    ctx.font = '9px monospace';
    ctx.fillText('70 OB', chartWidth + 6, getY(70) + 3);

    // 30 line
    ctx.beginPath();
    ctx.moveTo(0, getY(30));
    ctx.lineTo(chartWidth, getY(30));
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.fillText('30 OS', chartWidth + 6, getY(30) + 3);
    ctx.setLineDash([]);

    // Calculate RSI 14
    const closes = candles.map((c) => c.close);
    const rsiValues = calculateRSI(closes, 14);
    const stepX = chartWidth / candles.length;

    // Draw RSI Curve
    ctx.strokeStyle = '#a855f7'; // Purple line
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let started = false;

    rsiValues.forEach((val, i) => {
      if (val !== null) {
        const x = i * stepX + stepX / 2;
        const y = getY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.stroke();

    // Latest RSI Value text
    const lastRsi = rsiValues[rsiValues.length - 1];
    if (lastRsi !== null && lastRsi !== undefined) {
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`RSI 14: ${lastRsi.toFixed(1)}`, 8, 14);
    }
  }, [candles, showRSI]);

  // Handle Canvas Drawing Interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'pointer') return;
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartHeight = canvas.height - 30;
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });
    const padding = (maxPrice - minPrice) * 0.08 || 0.001;
    minPrice -= padding;
    maxPrice += padding;
    const priceAtY = maxPrice - (y / chartHeight) * (maxPrice - minPrice);

    if (activeTool === 'horizontal') {
      // Single click drops ray
      setDrawings((prev) => [
        ...prev,
        {
          id: `draw_${Date.now()}`,
          type: 'horizontal',
          points: [{ x, y, price: priceAtY }],
          color: '#fbbf24',
        },
      ]);
      setActiveTool('pointer');
      return;
    }

    if (!drawingInProgress) {
      // Start multi-point drawing (trendline, fibonacci, ruler)
      setDrawingInProgress({
        id: `draw_${Date.now()}`,
        type: activeTool,
        points: [{ x, y, price: priceAtY }],
        color: activeTool === 'fibonacci' ? '#fb923c' : '#38bdf8',
      });
    } else {
      // Finish multi-point drawing
      const completed: DrawingItem = {
        ...drawingInProgress,
        points: [...drawingInProgress.points, { x, y, price: priceAtY }],
      };
      setDrawings((prev) => [...prev, completed]);
      setDrawingInProgress(null);
      setActiveTool('pointer');
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartHeight = canvas.height - 30;
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });
    const padding = (maxPrice - minPrice) * 0.08 || 0.001;
    minPrice -= padding;
    maxPrice += padding;
    const priceAtY = maxPrice - (y / chartHeight) * (maxPrice - minPrice);

    setCrosshair({ x, y, price: priceAtY });

    // Update drawing preview
    if (drawingInProgress) {
      setDrawingInProgress((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: [prev.points[0], { x, y, price: priceAtY }],
        };
      });
    }
  };

  const handleCanvasMouseLeave = () => {
    setCrosshair(null);
  };

  const clearAllDrawings = () => {
    setDrawings([]);
    setDrawingInProgress(null);
    setActiveTool('pointer');
  };

  // Order Calculations
  const isForex = currentAsset.type === 'forex';
  const contractMultiplier = isForex ? 100000 : 1;
  const nominalValue = lotSize * contractMultiplier * currentLivePrice;
  const requiredMargin = calculateRequiredMargin(currentLivePrice, lotSize, leverage, isForex);
  const pipValue = isForex
    ? Number((currentAsset.pipSize * contractMultiplier * lotSize).toFixed(2))
    : Number((lotSize * 0.01).toFixed(2));

  // Risk/Reward estimation based on SL and TP
  let estimatedRiskDollars: number | null = null;
  let estimatedRewardDollars: number | null = null;
  let riskRewardRatio: string | null = null;

  if (stopLoss && !isNaN(Number(stopLoss))) {
    const slPrice = Number(stopLoss);
    const slPips = Math.abs(calculatePipDifference(currentLivePrice, slPrice, currentAsset.pipSize));
    estimatedRiskDollars = Number((slPips * pipValue).toFixed(2));
  }

  if (takeProfit && !isNaN(Number(takeProfit))) {
    const tpPrice = Number(takeProfit);
    const tpPips = Math.abs(calculatePipDifference(currentLivePrice, tpPrice, currentAsset.pipSize));
    estimatedRewardDollars = Number((tpPips * pipValue).toFixed(2));
  }

  if (estimatedRiskDollars && estimatedRewardDollars && estimatedRiskDollars > 0) {
    riskRewardRatio = `1 : ${(estimatedRewardDollars / estimatedRiskDollars).toFixed(1)}`;
  }

  // Handle Order Submit
  const handleOrderSubmit = () => {
    if (requiredMargin > account.freeMargin) {
      setOrderMessage('Insufficient Free Margin. Lower your lot size or reduce leverage.');
      return;
    }

    onExecuteOrder({
      symbol: currentAsset.symbol,
      side: orderSide,
      orderType,
      lotSize,
      leverage,
      stopLoss: stopLoss ? Number(stopLoss) : undefined,
      takeProfit: takeProfit ? Number(takeProfit) : undefined,
    });

    onUnlockBadge('first_trade');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });

    setOrderMessage(`Executed ${orderSide} ${lotSize} on ${currentAsset.symbol} @ ${currentLivePrice}!`);
    setTimeout(() => setOrderMessage(null), 4000);
  };

  // Filtered Assets for dropdown
  const filteredAssets = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(assetSearchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="w-full flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)]">
      {/* Top Chart Toolbar (TradingView clone style) */}
      <div className="h-13 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Symbol Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAssetDropdown(!showAssetDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 transition-all text-xs font-bold text-white cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{currentAsset.symbol}</span>
              <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">{currentAsset.type}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showAssetDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Forex or Stocks..."
                    value={assetSearchQuery}
                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        onSelectAsset(asset);
                        setShowAssetDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                        asset.symbol === currentAsset.symbol
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-bold">{asset.symbol}</div>
                        <div className="text-[10px] text-slate-400 truncate">{asset.name}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                        {asset.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeframe selector buttons */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-bold">
            {(['1m', '5m', '15m', '1h', '4h', '1D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  timeframe === tf ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => setShowIndicatorsMenu(!showIndicatorsMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Indicators</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showIndicatorsMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                <label className="flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-800 cursor-pointer">
                  <span>SMA 20 (Sky)</span>
                  <input
                    type="checkbox"
                    checked={showSMA20}
                    onChange={(e) => setShowSMA20(e.target.checked)}
                    className="accent-cyan-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-800 cursor-pointer">
                  <span>SMA 50 (Amber)</span>
                  <input
                    type="checkbox"
                    checked={showSMA50}
                    onChange={(e) => setShowSMA50(e.target.checked)}
                    className="accent-amber-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-800 cursor-pointer">
                  <span>EMA 9 (Purple)</span>
                  <input
                    type="checkbox"
                    checked={showEMA9}
                    onChange={(e) => setShowEMA9(e.target.checked)}
                    className="accent-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-800 cursor-pointer">
                  <span>RSI 14 Subplot</span>
                  <input
                    type="checkbox"
                    checked={showRSI}
                    onChange={(e) => setShowRSI(e.target.checked)}
                    className="accent-purple-500"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Header: AI Market Reasoning & Live Quote */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">LIVE QUOTE</span>
            <span className="font-mono font-extrabold text-sm text-emerald-400">
              {currentLivePrice.toFixed(currentAsset.pipSize === 0.0001 ? 5 : 2)}
            </span>
          </div>

          <button
            onClick={() => {
              onOpenDeepAnalysis();
              onUnlockBadge('deep_analyst');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Ask Gemini 4 Quant</span>
          </button>
        </div>
      </div>

      {/* Main Trading Cockpit: Left Drawing Toolbar + Center Chart + Right Order Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Drawing Tools Bar */}
        <div className="w-12 bg-slate-900 border-r border-slate-800 p-1.5 flex flex-col items-center justify-between">
          <div className="flex flex-col items-center gap-2 w-full">
            <button
              onClick={() => setActiveTool('pointer')}
              title="Crosshair / Pointer"
              className={`p-2 rounded-xl w-full flex items-center justify-center transition-colors ${
                activeTool === 'pointer' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('trendline')}
              title="Draw Trendline (Click 2 points)"
              className={`p-2 rounded-xl w-full flex items-center justify-center transition-colors ${
                activeTool === 'trendline' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTool('fibonacci')}
              title="Fibonacci Retracement (Click High & Low)"
              className={`p-2 rounded-xl w-full flex items-center justify-center transition-colors ${
                activeTool === 'fibonacci' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-mono font-extrabold">0.618</span>
            </button>

            <button
              onClick={() => setActiveTool('horizontal')}
              title="Horizontal Support / Resistance Ray (Click to place)"
              className={`p-2 rounded-xl w-full flex items-center justify-center transition-colors ${
                activeTool === 'horizontal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xs font-mono font-extrabold">—</span>
            </button>

            <button
              onClick={() => setActiveTool('ruler')}
              title="Pip Measure Ruler"
              className={`p-2 rounded-xl w-full flex items-center justify-center transition-colors ${
                activeTool === 'ruler' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Ruler className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={clearAllDrawings}
            title="Clear All Drawings"
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Candlestick Chart & RSI Subplot */}
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
          {/* Active Drawing Tool Toast */}
          {activeTool !== 'pointer' && (
            <div className="absolute top-2 left-3 z-20 px-3 py-1 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Drawing Active: {activeTool.toUpperCase()}. Click chart to set points.</span>
              <button
                onClick={() => setActiveTool('pointer')}
                className="text-slate-400 hover:text-white text-[11px] underline ml-1"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Main Candlestick Canvas */}
          <div className="flex-1 relative">
            <canvas
              ref={chartCanvasRef}
              width={900}
              height={420}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              className="w-full h-full cursor-crosshair"
            />
          </div>

          {/* RSI Subplot Canvas */}
          {showRSI && (
            <div className="h-28 border-t border-slate-800/80 bg-slate-950/90 relative">
              <canvas
                ref={rsiCanvasRef}
                width={900}
                height={112}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Right: Paper Trading Buy/Sell Order Panel */}
        <div className="w-72 sm:w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-sm text-white">Paper Trading Panel</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SIMULATED
              </span>
            </div>

            {/* Order Type Selector: Market / Limit */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType('MARKET')}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === 'MARKET' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Market Order
              </button>
              <button
                type="button"
                onClick={() => setOrderType('LIMIT')}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === 'LIMIT' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Limit Order
              </button>
            </div>

            {/* Large BUY / SELL Execution Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setOrderSide('BUY')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  orderSide === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  BUY / LONG
                </div>
                <div className="font-mono text-sm mt-1">
                  {(currentLivePrice + currentAsset.pipSize * 0.8).toFixed(currentAsset.pipSize === 0.0001 ? 5 : 2)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderSide('SELL')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  orderSide === 'SELL'
                    ? 'bg-rose-500 text-white border-rose-400 font-extrabold shadow-lg shadow-rose-500/20'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-950/40'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  SELL / SHORT
                </div>
                <div className="font-mono text-sm mt-1">
                  {currentLivePrice.toFixed(currentAsset.pipSize === 0.0001 ? 5 : 2)}
                </div>
              </button>
            </div>

            {/* Inputs: Lot Size & Leverage */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  {isForex ? 'Position Size (Lots)' : 'Shares Quantity'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={isForex ? '0.01' : '1'}
                    min={isForex ? '0.01' : '1'}
                    value={lotSize}
                    onChange={(e) => setLotSize(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex gap-1">
                    {isForex ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setLotSize(0.1)}
                          className="px-2 py-2 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white"
                        >
                          0.1
                        </button>
                        <button
                          type="button"
                          onClick={() => setLotSize(1.0)}
                          className="px-2 py-2 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white"
                        >
                          1.0
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLotSize(50)}
                        className="px-2 py-2 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white"
                      >
                        50
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Leverage
                </label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                >
                  {isForex ? (
                    <>
                      <option value={10}>1:10 (Conservative)</option>
                      <option value={50}>1:50 (Standard)</option>
                      <option value={100}>1:100 (Recommended)</option>
                      <option value={200}>1:200 (Aggressive)</option>
                      <option value={500}>1:500 (High Risk)</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>1:1 (Cash / No Leverage)</option>
                      <option value={2}>1:2 (Intraday)</option>
                      <option value={5}>1:5 (Margin Max)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Risk Management: SL & TP */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-rose-400 uppercase mb-1">
                    Stop Loss (Price)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 1.0820"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                  {estimatedRiskDollars !== null && (
                    <span className="text-[10px] text-rose-400 font-mono mt-0.5 block">
                      -${estimatedRiskDollars}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-emerald-400 uppercase mb-1">
                    Take Profit (Price)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 1.0950"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  {estimatedRewardDollars !== null && (
                    <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
                      +${estimatedRewardDollars}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Calculations Summary Card */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Contract Value:</span>
                <span className="font-mono text-slate-200">
                  ${nominalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Margin Required:</span>
                <span className="font-mono font-bold text-amber-400">
                  ${requiredMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pip Value:</span>
                <span className="font-mono text-emerald-400">~${pipValue} / pip</span>
              </div>
              {riskRewardRatio && (
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Risk : Reward:</span>
                  <span className="font-mono font-bold text-purple-400">{riskRewardRatio}</span>
                </div>
              )}
            </div>

            {/* Order Feedback Toast */}
            {orderMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center mb-3 font-semibold">
                {orderMessage}
              </div>
            )}
          </div>

          {/* Execute Button */}
          <button
            type="button"
            onClick={handleOrderSubmit}
            className={`w-full py-3 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer ${
              orderSide === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
            }`}
          >
            Execute {orderSide} {lotSize} {currentAsset.symbol}
          </button>
        </div>
      </div>

      {/* Bottom Panel: Open Positions, Trade History & Account Metrics */}
      <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col">
        {/* Tab Headers */}
        <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBottomTab('positions')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                bottomTab === 'positions' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Open Positions ({positions.length})
            </button>
            <button
              onClick={() => setBottomTab('history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                bottomTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trade History ({tradeHistory.length})
            </button>
            <button
              onClick={() => setBottomTab('metrics')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                bottomTab === 'metrics' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Health
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500">Equity: </span>
              <span className="text-emerald-400 font-bold">
                ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Margin Level: </span>
              <span className="text-cyan-400 font-bold">{account.marginLevel.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-3">
          {bottomTab === 'positions' && (
            positions.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No active open positions. Execute a Buy or Sell simulated trade above.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">Symbol</th>
                    <th className="pb-2">Side</th>
                    <th className="pb-2">Lots</th>
                    <th className="pb-2">Entry Price</th>
                    <th className="pb-2">Current</th>
                    <th className="pb-2">Margin</th>
                    <th className="pb-2">Unrealized P&L</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {positions.map((pos) => {
                    const isProfit = pos.unrealizedPnL >= 0;
                    return (
                      <tr key={pos.id} className="hover:bg-slate-800/30">
                        <td className="py-2 font-bold text-white">{pos.symbol}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pos.side === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {pos.side}
                          </span>
                        </td>
                        <td className="py-2 text-slate-300">{pos.lotSize}</td>
                        <td className="py-2 text-slate-300">{pos.entryPrice.toFixed(5)}</td>
                        <td className="py-2 text-white font-bold">{pos.currentPrice.toFixed(5)}</td>
                        <td className="py-2 text-slate-400">${pos.marginUsed.toFixed(2)}</td>
                        <td className={`py-2 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfit ? '+' : ''}${pos.unrealizedPnL.toFixed(2)}
                        </td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => onClosePosition(pos.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 text-[11px] transition-colors"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          )}

          {bottomTab === 'history' && (
            tradeHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No closed trades yet. Close an active position to view realized P&L history.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">Symbol</th>
                    <th className="pb-2">Side</th>
                    <th className="pb-2">Lots</th>
                    <th className="pb-2">Entry</th>
                    <th className="pb-2">Exit</th>
                    <th className="pb-2">Realized P&L</th>
                    <th className="pb-2 text-right">Closed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {tradeHistory.map((trade) => {
                    const isWin = trade.realizedPnL >= 0;
                    return (
                      <tr key={trade.id} className="hover:bg-slate-800/30">
                        <td className="py-2 font-bold text-white">{trade.symbol}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              trade.side === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {trade.side}
                          </span>
                        </td>
                        <td className="py-2 text-slate-300">{trade.lotSize}</td>
                        <td className="py-2 text-slate-300">{trade.entryPrice.toFixed(5)}</td>
                        <td className="py-2 text-slate-300">{trade.exitPrice.toFixed(5)}</td>
                        <td className={`py-2 font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isWin ? '+' : ''}${trade.realizedPnL.toFixed(2)}
                        </td>
                        <td className="py-2 text-right text-slate-500">
                          {new Date(trade.closeTime).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          )}

          {bottomTab === 'metrics' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full items-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Virtual Balance</span>
                <span className="font-mono text-base font-extrabold text-white">
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Live Equity</span>
                <span className="font-mono text-base font-extrabold text-emerald-400">
                  ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Used Margin</span>
                <span className="font-mono text-base font-extrabold text-amber-400">
                  ${account.usedMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Free Margin</span>
                <span className="font-mono text-base font-extrabold text-cyan-400">
                  ${account.freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
