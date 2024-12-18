import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid, List } from "lucide-react";
import axios from "axios";
import { TLD, TLDType } from "@/types/tld";
import { fallbackTldData } from "@/data/tldData";

const TLD_TYPES: TLDType[] = ['gTLD', 'ccTLD', 'grTLD', 'sTLD', 'infrastructure', 'test'];

export const TldMenu = () => {
  const [tlds, setTlds] = useState<TLD[]>([]);
  const [selectedType, setSelectedType] = useState<TLDType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTlds = async () => {
      try {
        const response = await axios.get('https://tld-list.com/df/tld-list-details.json');
        setTlds(response.data);
      } catch (error) {
        console.info('Using fallback TLD data due to API error');
        setTlds(fallbackTldData);
      }
    };
    fetchTlds();
  }, []);

  const filteredTlds = tlds.filter(tld => 
    selectedType === 'all' || tld.type === selectedType
  ).sort((a, b) => a.tld.localeCompare(b.tld));

  const groupedTlds = filteredTlds.reduce((acc, tld) => {
    const firstLetter = tld.tld.charAt(1).toUpperCase(); // Skip the dot
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tld);
    return acc;
  }, {} as Record<string, TLD[]>);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-auto">
          <TabsList className="bg-muted inline-flex h-9 items-center justify-center rounded-full p-1">
            <TabsTrigger
              value="all"
              onClick={() => setSelectedType('all')}
              className="rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              All TLDs
            </TabsTrigger>
            {TLD_TYPES.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                onClick={() => setSelectedType(type)}
                className="rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <div className="p-4">
          {Object.entries(groupedTlds).map(([letter, tlds]) => (
            <div key={letter} className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{letter}</h3>
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
                {tlds.map((tld) => (
                  <Button
                    key={tld.tld}
                    variant="outline"
                    className="w-full justify-start hover:bg-primary hover:text-primary-foreground"
                    onClick={() => navigate(`/tld/${tld.tld.substring(1)}`)}
                  >
                    {tld.tld}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};