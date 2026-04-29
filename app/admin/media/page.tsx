"use client";

import { ChangeEvent, useEffect, useState } from "react";

type MediaItem = {
  _id?: string;
  title: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
  beforeDriveFileId?: string;
  afterDriveFileId?: string;
  serviceType?: string;
  locationLabel?: string;
  featured?: boolean;
};

type UploadState = {
  file: File | null;
  uploading: boolean;
  url: string;
  driveFileId?: string;
};

const emptyForm: MediaItem = {
  title: "",
  imageBeforeUrl: "",
  imageAfterUrl: "",
  beforeDriveFileId: "",
  afterDriveFileId: "",
  serviceType: "",
  locationLabel: "",
  featured: true,
};

const emptyUploadState: UploadState = {
  file: null,
  uploading: false,
  url: "",
  driveFileId: "",
};

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [form, setForm] = useState<MediaItem>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [beforeUpload, setBeforeUpload] = useState<UploadState>(emptyUploadState);
  const [afterUpload, setAfterUpload] = useState<UploadState>(emptyUploadState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const res = await fetch("/api/media");
    setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const uploadImage = async (kind: "before" | "after") => {
    const current = kind === "before" ? beforeUpload : afterUpload;
    if (!current.file) return;

    setError("");
    setSuccess("");
    const setState = kind === "before" ? setBeforeUpload : setAfterUpload;
    setState((prev) => ({ ...prev, uploading: true }));

    try {
      const data = new FormData();
      data.append("file", current.file);
      data.append("folderName", form.serviceType || "before-after");

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: data,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.details || payload.error || "Upload failed");
      }

      setState((prev) => ({
        ...prev,
        uploading: false,
        url: payload.url,
        driveFileId: payload.id,
      }));

      setForm((prev) => ({
        ...prev,
        ...(kind === "before"
          ? { imageBeforeUrl: payload.url, beforeDriveFileId: payload.id }
          : { imageAfterUrl: payload.url, afterDriveFileId: payload.id }),
      }));

      return { url: payload.url as string, driveFileId: payload.id as string };
    } catch (uploadError) {
      setState((prev) => ({ ...prev, uploading: false }));
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      return null;
    }
  };

  const onFileSelect = (kind: "before" | "after", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    const setState = kind === "before" ? setBeforeUpload : setAfterUpload;
    setState({
      file,
      uploading: false,
      url: "",
      driveFileId: "",
    });
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.title.trim()) {
        throw new Error("Please enter a title before saving the media item.");
      }

      let beforeValues = {
        imageBeforeUrl: form.imageBeforeUrl,
        beforeDriveFileId: form.beforeDriveFileId,
      };
      if (!form.imageBeforeUrl) {
        if (!beforeUpload.file) throw new Error("Please choose a before image.");
        const uploaded = await uploadImage("before");
        if (!uploaded) throw new Error("Before image upload failed.");
        beforeValues = {
          imageBeforeUrl: uploaded.url,
          beforeDriveFileId: uploaded.driveFileId,
        };
      }

      let afterValues = {
        imageAfterUrl: form.imageAfterUrl,
        afterDriveFileId: form.afterDriveFileId,
      };
      if (!form.imageAfterUrl) {
        if (!afterUpload.file) throw new Error("Please choose an after image.");
        const uploaded = await uploadImage("after");
        if (!uploaded) throw new Error("After image upload failed.");
        afterValues = {
          imageAfterUrl: uploaded.url,
          afterDriveFileId: uploaded.driveFileId,
        };
      }

      const mediaPayload = {
        ...form,
        title: form.title.trim(),
        ...beforeValues,
        ...afterValues,
      };

      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaPayload),
      });

      const responsePayload = await response.json();
      if (!response.ok) {
        throw new Error(responsePayload.error || "Unable to save media item.");
      }

      setForm(emptyForm);
      setBeforeUpload(emptyUploadState);
      setAfterUpload(emptyUploadState);
      await load();
      setSuccess("Media item added successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save media item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <p className="ui-kicker">Content</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
          Before / After Media
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Upload project images to Google Drive and showcase featured transformations.</p>
      </div>

      <div className="admin-media-layout">
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>
            Add New Item
          </h2>

          {error && (
            <div style={{ marginBottom: "16px", background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#991b1b" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: "16px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#065F46" }}>
              {success}
            </div>
          )}

          <div className="ui-form-group">
            <label className="ui-label">Title</label>
            <input className="ui-input" placeholder="e.g. Constantia Roof Clean" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="admin-media-form-grid">
            <div className="ui-form-group">
              <label className="ui-label">Service Type</label>
              <select className="ui-input" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                <option value="">Select...</option>
                <option value="roof">Roof</option>
                <option value="driveway">Driveway</option>
                <option value="walls">Walls</option>
                <option value="commercial">Commercial</option>
                <option value="windows">Windows</option>
                <option value="solar_panels">Solar Panels</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label className="ui-label">Location Label</label>
              <input className="ui-input" placeholder="e.g. Constantia" value={form.locationLabel} onChange={(e) => setForm({ ...form, locationLabel: e.target.value })} />
            </div>
          </div>

          {([
            { kind: "before" as const, label: "Before Image", state: beforeUpload },
            { kind: "after" as const, label: "After Image", state: afterUpload },
          ]).map(({ kind, label, state }) => (
            <div key={kind} className="ui-form-group">
              <label className="ui-label">{label}</label>
              <input className="ui-input" type="file" accept="image/*" onChange={(event) => onFileSelect(kind, event)} />
              <button
                type="button"
                className="ui-btn ui-btn-ghost"
                style={{ marginTop: "10px", width: "100%" }}
                onClick={() => uploadImage(kind)}
                disabled={!state.file || state.uploading || saving}
              >
                {state.uploading ? "Uploading..." : `Upload ${label}`}
              </button>
              {(state.url || (kind === "before" ? form.imageBeforeUrl : form.imageAfterUrl)) && (
                <img
                  src={state.url || (kind === "before" ? form.imageBeforeUrl : form.imageAfterUrl)}
                  alt={label}
                  style={{ marginTop: "12px", width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              )}
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
            />
            <label htmlFor="featured" style={{ fontSize: "13px", color: "var(--navy)", fontWeight: 500 }}>
              Feature on homepage
            </label>
          </div>

          <button
            className="ui-btn ui-btn-primary"
            style={{ width: "100%" }}
            onClick={submit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Add Media Item"}
          </button>
        </div>

        <div className="admin-media-list">
          {items.length === 0 && (
            <div className="ui-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              No media items yet. Add your first before/after pair.
            </div>
          )}
          {items.map((item) => (
            <div key={item._id} className="ui-card" style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <img src={item.imageBeforeUrl} alt="Before" style={{ height: "120px", width: "100%", objectFit: "cover" }} />
                <img src={item.imageAfterUrl} alt="After" style={{ height: "120px", width: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>{item.title}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {item.serviceType} {item.locationLabel ? `· ${item.locationLabel}` : ""}
                    {item.featured ? " · Featured" : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
