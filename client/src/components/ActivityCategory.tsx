import { Card, CardContent } from '@/components/ui/card';
import { 
  Mountain, 
  Waves, 
  Bike, 
  TreePine, 
  Camera, 
  Navigation 
} from 'lucide-react';

interface ActivityCategoryProps {
  category: {
    name: string;
    icon: string;
    eventCount: number;
    color: string;
  };
  onClick?: (category: string) => void;
}

const iconMap = {
  hiking: Mountain,
  water: Waves,
  cycling: Bike,
  camping: TreePine,
  photography: Camera,
  climbing: Navigation,
};

export function ActivityCategory({ category, onClick }: ActivityCategoryProps) {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Mountain;

  const handleClick = () => {
    if (onClick) {
      onClick(category.name.toLowerCase());
    }
  };

  return (
    <Card 
      className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
      data-testid={`category-card-${category.name.toLowerCase()}`}
    >
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h4 className="font-semibold text-card-foreground mb-2" data-testid={`text-category-name-${category.name.toLowerCase()}`}>
          {category.name}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid={`text-event-count-${category.name.toLowerCase()}`}>
          {category.eventCount}+ events
        </p>
      </CardContent>
    </Card>
  );
}
