import { TextContent } from "./services/state"

// Could this be a tsx file?
export const texts = {

  followYourInterest: {
    title: "Follow Your Interest",
    body: (
      <>
        He took calligraphy class at the college, learned about serif and sans serif typefaces, and varying the space between different letter combinations, which influenced the design of their first computers
      </>
    ),
    link: "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says",
  },
  steve: {
    title: "Steve Wozniak Atari Era",
    body: (
      <>
        “Before Apple, in 1975, Steve Wozniak developed the first prototype for classic Atari game Breakout.” -Game Developer May 4, 2007
      </>
    ),
    link: "https://www.gamedeveloper.com/design/woz-was-here---steve-wozniak-on-his-gaming-past",
  },
  fathersWord: {
    title: "His Father’s Words",
    body: (
      <>
        “Steve Jobs’ dad, Paul Jobs, who was a mechanic, told him he has to make the back of the fence as good looking as the front, even if nobody will see it” - 60 Minutes Archive
      </>
    ),
    link: "https://www.youtube.com/watch?si=46qdBF5eJ5qWFGc4&v=c-JkrlVhs_0&feature=youtu.be",
  },
  awards: {
    title: "Awards Celebrate US Medal",
    body: (
      <>
        In 1985, Steve Jobs and Steve Wozniak were awarded the US National Medal of Technology 
      </>
    ),
    link: "https://computerhistory.org/profile/steve-wozniak/",
  },
  macLaunch: {
    title: "The Launch Macintosh",
    body: (
      <>
        First Macintosh was released on January 24, 1984, introduced as “... contains 64 kilobytes of read-only memory (ROM), built-in Lisa Technology” - Regis McKenna Public Relations
      </>
    ),
    link: "https://web.stanford.edu/dept/SUL/sites/mac/primary/docs/pr1.html",
  },
  ronald: {
    title: "The Quiet 3rd Ronald W.",
    body: (
      <>
        Wayne worked as a senior designer at Atari and met Steve Wozniak and
        Steve Jobs, which led to his involvement in founding Apple.
        <br />
        -Isaacson, Walter (2011). Steve Jobs. Simon & Schuster
      </>
    ),
    link: "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781982176860",
  }
} satisfies Record<string, TextContent>
