import { useState } from "react";
import Divider from "../../components/Divider";
import landingPageAboutSectionImg1 from "../../assets/images/landing-page-about-section-1.webp";
import landingPageAboutSectionImg2 from "../../assets/images/landing-page-about-section-2.webp";
import FAQ from "../../components/FAQ";

interface IFAQ {
  question: string;
  answer: string;
}

export default function FAQsSection() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const faqs: IFAQ[] = [
    {
      question: "What?!",
      answer:
        "Bit Fighters is an easy to access universe, full of characters and action packed memories. You've never seen anything like this before!",
      },
    {
      question: "Why?!",
      answer: `Commit to a game and community committed to you.
      Yoked to the power of Bitcoin, Bit Fighters will only continue to grow. 
      Make your mark in the world's biggest BTC player-driven economy, designed to reward value providing users.`,
    },
    {
      question: "When?!",
      answer:
        "NOW! The game is live and the development team continues to ship updates for the growing community.",
    },
    {
      question: "Who?!",
      answer:
        "Bit Fighters is created by 2 of the zaniest characters you will find, Zach & Vicky. Ping them in the discord if you want to chat!",
    },
    {
      question: "Where?!",
      answer: `Bit Fighters is a light-weight browser game and can be played on almost any device with an internet connection! 
        What are you waiting for?!`
    },
    {
      question: "How?!",
      answer:
        `Bit Fighters has an insanely long runway of Bitcoin that will keep the game servers running forever. And the development team cannot stop building.
        Players are incentivized to check it out via web2 gaming portal ramps and promotional prize events.
         Players stick around to explore and engage with user generated cities, in-game events, novel progression system, and best of all, each other.`,
      },
  ];

  return (
    <section className="faqs-section">
      <Divider hasHangingLight />

      <div className="container">
        <div className="h2-wrapper">
          <h2 className="text">
            Frequently Asked <br /> Questions...
          </h2>

          <h2 className="text-stroke">
            Frequently Asked <br /> Questions...
          </h2>

          <h2 className="text-shadow">
            Frequently Asked <br /> Questions...
          </h2>
        </div>

        <div className="faqs-wrapper">
          {faqs.map((faq, index) => {
            return (
              <FAQ
                key={index}
                isActive={index === activeFaqIndex}
                setIsActive={() => {
                  if (activeFaqIndex === index) {
                    setActiveFaqIndex(null);
                  } else {
                    setActiveFaqIndex(index);
                  }
                }}
                question={faq.question}
                answer={faq.answer}
              />
            );
          })}
        </div>
      </div>

      <img src={landingPageAboutSectionImg2} alt="" className="img-1" />
      <img src={landingPageAboutSectionImg1} alt="" className="img-2" />
    </section>
  );
}
