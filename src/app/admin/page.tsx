"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  LogOut,
  FileText,
  Shield,
  CheckCircle,
  Users,
  Plus,
  Trash2,
  Upload,
  X,
  Box,
} from "lucide-react";

interface ContentItem {
  id: string;
  section_key: string;
  page: string;
  content_type: string;
  value: string;
  label: string;
  sort_order: number;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  sort_order: number;
}

interface PageImage {
  id: string;
  page: string;
  image_key: string;
  image_url: string | null;
}

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface MediaZone {
  key: string;
  label: string;
  hint?: string;
}

const pages = [
  { key: "home", label: "Home Page" },
  { key: "ezerguard-od", label: "EzerGuard-OD" },
  { key: "ezerguard-military", label: "EzerGuard-Military" },
  { key: "ezerguard-cd", label: "EzerGuard-CD" },
];

const mediaZones: Record<string, MediaZone[]> = {
  home: [
    { key: "home_hero_media", label: "Hero Section Media", hint: "Background image, video, or GIF for the hero section" },
    { key: "home_mission_media", label: "Mission Section Media", hint: "Visual for the mission section" },
    { key: "home_technology_media", label: "Technology Section Media", hint: "Device showcase for How It Works" },
    { key: "home_investor_media", label: "Investor CTA Media", hint: "Visual for the investment section" },
  ],
  "ezerguard-od": [
    { key: "od_hero_media", label: "Product Hero Media", hint: "Hero image or video for EzerGuard-OD page" },
    { key: "od_step_0", label: "Step 1 — Device Activation" },
    { key: "od_step_1", label: "Step 2 — Audio Alarm Monitoring" },
    { key: "od_step_2", label: "Step 3 — Mild Electrical Stimulation" },
    { key: "od_step_3", label: "Step 4 — First Naloxone Dose" },
    { key: "od_step_4", label: "Step 5 — Sustained Stimulation" },
    { key: "od_step_5", label: "Step 6 — Second Dose If Needed" },
  ],
  "ezerguard-military": [
    { key: "military_hero_media", label: "Product Hero Media", hint: "Hero image or video for EzerGuard-Military page" },
    { key: "military_device_media", label: "Device Image", hint: "Photo of the EzerGuard-Military device (shown in threat context section)" },
    { key: "military_cap_0", label: "Capability 1 — Detection & Classification" },
    { key: "military_cap_1", label: "Capability 2 — Verification of Exposure" },
    { key: "military_cap_2", label: "Capability 3 — Delivery of Antidote" },
    { key: "military_cap_3", label: "Capability 4 — NETT WARRIOR Integration" },
    { key: "military_cap_4", label: "Capability 5 — Location & Evacuation" },
    { key: "military_cap_5", label: "Capability 6 — Dual Threat Response" },
  ],
  "ezerguard-cd": [
    { key: "cd_hero_media", label: "Product Hero Media", hint: "Hero image or video for EzerGuard-CD page" },
    { key: "cd_device_media", label: "Device Image", hint: "Photo of the EzerGuard-CD device (shown in civilian protection section)" },
    { key: "cd_cap_0", label: "Step 1 — Civil Defense Alert" },
    { key: "cd_cap_1", label: "Step 2 — Device Configuration" },
    { key: "cd_cap_2", label: "Step 3 — Auditory/Vibratory Monitoring" },
    { key: "cd_cap_3", label: "Step 4 — Electrical Stimulation" },
    { key: "cd_cap_4", label: "Step 5 — Antidote Delivery" },
    { key: "cd_cap_5", label: "Step 6 — Location & Communication" },
  ],
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>("home");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    if (!user) return;
    if (activeView === "team") {
      fetchTeamMembers();
    } else {
      fetchContent(activeView);
      fetchPageImages(activeView);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, user]);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) { router.push("/admin/login"); return; }
      const data = await res.json();
      setUser(data.user);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  async function fetchContent(page: string) {
    const res = await fetch(`/api/admin/content?page=${page}`);
    const data = await res.json();
    setContent(data.content || []);
  }

  async function fetchPageImages(page: string) {
    const res = await fetch(`/api/admin/page-images?page=${page}`);
    const data = await res.json();
    setPageImages(data.images || []);
  }

  async function fetchTeamMembers() {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setTeamMembers(data.members || []);
  }

  async function updateContent(id: string, value: string) {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value }),
      });
      if (res.ok) { setSaved(id); setTimeout(() => setSaved(null), 2000); }
    } finally { setSaving(null); }
  }

  async function uploadMedia(imageKey: string, file: File) {
    setUploading(imageKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", activeView);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        alert(err.error || "Upload failed");
        return;
      }
      const data = await uploadRes.json();
      await fetch("/api/admin/page-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: activeView, image_key: imageKey, image_url: data.url }),
      });
      fetchPageImages(activeView);
    } finally { setUploading(null); }
  }

  async function deleteMedia(imageKey: string) {
    if (!confirm("Remove this media file? It will no longer appear on the website.")) return;
    await fetch("/api/admin/page-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: activeView, image_key: imageKey }),
    });
    fetchPageImages(activeView);
  }

  async function addTeamMember() {
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Team Member", title: "Title", bio: "" }),
    });
    if (res.ok) fetchTeamMembers();
  }

  async function updateTeamMember(id: string, updates: Partial<TeamMember>) {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setSaved(id);
        setTimeout(() => setSaved(null), 2000);
        fetchTeamMembers();
      }
    } finally { setSaving(null); }
  }

  async function deleteTeamMember(id: string) {
    if (!confirm("Delete this team member?")) return;
    await fetch("/api/admin/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTeamMembers();
  }

  async function uploadPhoto(memberId: string, file: File) {
    setUploading(memberId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "team-photos");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        await updateTeamMember(memberId, { photo_url: data.url });
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } finally { setUploading(null); }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand-dark text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={20} className="text-brand-secondary" />
            <div>
              <h1 className="font-heading font-semibold text-sm">Ezer Admin Portal</h1>
              <p className="text-xs text-white/50">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-56 shrink-0">
            <h2 className="font-heading text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Pages
            </h2>
            <ul className="space-y-1">
              {pages.map((page) => (
                <li key={page.key}>
                  <button
                    onClick={() => setActiveView(page.key)}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-heading transition-colors ${
                      activeView === page.key
                        ? "bg-brand-secondary/10 text-brand-secondary font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FileText size={16} />
                    {page.label}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="font-heading text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-3">
              Sections
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveView("team")}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-heading transition-colors ${
                    activeView === "team"
                      ? "bg-brand-secondary/10 text-brand-secondary font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Users size={16} />
                  Team Members
                </button>
              </li>
            </ul>
          </nav>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {activeView === "team" ? (
              <TeamEditor
                teamMembers={teamMembers}
                saving={saving}
                saved={saved}
                uploading={uploading}
                addTeamMember={addTeamMember}
                updateTeamMember={updateTeamMember}
                deleteTeamMember={deleteTeamMember}
                uploadPhoto={uploadPhoto}
              />
            ) : (
              <PageEditor
                pageKey={activeView}
                pageLabel={pages.find((p) => p.key === activeView)?.label || activeView}
                content={content}
                pageImages={pageImages}
                zones={mediaZones[activeView] || []}
                saving={saving}
                saved={saved}
                uploading={uploading}
                updateContent={updateContent}
                uploadMedia={uploadMedia}
                deleteMedia={deleteMedia}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Page Editor ─────────────────────────────────────────────────────────────

function PageEditor({
  pageLabel,
  content,
  pageImages,
  zones,
  saving,
  saved,
  uploading,
  updateContent,
  uploadMedia,
  deleteMedia,
}: {
  pageKey: string;
  pageLabel: string;
  content: ContentItem[];
  pageImages: PageImage[];
  zones: MediaZone[];
  saving: string | null;
  saved: string | null;
  uploading: string | null;
  updateContent: (id: string, value: string) => void;
  uploadMedia: (key: string, file: File) => void;
  deleteMedia: (key: string) => void;
}) {
  const getImageUrl = (key: string) =>
    pageImages.find((p) => p.image_key === key)?.image_url || null;

  return (
    <div className="space-y-10">
      {/* Text Content */}
      <div>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-brand-dark">{pageLabel}</h2>
          <p className="mt-1 text-sm text-gray-400">Edit text content and upload media for this page.</p>
        </div>

        {content.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
            <FileText size={36} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-heading font-semibold text-gray-500">No text content entries yet</h3>
            <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
              Run the seed SQL in Supabase to populate editable text fields for this page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="font-heading font-semibold text-sm text-brand-dark">
                      {item.label || item.section_key}
                    </label>
                    <span className="ml-2 text-xs text-gray-400 font-mono">{item.section_key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {saved === item.id && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle size={14} /> Saved
                      </span>
                    )}
                    <button
                      onClick={() =>
                        updateContent(
                          item.id,
                          (document.getElementById(`input-${item.id}`) as HTMLTextAreaElement | HTMLInputElement)?.value || item.value
                        )
                      }
                      disabled={saving === item.id}
                      className="flex items-center gap-1 rounded-lg bg-brand-secondary px-3 py-1.5 text-xs font-heading font-semibold text-white hover:bg-brand-primary transition-colors disabled:opacity-50"
                    >
                      <Save size={12} />
                      {saving === item.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
                {item.content_type === "rich_text" ? (
                  <textarea
                    id={`input-${item.id}`}
                    defaultValue={item.value}
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 resize-y"
                  />
                ) : (
                  <input
                    id={`input-${item.id}`}
                    type="text"
                    defaultValue={item.value}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Zones */}
      {zones.length > 0 && (
        <div>
          <h3 className="font-display text-xl font-bold text-brand-dark mb-1">Page Media</h3>
          <p className="text-sm text-gray-400 mb-6">
            Upload images, videos, GIFs, or 3D models (GLB/GLTF). Files appear on the website automatically when uploaded.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {zones.map((zone) => (
              <MediaZoneCard
                key={zone.key}
                zone={zone}
                imageUrl={getImageUrl(zone.key)}
                uploading={uploading === zone.key}
                onUpload={(file) => uploadMedia(zone.key, file)}
                onDelete={() => deleteMedia(zone.key)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Media Zone Card ─────────────────────────────────────────────────────────

function MediaZoneCard({
  zone,
  imageUrl,
  uploading,
  onUpload,
  onDelete,
}: {
  zone: MediaZone;
  imageUrl: string | null;
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const ext = imageUrl?.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  const isVideo = ["mp4", "webm", "mov", "avi"].includes(ext);
  const is3D = ["glb", "gltf"].includes(ext);
  const fileTypeBadge = is3D ? "3D MODEL" : isVideo ? "VIDEO" : imageUrl ? "IMAGE" : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 pr-2">
          <h4 className="font-heading font-semibold text-sm text-brand-dark">{zone.label}</h4>
          {zone.hint && <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{zone.hint}</p>}
        </div>
        {fileTypeBadge && (
          <span
            className={`shrink-0 text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              is3D ? "bg-purple-100 text-purple-600" : isVideo ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
            }`}
          >
            {fileTypeBadge}
          </span>
        )}
      </div>

      <div
        className="relative rounded-xl border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-brand-secondary/50 transition-colors"
        style={{ aspectRatio: "16/9" }}
        onClick={() => !imageUrl && !uploading && fileRef.current?.click()}
      >
        {imageUrl ? (
          <>
            {isVideo ? (
              <video src={imageUrl} className="w-full h-full object-cover" muted />
            ) : is3D ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <Box size={32} className="text-brand-secondary/40" />
                <p className="text-xs text-gray-400 mt-2 font-heading">3D Model Uploaded</p>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-brand-secondary underline mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View file
                </a>
              </div>
            ) : (
              <img src={imageUrl} alt={zone.label} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-black/55 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-heading font-semibold text-brand-dark hover:bg-gray-100 transition-colors"
              >
                <Upload size={12} /> Replace
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500 rounded-lg text-xs font-heading font-semibold text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </>
        ) : uploading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-brand-secondary/5">
            <div className="animate-spin w-6 h-6 border-2 border-brand-secondary border-t-transparent rounded-full" />
            <p className="text-xs text-gray-400 mt-2 font-heading">Uploading...</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center mb-3">
              <Upload size={18} className="text-brand-secondary" />
            </div>
            <p className="text-xs font-heading font-medium text-gray-500">Click to upload</p>
            <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
              Images · Video (MP4, WebM, MOV) · 3D (GLB, GLTF) · GIF
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime,.glb,.gltf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />

      {imageUrl && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-green-600 font-heading font-medium flex items-center gap-1">
            <CheckCircle size={11} /> File uploaded
          </span>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-[11px] text-brand-secondary hover:text-brand-primary transition-colors font-heading"
          >
            Change file
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Team Editor ─────────────────────────────────────────────────────────────

function TeamEditor({
  teamMembers,
  saving,
  saved,
  uploading,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadPhoto,
}: {
  teamMembers: TeamMember[];
  saving: string | null;
  saved: string | null;
  uploading: string | null;
  addTeamMember: () => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  uploadPhoto: (memberId: string, file: File) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-dark">Team Members</h2>
          <p className="mt-1 text-sm text-gray-400">Manage team profiles and photos displayed on the website.</p>
        </div>
        <button
          onClick={addTeamMember}
          className="flex items-center gap-2 rounded-lg bg-brand-secondary px-4 py-2 text-sm font-heading font-semibold text-white hover:bg-brand-primary transition-colors"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <Users size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-heading font-semibold text-gray-500">No team members yet</h3>
          <p className="mt-2 text-sm text-gray-400">Add team members to display on the website.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              saving={saving}
              saved={saved}
              uploading={uploading}
              onUpdate={updateTeamMember}
              onDelete={deleteTeamMember}
              onUploadPhoto={uploadPhoto}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TeamMemberCard({
  member,
  saving,
  saved,
  uploading,
  onUpdate,
  onDelete,
  onUploadPhoto,
}: {
  member: TeamMember;
  saving: string | null;
  saved: string | null;
  uploading: string | null;
  onUpdate: (id: string, updates: Partial<TeamMember>) => void;
  onDelete: (id: string) => void;
  onUploadPhoto: (memberId: string, file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-6">
        <div className="shrink-0">
          <div
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-secondary/50 transition-colors relative group"
            onClick={() => !member.photo_url && fileInputRef.current?.click()}
          >
            {member.photo_url ? (
              <>
                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdate(member.id, { photo_url: null }); }}
                    className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                {uploading === member.id ? (
                  <div className="animate-spin w-6 h-6 border-2 border-brand-secondary border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Upload size={18} className="mx-auto text-gray-300" />
                    <span className="text-[10px] text-gray-400 mt-1 block">Photo</span>
                  </>
                )}
              </div>
            )}
          </div>
          {member.photo_url && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full text-[10px] text-brand-secondary hover:text-brand-primary transition-colors text-center"
            >
              Change Photo
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadPhoto(member.id, file);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-end gap-2">
            {saved === member.id && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle size={14} /> Saved
              </span>
            )}
            <button
              onClick={() => {
                const nameEl = document.getElementById(`team-name-${member.id}`) as HTMLInputElement;
                const titleEl = document.getElementById(`team-title-${member.id}`) as HTMLInputElement;
                const bioEl = document.getElementById(`team-bio-${member.id}`) as HTMLTextAreaElement;
                onUpdate(member.id, {
                  name: nameEl?.value || member.name,
                  title: titleEl?.value || member.title,
                  bio: bioEl?.value || member.bio,
                });
              }}
              disabled={saving === member.id}
              className="flex items-center gap-1 rounded-lg bg-brand-secondary px-3 py-1.5 text-xs font-heading font-semibold text-white hover:bg-brand-primary transition-colors disabled:opacity-50"
            >
              <Save size={12} />
              {saving === member.id ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-heading font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-medium text-gray-500 mb-1">Name</label>
              <input
                id={`team-name-${member.id}`}
                type="text"
                defaultValue={member.name}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-medium text-gray-500 mb-1">Title</label>
              <input
                id={`team-title-${member.id}`}
                type="text"
                defaultValue={member.title}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-medium text-gray-500 mb-1">Bio / Education</label>
            <p className="text-[11px] text-gray-400 mb-1.5 leading-relaxed">
              One entry per line. Use <span className="font-mono bg-gray-100 px-1 rounded">Degree — Institution</span> format (e.g. <span className="font-mono bg-gray-100 px-1 rounded">MD — Stanford University</span>).
            </p>
            <textarea
              id={`team-bio-${member.id}`}
              defaultValue={member.bio}
              rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
