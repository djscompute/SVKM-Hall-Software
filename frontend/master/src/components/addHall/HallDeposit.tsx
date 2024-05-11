import { EachHallType } from "../../types/Hall.types";

type props = {
  securityDeposit: number;
  setHallData: React.Dispatch<React.SetStateAction<EachHallType>>;
};

function HallDeposit({ securityDeposit, setHallData }: props) {
  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setHallData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-between items-center rounded w-full gap-5">
      <h1 className="">Security Deposit Amount (in Rs.) :</h1>
      <input
        name="securityDeposit"
        value={securityDeposit}
        onChange={handleChange}
        className="w-full bg-gray-300 p-3 rounded h-auto"
      />
    </div>
  );
}

export default HallDeposit;
