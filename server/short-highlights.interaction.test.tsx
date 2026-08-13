/** @vitest-environment jsdom */
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ShortHighlightCard, type HighlightItem } from "../client/src/components/ShortHighlightsSection";

const featuredVideo: HighlightItem = {
  id: "xZOWb5stFwA",
  title: "極品姊弟戀",
  url: "https://www.youtube.com/watch?v=xZOWb5stFwA",
  duration: "0:55",
  poster: "/manus-storage/xZOWb5stFwA_1e8d4bcf.webp",
  cropAnchor: "50% 50%",
  reviewNote: "已核對：主講人面部與字幕均在直式安全區。",
};

afterEach(() => cleanup());

describe("ShortHighlightCard interaction cue", () => {
  it("shows the play prompt, accepts keyboard focus, and fires a safe external-link click", () => {
    render(<ShortHighlightCard video={featuredVideo} />);

    const link = screen.getByRole("link", { name: "在 YouTube 觀看：極品姊弟戀" });
    expect(screen.getByText("觀看精華")).toBeTruthy();
    expect(link.getAttribute("href")).toBe(featuredVideo.url);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.className).toContain("active:scale-[0.98]");
    expect(link.className).toContain("focus-visible:ring-2");

    link.focus();
    expect(document.activeElement).toBe(link);

    let wasClicked = false;
    link.addEventListener("click", (event) => {
      wasClicked = true;
      event.preventDefault();
    });
    fireEvent.click(link);

    expect(wasClicked).toBe(true);
  });
});
