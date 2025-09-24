import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

export const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = () => {
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[250]">
      <Card className="w-full max-w-md mx-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Mapbox Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To use the interactive map feature, please enter your Mapbox public token.
          </p>
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoidXNlcm5hbWUiLCJhIjoi..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Get your token from{' '}
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center gap-1"
              >
                Mapbox Dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={!token.trim()}
            className="w-full"
          >
            Enable Map
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};