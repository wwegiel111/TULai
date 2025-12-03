import { useState, useRef, useEffect } from 'react'
import './ChatWidget.css'

const PREDEFINED_PROMPTS = [
    { id: 1, text: "Where can I find the schedule?", answer: "The schedule is available in the https://lodz.celcat.cloud/." },
    { id: 2, text: "Where is the library?", answer: "The library is located in Building B, 2nd floor." },
    { id: 3, text: "Contact support", answer: "You can contact support at support@wikamp.edu.pl." }
]

const FAQS = [
    { q: "When are exams?", a: "Exams schedule is available in the 'Classrooms and exams' section." },
    { q: "How to register for courses?", a: "Go to 'Courses' -> 'Registration' during the enrollment period." },
    { q: "Can I change my group?", a: "Group changes require Dean's approval. Submit a request via 'Student Area'." }
]

const RECENT_QUESTIONS = [
    "Scholarship requirements",
    "Canteen opening hours",
    "Parking availability"
]

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [currentView, setCurrentView] = useState('home') // 'home' or 'chat'
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen, currentView])

    const handleSendMessage = (text) => {
        const userMsg = { type: 'user', text }
        setMessages(prev => [...prev, userMsg])
        setCurrentView('chat')

        // Simulate AI response
        setTimeout(() => {
            let responseText = "I'm a demo agent. I can only answer predefined questions for now."

            // Simple matching logic
            const lowerText = text.toLowerCase()
            const foundPrompt = PREDEFINED_PROMPTS.find(p => p.text === text)

            if (foundPrompt) {
                responseText = foundPrompt.answer
            } else if (lowerText.includes("scholarship")) {
                responseText = "Scholarship requirements can be found in the 'Student Welfare' section."
            } else if (lowerText.includes("canteen")) {
                responseText = "The canteen is open from 8:00 AM to 4:00 PM."
            } else if (lowerText.includes("parking")) {
                responseText = "Student parking is available behind Building C."
            }

            setMessages(prev => [...prev, { type: 'bot', text: responseText }])
        }, 800)
    }

    const handleInputSubmit = (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return
        handleSendMessage(inputValue)
        setInputValue("")
    }

    const handleBackToHome = () => {
        setCurrentView('home')
    }

    return (
        <div className="chat-widget-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-left">
                            {currentView === 'chat' && (
                                <button className="back-btn" onClick={handleBackToHome}>
                                    ←
                                </button>
                            )}
                            <div className="header-title">
                                <span className="status-dot"></span>
                                Wikamp AI
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-content">
                        {currentView === 'home' ? (
                            <div className="welcome-screen">
                                <div className="welcome-header">
                                    <h3>Hello, Student! 👋</h3>
                                    <p>How can I help you today?</p>
                                </div>

                                <div className="section-title">Suggested Topics</div>
                                <div className="prompts-grid">
                                    {PREDEFINED_PROMPTS.map(prompt => (
                                        <button key={prompt.id} className="prompt-chip" onClick={() => handleSendMessage(prompt.text)}>
                                            {prompt.text}
                                        </button>
                                    ))}
                                </div>

                                <div className="section-title">Frequently Asked</div>
                                <div className="faq-list">
                                    {FAQS.map((faq, i) => (
                                        <details key={i} className="faq-item">
                                            <summary>{faq.q}</summary>
                                            <p>{faq.a}</p>
                                        </details>
                                    ))}
                                </div>

                                <div className="section-title">Recently Asked</div>
                                <div className="recent-list">
                                    {RECENT_QUESTIONS.map((q, i) => (
                                        <div key={i} className="recent-item" onClick={() => handleSendMessage(q)}>
                                            <span className="icon">🕒</span> {q}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="messages-list">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`message ${msg.type}`}>
                                        <div className="message-bubble">
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <form className="chat-input-area" onSubmit={handleInputSubmit}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" disabled={!inputValue.trim()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    )
}

export default ChatWidget
