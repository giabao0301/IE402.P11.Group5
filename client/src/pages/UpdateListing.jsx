import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import CloudinaryImageUpload from "../components/CloudinaryImageUpload";
import NewPropertyMap from "../components/NewPropertyMap";
import LocationSelector from "../components/LocationSelector";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    address: "",
    type: "rent",
    area: "",
    bedrooms: 1,
    bathrooms: 1,
    price: "",
    longitude: 0,
    latitude: 0,
    parking: false,
    furnished: false,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [province, setProvince] = useState("Hồ Chí Minh");

  console.log(formData);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setDescription(data.description);
      setCoordinates({
        longitude: data.longitude,
        latitude: data.latitude,
      });
    };

    fetchListing();
  }, [params.listingId]);

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          description: description,
          longitude: coordinates.longitude,
          latitude: coordinates.latitude,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const saveSelectedLocationHandler = (longitude, latitude) => {
    setFormData((prevState) => ({
      ...prevState,
      longitude,
      latitude,
    }));
  };

  const saveUploadedImagesHandler = (imageUrls) => {
    setFormData((prevState) => ({
      ...prevState,
      imageUrls: [...prevState.imageUrls, ...imageUrls],
    }));
  };

  const extractPublicId = (url) => {
    try {
      const regex = /\/upload\/(?:v\d+\/)?(.+?)(\.\w+)?$/;
      const match = url.match(regex);

      if (match && match[1]) {
        return match[1];
      }

      return "";
    } catch (error) {
      console.error("Failed to extract public ID:", error);
      return "";
    }
  };

  const deleteImage = async (imageUrl) => {
    const publicId = extractPublicId(imageUrl);

    try {
      const response = await fetch(
        "https://ie402-p11-group5.onrender.com/delete-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId }),
        }
      );

      if (response.ok) {
        setFormData((prevState) => ({
          ...prevState,
          imageUrls: prevState.imageUrls.filter((url) => url !== imageUrl),
        }));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete image:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const saveSelectedAddressHandler = (
    coordinates,
    address,
    district,
    ward,
    province
  ) => {
    setCoordinates(coordinates);
    setDistrict(district);
    setWard(ward);
    setProvince(province);
    setFormData((prevState) => ({
      ...prevState,
      address: address,
    }));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Cập nhật bài đăng
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tên bất động sản"
          className="border p-3 rounded-lg"
          id="name"
          maxLength="62"
          minLength="10"
          required
          onChange={handleChange}
          value={formData.name}
        />
        <LocationSelector onSaveSelectedAddress={saveSelectedAddressHandler} />
        <input
          type="text"
          placeholder="Địa chỉ"
          className="border p-3 rounded-lg"
          id="address"
          required
          onChange={handleChange}
          value={formData.address}
        />
        <div className="">
          <ReactQuill
            className="mb-12 h-52"
            placeholder="Thông tin mô tả"
            id="description"
            theme="snow"
            value={description}
            onChange={(value) => setDescription(value)}
          />
        </div>
        <div className="flex gap-6 flex-wrap">
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="sale"
              className="w-5"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <span>Bán</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="rent"
              className="w-5"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <span>Cho thuê</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="parking"
              className="w-5"
              onChange={handleChange}
              checked={formData.parking}
            />
            <span>Bãi đỗ xe</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="furnished"
              className="w-5"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span>Có nội thất</span>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <label htmlFor="bedrooms">Phòng ngủ</label>
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="bathrooms">Phòng tắm</label>
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="area">Diện tích</label>
                <input
                  type="number"
                  id="area"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.area}
                />
                <p>
                  m<sup>2</sup>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="price">Giá</label>
              <input
                type="text"
                id="price"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.price}
              />
              <div className="flex flex-col items-center">
                {formData.type === "rent" && (
                  <span className="text-sm">(/ tháng)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <CloudinaryImageUpload
            showUploadedImages={false}
            onSaveUploadedImages={saveUploadedImagesHandler}
          />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {formData.imageUrls.map((image, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => deleteImage(image)}
                  style={{
                    backgroundColor: image.deleting ? "gray" : "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: image.deleting ? "not-allowed" : "pointer",
                    borderRadius: "5px",
                  }}
                  // disabled={image.deleting}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <NewPropertyMap
            title={formData.name}
            description={formData.address}
            district={district}
            ward={ward}
            province={province}
            coordinates={coordinates}
            longitude={formData.longitude}
            latitude={formData.latitude}
            onSaveSelectedLocation={saveSelectedLocationHandler}
          />
          <button
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
