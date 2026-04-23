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
  Image as ImageIcon,
  X,
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

const pages = [
  { key: "home", label: "Home Page" },
  { key: "ezerguard-od", label: "EzerGuard-OD" },
  { key: "ezerguard-military", label: "EzerGuard-Military" },
  { key: "ezerguard-cd", label: "EzerGuard-CD" },
];

const odStepImages = [
  { key: "od_step_0", label: "Step 1: Device Activation" },
  { key: "od_step_1", label: "Step 2: Audio Alarm Monitoring" },
  { key: "od_step_2", label: "Step 3: Mild Electrical Stimulation" },
  { key: "od_step_3", label: "Step 4: First Naloxone Dose" },
  { key: "od_step_4", label: "Step 5: Sustained Stimulation" },
  { key: "od_step_5", label: "Step 6: Second Dose If Needed" },
];

type ActiveSection = "content" | "team" | "page-images";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("content");
  const [activePage, setActivePage] = useState("home");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && activeSection === "content") fetchContent(activePage);
  }, [activePage, user, activeSection]);

  useEffect(() => {
    if (user && activeSection === "team") fetchTeamMembers();
  }, [user, activeSection]);

  useEffect(() => {
    if (user && activeSection === "page-images") fetchPageImages();
  }, [user, activeSection]);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
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

  async function fetchTeamMembers() {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setTeamMembers(data.members || []);
  }

  async function fetchPageImages() {
    const res = await fetch("/api/admin/page-images?page=ezerguard-od");
    const data = await res.json();
    setPageImages(data.images || []);
  }

  async function updateContent(id: string, value: string) {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value }),
      });
      if (res.ok) {
        setSaved(id);
        setTimeout(() => setSaved(null), 2000);
      }
    } finally {
      setSaving(null);
    }
  }

  async function addTeamMember() {
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "New Team Member",
        title: "Title",
        bio: "",
      }),
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
    } finally {
      setSaving(null);
    }
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

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        await updateTeamMember(memberId, { photo_url: data.url });
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } finally {
      setUploading(null);
    }
  }

  async function deleteTeamPhoto(memberId: string) {
    if (!confirm("Remove this photo?")) return;
    await updateTeamMember(memberId, { photo_url: null });
  }

  async function uploadStepImage(imageKey: string, file: File) {
    setUploading(imageKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "step-images");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        await fetch("/api/admin/page-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: "ezerguard-od",
            image_key: imageKey,
            image_url: data.url,
          }),
        });
        fetchPageImages();
      } else {
        const err = await uploadRes.json();
        alert(err.error || "Upload failed");
      }
    } finally {
      setUploading(null);
    }
  }

  async function deleteStepImage(imageKey: string) {
    if (!confirm("Remove this step image? The image area on the website will collapse back to a minimal bar.")) return;
    await fetch("/api/admin/page-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "ezerguard-od",
        image_key: imageKey,
      }),
    });
    fetchPageImages();
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
      {/* Admin Header */}
      <header className="bg-brand-dark text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={20} className="text-brand-secondary" />
            <div>
              <h1 className="font-heading font-semibold text-sm">
                Ezer Admin Portal
              </h1>
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
                    onClick={() => {
                      setActiveSection("content");
                      setActivePage(page.key);
                    }}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-heading transition-colors ${
                      activeSection === "content" && activePage === page.key
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
                  onClick={() => setActiveSection("team")}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-heading transition-colors ${
                    activeSection === "team"
                      ? "bg-brand-secondary/10 text-brand-secondary font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Users size={16} />
                  Team Members
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("page-images")}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-heading transition-colors ${
                    activeSection === "page-images"
                      ? "bg-brand-secondary/10 text-brand-secondary font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ImageIcon size={16} />
                  Step Images
                </button>
              </li>
            </ul>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {activeSection === "content" ? (
              <ContentEditor
                activePage={activePage}
                pages={pages}
                content={content}
                saving={saving}
                saved={saved}
                updateContent={updateContent}
              />
            ) : activeSection === "team" ? (
              <TeamEditor
                teamMembers={teamMembers}
                saving={saving}
                saved={saved}
                uploading={uploading}
                addTeamMember={addTeamMember}
                updateTeamMember={updateTeamMember}
                deleteTeamMember={deleteTeamMember}
                uploadPhoto={uploadPhoto}
                deletePhoto={deleteTeamPhoto}
              />
            ) : (
              <StepImageEditor
                pageImages={pageImages}
                uploading={uploading}
                uploadStepImage={uploadStepImage}
                deleteStepImage={deleteStepImage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({
  activePage,
  pages,
  content,
  saving,
  saved,
  updateContent,
}: {
  activePage: string;
  pages: { key: string; label: string }[];
  content: ContentItem[];
  saving: string | null;
  saved: string | null;
  updateContent: (id: string, value: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-dark">
          {pages.find((p) => p.key === activePage)?.label} Content
        </h2>
      </div>

      {content.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <FileText size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-heading font-semibold text-gray-500">
            No content entries yet
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Run the SQL schema in Supabase to seed initial content, or
            connect your Supabase project.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="font-heading font-semibold text-sm text-brand-dark">
                    {item.label || item.section_key}
                  </label>
                  <span className="ml-2 text-xs text-gray-400 font-mono">
                    {item.section_key}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {saved === item.id && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={14} />
                      Saved
                    </span>
                  )}
                  <button
                    onClick={() =>
                      updateContent(
                        item.id,
                        (
                          document.getElementById(
                            `input-${item.id}`
                          ) as HTMLTextAreaElement
                        )?.value || item.value
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
    </>
  );
}

function TeamEditor({
  teamMembers,
  saving,
  saved,
  uploading,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadPhoto,
  deletePhoto,
}: {
  teamMembers: TeamMember[];
  saving: string | null;
  saved: string | null;
  uploading: string | null;
  addTeamMember: () => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  uploadPhoto: (memberId: string, file: File) => void;
  deletePhoto: (memberId: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-dark">
          Team Members
        </h2>
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
          <h3 className="font-heading font-semibold text-gray-500">
            No team members yet
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Add team members to display on the website.
          </p>
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
              onDeletePhoto={deletePhoto}
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
  onDeletePhoto,
}: {
  member: TeamMember;
  saving: string | null;
  saved: string | null;
  uploading: string | null;
  onUpdate: (id: string, updates: Partial<TeamMember>) => void;
  onDelete: (id: string) => void;
  onUploadPhoto: (memberId: string, file: File) => void;
  onDeletePhoto: (memberId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-6">
        {/* Photo area */}
        <div className="shrink-0">
          <div
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-secondary/50 transition-colors relative group"
            onClick={() => !member.photo_url && fileInputRef.current?.click()}
          >
            {member.photo_url ? (
              <>
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePhoto(member.id);
                    }}
                    className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
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
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Upload
                    </span>
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

        {/* Fields */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {saved === member.id && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle size={14} />
                  Saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nameEl = document.getElementById(
                    `team-name-${member.id}`
                  ) as HTMLInputElement;
                  const titleEl = document.getElementById(
                    `team-title-${member.id}`
                  ) as HTMLInputElement;
                  const bioEl = document.getElementById(
                    `team-bio-${member.id}`
                  ) as HTMLTextAreaElement;
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-medium text-gray-500 mb-1">
                Name
              </label>
              <input
                id={`team-name-${member.id}`}
                type="text"
                defaultValue={member.name}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-medium text-gray-500 mb-1">
                Title
              </label>
              <input
                id={`team-title-${member.id}`}
                type="text"
                defaultValue={member.title}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-medium text-gray-500 mb-1">
              Bio / Education
            </label>
            <textarea
              id={`team-bio-${member.id}`}
              defaultValue={member.bio}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepImageEditor({
  pageImages,
  uploading,
  uploadStepImage,
  deleteStepImage,
}: {
  pageImages: PageImage[];
  uploading: string | null;
  uploadStepImage: (imageKey: string, file: File) => void;
  deleteStepImage: (imageKey: string) => void;
}) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getImageUrl = (key: string) => {
    const img = pageImages.find((p) => p.image_key === key);
    return img?.image_url || null;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-dark">
            EzerGuard-OD Step Images
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload images for each step in the &quot;How It Works&quot; section. When no image is uploaded, the area appears as a condensed bar on the website.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {odStepImages.map((step) => {
          const imageUrl = getImageUrl(step.key);
          const isUploading = uploading === step.key;

          return (
            <div
              key={step.key}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center gap-5">
                {/* Thumbnail / Upload zone */}
                <div
                  className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-secondary/50 transition-colors shrink-0 relative group"
                  onClick={() => fileRefs.current[step.key]?.click()}
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={step.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStepImage(step.key);
                          }}
                          className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={12} className="text-white" />
                        </button>
                      </div>
                    </>
                  ) : isUploading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-brand-secondary border-t-transparent rounded-full" />
                  ) : (
                    <div className="text-center">
                      <Upload size={16} className="mx-auto text-gray-300" />
                      <span className="text-[9px] text-gray-400 mt-0.5 block">
                        Upload
                      </span>
                    </div>
                  )}
                </div>

                <input
                  ref={(el) => { fileRefs.current[step.key] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadStepImage(step.key, file);
                    e.target.value = "";
                  }}
                />

                {/* Label and status */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-brand-dark">
                    {step.label}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {imageUrl ? (
                      <span className="text-green-600">Image uploaded</span>
                    ) : (
                      "No image — area condensed on website"
                    )}
                  </p>
                </div>

                {/* Actions */}
                {imageUrl && (
                  <button
                    onClick={() => deleteStepImage(step.key)}
                    className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-heading font-semibold text-red-600 hover:bg-red-100 transition-colors shrink-0"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
