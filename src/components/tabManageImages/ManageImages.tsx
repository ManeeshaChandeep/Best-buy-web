import ImageUpload from "@/components/tabManageImages/UploadImages";

export default function ManageImages() {
    const handleImageUpload = (file: File) => {
        console.log("Uploading:", file);
    };

    return (
        <>
            <ImageUpload onImageUpload={handleImageUpload} />
        </>
    );
}
