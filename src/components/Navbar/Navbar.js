import spacexLogo from "../../assets/images/spacex.png";

export default function Navbar() {
  return (
    <div className="d-flex justify-content-center border-bottom py-2">
      <img src={spacexLogo} alt="spacex logo" className="img-fluid w-25" />
    </div>
  );
}
