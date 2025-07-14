import React, { useState } from "react";

const UploadImage = () => {
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // GANTI ini nanti
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhhdozlh1/image/upload", // GANTI cloudName kamu
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImageURL(data.secure_url);
      console.log("Gambar berhasil diupload:", data.secure_url);
    } catch (err) {
      console.error("Gagal upload:", err);
      alert("Upload gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Gambar ke Cloudinary</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
      {imageURL && (
        <div>
          <p>Preview:</p>
          <img src={imageURL} alt="Uploaded" width="200" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
