type props = {
  pricing: string | undefined;
};

export default function HallPricing({ pricing}: props) {

  return (
    <div className=" flex justify-center items-center my-10">
    <div className="about-hall flex justify-between bg-blue-100 w-3/4 py-5 px-7 rounded-lg">
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-xl mb-3">Pricing</h2>
        {pricing ? (
          <p className="text-lg">{pricing}</p>
        ) : (
          <p>No pricing set for this hall. Edit to set the Price</p>
        )}
      </div>
      
    </div>
    </div>
  );
}
