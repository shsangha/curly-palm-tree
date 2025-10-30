import Image from "next/image";

interface AboutSection {
  header: string;
  caption: string;
  imageSrc: string;
}

export default function About() {
  const sections: AboutSection[] = [
    {
      header: "PANDEMONAEON RISING!",
      caption: "If you are reading this congratulations you are an early participant in this project. Sudosix Research is building the magical architecture in anticipation for the coming aeon where technology and magic blend into one. Lets start with a brief introduction to the nature of our work.",
      imageSrc: "/MENACE_ABOUT_1_p.png",
    },
    {
      header: "ALIGNMENT IS ABUNDANCE",
      caption: "The physical world we understand is a shadow of the Etheric Plane - a pliable membrane of manifestation. This is where probabilities manifest into the physical reality around you and houses the truest version of yourself. You've surely noticed the luckiest and most fortunate among us operating with power in this field, because their physical body/will is more in line with their individual consciousness - the true self beyond thought.",
      imageSrc: "/MENACE_ABOUT_2_p.png",
    },
    {
      header: "TULPAMANCY IS THE MINDS BEST FRIEND",
      caption: "Your conscious mind is your biggest barrier from self actualization. The conscious 'lust of result' destroys the magical effectiveness of your will. Magic employs many 'sleight of mind' methods to bypass this hinderance, one of which is especially potent: the practice of tulpamancy. Traditionally these thought-forms are created through a ritual where they are programmed to serve a specific purpose then destroyed when the work is complete. Sudosix Research invites a contemporary approach utilizing immutable ledgers as a hosting mechanism for the conjuring, programming, feeding and dissolving of these etheric assistants.",
      imageSrc: "/MENACE_ABOUT_3_p.png",
    },
    {
      header: "MENACES GET RESULTS",
      caption: "MENACES are programmable tulpas—semi-autonomous psychic constructs bound to their creators. Each MENACE is conjured through ritualized intention-setting, embedded with a singular directive, and anchored on-chain within the Ether. Once activated, your Menace begins to operate on the Etheric plane on your behalf carrying out the fulfillment of its embedded will. MENACES can be programmed to do anything you wish! bring you exciting opportunities, provide protection, attract wealth etc.",
      imageSrc: "/MENACE_ABOUT_4_p.png",
    },
    {
      header: "BUILT DIFFERENT",
      caption: "Unlike traditional tulpas, a MENACE is not bound to any particular space—they exists in shared the global (and future interplanetary) immoral infrastructure of the Ethereum ledger. Every transaction, every act of observation, feeds it. Its life is the motion of data and desire.",
      imageSrc: "/MENACE_ABOUT_5_p.png",
    },
    {
      header: "DO NO HARM",
      caption: "Disclaimer: Sudosix Research assumes no responsibility for any phenomena—psychic, economic, or interpersonal—arising from your interaction with our magical infrastructure. All magic carries consequence and unrighteous acts in the Ether will attract the attention of beings that can harm you. Should your MENACE turn on you or cause undue trouble, burn the token to dissolve the link and nullify the tulpa.",
      imageSrc: "/MENACE_ABOUT_6_p.png",
    },
  ];

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <main className="w-[600px] min-w-[300px] flex flex-col gap-12">
        {/* Welcome Section */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[3rem] leading-none text-[#c0c0c0]">
            WELCOME!
          </h2>
          <p className="text-[1.25rem] leading-relaxed">
            If you are reading this congratulations you are an early participant in this project. Sudosix Research is building the magical architecture in anticipation for the coming aeon where technology and magic blend into one. Lets start with a brief introduction to the nature of our work.
          </p>
        </section>

        {sections.map((section, index) => (
          <section key={index} className="flex flex-col gap-6">
            <h2 className="text-[3rem] leading-none text-[#c0c0c0]">
              {section.header}
            </h2>
            <p className="text-[1.25rem] leading-relaxed">
              {section.caption}
            </p>
            <Image
              src={section.imageSrc}
              alt={section.header}
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </section>
        ))}
      </main>
    </div>
  );
}
