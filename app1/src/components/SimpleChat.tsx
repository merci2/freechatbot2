import { useState, useEffect } from 'react';
import type { Message } from '../types';
import { GroqService } from '../services/groq.service';

export function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [groqOnline, setGroqOnline] = useState(false);

  useEffect(() => {
    // Groq ist online wenn API Key vorhanden ist
    const apiKeyExists = !!import.meta.env.VITE_GROQ_API_KEY;
    setGroqOnline(apiKeyExists);
    
    if (!apiKeyExists) {
      console.error('Groq API Key fehlt in .env.local');
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !groqOnline) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sende an Groq Mixtral...');
      const startTime = Date.now();
      
      const response = await GroqService.generate(input);
      
      console.log(`Antwort erhalten in ${Date.now() - startTime}ms`);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error('Fehler:', error);

      // Zeige Fehler als Nachricht
      let errorMsg = 'Unbekannter Fehler';
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
        errorMsg = (error as { message: string }).message;
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Fehler: ${errorMsg}`,
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Mixtral Chat (Groq)</h1>
        <button
          onClick={clearChat}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Chat löschen
        </button>
      </div>
      
      <div style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
        <span>Status: {groqOnline ? '✅ Online' : '❌ Offline (API Key fehlt)'}</span>
        {/* <span>Model: Mixtral 8x7B</span> */}
        <span>Model: LLaMA 3.3 70B Versatile</span>
        <span>Provider: Groq (Ultra-Fast)</span>
      </div>

      <div style={{ 
        border: '1px solid #ccc', 
        height: '400px', 
        overflowY: 'auto', 
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            marginTop: '150px' 
          }}>
            Stelle eine Frage an Mixtral...
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} style={{ 
            marginBottom: '15px',
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{ maxWidth: '70%' }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginBottom: '4px' 
              }}>
                {msg.role === 'user' ? 'Du' : 'Mixtral'}
              </div>
              <div style={{
                padding: '10px 14px',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#ffffff',
                color: msg.role === 'user' ? 'white' : 'black',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word'
              }}>
                {msg.content}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#999', 
                marginTop: '2px' 
              }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ 
            display: 'flex', 
            gap: '5px', 
            padding: '10px' 
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              animation: 'pulse 1.4s infinite'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              animation: 'pulse 1.4s infinite 0.2s'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              animation: 'pulse 1.4s infinite 0.4s'
            }}></div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={!groqOnline || isLoading}
          placeholder={groqOnline ? "Stelle eine Frage..." : "API Key fehlt in .env.local"}
          style={{ 
            flex: 1, 
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!groqOnline || isLoading || !input.trim()}
          style={{ 
            padding: '10px 20px',
            backgroundColor: (!groqOnline || isLoading || !input.trim()) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!groqOnline || isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Sende...' : 'Senden'}
        </button>
      </div>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666' 
      }}>
        💡 Tipp: Groq ist ultra-schnell - Antworten in unter 1 Sekunde!
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}