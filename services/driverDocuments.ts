import { createClient } from "@/lib/supabase/client";
import { DriverDocument } from "@/types/driver-document";

const supabase = createClient();

const BUCKET = "driver-documents";

function mapDriverDocument(
  row: any
): DriverDocument {
  return {
    id: row.id,

    driverId:
      row.driver_id,

    documentType:
      row.document_type ?? "",

    name:
      row.name ?? "",

    expiryDate:
      row.expiry_date ?? null,

    filePath:
      row.file_path ?? "",

    note:
      row.note ?? "",

    createdAt:
      row.created_at,
  };
}

/*
|--------------------------------------------------------------------------
| GET DRIVER DOCUMENTS
|--------------------------------------------------------------------------
*/

export async function getDriverDocuments(
  driverId: string
): Promise<DriverDocument[]> {
  const { data, error } =
    await supabase
      .from("driver_documents")
      .select("*")
      .eq("driver_id", driverId)
      .order("expiry_date", {
        ascending: true,
        nullsFirst: false,
      });

  if (error) {
    console.error(
      "GET DRIVER DOCUMENTS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []).map(
    mapDriverDocument
  );
}

/*
|--------------------------------------------------------------------------
| UPLOAD FILE
|--------------------------------------------------------------------------
*/

export async function uploadDriverDocumentFile(
  driverId: string,
  file: File
): Promise<string> {
  const extension =
    file.name.split(".").pop()?.toLowerCase() ??
    "file";

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const filePath =
    `${driverId}/${fileName}`;

  const { error } =
    await supabase.storage
      .from(BUCKET)
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            file.type,
        }
      );

  if (error) {
    console.error(
      "UPLOAD DRIVER DOCUMENT ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return filePath;
}

/*
|--------------------------------------------------------------------------
| CREATE DOCUMENT
|--------------------------------------------------------------------------
*/

export async function createDriverDocument(
  document: {
    driverId: string;
    documentType: string;
    name: string;
    expiryDate: string | null;
    filePath: string;
    note?: string;
  }
): Promise<DriverDocument> {
  const payload = {
    driver_id:
      document.driverId,

    document_type:
      document.documentType,

    name:
      document.name,

    expiry_date:
      document.expiryDate || null,

    file_path:
      document.filePath,

    note:
      document.note ?? "",
  };

  const { data, error } =
    await supabase
      .from("driver_documents")
      .insert(payload)
      .select()
      .single();

  if (error) {
    console.error(
      "CREATE DRIVER DOCUMENT ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return mapDriverDocument(data);
}

/*
|--------------------------------------------------------------------------
| DELETE DOCUMENT
|--------------------------------------------------------------------------
*/

export async function deleteDriverDocument(
  document: DriverDocument
): Promise<void> {
  /*
   * Delete database record
   */

  const { error } =
    await supabase
      .from("driver_documents")
      .delete()
      .eq("id", document.id);

  if (error) {
    console.error(
      "DELETE DRIVER DOCUMENT ERROR:",
      error
    );

    throw new Error(error.message);
  }

  /*
   * Delete file from Storage
   */

  if (document.filePath) {
    const { error: storageError } =
      await supabase.storage
        .from(BUCKET)
        .remove([
          document.filePath,
        ]);

    if (storageError) {
      console.error(
        "DELETE DRIVER DOCUMENT FILE ERROR:",
        storageError
      );
    }
  }
}

/*
|--------------------------------------------------------------------------
| OPEN DOCUMENT
|--------------------------------------------------------------------------
*/

export async function getDriverDocumentUrl(
  filePath: string
): Promise<string> {
  const { data, error } =
    await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        filePath,
        60 * 60
      );

  if (error) {
    console.error(
      "CREATE DRIVER DOCUMENT URL ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data.signedUrl;
}