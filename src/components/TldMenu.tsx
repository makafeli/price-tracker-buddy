import React, { useState } from 'react';
import { tldData } from '@/data/tldData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TLD_TYPES = [
  'gTLD', 'ccTLD', 'grTLD', 'sTLD', 
  'Infrastructure', 'Test'
];

export const TldMenu = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTlds = tldData.filter(tld => 
    (!selectedType || tld.type === selectedType) &&
    tld.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {TLD_TYPES.map(type => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            className={cn(
              "rounded-full px-4 py-2 transition-all duration-300",
              selectedType === type 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
          >
            {type}
          </Button>
        ))}
      </div>

      <input 
        type="text" 
        placeholder="Search TLDs..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-md bg-background text-foreground 
                   focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredTlds.map(tld => (
          <div 
            key={tld.name} 
            className="bg-card border rounded-lg p-4 shadow-sm 
                        hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">{tld.name}</span>
              <span className="text-muted-foreground text-sm">{tld.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};