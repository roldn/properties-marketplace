import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

type Props = {};

export default function Profile({}: Props) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  console.log(currentUser);
  const fileRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(formData);
  console.log(filePerc);
  console.log(fileUploadError);

  useEffect(() => {
    if (file) {
      setFileUploadError(false);
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    try {
      const storage = getStorage(app);
      const fileName = `${currentUser?.id}/images/${new Date().getTime() + file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
          console.error("Upload Error", error);
        },
        () => {
          setFileUploadError(false);
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setFormData({ ...formData, avatar: downloadURL }),
          );
          console.log("Upload complete!");
        },
      );
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          //@ts-ignore
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error image upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              ¡Image successfully uploaded!
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
