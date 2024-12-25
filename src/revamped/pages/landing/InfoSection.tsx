import Divider from "../../components/Divider";
import landingPageInfoSectionImg1 from "../../assets/images/landing-page-info-section-1.webp";
import landingPageInfoSectionImg2 from "../../assets/images/landing-page-info-section-2.webp";
import landingPageInfoSectionImg3 from "../../assets/images/landing-page-info-section-3.webp";

export default function InfoSection() {
  return (
    <section className="info-section">
      <div className="parts-wrapper">
        <div className="part top-part">
          <div className="left-light">
            <div className="light-part"></div>
            <div className="light"></div>
          </div>

          <div className="container">
            <div className="content">
              <div className="h2-wrapper">
                <h2 className="text">Prove Your Work with In-Game Businesses</h2>
                <h2 className="text-stroke">Prove Your Work with In-Game Businesses</h2>
                <h2 className="text-shadow">Prove Your Work with In-Game Businesses</h2>
              </div>
              
              <p>
                The core of Bit Fighters is a Bitcoin powered, player driven economy. Players can own buildings
                and businesses to trade services and products.<br />
                <br />
                Building owners have an opportunity to earn passively
                while the player community takes advantage of the value made available.
              </p>
              <br />
              <p>Players visit user generated rooms and pay owners for services such as...</p>
              <br />
              <ul>
                <li>* Mines: discover prizes and resources!</li>
                <li>* Factories: refine and craft resources!</li>
                <li>* Shops: conveintly purchase items to give yourself an edge in the arena!</li>
                <li>* Clubs: support your favorite players and compete to win prizes!</li>
                <li>* So much more!: gyms, cloning, cars, banks, insurance, farms, arcades, galleries, etc.!</li>
              </ul>
            </div>
            <div className="img-wrapper">
              <img src={landingPageInfoSectionImg1} alt="" />
            </div>
          </div>
        </div>

        <img src={landingPageInfoSectionImg3} alt="" className="img-3" />

        <div className="part bottom-part">
          <div className="container">
            <div className="img-wrapper">
              <img src={landingPageInfoSectionImg2} alt="" />
            </div>
            <div className="content">
              <div className="h2-wrapper">
                <h2 className="text">Get VIP access with a 1k Club Card!</h2>
                <h2 className="text-stroke">
                Get VIP access with a 1k Club Card
                </h2>
                <h2 className="text-shadow">
                Get VIP access with a 1k Club Card
                </h2>
              </div>
              <p>
                Only 1,000 1k Club Cards will ever exist. Each card provides players special features you can't 
                get anywhere else!
              </p>
              <br />
              <p>
                VIP card holders gain access to special prize events, in-game perks, and access to the Bit Fighters 
                development server to provide
                early feedback on new game features!
              </p>
            </div>
          </div>
          <div className="right-light">
            <div className="light"></div>
            <div className="light-part"></div>
          </div>
        </div>
      </div>
      <Divider />
    </section>
  );
}
