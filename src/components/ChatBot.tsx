import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, ChevronDown, ChevronUp } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface QuickReply {
  id: string
  text: string
  response: string
}

const quickReplies: QuickReply[] = [
  {
    id: 'services',
    text: 'What services do you offer?',
    response: 'We offer AI-powered matchmaking, compatibility assessments, personal matchmaker consultations, relationship counseling webinars, and premium membership plans. Our 75-year legacy ensures the highest quality matches.'
  },
  {
    id: 'pricing',
    text: 'What are your pricing plans?',
    response: 'We offer flexible pricing: Free profile creation, 7-day trial for ₹299, Monthly Premium at ₹1,999, and Annual Premium at ₹18,999 (save 21%). All plans include AI matching and personal support.'
  },
  {
    id: 'process',
    text: 'How does your matching process work?',
    response: 'Our 4-step process: 1) Complete detailed compatibility assessment, 2) AI analyzes your preferences and personality, 3) Receive 3-5 curated matches weekly, 4) Connect with mutual interests through our secure platform.'
  },
  {
    id: 'success',
    text: 'What is your success rate?',
    response: 'We have an 89% success rate with over 75,000 marriages facilitated since 1950. Our AI-enhanced traditional approach ensures meaningful connections that lead to lasting relationships.'
  },
  {
    id: 'support',
    text: 'How can I contact support?',
    response: 'Contact us at support@makemyknot.com, call +91-11-4567-8900, or schedule a consultation. Our relationship experts are available Mon-Sat, 9 AM to 8 PM IST.'
  }
]

const botResponses: Record<string, string> = {
  greeting: "Hello! Welcome to Make My Knot. I'm here to help you find your perfect life partner. How can I assist you today?",
  default: "I understand you're looking for information. Our relationship experts would be happy to help you personally. You can reach us at support@makemyknot.com or call +91-11-4567-8900. Is there anything specific I can help you with?",
  thanks: "You're welcome! We're here to help you find lasting love. If you have any other questions, feel free to ask. Good luck on your journey!",
  goodbye: "Thank you for chatting with Make My Knot! We look forward to helping you find your perfect match. Have a wonderful day!"
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: botResponses.greeting,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Check for specific keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greeting
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return botResponses.thanks
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return botResponses.goodbye
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('plan')) {
      return quickReplies.find(r => r.id === 'pricing')?.response || botResponses.default
    }
    
    if (message.includes('service') || message.includes('offer') || message.includes('what do you do')) {
      return quickReplies.find(r => r.id === 'services')?.response || botResponses.default
    }
    
    if (message.includes('how') && (message.includes('work') || message.includes('process') || message.includes('match'))) {
      return quickReplies.find(r => r.id === 'process')?.response || botResponses.default
    }
    
    if (message.includes('success') || message.includes('rate') || message.includes('effective')) {
      return quickReplies.find(r => r.id === 'success')?.response || botResponses.default
    }
    
    if (message.includes('contact') || message.includes('support') || message.includes('help') || message.includes('phone')) {
      return quickReplies.find(r => r.id === 'support')?.response || botResponses.default
    }
    
    return botResponses.default
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuickReplies(false)
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    handleSendMessage(quickReply.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Make My Knot Assistant</h3>
              <p className="text-xs text-primary-100">Online • Typically replies instantly</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-primary-200 transition-colors"
              aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-primary-200 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mx-2 ${
                    message.type === 'user' ? 'order-1 bg-primary-600' : 'order-2 bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-gray-600" />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs order-1">
                    <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mx-2 bg-gray-200">
                    <Bot className="h-3 w-3 text-gray-600" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 3).map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
