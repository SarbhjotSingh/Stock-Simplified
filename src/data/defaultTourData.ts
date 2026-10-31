import { TourStepItem } from '../types/admin';

export const DEFAULT_TOUR_STEPS: TourStepItem[] = [
  {
    id: 1,
    title: 'The Bare Candlestick Chart',
    voiceScript:
      'Welcome to Stock Simplified. Here you see a bare candlestick chart of EUR/USD. Green candles indicate buyers driving prices up, while red candles show sellers in control. Each candle records the Open, High, Low, and Close price.',
    voiceScripts: {
      en: 'Welcome to Stock Simplified. Here you see a bare candlestick chart of EUR/USD. Green candles indicate buyers driving prices up, while red candles show sellers in control. Each candle records the Open, High, Low, and Close price.',
      hi: 'स्टॉक सिम्पलीफाइड में आपका स्वागत है। यहाँ आप EUR/USD का मूल कैंडलस्टिक चार्ट देख रहे हैं। हरी कैंडल्स खरीदारों की मजबूती दिखाती हैं, जबकि लाल कैंडल्स विक्रेताओं का नियंत्रण दर्शाती हैं। प्रत्येक कैंडल ओपन, हाई, लो और क्लोज मूल्य रिकॉर्ड करती है।',
      pa: 'ਸਟਾਕ ਸਿੰਪਲੀਫਾਈਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਇੱਥੇ ਤੁਸੀਂ EUR/USD ਦਾ ਮੁੱਢਲਾ ਕੈਂਡਲਸਟਿਕ ਚਾਰਟ ਵੇਖ ਰਹੇ ਹੋ। ਹਰੀਆਂ ਕੈਂਡਲਾਂ ਖਰੀਦਦਾਰਾਂ ਦੀ ਤੇਜ਼ੀ ਦਰਸਾਉਂਦੀਆਂ ਹਨ, ਜਦੋਂ ਕਿ ਲਾਲ ਕੈਂਡਲਾਂ ਵੇਚਣ ਵਾਲਿਆਂ ਦਾ ਦਬਾਅ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।',
    },
    reveals: 'bare',
    targetLabel: 'Pure Price Action & Candlesticks',
  },
  {
    id: 2,
    title: 'Technical Indicators Toolbar',
    voiceScript:
      'Now, observe the top toolbar fading into view. These are Technical Indicators: Moving Averages, the Relative Strength Index (RSI), and MACD. They mathematically filter market noise and highlight emerging momentum.',
    voiceScripts: {
      en: 'Now, observe the top toolbar fading into view. These are Technical Indicators: Moving Averages, the Relative Strength Index (RSI), and MACD. They mathematically filter market noise and highlight emerging momentum.',
      hi: 'अब, ऊपर के टूलबार को ध्यान से देखें। ये तकनीकी संकेतक हैं: मूविंग एवरेजेज, रिलेटिव स्ट्रेंथ इंडेक्स (RSI), और MACD। ये बाजार के शोर को छानकर नई दिशा और मोमेंटम को दर्शाते हैं।',
      pa: 'ਹੁਣ, ਉੱਪਰਲੇ ਟੂਲਬਾਰ ਨੂੰ ਵੇਖੋ। ਇਹ ਤਕਨੀਕੀ ਸੂਚਕ ਹਨ: ਮੂਵਿੰਗ ਐਵਰੇਜ, RSI, ਅਤੇ MACD। ਇਹ ਮਾਰਕੀਟ ਰੌਲੇ ਨੂੰ ਫਿਲਟਰ ਕਰਕੇ ਅਸਲ ਰਫ਼ਤਾਰ ਦਿਖਾਉਂਦੇ ਹਨ।',
    },
    reveals: 'indicators',
    targetLabel: 'Moving Averages & Oscillators Toolbar',
  },
  {
    id: 3,
    title: 'Drawing & Fibonacci Tools',
    voiceScript:
      'On the left, the Drawing Tools panel is now emerging. Professional Forex traders use Trendlines, Support and Resistance rays, and Fibonacci retracement ratios to pinpoint institutional entry zones.',
    voiceScripts: {
      en: 'On the left, the Drawing Tools panel is now emerging. Professional Forex traders use Trendlines, Support and Resistance rays, and Fibonacci retracement ratios to pinpoint institutional entry zones.',
      hi: 'बाईं ओर ड्राइंग टूल्स पैनल सक्रिय हो रहा है। पेशेवर फॉरेक्स ट्रेडर्स संस्थागत एंट्री जोन की पहचान के लिए ट्रेंडलाइन्स, सपोर्ट और रेजिस्टेंस, और फिबोनाची अनुपात का उपयोग करते हैं।',
      pa: 'ਖੱਬੇ ਪਾਸੇ ਡਰਾਇੰਗ ਟੂਲਜ਼ ਪੈਨਲ ਸਾਹਮਣੇ ਆ ਰਿਹਾ ਹੈ। ਪੇਸ਼ੇਵਰ ਫੋਰੈਕਸ ਟਰੇਡਰ ਟ੍ਰੈਂਡਲਾਈਨਾਂ, ਸਪੋਰਟ-ਰਜਿਸਟੈਂਸ ਅਤੇ ਫਿਬੋਨਾਚੀ ਰੀਟ੍ਰੇਸਮੈਂਟ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਨ।',
    },
    reveals: 'drawing',
    targetLabel: 'Left Drawing Toolbar & Fibonacci',
  },
  {
    id: 4,
    title: 'Paper Trading & Virtual Wallet',
    voiceScript:
      'On the right, your Paper Trading execution panel is now active. You have been funded with one hundred thousand dollars in risk-free virtual money. You can place Buy and Sell orders with realistic margin and leverage.',
    voiceScripts: {
      en: 'On the right, your Paper Trading execution panel is now active. You have been funded with one hundred thousand dollars in risk-free virtual money. You can place Buy and Sell orders with realistic margin and leverage.',
      hi: 'दाईं ओर आपका पेपर ट्रेडिंग ऑर्डर पैनल सक्रिय है। आपको $100,000 की जोखिम-मुक्त वर्चुअल पूंजी दी गई है। आप वास्तविक मार्जिन और लीवरेज के साथ बाय और सेल ऑर्डर्स निष्पादित कर सकते हैं।',
      pa: 'ਸੱਜੇ ਪਾਸੇ ਤੁਹਾਡਾ ਪੇਪਰ ਟਰੇਡਿੰਗ ਪੈਨਲ ਐਕਟਿਵ ਹੋ ਗਿਆ ਹੈ। ਤੁਹਾਨੂੰ $100,000 ਦਾ ਜੋਖਮ-ਮੁਕਤ ਵਰਚੁਅਲ ਫੰਡ ਮਿਲਿਆ ਹੈ, ਜਿਸ ਨਾਲ ਤੁਸੀਂ ਅਸਲ ਮਾਰਜਿਨ \'ਤੇ ਟ੍ਰੇਡਿੰਗ ਕਰ ਸਕਦੇ ਹੋ।',
    },
    reveals: 'orders',
    targetLabel: 'Live Order Execution Panel ($100k Balance)',
  },
  {
    id: 5,
    title: 'Global Sessions & Economic Calendar',
    voiceScript:
      'Finally, look below the chart as the Global Session Clock and Live Economic Calendar fade into view. Currencies move with the sun—from Sydney and Tokyo to London and New York.',
    voiceScripts: {
      en: 'Finally, look below the chart as the Global Session Clock and Live Economic Calendar fade into view. Currencies move with the sun—from Sydney and Tokyo to London and New York.',
      hi: 'अंत में, चार्ट के नीचे ग्लोबल सेशन क्लॉक और लाइव आर्थिक कैलेंडर देखें। मुद्राएं सूर्य के साथ घूमती हैं—सिडनी और टोक्यो से लेकर लंदन और न्यूयॉर्क सत्रों तक।',
      pa: 'ਅਖੀਰ ਵਿੱਚ, ਚਾਰਟ ਦੇ ਹੇਠਾਂ ਗਲੋਬਲ ਸੈਸ਼ਨ ਘੜੀ ਅਤੇ ਲਾਈਵ ਆਰਥਿਕ ਕੈਲੰਡਰ ਵੇਖੋ। ਕਰੰਸੀਆਂ ਦੁਨੀਆ ਭਰ ਦੇ ਸਮੇਂ ਨਾਲ ਘੁੰਮਦੀਆਂ ਹਨ—ਸਿਡਨੀ, ਟੋਕਿਓ, ਲੰਡਨ ਅਤੇ ਨਿਊਯਾਰਕ।',
    },
    reveals: 'calendar',
    targetLabel: 'London/NY Session Overlap & High-Impact Events',
  },
  {
    id: 6,
    title: 'Full Platform Unlocked',
    voiceScript:
      'Congratulations! You have completed your guided orientation. Your entire charting cockpit is now fully unlocked. Feel free to explore the educational hub or test simulated trades!',
    voiceScripts: {
      en: 'Congratulations! You have completed your guided orientation. Your entire charting cockpit is now fully unlocked. Feel free to explore the educational hub or test simulated trades!',
      hi: 'बधाई हो! आपने अपना गाइडेड ओरिएंटेशन पूरा कर लिया है। आपका पूरा ट्रेडिंग कॉकपिट अब अनलॉक हो चुका है। शैक्षिक हब का अन्वेषण करें या पेपर ट्रेड करें!',
      pa: 'ਮੁਬਾਰਕਾਂ! ਤੁਸੀਂ ਆਪਣਾ ਗਾਈਡਿਡ ਟੂਰ ਪੂਰਾ ਕਰ ਲਿਆ ਹੈ। ਤੁਹਾਡਾ ਪੂਰਾ ਚਾਰਟਿੰਗ ਸਿਸਟਮ ਹੁਣ ਅਨਲੌਕ ਹੈ। ਸਿੱਖਿਆ ਹੱਬ ਵੇਖੋ ਜਾਂ ਵਰਚੁਅਲ ਟਰੇਡ ਲਗਾਓ!',
    },
    reveals: 'complete',
    targetLabel: 'Interactive Tour Completed!',
    badgeUnlock: 'tour_graduate',
  },
];
