export type EachHallLocationType = {
    desc1: string;
    desc2: string;
    gmapurl?: string;
    iframe?: string;
  };
  
  export type EachHallTimingType = {
    from: string;
    to: string;
  };
  
  export type EachHallPartyAreaType = {
    areaName: string;
    capacity: number;
    seating: number;
  };
  
  export type EachHallAdditonalFeaturesType = {
    heading: string;
    desc: string;
  };
  
  export type EachHallType = {
    location: EachHallLocationType;
    about: string[];
    timings: EachHallTimingType;
    partyArea: EachHallPartyAreaType[];
    pricing: number | undefined;
    additionalFeatures: EachHallAdditonalFeaturesType[];
    images: string[];
  };