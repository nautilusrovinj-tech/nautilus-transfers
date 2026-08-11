import { createClient } from "@/lib/supabase/client";
import { VehicleDocument } from "@/types/vehicle-document";

const BUCKET_NAME = "vehicle-documents";

function mapDocument(
  row: any,
  signedUrl?: string
): VehicleDocument {
  return {
    id: row.id,

    vehicleId:
      row.vehicle_id,

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

    ...(signedUrl
      ? { signedUrl }
      : {}),
  };
}


// ==========================================
// GET VEHICLE DOCUMENTS
// ==========================================

export async function getVehicleDocuments(
  vehicleId: string
): Promise<VehicleDocument[]> {
  const supabase = createClient();

  const {
    data,
    error,
  } = await supabase
    .from("vehicle_documents")
    .select("*")
    .eq(
      "vehicle_id",
      vehicleId
    )
    .order("expiry_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "GET VEHICLE DOCUMENTS ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  if (!data) {
    return [];
  }

  const documents =
    await Promise.all(
      data.map(
        async (row) => {
          if (!row.file_path) {
            return mapDocument(row);
          }

          const {
            data: signedData,
            error: signedError,
          } =
            await supabase.storage
              .from(
                BUCKET_NAME
              )
              .createSignedUrl(
                row.file_path,
                60 * 60
              );

          if (signedError) {
            console.error(
              "SIGNED URL ERROR:",
              signedError
            );

            return mapDocument(
              row
            );
          }

          return mapDocument(
            row,
            signedData?.signedUrl
          );
        }
      )
    );

  return documents;
}


// ==========================================
// UPLOAD + CREATE DOCUMENT
// ==========================================

export async function createVehicleDocument(
  document: Partial<VehicleDocument> & {
    file?: File | null;
  }
) {
  const supabase = createClient();

  let filePath =
    document.filePath || "";

  // ----------------------------------------
  // Upload actual file
  // ----------------------------------------

  if (document.file) {
    const file =
      document.file;

    const extension =
      file.name.includes(".")
        ? file.name
            .split(".")
            .pop()
            ?.toLowerCase()
        : "file";

    const uniqueFileName =
      `${crypto.randomUUID()}.${extension}`;

    filePath =
      `${document.vehicleId}/${uniqueFileName}`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          BUCKET_NAME
        )
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
            contentType:
              file.type ||
              "application/octet-stream",
          }
        );

    if (uploadError) {
      console.error(
        "UPLOAD VEHICLE DOCUMENT ERROR:",
        uploadError
      );

      throw new Error(
        uploadError.message
      );
    }
  }

  // ----------------------------------------
  // Save database record
  // ----------------------------------------

  const payload = {
    vehicle_id:
      document.vehicleId,

    document_type:
      document.documentType,

    name:
      document.name,

    expiry_date:
      document.expiryDate ||
      null,

    file_path:
      filePath,

    note:
      document.note || "",
  };

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "vehicle_documents"
      )
      .insert(payload)
      .select()
      .single();

  if (error) {
    console.error(
      "CREATE VEHICLE DOCUMENT ERROR:",
      error
    );

    // Remove uploaded file if
    // database insert failed.

    if (
      document.file &&
      filePath
    ) {
      await supabase.storage
        .from(
          BUCKET_NAME
        )
        .remove([
          filePath,
        ]);
    }

    throw new Error(
      error.message
    );
  }

  let signedUrl:
    | string
    | undefined;

  if (filePath) {
    const {
      data:
        signedData,
    } =
      await supabase.storage
        .from(
          BUCKET_NAME
        )
        .createSignedUrl(
          filePath,
          60 * 60
        );

    signedUrl =
      signedData?.signedUrl;
  }

  return mapDocument(
    data,
    signedUrl
  );
}


// ==========================================
// UPDATE DOCUMENT
// ==========================================

export async function updateVehicleDocument(
  id: string,
  document: Partial<VehicleDocument>
) {
  const supabase = createClient();

  const payload = {
    document_type:
      document.documentType,

    name:
      document.name,

    expiry_date:
      document.expiryDate ||
      null,

    file_path:
      document.filePath ||
      "",

    note:
      document.note || "",
  };

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "vehicle_documents"
      )
      .update(payload)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    console.error(
      "UPDATE VEHICLE DOCUMENT ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return mapDocument(data);
}


// ==========================================
// DELETE DOCUMENT
// ==========================================

export async function deleteVehicleDocument(
  id: string
) {
  const supabase = createClient();

  // First get the document
  // so we know the storage path.

  const {
    data: document,
    error:
      fetchError,
  } =
    await supabase
      .from(
        "vehicle_documents"
      )
      .select(
        "file_path"
      )
      .eq("id", id)
      .single();

  if (fetchError) {
    throw new Error(
      fetchError.message
    );
  }

  // Delete physical file.

  if (
    document?.file_path
  ) {
    const {
      error:
        storageError,
    } =
      await supabase.storage
        .from(
          BUCKET_NAME
        )
        .remove([
          document.file_path,
        ]);

    if (storageError) {
      console.error(
        "DELETE STORAGE FILE ERROR:",
        storageError
      );
    }
  }

  // Delete database record.

  const {
    error,
  } =
    await supabase
      .from(
        "vehicle_documents"
      )
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE VEHICLE DOCUMENT ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }
}