import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

export default function editComponent() {
  return (
    <div className="hall-info-edit h-fit relative">
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="show-on-hover h-6 cursor-pointer opacity-50 hover:opacity-100"
      />
      {/* <h2 className="hidden text-sm rounded-md font-bold absolute left-7 -top-1 p-1">
        Edit
      </h2> */}
    </div>
  );
}
