import React, { useState } from "react";

interface CloudinaryImageProps {
  onSaveUploadedImages: (images: string[]) => void;
  showUploadedImages?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  hidden?: boolean;
}

const CloudinaryImageUpload: React.FC<CloudinaryImageProps> = ({
  onSaveUploadedImages,
  showUploadedImages = true,
  ref,
  hidden,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; publicId: string; deleting: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLOUD_NAME = "dmridctuc"; // Replace with your Cloudinary cloud name
  const UPLOAD_PRESET = "my_preset"; // Replace with your upload preset

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const saveUploadedImagesHandler = (imageUrls: string[]) => {
    onSaveUploadedImages(imageUrls);
  };

  const uploadImages = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    const uploadPromises = images.map((image) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", UPLOAD_PRESET);

      return fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${image.name}`);
        }
        return response.json();
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      const uploaded = results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        deleting: false, // Initialize deleting state
      }));
      setUploadedImages((prev) => [...prev, ...uploaded]);
      saveUploadedImagesHandler(uploaded.map((image) => image.url));
      setImages([]); // Clear file input after upload
    } catch (err) {
      console.error("Error uploading images:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (publicId: string) => {
    setUploadedImages((prev) =>
      prev.map((image) =>
        image.publicId === publicId ? { ...image, deleting: true } : image
      )
    );

    try {
      const response = await fetch(
        "https://ie402-p11-group5.onrender.com//delete-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId }),
        }
      );

      if (response.ok) {
        setUploadedImages((prev) =>
          prev.filter((image) => image.publicId !== publicId)
        );
      } else {
        const errorData = await response.json();
        console.error("Failed to delete image:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setUploadedImages((prev) =>
        prev.map((image) =>
          image.publicId === publicId ? { ...image, deleting: false } : image
        )
      );
    }
  };

  return (
    <div>
      <input
        ref={ref}
        hidden={hidden}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      {hidden ? null : (
        <button
          className="bg-green-400 text-white px-4 py-2 rounded mt-4 cursor-pointer hover:opacity-70"
          onClick={uploadImages}
          disabled={loading || images.length === 0}
        >
          {loading ? "Đang tải ảnh lên..." : "Tải ảnh lên"}
        </button>
      )}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {showUploadedImages && (
        <>
          {uploadedImages.length > 0 && (
            <div className="my-2">Ảnh vừa được tải lên:</div>
          )}
          <div className="grid grid-cols-4 mt-4 border-b-2 pb-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="flex items-center space-x-4 mt-2">
                <img
                  src={image.url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  onClick={() => deleteImage(image.publicId)}
                  style={{
                    borderRadius: "5px",
                    backgroundColor: image.deleting ? "gray" : "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: image.deleting ? "not-allowed" : "pointer",
                  }}
                  disabled={image.deleting}
                >
                  {image.deleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CloudinaryImageUpload;
