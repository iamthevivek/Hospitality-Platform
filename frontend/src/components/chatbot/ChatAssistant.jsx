import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare, Building2, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendAiChat } from '../../lib/api';

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: "Namaste & Welcome to StayEase! I'm your Travel Assistant. How can I help you today? Ask about our luxury palaces in Rajasthan, beach resorts in Goa, 5-star properties in Mumbai & Delhi, or booking policies."
  }
];

const QUICK_PROMPTS = [
  "🏰 Heritage Palace in Jaipur",
  "🏖️ Beach resort in Goa",
  "🌆 Taj Mahal Palace Mumbai",
  "🕒 Check-in & cancellation policy",
  "💰 Best stays under ₹20,000"
];

function generateAssistantReply(userQuery) {
  const raw = (userQuery || '').trim();
  const q = raw.toLowerCase();

  // 1. "How are you" & Well-being
  if (
    q.includes('how are you') || 
    q.includes('how r u') || 
    q.includes('how do you do') || 
    q.includes("how's it going") || 
    q.includes('how are things') ||
    q.includes('how is it going')
  ) {
    return {
      text: "I'm doing wonderful, thank you for asking! 😊\n\nI'm your StayEase Travel Assistant. I can help you discover luxury heritage palaces in Rajasthan, private beach retreats in Goa, or 5-star hotels worldwide. I can also assist with live room pricing in Indian Rupees (₹), amenities, and booking policies.\n\nWhere are you planning to travel next?",
      actionLink: "/hotels",
      actionText: "Explore Destinations"
    };
  }

  // 2. Greetings (Hi, Hello, Namaste, Good Morning, etc.)
  const words = q.split(/\s+/);
  const isPureGreeting = ['hi', 'hello', 'hey', 'namaste'].includes(q) ||
    (['hi', 'hello', 'hey', 'namaste'].includes(words[0]) && words.length <= 2) ||
    q.includes('good morning') || q.includes('good evening') || q.includes('good afternoon');

  if (isPureGreeting) {
    return {
      text: "Namaste & warm welcome to StayEase! 🙏\n\nI am your Travel Assistant. Whether you are looking for a royal palace in Jaipur, a coastal villa in Goa, or a premier city hotel in Mumbai, Delhi, or abroad, I'm here to assist you.\n\nHow can I help you plan your journey today?",
      actionLink: "/hotels",
      actionText: "Browse All Hotels"
    };
  }

  if (q.includes('trip') || q.includes('itinerary') || q.includes('tour') || q.includes('plan')) {
    return {
      text: "Here is a curated **2-Day Luxury India Itinerary**:\n\n• **Day 1 (Jaipur / Royal Rajasthan)**: Check in to the iconic **Rambagh Palace, Jaipur** (from ₹38,000/night). Tour the Amber Fort, stroll through the royal Mughal gardens, and experience an authentic Rajasthani thali dinner.\n\n• **Day 2 (Udaipur / Lake Romance)**: Journey to **The Oberoi Udaivilas, Udaipur** (from ₹42,000/night) for a private boat arrival across Lake Pichola and sunset dining.\n\n*(Tip: Configure `GROQ_API_KEY` on your server to unlock real-time live generative AI conversations!)*",
      actionLink: "/hotels?city=Jaipur",
      actionText: "Explore Jaipur Palaces"
    };
  }

  // 3. Gratitude & Pleasantries
  if (q.includes('thank') || q === 'thanks' || q.includes('thx') || q === 'great' || q === 'awesome' || q === 'cool' || q.includes('appreciate')) {
    return {
      text: "You're most welcome! It's an absolute pleasure helping you. Let me know whenever you need assistance with room choices, local travel advice, or booking reservations. Have a splendid trip!",
      actionLink: "/hotels",
      actionText: "View Featured Hotels"
    };
  }

  // 4. Identity & Capabilities
  if (q.includes('who are you') || q.includes('what are you') || q.includes('what can you do') || q.includes('help me') || q === 'help') {
    return {
      text: "I am the **StayEase Travel Assistant**! Here is how I can assist you:\n\n• 🏰 **Recommend Stays**: Iconic heritage palaces (Rambagh, Taj, Udaivilas) & global 5-star hotels.\n• 💰 **Live INR Pricing**: Check room tariffs in Indian Rupees (₹) with zero hidden fees.\n• 💳 **Payment Guidance**: Information on UPI (GPay/PhonePe), RuPay, cards, and NetBanking.\n• 🕒 **Booking Policies**: 100% free cancellation windows, check-in timings, and photo ID rules.\n\nWhat would you like to explore?",
      actionLink: "/hotels",
      actionText: "Browse Hotel Catalog"
    };
  }

  // 5. Romance / Couples / Honeymoon
  if (q.includes('honeymoon') || q.includes('romantic') || q.includes('couple') || q.includes('anniversary')) {
    return {
      text: "For an unforgettable honeymoon or romantic escape, we recommend:\n\n1. **The Oberoi Udaivilas, Udaipur** (from ₹42,000/night): Private boat arrival across Lake Pichola, hand-carved Mewar domes, and candlelit lakeside dining.\n2. **Taj Exotica Resort & Spa, Goa** (from ₹18,500/night): Private plunge-pool villas, sunset walks on Benaulim Beach, and beachfront couple dinners.\n\nBoth offer bespoke romantic turndown amenities and couples' spa therapies.",
      actionLink: "/hotels?city=Udaipur",
      actionText: "View The Oberoi Udaivilas"
    };
  }

  // 6. Palaces / Heritage
  if (q.includes('palace') || q.includes('heritage') || q.includes('royal') || q.includes('rajasthan')) {
    return {
      text: "Experience living royal heritage at our iconic palace properties:\n\n• **Rambagh Palace, Jaipur** (from ₹38,000/night): The 'Jewel of Jaipur', former residence of the Maharaja with 47 acres of Mughal gardens.\n• **The Taj Mahal Palace, Mumbai** (from ₹24,000/night): India's most celebrated grand heritage hotel facing the Gateway of India.\n• **The Oberoi Udaivilas, Udaipur** (from ₹42,000/night): Palatial grandeur on the banks of Lake Pichola.",
      actionLink: "/hotels?city=Jaipur",
      actionText: "View Rambagh Palace Jaipur"
    };
  }

  // 7. Beaches / Goa
  if (q.includes('goa') || q.includes('beach') || q.includes('coastal') || q.includes('sea')) {
    return {
      text: "For sun, sea, and serene luxury, **Taj Exotica Resort & Spa in South Goa** (from ₹18,500/night) is our top pick:\n\n• Direct, private access to pristine Benaulim Beach\n• Mediterranean & authentic Goan seafood dining\n• Sprawling tropical pool and signature Taj Jiva Spa treatments\n• Private luxury garden and plunge-pool villas.",
      actionLink: "/hotels?city=Goa",
      actionText: "View Taj Exotica Goa"
    };
  }

  // 8. Mumbai
  if (q.includes('mumbai') || q.includes('bombay')) {
    return {
      text: "In the City of Dreams, stay at the legendary **The Taj Mahal Palace, Mumbai** (from ₹24,000/night):\n\n• Majestic views of the Arabian Sea and the Gateway of India\n• 9 iconic fine-dining restaurants including Wasabi by Morimoto and Golden Dragon\n• Royal Butler service, historic heritage corridors, and luxury Jiva Spa.",
      actionLink: "/hotels?city=Mumbai",
      actionText: "View Mumbai Hotels"
    };
  }

  // 9. Delhi
  if (q.includes('delhi') || q.includes('new delhi')) {
    return {
      text: "In the capital, **The Leela Palace New Delhi** (from ₹22,000/night) in the Diplomatic Enclave offers:\n\n• Royal architecture inspired by Lutyens Delhi\n• Award-winning culinary journeys at Le Cirque and Jamavar\n• New Delhi's only temperature-controlled rooftop infinity pool.",
      actionLink: "/hotels?city=New Delhi",
      actionText: "View Delhi Properties"
    };
  }

  // 10. Udaipur
  if (q.includes('udaipur') || q.includes('lake pichola')) {
    return {
      text: "In the City of Lakes, **The Oberoi Udaivilas** (from ₹42,000/night) is consistently voted among the world's finest resorts:\n\n• Located on the tranquil shores of Lake Pichola\n• Private boat arrival across the lake\n• Interconnected palace courtyards, reflection pools, and Mewar frescoes.",
      actionLink: "/hotels?city=Udaipur",
      actionText: "View Udaivilas Udaipur"
    };
  }

  // 11. Chennai / South India
  if (q.includes('chennai') || q.includes('madras') || q.includes('south india')) {
    return {
      text: "In Chennai, **ITC Grand Chola** (from ₹14,000/night) is a palatial tribute to the imperial Chola dynasty:\n\n• 10 acclaimed dining destinations and signature Peshawri cuisine\n• Expansive Kaya Kalp – The Royal Spa\n• Certified LEED Platinum green luxury standard.",
      actionLink: "/hotels?city=Chennai",
      actionText: "View ITC Grand Chola"
    };
  }

  // 12. Budget / Affordable / Under ₹20,000
  if (q.includes('budget') || q.includes('cheap') || q.includes('under 20') || q.includes('under 15') || q.includes('affordable') || q.includes('low price') || q.includes('discount')) {
    return {
      text: "Here are our finest high-value luxury stays starting under ₹20,000/night:\n\n1. **Ubud Jungle Retreat (Bali)** — from ₹9,600/night\n2. **Hotel Gaudí (Barcelona)** — from ₹12,800/night\n3. **ITC Grand Chola (Chennai)** — from ₹14,000/night\n4. **Hotel Le Marais (Paris)** — from ₹14,400/night\n5. **Taj Exotica Resort (Goa)** — from ₹18,500/night\n\nAll prices are clearly quoted in Indian Rupees (₹) with breakfast and standard luxury amenities.",
      actionLink: "/hotels",
      actionText: "Browse Value Stays"
    };
  }

  // 13. Ultra-Luxury / 5 Star
  if (q.includes('luxury') || q.includes('5 star') || q.includes('five star') || q.includes('vip') || q.includes('expensive')) {
    return {
      text: "Our premier flagship 5-star properties:\n\n1. **Burj Al Arab Jumeirah (Dubai)** — from ₹1,20,000/night (Iconic sail silhouette, private duplex suites)\n2. **The Oberoi Udaivilas (Udaipur)** — from ₹42,000/night (Royal lake palace)\n3. **Rambagh Palace (Jaipur)** — from ₹38,000/night (The Jewel of Jaipur)\n4. **The Plaza (New York)** — from ₹68,000/night (Fifth Avenue legend)\n5. **The Ritz Paris (Paris)** — from ₹76,000/night (Place Vendôme grandeur)",
      actionLink: "/hotels",
      actionText: "View 5-Star Hotels"
    };
  }

  // 14. International destinations
  if (q.includes('dubai')) {
    return {
      text: "In Dubai, stay at the legendary **Burj Al Arab Jumeirah** (from ₹1,20,000/night) — the world's most luxurious hotel featuring duplex suites, private butler service, and a cantilevered infinity pool on the Arabian Gulf.",
      actionLink: "/hotels?city=Dubai",
      actionText: "View Dubai Hotels"
    };
  }
  if (q.includes('paris')) {
    return {
      text: "In Paris, choose between the iconic **The Ritz Paris** (from ₹76,000/night) on Place Vendôme or the charming boutique **Hotel Le Marais** (from ₹14,400/night) in the historic arts quarter.",
      actionLink: "/hotels?city=Paris",
      actionText: "View Paris Hotels"
    };
  }
  if (q.includes('london')) {
    return {
      text: "In London, **The Savoy** (from ₹52,000/night) on the Strand offers timeless British glamour, panoramic River Thames views, and the famous American Bar.",
      actionLink: "/hotels?city=London",
      actionText: "View London Hotels"
    };
  }
  if (q.includes('tokyo') || q.includes('japan')) {
    return {
      text: "In Tokyo, **Aman Tokyo** (from ₹65,000/night) in Otemachi offers minimalist Japanese sanctuary, private onsen baths, and panoramic views of Mount Fuji and the Imperial Palace Gardens.",
      actionLink: "/hotels?city=Tokyo",
      actionText: "View Tokyo Hotels"
    };
  }
  if (q.includes('bali') || q.includes('indonesia')) {
    return {
      text: "In Bali, **Ubud Jungle Retreat** (from ₹9,600/night) features private forest infinity villas, morning yoga pavilions, and Ayurvedic wellness rituals.",
      actionLink: "/hotels?city=Bali",
      actionText: "View Bali Retreats"
    };
  }

  // 15. Cancellation & Refunds
  if (q.includes('cancel') || q.includes('refund') || q.includes('money back')) {
    return {
      text: "📋 **StayEase Cancellation Policy**:\n\n• **100% Full Refund**: If cancelled up to 48 hours before check-in time (2:00 PM).\n• **50% Refund**: If cancelled between 24 and 48 hours before check-in.\n• **Non-refundable**: Cancellations within 24 hours of check-in.\n• **Refund Processing**: Funds are credited directly to your original payment method (UPI, RuPay, Card, or NetBanking) within 24–48 business hours with zero hidden deduction fees.\n\nYou can cancel anytime directly from your StayEase Dashboard!",
      actionLink: "/cancellation-policy",
      actionText: "Read Cancellation Policy"
    };
  }

  // 16. Payment options & INR
  if (q.includes('payment') || q.includes('pay') || q.includes('upi') || q.includes('rupee') || q.includes('card') || q.includes('gpay') || q.includes('phonepe')) {
    return {
      text: "💳 **StayEase Payment Methods**:\n\n• **UPI**: Google Pay, PhonePe, Paytm, and BHIM.\n• **Debit & Credit Cards**: RuPay, Visa, Mastercard, and American Express.\n• **NetBanking**: All major Indian banks (HDFC, ICICI, SBI, Axis, Kotak).\n• **Zero Hidden Fees**: All prices are quoted in Indian Rupees (₹) with all applicable GST and taxes itemized clearly at checkout.",
      actionLink: "/hotels",
      actionText: "Browse Stays"
    };
  }

  // 17. Check-in & IDs
  if (q.includes('check-in') || q.includes('checkin') || q.includes('id') || q.includes('aadhaar') || q.includes('passport') || q.includes('time') || q.includes('timing')) {
    return {
      text: "🕒 **Check-in & Guest Guidelines**:\n\n• **Standard Check-in**: 2:00 PM\n• **Standard Check-out**: 11:00 AM\n• **Early Check-in**: Available upon request subject to room availability.\n• **Mandatory ID**: Government regulations require all adult guests to present an original Government photo ID (Aadhaar, Passport, Driving License, or Voter ID). PAN cards are not accepted as valid address proof.",
      actionLink: "/help",
      actionText: "Help & FAQ Center"
    };
  }

  // 18. Food / Dining / Breakfast
  if (q.includes('food') || q.includes('breakfast') || q.includes('dining') || q.includes('restaurant') || q.includes('dinner') || q.includes('lunch')) {
    return {
      text: "🍽️ **Dining & Breakfast**:\n\nMost of our luxury bookings include complimentary multi-cuisine buffet breakfast! Our properties host acclaimed award-winning restaurants, such as Wasabi by Morimoto at The Taj Mahal Palace Mumbai, and Peshawri at ITC Grand Chola Chennai. You can also specify dietary preferences during booking.",
      actionLink: "/hotels",
      actionText: "Explore Properties"
    };
  }

  // 19. Swimming Pool / Spa / Amenities
  if (q.includes('pool') || q.includes('spa') || q.includes('gym') || q.includes('amenit') || q.includes('wifi')) {
    return {
      text: "🛎️ **Luxury Amenities**:\n\nAll our partner properties feature complimentary high-speed Wi-Fi, 24/7 room service, luxury wellness spas, and temperature-controlled swimming pools. Filter for 'Pool' or 'Spa' on our Hotels catalog page to see all available properties.",
      actionLink: "/hotels",
      actionText: "Filter by Amenities"
    };
  }

  // 20. Support & Contacts
  if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('support') || q.includes('email') || q.includes('number')) {
    return {
      text: "📞 **StayEase 24/7 Support Contacts**:\n\n• **Direct Phone Hotline**: +91 (022) 4982-3000\n• **WhatsApp Support**: +91 98201 12345\n• **Email**: support@stayease.in\n• **Headquarters**: Nariman Point, Mumbai & MG Road, Bengaluru.\n\nOur team is available 24 hours a day, 7 days a week to assist you.",
      actionLink: "/contact",
      actionText: "Contact Support Team"
    };
  }

  // Default Fallback
  return {
    text: `Thank you for asking! StayEase offers handpicked luxury stays across India (Jaipur, Udaipur, Goa, Mumbai, Delhi, Chennai) and premier global destinations.\n\nAll bookings are quoted in Indian Rupees (₹) with 100% full refunds up to 48 hours prior to check-in. Would you like to explore heritage palaces, seaside beach villas, or city business hotels?`,
    actionLink: "/hotels",
    actionText: "Explore All Hotels"
  };
}

function FormattedMessageText({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  const parseInlineFormatting = (str) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-[13px]">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Bullet line like "- **..." or "• ..."
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[-•*]\s+/, '');
          return (
            <div key={i} className="flex items-start space-x-2 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d7e8a] mt-1.5 flex-shrink-0"></span>
              <div className="flex-1 text-slate-700">
                {parseInlineFormatting(content)}
              </div>
            </div>
          );
        }

        // Numbered list line like "1. **..."
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          return (
            <div key={i} className="flex items-start space-x-2 pl-1 py-0.5">
              <span className="font-bold text-[11px] text-[#0d7e8a] bg-teal-50 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                {num}
              </span>
              <div className="flex-1 text-slate-700">
                {parseInlineFormatting(content)}
              </div>
            </div>
          );
        }

        // Standard line
        return (
          <p key={i} className="text-slate-700">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

async function callDirectGroq(query, history) {
  if (!GROQ_API_KEY) return null;

  const systemPrompt = `You are the StayEase Travel Assistant, a friendly, luxurious, and knowledgeable hotel booking concierge for StayEase (India's premier modern luxury hospitality platform).
You assist guests with discovering iconic heritage royal palaces in Rajasthan, beach retreats in Goa, 5-star properties in Mumbai, Delhi, Udaipur, and world-class getaways.
All hotel rates should be quoted in Indian Rupees (₹ INR).
Give detailed, beautifully formatted travel recommendations, curated 2-4 day itineraries, and hotel room suggestions with warm hospitality.`;

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: query }
  ];

  const models = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

  for (const model of models) {
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: messagesPayload,
          max_tokens: 1200,
          temperature: 0.7
        })
      });

      if (!resp.ok) continue;
      const data = await resp.json();
      const choice = data.choices?.[0]?.message;
      let reply = choice?.content?.trim() || choice?.reasoning?.trim();
      if (reply) {
        let suggestedLink = '/hotels';
        let suggestedLinkText = 'Explore All Stays';
        const lower = (query + ' ' + reply).toLowerCase();
        if (lower.includes('jaipur')) {
          suggestedLink = '/hotels?city=Jaipur';
          suggestedLinkText = 'View Jaipur Palaces';
        } else if (lower.includes('goa')) {
          suggestedLink = '/hotels?city=Goa';
          suggestedLinkText = 'View Goa Resorts';
        } else if (lower.includes('mumbai')) {
          suggestedLink = '/hotels?city=Mumbai';
          suggestedLinkText = 'View Mumbai Hotels';
        } else if (lower.includes('udaipur')) {
          suggestedLink = '/hotels?city=Udaipur';
          suggestedLinkText = 'View Udaipur Palaces';
        }

        return { reply, suggestedLink, suggestedLinkText };
      }
    } catch (e) {
      console.warn(`Direct Groq model ${model} failed, trying next...`);
    }
  }
  return null;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setInputText('');
    setIsTyping(true);

    const history = messages
      .filter((m) => m.text)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }));

    // 1. Try Backend first
    try {
      const res = await sendAiChat(query, history);
      if (res && res.reply && res.modelUsed && res.modelUsed !== 'stayease-assistant') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: res.reply,
            actionLink: res.suggestedLink,
            actionText: res.suggestedLinkText
          }
        ]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend AI not responding with live model, trying direct Groq call...');
    }

    // 2. Direct Groq API live call (ensures instant real live AI without needing server restart)
    try {
      const groqRes = await callDirectGroq(query, history);
      if (groqRes && groqRes.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: groqRes.reply,
            actionLink: groqRes.suggestedLink,
            actionText: groqRes.suggestedLinkText
          }
        ]);
        setIsTyping(false);
        return;
      }
    } catch (groqErr) {
      console.warn('Direct Groq call failed:', groqErr);
    }

    // 3. Fallback to local assistant engine if all else fails
    const response = generateAssistantReply(query);
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: response.text,
        actionLink: response.actionLink,
        actionText: response.actionText
      }
    ]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[80vh] flex flex-col border border-gray-100 overflow-hidden mb-2 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0d7e8a] p-4 flex justify-between items-center text-white shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-sm">StayEase Travel Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-teal-100 flex items-center gap-1">
                  <span>Online 24/7 • Instant Help</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col space-y-3 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl shadow-xs max-w-[88%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0d7e8a] text-white rounded-tr-none self-end'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none self-start'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-line text-[13px]">{msg.text}</div>
                ) : (
                  <FormattedMessageText text={msg.text} />
                )}
                {msg.actionLink && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <Link
                      to={msg.actionLink}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0d7e8a] hover:text-[#0b6b75] bg-teal-50 hover:bg-teal-100/70 px-3 py-1.5 rounded-lg transition"
                    >
                      <span>{msg.actionText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="bg-white border border-gray-100 text-gray-400 p-3 rounded-2xl rounded-tl-none self-start text-xs flex items-center space-x-1 shadow-sm">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap bg-gray-100 hover:bg-primary-50 hover:text-primary-600 text-gray-600 text-xs px-2.5 py-1 rounded-full transition flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Indian hotels, Goa resorts, policies..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-xl shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-2xl hover:shadow-primary-500/30 transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
          <span className="hidden group-hover:block absolute right-16 bg-gray-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
            Chat with Travel Assistant
          </span>
        </button>
      )}
    </div>
  );
}
