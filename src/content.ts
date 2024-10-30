import { TextContent } from "./services/state";


// Could this be a tsx file?
export const texts = {
  test: {
    title: "This is a title",
    body: "This is the body",
    link: "https://google.com"
  }
} satisfies Record<string, TextContent>