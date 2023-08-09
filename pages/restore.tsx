import { NextPage } from "next";
// import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import { CompareSlider } from "../components/CompareSlider";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Toggle from "../components/Toggle";
import appendNewToName from "../utils/appendNewToName";
import downloadPhoto from "../utils/downloadPhoto";
import NSFWPredictor from "../utils/nsfwCheck";
// import va from "@vercel/analytics";
import { useSession, signIn } from "next-auth/react";
import useSWR from "swr";
import { Rings } from "react-loader-spinner";

// Configuration for the uploader

const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR("/api/remaining", fetcher);
  const { data: session, status } = useSession();

  const options = {
    maxFileCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
    editor: { images: { crop: false } },
    styles: { colors: { primary: "#000" } },
    onValidate: async (file: File): Promise<undefined | string> => {
      let isSafe = false;
      try {
        isSafe = await NSFWPredictor.isSafeImg(file);
      //   if (!isSafe) va.track("NSFW Image blocked");
      // } catch (error) {
      //   console.error("NSFW predictor threw an error", error);
      // }
      if (!isSafe) {
        return "Detected a NSFW image which is not allowed.";
      }
      if (data.remainingGenerations === 0) {
        return "No more generations left for the day.";
      }
      return undefined;
    }
  };

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setPhotoName(file[0].originalFile.originalFileName);
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          generatePhoto(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      mutate();
      setRestoredImage(newPhoto);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl min-h-screen py-2 mx-auto">
      <Head>
        <title>Restore Photos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header photo={session?.user?.image || undefined} />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-4 mb-8 text-center sm:mb-0">
        <a
          href="https://twitter.com/nutlope/status/1626074563481051136"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-1 mb-5 text-sm transition duration-300 ease-in-out border rounded-2xl text-slate-500 hover:text-slate-600"
        >
          <span className="font-semibold">647,143 images</span> restored and
          counting
        </a>
        <h1 className="max-w-4xl mx-auto mb-5 text-4xl font-bold tracking-normal font-display text-slate-900 sm:text-6xl">
          Restore any face photo
        </h1>
        {status === "authenticated" && data && (
          <p className="text-slate-500">
            You have{" "}
            <span className="font-semibold">
              {data.remainingGenerations} generations
            </span>{" "}
            left today. Your generation
            {Number(data.remainingGenerations) > 1 ? "s" : ""} will renew in{" "}
            <span className="font-semibold">
              {data.hours} hours and {data.minutes} minutes.
            </span>
          </p>
        )}
        <div className="flex flex-col items-center justify-between w-full mt-4">
          <Toggle
            className={`${restoredLoaded ? "visible mb-6" : "invisible"}`}
            sideBySide={sideBySide}
            setSideBySide={(newVal) => setSideBySide(newVal)}
          />
          {restoredLoaded && sideBySide && (
            <CompareSlider
              original={originalPhoto!}
              restored={restoredImage!}
            />
          )}
          {status === "loading" ? (
            <div className="max-w-[670px] h-[250px] flex justify-center items-center">
              <Rings
                height="100"
                width="100"
                color="black"
                radius="6"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="rings-loading"
              />
            </div>
          ) : status === "authenticated" && !originalPhoto ? (
            <UploadDropZone />
          ) : (
            !originalPhoto && (
              <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
                <div className="max-w-xl text-gray-600">
                  Sign in below with Google to create a free account and restore
                  your photos today. You will be able to restore 5 photos per
                  day for free.
                </div>
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center px-6 py-3 space-x-2 font-semibold text-black bg-gray-200 rounded-2xl"
                >
                  <Image
                    src="/google.png"
                    width={20}
                    height={20}
                    alt="google's logo"
                  />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )
          )}
          {originalPhoto && !restoredImage && (
            <Image
              alt="original photo"
              src={originalPhoto}
              className="rounded-2xl"
              width={475}
              height={475}
            />
          )}
          {restoredImage && originalPhoto && !sideBySide && (
            <div className="flex flex-col sm:space-x-4 sm:flex-row">
              <div>
                <h2 className="mb-1 text-lg font-medium">Original Photo</h2>
                <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="relative rounded-2xl"
                  width={475}
                  height={475}
                />
              </div>
              <div className="mt-8 sm:mt-0">
                <h2 className="mb-1 text-lg font-medium">Restored Photo</h2>
                <a href={restoredImage} target="_blank" rel="noreferrer">
                  <Image
                    alt="restored photo"
                    src={restoredImage}
                    className="relative mt-2 rounded-2xl sm:mt-0 cursor-zoom-in"
                    width={475}
                    height={475}
                    onLoadingComplete={() => setRestoredLoaded(true)}
                  />
                </a>
              </div>
            </div>
          )}
          {loading && (
            <button
              disabled
              className="w-40 px-4 pt-2 pb-3 mt-8 font-medium text-white bg-black rounded-full hover:bg-black/80"
            >
              <span className="pt-4">
                <LoadingDots color="white" style="large" />
              </span>
            </button>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-[575px]"
              role="alert"
            >
              <div className="px-4 py-2 font-bold text-white bg-red-500 rounded-t">
                Please try again in 24 hours
              </div>
              <div className="px-4 py-3 text-red-700 bg-red-100 border border-t-0 border-red-400 rounded-b">
                {error}
              </div>
            </div>
          )}
          <div className="flex justify-center space-x-2">
            {originalPhoto && !loading && (
              <button
                onClick={() => {
                  setOriginalPhoto(null);
                  setRestoredImage(null);
                  setRestoredLoaded(false);
                  setError(null);
                }}
                className="px-4 py-2 mt-8 font-medium text-white transition bg-black rounded-full hover:bg-black/80"
              >
                Upload New Photo
              </button>
            )}
            {restoredLoaded && (
              <button
                onClick={() => {
                  downloadPhoto(restoredImage!, appendNewToName(photoName!));
                }}
                className="px-4 py-2 mt-8 font-medium text-black transition bg-white border rounded-full hover:bg-gray-100"
              >
                Download Restored Photo
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
function generatePhoto(arg0: string) {
  throw new Error("Function not implemented.");
}

