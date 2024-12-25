import Divider from "../../components/Divider";
import landingPageAboutSectionBoxingRingImg from "../../assets/images/landing-page-about-section-boxing-ring.webp";
import landingPageAboutSectionLeftCoinsImg from "../../assets/images/landing-page-about-section-left-coins.webp";
import landingPageAboutSectionRightCoinsImg from "../../assets/images/landing-page-about-section-right-coins.webp";
import landingPageAboutSectionCharacterImg1 from "../../assets/images/landing-page-about-section-character-1.gif";
import landingPageAboutSectionCharacterImg2 from "../../assets/images/landing-page-about-section-character-2.gif";
import fight from "../../assets/images/fight.gif";
import landingPageAboutSectionImg1 from "../../assets/images/landing-page-about-section-1.webp";
import landingPageAboutSectionImg2 from "../../assets/images/landing-page-about-section-2.webp";

export default function AboutSection() {
  return (
    <section className="about-section">
      <Divider hasHangingLight />

      <div className="container">
        <div className="h1-wrapper">
          <h1 className="text">
            The World's 1st and Only,  <br />Real-Time Action MMO,  <br />Bitcoin Party Game!
          </h1>

          <h1 className="text-stroke">
            The World's 1st and Only, <br /> Real-Time Action MMO,  <br />Bitcoin Party Game!
          </h1>
          <h1 className="text-shadow">
            The World's 1st and Only, <br /> Real-Time Action MMO, <br /> Bitcoin Party Game!
          </h1>
        </div>
        <p>
          Bit Fighters is a zany universe where you collaborate, compete, & immerse yourself in a player
          built economy.
          <br />
          <br />
          Players own the in-game businesses and prove their work in cities ruled by players.
          <br />
          The core economy loop provides
          players many different opportunities to create value, offering an equal amount of unique gameplay.<br />
          <br />
          You never have to fight. But you can if you want to.
        </p>

        <div className="boxing-ring-wrapper">
          <img
            src={landingPageAboutSectionBoxingRingImg}
            alt=""
            className="boxing-ring-img"
          />

          <div className="characters-wrapper">
          <img
              src={fight}
              alt=""
              className="fight"
            />
            {/* <img
              src={landingPageAboutSectionCharacterImg1}
              alt=""
              className="character-1"
            />

            <img
              src={landingPageAboutSectionCharacterImg2}
              alt=""
              className="character-2"
            /> */}
          </div>

          <img
            src={landingPageAboutSectionLeftCoinsImg}
            alt=""
            className="left-coins-img"
          />

          <img
            src={landingPageAboutSectionRightCoinsImg}
            alt=""
            className="right-coins-img"
          />
        </div>
        <p>
          Take it easy and socialize, play mini-games, or compete head to head for as much as you're willing to wager in winner
          take-all deathmatch battles!
          <br />
          <br />
          Run a business, lead a gang, create economy routes with other players and build entire empiries by owning cities.
          <br />
          <br />
          It's your turn to win!
        </p>
      </div>

      <img src={landingPageAboutSectionImg1} alt="" className="img-1" />
      <img src={landingPageAboutSectionImg2} alt="" className="img-2" />
    </section>
  );
}
