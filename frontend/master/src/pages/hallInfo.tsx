import React from 'react';
import HallLocation from '../components/HallLocation';
import AboutHall from '../components/AboutHall';
import HallSlotInfo from '../components/HallSlotInfo';
import HallCapacity from '../components/HallCapacity';
import HallPricing from '../components/HallPricing';
import HallAdditionalFeatures from '../components/HallAdditionalFeatures';
import ImageCarousel from '../components/ImageCarousel';

export default function hallInfo() {
  return (
    <div className="hall-info-container grid place-items-center gap-y-12 px-52 py-16 overflow-y-hidden">
      <h1 className="text-5xl">Babubhai Jagjivandas Hall</h1>
      <HallLocation />
      <AboutHall />
      <HallSlotInfo />
      <HallCapacity />
      <HallPricing />
      <HallAdditionalFeatures />
      <ImageCarousel />
    </div>
  )
}
