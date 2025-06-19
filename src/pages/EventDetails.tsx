
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNav from '@/components/BottomNav';
import EnhancedPlayerRSVPList from '@/components/schedule/EnhancedPlayerRSVPList';
import EventDetails from '@/components/schedule/EventDetails';
import EventInfoCard from '@/components/schedule/EventInfoCard';
import EventRSVPSection from '@/components/schedule/EventRSVPSection';
import EventActionsSection from '@/components/schedule/EventActionsSection';
import { useEvent } from '@/hooks/useEvent';
import { useEventRSVP } from '@/hooks/useEventRSVP';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { parseEventDate } from '@/utils/dateUtils';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  const { 
    data: event, 
    isLoading: eventLoading,
    error: eventError 
  } = useEvent(eventId!);
  
  const { 
    userRSVP, 
    updateRSVP, 
    isUpdating 
  } = useEventRSVP(eventId!);

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blitz-charcoal">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blitz-purple"></div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen bg-blitz-charcoal p-4">
        <div className="text-center text-red-400">
          Error loading event details. Please try again.
        </div>
      </div>
    );
  }

  const handleRSVP = (response: 'yes' | 'no' | 'maybe') => {
    updateRSVP({ response });
  };

  const handleAddToCalendar = () => {
    console.log('Adding event to calendar:', event);
    
    // Parse the event date properly
    const eventDate = parseEventDate(event.date);
    
    // Create start and end times
    const [startHour, startMinute] = event.time.split(':').map(Number);
    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    let endDateTime;
    if (event.endTime) {
      const [endHour, endMinute] = event.endTime.split(':').map(Number);
      endDateTime = new Date(eventDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
    } else {
      // Default to 90 minutes if no end time
      endDateTime = new Date(startDateTime.getTime() + 90 * 60000);
    }
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSS format)
    const formatCalendarDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = '00';
      return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };
    
    const startFormatted = formatCalendarDate(startDateTime);
    const endFormatted = formatCalendarDate(endDateTime);
    
    // Create event description
    let description = `${event.type} - ${event.location}`;
    if (event.opponent) {
      description += `\nOpponent: ${event.opponent}`;
    }
    if (event.notes) {
      description += `\n\nNotes: ${event.notes}`;
    }
    
    // Build Google Calendar URL
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startFormatted}/${endFormatted}`,
      details: description,
      location: event.location
    });
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
    
    console.log('Opening calendar URL:', googleCalendarUrl);
    window.open(googleCalendarUrl, '_blank');
  };

  const handleDelete = (eventId: string) => {
    console.log('Delete event:', eventId);
  };

  return (
    <div className="min-h-screen bg-blitz-charcoal pb-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-black hover:bg-gray-800 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-black ml-3">Event Details</h1>
        </div>

        {/* Event Info Card */}
        <EventInfoCard event={event} />

        {/* RSVP and Actions in Card Content */}
        <div className="bg-blitz-darkgray border border-gray-700 rounded-lg p-4 mb-6">
          <EventRSVPSection 
            userRSVP={userRSVP}
            isUpdating={isUpdating}
            onRSVP={handleRSVP}
          />
          
          <EventActionsSection onAddToCalendar={handleAddToCalendar} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-1 bg-blitz-darkgray border-gray-700">
            <TabsTrigger value="attendance" className="text-black data-[state=active]:bg-blitz-purple data-[state=active]:text-white">
              Attendance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="mt-4">
            <EnhancedPlayerRSVPList 
              eventId={eventId!} 
              eventTitle={event.title}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />

      <EventDetails
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        selectedEvent={selectedEvent}
        onRSVP={handleRSVP}
        onAddToCalendar={handleAddToCalendar}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EventDetailsPage;
