"use client";

import * as React from "react";
import { SearchBar } from './SearchBar';
import { ImageUploadButton } from './ImageUploadButton';

export interface SearchBarWithImageUploadProps {
  className?: string;
  onSearch?: (query: string) => void;
  onQueryStart?: (query: string) => void;
  onMapToggle?: () => void;
  resetTrigger?: number;
  isMapVisible?: boolean;
  isInChatMode?: boolean;
  currentView?: string;
  hasPerformedSearch?: boolean;
}

export const SearchBarWithImageUpload = (props: SearchBarWithImageUploadProps) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleImageUpload = (searchQuery: string) => {
    setSearchValue(searchQuery);
    if (props.onSearch) {
      props.onSearch(searchQuery);
    }
  };

  return (
    <div className="relative">
      <SearchBar {...props} />
      
      {/* Image Upload Button - positioned next to search bar */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
        <ImageUploadButton
          onImageUpload={handleImageUpload}
          size="md"
        />
      </div>
    </div>
  );
};

export default SearchBarWithImageUpload;
