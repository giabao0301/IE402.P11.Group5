import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import NewPropertyMap from "../components/NewPropertyMap";
import CloudinaryImageUpload from "../components/CloudinaryImageUpload";
import LocationSelector from "../components/LocationSelector";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
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

  console.log(formData);

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
      const res = await fetch("/api/listing/create", {
        method: "POST",
        credentials: "include",
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
      console.log(error);

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
      imageUrls,
    }));
  };

  const saveSelectedAddressHandler = (coordinates, address) => {
    setCoordinates(coordinates);
    setFormData((prevState) => ({
      ...prevState,
      address: address,
    }));
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Tạo bài đăng mới
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Tên bất động sản"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="100"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <LocationSelector
            onSaveSelectedAddress={saveSelectedAddressHandler}
          />
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
              <span>Có bãi đậu xe</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Trang bị nội thất</span>
            </div>
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
            onSaveUploadedImages={saveUploadedImagesHandler}
          />
          <NewPropertyMap
            coordinates={coordinates}
            onSaveSelectedLocation={saveSelectedLocationHandler}
          />
          <button
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Đang tạo bài đăng..." : "Tạo bài đăng"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
