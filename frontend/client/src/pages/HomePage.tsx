import Card from "../components/homePage/Card.tsx";
import hallProps from "../constants/dummyHallData.tsx";

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
            name={hallProp.name}
            place={"1, N S Rd Number 3, Navpada, JVPD Scheme, lorem ipsum dolor sit amet "}
            numPhotos={hallProp.images.length}
            minCapacity={hallProp.capacity}
            maxCapacity={hallProp.capacity}
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
