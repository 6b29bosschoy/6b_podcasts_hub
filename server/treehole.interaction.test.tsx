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
      submit: {
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
  it("caps story text, requires privacy acknowledgement, submits anonymously, then shows success feedback", async () => {
    const user = userEvent.setup();
    render(<TreeholeSubmission />);

    const textarea = screen.getByLabelText("想講嘅故事") as HTMLTextAreaElement;
    const submit = screen.getByRole("button", { name: "匿名送出故事" }) as HTMLButtonElement;

    expect(submit.disabled).toBe(true);
    expect(textarea.maxLength).toBe(1000);

    await user.click(textarea);
    await user.type(textarea, "我想匿名講一個感情故事。");
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    checkbox.focus();
    expect(document.activeElement).toBe(checkbox);
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    await waitFor(() => expect((screen.getByRole("button", { name: "匿名送出故事" }) as HTMLButtonElement).disabled).toBe(false));
    const readySubmit = screen.getByRole("button", { name: "匿名送出故事" });
    readySubmit.focus();
    expect(document.activeElement).toBe(readySubmit);

    await user.keyboard("{Enter}");

    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
      nickname: "匿名",
      isAnonymous: true,
      imageUrls: [],
      content: "我想匿名講一個感情故事。",
    }));
    expect(screen.getByTestId("treehole-success")).toBeTruthy();
    expect(screen.getByText("你嘅故事已經收好。")).toBeTruthy();
  });

  it("exposes a screen-reader-visible error prompt when keyboard submission cannot reach the server", async () => {
    mutationResult = "error";
    const user = userEvent.setup();
    render(<TreeholeSubmission />);

    const textarea = screen.getByLabelText("想講嘅故事");
    await user.click(textarea);
    await user.type(textarea, "我想匿名講一個感情故事。");
    await user.click(screen.getByRole("checkbox"));
    const readySubmit = screen.getByRole("button", { name: "匿名送出故事" });
    await waitFor(() => expect((readySubmit as HTMLButtonElement).disabled).toBe(false));
    readySubmit.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("而家未能送出投稿"));
  });
});
