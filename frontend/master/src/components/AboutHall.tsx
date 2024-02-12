import React, { useState } from 'react';
import EditComponent from './EditComponent';

const paragraphStyles = {
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
}

export default function AboutHall() {

    const [ isOpen, setIsOpen ] = useState(false);
    
    const toggleReadMore = () => setIsOpen(!isOpen);

    return (
        <div className="about-hall flex justify-between bg-[#8c9ecd] w-full p-3 px-12 rounded-lg">
            <div className="about-hall-info w-11/12">
                <h2 className="font-bold text-xl mb-3">About this venue</h2>
                <div className="about-hall text-lg" style={ isOpen ? null : paragraphStyles}>
                    Babubhai Jagjivandas Hall, Juhu, Mumbai is a lovely venue to host your wedding and reception ceremony. It is located near the Prithvi Theatre and a close distance from Vile Parle Station which makes it easily accessible for all to reach there. Babubhai Jagjivandas Mumbai, Maharashtra serves scrumptious pure vegetarian food to their guests. The decor team takes care of the decoration for your big day.
                    Babubhai Jagjivandas Hall has a lush green lawn that can accommodate a huge crowd for an open-air outdoor evening reception. It also has a banquet hall for having an indoor wedding or reception ceremony. BJ Hall Vile Parle has an inviting ambiance which makes everyone feel welcomed. The elegant décor of the venue makes it an ideal option for a grand wedding. Host your events at BJ Hall Mumbai to make them outstanding. Ticking all the right boxes, this one must certainly be on your cards.
                </div>
                { !isOpen ? (
                    <button onClick={toggleReadMore} className="read-more-btn text-gray-700 font-semibold text-lg">Read More</button>
                ) : (
                    <button onClick={toggleReadMore} className="read-less-btn text-gray-700 font-semibold text-lg">Read Less</button>
                )   
                }
            </div>
            <EditComponent />
        </div>
    )
}
