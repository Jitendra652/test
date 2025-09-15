import { useState } from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
  onFavorite?: (eventId: string) => void;
  isFavorited?: boolean;
}

export function EventCard({ event, onJoin, onFavorite, isFavorited = false }: EventCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (onJoin) {
      setIsLoading(true);
      try {
        await onJoin(event.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(event.id);
    }
  };

  const eventDate = new Date(event.date);
  const price = parseFloat(event.price);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer" data-testid={`event-card-${event.id}`}>
      <div className="aspect-video relative overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-event-${event.id}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-4xl">🏔️</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge variant={price === 0 ? "secondary" : "default"} data-testid={`badge-price-${event.id}`}>
            {price === 0 ? "Free" : `$${price}`}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={handleFavorite}
            data-testid={`button-favorite-${event.id}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span data-testid={`text-date-${event.id}`}>{format(eventDate, 'MMM d, yyyy')}</span>
          <Clock className="w-4 h-4 ml-4" />
          <span data-testid={`text-time-${event.id}`}>{format(eventDate, 'h:mm a')}</span>
        </div>
        
        <h4 className="text-xl font-semibold text-card-foreground mb-3" data-testid={`text-title-${event.id}`}>
          {event.title}
        </h4>
        
        <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`text-description-${event.id}`}>
          {event.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span data-testid={`text-location-${event.id}`}>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span data-testid={`text-participants-${event.id}`}>
              {event.currentParticipants}/{event.maxParticipants} joined
            </span>
          </div>
        </div>
        
        {onJoin && (
          <Button
            className="w-full mt-4"
            onClick={handleJoin}
            disabled={isLoading || event.currentParticipants >= event.maxParticipants}
            data-testid={`button-join-${event.id}`}
          >
            {isLoading ? 'Joining...' : event.currentParticipants >= event.maxParticipants ? 'Full' : 'Join Event'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
