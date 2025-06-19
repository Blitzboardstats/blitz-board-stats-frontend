
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
}

interface DirectMessageProps {
  recipientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMessage: (message: string) => void;
}

const DirectMessage = ({
  recipientName,
  open,
  onOpenChange,
  onSendMessage
}: DirectMessageProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Simulate loading message history
  useEffect(() => {
    if (open && recipientName) {
      // In a real app, we would fetch messages from an API
      const mockMessages: Message[] = [
        {
          id: '1',
          content: `Hi there! I'm Coach ${recipientName}. How can I help you?`,
          sender: recipientName,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isFromCurrentUser: false
        },
        {
          id: '2',
          content: "I had a question about practice tomorrow.",
          sender: "You",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
          isFromCurrentUser: true
        },
        {
          id: '3',
          content: "Practice is still on for 4:30pm at the main field.",
          sender: recipientName,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
          isFromCurrentUser: false
        },
      ];
      
      setMessages(mockMessages);
    }
  }, [open, recipientName]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add message to local state
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: "You",
      timestamp: new Date(),
      isFromCurrentUser: true
    };
    
    setMessages([...messages, newMessage]);
    
    // Send to parent component
    onSendMessage(message);
    setMessage('');
    
    // Simulate response in 1 second (in a real app, this would come from the server)
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: `Thanks for your message. I'll get back to you soon.`,
        sender: recipientName,
        timestamp: new Date(),
        isFromCurrentUser: false
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800 max-w-md mx-auto h-[80vh] max-h-[600px] flex flex-col">
        <DialogHeader className="border-b border-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blitz-purple flex items-center justify-center">
                {recipientName.charAt(0)}
              </div>
              {recipientName}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.isFromCurrentUser 
                      ? 'bg-blitz-purple text-white' 
                      : 'bg-blitz-darkgray text-white'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {format(msg.timestamp, 'h:mm a')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t border-gray-800">
          <input
            className="input-field h-12 rounded-full flex-1"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <Button 
            type="submit" 
            size="icon"
            className="h-10 w-10 rounded-full bg-blitz-purple hover:bg-blitz-purple/90"
            disabled={!message.trim()}
          >
            <Send size={18} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DirectMessage;
