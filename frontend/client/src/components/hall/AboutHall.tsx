import { EachHallType } from "../../types/Hall.types";

function AboutHall({ data }: { data: EachHallType }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="text-base sm:text-lg md:text-2xl font-medium">
        About Venue
      </h1>
      <div className="ml-8 mt-1">
        <ul className="list-disc text-gray-600">
        {data.about.map((about, index) => (
            <li key={index}>
                {about}
            </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default AboutHall;
