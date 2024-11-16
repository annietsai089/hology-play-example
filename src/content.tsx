import { TextContent } from "./services/state"

// Could this be a tsx file?
export const texts = {
  test: {
    title: "The Quiet 3rd Ronald W.",
    body: (
      <>
        Wayne worked as a senior designer at Atari and met Steve Wozniak and
        Steve Jobs, which led to his involvement in founding Apple.
        <br />
        -Isaacson, Walter (2011). Steve Jobs. Simon & Schuster
      </>
    ),
    link: "https://google.com",
  },
} satisfies Record<string, TextContent>
