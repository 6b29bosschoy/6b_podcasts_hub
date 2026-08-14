import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const readClient = (path: string) => readFileSync(join(root, "client/src", path), "utf-8");

describe("公開表格私隱與欄位結構", () => {
  const forms = [
    ["pages/Booking.tsx", [
      ["booking-name", "name", "name"], ["booking-email", "email", "email"], ["booking-phone", "phone", "tel"], ["booking-contact-method", "preferredContactMethod", "off"], ["booking-date", "preferredDate", "off"], ["booking-time", "preferredTime", "off"], ["booking-message", "message", "off"], ["booking-consent", "privacyConsent", "off"],
    ]],
    ["pages/Contact.tsx", [
      ["contact-inquiry-type", "inquiryType", "off"], ["contact-name", "name", "name"], ["contact-email", "email", "email"], ["contact-phone", "phone", "tel"], ["contact-subject", "subject", "off"], ["contact-message", "message", "off"], ["contact-consent", "privacyConsent", "off"],
    ]],
    ["pages/Partnership.tsx", [
      ["partnership-name", "name", "name"], ["partnership-company", "company", "organization"], ["partnership-email", "email", "email"], ["partnership-phone", "phone", "tel"], ["partnership-collab-type", "collabType", "off"], ["partnership-message", "message", "off"], ["partnership-consent", "privacyConsent", "off"],
    ]],
    ["pages/TreeholeSubmission.tsx", [
      ["treehole-website", "website", "off"], ["treehole-nickname", "nickname", "off"], ["treehole-story", "content", "off"], ["treehole-contact", "contactMethod", "off"], ["treehole-consent", "privacyConsent", "off"],
    ]],
  ] as const;

  it.each(forms)("%s 的每個明列公開欄位都有 id、name、autocomplete 及對應 label", (path, fields) => {
    const source = readClient(path);
    expect(source).toContain('method="post"');
    expect(source).toContain('data-clarity-mask="true"');
    expect(source).toContain("privacyConsent");
    expect(source).toContain("/privacy");
    fields.forEach(([id, name, autoComplete]) => {
      expect(source).toContain(`id="${id}"`);
      expect(source).toContain(`htmlFor="${id}"`);
      expect(source).toContain(`name="${name}"`);
      expect(source).toContain(`autoComplete="${autoComplete}"`);
    });
  });

  it("樹窿表格會遮罩 Clarity 記錄，並且不把成功資料寫入網址", () => {
    const source = readClient("pages/TreeholeSubmission.tsx");
    expect(source).toContain('data-clarity-mask="true"');
    expect(source).toContain('setLocation("/treehole/success")');
    expect(source).not.toContain('params.set("submitted", "1")');
    [
      ['id="treehole-gender"', 'name="gender"'],
      ['id="treehole-age"', 'name="ageGroup"'],
      ['id="treehole-status"', 'name="relationshipStatus"'],
      ['id="treehole-duration"', 'name="problemDuration"'],
    ].forEach(([id, name]) => {
      expect(source).toContain(id);
      expect(source).toContain(name);
    });
    expect(source).toContain("name={name}");
    expect(source).toContain('autoComplete="off"');
    expect(source).toContain('const groupName = label.startsWith("接唔接受") ? "publicPermission" : "deepInterpretation"');
    expect(source).toContain('id = `treehole-${groupName}-${index}`');
    expect(source).toContain('name={groupName}');
    expect(source).toContain('htmlFor={id}');
  });

  it("分析層只接受白名單參數，排除所有表格個人資料欄位", () => {
    const source = readClient("lib/analytics.ts");
    expect(source).toContain("SAFE_EVENT_KEYS");
    expect(source).toContain("sanitiseEventParams");
    ["name", "email", "phone", "message", "content", "contactMethod", "birthday"].forEach((privateField) => {
      expect(source).not.toMatch(new RegExp(`SAFE_EVENT_KEYS[\\s\\S]*[\"']${privateField}[\"']`));
    });
  });

  it("每種表格均有無個資 query string 的獨立成功頁路由", () => {
    const source = readClient("App.tsx");
    ["/booking/success", "/contact/success", "/partnership/success", "/treehole/success"].forEach((route) => expect(source).toContain(route));
  });
});
