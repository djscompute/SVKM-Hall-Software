import Card from "../components/Card";
import hallProps from "../constants/hallProps.tsx";

function HomePage() {
  //getAllHalls
  // hallProps
  
  return (
    <div className="flex flex-wrap justify-around">
      {hallProps.map((hallProp) => (
          <Card
            key={hallProp._id} 
            id={hallProp._id}
            img={hallProp.images[0]}
            tagline={hallProp.about}
            name={hallProp.name}
            place={hallProp.location.desc1}
            numPhotos={hallProp.images.length}
            minCapacity={hallProp.partyArea[1].capacity}
            maxCapacity={hallProp.partyArea[0].capacity}
            price={hallProp.pricing}
          />
        )
      )}
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  );
}

export default HomePage;
