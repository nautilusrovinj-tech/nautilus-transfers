"use client";

import { useEffect, useState } from "react";

import { DriverDocument } from "@/types/driver-document";

import {
  createDriverDocument,
  deleteDriverDocument,
  getDriverDocumentUrl,
  getDriverDocuments,
  uploadDriverDocumentFile,
} from "@/services/driverDocuments";

interface Props {
  driverId: string;
}

function getExpiryStatus(
  expiryDate: string | null
) {
  if (!expiryDate) {
    return {
      label: "No expiry date",
      className:
        "bg-slate-100 text-slate-600",
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiry = new Date(
    `${expiryDate}T00:00:00`
  );

  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() -
    today.getTime();

  const daysRemaining =
    Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

  if (daysRemaining < 0) {
    return {
      label: "Expired",
      className:
        "bg-red-100 text-red-700",
    };
  }

  if (daysRemaining <= 30) {
    return {
      label:
        daysRemaining === 0
          ? "Expires today"
          : `Expires in ${daysRemaining} day${
              daysRemaining === 1
                ? ""
                : "s"
            }`,
      className:
        "bg-orange-100 text-orange-700",
    };
  }

  return {
    label: "Valid",
    className:
      "bg-green-100 text-green-700",
  };
}

function formatDate(
  date: string | null
) {
  if (!date) {
    return "No expiry date";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-GB"
  );
}

export default function DriverDocumentTab({
  driverId,
}: Props) {
  const [documents, setDocuments] =
    useState<DriverDocument[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [documentType, setDocumentType] =
    useState("Driving Licence");

  const [name, setName] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [note, setNote] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  async function loadDocuments() {
    try {
      setLoading(true);

      const data =
        await getDriverDocuments(
          driverId
        );

      setDocuments(data);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load driver documents."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, [driverId]);

  function resetForm() {
    setDocumentType(
      "Driving Licence"
    );

    setName("");

    setExpiryDate("");

    setNote("");

    setFile(null);

    const input =
      document.getElementById(
        "driver-document-file"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  async function handleUpload() {
    if (uploading) return;

    if (!file) {
      alert(
        "Please select a PDF or image."
      );

      return;
    }

    if (!name.trim()) {
      alert(
        "Please enter the document name."
      );

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Only PDF, JPG, PNG or WEBP files are allowed."
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "The maximum file size is 10 MB."
      );

      return;
    }

    try {
      setUploading(true);

      const filePath =
        await uploadDriverDocumentFile(
          driverId,
          file
        );

      await createDriverDocument({
        driverId,

        documentType,

        name: name.trim(),

        expiryDate:
          expiryDate || null,

        filePath,

        note: note.trim(),
      });

      resetForm();

      await loadDocuments();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleOpen(
    document: DriverDocument
  ) {
    try {
      const url =
        await getDriverDocumentUrl(
          document.filePath
        );

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to open document."
      );
    }
  }

  async function handleDelete(
    document: DriverDocument
  ) {
    if (uploading) return;

    const confirmed =
      window.confirm(
        `Delete "${document.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setUploading(true);

      await deleteDriverDocument(
        document
      );

      await loadDocuments();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete document."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Upload */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-slate-900">
            Driver Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload driving licences,
            certificates and other
            driver documents.
          </p>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Type */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-slate-700">
              Document Type
            </label>

            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>
                Driving Licence
              </option>

              <option>
                Other Licence
              </option>

              <option>
                Certificate
              </option>

              <option>
                Other
              </option>
            </select>

          </div>

          {/* Name */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-slate-700">
              Document Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="e.g. Driving Licence"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

          {/* Expiry */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-slate-700">
              Expiry Date
            </label>

            <input
              type="date"
              value={expiryDate}
              onChange={(e) =>
                setExpiryDate(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

          {/* File */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-slate-700">
              Document File
            </label>

            <input
              id="driver-document-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ??
                    null
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />

            <p className="text-xs text-slate-500">
              PDF, JPG, PNG or WEBP. Maximum 10 MB.
            </p>

          </div>

        </div>

        {/* Note */}

        <div className="mt-4 space-y-2">

          <label className="text-sm font-medium text-slate-700">
            Note
          </label>

          <textarea
            rows={3}
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
            placeholder="Optional note..."
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

        </div>

        {/* Upload button */}

        <div className="mt-5 flex justify-end">

          <button
            type="button"
            disabled={uploading}
            onClick={
              handleUpload
            }
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </div>

      </div>

      {/* Documents */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h3 className="text-lg font-bold text-slate-900">
            Documents
          </h3>

        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">

            {documents.map(
              (document) => {
                const expiry =
                  getExpiryStatus(
                    document.expiryDate
                  );

                return (
                  <div
                    key={document.id}
                    className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h4 className="font-semibold text-slate-900">
                          {document.name}
                        </h4>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {document.documentType}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expiry.className}`}
                        >
                          {expiry.label}
                        </span>

                      </div>

                      <div className="mt-2 text-sm text-slate-500">

                        Expiry:{" "}

                        <span className="font-medium text-slate-700">
                          {formatDate(
                            document.expiryDate
                          )}
                        </span>

                      </div>

                      {document.note && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">
                          {document.note}
                        </p>
                      )}

                    </div>

                    <div className="flex shrink-0 gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleOpen(
                            document
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Open
                      </button>

                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() =>
                          handleDelete(
                            document
                          )
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}