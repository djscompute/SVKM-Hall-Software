import React from 'react';
import EditComponent from "./EditComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

export default function HallLocation() {
  return (
    <div className="hall-location flex justify-between bg-[#8c9ecd] w-full p-3 px-12 rounded-lg">
        <div className="hall-location-main-info w-11/12">
        <h2 className="font-bold text-xl mb-3">Location</h2>
          <div className="hall-location-map flex items-center gap-5">
            <h2 className="hall-location-small text-lg">Juhu, Mumbai</h2>
            <span className="map-location">
              <FontAwesomeIcon className="text-red-600" icon={ faLocationDot } />
              <a href="https://www.google.com/maps/dir//1,+N+S+Rd+Number+3,+Navpada,+JVPD+Scheme,+Vile+Parle+West,+Mumbai,+Maharashtra+400056/@19.1076328,72.7959017,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3be7c9c6505a00af:0x13b8ff72726ae189!2m2!1d72.8371414!2d19.1076336?entry=ttu" className="ml-1 text-gray-700" target='_blank'>View on map</a>
            </span>
          </div>
          <h2 className="hall-location-big text-lg">Babubhai Jagjivandas Hall, 1, N S Rd Number 3, Navpada, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056</h2>
        </div>
        <EditComponent />
    </div>
  )
}
