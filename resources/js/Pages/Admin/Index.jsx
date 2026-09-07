import Layout from "@/components/Admin/Layout";
import NumericInput from "@/components/form/NumericInput";
import { useState } from "react";
import ActionMenu from "@/components/ActionMenu";
import ImageUploader from "@/components/form/ImageUploader";
import SearchableSelect from "../../components/form/SearchableSelect";
import AlertComponent from "../../components/AlertComponent";

export default function Index() {
    const [jumlah, setJumlah] = useState("");
    const [image, setImage] = useState("");
    const [aparat, setAparat] = useState("");

    const aparatOptions = [
        {
            id: 1,
            label: "Budi Santoso",
            sub: "Kepala Desa",
        },
        {
            id: 2,
            label: "Andi Wijaya",
            sub: "Sekretaris Desa",
        },
        {
            id: 3,
            label: "Siti Aminah",
            sub: "Bendahara",
        },
    ];

    const [alert, setAlert] = useState(null);

    const showSuccess = () => {
        setAlert({
            message: "Data berhasil disimpan.",
            type: "success",
        });
    };

    const showError = () => {
        setAlert({
            message: "Data gagal disimpan.",
            type: "error",
        });
    };

    return (
        <Layout>
            <NumericInput
                label="Jumlah Penduduk"
                name="jumlah"
                value={jumlah}
                onChange={setJumlah}
                placeholder="Masukkan jumlah"
                prefix="Rp."
                suffix=".com"
                required
            />

            <ActionMenu />
            <ImageUploader
                value={image}
                onChange={setImage}
                onError={(message) => console.log(message)}
            />
            <SearchableSelect
                options={aparatOptions}
                value={aparat}
                onChange={setAparat}
                placeholder="Cari aparat..."
            />

            <div>
                <button onClick={showSuccess}>Success</button>

                <button onClick={showError}>Error</button>

                {alert && (
                    <AlertComponent
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}
            </div>
        </Layout>
    );
}
