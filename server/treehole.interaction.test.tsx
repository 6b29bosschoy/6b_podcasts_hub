/** @vitest-environment jsdom */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));
const mutate = vi.fn();
let mutationResult: "success" | "error" | "pending" = "success";
let latestMutationOptions: { onSuccess: () => void; onError?: () => void } | null = null;

vi.mock("../client/src/lib/trpc", () => ({
  trpc: {
    submission: {
      submitTreehole: {
        useMutation: (options: { onSuccess: () => void; onError?: () => void }) => {
          const [isPending, setIsPending] = React.useState(false);
          latestMutationOptions = options;
          return {
          mutate: (input: unknown) => {
            mutate(input);
            setIsPending(true);
            if (mutationResult === "success") options.onSuccess();
            else if (mutationResult === "error") options.onError?.();
          },
          isPending,
        };
        },
      },
    },
  },
}));

vi.mock("../client/src/hooks/useSEO", () => ({ useSEO: () => undefined }));
vi.mock("sonner", () => ({ toast: { success: toastSuccess } }));
vi.mock("wouter", () => ({
  Link: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => <a {...props}>{children}</a>,
  useLocation: () => ["/treehole", vi.fn()],
}));
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
import { TREEHOLE_DEEP_INTERPRETATIONS, TREEHOLE_PUBLIC_PERMISSIONS } from "../shared/treehole";

afterEach(() => {
  mutate.mockReset();
  toastSuccess.mockReset();
  mutationResult = "success";
  latestMutationOptions = null;
  window.history.replaceState(null, "", "/treehole");
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
    await user.click(screen.getByLabelText(/我已閱讀並同意/));
  }

  it("renders every select and radio option with explicit field identifiers and accessible labels", () => {
    render(<TreeholeSubmission />);

    [
      ["性別", "treehole-gender", "gender"],
      ["年齡層", "treehole-age", "ageGroup"],
      ["感情狀態", "treehole-status", "relationshipStatus"],
      ["呢個問題困擾咗你幾耐", "treehole-duration", "problemDuration"],
    ].forEach(([label, id, name]) => {
      const control = screen.getByLabelText(new RegExp(label)) as HTMLSelectElement;
      expect(control.id).toBe(id);
      expect(control.name).toBe(name);
      expect(control.getAttribute("autocomplete")).toBe("off");
    });

    [
      ["publicPermission", TREEHOLE_PUBLIC_PERMISSIONS],
      ["deepInterpretation", TREEHOLE_DEEP_INTERPRETATIONS],
    ].forEach(([groupName, options]) => {
      (options as readonly string[]).forEach((option, index) => {
        const radio = screen.getByLabelText(option) as HTMLInputElement;
        expect(radio.type).toBe("radio");
        expect(radio.name).toBe(groupName);
        expect(radio.id).toBe(`treehole-${groupName}-${index}`);
        expect(radio.getAttribute("autocomplete")).toBe("off");
        const label = document.querySelector(`label[for="${radio.id}"]`);
        expect(label?.getAttribute("for")).toBe(radio.id);
        expect(label?.textContent).toContain(option);
      });
    });
  });

  it("renders every basic, privacy and conditional input with a direct label association", () => {
    render(<TreeholeSubmission />);
    const expectControl = (id: string, name: string) => {
      const control = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      expect(control, `${id} should render`).not.toBeNull();
      expect(control?.getAttribute("name")).toBe(name);
      expect(control?.getAttribute("autocomplete")).toBe("off");
      const label = document.querySelector(`label[for="${id}"]`);
      expect(label, `${id} should have an associated label`).not.toBeNull();
      expect(label?.getAttribute("for")).toBe(id);
    };

    expectControl("treehole-website", "website");
    expectControl("treehole-nickname", "nickname");
    expectControl("treehole-story", "content");
    expectControl("treehole-consent", "privacyConsent");

    fireEvent.click(screen.getByLabelText("想，可以聯絡我"));
    expectControl("treehole-contact", "contactMethod");
  });

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

  it("shows a spinner and busy disabled state while submitting, then triggers a success toast", async () => {
    mutationResult = "pending";
    const user = userEvent.setup();
    render(<TreeholeSubmission />);

    await fillRequiredTreehole(user);
    const submit = screen.getByRole("button", { name: "投入樹窿 🌳" });
    await waitFor(() => expect((submit as HTMLButtonElement).disabled).toBe(false));
    await user.click(submit);

    await waitFor(() => {
      const pendingButton = screen.getByRole("button", { name: /投入緊樹窿/ });
      expect(pendingButton.getAttribute("aria-busy")).toBe("true");
      expect((pendingButton as HTMLButtonElement).disabled).toBe(true);
    });

    latestMutationOptions?.onSuccess();
    await waitFor(() => expect(screen.getByTestId("treehole-success")).toBeTruthy());
    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith("心事已投入樹窿", expect.objectContaining({ description: expect.any(String) })));
  });
});
