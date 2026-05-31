import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";

export function HostRecruitment() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    interests: "",
    experience: "",
    hostType: "guest" as "host" | "co-host" | "guest",
    introduction: "",
    longTermInterest: false,
    otherShowsInterest: "",
    contactMethod: "",
    availableTime: "",
    privacyConsent: false,
  });

  const submitMutation = trpc.host.submit.useMutation({
    onSuccess: () => {
      // Success handled in form submission
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitMutation.mutateAsync({
        name: formData.name,
        interests: formData.interests,
        experience: formData.experience || undefined,
        hostType: formData.hostType,
        introduction: formData.introduction,
        longTermInterest: formData.longTermInterest,
        otherShowsInterest: formData.otherShowsInterest || undefined,
        contactMethod: formData.contactMethod,
        availableTime: formData.availableTime,
        privacyConsent: formData.privacyConsent,
      });

      // Show success message
      alert("申請已提交！感謝你的興趣，我們會盡快聯絡你。");

      // Reset form
      setFormData({
        name: "",
        interests: "",
        experience: "",
        hostType: "guest",
        introduction: "",
        longTermInterest: false,
        otherShowsInterest: "",
        contactMethod: "",
        availableTime: "",
        privacyConsent: false,
      });

      // Redirect after 2 seconds
      setTimeout(() => setLocation("/"), 2000);
    } catch (error: any) {
      const errorMsg = error?.message || "請檢查表單並重試";
      alert(`提交失敗：${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            🎙️ 主持招募
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            加入路邊電台，與我們一起探索玄學、兩性、運動、人物訪談等話題
          </p>
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg p-6 text-left">
            <h2 className="text-lg font-semibold text-cyan-300 mb-3">節目簡介</h2>
            <p className="text-gray-200 mb-4">
              我們準備開一個全新玄學節目，會邀請唔同玄學家上嚟分享風水、命理、塔羅、占星、感情運、事業運、財運等話題。
            </p>
            <p className="text-gray-200">
              節目唔需要你本身係玄學專家，最重要係對題材有興趣、出鏡自然、願意一齊傾同問問題。
            </p>
          </div>
        </div>

        {/* Application Form */}
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-cyan-300">申請表單</CardTitle>
            <CardDescription className="text-gray-400">
              請簡單回覆以下幾樣嘢，幫助我們更了解你
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  1. 點稱呼？ <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="你的名字或暱稱"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              {/* 2. Interests */}
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-gray-200">
                  2. 對邊類玄學話題最有興趣？除玄學外，會唔會有其他話題有興趣？{" "}
                  <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="interests"
                  placeholder="例如：風水、命理、塔羅、兩性關係等"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500 min-h-20"
                  required
                />
              </div>

              {/* 3. Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-gray-200">
                  3. 有冇拍片、直播、主持、KOL 或出鏡經驗？如有可以 send link。
                </Label>
                <Textarea
                  id="experience"
                  placeholder="例如：YouTube 頻道連結、Instagram 帳號等（可選）"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500 min-h-20"
                />
              </div>

              {/* 4. Host Type */}
              <div className="space-y-2">
                <Label htmlFor="hostType" className="text-gray-200">
                  4. 你覺得自己適合做主持、嘉賓主持，定單集嘉賓？{" "}
                  <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.hostType} onValueChange={(v) => setFormData({ ...formData, hostType: v as "host" | "co-host" | "guest" })}>
                  <SelectTrigger className="bg-slate-700/50 border-purple-400/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-400/30">
                    <SelectItem value="host">主持</SelectItem>
                    <SelectItem value="co-host">共同主持</SelectItem>
                    <SelectItem value="guest">單集嘉賓</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 5. Introduction */}
              <div className="space-y-2">
                <Label htmlFor="introduction" className="text-gray-200">
                  5. 可以簡單介紹下自己嗎？例如你係邊個、點解對玄學節目有興趣、最想問玄學家咩問題。{" "}
                  <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="introduction"
                  placeholder="請簡單介紹自己..."
                  value={formData.introduction}
                  onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500 min-h-24"
                  required
                />
              </div>

              {/* 6. Long-term Interest */}
              <div className="space-y-2">
                <Label className="text-gray-200">
                  6. 如果之後合作感覺好，你會唔會有興趣長期參與？
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="longTermInterest"
                    checked={formData.longTermInterest}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, longTermInterest: checked as boolean })
                    }
                    className="border-purple-400/50"
                  />
                  <Label htmlFor="longTermInterest" className="text-gray-300 cursor-pointer">
                    有興趣長期參與
                  </Label>
                </div>
              </div>

              {/* 7. Other Shows Interest */}
              <div className="space-y-2">
                <Label htmlFor="otherShowsInterest" className="text-gray-200">
                  7. 除咗玄學，我哋亦有兩性討論、運動健身、人物訪談等節目，你會唔會都有興趣？
                </Label>
                <Textarea
                  id="otherShowsInterest"
                  placeholder="例如：兩性討論、運動健身、人物訪談等（可選）"
                  value={formData.otherShowsInterest}
                  onChange={(e) => setFormData({ ...formData, otherShowsInterest: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500 min-h-16"
                />
              </div>

              {/* 8. Contact Method */}
              <div className="space-y-2">
                <Label htmlFor="contactMethod" className="text-gray-200">
                  8. 聯絡方法。IG account / WhatsApp。 <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="contactMethod"
                  placeholder="例如：@instagram_handle 或 WhatsApp: +852 1234 5678"
                  value={formData.contactMethod}
                  onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              {/* 9. Available Time */}
              <div className="space-y-2">
                <Label htmlFor="availableTime" className="text-gray-200">
                  9. 能夠拍攝時間 星期1至日 14:00 到18:00 19:00到23:00{" "}
                  <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="availableTime"
                  placeholder="例如：星期一至五 14:00-18:00, 19:00-23:00"
                  value={formData.availableTime}
                  onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                  className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-500 min-h-16"
                  required
                />
              </div>

              {/* Privacy Disclaimer */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-orange-300">🔒 隱私聲明</h3>
                <p className="text-sm text-gray-300">
                  你提供的資訊只會用於內部評估及聯絡用途。我們承諾妥善保護你的個人資訊，不會用於其他商業用途，亦不會分享予第三方。
                </p>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacyConsent"
                    checked={formData.privacyConsent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, privacyConsent: checked as boolean })
                    }
                    className="border-orange-400/50 mt-1"
                  />
                  <Label htmlFor="privacyConsent" className="text-gray-300 cursor-pointer text-sm">
                    我同意上述隱私聲明 <span className="text-red-400">*</span>
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !formData.privacyConsent}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "提交中..." : "提交申請"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-300">常見問題</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Q: 一定要係玄學專家嗎？</h4>
              <p className="text-gray-400">
                A: 唔一定。最重要係對題材有興趣、出鏡自然、願意一齊傾同問問題。我們會提供支持同指導。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Q: 申請後幾時會收到回覆？</h4>
              <p className="text-gray-400">
                A: 我們會盡快審核申請，通常會喺一個星期內聯絡你。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Q: 有冇酬勞？</h4>
              <p className="text-gray-400">
                A: 這取決於合作形式。我們歡迎進一步討論細節。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Q: 我的資訊會點樣被處理？</h4>
              <p className="text-gray-400">
                A: 你的資訊只會用於聯絡同評估合作。我們唔會存留永久紀錄，保護你的隱私。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HostRecruitment;
