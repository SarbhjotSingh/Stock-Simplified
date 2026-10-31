export type Language = 'en' | 'hi' | 'pa';

export interface Translations {
  appName: string;
  appSubtitle: string;
  beginnerPathway: string;
  advancedCharting: string;
  virtualBalance: string;
  resetBalance: string;
  aiQuant: string;
  voiceMentor: string;
  economicCalendar: string;
  adminPanel: string;
  login: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  optionATitle: string;
  optionASubtitle: string;
  optionBTitle: string;
  optionBSubtitle: string;
  startBeginner: string;
  launchAdvanced: string;
  pollTitle: string;
  pollSubtitle: string;
  whichMarket: string;
  forexMarket: string;
  indianMarket: string;
  howDidYouHear: string;
  subscriptionTitle: string;
  subscriptionSubtitle: string;
  payWithUPI: string;
  payWithCard: string;
  payWithNetBanking: string;
  completePayment: string;
  paymentSuccess: string;
  openPositions: string;
  tradeHistory: string;
  accountHealth: string;
  buyLong: string;
  sellShort: string;
  executeOrder: string;
  lotSize: string;
  leverage: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'Stock Simplified',
    appSubtitle: 'Forex Education & Real-Time Paper Trading',
    beginnerPathway: 'Beginner Pathway',
    advancedCharting: 'Advanced Charting',
    virtualBalance: 'Virtual Balance',
    resetBalance: 'Reset balance to $100,000',
    aiQuant: 'AI Quant',
    voiceMentor: 'Voice Mentor',
    economicCalendar: 'Live Economic Calendar',
    adminPanel: 'Admin CMS',
    login: 'Login',
    welcomeTitle: 'Choose Your Trading Pathway',
    welcomeSubtitle: 'Tailor your experience to your current level. You can toggle between both pathways anytime.',
    optionATitle: 'Option A: Complete Beginner',
    optionASubtitle: 'Learn & Explore (Forex Focus)',
    optionBTitle: 'Option B: Analyze Charts',
    optionBSubtitle: 'Advanced TradingView Interface',
    startBeginner: 'Start Beginner Pathway',
    launchAdvanced: 'Launch Advanced Charts',
    pollTitle: 'Tell Us About Your Goals',
    pollSubtitle: 'We will customize your interactive charting and educational track accordingly.',
    whichMarket: '1. Which market do you want to learn?',
    forexMarket: 'Forex Market (24/5 Currencies)',
    indianMarket: 'Indian Stock Market (NSE / BSE)',
    howDidYouHear: '2. How did you hear about us?',
    subscriptionTitle: 'Select Your Learning Membership',
    subscriptionSubtitle: 'Unlock interactive voice tours, audio masterclasses, and unlimited paper trading.',
    payWithUPI: 'UPI (GPay / PhonePe / Paytm)',
    payWithCard: 'Credit / Debit Card',
    payWithNetBanking: 'Net Banking (All Major Banks)',
    completePayment: 'Pay & Unlock Masterclass',
    paymentSuccess: 'Payment Successful! Welcome to Stock Simplified Pro',
    openPositions: 'Open Positions',
    tradeHistory: 'Trade History',
    accountHealth: 'Account Health',
    buyLong: 'BUY / LONG',
    sellShort: 'SELL / SHORT',
    executeOrder: 'Execute Order',
    lotSize: 'Position Size (Lots)',
    leverage: 'Leverage',
  },
  hi: {
    appName: 'स्टॉक सिम्पलीफाइड',
    appSubtitle: 'फॉरेक्स शिक्षा एवं रियल-टाइम पेपर ट्रेडिंग',
    beginnerPathway: 'शुरुआती मार्ग (Beginner)',
    advancedCharting: 'उन्नत चार्टिंग (Advanced)',
    virtualBalance: 'वर्चुअल बैलेंस',
    resetBalance: 'बैलेंस ₹1,00,000 रीसेट करें',
    aiQuant: 'AI क्वांट',
    voiceMentor: 'वॉइस मेंटर',
    economicCalendar: 'आर्थिक कैलेंडर',
    adminPanel: 'एडमिन पैनल',
    login: 'लॉग इन',
    welcomeTitle: 'अपना ट्रेडिंग मार्ग चुनें',
    welcomeSubtitle: 'अपने अनुभव स्तर के अनुसार चुनें। आप कभी भी दोनों के बीच स्विच कर सकते हैं।',
    optionATitle: 'विकल्प A: पूर्ण शुरुआती',
    optionASubtitle: 'सीखें और समझें (फॉरेक्स फोकस)',
    optionBTitle: 'विकल्प B: चार्ट विश्लेषण',
    optionBSubtitle: 'ट्रेडिंगव्यू उन्नत इंटरफ़ेस',
    startBeginner: 'शुरुआती मार्ग शुरू करें',
    launchAdvanced: 'चार्ट खोलें',
    pollTitle: 'अपने लक्ष्यों के बारे में बताएं',
    pollSubtitle: 'हम आपकी प्राथमिकताओं के अनुसार चार्टिंग और शिक्षा ट्रैक सेट करेंगे।',
    whichMarket: '1. आप कौन सा बाजार सीखना चाहते हैं?',
    forexMarket: 'फॉरेक्स मार्केट (24/5 मुद्राएं)',
    indianMarket: 'भारतीय शेयर बाजार (NSE / BSE)',
    howDidYouHear: '2. आपने हमारे बारे में कैसे सुना?',
    subscriptionTitle: 'अपनी लर्निंग सदस्यता चुनें',
    subscriptionSubtitle: 'वॉइस टूर्स, ऑडियो पॉडकास्ट और असीमित पेपर ट्रेडिंग अनलॉक करें।',
    payWithUPI: 'UPI (Google Pay / PhonePe / Paytm)',
    payWithCard: 'क्रेडिट / डेबिट कार्ड',
    payWithNetBanking: 'नेट बैंकिंग',
    completePayment: 'भुगतान करें और अनलॉक करें',
    paymentSuccess: 'भुगतान सफल! स्टॉक सिम्पलीफाइड प्रो में आपका स्वागत है',
    openPositions: 'सक्रिय पोजीशन',
    tradeHistory: 'ट्रेड इतिहास',
    accountHealth: 'खाता स्वास्थ्य',
    buyLong: 'खरीदें (BUY)',
    sellShort: 'बेचें (SELL)',
    executeOrder: 'ऑर्डर निष्पादित करें',
    lotSize: 'लॉट साइज',
    leverage: 'लीवरेज',
  },
  pa: {
    appName: 'ਸਟਾਕ ਸਿੰਪਲੀਫਾਈਡ',
    appSubtitle: 'ਫੋਰੈਕਸ ਸਿੱਖਿਆ ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਪੇਪਰ ਟਰੇਡਿੰਗ',
    beginnerPathway: 'ਸ਼ੁਰੂਆਤੀ ਰਾਹ (Beginner)',
    advancedCharting: 'ਉੱਨਤ ਚਾਰਟਿੰਗ (Advanced)',
    virtualBalance: 'ਵਰਚੁਅਲ ਬੈਲੇਂਸ',
    resetBalance: 'ਬੈਲੇਂਸ $100,000 ਰੀਸੈਟ ਕਰੋ',
    aiQuant: 'AI ਕੁਆਂਟ',
    voiceMentor: 'ਵਾਇਸ ਮੈਂਟਰ',
    economicCalendar: 'ਆਰਥਿਕ ਕੈਲੰਡਰ',
    adminPanel: 'ਐਡਮਿਨ ਪੈਨਲ',
    login: 'ਲਾਗ ਇਨ',
    welcomeTitle: 'ਆਪਣਾ ਟਰੇਡਿੰਗ ਰਾਹ ਚੁਣੋ',
    welcomeSubtitle: 'ਆਪਣੇ ਅਨੁਭਵ ਦੇ ਹਿਸਾਬ ਨਾਲ ਚੁਣੋ। ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਵੇਲੇ ਦੋਵਾਂ ਵਿਚਕਾਰ ਬਦਲ ਸਕਦੇ ਹੋ।',
    optionATitle: 'ਵਿਕਲਪ A: ਬਿਲਕੁਲ ਸ਼ੁਰੂਆਤੀ',
    optionASubtitle: 'ਸਿੱਖੋ ਅਤੇ ਐਕਸਪਲੋਰ ਕਰੋ (ਫੋਰੈਕਸ ਫੋਕਸ)',
    optionBTitle: 'ਵਿਕਲਪ B: ਚਾਰਟ ਵਿਸ਼ਲੇਸ਼ਣ',
    optionBSubtitle: 'ਐਡਵਾਂਸਡ ਟਰੇਡਿੰਗਵਿਊ ਇੰਟਰਫੇਸ',
    startBeginner: 'ਸ਼ੁਰੂਆਤੀ ਰਾਹ ਸ਼ੁਰੂ ਕਰੋ',
    launchAdvanced: 'ਐਡਵਾਂਸਡ ਚਾਰਟ ਖੋਲ੍ਹੋ',
    pollTitle: 'ਆਪਣੇ ਟੀਚਿਆਂ ਬਾਰੇ ਦੱਸੋ',
    pollSubtitle: 'ਅਸੀਂ ਤੁਹਾਡੇ ਮੁਤਾਬਕ ਚਾਰਟਿੰਗ ਅਤੇ ਸਿੱਖਿਆ ਟਰੈਕ ਤਿਆਰ ਕਰਾਂਗੇ।',
    whichMarket: '1. ਤੁਸੀਂ ਕਿਹੜਾ ਬਾਜ਼ਾਰ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
    forexMarket: 'ਫੋਰੈਕਸ ਮਾਰਕੀਟ (24/5 ਕਰੰਸੀਆਂ)',
    indianMarket: 'ਭਾਰਤੀ ਸ਼ੇਅਰ ਬਾਜ਼ਾਰ (NSE / BSE)',
    howDidYouHear: '2. ਤੁਸੀਂ ਸਾਡੇ ਬਾਰੇ ਕਿਵੇਂ ਸੁਣਿਆ?',
    subscriptionTitle: 'ਆਪਣੀ ਲਰਨਿੰਗ ਮੈਂਬਰਸ਼ਿਪ ਚੁਣੋ',
    subscriptionSubtitle: 'ਵਾਇਸ ਟੂਰ, ਆਡੀਓ ਪੋਡਕਾਸਟ ਅਤੇ ਅਸੀਮਿਤ ਪੇਪਰ ਟਰੇਡਿੰਗ ਅਨਲੌਕ ਕਰੋ।',
    payWithUPI: 'UPI (GPay / PhonePe / Paytm)',
    payWithCard: 'ਕ੍ਰੈਡਿਟ / ਡੈਬਿਟ ਕਾਰਡ',
    payWithNetBanking: 'ਨੈੱਟ ਬੈਂਕਿੰਗ',
    completePayment: 'ਭੁਗਤਾਨ ਕਰੋ ਅਤੇ ਅਨਲੌਕ ਕਰੋ',
    paymentSuccess: 'ਭੁਗਤਾਨ ਸਫਲ ਰਿਹਾ! ਸਟਾਕ ਸਿੰਪਲੀਫਾਈਡ ਪ੍ਰੋ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    openPositions: 'ਖੁੱਲ੍ਹੀਆਂ ਪੁਜ਼ੀਸ਼ਨਾਂ',
    tradeHistory: 'ਟਰੇਡ ਹਿਸਟਰੀ',
    accountHealth: 'ਖਾਤਾ ਸਥਿਤੀ',
    buyLong: 'ਖਰੀਦੋ (BUY)',
    sellShort: 'ਵੇਚੋ (SELL)',
    executeOrder: 'ਆਰਡਰ ਲਗਾਓ',
    lotSize: 'ਲਾਟ ਸਾਈਜ਼',
    leverage: 'ਲੀਵਰੇਜ',
  },
};
