import React, { useState, useEffect, useCallback } from "react";

type Address = {
  id: number;
  recipient: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
  type: string;
};

type Location = {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
};

type AddressInfo = {
  province: string;
  district: string;
  ward: string;
};

type AddressSelectorProps = {
  onSaveSelectedAddress: (
    coordinates: {
      longitude: string | undefined;
      latitude: string | undefined;
    },
    address: string
  ) => void;
  data: Address | null;
};

function LocationSelector({
  onSaveSelectedAddress,
  data,
}: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("0");
  const [selectedDistrict, setSelectedDistrict] = useState("0");
  const [selectedWard, setSelectedWard] = useState("0");

  const [address, setAddress] = useState<AddressInfo | null>({
    province: data?.city || "",
    district: data?.district || "",
    ward: data?.ward || "",
  });

  const saveSelectedAddressHandler = (
    selectedAddress: {
      longitude: string | undefined;
      latitude: string | undefined;
    },
    address: string
  ) => {
    onSaveSelectedAddress(selectedAddress, address);
  };

  useEffect(() => {
    // Lấy danh sách tỉnh thành
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedProvince !== "0") {
      // Lấy danh sách quận huyện
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setDistricts(data.data);
            setWards([]); // Reset danh sách phường/xã
          }
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict !== "0") {
      // Lấy danh sách phường xã
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 0) {
            setWards(data.data);
          }
        });
    }
  }, [selectedDistrict]);

  // Update the selected address
  useEffect(() => {
    const provinceName =
      provinces.find((p) => p.id === selectedProvince)?.full_name || "";
    const districtName =
      districts.find((d) => d.id === selectedDistrict)?.full_name || "";
    const wardName = wards.find((w) => w.id === selectedWard)?.full_name || "";

    if (provinceName || districtName || wardName) {
      setAddress({
        province: provinceName,
        district: districtName,
        ward: wardName,
      });
    }
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
  ]);

  const formatAddress = (address: AddressInfo) => {
    let str = "";

    if (address.ward) {
      str += address.ward;
    }

    if (address.district) {
      str += `, ${address.district}`;
    }

    if (address.province) {
      str += `, ${address.province}`;
    }
    return str;
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        {/* Tỉnh Thành */}
        <select
          className="text-sm block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          id="province"
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedDistrict("0"); // Reset district when province changes
            setSelectedWard("0"); // Reset ward when province changes
          }}
        >
          <option value="0">Tỉnh Thành</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.full_name}
            </option>
          ))}
        </select>

        {/* Quận Huyện */}
        <select
          className="text-sm block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          id="district"
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedWard("0"); // Reset ward when district changes
          }}
        >
          <option value="0">Quận Huyện</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.full_name}
            </option>
          ))}
        </select>

        {/* Phường Xã */}
        <select
          className="text-sm block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          id="ward"
          value={selectedWard}
          onChange={(e) => {
            setSelectedWard(e.target.value);
            if (address) {
              saveSelectedAddressHandler(
                {
                  longitude: wards.find((w) => w.id === e.target.value)
                    ?.longitude,
                  latitude: wards.find((w) => w.id === e.target.value)
                    ?.latitude,
                },
                formatAddress({
                  ...address,
                  ward:
                    wards.find((w) => w.id === e.target.value)?.full_name || "",
                })
              );
            }
          }}
        >
          <option value="0">Phường Xã</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.full_name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default LocationSelector;
