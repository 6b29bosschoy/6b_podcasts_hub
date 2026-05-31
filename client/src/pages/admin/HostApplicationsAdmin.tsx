import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChevronDown, ChevronUp, ExternalLink, Mail, MessageCircle } from "lucide-react";

type HostApplicationStatus = "pending" | "contacted" | "rejected" | "archived";

const STATUS_CONFIG: Record<HostApplicationStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "待處理", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  contacted: { label: "已聯絡", color: "text-green-400", bgColor: "bg-green-500/20" },
  rejected: { label: "已拒絕", color: "text-red-400", bgColor: "bg-red-500/20" },
  archived: { label: "已存檔", color: "text-gray-400", bgColor: "bg-gray-500/20" },
};

const HOST_TYPE_CONFIG: Record<string, string> = {
  host: "主持",
  "co-host": "共同主持",
  guest: "單集嘉賓",
};

export function HostApplicationsAdmin() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<HostApplicationStatus | "all">("all");

  const { data, isLoading, refetch } = trpc.host.adminList.useQuery();
  const updateStatusMutation = trpc.host.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const applications = data?.items || [];

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const handleStatusChange = async (id: number, newStatus: HostApplicationStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
  };

  const parseTimeSlots = (slotsJson: string | null) => {
    if (!slotsJson) return [];
    try {
      return JSON.parse(slotsJson);
    } catch {
      return [];
    }
  };

  const parsePhotos = (photosJson: string | null) => {
    if (!photosJson) return [];
    try {
      return JSON.parse(photosJson);
    } catch {
      return [];
    }
  };

  const formatTimeSlots = (slotsJson: string | null) => {
    const slots = parseTimeSlots(slotsJson);
    if (slots.length === 0) return "未選擇";

    const slotsByDay: Record<string, string[]> = {};
    slots.forEach((slot: { day: string; timeSlot: string }) => {
      if (!slotsByDay[slot.day]) slotsByDay[slot.day] = [];
      slotsByDay[slot.day].push(slot.timeSlot);
    });

    return Object.entries(slotsByDay)
      .map(([day, times]) => `${day} ${times.join(", ")}`)
      .join("; ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🎙️ 主持申請管理</h2>
          <p className="text-gray-400 text-sm mt-1">
            共 {applications.length} 份申請，待處理 {applications.filter((a) => a.status === "pending").length} 份
          </p>
        </div>

        {/* Filter */}
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as HostApplicationStatus | "all")}>
          <SelectTrigger className="w-40 bg-slate-700/50 border-purple-400/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-purple-400/30">
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value="pending">待處理</SelectItem>
            <SelectItem value="contacted">已聯絡</SelectItem>
            <SelectItem value="rejected">已拒絕</SelectItem>
            <SelectItem value="archived">已存檔</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">沒有符合條件的申請</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => {
            const isExpanded = expandedId === app.id;
            const statusConfig = STATUS_CONFIG[app.status as HostApplicationStatus];
            const photos = parsePhotos(app.hostPhotos);

            return (
              <Card
                key={app.id}
                className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden"
              >
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  className="w-full text-left hover:bg-slate-700/30 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white truncate">{app.name}</h3>
                          <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                            {HOST_TYPE_CONFIG[app.hostType]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>📅 {new Date(app.createdAt).toLocaleDateString("zh-HK")}</span>
                          {app.acceptCommercial && (
                            <span className="text-green-400">💼 接受商業合作</span>
                          )}
                          {app.longTermInterest && (
                            <span className="text-cyan-400">🔄 長期參與</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <CardContent className="pt-0 space-y-6 border-t border-purple-500/20">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">聯絡方法</p>
                        <p className="text-white font-mono text-sm break-all">{app.contactMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">主持類型</p>
                        <p className="text-white">{HOST_TYPE_CONFIG[app.hostType]}</p>
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">興趣話題</p>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{app.interests}</p>
                    </div>

                    {/* Introduction */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">自我介紹</p>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{app.introduction}</p>
                    </div>

                    {/* Experience */}
                    {app.experience && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">相關經驗</p>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{app.experience}</p>
                      </div>
                    )}

                    {/* Other Shows Interest */}
                    {app.otherShowsInterest && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">其他節目興趣</p>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{app.otherShowsInterest}</p>
                      </div>
                    )}

                    {/* Available Time Slots */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">可用時間段</p>
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-purple-400/20">
                        <p className="text-gray-300 text-sm">{formatTimeSlots(app.availableTimeSlots)}</p>
                      </div>
                    </div>

                    {/* Photos */}
                    {photos.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">上傳照片 ({photos.length}/5)</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {photos.map((photo: string, idx: number) => (
                            <a
                              key={idx}
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative"
                            >
                              <img
                                src={photo}
                                alt={`Photo ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-purple-400/30 group-hover:border-cyan-400/50 transition-colors"
                              />
                              <ExternalLink className="absolute top-1 right-1 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded p-0.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="pt-4 border-t border-purple-500/20 space-y-3">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">更新狀態</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {(["pending", "contacted", "rejected", "archived"] as const).map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={app.status === status ? "default" : "outline"}
                            onClick={() => handleStatusChange(app.id, status)}
                            disabled={updateStatusMutation.isPending}
                            className={
                              app.status === status
                                ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                                : "border-purple-400/30 text-gray-300 hover:bg-slate-700/50"
                            }
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              STATUS_CONFIG[status].label
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-purple-500/20 flex gap-2">
                      {app.contactMethod.includes("@") && (
                        <a
                          href={`https://www.instagram.com/${app.contactMethod.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-purple-300 text-sm transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          IG
                        </a>
                      )}
                      {app.contactMethod.includes("WhatsApp") && (
                        <a
                          href={`https://wa.me/${app.contactMethod.match(/\d+/)?.[0] || ""}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 text-sm transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HostApplicationsAdmin;
