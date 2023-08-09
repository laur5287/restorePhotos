import { NextPage } from "next";
// import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";
import { Testimonials } from "../components/Testimonials";

const Home: NextPage = () => {
  let message : string = 'hello'
  
  return (
    <div id="wrapper" className="flex flex-col items-center justify-center max-w-6xl min-h-screen py-2 mx-auto">
      {/* <Head>
        <title>Face Photo Restorer</title>
      </Head> */}
      {/* <Header /> */}
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-20 text-center sm:mt-28">
        <a
          href="https://twitter.com/nutlope/status/1626074563481051136"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-1 mb-5 text-sm transition duration-300 ease-in-out border rounded-2xl text-slate-500 hover:scale-105"
        >
          Used by over <span className="font-semibold">300,000</span> happy
          users
        </a>
        <h1 className="max-w-4xl mx-auto text-5xl font-bold tracking-normal font-display text-slate-900 sm:text-7xl">
          Restoring old photos{" "}
          <span className="relative whitespace-nowrap text-[#3290EE]">
            <SquigglyLines />
            <span className="relative">using AI</span>
          </span>{" "}
          for everyone.
        </h1>

        <p className="max-w-xl mx-auto mt-12 text-lg leading-7 text-slate-700">
          Have old and blurry face photos? Let our AI restore them so those
          memories can live on. 100% free – restore your photos today.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            className="px-4 py-3 mt-8 font-medium text-black bg-white border rounded-xl sm:mt-10 hover:bg-gray-100"
            href="https://youtu.be/FRQtFDDrUXQ"
            target="_blank"
            rel="noreferrer"
          >
            Learn how it's built
          </a>

          <Link
            className="px-4 py-3 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
            href="/restore"
          >
            Restore your photos
          </Link>
        </div>
        <div className="flex flex-col items-center justify-between w-full mt-6 sm:mt-10">
          <div className="flex flex-col mt-4 mb-16 space-y-10">
            <div className="flex flex-col sm:space-x-2 sm:flex-row">
              <div>
                <h2 className="mb-1 text-lg font-medium">Original Photo</h2>
                <Image
                  alt="Original photo of my bro"
                  src="/michael.jpg"
                  className="w-96 h-96 rounded-2xl"
                  width={400}
                  height={400}
                />
              </div>
              <div className="mt-8 sm:mt-0">
                <h2 className="mb-1 text-lg font-medium">Restored Photo</h2>
                <Image
                  alt="Restored photo of my bro"
                  width={400}
                  height={400}
                  src="/michael-new.jpg"
                  className="mt-2 w-96 h-96 rounded-2xl sm:mt-0"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
