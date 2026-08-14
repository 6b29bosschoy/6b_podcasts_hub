/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mutation = { mutate: vi.fn(), isPending: false };

vi.mock("../client/src/lib/trpc", () => ({
  trpc: {
    booking: { create: { useMutation: () => mutation } },
    contact: { submit: { useMutation: () => mutation } },
  },
}));
vi.mock("../client/src/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("../client/src/hooks/useSEO", () => ({ useSEO: vi.fn() }));
vi.mock("../client/src/components/JsonLd", () => ({ JsonLd: () => null, SITE_URL: "https://6bpodcasts.com", buildBreadcrumbSchema: () => ({}) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("wouter", () => ({ Link: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => <a {...props}>{children}</a>, useLocation: () => ["/", vi.fn()] }));

import Booking from "../client/src/pages/Booking";
import Contact from "../client/src/pages/Contact";
import Partnership from "../client/src/pages/Partnership";

afterEach(() => cleanup());

type ControlSpec = readonly [id: string, name: string, autoComplete: string];

function expectControls(specs: readonly ControlSpec[]) {
  specs.forEach(([id, name, autoComplete]) => {
    const control = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    expect(control, `${id} should render`).not.toBeNull();
    expect(control?.getAttribute("name")).toBe(name);
    expect(control?.getAttribute("autocomplete")).toBe(autoComplete);
    const label = document.querySelector(`label[for="${id}"]`);
    expect(label, `${id} should have an associated label`).not.toBeNull();
    expect(label?.getAttribute("for")).toBe(id);
  });
}

describe("公開表格實際欄位渲染", () => {
  it("預約表格每個 input、select、textarea 均有明確標籤與自動填寫策略", () => {
    render(<Booking />);
    expectControls([
      ["booking-name", "name", "name"], ["booking-email", "email", "email"], ["booking-phone", "phone", "tel"], ["booking-contact-method", "preferredContactMethod", "off"], ["booking-date", "preferredDate", "off"], ["booking-time", "preferredTime", "off"], ["booking-message", "message", "off"], ["booking-consent", "privacyConsent", "off"],
    ]);
  });

  it("聯絡表格每個 input、select、textarea 均有明確標籤與自動填寫策略", () => {
    render(<Contact />);
    expectControls([
      ["contact-inquiry-type", "inquiryType", "off"], ["contact-name", "name", "name"], ["contact-email", "email", "email"], ["contact-phone", "phone", "tel"], ["contact-subject", "subject", "off"], ["contact-message", "message", "off"], ["contact-consent", "privacyConsent", "off"],
    ]);
  });

  it("合作表格每個 input、select、textarea 均有明確標籤與自動填寫策略", () => {
    render(<Partnership />);
    expectControls([
      ["partnership-name", "name", "name"], ["partnership-company", "company", "organization"], ["partnership-email", "email", "email"], ["partnership-phone", "phone", "tel"], ["partnership-collab-type", "collabType", "off"], ["partnership-message", "message", "off"], ["partnership-consent", "privacyConsent", "off"],
    ]);
  });
});
