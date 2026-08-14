/** @vitest-environment jsdom */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mutate = vi.fn();
let mutationResult: "success" | "error" = "success";

vi.mock("../client/src/lib/trpc", () => ({
  trpc: {
    submission: {
      submitTreehole: {
        useMutation: (options: { onSuccess: () => void }) => ({
          mutate: (input: unknown) => {
            mutate(input);
            if (mutationResult === "success") options.onSuccess();
            else (options as { onError?: () => void }).onError?.();
          },
          isPending: false,
        }),
      },
    },
  },
}));

vi.mock("../client/src/hooks/useSEO", () => ({ useSEO: () => undefined }));
vi.mock("wouter", () => ({ Link: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => <a {...props}>{children}</a> }));
vi.mock("framer-motion", () => {
  const componentCache = new Map<string, React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>>();
  const motion = new Proxy({}, {
    get: (_target, tag: string) => {
      const existing = componentCache.get(tag);
      if (existing) return existing;
      const Component = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: unknown }>((props, ref) => {
        const { initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...domProps } = props;
        return React.createElement(tag, { ...domProps, ref }, props.children);
      });
      componentCache.set(tag, Component);
      return Component;
    },
  });
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion,
    useReducedMotion: () => true,
  };
});

import TreeholeSubmission from "../client/src/pages/TreeholeSubmission";

afterEach(() => {
  mutate.mockReset();
  mutationResult = "success";
  cleanup();
});

describe("感情樹窿表單互動", () => {
  const story = "我同佢拍咗兩年拖，最近佢成日同舊同學單獨食飯，又話我諗得太多。我想知仲應唔應該繼續，亦放唔低呢段關係。";

  async function fillRequiredTreehole(user: ReturnType<typeof userEvent.setup>, needsContact = false) {
    await user.type(screen.getByLabelText(/你想我哋點稱呼你/), "觀塘K小姐");
    await user.selectOptions(screen.getByLabelText(/感情狀態/), "拍拖中");
    await user.click(screen.getByRole("button", { name: "放唔低" }));
    await user.type(screen.getByLabelText(/你嘅感情問題/), story);
    await user.click(screen.getByLabelText("可以，匿名處理就得"));
    await user.click(screen.getByLabelText(needsContact ? "想，可以聯絡我" : "暫時唔需要"));
    if (needsContact) await user.type(await screen.findByLabelText(/你嘅聯絡方式/), "IG: @kwuntongk");
  }

  it("enforces revised required fields, reveals contact conditionally, submits anonymously, then shows success feedback", async () => {
    const user = userEvent.setup();
    render(<TreeholeSubmission />);

    const textarea = screen.getByLabelText(/你嘅感情問題/) as HTMLTextAreaElement;
    const submit = screen.getByRole("button", { name: "投入樹窿 🌳" }) as HTMLButtonElement;

    expect(submit.disabled).toBe(true);
    expect(textarea.maxLength).toBe(1000);

    await fillRequiredTreehole(user, true);
    expect(screen.getByLabelText(/你嘅聯絡方式/)).toBeTruthy();
    await waitFor(() => expect((screen.getByRole("button", { name: "投入樹窿 🌳" }) as HTMLButtonElement).disabled).toBe(false));
    const readySubmit = screen.getByRole("button", { name: "投入樹窿 🌳" });
    readySubmit.focus();
    expect(document.activeElement).toBe(readySubmit);

    await user.keyboard("{Enter}");

    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      nickname: "觀塘K小姐",
      relationshipStatus: "拍拖中",
      topicTags: ["放唔低"],
      deepInterpretation: "想，可以聯絡我",
      contactMethod: "IG: @kwuntongk",
      content: story,
    }));
    expect(screen.getByTestId("treehole-success")).toBeTruthy();
    expect(screen.getByText("你嘅心事已經投入樹窿。")).toBeTruthy();
  });

  it("exposes a screen-reader-visible error prompt when keyboard submission cannot reach the server", async () => {
    mutationResult = "error";
    const user = userEvent.setup();
    render(<TreeholeSubmission />);

    await fillRequiredTreehole(user);
    const readySubmit = screen.getByRole("button", { name: "投入樹窿 🌳" });
    await waitFor(() => expect((readySubmit as HTMLButtonElement).disabled).toBe(false));
    readySubmit.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("而家未能投入樹窿"));
  });
});
