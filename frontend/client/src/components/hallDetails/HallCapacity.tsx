

type props = {
  capacity: string;
  seating: string;
};

export default function HallCapacity({
  capacity,
  seating,
}: props) {
  const updateHallCapacity = () => {
    // this function will be used to update the capacity in the hall ka database.
    // then refetch the hall ka info.
    // baadmai likhenge isko.
    // once backend is setup
  };




  return (
    <div className=" flex justify-center items-center my-10">
    <div className="about-hall flex justify-between bg-blue-100 w-3/4 py-5 px-7 rounded-lg">
      <div className="flex flex-col w-11/12">
        <h2 className="font-bold text-xl mb-3">Capacity and Seating</h2>
        <div className="flex ">
          <p>Capacity : </p>
          <p>{capacity}</p>
        </div>
        <div className="flex ">
          <p>Seating : </p>
          <p>{seating}</p>
        </div>
      </div>
      
    </div>
    </div>
  );
}
