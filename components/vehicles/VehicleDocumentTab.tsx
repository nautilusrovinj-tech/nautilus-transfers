"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getVehicleDocuments,
  createVehicleDocument,
  deleteVehicleDocument,
} from "@/services/vehicleDocuments";

import { VehicleDocument } from "@/types/vehicle-document";

interface Props {
  vehicleId: string;
}

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const emptyForm = {
  documentType: "",
  name: "",
  expiryDate: "",
  note: "",
};

export default function VehicleDocumentTab({
  vehicleId,
}: Props) {
  const [documents, setDocuments] =
    useState<VehicleDocument[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  // ==========================================
  // LOAD
  // ==========================================

  async function loadDocuments() {
    try {
      setLoading(true);

      const data =
        await getVehicleDocuments(
          vehicleId
        );

      setDocuments(data);
    } catch (error) {
      console.error(
        "LOAD VEHICLE DOCUMENTS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, [vehicleId]);

  // ==========================================
  // FORM UPDATE
  // ==========================================

  function update(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  // ==========================================
  // FILE SELECT
  // ==========================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      alert(
        "File is too large. Maximum size is 10 MB."
      );

      event.target.value = "";

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);

    // Automatically use filename
    // as document name if empty.

    if (!form.name.trim()) {
      const fileName =
        file.name.replace(
          /\.[^/.]+$/,
          ""
        );

      setForm(
        (current) => ({
          ...current,
          name: fileName,
        })
      );
    }
  }

  // ==========================================
  // SAVE
  // ==========================================

  async function handleSave() {
    if (!form.documentType) {
      alert(
        "Document type is required."
      );

      return;
    }

    if (!form.name.trim()) {
      alert(
        "Document name is required."
      );

      return;
    }

    if (!selectedFile) {
      alert(
        "Please select a file."
      );

      return;
    }

    try {
      setSaving(true);

      await createVehicleDocument({
        vehicleId,

        documentType:
          form.documentType,

        name:
          form.name.trim(),

        expiryDate:
          form.expiryDate ||
          null,

        note:
          form.note.trim(),

        file:
          selectedFile,
      });

      // Reset form

      setForm({
        ...emptyForm,
      });

      setSelectedFile(
        null
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

      await loadDocuments();

    } catch (error) {
      console.error(
        "SAVE VEHICLE DOCUMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // DELETE
  // ==========================================

  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Delete this document?"
      )
    ) {
      return;
    }

    try {
      await deleteVehicleDocument(
        id
      );

      await loadDocuments();
    } catch (error) {
      console.error(
        "DELETE VEHICLE DOCUMENT ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete document."
      );
    }
  }

  // ==========================================
  // EXPIRY
  // ==========================================

  function isExpired(
    expiryDate: string | null
  ) {
    if (!expiryDate) {
      return false;
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    return (
      expiryDate <
      today
    );
  }

  function isExpiringSoon(
    expiryDate: string | null
  ) {
    if (!expiryDate) {
      return false;
    }

    const today =
      new Date();

    const expiry =
      new Date(
        expiryDate
      );

    const difference =
      expiry.getTime() -
      today.getTime();

    const days =
      difference /
      (1000 * 60 * 60 * 24);

    return (
      days >= 0 &&
      days <= 30
    );
  }

  const expiredCount =
    useMemo(
      () =>
        documents.filter(
          (document) =>
            isExpired(
              document.expiryDate
            )
        ).length,
      [documents]
    );

  const expiringSoonCount =
    useMemo(
      () =>
        documents.filter(
          (document) =>
            isExpiringSoon(
              document.expiryDate
            )
        ).length,
      [documents]
    );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* ADD DOCUMENT */}
      {/* ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Upload Document
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload registration,
            insurance, inspection or
            other vehicle documents.
          </p>

        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">

          {/* TYPE */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Document Type
            </label>

            <select
              value={
                form.documentType
              }
              onChange={(e) =>
                update(
                  "documentType",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3"
            >

              <option value="">
                Select document
              </option>

              <option value="Registration">
                Registration
              </option>

              <option value="Insurance">
                Insurance
              </option>

              <option value="Technical Inspection">
                Technical Inspection
              </option>

              <option value="Leasing">
                Leasing
              </option>

              <option value="License">
                License
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* NAME */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Document Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                update(
                  "name",
                  e.target.value
                )
              }
              placeholder="e.g. Insurance 2026"
              className="w-full rounded-lg border border-slate-300 p-3"
            />

          </div>

          {/* EXPIRY */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Expiry Date
            </label>

            <input
              type="date"
              value={
                form.expiryDate
              }
              onChange={(e) =>
                update(
                  "expiryDate",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />

          </div>

          {/* FILE */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Document File
            </label>

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              onChange={
                handleFileChange
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
            />

            <p className="mt-1 text-xs text-slate-500">
              PDF, JPG, PNG, WEBP, DOC or DOCX.
              Maximum 10 MB.
            </p>

          </div>

          {/* NOTE */}

          <div className="md:col-span-2">

            <label className="mb-1 block text-sm font-medium">
              Note
            </label>

            <textarea
              rows={3}
              value={form.note}
              onChange={(e) =>
                update(
                  "note",
                  e.target.value
                )
              }
              placeholder="Additional information..."
              className="w-full rounded-lg border border-slate-300 p-3"
            />

          </div>

        </div>

        {/* SELECTED FILE */}

        {selectedFile && (
          <div className="mx-6 mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-sm font-medium text-slate-900">
              Selected file
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {(
                selectedFile.size /
                1024 /
                1024
              ).toFixed(2)}{" "}
              MB
            </p>

          </div>
        )}

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              saving
            }
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </div>

      </div>

      {/* ====================================== */}
      {/* SUMMARY */}
      {/* ====================================== */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Documents
          </p>

          <p className="mt-2 text-2xl font-bold">
            {documents.length}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Expiring Soon
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {expiringSoonCount}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Expired
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {expiredCount}
          </p>

        </div>

      </div>

      {/* ====================================== */}
      {/* DOCUMENT HISTORY */}
      {/* ====================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Document History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Uploaded vehicle documents.
          </p>

        </div>

        {loading ? (

          <div className="p-8 text-center text-slate-500">
            Loading documents...
          </div>

        ) : documents.length ===
          0 ? (

          <div className="p-8 text-center text-slate-500">
            No documents uploaded yet.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Expiry
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Note
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {documents.map(
                  (document) => {

                    const expired =
                      isExpired(
                        document.expiryDate
                      );

                    const expiringSoon =
                      isExpiringSoon(
                        document.expiryDate
                      );

                    return (
                      <tr
                        key={
                          document.id
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4">
                          {
                            document.documentType
                          }
                        </td>

                        <td className="px-6 py-4">

                          {document.signedUrl ? (

                            <a
                              href={
                                document.signedUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-700"
                            >
                              {
                                document.name
                              }
                            </a>

                          ) : (

                            <span className="font-medium">
                              {
                                document.name
                              }
                            </span>

                          )}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          {document.expiryDate ||
                            "-"}

                        </td>

                        <td className="px-6 py-4">

                          {document.expiryDate ? (

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                expired
                                  ? "bg-red-100 text-red-700"
                                  : expiringSoon
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {expired
                                ? "Expired"
                                : expiringSoon
                                ? "Expiring soon"
                                : "Valid"}
                            </span>

                          ) : (

                            <span className="text-sm text-slate-400">
                              No expiry
                            </span>

                          )}

                        </td>

                        <td className="max-w-xs px-6 py-4 text-sm text-slate-600">
                          {
                            document.note ||
                            "-"
                          }
                        </td>

                        <td className="px-6 py-4 text-right">

                          <div className="flex justify-end gap-2">

                            {document.signedUrl && (
                              <a
                                href={
                                  document.signedUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Open
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  document.id
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}